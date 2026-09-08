/**
 * ============================================================
 * AIO PAY - Service d'authentification
 * ============================================================
 *
 * Rôle :
 * - Générer et stocker temporairement les codes OTP
 * - Vérifier les codes OTP
 * - Créer ou récupérer l'utilisateur
 * - Générer les tokens JWT (access + refresh)
 *
 * Stockage des OTP :
 * Pour le MVP on utilise une Map en mémoire.
 * En production on remplacera par Redis (comme prévu dans la roadmap).
 *
 * Sécurité :
 * - OTP expire après 5 minutes
 * - Maximum 5 tentatives de vérification
 * - OTP à 6 chiffres purement numérique
 * ============================================================
 */

import { Injectable, UnauthorizedException, BadRequestException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { NotificationsService } from "../notifications/notifications.service";
import { v4 as uuidv4 } from "uuid";

/** Structure d'un OTP stocké en mémoire */
interface OtpEntry {
  code: string;           // Code à 6 chiffres
  expiresAt: number;      // Timestamp d'expiration
  attempts: number;       // Nombre de tentatives déjà faites
}

@Injectable()
export class AuthService {
  /**
   * Stockage temporaire des OTP
   * Clé = numéro de téléphone normalisé
   * Valeur = { code, expiresAt, attempts }
   *
   * Note : en production → remplacer par Redis
   */
  private otpStore = new Map<string, OtpEntry>();

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly notificationsService: NotificationsService
  ) {}

  /**
   * Génère un code OTP à 6 chiffres
   * Résultat : chaîne de type "483921"
   */
  private generateOtpCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Normalise un numéro de téléphone congolais
   * Accepte : 0812345678 | 812345678 | +243812345678
   * Retourne toujours : +243XXXXXXXXX
   */
  private normalizePhone(phone: string): string {
    let cleaned = phone.replace(/\s+/g, "").replace(/-/g, "");

    if (cleaned.startsWith("+243")) {
      return cleaned;
    }
    if (cleaned.startsWith("243")) {
      return "+" + cleaned;
    }
    if (cleaned.startsWith("0")) {
      return "+243" + cleaned.substring(1);
    }
    // Cas 9 chiffres sans 0
    if (cleaned.length === 9) {
      return "+243" + cleaned;
    }
    return cleaned;
  }

  /**
   * Étape 1 du login : demande d'envoi d'OTP
   *
   * Ce que fait cette méthode :
   * 1. Normalise le numéro de téléphone
   * 2. Génère un code OTP à 6 chiffres
   * 3. Le stocke en mémoire avec une expiration de 5 minutes
   * 4. "Envoie" le SMS (via NotificationsService)
   *
   * Résultat retourné au frontend :
   * { success: true, message: "OTP envoyé" }
   */
  async requestOtp(phone: string): Promise<{ success: boolean; message: string }> {
    const normalizedPhone = this.normalizePhone(phone);

    // Validation basique du format
    if (!/^\+243[0-9]{9}$/.test(normalizedPhone)) {
      throw new BadRequestException(
        "Numéro de téléphone invalide. Format attendu : 08X XXX XXXX ou +243 8X XXX XXXX"
      );
    }

    const code = this.generateOtpCode();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Stockage
    this.otpStore.set(normalizedPhone, {
      code,
      expiresAt,
      attempts: 0,
    });

    // Envoi du SMS (en dev on log aussi dans la console)
    await this.notificationsService.sendOtpSms(normalizedPhone, code);

    console.log(`[AUTH] OTP généré pour ${normalizedPhone} : ${code} (expire dans 5 min)`);

    return {
      success: true,
      message: "Code OTP envoyé par SMS",
    };
  }

  /**
   * Étape 2 du login : vérification de l'OTP
   *
   * Ce que fait cette méthode :
   * 1. Récupère l'OTP stocké pour ce numéro
   * 2. Vérifie qu'il n'est pas expiré
   * 3. Vérifie que le code saisi est correct
   * 4. Crée l'utilisateur s'il n'existe pas encore
   * 5. Génère un accessToken (15 min) + refreshToken (7 jours)
   *
   * Résultat retourné :
   * {
   *   success: true,
   *   data: {
   *     user: { id, phone, role, ... },
   *     accessToken: "...",
   *     refreshToken: "..."
   *   }
   * }
   */
  async verifyOtp(
    phone: string,
    otp: string
  ): Promise<{
    success: boolean;
    data: {
      user: any;
      accessToken: string;
      refreshToken: string;
    };
  }> {
    const normalizedPhone = this.normalizePhone(phone);
    const entry = this.otpStore.get(normalizedPhone);

    if (!entry) {
      throw new UnauthorizedException("Aucun code OTP demandé pour ce numéro");
    }

    // Vérification de l'expiration
    if (Date.now() > entry.expiresAt) {
      this.otpStore.delete(normalizedPhone);
      throw new UnauthorizedException("Le code OTP a expiré. Demandez-en un nouveau.");
    }

    // Limitation des tentatives
    if (entry.attempts >= 5) {
      this.otpStore.delete(normalizedPhone);
      throw new UnauthorizedException("Trop de tentatives. Demandez un nouveau code.");
    }

    // Vérification du code
    if (entry.code !== otp) {
      entry.attempts += 1;
      this.otpStore.set(normalizedPhone, entry);
      throw new UnauthorizedException("Code OTP incorrect");
    }

    // OTP correct → on le supprime pour qu'il ne puisse plus être réutilisé
    this.otpStore.delete(normalizedPhone);

    // Création ou récupération de l'utilisateur
    let user = await this.usersService.findByPhone(normalizedPhone);
    if (!user) {
      user = await this.usersService.create({
        phone: normalizedPhone,
        role: "STUDENT",
      });
    }

    // Génération des tokens
    const payload = {
      sub: user.id,
      phone: user.phone,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: "15m" });
    const refreshToken = this.jwtService.sign(
      { ...payload, type: "refresh" },
      { expiresIn: "7d" }
    );

    return {
      success: true,
      data: {
        user,
        accessToken,
        refreshToken,
      },
    };
  }

  /**
   * Valide un token JWT et retourne le payload
   * Utilisé par la JwtStrategy
   */
  async validateTokenPayload(payload: any) {
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException("Utilisateur introuvable");
    }
    return user;
  }
}

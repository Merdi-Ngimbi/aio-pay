/**
 * ============================================================
 * AIO PAY - Stratégie JWT (Passport)
 * ============================================================
 *
 * Rôle :
 * - Extrait le token JWT du header Authorization
 * - Vérifie sa signature et son expiration
 * - Charge l'utilisateur correspondant et l'attache à la requête
 *
 * Utilisation :
 * Les routes protégées utilisent @UseGuards(JwtAuthGuard)
 * qui s'appuie sur cette stratégie.
 * ============================================================
 */

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "./auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService
  ) {
    super({
      // On récupère le token depuis le header "Authorization: Bearer <token>"
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_SECRET") || "aio-pay-dev-secret-change-me",
    });
  }

  /**
   * Appelée automatiquement après validation du token
   * Le payload contient : { sub: userId, phone, role }
   * On retourne l'utilisateur complet qui sera disponible dans req.user
   */
  async validate(payload: any) {
    const user = await this.authService.validateTokenPayload(payload);
    if (!user) {
      throw new UnauthorizedException("Token invalide ou utilisateur introuvable");
    }
    return user;
  }
}

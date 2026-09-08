/**
 * ============================================================
 * AIO PAY - Contrôleur d'authentification
 * ============================================================
 *
 * Rôle :
 * - Expose les routes HTTP liées à l'authentification
 * - Reçoit les requêtes du frontend et appelle le AuthService
 *
 * Routes disponibles :
 * POST /api/auth/request-otp   → Demande l'envoi d'un code OTP
 * POST /api/auth/verify-otp    → Vérifie le code et connecte l'utilisateur
 * GET  /api/auth/me            → Retourne le profil de l'utilisateur connecté
 * ============================================================
 */

import { Controller, Post, Get, Body, UseGuards, Request } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { RequestOtpDto, VerifyOtpDto } from "./dto/auth.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /api/auth/request-otp
   *
   * Corps attendu :
   * { "phone": "0812345678" }
   *
   * Résultat :
   * { "success": true, "message": "Code OTP envoyé par SMS" }
   *
   * Le code OTP est aussi affiché dans la console du serveur
   * pendant la phase de développement.
   */
  @Post("request-otp")
  async requestOtp(@Body() dto: RequestOtpDto) {
    return this.authService.requestOtp(dto.phone);
  }

  /**
   * POST /api/auth/verify-otp
   *
   * Corps attendu :
   * { "phone": "0812345678", "otp": "483921" }
   *
   * Résultat en cas de succès :
   * {
   *   "success": true,
   *   "data": {
   *     "user": { "id": "...", "phone": "+243...", "role": "STUDENT" },
   *     "accessToken": "eyJhbGciOi...",
   *     "refreshToken": "eyJhbGciOi..."
   *   }
   * }
   */
  @Post("verify-otp")
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto.phone, dto.otp);
  }

  /**
   * GET /api/auth/me
   *
   * Nécessite un token JWT valide dans le header :
   * Authorization: Bearer <accessToken>
   *
   * Résultat :
   * { "success": true, "data": { id, phone, role, ... } }
   */
  @UseGuards(JwtAuthGuard)
  @Get("me")
  async getMe(@Request() req: any) {
    return {
      success: true,
      data: req.user,
    };
  }
}

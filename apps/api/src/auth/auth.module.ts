/**
 * ============================================================
 * AIO PAY - Module d'authentification
 * ============================================================
 *
 * Rôle :
 * - Gère tout le flux d'authentification par téléphone + OTP
 * - Génère et valide les tokens JWT
 *
 * Flux complet :
 * 1. L'étudiant envoie son numéro → requestOtp()
 * 2. Un code OTP à 6 chiffres est généré et "envoyé" par SMS
 * 3. L'étudiant renvoie le code → verifyOtp()
 * 4. Si le code est correct, on crée/récupère l'utilisateur
 *    et on lui délivre un accessToken + refreshToken
 * ============================================================
 */

import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtStrategy } from "./jwt.strategy";
import { UsersModule } from "../users/users.module";
import { NotificationsModule } from "../notifications/notifications.module";

@Module({
  imports: [
    UsersModule,
    NotificationsModule,
    PassportModule.register({ defaultStrategy: "jwt" }),

    /**
     * Configuration du module JWT
     * - secret : clé secrète pour signer les tokens (à mettre dans .env)
     * - expiresIn : durée de vie de l'access token (15 minutes)
     */
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>("JWT_SECRET") || "aio-pay-dev-secret-change-me",
        signOptions: {
          expiresIn: "15m", // Access token court pour la sécurité
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}

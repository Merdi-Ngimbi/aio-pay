/**
 * ============================================================
 * AIO PAY - Module racine de l'application
 * ============================================================
 *
 * Rôle :
 * - Assemble tous les modules métier de l'API
 * - Configure les modules globaux (Config, Throttler, etc.)
 *
 * Modules inclus :
 * - AuthModule        → Inscription / Connexion OTP + JWT
 * - UsersModule       → Gestion des profils utilisateurs
 * - UniversitiesModule→ Universités et banques de convenance
 * - PaymentsModule    → Création et suivi des paiements
 * - WebhooksModule    → Réception des notifications FlexPay
 * - NotificationsModule → Envoi de SMS de confirmation
 * ============================================================
 */

import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { UniversitiesModule } from "./universities/universities.module";
import { PaymentsModule } from "./payments/payments.module";
import { WebhooksModule } from "./webhooks/webhooks.module";
import { NotificationsModule } from "./notifications/notifications.module";

@Module({
  imports: [
    /**
     * ConfigModule
     * Charge les variables d'environnement (.env)
     * isGlobal: true → accessible partout sans réimporter
     */
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),

    /**
     * ThrottlerModule
     * Protection contre les abus (rate limiting)
     * Limite : 20 requêtes par minute par IP
     * Objectif : éviter le spam d'OTP ou les attaques par force brute
     */
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60 secondes
        limit: 20,  // 20 requêtes max
      },
    ]),

    // Modules métier
    AuthModule,
    UsersModule,
    UniversitiesModule,
    PaymentsModule,
    WebhooksModule,
    NotificationsModule,
  ],
})
export class AppModule {}

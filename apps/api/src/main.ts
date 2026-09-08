/**
 * ============================================================
 * AIO PAY - Point d'entrée du backend (NestJS)
 * ============================================================
 *
 * Rôle de ce fichier :
 * - Démarre le serveur HTTP de l'API
 * - Configure les middlewares globaux (CORS, validation, etc.)
 * - Écoute sur le port défini dans les variables d'environnement
 *
 * Résultat attendu :
 * - L'API est accessible sur http://localhost:3001
 * - Les requêtes venant du frontend (localhost:3000) sont acceptées (CORS)
 * - Toute donnée entrante est automatiquement validée
 * ============================================================
 */

import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";

async function bootstrap() {
  // Création de l'application NestJS à partir du module racine
  const app = await NestFactory.create(AppModule);

  /**
   * Activation de CORS
   * Objectif : autoriser le frontend (Next.js) à appeler l'API
   * sans être bloqué par le navigateur.
   */
  app.enableCors({
    origin: [
      "http://localhost:3000", // Frontend en développement
      "http://127.0.0.1:3000",
    ],
    credentials: true,
  });

  /**
   * Préfixe global de toutes les routes
   * Résultat : toutes les URLs commencent par /api
   * Exemple : POST /api/auth/request-otp
   */
  app.setGlobalPrefix("api");

  /**
   * Validation automatique des données entrantes
   * - whitelist : ignore les champs non déclarés dans les DTO
   * - transform : convertit automatiquement les types (string → number, etc.)
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  );

  // Port d'écoute (3001 par défaut pour ne pas entrer en conflit avec Next.js)
  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`🚀 AIO Pay API démarrée sur http://localhost:${port}`);
  console.log(`📚 Documentation des routes : http://localhost:${port}/api`);
}

bootstrap();

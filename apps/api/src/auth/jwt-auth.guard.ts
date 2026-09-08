/**
 * ============================================================
 * AIO PAY - Guard JWT
 * ============================================================
 *
 * Rôle :
 * - Protège les routes qui nécessitent d'être connecté
 * - Vérifie la présence et la validité du token JWT
 *
 * Utilisation dans un contrôleur :
 * @UseGuards(JwtAuthGuard)
 * @Get('me')
 * getProfile(@Request() req) { ... }
 * ============================================================
 */

import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {}

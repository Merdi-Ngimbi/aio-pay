/**
 * ============================================================
 * AIO PAY - Contrôleur Paiements
 * ============================================================
 *
 * Routes protégées (nécessitent un JWT) :
 * POST /api/payments              → Créer un paiement
 * GET  /api/payments/me           → Historique de l'étudiant
 * GET  /api/payments/:id          → Détail d'un paiement
 * POST /api/payments/:id/check-status → Vérifier le statut
 * ============================================================
 */

import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Request,
} from "@nestjs/common";
import { PaymentsService } from "./payments.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("payments")
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  /**
   * Crée une intention de paiement et retourne l'URL FlexPay
   */
  @Post()
  async create(@Request() req: any, @Body() body: any) {
    const result = await this.paymentsService.create({
      studentId: req.user.id,
      universityId: body.universityId,
      bankId: body.bankId,
      motif: body.motif,
      amount: body.amount,
      studentNumber: body.studentNumber,
    });

    return {
      success: true,
      data: result,
    };
  }

  /**
   * Historique des paiements de l'étudiant connecté
   */
  @Get("me")
  async myPayments(@Request() req: any) {
    const data = await this.paymentsService.findByStudent(req.user.id);
    return { success: true, data };
  }

  /**
   * Détail d'un paiement (pour la page reçu)
   */
  @Get(":id")
  async findOne(@Param("id") id: string) {
    const data = await this.paymentsService.findById(id);
    return { success: true, data };
  }

  /**
   * Vérification manuelle du statut (si webhook manqué)
   */
  @Post(":id/check-status")
  async checkStatus(@Param("id") id: string) {
    // Pour le MVP on retourne simplement le statut actuel
    const data = await this.paymentsService.findById(id);
    return { success: true, data };
  }
}

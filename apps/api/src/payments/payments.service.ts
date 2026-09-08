/**
 * ============================================================
 * AIO PAY - Service Paiements
 * ============================================================
 *
 * Rôle central de l'application :
 * - Créer une intention de paiement
 * - Calculer le total (montant + 1,5 USD de frais de service)
 * - Appeler FlexPay pour obtenir l'URL de redirection
 * - Mettre à jour le statut quand le webhook arrive
 *
 * Pour le MVP :
 * - Stockage en mémoire
 * - Simulation de FlexPay (retourne une URL fictive)
 * Plus tard → vraie intégration FlexPay + PostgreSQL
 * ============================================================
 */

import { Injectable, NotFoundException } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";

export type PaymentStatus =
  | "PENDING"
  | "PROCESSING"
  | "SUCCESS"
  | "FAILED"
  | "EXPIRED"
  | "CANCELLED";

export type PaymentMotif =
  | "INSCRIPTION"
  | "EXAMEN"
  | "MINERVAL"
  | "FRAIS_SESSION"
  | "AUTRE";

export interface Payment {
  id: string;
  reference: string;
  studentId: string;
  universityId: string;
  bankId: string;
  motif: PaymentMotif;
  amount: number;
  serviceFee: number;
  totalAmount: number;
  currency: "USD";
  status: PaymentStatus;
  flexpayReference?: string;
  receiptUrl?: string;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
}

/** Frais de service fixe décidé pour le MVP */
const SERVICE_FEE = 1.5;

@Injectable()
export class PaymentsService {
  private payments: Payment[] = [];

  /**
   * Crée une nouvelle intention de paiement
   *
   * Étapes :
   * 1. Calcule le total (montant + 1,5 USD)
   * 2. Génère une référence unique AIO-XXXXXX
   * 3. Enregistre la transaction en statut PENDING
   * 4. Simule l'appel à FlexPay et retourne une URL de redirection
   */
  async create(data: {
    studentId: string;
    universityId: string;
    bankId: string;
    motif: PaymentMotif;
    amount: number;
    studentNumber?: string;
  }): Promise<{ payment: Payment; redirectUrl: string }> {
    const now = new Date().toISOString();
    const id = uuidv4();
    const reference = `AIO-${Date.now().toString(36).toUpperCase()}`;

    const payment: Payment = {
      id,
      reference,
      studentId: data.studentId,
      universityId: data.universityId,
      bankId: data.bankId,
      motif: data.motif,
      amount: data.amount,
      serviceFee: SERVICE_FEE,
      totalAmount: data.amount + SERVICE_FEE,
      currency: "USD",
      status: "PENDING",
      createdAt: now,
      updatedAt: now,
    };

    this.payments.push(payment);

    /**
     * Simulation FlexPay
     * En production on appellera l'API FlexPay ici
     * et on récupérera la vraie URL de paiement.
     */
    const redirectUrl = `https://flexpay.cd/pay/demo?ref=${reference}&amount=${payment.totalAmount}`;

    // On passe en PROCESSING car on a redirigé l'utilisateur
    payment.status = "PROCESSING";
    payment.updatedAt = new Date().toISOString();

    console.log(`[PAYMENTS] Nouvelle transaction ${reference} - ${payment.totalAmount} USD`);

    return { payment, redirectUrl };
  }

  /**
   * Retourne tous les paiements d'un étudiant
   */
  async findByStudent(studentId: string): Promise<Payment[]> {
    return this.payments
      .filter((p) => p.studentId === studentId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }

  /**
   * Retourne un paiement par son ID
   */
  async findById(id: string): Promise<Payment> {
    const payment = this.payments.find((p) => p.id === id);
    if (!payment) {
      throw new NotFoundException("Paiement introuvable");
    }
    return payment;
  }

  /**
   * Met à jour le statut d'un paiement (appelé par le webhook FlexPay)
   */
  async updateStatus(
    id: string,
    status: PaymentStatus,
    flexpayReference?: string
  ): Promise<Payment> {
    const payment = await this.findById(id);
    payment.status = status;
    payment.updatedAt = new Date().toISOString();
    if (flexpayReference) {
      payment.flexpayReference = flexpayReference;
    }
    if (status === "SUCCESS") {
      payment.paidAt = new Date().toISOString();
    }
    return payment;
  }
}

/**
 * ============================================================
 * AIO PAY - Service de Notifications
 * ============================================================
 *
 * Rôle :
 * - Envoyer les SMS d'OTP
 * - Envoyer les SMS de confirmation de paiement
 *
 * Pour le MVP :
 * On log simplement le message dans la console.
 * En production on branchera un vrai gateway SMS
 * (Africa's Talking, Twilio, ou un opérateur local RDC).
 * ============================================================
 */

import { Injectable } from "@nestjs/common";

@Injectable()
export class NotificationsService {
  /**
   * Envoie un SMS contenant le code OTP
   *
   * En développement le code apparaît dans la console du serveur
   * pour que tu puisses te connecter facilement.
   */
  async sendOtpSms(phone: string, code: string): Promise<void> {
    console.log("================================================");
    console.log(`📱 SMS OTP → ${phone}`);
    console.log(`   Votre code AIO Pay est : ${code}`);
    console.log(`   Valable 5 minutes.`);
    console.log("================================================");
    // TODO: brancher un vrai provider SMS ici
  }

  /**
   * Envoie un SMS de confirmation de paiement réussi
   */
  async sendPaymentConfirmationSms(
    phone: string,
    amount: number,
    reference: string
  ): Promise<void> {
    console.log("================================================");
    console.log(`📱 SMS Confirmation → ${phone}`);
    console.log(`   Paiement de ${amount} USD réussi.`);
    console.log(`   Référence : ${reference}`);
    console.log("================================================");
  }
}

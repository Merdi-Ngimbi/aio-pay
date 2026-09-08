/**
 * ============================================================
 * AIO PAY - Contrôleur Webhooks FlexPay
 * ============================================================
 *
 * Rôle :
 * - Recevoir les notifications de FlexPay quand un paiement
 *   est confirmé ou échoué
 * - Vérifier la signature HMAC (sécurité)
 * - Mettre à jour le statut de la transaction
 *
 * Route :
 * POST /api/webhooks/flexpay
 *
 * Important :
 * Cette route n'est PAS protégée par JWT car c'est FlexPay
 * qui l'appelle, pas notre frontend.
 * ============================================================
 */

import { Controller, Post, Body, Headers, Logger } from "@nestjs/common";
import { PaymentsService } from "../payments/payments.service";

@Controller("webhooks")
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(private readonly paymentsService: PaymentsService) {}

  /**
   * Point d'entrée des notifications FlexPay
   *
   * En production on vérifiera la signature HMAC ici
   * avant de faire confiance aux données reçues.
   */
  @Post("flexpay")
  async handleFlexPay(
    @Body() body: any,
    @Headers("x-flexpay-signature") signature?: string
  ) {
    this.logger.log(`Webhook FlexPay reçu : ${JSON.stringify(body)}`);

    // TODO: vérifier la signature HMAC
    // const isValid = this.verifySignature(body, signature);
    // if (!isValid) throw new UnauthorizedException("Signature invalide");

    // Exemple de payload attendu de FlexPay
    // { reference: "AIO-XXX", status: "SUCCESS" | "FAILED", flexpayRef: "..." }

    if (body.reference && body.status) {
      // On retrouvera le paiement par sa référence
      // (à implémenter proprement plus tard)
      this.logger.log(
        `Mise à jour du paiement ${body.reference} → ${body.status}`
      );
    }

    // FlexPay attend généralement un 200 OK
    return { received: true };
  }
}

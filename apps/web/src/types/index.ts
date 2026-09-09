/**
 * ============================================================
 * AIO PAY - Types partagés (Frontend)
 * ============================================================
 * Ces types définissent la structure des données utilisées
 * dans toute l'application web AIO Pay.
 * Ils doivent rester synchronisés avec le backend (NestJS).
 * ============================================================
 */

/**
 * Rôles possibles dans l'application
 */
export type UserRole = "STUDENT" | "UNIVERSITY" | "ADMIN";

/**
 * Statuts possibles d'une transaction de paiement
 * Alignés avec la roadmap (section 7 + architecture)
 */
export type PaymentStatus =
  | "PENDING"      // Transaction créée, en attente de paiement
  | "PROCESSING"   // Redirigé vers FlexPay, en cours
  | "SUCCESS"      // Paiement confirmé par webhook FlexPay
  | "FAILED"       // Échec du paiement
  | "EXPIRED"      // Timeout
  | "CANCELLED";   // Annulé par l'utilisateur

/**
 * Motifs de paiement académique (section 7 de la roadmap)
 */
export type PaymentMotif =
  | "INSCRIPTION"
  | "EXAMEN"
  | "MINERVAL"
  | "FRAIS_SESSION"
  | "AUTRE";

/**
 * Utilisateur authentifié (étudiant, université ou admin)
 */
export interface User {
  id: string;
  phone: string;                 // Téléphone d'inscription (OTP)
  username?: string;             // Nom d'utilisateur affiché (modifiable)
  fullName?: string;             // Nom complet de l'étudiant
  studentNumber?: string;        // Matricule étudiant
  promotion?: string;            // Promotion / année (ex: L2 Informatique 2025)
  role: UserRole;
  universityId?: string;         // Université principale de l'étudiant
  createdAt: string;
  updatedAt: string;
}

/**
 * Université partenaire (ex: UPC)
 */
export interface University {
  id: string;
  name: string;
  code: string;                  // Ex: "UPC"
  logoUrl?: string;
  isActive: boolean;
  createdAt: string;
}

/**
 * Banque de convenance d'une université
 */
export interface Bank {
  id: string;
  name: string;                  // Ex: "Equity BCDC", "Rawbank"
  code: string;
  universityId: string;
  isActive: boolean;
}

/**
 * Transaction de paiement
 * Cœur métier de AIO Pay
 */
export interface Payment {
  id: string;
  reference: string;             // Référence unique AIO Pay
  studentId: string;
  universityId: string;
  bankId: string;
  motif: PaymentMotif;
  amount: number;                // Montant saisi par l'étudiant (en USD)
  serviceFee: number;            // Frais de service AIO Pay (1.5 USD)
  totalAmount: number;           // amount + serviceFee
  currency: "USD";
  status: PaymentStatus;
  flexpayReference?: string;     // Référence retournée par FlexPay
  receiptUrl?: string;           // URL du reçu PDF généré
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;

  /** Infos figées sur le reçu au moment du paiement */
  studentName?: string;
  studentNumber?: string;        // Matricule
  promotion?: string;
  mobileMoneyPhone?: string;     // Numéro MM débité

  // Relations (optionnelles selon le contexte)
  student?: User;
  university?: University;
  bank?: Bank;
}

/**
 * Réponse standard de l'API
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

/**
 * Données nécessaires pour initier un paiement
 */
export interface CreatePaymentDto {
  universityId: string;
  bankId: string;
  motif: PaymentMotif;
  amount: number;
  studentNumber?: string;
  promotion?: string;
  /** Numéro Mobile Money qui sera débité (peut différer du téléphone de compte) */
  mobileMoneyPhone: string;
}

/**
 * Réponse de FlexPay lors de l'initiation
 */
export interface FlexPayInitResponse {
  redirectUrl: string;           // URL vers laquelle rediriger l'étudiant
  transactionRef: string;
}

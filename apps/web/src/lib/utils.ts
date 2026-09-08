/**
 * ============================================================
 * AIO PAY - Utilitaires généraux
 * ============================================================
 * Fonctions d'aide réutilisables dans toute l'application.
 * ============================================================
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine les classes Tailwind de manière intelligente
 * (évite les conflits de classes)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formate un montant en USD pour l'affichage
 * Ex: 150 → "150,00 USD"
 */
export function formatAmount(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("fr-CD", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formate une date en français (RDC)
 * Ex: "07 sept. 2026 à 14:30"
 */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

/**
 * Traduit le motif de paiement en français lisible
 */
export function translateMotif(motif: string): string {
  const map: Record<string, string> = {
    INSCRIPTION: "Frais d'inscription",
    EXAMEN: "Frais d'examen",
    MINERVAL: "Minerval",
    FRAIS_SESSION: "Frais de session",
    AUTRE: "Autre",
  };
  return map[motif] || motif;
}

/**
 * Traduit le statut de paiement en français
 */
export function translateStatus(status: string): string {
  const map: Record<string, string> = {
    PENDING: "En attente",
    PROCESSING: "En cours",
    SUCCESS: "Réussi",
    FAILED: "Échoué",
    EXPIRED: "Expiré",
    CANCELLED: "Annulé",
  };
  return map[status] || status;
}

/**
 * Retourne la couleur Tailwind selon le statut
 */
export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    PROCESSING: "bg-blue-100 text-blue-800",
    SUCCESS: "bg-green-100 text-green-800",
    FAILED: "bg-red-100 text-red-800",
    EXPIRED: "bg-gray-100 text-gray-800",
    CANCELLED: "bg-gray-100 text-gray-600",
  };
  return map[status] || "bg-gray-100 text-gray-800";
}

/**
 * Masque partiellement un numéro de téléphone
 * Ex: +243812345678 → +243 81 ** ** 78
 */
export function maskPhone(phone: string): string {
  if (phone.length < 8) return phone;
  return `${phone.slice(0, 6)} ** ** ${phone.slice(-2)}`;
}

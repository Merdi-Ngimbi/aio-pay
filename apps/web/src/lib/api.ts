/**
 * ============================================================
 * AIO PAY - Client API (Axios)
 * ============================================================
 * Centralise tous les appels HTTP vers le backend NestJS.
 * Gère automatiquement le token JWT et les erreurs.
 * ============================================================
 */

import axios, { AxiosError, AxiosInstance } from "axios";
import Cookies from "js-cookie";
import type { ApiResponse, CreatePaymentDto, Payment, User, University, Bank } from "@/types";

// URL de base de l'API (à configurer via variable d'environnement)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

/**
 * Instance Axios configurée
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Intercepteur : ajoute automatiquement le token JWT
 * à chaque requête sortante
 */
apiClient.interceptors.request.use((config) => {
  const token = Cookies.get("aio_access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Intercepteur : gère les erreurs globales (ex: 401 → déconnexion)
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide → on nettoie les cookies
      Cookies.remove("aio_access_token");
      Cookies.remove("aio_refresh_token");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// ============================================================
// AUTHENTIFICATION
// ============================================================

/**
 * Demande l'envoi d'un OTP au numéro de téléphone
 */
export async function requestOtp(phone: string): Promise<ApiResponse> {
  const { data } = await apiClient.post("/auth/request-otp", { phone });
  return data;
}

/**
 * Vérifie l'OTP et retourne les tokens JWT + infos utilisateur
 */
export async function verifyOtp(
  phone: string,
  otp: string
): Promise<ApiResponse<{ user: User; accessToken: string; refreshToken: string }>> {
  const { data } = await apiClient.post("/auth/verify-otp", { phone, otp });
  return data;
}

/**
 * Récupère le profil de l'utilisateur connecté
 */
export async function getMe(): Promise<ApiResponse<User>> {
  const { data } = await apiClient.get("/auth/me");
  return data;
}

// ============================================================
// UNIVERSITÉS & BANQUES
// ============================================================

/**
 * Liste toutes les universités actives
 */
export async function getUniversities(): Promise<ApiResponse<University[]>> {
  const { data } = await apiClient.get("/universities");
  return data;
}

/**
 * Liste les banques de convenance d'une université
 */
export async function getBanksByUniversity(
  universityId: string
): Promise<ApiResponse<Bank[]>> {
  const { data } = await apiClient.get(`/universities/${universityId}/banks`);
  return data;
}

// ============================================================
// PAIEMENTS
// ============================================================

/**
 * Crée une intention de paiement et retourne l'URL FlexPay
 */
export async function createPayment(
  payload: CreatePaymentDto
): Promise<ApiResponse<{ payment: Payment; redirectUrl: string }>> {
  const { data } = await apiClient.post("/payments", payload);
  return data;
}

/**
 * Récupère l'historique des paiements de l'étudiant connecté
 */
export async function getMyPayments(): Promise<ApiResponse<Payment[]>> {
  const { data } = await apiClient.get("/payments/me");
  return data;
}

/**
 * Récupère le détail d'un paiement (pour le reçu)
 */
export async function getPaymentById(
  id: string
): Promise<ApiResponse<Payment>> {
  const { data } = await apiClient.get(`/payments/${id}`);
  return data;
}

/**
 * Vérifie manuellement le statut d'un paiement auprès de FlexPay
 * (utile en cas de webhook manqué)
 */
export async function checkPaymentStatus(
  id: string
): Promise<ApiResponse<Payment>> {
  const { data } = await apiClient.post(`/payments/${id}/check-status`);
  return data;
}

export default apiClient;

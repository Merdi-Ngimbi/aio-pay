/**
 * ============================================================
 * AIO PAY - Store d'authentification (Zustand)
 * ============================================================
 * Gère l'état global de l'utilisateur connecté.
 * Persiste le token dans les cookies pour la sécurité.
 * ============================================================
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";
import type { User } from "@/types";
import { getMe, requestOtp, verifyOtp } from "@/lib/api";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  requestOtp: (phone: string) => Promise<boolean>;
  verifyOtp: (phone: string, otp: string) => Promise<boolean>;
  logout: () => void;
  loadUser: () => Promise<void>;
  /** Met à jour le profil localement (username, nom, matricule, promotion) */
  updateProfile: (data: Partial<User>) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      /**
       * Étape 1 : Demande l'envoi de l'OTP par SMS
       */
      requestOtp: async (phone: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await requestOtp(phone);
          if (!response.success) {
            set({ error: response.message || "Impossible d'envoyer l'OTP", isLoading: false });
            return false;
          }
          set({ isLoading: false });
          return true;
        } catch (err: any) {
          const message = err.response?.data?.message || "Erreur réseau";
          set({ error: message, isLoading: false });
          return false;
        }
      },

      /**
       * Étape 2 : Vérifie l'OTP et connecte l'utilisateur
       */
      verifyOtp: async (phone: string, otp: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await verifyOtp(phone, otp);
          if (!response.success || !response.data) {
            set({ error: response.message || "OTP invalide", isLoading: false });
            return false;
          }

          const { user, accessToken, refreshToken } = response.data;

          // Stockage sécurisé des tokens dans des cookies
          Cookies.set("aio_access_token", accessToken, { expires: 1, sameSite: "strict" });
          Cookies.set("aio_refresh_token", refreshToken, { expires: 7, sameSite: "strict" });

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return true;
        } catch (err: any) {
          const message = err.response?.data?.message || "Erreur de vérification";
          set({ error: message, isLoading: false });
          return false;
        }
      },

      /**
       * Déconnexion complète
       */
      logout: () => {
        Cookies.remove("aio_access_token");
        Cookies.remove("aio_refresh_token");
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      /**
       * Charge le profil utilisateur au démarrage de l'app
       * (si un token existe déjà)
       */
      loadUser: async () => {
        const token = Cookies.get("aio_access_token");
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        set({ isLoading: true });
        try {
          const response = await getMe();
          if (response.success && response.data) {
            set({
              user: response.data,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            get().logout();
            set({ isLoading: false });
          }
        } catch {
          get().logout();
          set({ isLoading: false });
        }
      },

      /**
       * Met à jour les champs du profil (nom d'utilisateur, matricule, etc.)
       * Persiste via le middleware Zustand. Backend API à brancher plus tard.
       */
      updateProfile: (data: Partial<User>) => {
        const current = get().user;
        if (!current) return;
        set({
          user: {
            ...current,
            ...data,
            updatedAt: new Date().toISOString(),
          },
        });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "aio-pay-auth", // clé de stockage local
      partialize: (state) => ({
        // On ne persiste que l'utilisateur, pas les tokens (ils sont dans les cookies)
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

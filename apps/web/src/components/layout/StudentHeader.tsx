/**
 * ============================================================
 * AIO PAY - En-tête pour les pages étudiant
 * ============================================================
 *
 * Rôle :
 * - Affiche le logo AIO Pay (icône officielle)
 * - Montre le nom / téléphone de l'utilisateur connecté
 * - Bouton de déconnexion
 *
 * Design : couleurs de marque (bordeaux)
 * ============================================================
 */

"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import Logo from "./Logo";
import { LogOut, User } from "lucide-react";

export default function StudentHeader() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="mx-auto max-w-lg px-4 h-14 flex items-center justify-between">
        <Logo size={32} href="/dashboard" showText={true} />

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <User className="h-4 w-4" />
            <span className="max-w-[100px] truncate">
              {user?.fullName || user?.phone || "Étudiant"}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            style={{ color: "inherit" }}
            title="Se déconnecter"
            onMouseEnter={(e) => (e.currentTarget.style.color = "#6B0F1A")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "")}
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

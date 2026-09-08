/**
 * ============================================================
 * AIO PAY - Dashboard Étudiant
 * ============================================================
 * Page principale après connexion.
 * Affiche un résumé et les actions rapides (Payer, Historique).
 * ============================================================
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import StudentHeader from "@/components/layout/StudentHeader";
import { getMyPayments } from "@/lib/api";
import { formatAmount, formatDate, translateStatus, getStatusColor } from "@/lib/utils";
import type { Payment } from "@/types";
import {
  CreditCard,
  History,
  Receipt,
  ArrowRight,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export default function StudentDashboard() {
  const router = useRouter();
  const { isAuthenticated, user, loadUser } = useAuthStore();
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  // Vérifie l'authentification au chargement
  useEffect(() => {
    loadUser().then(() => {
      if (!isAuthenticated) {
        router.push("/login");
      }
    });
  }, [isAuthenticated, loadUser, router]);

  // Charge les derniers paiements
  useEffect(() => {
    if (!isAuthenticated) return;

    getMyPayments()
      .then((res) => {
        if (res.success && res.data) {
          // On garde seulement les 3 plus récents
          setRecentPayments(res.data.slice(0, 3));
        }
      })
      .catch(() => {
        // En cas d'erreur API (backend pas encore prêt), on ignore silencieusement
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#6B0F1A]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentHeader />

      <main className="mx-auto max-w-lg px-4 py-6 space-y-6">
        {/* Message de bienvenue */}
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Bonjour{user?.fullName ? `, ${user.fullName.split(" ")[0]}` : ""} 👋
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Payez vos frais académiques en quelques minutes.
          </p>
        </div>

        {/* Bouton principal : Nouveau paiement */}
        <Link
          href="/payment"
          className="card flex items-center gap-4 hover:shadow-md transition-shadow active:scale-[0.98]"
        >
          <div className="h-12 w-12 rounded-xl bg-[#6B0F1A] flex items-center justify-center flex-shrink-0">
            <CreditCard className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-gray-900">Nouveau paiement</h2>
            <p className="text-sm text-gray-500">
              Inscription, examen, minerval...
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400" />
        </Link>

        {/* Actions secondaires */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/history"
            className="card flex flex-col items-center gap-2 py-5 hover:shadow-md transition-shadow"
          >
            <History className="h-6 w-6 text-[#6B0F1A]" />
            <span className="text-sm font-medium text-gray-900">Historique</span>
          </Link>
          <Link
            href="/history"
            className="card flex flex-col items-center gap-2 py-5 hover:shadow-md transition-shadow"
          >
            <Receipt className="h-6 w-6 text-[#6B0F1A]" />
            <span className="text-sm font-medium text-gray-900">Mes reçus</span>
          </Link>
        </div>

        {/* Derniers paiements */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900">Derniers paiements</h2>
            <Link href="/history" className="text-sm text-[#6B0F1A]">
              Voir tout
            </Link>
          </div>

          {loading ? (
            <div className="card flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-[#6B0F1A]" />
            </div>
          ) : recentPayments.length === 0 ? (
            <div className="card text-center py-8">
              <CheckCircle2 className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">
                Aucun paiement pour le moment.
              </p>
              <Link
                href="/payment"
                className="inline-block mt-3 text-sm text-[#6B0F1A] font-medium"
              >
                Faire mon premier paiement →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentPayments.map((payment) => (
                <Link
                  key={payment.id}
                  href={`/receipt/${payment.id}`}
                  className="card flex items-center justify-between hover:shadow-md transition-shadow"
                >
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {payment.motif === "INSCRIPTION"
                        ? "Inscription"
                        : payment.motif === "EXAMEN"
                        ? "Examen"
                        : payment.motif === "MINERVAL"
                        ? "Minerval"
                        : payment.motif === "FRAIS_SESSION"
                        ? "Frais de session"
                        : "Autre"}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {formatDate(payment.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 text-sm">
                      {formatAmount(payment.totalAmount)}
                    </p>
                    <span
                      className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${getStatusColor(
                        payment.status
                      )}`}
                    >
                      {translateStatus(payment.status)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Info frais de service */}
        <div className="rounded-xl bg-[#FDF8F6] border border-[#F5E6E8] p-4 text-sm text-[#6B0F1A]">
          <p className="font-medium">Frais de service</p>
          <p className="mt-1 text-[#6B0F1A]">
            1,50 USD seulement (équivalent du transport en agence).
          </p>
        </div>
      </main>
    </div>
  );
}

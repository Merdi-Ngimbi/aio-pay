/**
 * ============================================================
 * AIO PAY - Historique des paiements
 * ============================================================
 * Liste complète des transactions de l'étudiant connecté
 * avec statut, montant et lien vers le reçu.
 * ============================================================
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import StudentHeader from "@/components/layout/StudentHeader";
import { getMyPayments } from "@/lib/api";
import {
  formatAmount,
  formatDate,
  translateStatus,
  translateMotif,
  getStatusColor,
} from "@/lib/utils";
import type { Payment } from "@/types";
import { Loader2, ArrowLeft, Receipt, Inbox } from "lucide-react";

export default function HistoryPage() {
  const router = useRouter();
  const { isAuthenticated, loadUser } = useAuthStore();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser().then(() => {
      if (!isAuthenticated) router.push("/login");
    });
  }, [isAuthenticated, loadUser, router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    getMyPayments()
      .then((res) => {
        if (res.success && res.data) {
          setPayments(res.data);
        }
      })
      .catch(() => {
        // Backend pas encore prêt → liste vide
        setPayments([]);
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

      <main className="mx-auto max-w-lg px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/dashboard"
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Historique</h1>
        </div>

        {loading ? (
          <div className="card flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-[#6B0F1A]" />
          </div>
        ) : payments.length === 0 ? (
          <div className="card text-center py-12">
            <Inbox className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucun paiement trouvé.</p>
            <Link
              href="/payment"
              className="inline-block mt-4 text-sm text-[#6B0F1A] font-medium"
            >
              Faire un paiement →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {payments.map((payment) => (
              <Link
                key={payment.id}
                href={`/receipt/${payment.id}`}
                className="card flex items-center gap-4 hover:shadow-md transition-shadow"
              >
                <div className="h-10 w-10 rounded-full bg-[#FDF8F6] flex items-center justify-center flex-shrink-0">
                  <Receipt className="h-5 w-5 text-[#6B0F1A]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">
                    {translateMotif(payment.motif)}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {formatDate(payment.createdAt)}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">
                    Réf: {payment.reference}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
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
      </main>
    </div>
  );
}

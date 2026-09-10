/**
 * ============================================================
 * AIO PAY - Historique des paiements
 * ============================================================
 * Liste style fintech (transactions) avec shell responsive.
 * ============================================================
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import StudentShell from "@/components/layout/StudentShell";
import { TransactionRow, SegmentedControl, InfoBox } from "@/components/ui/fintech";
import { getMyPayments } from "@/lib/api";
import {
  formatAmount,
  formatDate,
  translateMotif,
  translateStatus,
} from "@/lib/utils";
import type { Payment } from "@/types";
import { Loader2, Inbox, FileText, Plus } from "lucide-react";

type Filter = "all" | "success" | "pending";

export default function HistoryPage() {
  const router = useRouter();
  const { isAuthenticated, loadUser } = useAuthStore();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");

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
        setPayments([]);
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--aio-cream)]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--aio-bordeaux)]" />
      </div>
    );
  }

  const filtered = payments.filter((p) => {
    if (filter === "success") return p.status === "SUCCESS";
    if (filter === "pending")
      return p.status === "PENDING" || p.status === "PROCESSING";
    return true;
  });

  return (
    <StudentShell>
      <main className="student-content space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Transactions
          </h1>
          <Link
            href="/payment"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-soft text-gray-800 hover:text-[var(--aio-bordeaux)]"
            aria-label="Nouveau paiement"
          >
            <Plus className="h-5 w-5 stroke-[1.5]" />
          </Link>
        </div>

        <SegmentedControl
          options={[
            { value: "all", label: "Toutes" },
            { value: "success", label: "Réussies" },
            { value: "pending", label: "En cours" },
          ]}
          value={filter}
          onChange={setFilter}
        />

        {loading ? (
          <div className="card flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-[var(--aio-bordeaux)]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="card text-center py-12">
            <Inbox className="h-12 w-12 text-gray-300 mx-auto mb-4 stroke-[1.5]" />
            <p className="text-gray-500">Aucune transaction trouvée.</p>
            <Link
              href="/payment"
              className="inline-block mt-4 text-sm text-[var(--aio-bordeaux)] font-medium"
            >
              Faire un paiement →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((payment) => (
              <TransactionRow
                key={payment.id}
                href={`/receipt/${payment.id}`}
                title={translateMotif(payment.motif)}
                subtitle={`${translateStatus(payment.status)} · ${payment.reference}`}
                amount={formatAmount(payment.totalAmount)}
                date={formatDate(payment.createdAt)}
                icon={FileText}
              />
            ))}
          </div>
        )}

        <InfoBox>
          Les reçus restent disponibles à tout moment. Touchez une ligne pour
          ouvrir le détail et le QR de vérification.
        </InfoBox>
      </main>
    </StudentShell>
  );
}

/**
 * ============================================================
 * AIO PAY - Dashboard Étudiant
 * ============================================================
 * Layout fintech soft : greeting, banner promo, carousel compte,
 * quick actions, dernières transactions.
 * ============================================================
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import StudentShell from "@/components/layout/StudentShell";
import {
  PromoBanner,
  AccountCard,
  QuickAction,
  TransactionRow,
} from "@/components/ui/fintech";
import { getMyPayments } from "@/lib/api";
import { formatAmount, formatDate, translateMotif } from "@/lib/utils";
import type { Payment } from "@/types";
import {
  CreditCard,
  History,
  Receipt,
  UserCircle,
  Loader2,
  CheckCircle2,
  Mail,
  FileText,
} from "lucide-react";

export default function StudentDashboard() {
  const router = useRouter();
  const { isAuthenticated, user, loadUser } = useAuthStore();
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser().then(() => {
      if (!isAuthenticated) {
        router.push("/login");
      }
    });
  }, [isAuthenticated, loadUser, router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    getMyPayments()
      .then((res) => {
        if (res.success && res.data) {
          setRecentPayments(res.data.slice(0, 5));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--aio-cream)]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--aio-bordeaux)]" />
      </div>
    );
  }

  const firstName =
    user?.fullName?.split(" ")[0] ||
    user?.username ||
    "étudiant";

  const totalPaid = recentPayments
    .filter((p) => p.status === "SUCCESS")
    .reduce((sum, p) => sum + (p.totalAmount || 0), 0);

  const pendingCount = recentPayments.filter(
    (p) => p.status === "PENDING" || p.status === "PROCESSING"
  ).length;

  return (
    <StudentShell>
      <main className="student-content space-y-6">
        {/* Greeting + mail */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Hi {firstName}
          </h1>
          <Link
            href="/contact"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-soft text-gray-700 hover:text-[var(--aio-bordeaux)] transition-colors"
            aria-label="Support"
          >
            <Mail className="h-5 w-5 stroke-[1.5]" />
          </Link>
        </div>

        {/* Banner promo */}
        <PromoBanner
          title="Payez vos frais académiques en quelques minutes"
          ctaLabel="Commencer"
          ctaHref="/payment"
        />

        {/* Carousel de cartes compte */}
        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-1 px-1 scrollbar-none">
          <AccountCard
            label="Tous les comptes"
            balance={formatAmount(totalPaid || 0)}
            subtitle="Total payé (réussis)"
            variant="primary"
          />
          <AccountCard
            label="En cours"
            balance={String(pendingCount)}
            subtitle="Paiements en attente"
            variant="secondary"
          />
        </div>

        {/* Quick actions */}
        <div>
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Actions rapides</h2>
          <div className="grid grid-cols-4 gap-3">
            <QuickAction href="/payment" icon={CreditCard} label="Payer" />
            <QuickAction href="/history" icon={History} label="Historique" />
            <QuickAction href="/history" icon={Receipt} label="Reçus" />
            <QuickAction href="/profile" icon={UserCircle} label="Profil" />
          </div>
        </div>

        {/* Dernières transactions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">
              Dernières transactions
            </h2>
            <Link
              href="/history"
              className="text-sm font-medium text-[var(--aio-bordeaux)]"
            >
              Voir tout
            </Link>
          </div>

          {loading ? (
            <div className="card flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-[var(--aio-bordeaux)]" />
            </div>
          ) : recentPayments.length === 0 ? (
            <div className="card text-center py-10">
              <CheckCircle2 className="h-10 w-10 text-gray-300 mx-auto mb-3 stroke-[1.5]" />
              <p className="text-sm text-gray-500">
                Aucune transaction pour le moment.
              </p>
              <Link
                href="/payment"
                className="inline-block mt-3 text-sm text-[var(--aio-bordeaux)] font-medium"
              >
                Faire mon premier paiement →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentPayments.map((payment) => (
                <TransactionRow
                  key={payment.id}
                  href={`/receipt/${payment.id}`}
                  title={translateMotif(payment.motif)}
                  subtitle="Paiement"
                  amount={formatAmount(payment.totalAmount)}
                  date={formatDate(payment.createdAt)}
                  icon={FileText}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info frais */}
        <div className="info-box !bg-[var(--aio-cream)] !text-[var(--aio-bordeaux)] border border-[#F5E6E8]">
          <div>
            <p className="font-medium text-[var(--aio-bordeaux)]">Frais de service</p>
            <p className="mt-1 text-sm opacity-90">
              1,50 USD seulement — l&apos;équivalent d&apos;un trajet en agence.
            </p>
          </div>
        </div>
      </main>
    </StudentShell>
  );
}

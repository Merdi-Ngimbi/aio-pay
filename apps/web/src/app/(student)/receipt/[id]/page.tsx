/**
 * ============================================================
 * AIO PAY - Page de reçu numérique
 * ============================================================
 * Affiche le détail d'un paiement et permet de télécharger
 * le reçu (PDF à générer côté backend plus tard).
 * ============================================================
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import StudentHeader from "@/components/layout/StudentHeader";
import { getPaymentById, checkPaymentStatus } from "@/lib/api";
import {
  formatAmount,
  formatDate,
  translateStatus,
  translateMotif,
  getStatusColor,
} from "@/lib/utils";
import type { Payment } from "@/types";
import { toast } from "sonner";
import {
  ArrowLeft,
  Loader2,
  Download,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";

export default function ReceiptPage() {
  const router = useRouter();
  const params = useParams();
  const paymentId = params.id as string;

  const { isAuthenticated, loadUser } = useAuthStore();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    loadUser().then(() => {
      if (!isAuthenticated) router.push("/login");
    });
  }, [isAuthenticated, loadUser, router]);

  useEffect(() => {
    if (!isAuthenticated || !paymentId) return;

    getPaymentById(paymentId)
      .then((res) => {
        if (res.success && res.data) {
          setPayment(res.data);
        } else {
          toast.error("Paiement introuvable");
        }
      })
      .catch(() => {
        // Mode démo
        setPayment({
          id: paymentId,
          reference: "AIO-DEMO-" + paymentId.slice(0, 8).toUpperCase(),
          studentId: "demo",
          universityId: "upc-demo",
          bankId: "equity-demo",
          motif: "INSCRIPTION",
          amount: 150,
          serviceFee: 1.5,
          totalAmount: 151.5,
          currency: "USD",
          status: "SUCCESS",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          paidAt: new Date().toISOString(),
          university: {
            id: "upc-demo",
            name: "Université Protestante au Congo (UPC)",
            code: "UPC",
            isActive: true,
            createdAt: new Date().toISOString(),
          },
          bank: {
            id: "equity-demo",
            name: "Equity BCDC",
            code: "EQUITY",
            universityId: "upc-demo",
            isActive: true,
          },
        });
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated, paymentId]);

  /**
   * Vérifie manuellement le statut auprès de FlexPay
   * (utile si le webhook a été manqué)
   */
  const handleCheckStatus = async () => {
    if (!payment) return;
    setChecking(true);
    try {
      const res = await checkPaymentStatus(payment.id);
      if (res.success && res.data) {
        setPayment(res.data);
        toast.success("Statut mis à jour");
      }
    } catch {
      toast.info("Vérification impossible (backend non connecté)");
    } finally {
      setChecking(false);
    }
  };

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#6B0F1A]" />
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="min-h-screen bg-gray-50">
        <StudentHeader />
        <main className="mx-auto max-w-lg px-4 py-12 text-center">
          <p className="text-gray-500">Paiement introuvable.</p>
          <Link href="/history" className="text-[#6B0F1A] text-sm mt-4 inline-block">
            ← Retour à l&apos;historique
          </Link>
        </main>
      </div>
    );
  }

  const StatusIcon =
    payment.status === "SUCCESS"
      ? CheckCircle2
      : payment.status === "FAILED"
      ? XCircle
      : Clock;

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentHeader />

      <main className="mx-auto max-w-lg px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/history"
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Reçu de paiement</h1>
        </div>

        {/* Carte du reçu */}
        <div className="card space-y-5">
          {/* Statut */}
          <div className="flex flex-col items-center py-4">
            <StatusIcon
              className={`h-14 w-14 ${
                payment.status === "SUCCESS"
                  ? "text-green-500"
                  : payment.status === "FAILED"
                  ? "text-red-500"
                  : "text-yellow-500"
              }`}
            />
            <span
              className={`mt-3 text-sm font-medium px-3 py-1 rounded-full ${getStatusColor(
                payment.status
              )}`}
            >
              {translateStatus(payment.status)}
            </span>
          </div>

          {/* Montant principal */}
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">
              {formatAmount(payment.totalAmount)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              dont {formatAmount(payment.serviceFee)} de frais de service
            </p>
          </div>

          <hr className="border-gray-100" />

          {/* Détails */}
          <div className="space-y-3 text-sm">
            <DetailRow label="Référence" value={payment.reference} />
            <DetailRow
              label="Motif"
              value={translateMotif(payment.motif)}
            />
            <DetailRow
              label="Université"
              value={payment.university?.name || "—"}
            />
            <DetailRow
              label="Banque"
              value={payment.bank?.name || "—"}
            />
            <DetailRow
              label="Date"
              value={formatDate(payment.paidAt || payment.createdAt)}
            />
            {payment.flexpayReference && (
              <DetailRow
                label="Réf. FlexPay"
                value={payment.flexpayReference}
              />
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-2">
            {payment.status === "SUCCESS" && (
              <button
                onClick={() => toast.info("Génération PDF à venir (backend)")}
                className="btn-primary w-full"
              >
                <Download className="mr-2 h-4 w-4" />
                Télécharger le reçu (PDF)
              </button>
            )}

            {(payment.status === "PENDING" ||
              payment.status === "PROCESSING") && (
              <button
                onClick={handleCheckStatus}
                disabled={checking}
                className="btn-secondary w-full"
              >
                {checking ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Vérifier le statut
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Ce reçu a la même valeur qu&apos;un paiement effectué en agence.
        </p>
      </main>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-500 flex-shrink-0">{label}</span>
      <span className="font-medium text-gray-900 text-right break-all">
        {value}
      </span>
    </div>
  );
}

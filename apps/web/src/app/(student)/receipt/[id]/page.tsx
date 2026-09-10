/**
 * ============================================================
 * AIO PAY - Page de reçu numérique
 * ============================================================
 *
 * Affiche toutes les informations nécessaires au reçu :
 * - Référence AIO Pay
 * - Nom de l'étudiant, matricule, promotion
 * - Université, banque de convenance
 * - Motif, montants, frais de service
 * - Numéro Mobile Money débité
 * - Statut et date
 * - QR code scannable (contient la référence pour vérification)
 *
 * Le QR code encode la référence du paiement pour faciliter
 * le contrôle côté université / guichet.
 * ============================================================
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/stores/auth-store";
import StudentShell from "@/components/layout/StudentShell";
import { InfoBox } from "@/components/ui/fintech";
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

  const { isAuthenticated, loadUser, user } = useAuthStore();
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
        // Mode démonstration : reçu complet avec toutes les infos
        setPayment({
          id: paymentId,
          reference: "AIO-DEMO-" + String(paymentId).slice(0, 8).toUpperCase(),
          studentId: user?.id || "demo",
          universityId: "upc-001",
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
          studentName: user?.fullName || user?.username || "Étudiant Démo",
          studentNumber: user?.studentNumber || "2024-12345",
          promotion: user?.promotion || "L2 Informatique 2025-2026",
          mobileMoneyPhone: "+243812345678",
          university: {
            id: "upc-001",
            name: "Université Protestante au Congo (UPC)",
            code: "UPC",
            isActive: true,
            createdAt: new Date().toISOString(),
          },
          bank: {
            id: "equity-demo",
            name: "Equity BCDC",
            code: "EQUITY",
            universityId: "upc-001",
            isActive: true,
          },
        });
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated, paymentId, user]);

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
      <div className="min-h-screen flex items-center justify-center bg-[var(--aio-cream)]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--aio-bordeaux)]" />
      </div>
    );
  }

  if (!payment) {
    return (
      <StudentShell>
        <main className="student-content text-center py-12">
          <p className="text-gray-500">Paiement introuvable.</p>
          <Link href="/history" className="text-[var(--aio-bordeaux)] text-sm mt-4 inline-block">
            ← Retour à l&apos;historique
          </Link>
        </main>
      </StudentShell>
    );
  }

  const StatusIcon =
    payment.status === "SUCCESS"
      ? CheckCircle2
      : payment.status === "FAILED"
      ? XCircle
      : Clock;

  /** Contenu du QR : référence + montant pour vérification rapide */
  const qrPayload = encodeURIComponent(
    JSON.stringify({
      ref: payment.reference,
      amount: payment.totalAmount,
      status: payment.status,
      uni: payment.university?.code || payment.universityId,
    })
  );
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${qrPayload}`;

  const studentDisplayName =
    payment.studentName ||
    payment.student?.fullName ||
    payment.student?.username ||
    user?.fullName ||
    user?.username ||
    "—";

  return (
    <StudentShell>
      <main className="student-content space-y-6">
        <div className="flex items-center gap-3">
          <Link
            href="/history"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-soft text-gray-600 hover:text-[var(--aio-bordeaux)]"
          >
            <ArrowLeft className="h-5 w-5 stroke-[1.5]" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Reçu de paiement
          </h1>
        </div>

        {/* Carte du reçu */}
        <div className="card space-y-5">
          {/* En-tête logo + statut */}
          <div className="flex flex-col items-center py-2">
            <Image
              src="/icon.png"
              alt="AIO Pay"
              width={48}
              height={48}
              className="rounded-2xl mb-3"
            />
            <StatusIcon
              className={`h-12 w-12 stroke-[1.5] ${
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

          {/* Montant */}
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">
              {formatAmount(payment.totalAmount)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              dont {formatAmount(payment.serviceFee)} de frais de service AIO Pay
            </p>
          </div>

          <hr className="border-gray-100" />

          {/* Informations étudiant */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--aio-orange)] mb-3">
              Étudiant
            </h2>
            <div className="space-y-2.5 text-sm">
              <DetailRow label="Nom" value={studentDisplayName} />
              <DetailRow
                label="Matricule"
                value={payment.studentNumber || payment.student?.studentNumber || "—"}
              />
              <DetailRow
                label="Promotion"
                value={payment.promotion || payment.student?.promotion || "—"}
              />
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Paiement */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--aio-orange)] mb-3">
              Détails du paiement
            </h2>
            <div className="space-y-2.5 text-sm">
              <DetailRow label="Référence" value={payment.reference} />
              <DetailRow label="Motif" value={translateMotif(payment.motif)} />
              <DetailRow
                label="Université"
                value={payment.university?.name || "—"}
              />
              <DetailRow label="Banque" value={payment.bank?.name || "—"} />
              <DetailRow
                label="Mobile Money"
                value={payment.mobileMoneyPhone || "—"}
              />
              <DetailRow
                label="Date"
                value={formatDate(payment.paidAt || payment.createdAt)}
              />
              {payment.flexpayReference && (
                <DetailRow label="Réf. FlexPay" value={payment.flexpayReference} />
              )}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* QR Code */}
          <div className="flex flex-col items-center py-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--aio-orange)] mb-3">
              QR Code de vérification
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrUrl}
              alt={`QR Code ${payment.reference}`}
              width={160}
              height={160}
              className="rounded-2xl border border-gray-100"
            />
            <p className="text-xs text-gray-500 mt-2 text-center max-w-[220px]">
              Scannez ce code pour vérifier la référence {payment.reference}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-2">
            {payment.status === "SUCCESS" && (
              <button
                onClick={() =>
                  toast.info(
                    "La génération PDF sera disponible après branchement du backend."
                  )
                }
                className="btn-dark w-full"
              >
                <Download className="mr-2 h-4 w-4 stroke-[1.5]" />
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
                  <RefreshCw className="mr-2 h-4 w-4 stroke-[1.5]" />
                )}
                Vérifier le statut
              </button>
            )}
          </div>
        </div>

        <InfoBox>
          Ce reçu a la même valeur qu&apos;un paiement effectué en agence bancaire.
        </InfoBox>
      </main>
    </StudentShell>
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

/**
 * ============================================================
 * AIO PAY - Parcours de paiement (multi-étapes)
 * ============================================================
 * Étapes :
 * 1. Choix de l'université
 * 2. Choix de la banque de convenance
 * 3. Choix du motif + montant
 * 4. Récapitulatif + confirmation → redirection FlexPay
 *
 * Conforme à la section 7.1 et 7.3 de la roadmap.
 * ============================================================
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import StudentHeader from "@/components/layout/StudentHeader";
import { getUniversities, getBanksByUniversity, createPayment } from "@/lib/api";
import { formatAmount } from "@/lib/utils";
import type { University, Bank, PaymentMotif } from "@/types";
import { toast } from "sonner";
import {
  Building2,
  Landmark,
  FileText,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Check,
} from "lucide-react";

// Motifs disponibles (roadmap section 7)
const MOTIFS: { value: PaymentMotif; label: string }[] = [
  { value: "INSCRIPTION", label: "Frais d'inscription" },
  { value: "EXAMEN", label: "Frais d'examen" },
  { value: "MINERVAL", label: "Minerval" },
  { value: "FRAIS_SESSION", label: "Frais de session" },
  { value: "AUTRE", label: "Autre" },
];

// Frais de service fixe (décision prise : 1,5 USD)
const SERVICE_FEE = 1.5;

type Step = 1 | 2 | 3 | 4;

export default function PaymentPage() {
  const router = useRouter();
  const { isAuthenticated, loadUser } = useAuthStore();

  // État du parcours
  const [step, setStep] = useState<Step>(1);
  const [universities, setUniversities] = useState<University[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Données sélectionnées
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [motif, setMotif] = useState<PaymentMotif | "">("");
  const [amount, setAmount] = useState("");
  const [studentNumber, setStudentNumber] = useState("");

  // Auth guard
  useEffect(() => {
    loadUser().then(() => {
      if (!isAuthenticated) router.push("/login");
    });
  }, [isAuthenticated, loadUser, router]);

  // Charge les universités au montage
  useEffect(() => {
    if (!isAuthenticated) return;
    setLoading(true);
    getUniversities()
      .then((res) => {
        if (res.success && res.data) {
          setUniversities(res.data);
          // Si une seule université (UPC), on la pré-sélectionne
          if (res.data.length === 1) {
            setSelectedUniversity(res.data[0]);
          }
        }
      })
      .catch(() => {
        // Mode démo : on injecte UPC si le backend n'est pas encore prêt
        setUniversities([
          {
            id: "upc-demo",
            name: "Université Protestante au Congo (UPC)",
            code: "UPC",
            isActive: true,
            createdAt: new Date().toISOString(),
          },
        ]);
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  // Charge les banques quand l'université change
  useEffect(() => {
    if (!selectedUniversity) return;
    setLoading(true);
    getBanksByUniversity(selectedUniversity.id)
      .then((res) => {
        if (res.success && res.data) {
          setBanks(res.data);
        }
      })
      .catch(() => {
        // Mode démo
        setBanks([
          {
            id: "equity-demo",
            name: "Equity BCDC",
            code: "EQUITY",
            universityId: selectedUniversity.id,
            isActive: true,
          },
          {
            id: "rawbank-demo",
            name: "Rawbank",
            code: "RAWBANK",
            universityId: selectedUniversity.id,
            isActive: true,
          },
        ]);
      })
      .finally(() => setLoading(false));
  }, [selectedUniversity]);

  const totalAmount = (parseFloat(amount) || 0) + SERVICE_FEE;

  /**
   * Soumission finale → crée le paiement et redirige vers FlexPay
   */
  const handleConfirm = async () => {
    if (!selectedUniversity || !selectedBank || !motif || !amount) return;

    setSubmitting(true);
    try {
      const res = await createPayment({
        universityId: selectedUniversity.id,
        bankId: selectedBank.id,
        motif: motif as PaymentMotif,
        amount: parseFloat(amount),
        studentNumber: studentNumber || undefined,
      });

      if (res.success && res.data?.redirectUrl) {
        toast.success("Redirection vers FlexPay...");
        // Redirection vers la page de paiement FlexPay
        window.location.href = res.data.redirectUrl;
      } else {
        toast.error(res.message || "Erreur lors de la création du paiement");
      }
    } catch (err: any) {
      // Mode démo si backend pas prêt
      toast.info("Mode démonstration : le backend n'est pas encore connecté.");
      console.log("Données qui auraient été envoyées :", {
        university: selectedUniversity.name,
        bank: selectedBank.name,
        motif,
        amount,
        serviceFee: SERVICE_FEE,
        total: totalAmount,
      });
    } finally {
      setSubmitting(false);
    }
  };

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
        {/* Indicateur d'étapes */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step >= s
                    ? "bg-[#6B0F1A] text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step > s ? <Check className="h-4 w-4" /> : s}
              </div>
              {s < 4 && (
                <div
                  className={`h-0.5 w-8 sm:w-12 mx-1 ${
                    step > s ? "bg-[#6B0F1A]" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* ========== ÉTAPE 1 : Université ========== */}
        {step === 1 && (
          <div className="space-y-4">
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[#6B0F1A]" />
              Choisissez votre université
            </h1>

            {loading ? (
              <div className="card flex justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-[#6B0F1A]" />
              </div>
            ) : (
              <div className="space-y-3">
                {universities.map((uni) => (
                  <button
                    key={uni.id}
                    onClick={() => {
                      setSelectedUniversity(uni);
                      setSelectedBank(null);
                    }}
                    className={`card w-full text-left flex items-center gap-3 transition-all ${
                      selectedUniversity?.id === uni.id
                        ? "ring-2 ring-[#6B0F1A] bg-[#FDF8F6]"
                        : "hover:shadow-md"
                    }`}
                  >
                    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-[#6B0F1A] font-bold text-sm">
                      {uni.code}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{uni.name}</p>
                      <p className="text-xs text-gray-500">{uni.code}</p>
                    </div>
                    {selectedUniversity?.id === uni.id && (
                      <Check className="h-5 w-5 text-[#6B0F1A] ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => selectedUniversity && setStep(2)}
              disabled={!selectedUniversity}
              className="btn-primary w-full mt-4"
            >
              Continuer
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        )}

        {/* ========== ÉTAPE 2 : Banque ========== */}
        {step === 2 && (
          <div className="space-y-4">
            <button
              onClick={() => setStep(1)}
              className="flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Retour
            </button>

            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Landmark className="h-5 w-5 text-[#6B0F1A]" />
              Banque de convenance
            </h1>
            <p className="text-sm text-gray-500">
              Université : {selectedUniversity?.name}
            </p>

            {loading ? (
              <div className="card flex justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-[#6B0F1A]" />
              </div>
            ) : (
              <div className="space-y-3">
                {banks.map((bank) => (
                  <button
                    key={bank.id}
                    onClick={() => setSelectedBank(bank)}
                    className={`card w-full text-left flex items-center gap-3 transition-all ${
                      selectedBank?.id === bank.id
                        ? "ring-2 ring-[#6B0F1A] bg-[#FDF8F6]"
                        : "hover:shadow-md"
                    }`}
                  >
                    <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center text-green-700 font-bold text-xs">
                      {bank.code.slice(0, 3)}
                    </div>
                    <p className="font-medium text-gray-900">{bank.name}</p>
                    {selectedBank?.id === bank.id && (
                      <Check className="h-5 w-5 text-[#6B0F1A] ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => selectedBank && setStep(3)}
              disabled={!selectedBank}
              className="btn-primary w-full mt-4"
            >
              Continuer
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        )}

        {/* ========== ÉTAPE 3 : Motif + Montant ========== */}
        {step === 3 && (
          <div className="space-y-4">
            <button
              onClick={() => setStep(2)}
              className="flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Retour
            </button>

            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#6B0F1A]" />
              Détails du paiement
            </h1>

            {/* Motif */}
            <div>
              <label className="label">Motif du paiement</label>
              <div className="grid grid-cols-1 gap-2">
                {MOTIFS.map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setMotif(m.value)}
                    className={`text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                      motif === m.value
                        ? "border-[#6B0F1A] bg-[#FDF8F6] text-blue-900 font-medium"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Numéro étudiant (optionnel) */}
            <div>
              <label htmlFor="studentNumber" className="label">
                Numéro d&apos;étudiant (optionnel)
              </label>
              <input
                id="studentNumber"
                type="text"
                placeholder="Ex: 2024-12345"
                value={studentNumber}
                onChange={(e) => setStudentNumber(e.target.value)}
                className="input"
              />
            </div>

            {/* Montant */}
            <div>
              <label htmlFor="amount" className="label">
                Montant à payer (USD)
              </label>
              <input
                id="amount"
                type="number"
                inputMode="decimal"
                min="1"
                step="0.01"
                placeholder="Ex: 150"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input text-lg font-semibold"
              />
            </div>

            {/* Aperçu des frais */}
            {parseFloat(amount) > 0 && (
              <div className="rounded-xl bg-gray-100 p-4 text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Montant</span>
                  <span>{formatAmount(parseFloat(amount))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frais de service AIO Pay</span>
                  <span>{formatAmount(SERVICE_FEE)}</span>
                </div>
                <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total à payer</span>
                  <span>{formatAmount(totalAmount)}</span>
                </div>
              </div>
            )}

            <button
              onClick={() => motif && parseFloat(amount) > 0 && setStep(4)}
              disabled={!motif || !amount || parseFloat(amount) <= 0}
              className="btn-primary w-full mt-2"
            >
              Continuer
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        )}

        {/* ========== ÉTAPE 4 : Récapitulatif ========== */}
        {step === 4 && (
          <div className="space-y-4">
            <button
              onClick={() => setStep(3)}
              className="flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Retour
            </button>

            <h1 className="text-xl font-bold text-gray-900">Récapitulatif</h1>

            <div className="card space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Université</span>
                <span className="font-medium text-right">
                  {selectedUniversity?.name}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Banque</span>
                <span className="font-medium">{selectedBank?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Motif</span>
                <span className="font-medium">
                  {MOTIFS.find((m) => m.value === motif)?.label}
                </span>
              </div>
              {studentNumber && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">N° étudiant</span>
                  <span className="font-medium">{studentNumber}</span>
                </div>
              )}

              <hr className="border-gray-100" />

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Montant</span>
                <span>{formatAmount(parseFloat(amount))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Frais de service</span>
                <span>{formatAmount(SERVICE_FEE)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900">
                <span>Total</span>
                <span>{formatAmount(totalAmount)}</span>
              </div>
            </div>

            <div className="rounded-xl bg-amber-50 border border-amber-100 p-4 text-sm text-amber-800">
              Vous allez être redirigé vers FlexPay pour finaliser le paiement
              (Mobile Money ou Carte). AIO Pay ne stocke jamais vos codes PIN.
            </div>

            <button
              onClick={handleConfirm}
              disabled={submitting}
              className="btn-primary w-full"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Redirection...
                </>
              ) : (
                "Confirmer et payer"
              )}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

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
import StudentShell from "@/components/layout/StudentShell";
import { InfoBox } from "@/components/ui/fintech";
import {
  UniversityCombobox,
  DEMO_UNIVERSITIES,
  TextField,
  Select,
} from "@/components/ui/form";
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
  const { isAuthenticated, loadUser, user } = useAuthStore();

  // État du parcours
  const [step, setStep] = useState<Step>(1);
  const [universities, setUniversities] = useState<University[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loadingUnis, setLoadingUnis] = useState(false);
  const [loadingBanks, setLoadingBanks] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Données sélectionnées
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [motif, setMotif] = useState<PaymentMotif | "">("");
  const [amount, setAmount] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [promotion, setPromotion] = useState("");
  const [mobileMoneyPhone, setMobileMoneyPhone] = useState("");

  // Auth guard
  useEffect(() => {
    loadUser().then(() => {
      if (!isAuthenticated) router.push("/login");
    });
  }, [isAuthenticated, loadUser, router]);

  // Pré-remplit matricule / promotion depuis le profil
  useEffect(() => {
    if (user) {
      if (user.studentNumber) setStudentNumber(user.studentNumber);
      if (user.promotion) setPromotion(user.promotion);
    }
  }, [user]);

  // Charge les universités au montage
  useEffect(() => {
    if (!isAuthenticated) return;
    setLoadingUnis(true);
    getUniversities()
      .then((res) => {
        if (res.success && res.data) {
          setUniversities(res.data);
          if (res.data.length === 1) {
            setSelectedUniversity(res.data[0]);
          }
        }
      })
      .catch(() => {
        setUniversities(DEMO_UNIVERSITIES);
      })
      .finally(() => setLoadingUnis(false));
  }, [isAuthenticated]);

  // Pré-sélection depuis le profil si universityId connu
  useEffect(() => {
    if (!user?.universityId || selectedUniversity || universities.length === 0) return;
    const match = universities.find((u) => u.id === user.universityId);
    if (match) setSelectedUniversity(match);
  }, [user, universities, selectedUniversity]);

  // Charge les banques quand l'université change
  useEffect(() => {
    if (!selectedUniversity) return;
    setLoadingBanks(true);
    setSelectedBank(null);
    getBanksByUniversity(selectedUniversity.id)
      .then((res) => {
        if (res.success && res.data) {
          setBanks(res.data);
        }
      })
      .catch(() => {
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
      .finally(() => setLoadingBanks(false));
  }, [selectedUniversity]);

  const totalAmount = (parseFloat(amount) || 0) + SERVICE_FEE;

  /**
   * Soumission finale → crée le paiement et redirige vers FlexPay
   */
  const handleConfirm = async () => {
    if (!selectedUniversity || !selectedBank || !motif || !amount || !mobileMoneyPhone) return;

    setSubmitting(true);
    try {
      const res = await createPayment({
        universityId: selectedUniversity.id,
        bankId: selectedBank.id,
        motif: motif as PaymentMotif,
        amount: parseFloat(amount),
        studentNumber: studentNumber || undefined,
        promotion: promotion || undefined,
        mobileMoneyPhone: mobileMoneyPhone.replace(/\s+/g, ""),
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
      <div className="min-h-screen flex items-center justify-center bg-[var(--aio-cream)]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--aio-bordeaux)]" />
      </div>
    );
  }

  return (
    <StudentShell>
      <main className="student-content">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Payer</h1>
          <p className="text-sm text-gray-500 mt-1">
            Parcours en 4 étapes — université, banque, montant, confirmation.
          </p>
        </div>

        {/* Indicateur d'étapes */}
        <div className="flex items-center justify-between mb-8 px-1">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold shadow-soft ${
                  step >= s
                    ? "bg-[var(--aio-bordeaux)] text-white"
                    : "bg-white text-gray-400"
                }`}
              >
                {step > s ? <Check className="h-4 w-4 stroke-[1.5]" /> : s}
              </div>
              {s < 4 && (
                <div
                  className={`h-0.5 w-8 sm:w-14 mx-1 rounded-full ${
                    step > s ? "bg-[var(--aio-bordeaux)]" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* ========== ÉTAPE 1 : Université ========== */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[var(--aio-bordeaux)] stroke-[1.5]" />
              Votre université
            </h2>

            <div className="card space-y-4">
              <UniversityCombobox
                universities={universities}
                value={selectedUniversity}
                onChange={(uni) => {
                  setSelectedUniversity(uni);
                  setSelectedBank(null);
                }}
                label="Nom de l'université"
                required
                loading={loadingUnis}
                helperText="Tapez pour filtrer (ex. UPC, UNIKIN) ou sélectionnez dans la liste."
              />

              {selectedUniversity && (
                <div className="rounded-2xl bg-[var(--aio-cream)] px-4 py-3 text-sm">
                  <p className="font-medium text-gray-900">{selectedUniversity.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Code : {selectedUniversity.code}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => selectedUniversity && setStep(2)}
              disabled={!selectedUniversity}
              className="btn-primary w-full"
            >
              Continuer
              <ArrowRight className="ml-2 h-4 w-4 stroke-[1.5]" />
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

            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Landmark className="h-5 w-5 text-[var(--aio-bordeaux)] stroke-[1.5]" />
              Banque de convenance
            </h2>
            <p className="text-sm text-gray-500">
              Université : {selectedUniversity?.name}
            </p>

            {loadingBanks ? (
              <div className="card flex justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-[var(--aio-bordeaux)]" />
              </div>
            ) : (
              <div className="space-y-3">
                {banks.map((bank) => (
                  <button
                    key={bank.id}
                    onClick={() => setSelectedBank(bank)}
                    className={`card w-full text-left flex items-center gap-3 transition-all ${
                      selectedBank?.id === bank.id
                        ? "ring-2 ring-[var(--aio-bordeaux)] bg-[var(--aio-cream)]"
                        : "hover:shadow-soft-lg"
                    }`}
                  >
                    <div className="h-11 w-11 rounded-2xl bg-orange-50 flex items-center justify-center text-[var(--aio-orange-dark)] font-bold text-xs">
                      {bank.code.slice(0, 3)}
                    </div>
                    <p className="font-medium text-gray-900">{bank.name}</p>
                    {selectedBank?.id === bank.id && (
                      <Check className="h-5 w-5 text-[var(--aio-bordeaux)] ml-auto stroke-[1.5]" />
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

            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-[var(--aio-bordeaux)] stroke-[1.5]" />
              Détails du paiement
            </h2>

            {/* Motif */}
            <Select
              label="Motif du paiement"
              required
              placeholder="Choisir un motif"
              value={motif}
              onChange={(e) => setMotif(e.target.value as PaymentMotif | "")}
              options={MOTIFS.map((m) => ({ value: m.value, label: m.label }))}
            />

            <TextField
              id="studentNumber"
              label="Matricule"
              placeholder="Ex: 2024-12345"
              value={studentNumber}
              onChange={(e) => setStudentNumber(e.target.value)}
              helperText="Recommandé pour faciliter la réconciliation."
            />

            <TextField
              id="promotion"
              label="Promotion / Filière"
              placeholder="Ex: L2 Informatique 2025-2026"
              value={promotion}
              onChange={(e) => setPromotion(e.target.value)}
            />

            <TextField
              id="mobileMoneyPhone"
              label="Numéro Mobile Money à débiter"
              required
              type="tel"
              inputMode="numeric"
              placeholder="Ex: 081 234 5678"
              value={mobileMoneyPhone}
              onChange={(e) => setMobileMoneyPhone(e.target.value)}
              helperText="M-Pesa, Airtel Money ou Orange Money — peut différer de votre numéro de connexion."
            />

            <TextField
              id="amount"
              label="Montant à payer (USD)"
              required
              type="number"
              inputMode="decimal"
              min={1}
              step="0.01"
              placeholder="Ex: 150"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-lg font-semibold"
            />

            {/* Aperçu des frais */}
            {parseFloat(amount) > 0 && (
              <div className="rounded-3xl bg-gray-100 p-5 text-sm space-y-2">
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
              onClick={() => motif && parseFloat(amount) > 0 && mobileMoneyPhone && setStep(4)}
              disabled={!motif || !amount || parseFloat(amount) <= 0 || !mobileMoneyPhone}
              className="btn-primary w-full mt-2"
            >
              Continuer
              <ArrowRight className="ml-2 h-4 w-4 stroke-[1.5]" />
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

            <h2 className="text-lg font-bold text-gray-900">Récapitulatif</h2>

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
                  <span className="text-gray-500">Matricule</span>
                  <span className="font-medium">{studentNumber}</span>
                </div>
              )}
              {promotion && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Promotion</span>
                  <span className="font-medium text-right">{promotion}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Mobile Money</span>
                <span className="font-medium">{mobileMoneyPhone}</span>
              </div>

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

            <InfoBox>
              Vous allez être redirigé vers FlexPay pour finaliser le paiement
              (Mobile Money ou Carte). AIO Pay ne stocke jamais vos codes PIN.
            </InfoBox>

            <button
              onClick={handleConfirm}
              disabled={submitting}
              className="btn-dark w-full"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Redirection...
                </>
              ) : (
                "Confirmer et payer"
              )}
            </button>
          </div>
        )}
      </main>
    </StudentShell>
  );
}

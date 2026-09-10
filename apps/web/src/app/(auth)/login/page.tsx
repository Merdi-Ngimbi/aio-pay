/**
 * ============================================================
 * AIO PAY - Page de connexion / inscription
 * ============================================================
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/stores/auth-store";
import { TextField } from "@/components/ui/form";
import { toast } from "sonner";
import { Phone, KeyRound, ArrowLeft, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { requestOtp, verifyOtp, isLoading, error, clearError } = useAuthStore();

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const cleanPhone = phone.replace(/\s+/g, "");
    if (!/^\+?243[0-9]{9}$/.test(cleanPhone) && !/^[0-9]{9,10}$/.test(cleanPhone)) {
      toast.error("Numéro invalide. Ex: 0812345678 ou +243812345678");
      return;
    }

    const success = await requestOtp(cleanPhone);
    if (success) {
      toast.success("Code OTP envoyé par SMS");
      setStep("otp");
    } else {
      toast.error(error || "Impossible d'envoyer le code");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (otp.length !== 6) {
      toast.error("Le code OTP doit contenir 6 chiffres");
      return;
    }

    const success = await verifyOtp(phone.replace(/\s+/g, ""), otp);
    if (success) {
      toast.success("Connexion réussie !");
      router.push("/dashboard");
    } else {
      toast.error(error || "Code OTP incorrect");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center px-4 py-12"
      style={{ background: "linear-gradient(180deg, #FDF8F6 0%, #FFFFFF 100%)" }}
    >
      <div className="mx-auto w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-3">
            <Image
              src="/logo-full.png"
              alt="AIO Pay"
              width={100}
              height={100}
              className="rounded-[1.75rem] shadow-soft"
              priority
            />
          </Link>
          <p className="mt-4 text-gray-600">
            Connectez-vous pour payer vos frais académiques
          </p>
        </div>

        <div className="card">
          {step === "phone" ? (
            <form onSubmit={handleRequestOtp} className="space-y-6">
              <TextField
                id="phone"
                label="Numéro de téléphone"
                required
                type="tel"
                inputMode="numeric"
                placeholder="081 234 5678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoFocus
                leftIcon={<Phone className="h-5 w-5 stroke-[1.5]" />}
                helperText="Format : 08X XXX XXXX ou +243 8X XXX XXXX"
              />

              <button
                type="submit"
                disabled={isLoading || !phone}
                className="btn-primary w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  "Recevoir le code OTP"
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <button
                type="button"
                onClick={() => {
                  setStep("phone");
                  setOtp("");
                  clearError();
                }}
                className="flex items-center text-sm text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-1 stroke-[1.5]" />
                Modifier le numéro
              </button>

              <TextField
                id="otp"
                label="Code OTP reçu par SMS"
                required
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                autoFocus
                leftIcon={<KeyRound className="h-5 w-5 stroke-[1.5]" />}
                className="tracking-widest text-center text-lg"
                helperText={`Code envoyé au ${phone}`}
              />

              <button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className="btn-primary w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Vérification...
                  </>
                ) : (
                  "Se connecter"
                )}
              </button>

              <button
                type="button"
                onClick={handleRequestOtp}
                disabled={isLoading}
                className="w-full text-sm font-medium text-[var(--aio-bordeaux)]"
              >
                Renvoyer le code
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          En vous connectant, vous acceptez nos conditions d&apos;utilisation
          et notre politique de confidentialité.
        </p>
      </div>
    </div>
  );
}

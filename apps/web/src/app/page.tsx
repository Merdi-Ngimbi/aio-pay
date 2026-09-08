/**
 * ============================================================
 * AIO PAY - Page d'accueil (Landing)
 * ============================================================
 *
 * Rôle :
 * - Point d'entrée de l'application
 * - Présente la valeur d'AIO Pay aux étudiants
 * - Redirige vers /dashboard si l'utilisateur est déjà connecté
 *
 * Design :
 * - Thème bordeaux + orange (couleurs du logo officiel)
 * - Logo complet en en-tête
 * - CTA principal vers la connexion
 * ============================================================
 */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/stores/auth-store";
import { Smartphone, Clock, ShieldCheck, Building2 } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, loadUser } = useAuthStore();

  useEffect(() => {
    loadUser().then(() => {
      if (isAuthenticated) {
        router.push("/dashboard");
      }
    });
  }, [isAuthenticated, loadUser, router]);

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #FDF8F6 0%, #FFFFFF 100%)" }}>
      {/* Header */}
      <header className="px-4 py-5">
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/icon.png"
              alt="AIO Pay"
              width={40}
              height={40}
              className="rounded-lg"
              priority
            />
            <span className="text-xl font-bold" style={{ color: "#6B0F1A" }}>
              AIO Pay
            </span>
          </div>
          <Link href="/login" className="btn-primary text-sm px-4 py-2">
            Se connecter
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="px-4 pt-8 pb-20">
        <div className="mx-auto max-w-3xl text-center">
          {/* Logo complet centré */}
          <div className="flex justify-center mb-8">
            <Image
              src="/logo-full.png"
              alt="AIO Pay"
              width={160}
              height={160}
              className="rounded-2xl shadow-lg"
              priority
            />
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Payez vos frais académiques
            <span className="block mt-2" style={{ color: "#6B0F1A" }}>
              en quelques minutes
            </span>
          </h1>
          <p className="mt-5 text-lg text-gray-600 leading-relaxed max-w-xl mx-auto">
            Fini les longues files d&apos;attente en agence bancaire.
            Avec AIO Pay, réglez vos frais d&apos;inscription, examens ou minerval
            directement depuis votre téléphone.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/login" className="btn-primary text-base px-8 py-3.5">
              Commencer maintenant
            </Link>
            <Link href="#comment-ca-marche" className="btn-secondary text-base px-8 py-3.5">
              Comment ça marche ?
            </Link>
          </div>
        </div>

        {/* Avantages */}
        <div className="mx-auto max-w-5xl mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <FeatureCard
            icon={<Clock className="h-6 w-6" style={{ color: "#F5A623" }} />}
            title="Gain de temps"
            description="Moins de 5 minutes au lieu d'une journée en agence."
          />
          <FeatureCard
            icon={<Smartphone className="h-6 w-6" style={{ color: "#F5A623" }} />}
            title="100% mobile"
            description="Accessible depuis n'importe quel smartphone."
          />
          <FeatureCard
            icon={<ShieldCheck className="h-6 w-6" style={{ color: "#F5A623" }} />}
            title="Sécurisé"
            description="Paiement via FlexPay, agrégateur agréé BCC."
          />
          <FeatureCard
            icon={<Building2 className="h-6 w-6" style={{ color: "#F5A623" }} />}
            title="UPC & plus"
            description="Partenaire de votre université pour une réconciliation simple."
          />
        </div>

        {/* Comment ça marche */}
        <section id="comment-ca-marche" className="mx-auto max-w-3xl mt-20">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Comment ça marche ?
          </h2>
          <ol className="space-y-5">
            <Step number={1} title="Connectez-vous" description="Avec votre numéro de téléphone + code OTP reçu par SMS." />
            <Step number={2} title="Choisissez votre université et banque" description="UPC et sa banque de convenance en un clic." />
            <Step number={3} title="Indiquez le montant et payez" description="Mobile Money ou carte via FlexPay." />
            <Step number={4} title="Recevez votre reçu" description="Immédiatement, téléchargeable et valable pour l'inscription." />
          </ol>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 text-center text-sm text-gray-500">
        <p>© 2026 AIO Pay — Prototype MVP — République Démocratique du Congo</p>
        <p className="mt-1">Projet Master Réseau et Sécurité des Systèmes d&apos;Information</p>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="card text-center">
      <div
        className="mx-auto h-12 w-12 rounded-full flex items-center justify-center mb-4"
        style={{ backgroundColor: "rgba(245, 166, 35, 0.12)" }}
      >
        {icon}
      </div>
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
    </div>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <li className="flex gap-4">
      <div
        className="flex-shrink-0 h-10 w-10 rounded-full text-white flex items-center justify-center font-bold"
        style={{ backgroundColor: "#6B0F1A" }}
      >
        {number}
      </div>
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600 text-sm mt-1">{description}</p>
      </div>
    </li>
  );
}

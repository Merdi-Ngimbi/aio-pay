/**
 * ============================================================
 * AIO PAY - Page À propos
 * ============================================================
 * Présente l'application, sa mission et l'équipe (placeholder).
 * ============================================================
 */

import PublicHeader from "@/components/layout/PublicHeader";
import Footer from "@/components/layout/Footer";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDF8F6]">
      <PublicHeader />

      <main className="flex-1 mx-auto max-w-3xl px-4 py-12">
        <div className="text-center mb-10">
          <Image
            src="/logo-full.png"
            alt="AIO Pay"
            width={120}
            height={120}
            className="mx-auto rounded-2xl shadow-md mb-6"
          />
          <h1 className="text-3xl font-bold text-gray-900">À propos d&apos;AIO Pay</h1>
          <p className="mt-3 text-gray-600">
            Faciliter le paiement des frais académiques, sans perdre une journée en agence.
          </p>
        </div>

        <section className="card space-y-4 mb-8">
          <h2 className="text-xl font-semibold text-[#6B0F1A]">Notre mission</h2>
          <p className="text-gray-700 leading-relaxed">
            En République Démocratique du Congo, des milliers d&apos;étudiants passent encore
            des heures, parfois une journée entière, dans les files d&apos;attente des agences
            bancaires pour régler leurs frais d&apos;inscription, de minerval ou d&apos;examen.
          </p>
          <p className="text-gray-700 leading-relaxed">
            <strong>AIO Pay</strong> est une plateforme web qui permet de payer ces frais
            en quelques minutes depuis un téléphone, via Mobile Money ou carte bancaire,
            vers la banque de convenance de l&apos;université — avec un reçu numérique
            immédiat et une traçabilité complète.
          </p>
        </section>

        <section className="card space-y-4 mb-8">
          <h2 className="text-xl font-semibold text-[#6B0F1A]">Description de l&apos;application</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Paiement des frais académiques (inscription, examen, minerval, session…)</li>
            <li>Support de plusieurs universités : UNIKIN, UPC, UPN, UFASIC, ABA, ISAU, ISP Gombe, HEC</li>
            <li>Paiement via agrégateur agréé BCC (FlexPay) — Mobile Money &amp; carte</li>
            <li>Reçu numérique détaillé avec QR code pour vérification</li>
            <li>Historique des transactions et suivi en temps réel</li>
            <li>Frais de service transparent (équivalent transport en agence)</li>
          </ul>
        </section>

        <section className="card space-y-4 mb-8">
          <h2 className="text-xl font-semibold text-[#6B0F1A]">L&apos;équipe</h2>
          <p className="text-gray-700 leading-relaxed">
            AIO Pay est développé dans le cadre d&apos;un projet de Master en Réseau et
            Sécurité des Systèmes d&apos;Information. L&apos;équipe regroupe des passionnés
            de technologie et d&apos;inclusion financière, convaincus que les étudiants
            congolais méritent des outils modernes, simples et fiables.
          </p>
          <p className="text-sm text-gray-500 italic">
            {/* Placeholder — à remplacer par les vrais noms / rôles de l'équipe */}
            Les membres de l&apos;équipe et leurs rôles seront détaillés ici prochainement.
          </p>
        </section>

        <section className="card space-y-3">
          <h2 className="text-xl font-semibold text-[#6B0F1A]">Engagements</h2>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>• Nous ne manipulons jamais les fonds : tout transit par un agrégateur agréé BCC.</li>
            <li>• Protection des données personnelles conforme au Code du Numérique.</li>
            <li>• Transparence sur les frais de service.</li>
            <li>• Support réactif pour les étudiants et les universités partenaires.</li>
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
}

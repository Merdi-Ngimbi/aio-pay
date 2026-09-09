/**
 * ============================================================
 * AIO PAY - Footer professionnel
 * ============================================================
 *
 * Rôle :
 * - Affiche les informations de l'entreprise / projet
 * - Liens utiles (À propos, Contact, Mentions légales)
 * - Présent sur les pages publiques (accueil, login, etc.)
 *
 * Note : les textes "placeholder" pourront être remplacés
 * par les vraies infos de l'entreprise plus tard.
 * ============================================================
 */

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#6B0F1A] text-white mt-auto">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Colonne 1 : Identité */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/icon.png"
                alt="AIO Pay"
                width={36}
                height={36}
                className="rounded-lg"
              />
              <span className="text-lg font-bold">AIO Pay</span>
            </div>
            <p className="text-sm text-white/80 leading-relaxed">
              La solution simple et sécurisée pour payer vos frais académiques
              en République Démocratique du Congo, sans file d&apos;attente.
            </p>
          </div>

          {/* Colonne 2 : Navigation */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-[#F5A623]">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Se connecter
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 3 : Services */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-[#F5A623]">
              Services
            </h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li>Paiement frais d&apos;inscription</li>
              <li>Paiement minerval &amp; examens</li>
              <li>Reçu numérique instantané</li>
              <li>Suivi des transactions</li>
            </ul>
          </div>

          {/* Colonne 4 : Contact (placeholder) */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-[#F5A623]">
              Contact
            </h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li>Kinshasa, République Démocratique du Congo</li>
              <li>
                <a href="mailto:contact@aio-pay.cd" className="hover:text-white transition-colors">
                  contact@aio-pay.cd
                </a>
              </li>
              <li>
                <a href="tel:+243900000000" className="hover:text-white transition-colors">
                  +243 900 000 000
                </a>
              </li>
              <li className="pt-2 text-xs text-white/60">
                {/* Placeholder — à remplacer par les vraies infos entreprise */}
                Horaires : Lun – Ven, 8h – 17h
              </li>
            </ul>
          </div>
        </div>

        {/* Bas de footer */}
        <div className="mt-10 pt-6 border-t border-white/20 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-white/60">
          <p>© {currentYear} AIO Pay. Tous droits réservés.</p>
          <div className="flex gap-4">
            <Link href="/about" className="hover:text-white transition-colors">
              Mentions légales
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

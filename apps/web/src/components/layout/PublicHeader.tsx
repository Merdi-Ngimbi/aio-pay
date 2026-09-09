/**
 * ============================================================
 * AIO PAY - En-tête pages publiques
 * ============================================================
 * Menu de navigation pour l'accueil, À propos, Contact, etc.
 * ============================================================
 */

"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/about", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

export default function PublicHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/icon.png" alt="AIO Pay" width={32} height={32} className="rounded-lg" />
          <span className="font-bold text-[#6B0F1A]">AIO Pay</span>
        </Link>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-gray-600 hover:text-[#6B0F1A] transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <Link href="/login" className="btn-primary text-sm px-4 py-2">
            Se connecter
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-gray-600"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-2">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-2 text-sm font-medium text-gray-700"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="btn-primary w-full text-center text-sm mt-2"
          >
            Se connecter
          </Link>
        </div>
      )}
    </header>
  );
}

/**
 * ============================================================
 * AIO PAY - En-tête pages publiques (style soft)
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
    <header className="bg-white/90 backdrop-blur-md sticky top-0 z-40 shadow-soft">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/icon.png" alt="AIO Pay" width={36} height={36} className="rounded-2xl" />
          <span className="font-bold text-[var(--aio-bordeaux)]">AIO Pay</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-gray-600 hover:text-[var(--aio-bordeaux)] transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <Link href="/login" className="btn-primary text-sm px-5 py-2.5">
            Se connecter
          </Link>
        </nav>

        <button
          className="md:hidden p-2 text-gray-600 rounded-full hover:bg-gray-50"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5 stroke-[1.5]" /> : <Menu className="h-5 w-5 stroke-[1.5]" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-2.5 text-sm font-medium text-gray-700 rounded-xl px-2 hover:bg-[var(--aio-cream)]"
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

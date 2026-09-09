/**
 * ============================================================
 * AIO PAY - En-tête pages étudiant (menus principaux)
 * ============================================================
 *
 * Menus :
 * - Accueil (dashboard)
 * - Payer
 * - Historique
 * - Profil
 * - Contact
 * + Déconnexion
 *
 * Affiche le nom d'utilisateur (pas le numéro) une fois le profil renseigné.
 * ============================================================
 */

"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/stores/auth-store";
import {
  LogOut,
  UserCircle,
  Menu,
  X,
  LayoutDashboard,
  CreditCard,
  History,
  Phone,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Accueil", icon: LayoutDashboard },
  { href: "/payment", label: "Payer", icon: CreditCard },
  { href: "/history", label: "Historique", icon: History },
  { href: "/profile", label: "Profil", icon: UserCircle },
  { href: "/contact", label: "Contact", icon: Phone },
];

export default function StudentHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  /** Affiche le nom d'utilisateur en priorité (demande métier) */
  const displayName =
    user?.username || user?.fullName || "Mon compte";

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="mx-auto max-w-lg px-4 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image
            src="/icon.png"
            alt="AIO Pay"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <span className="font-bold text-[#6B0F1A]">AIO Pay</span>
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href="/profile"
            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#6B0F1A] px-2 py-1 rounded-lg"
            title="Mon profil"
          >
            <UserCircle className="h-5 w-5" />
            <span className="max-w-[80px] truncate hidden sm:inline font-medium">
              {displayName}
            </span>
          </Link>

          <button
            className="p-2 text-gray-600 md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-[#6B0F1A] hidden md:inline-flex"
            title="Se déconnecter"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Navigation desktop (sous la barre) */}
      <nav className="hidden md:flex mx-auto max-w-lg px-4 pb-2 gap-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                active
                  ? "bg-[#6B0F1A] text-white"
                  : "text-gray-600 hover:bg-[#FDF8F6] hover:text-[#6B0F1A]"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Menu mobile */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 py-2.5 text-sm font-medium text-gray-700"
              >
                <Icon className="h-4 w-4 text-[#6B0F1A]" />
                {item.label}
              </Link>
            );
          })}
          <button
            onClick={() => {
              setOpen(false);
              handleLogout();
            }}
            className="flex items-center gap-3 py-2.5 text-sm font-medium text-red-600 w-full"
          >
            <LogOut className="h-4 w-4" />
            Se déconnecter
          </button>
        </div>
      )}
    </header>
  );
}

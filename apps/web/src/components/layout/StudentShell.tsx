/**
 * ============================================================
 * AIO PAY - Shell étudiant (sidebar desktop / bottom nav mobile)
 * ============================================================
 * Layout inspiré du design fintech soft : navigation fixe
 * en bas sur mobile, barre latérale à gauche sur desktop.
 * ============================================================
 */

"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils";
import {
  Home,
  CreditCard,
  ArrowLeftRight,
  Menu,
  LogOut,
  Phone,
} from "lucide-react";

const MAIN_NAV = [
  { href: "/dashboard", label: "Accueil", icon: Home },
  { href: "/payment", label: "Payer", icon: CreditCard },
  { href: "/history", label: "Historique", icon: ArrowLeftRight },
  { href: "/profile", label: "Menu", icon: Menu },
];

const SIDEBAR_EXTRA = [
  { href: "/contact", label: "Contact", icon: Phone },
];

interface StudentShellProps {
  children: React.ReactNode;
  /** Masque le padding bas réservé à la bottom nav (ex. pages plein écran) */
  dense?: boolean;
}

export default function StudentShell({ children, dense }: StudentShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const displayName = user?.username || user?.fullName?.split(" ")[0] || "Étudiant";

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname?.startsWith(href));

  return (
    <div className="min-h-screen bg-[var(--aio-cream)] lg:flex">
      {/* ——— Sidebar desktop ——— */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 z-40 bg-white border-r border-gray-100">
        <div className="flex items-center gap-3 px-6 h-20">
          <Image
            src="/icon.png"
            alt="AIO Pay"
            width={40}
            height={40}
            className="rounded-2xl"
          />
          <div>
            <p className="font-bold text-[var(--aio-bordeaux)] leading-tight">AIO Pay</p>
            <p className="text-xs text-gray-400 truncate max-w-[140px]">{displayName}</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1">
          {MAIN_NAV.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
                  active
                    ? "bg-[var(--aio-bordeaux)] text-white shadow-soft"
                    : "text-gray-600 hover:bg-[var(--aio-cream)] hover:text-[var(--aio-bordeaux)]"
                )}
              >
                <Icon className="h-5 w-5 stroke-[1.5]" />
                {item.label === "Menu" ? "Profil" : item.label}
              </Link>
            );
          })}

          <div className="pt-4 mt-4 border-t border-gray-100 space-y-1">
            {SIDEBAR_EXTRA.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
                    active
                      ? "bg-[var(--aio-bordeaux)] text-white"
                      : "text-gray-600 hover:bg-[var(--aio-cream)] hover:text-[var(--aio-bordeaux)]"
                  )}
                >
                  <Icon className="h-5 w-5 stroke-[1.5]" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-5 w-5 stroke-[1.5]" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* ——— Contenu principal ——— */}
      <div className={cn("flex-1 lg:pl-64", dense ? "" : "")}>
        {children}
      </div>

      {/* ——— Bottom nav mobile ——— */}
      <nav
        className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-100 pb-[env(safe-area-inset-bottom)]"
        aria-label="Navigation principale"
      >
        <div className="mx-auto max-w-lg flex items-stretch justify-around px-2 pt-2 pb-2">
          {MAIN_NAV.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 py-1.5 text-[11px] font-medium transition-colors",
                  active ? "text-[var(--aio-bordeaux)]" : "text-gray-400"
                )}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-2xl transition-colors",
                    active && "bg-[var(--aio-cream)]"
                  )}
                >
                  <Icon className="h-5 w-5 stroke-[1.5]" />
                </span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

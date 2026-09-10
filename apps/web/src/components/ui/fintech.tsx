/**
 * ============================================================
 * AIO PAY - Composants UI fintech soft
 * ============================================================
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { X, Info, Eye, EyeOff, CreditCard, Wifi } from "lucide-react";

/* ——— Banner promo dismissible ——— */
export function PromoBanner({
  title,
  ctaLabel,
  ctaHref,
  storageKey = "aio-promo-dismissed",
}: {
  title: string;
  ctaLabel: string;
  ctaHref: string;
  storageKey?: string;
}) {
  const [hidden, setHidden] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(storageKey) === "1";
  });

  if (hidden) return null;

  return (
    <div className="card relative overflow-hidden !p-5">
      <button
        type="button"
        aria-label="Fermer"
        onClick={() => {
          localStorage.setItem(storageKey, "1");
          setHidden(true);
        }}
        className="absolute top-3 right-3 p-1.5 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
      >
        <X className="h-4 w-4 stroke-[1.5]" />
      </button>
      <div className="pr-8 max-w-[70%]">
        <p className="font-semibold text-gray-900 text-[15px] leading-snug">{title}</p>
        <Link
          href={ctaHref}
          className="mt-3 inline-flex items-center rounded-full bg-[var(--aio-bordeaux-dark)] px-4 py-2 text-xs font-semibold text-white"
        >
          {ctaLabel}
        </Link>
      </div>
      {/* Décoration douce (pas d'illustration externe) */}
      <div
        className="pointer-events-none absolute -right-2 -bottom-6 h-28 w-28 rounded-[1.5rem] rotate-12 opacity-90"
        style={{
          background:
            "linear-gradient(135deg, var(--aio-bordeaux) 0%, var(--aio-orange) 100%)",
        }}
      />
      <div className="pointer-events-none absolute right-6 bottom-4 h-16 w-12 rounded-lg bg-white/40 backdrop-blur-sm border border-white/50" />
    </div>
  );
}

/* ——— Carte compte / solde (carousel) ——— */
export function AccountCard({
  label = "Compte étudiant",
  balance,
  subtitle,
  variant = "primary",
  className,
}: {
  label?: string;
  balance: string;
  subtitle?: string;
  variant?: "primary" | "secondary";
  className?: string;
}) {
  const gradient =
    variant === "primary"
      ? "linear-gradient(135deg, var(--aio-bordeaux) 0%, var(--aio-bordeaux-light) 55%, var(--aio-orange) 140%)"
      : "linear-gradient(135deg, var(--aio-bordeaux-dark) 0%, #8B4513 100%)";

  return (
    <div
      className={cn(
        "relative flex-shrink-0 w-[85%] sm:w-[320px] snap-center rounded-[1.75rem] p-5 text-white min-h-[160px] flex flex-col justify-between overflow-hidden",
        className
      )}
      style={{ background: gradient, boxShadow: "var(--shadow-soft)" }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-1.5 text-white/80 text-xs font-medium">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/15">
            <CreditCard className="h-3 w-3" />
          </span>
          {label}
        </div>
        <span className="text-sm font-bold tracking-wide opacity-90">AIO</span>
      </div>
      <div>
        {subtitle && <p className="text-xs text-white/70 mb-1">{subtitle}</p>}
        <p className="text-3xl font-bold tracking-tight">{balance}</p>
      </div>
      <div className="absolute right-5 bottom-5 opacity-70">
        <Wifi className="h-6 w-6 rotate-90" />
      </div>
    </div>
  );
}

/* ——— Carte détail (écran type Cards) ——— */
export function BalanceDetailCard({
  balance,
  maskedId,
  meta,
}: {
  balance: string;
  maskedId: string;
  meta?: string;
}) {
  const [visible, setVisible] = useState(true);

  return (
    <div
      className="relative rounded-[1.75rem] p-6 text-white min-h-[200px] overflow-hidden"
      style={{
        background:
          "linear-gradient(145deg, var(--aio-bordeaux) 0%, var(--aio-bordeaux-light) 50%, var(--aio-orange-dark) 130%)",
        boxShadow: "var(--shadow-soft)",
      }}
    >
      <div className="flex justify-between items-start">
        <span className="font-bold text-lg tracking-wide">AIO Pay</span>
        <Wifi className="h-5 w-5 opacity-80 rotate-90" />
      </div>
      <div className="mt-8">
        <p className="text-xs text-white/70">Solde / total payé</p>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-3xl font-bold tracking-tight">
            {visible ? balance : "••••••"}
          </p>
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="p-1.5 rounded-full bg-white/15 hover:bg-white/25"
            aria-label={visible ? "Masquer" : "Afficher"}
          >
            {visible ? (
              <Eye className="h-4 w-4 stroke-[1.5]" />
            ) : (
              <EyeOff className="h-4 w-4 stroke-[1.5]" />
            )}
          </button>
        </div>
      </div>
      <div className="mt-6 flex justify-between items-end text-sm text-white/80">
        <span className="font-mono tracking-wider">{maskedId}</span>
        {meta && <span>{meta}</span>}
      </div>
    </div>
  );
}

/* ——— Quick action circulaire ——— */
export function QuickAction({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <Link href={href} className="quick-action">
      <span className="quick-action-btn">
        <Icon className="h-5 w-5 stroke-[1.5]" />
      </span>
      <span className="text-xs font-medium text-gray-700">{label}</span>
    </Link>
  );
}

/* ——— Ligne de transaction ——— */
export function TransactionRow({
  href,
  title,
  subtitle,
  amount,
  date,
  icon: Icon,
}: {
  href: string;
  title: string;
  subtitle?: string;
  amount: string;
  date: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Link
      href={href}
      className="card-sm flex items-center gap-3 hover:shadow-soft-lg transition-shadow"
    >
      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-[var(--aio-cream)] text-[var(--aio-bordeaux)]">
        <Icon className="h-5 w-5 stroke-[1.5]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 text-sm truncate">{title}</p>
        {subtitle && (
          <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
        )}
      </div>
      <div className="text-right flex-shrink-0">
        <p className="font-semibold text-gray-900 text-sm">{amount}</p>
        <p className="text-[11px] text-gray-400 mt-0.5">{date}</p>
      </div>
    </Link>
  );
}

/* ——— Segmented control (tabs) ——— */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex p-1 rounded-full bg-gray-100/80">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "flex-1 rounded-full px-4 py-2.5 text-sm font-medium transition-all",
            value === opt.value
              ? "bg-[var(--aio-bordeaux-dark)] text-white shadow-soft"
              : "text-gray-600 hover:text-gray-900"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

/* ——— Action circulaire avec label ——— */
export function CircleAction({
  icon: Icon,
  label,
  onClick,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
  href?: string;
}) {
  const content = (
    <>
      <span className="quick-action-btn">
        <Icon className="h-5 w-5 stroke-[1.5]" />
      </span>
      <span className="text-xs font-medium text-gray-700">{label}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className="quick-action">
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className="quick-action">
      {content}
    </button>
  );
}

/* ——— Info box ——— */
export function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="info-box">
      <Info className="h-5 w-5 flex-shrink-0 text-gray-500 stroke-[1.5] mt-0.5" />
      <div className="text-sm text-gray-600 leading-relaxed">{children}</div>
    </div>
  );
}

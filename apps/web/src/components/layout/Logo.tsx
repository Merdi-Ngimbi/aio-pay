/**
 * ============================================================
 * AIO PAY - Composant Logo
 * ============================================================
 *
 * Rôle :
 * - Affiche le logo officiel AIO Pay (icône ou version complète)
 * - Centralise l'affichage pour éviter la duplication
 *
 * Assets disponibles dans /public :
 * - icon.png        → Icône seule (X stylisé + point orange)
 * - logo-full.png   → Logo complet avec texte "AIO"
 * - icon-abstract.png → Motif abstrait (fonds / décoration)
 *
 * Résultat :
 * - Logo cliquable qui redirige vers href
 * - Taille et style adaptables via les props
 * ============================================================
 */

import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  /** Hauteur du logo en pixels */
  size?: number;
  /** Afficher le texte "AIO Pay" à côté (uniquement avec variant="icon") */
  showText?: boolean;
  /** Lien de redirection */
  href?: string;
  /** Classes CSS supplémentaires */
  className?: string;
  /**
   * Variante d'affichage :
   * - "icon"  → icône seule (recommandé pour header)
   * - "full"  → logo complet avec texte AIO
   */
  variant?: "icon" | "full";
}

export default function Logo({
  size = 40,
  showText = true,
  href = "/",
  className = "",
  variant = "icon",
}: LogoProps) {
  const src = variant === "full" ? "/logo-full.png" : "/icon.png";
  const alt = variant === "full" ? "AIO Pay" : "AIO Pay Icon";

  return (
    <Link href={href} className={`flex items-center gap-2 ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className="rounded-lg object-contain"
        priority
      />
      {showText && variant === "icon" && (
        <span
          className="text-xl font-bold"
          style={{ color: "var(--aio-bordeaux)" }}
        >
          AIO Pay
        </span>
      )}
    </Link>
  );
}

/**
 * ============================================================
 * AIO PAY - Layout racine de l'application
 * ============================================================
 *
 * Rôle :
 * - Enveloppe toutes les pages
 * - Définit les métadonnées (titre, description, favicon)
 * - Charge la police et les styles globaux
 * - Affiche les notifications toast
 * ============================================================
 */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AIO Pay | Paiement des frais académiques",
  description:
    "Payez vos frais académiques en quelques minutes depuis votre téléphone. Plus besoin de perdre une journée en agence bancaire.",
  keywords: ["paiement", "frais académiques", "RDC", "UPC", "mobile money", "AIO Pay"],
  authors: [{ name: "AIO Pay Team" }],
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster
          position="top-center"
          richColors
          closeButton
          duration={4000}
        />
      </body>
    </html>
  );
}

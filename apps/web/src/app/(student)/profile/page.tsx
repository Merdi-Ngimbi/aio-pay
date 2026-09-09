/**
 * ============================================================
 * AIO PAY - Page Profil étudiant
 * ============================================================
 *
 * L'utilisateur peut modifier :
 * - Nom d'utilisateur (affiché à la place du numéro)
 * - Nom complet
 * - Matricule
 * - Promotion
 *
 * Le numéro de téléphone du compte reste lié à l'OTP.
 * Le numéro Mobile Money est demandé au moment du paiement.
 * ============================================================
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import StudentHeader from "@/components/layout/StudentHeader";
import { toast } from "sonner";
import { ArrowLeft, Save, Loader2, User } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, user, loadUser, updateProfile } = useAuthStore();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    username: "",
    fullName: "",
    studentNumber: "",
    promotion: "",
  });

  useEffect(() => {
    loadUser().then(() => {
      if (!isAuthenticated) router.push("/login");
    });
  }, [isAuthenticated, loadUser, router]);

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username || "",
        fullName: user.fullName || "",
        studentNumber: user.studentNumber || "",
        promotion: user.promotion || "",
      });
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      updateProfile({
        username: form.username || undefined,
        fullName: form.fullName || undefined,
        studentNumber: form.studentNumber || undefined,
        promotion: form.promotion || undefined,
      });
      toast.success("Profil mis à jour avec succès");
    } catch {
      toast.error("Impossible d'enregistrer pour le moment");
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#6B0F1A]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentHeader />

      <main className="mx-auto max-w-lg px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/dashboard" className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Mon profil</h1>
        </div>

        <div className="card mb-4 flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-[#FDF8F6] flex items-center justify-center">
            <User className="h-6 w-6 text-[#6B0F1A]" />
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {form.username || form.fullName || "Étudiant"}
            </p>
            <p className="text-xs text-gray-500">{user?.phone}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="card space-y-4">
          <div>
            <label className="label" htmlFor="username">Nom d&apos;utilisateur</label>
            <input
              id="username"
              className="input"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="Ex: grace.mukendi"
            />
            <p className="text-xs text-gray-500 mt-1">
              Affiché à la place du numéro dans l&apos;application.
            </p>
          </div>

          <div>
            <label className="label" htmlFor="fullName">Nom complet</label>
            <input
              id="fullName"
              className="input"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder="Ex: Grâce Mukendi"
            />
          </div>

          <div>
            <label className="label" htmlFor="studentNumber">Matricule</label>
            <input
              id="studentNumber"
              className="input"
              value={form.studentNumber}
              onChange={(e) => setForm({ ...form, studentNumber: e.target.value })}
              placeholder="Ex: 2024-12345"
            />
          </div>

          <div>
            <label className="label" htmlFor="promotion">Promotion / Filière</label>
            <input
              id="promotion"
              className="input"
              value={form.promotion}
              onChange={(e) => setForm({ ...form, promotion: e.target.value })}
              placeholder="Ex: L2 Informatique 2025-2026"
            />
          </div>

          <div className="rounded-xl bg-amber-50 border border-amber-100 p-3 text-xs text-amber-800">
            Le numéro Mobile Money utilisé pour payer se saisit au moment du
            paiement (il peut être différent de votre numéro de compte).
          </div>

          <button type="submit" disabled={saving} className="btn-primary w-full">
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </>
            )}
          </button>
        </form>
      </main>
    </div>
  );
}

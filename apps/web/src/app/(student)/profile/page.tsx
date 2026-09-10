/**
 * ============================================================
 * AIO PAY - Page Profil étudiant
 * ============================================================
 * Écran inspiré "Cards" + formulaire unifié (TextField,
 * UniversityCombobox, Switch).
 * ============================================================
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import StudentShell from "@/components/layout/StudentShell";
import {
  BalanceDetailCard,
  CircleAction,
  SegmentedControl,
  InfoBox,
} from "@/components/ui/fintech";
import {
  TextField,
  UniversityCombobox,
  DEMO_UNIVERSITIES,
  Switch,
} from "@/components/ui/form";
import { getUniversities } from "@/lib/api";
import type { University } from "@/types";
import { toast } from "sonner";
import { maskPhone } from "@/lib/utils";
import {
  Save,
  Loader2,
  Lock,
  Eye,
  MessageCircle,
  LogOut,
} from "lucide-react";

type Tab = "profile" | "account";

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, user, loadUser, updateProfile, logout } =
    useAuthStore();
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<Tab>("profile");
  const [universities, setUniversities] = useState<University[]>([]);
  const [loadingUnis, setLoadingUnis] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [hidePhone, setHidePhone] = useState(false);
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

  useEffect(() => {
    if (!isAuthenticated) return;
    setLoadingUnis(true);
    getUniversities()
      .then((res) => {
        if (res.success && res.data) setUniversities(res.data);
      })
      .catch(() => setUniversities(DEMO_UNIVERSITIES))
      .finally(() => setLoadingUnis(false));
  }, [isAuthenticated]);

  useEffect(() => {
    if (!user?.universityId || universities.length === 0) return;
    const match = universities.find((u) => u.id === user.universityId);
    if (match) setSelectedUniversity(match);
  }, [user, universities]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      updateProfile({
        username: form.username || undefined,
        fullName: form.fullName || undefined,
        studentNumber: form.studentNumber || undefined,
        promotion: form.promotion || undefined,
        universityId: selectedUniversity?.id,
      });
      toast.success("Profil mis à jour avec succès");
    } catch {
      toast.error("Impossible d'enregistrer pour le moment");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--aio-cream)]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--aio-bordeaux)]" />
      </div>
    );
  }

  const maskedPhone = user?.phone ? maskPhone(user.phone) : "•••• ••••";

  return (
    <StudentShell>
      <main className="student-content space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Menu
          </h1>
          <button
            type="button"
            onClick={handleLogout}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-soft text-red-500 hover:bg-red-50"
            aria-label="Déconnexion"
          >
            <LogOut className="h-5 w-5 stroke-[1.5]" />
          </button>
        </div>

        <SegmentedControl
          options={[
            { value: "profile", label: "Mon profil" },
            { value: "account", label: "Mon compte" },
          ]}
          value={tab}
          onChange={setTab}
        />

        <BalanceDetailCard
          balance={form.username || form.fullName || "Étudiant"}
          maskedId={hidePhone ? "•••• ••••" : maskedPhone}
          meta={form.studentNumber || "Matricule —"}
        />

        <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
          <CircleAction
            icon={Lock}
            label="Sécurité"
            onClick={() =>
              toast.info("La sécurité repose sur l'OTP SMS à chaque connexion.")
            }
          />
          <CircleAction
            icon={Eye}
            label="Détails"
            onClick={() => setTab("account")}
          />
          <CircleAction icon={MessageCircle} label="Support" href="/contact" />
        </div>

        {tab === "profile" ? (
          <form onSubmit={handleSave} className="card space-y-4">
            <TextField
              id="username"
              label="Nom d'utilisateur"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="Ex: grace.mukendi"
              helperText="Affiché à la place du numéro dans l'application."
            />

            <TextField
              id="fullName"
              label="Nom complet"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder="Ex: Grâce Mukendi"
            />

            <UniversityCombobox
              universities={universities}
              value={selectedUniversity}
              onChange={setSelectedUniversity}
              label="Université"
              loading={loadingUnis}
              helperText="Recherchez et sélectionnez votre établissement."
            />

            <TextField
              id="studentNumber"
              label="Matricule"
              value={form.studentNumber}
              onChange={(e) =>
                setForm({ ...form, studentNumber: e.target.value })
              }
              placeholder="Ex: 2024-12345"
            />

            <TextField
              id="promotion"
              label="Promotion / Filière"
              value={form.promotion}
              onChange={(e) => setForm({ ...form, promotion: e.target.value })}
              placeholder="Ex: L2 Informatique 2025-2026"
            />

            <button type="submit" disabled={saving} className="btn-dark w-full">
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 stroke-[1.5]" />
                  Enregistrer
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="card space-y-5">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Téléphone (OTP)</span>
              <span className="font-medium">
                {hidePhone ? maskedPhone : user?.phone}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Université</span>
              <span className="font-medium text-right max-w-[60%]">
                {selectedUniversity?.name || "—"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Rôle</span>
              <span className="font-medium">{user?.role || "STUDENT"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Nom d&apos;utilisateur</span>
              <span className="font-medium">{form.username || "—"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Matricule</span>
              <span className="font-medium">{form.studentNumber || "—"}</span>
            </div>

            <Switch
              label="Masquer mon numéro sur la carte"
              checked={hidePhone}
              onCheckedChange={setHidePhone}
              helperText="Affecte uniquement l'affichage local de cette page."
            />
          </div>
        )}

        <InfoBox>
          Le numéro Mobile Money utilisé pour payer se saisit au moment du
          paiement — il peut être différent de votre numéro de compte.
        </InfoBox>
      </main>
    </StudentShell>
  );
}

/**
 * ============================================================
 * AIO PAY - Page Contact
 * ============================================================
 */

"use client";

import { useState } from "react";
import PublicHeader from "@/components/layout/PublicHeader";
import Footer from "@/components/layout/Footer";
import { TextField, Textarea, Select, Checkbox } from "@/components/ui/form";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [consent, setConsent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.message) {
      toast.error("Veuillez remplir au moins le nom et le message.");
      return;
    }
    if (!consent) {
      toast.error("Veuillez accepter d'être recontacté.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    toast.success("Message envoyé. Nous vous répondrons dans les plus brefs délais.");
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    setConsent(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--aio-cream)]">
      <PublicHeader />

      <main className="flex-1 mx-auto max-w-4xl px-4 py-12 w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Contactez-nous
          </h1>
          <p className="mt-3 text-gray-600">
            Un problème de paiement, une question ou une suggestion ? Écrivez-nous.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          <div className="card text-center">
            <Mail className="h-6 w-6 mx-auto text-[var(--aio-orange)] mb-2 stroke-[1.5]" />
            <p className="text-sm font-medium text-gray-900">Email</p>
            <a href="mailto:contact@aio-pay.cd" className="text-sm text-[var(--aio-bordeaux)]">
              contact@aio-pay.cd
            </a>
          </div>
          <div className="card text-center">
            <Phone className="h-6 w-6 mx-auto text-[var(--aio-orange)] mb-2 stroke-[1.5]" />
            <p className="text-sm font-medium text-gray-900">Téléphone</p>
            <a href="tel:+243900000000" className="text-sm text-[var(--aio-bordeaux)]">
              +243 900 000 000
            </a>
          </div>
          <div className="card text-center">
            <MapPin className="h-6 w-6 mx-auto text-[var(--aio-orange)] mb-2 stroke-[1.5]" />
            <p className="text-sm font-medium text-gray-900">Adresse</p>
            <p className="text-sm text-gray-600">Kinshasa, RDC</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-5 max-w-xl mx-auto">
          <TextField
            id="name"
            label="Nom complet"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Votre nom"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              id="email"
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="vous@email.com"
            />
            <TextField
              id="phone"
              label="Téléphone"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="08X XXX XXXX"
            />
          </div>

          <Select
            id="subject"
            label="Sujet"
            placeholder="Choisir un sujet"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            options={[
              { value: "paiement", label: "Problème de paiement" },
              { value: "recu", label: "Reçu / justificatif" },
              { value: "compte", label: "Compte / profil" },
              { value: "partenariat", label: "Partenariat université" },
              { value: "autre", label: "Autre" },
            ]}
          />

          <Textarea
            id="message"
            label="Message"
            required
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Décrivez votre demande..."
          />

          <Checkbox
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            label="J'accepte d'être recontacté(e) au sujet de ma demande."
          />

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Envoi...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4 stroke-[1.5]" />
                Envoyer le message
              </>
            )}
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}

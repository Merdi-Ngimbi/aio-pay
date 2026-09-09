/**
 * ============================================================
 * AIO PAY - Page Contact
 * ============================================================
 * Formulaire pour contacter le support en cas de problème.
 * Pour le MVP, l'envoi est simulé (toast de confirmation).
 * ============================================================
 */

"use client";

import { useState } from "react";
import PublicHeader from "@/components/layout/PublicHeader";
import Footer from "@/components/layout/Footer";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.message) {
      toast.error("Veuillez remplir au moins le nom et le message.");
      return;
    }
    setLoading(true);
    // Simulation d'envoi — à brancher sur une API / email plus tard
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    toast.success("Message envoyé. Nous vous répondrons dans les plus brefs délais.");
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDF8F6]">
      <PublicHeader />

      <main className="flex-1 mx-auto max-w-4xl px-4 py-12 w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Contactez-nous</h1>
          <p className="mt-3 text-gray-600">
            Un problème de paiement, une question ou une suggestion ? Écrivez-nous.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="card text-center">
            <Mail className="h-6 w-6 mx-auto text-[#F5A623] mb-2" />
            <p className="text-sm font-medium text-gray-900">Email</p>
            <a href="mailto:contact@aio-pay.cd" className="text-sm text-[#6B0F1A]">
              contact@aio-pay.cd
            </a>
          </div>
          <div className="card text-center">
            <Phone className="h-6 w-6 mx-auto text-[#F5A623] mb-2" />
            <p className="text-sm font-medium text-gray-900">Téléphone</p>
            <a href="tel:+243900000000" className="text-sm text-[#6B0F1A]">
              +243 900 000 000
            </a>
          </div>
          <div className="card text-center">
            <MapPin className="h-6 w-6 mx-auto text-[#F5A623] mb-2" />
            <p className="text-sm font-medium text-gray-900">Adresse</p>
            <p className="text-sm text-gray-600">Kinshasa, RDC</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-5 max-w-xl mx-auto">
          <div>
            <label className="label" htmlFor="name">Nom complet *</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="input"
              required
              placeholder="Votre nom"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="input"
                placeholder="vous@email.com"
              />
            </div>
            <div>
              <label className="label" htmlFor="phone">Téléphone</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                className="input"
                placeholder="08X XXX XXXX"
              />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="subject">Sujet</label>
            <select
              id="subject"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              className="input"
            >
              <option value="">Choisir un sujet</option>
              <option value="paiement">Problème de paiement</option>
              <option value="recu">Reçu / justificatif</option>
              <option value="compte">Compte / profil</option>
              <option value="partenariat">Partenariat université</option>
              <option value="autre">Autre</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="message">Message *</label>
            <textarea
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              className="input min-h-[120px]"
              required
              placeholder="Décrivez votre demande..."
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Envoi...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
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

"use client";

import { useState } from "react";
import { API_URL } from "@/lib/api";
import ReassuranceSection from "../../components/Global/ReassuranceSection";

const SUBJECTS = [
  { value: "", label: "Choisir un objet *" },
  { value: "question_produit", label: "Question sur un produit" },
  { value: "suivi_commande", label: "Suivi de commande" },
  { value: "probleme_commande", label: "Problème avec une commande" },
  { value: "retour_echange", label: "Retour / Échange" },
  { value: "personnalisation", label: "Demande de personnalisation" },
  { value: "partenariat", label: "Partenariat / Professionnel" },
  { value: "autre", label: "Autre" },
];

const ORDER_SUBJECTS = ["suivi_commande", "probleme_commande", "retour_echange"];

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [subject, setSubject] = useState("");

  const showOrderField = ORDER_SUBJECTS.includes(subject);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const subjectLabel = SUBJECTS.find((s) => s.value === subject)?.label || String(data.subject_other || subject);

    let fullMessage = String(data.message);
    if (data.order_reference) fullMessage += `\n\nN° commande : ${data.order_reference}`;

    try {
      const token = localStorage.getItem("access_token");
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/messages/`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
          phone: data.phone || "",
          subject: subject === "autre" ? String(data.subject_other) : subjectLabel,
          message: fullMessage,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(JSON.stringify(err));
      }

      setSuccess(true);
      setSubject("");
      e.currentTarget.reset();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <div className="w-full h-[120px] md:h-[208px] bg-[#FFF9F3]"></div>

      <section className="bg-[#EFDDD1] w-full py-12 md:py-20 min-h-[calc(100vh-140px-300px)]">
        <div className="max-w-[800px] mx-auto px-4 md:px-0">

          <div className="text-center mb-10 md:mb-16">
            <h1 className="font-serif text-3xl md:text-[55px] text-stone-900 uppercase tracking-widest mb-4 md:mb-6">
              Nous Contacter
            </h1>
            <div className="text-stone-700 text-base md:text-xl font-light italic">
              <p>Une question, une demande ?</p>
              <p>Nous serons ravis de vous répondre dans les plus brefs délais</p>
            </div>
          </div>

          {success ? (
            <div className="text-center space-y-4 py-12">
              <div className="bg-green-50 border border-green-200 p-6 max-w-md mx-auto">
                <p className="text-green-800 text-xs uppercase tracking-widest">
                  Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.
                </p>
              </div>
              <button
                onClick={() => setSuccess(false)}
                className="text-stone-500 text-[10px] uppercase tracking-widest underline hover:text-stone-900 transition-colors"
              >
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <input
                  type="text"
                  name="firstname"
                  placeholder="Prénom *"
                  required
                  className="w-full bg-white px-4 py-3 md:px-6 md:py-4 text-sm md:text-base text-stone-900 placeholder-stone-900 font-medium outline-none focus:ring-1 focus:ring-stone-500 rounded-sm"
                />
                <input
                  type="text"
                  name="lastname"
                  placeholder="Nom *"
                  required
                  className="w-full bg-white px-4 py-3 md:px-6 md:py-4 text-sm md:text-base text-stone-900 placeholder-stone-900 font-medium outline-none focus:ring-1 focus:ring-stone-500 rounded-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <input
                  type="email"
                  name="email"
                  placeholder="Email *"
                  required
                  className="w-full bg-white px-4 py-3 md:px-6 md:py-4 text-sm md:text-base text-stone-900 placeholder-stone-900 font-medium outline-none focus:ring-1 focus:ring-stone-500 rounded-sm"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Téléphone"
                  className="w-full bg-white px-4 py-3 md:px-6 md:py-4 text-sm md:text-base text-stone-900 placeholder-stone-900 font-medium outline-none focus:ring-1 focus:ring-stone-500 rounded-sm"
                />
              </div>

              {/* Objet — menu déroulant */}
              <div className="relative">
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  className="w-full bg-white px-4 py-3 md:px-6 md:py-4 text-sm md:text-base text-stone-900 font-medium outline-none focus:ring-1 focus:ring-stone-500 rounded-sm appearance-none cursor-pointer"
                >
                  {SUBJECTS.map((s) => (
                    <option key={s.value} value={s.value} disabled={s.value === ""}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 pointer-events-none text-stone-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>

              {/* Objet personnalisé si "Autre" */}
              {subject === "autre" && (
                <input
                  type="text"
                  name="subject_other"
                  placeholder="Précisez votre objet *"
                  required
                  className="w-full bg-white px-4 py-3 md:px-6 md:py-4 text-sm md:text-base text-stone-900 placeholder-stone-400 font-medium outline-none focus:ring-1 focus:ring-stone-500 rounded-sm"
                />
              )}

              {/* Numéro de commande — visible si sujet lié aux commandes */}
              {showOrderField && (
                <input
                  type="text"
                  name="order_reference"
                  placeholder="N° de commande (ex: CMD-XXXXXXXX)"
                  className="w-full bg-white px-4 py-3 md:px-6 md:py-4 text-sm md:text-base text-stone-900 placeholder-stone-400 font-medium outline-none focus:ring-1 focus:ring-stone-500 rounded-sm"
                />
              )}

              {/* Message */}
              <textarea
                name="message"
                rows={8}
                placeholder="Message *"
                required
                className="w-full bg-white px-4 py-3 md:px-6 md:py-4 text-sm md:text-base text-stone-900 placeholder-stone-900 font-medium outline-none focus:ring-1 focus:ring-stone-500 rounded-sm resize-none"
              ></textarea>

              {/* RGPD */}
              <div className="flex items-start gap-3 mt-2">
                <input
                  type="checkbox"
                  id="rgpd"
                  name="rgpd"
                  required
                  className="mt-1 accent-stone-900 cursor-pointer w-4 h-4 shrink-0"
                />
                <label htmlFor="rgpd" className="text-[10px] md:text-xs text-stone-700 font-light cursor-pointer select-none leading-relaxed">
                  En soumettant ce formulaire, j&apos;accepte que les informations saisies soient exploitées dans le cadre de ma demande et de la relation commerciale qui peut en découler. <span className="text-red-500">*</span>
                </label>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 p-4">
                  <p className="text-red-800 text-xs uppercase tracking-widest">{error}</p>
                </div>
              )}

              <div className="mt-2 md:mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#6F1E1A] text-white font-medium uppercase tracking-[0.1em] px-8 py-3 md:py-4 shadow-md hover:bg-[#43120F] transition-colors w-full md:w-auto text-sm md:text-base rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Envoi en cours..." : "Envoyer"}
                </button>
              </div>
            </form>
          )}

        </div>
      </section>

      <ReassuranceSection />
    </main>
  );
}
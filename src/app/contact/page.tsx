"use client";

import { useState } from "react";
import ReassuranceSection from "../../components/Global/ReassuranceSection";
import { API_URL } from "@/lib/api";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch(`${API_URL}/messages/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
          phone: data.phone || "",
          subject: data.subject,
          message: data.message,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(JSON.stringify(err));
      }

      setSuccess(true);
      e.currentTarget.reset();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
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
            <div className="text-center py-16 space-y-4">
              <p className="font-serif italic text-2xl text-stone-900">Message envoyé !</p>
              <p className="text-stone-600 text-sm">Nous vous répondrons dans les plus brefs délais.</p>
              <button
                onClick={() => setSuccess(false)}
                className="mt-4 text-xs uppercase tracking-widest text-stone-500 hover:text-stone-900 underline"
              >
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <input type="text" name="firstname" placeholder="Prénom" required
                  className="w-full bg-white px-4 py-3 md:px-6 md:py-4 text-sm md:text-base text-stone-900 placeholder-stone-900 font-medium outline-none focus:ring-1 focus:ring-stone-500 rounded-sm" />
                <input type="text" name="lastname" placeholder="Nom" required
                  className="w-full bg-white px-4 py-3 md:px-6 md:py-4 text-sm md:text-base text-stone-900 placeholder-stone-900 font-medium outline-none focus:ring-1 focus:ring-stone-500 rounded-sm" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <input type="email" name="email" placeholder="Email" required
                  className="w-full bg-white px-4 py-3 md:px-6 md:py-4 text-sm md:text-base text-stone-900 placeholder-stone-900 font-medium outline-none focus:ring-1 focus:ring-stone-500 rounded-sm" />
                <input type="tel" name="phone" placeholder="Téléphone"
                  className="w-full bg-white px-4 py-3 md:px-6 md:py-4 text-sm md:text-base text-stone-900 placeholder-stone-900 font-medium outline-none focus:ring-1 focus:ring-stone-500 rounded-sm" />
              </div>

              <input type="text" name="subject" placeholder="Objet" required
                className="w-full bg-white px-4 py-3 md:px-6 md:py-4 text-sm md:text-base text-stone-900 placeholder-stone-900 font-medium outline-none focus:ring-1 focus:ring-stone-500 rounded-sm" />

              <textarea name="message" rows={8} placeholder="Message" required
                className="w-full bg-white px-4 py-3 md:px-6 md:py-4 text-sm md:text-base text-stone-900 placeholder-stone-900 font-medium outline-none focus:ring-1 focus:ring-stone-500 rounded-sm resize-none" />

              <div className="flex items-start gap-3 mt-2">
                <input type="checkbox" id="rgpd" name="rgpd" required
                  className="mt-1 accent-stone-900 cursor-pointer w-4 h-4 shrink-0" />
                <label htmlFor="rgpd" className="text-[10px] md:text-xs text-stone-700 font-light cursor-pointer select-none leading-relaxed">
                  En soumettant ce formulaire, j&apos;accepte que les informations saisies soient exploitées dans le cadre de ma demande et de la relation commerciale qui peut en découler.
                </label>
              </div>

              {error && (
                <p className="text-red-800 text-xs uppercase tracking-widest">{error}</p>
              )}

              <div className="mt-2 md:mt-6">
                <button type="submit" disabled={loading}
                  className="bg-[#6F1E1A] text-white font-medium uppercase tracking-[0.1em] px-8 py-3 md:py-4 shadow-md hover:bg-[#43120F] transition-colors w-full md:w-auto text-sm md:text-base rounded-sm disabled:opacity-50">
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
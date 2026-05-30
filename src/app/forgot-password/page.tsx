"use client";

import { useState } from "react";
import Link from "next/link";
import { API_URL } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await fetch(`${API_URL}/auth/password-reset/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      // On affiche toujours le message de succès même si l'email n'existe pas
      setSent(true);
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-full h-[120px] md:h-[208px] bg-[#FDFBF7]"></div>

      <section className="bg-[#EFDDD1] min-h-[calc(100vh-140px)] flex items-center justify-center py-10 md:py-20 px-4">
        <div className="bg-white w-full max-w-[500px] p-6 sm:p-10 md:p-16 shadow-sm">

          <div className="text-center mb-8 md:mb-12">
            <h1 className="font-serif text-2xl md:text-4xl text-stone-900 uppercase tracking-[0.2em] mb-3 md:mb-4">
              Mot de passe oublié
            </h1>
            <p className="text-stone-500 text-[10px] md:text-xs uppercase tracking-widest font-light">
              Entrez votre email pour recevoir un lien de réinitialisation
            </p>
          </div>

          {sent ? (
            <div className="text-center space-y-6">
              <div className="bg-green-50 border border-green-100 p-4">
                <p className="text-green-700 text-[10px] uppercase tracking-widest">
                  Si cet email existe, un lien a été envoyé.
                </p>
              </div>
              <Link
                href="/login"
                className="inline-block text-stone-900 text-[10px] uppercase tracking-widest border-b border-stone-900 pb-1 hover:opacity-50 transition-opacity"
              >
                Retour à la connexion
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">

              {error && (
                <div className="bg-red-50 text-red-600 p-3 text-[10px] uppercase tracking-widest text-center border border-red-100">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">
                  Email
                </label>
                <input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#FDFBF7] border border-stone-200 px-4 py-3 md:py-4 text-sm outline-none focus:border-stone-900 transition-colors font-light"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-stone-900 text-white py-4 md:py-5 uppercase tracking-[0.3em] text-[10px] md:text-[11px] font-bold hover:bg-stone-800 transition-colors duration-500 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Envoi..." : "Envoyer"}
              </button>

              <div className="text-center">
                <Link
                  href="/login"
                  className="text-stone-400 text-[10px] uppercase tracking-widest hover:text-stone-900 transition-colors"
                >
                  Retour à la connexion
                </Link>
              </div>

            </form>
          )}

        </div>
      </section>
    </>
  );
}
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { API_URL } from "@/lib/api";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) router.push("/forgot-password");
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/password-reset/confirm/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || data.detail || "Lien invalide ou expiré.");
      }

      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) return null;

  return (
    <>
      <div className="w-full h-[120px] md:h-[208px] bg-[#FDFBF7]"></div>

      <section className="bg-[#EFDDD1] min-h-[calc(100vh-140px)] flex items-center justify-center py-10 md:py-20 px-4">
        <div className="bg-white w-full max-w-[500px] p-6 sm:p-10 md:p-16 shadow-sm">

          <div className="text-center mb-8 md:mb-12">
            <h1 className="font-serif text-2xl md:text-4xl text-stone-900 uppercase tracking-[0.2em] mb-3 md:mb-4">
              Nouveau mot de passe
            </h1>
            <p className="text-stone-500 text-[10px] md:text-xs uppercase tracking-widest font-light">
              Choisissez un nouveau mot de passe sécurisé
            </p>
          </div>

          {success ? (
            <div className="text-center space-y-4">
              <div className="bg-green-50 border border-green-100 p-4">
                <p className="text-green-700 text-[10px] uppercase tracking-widest">
                  Mot de passe modifié. Redirection en cours...
                </p>
              </div>
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
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#FDFBF7] border border-stone-200 pl-4 pr-12 py-3 md:py-4 text-sm outline-none focus:border-stone-900 transition-colors font-light"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    required
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="w-full bg-[#FDFBF7] border border-stone-200 pl-4 pr-12 py-3 md:py-4 text-sm outline-none focus:border-stone-900 transition-colors font-light"
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                    {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-stone-900 text-white py-4 md:py-5 uppercase tracking-[0.3em] text-[10px] md:text-[11px] font-bold hover:bg-stone-800 transition-colors duration-500 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Réinitialisation..." : "Réinitialiser"}
              </button>

            </form>
          )}

        </div>
      </section>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}
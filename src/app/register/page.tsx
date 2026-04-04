"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { authService } from "@/services/auth";

export default function RegisterPage() {
  const router = useRouter(); // Déclaration du router
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!agreeTerms) {
      setError("Vous devez accepter les conditions d'utilisation.");
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{12,}$/;
    if (!passwordRegex.test(password)) {
      setError("Le mot de passe doit contenir au moins 12 caractères. Une majuscule, une minuscule, un chiffre et un caractère spécial (@$!%*?&#).");
      return;
    }

    setIsLoading(true);

    try {
      await authService.register({
        firstname,
        lastname,
        email,
        password,
      });

      // Conservation de la version feature
      router.push("/");
      router.refresh();
      
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue lors de l'inscription.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-full h-[208px] bg-[#FDFBF7]"></div>

      <section className="bg-[#EFDDD1] min-h-[calc(100vh-140px)] flex items-center justify-center py-20 px-4">
        <div className="bg-white w-full max-w-[500px] p-10 md:p-16 shadow-sm">
          
          <div className="text-center mb-12">
            <h1 className="font-serif text-3xl md:text-4xl text-stone-900 uppercase tracking-[0.2em] mb-4">
              Inscription
            </h1>
            <p className="text-stone-500 text-xs uppercase tracking-widest font-light">
              Rejoignez l&apos;univers Shad&apos;s Candle
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-xs text-center uppercase tracking-wider">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">
                  Prénom
                </label>
                <input
                  type="text"
                  required
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  className="w-full bg-[#FDFBF7] border border-stone-200 px-4 py-4 text-sm outline-none focus:border-stone-900 transition-colors placeholder-stone-300 font-light"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">
                  Nom
                </label>
                <input
                  type="text"
                  required
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  className="w-full bg-[#FDFBF7] border border-stone-200 px-4 py-4 text-sm outline-none focus:border-stone-900 transition-colors placeholder-stone-300 font-light"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FDFBF7] border border-stone-200 px-4 py-4 text-sm outline-none focus:border-stone-900 transition-colors placeholder-stone-300 font-light"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={12} // Conservation de la version feature
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Votre mot de passe"
                  className="w-full bg-[#FDFBF7] border border-stone-200 pl-4 pr-12 py-4 text-sm outline-none focus:border-stone-900 transition-colors placeholder-stone-300 font-light"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors focus:outline-none z-10 cursor-pointer p-1"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="text-[9px] text-stone-400 mt-1 uppercase tracking-widest">
                Min. 12 caractères. 1 majuscule, 1 chiffre, 1 caractère spécial.
              </p>
            </div>

            <div className="flex items-start gap-3 py-2">
              <input
                type="checkbox"
                required
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1 accent-stone-900"
              />
              <label className="text-[10px] text-stone-500 leading-relaxed uppercase tracking-wider">
                J&apos;accepte les conditions d&apos;utilisation et la politique de confidentialité.
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-stone-900 text-white py-5 uppercase tracking-[0.3em] text-[11px] font-bold hover:bg-stone-800 transition-colors duration-500 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Création en cours..." : "Créer mon compte"}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-stone-100 text-center">
            <p className="text-stone-400 text-[11px] uppercase tracking-widest mb-4">
              Vous avez déjà un compte&nbsp;?
            </p>
            <Link
              href="/login"
              className="inline-block text-stone-900 text-[11px] font-bold uppercase tracking-[0.2em] border-b border-stone-900 pb-1 hover:opacity-50 transition-opacity"
            >
              Se Connecter
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
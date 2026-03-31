"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { authService } from "@/services/auth";

export default function LoginPage() {
  const router = useRouter();

  // États du formulaire
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // États de l'interface
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Appel à ton API Django via le service d'authentification
      await authService.login({ email, password });
      
      // Si la connexion réussit, on redirige vers l'accueil
      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Identifiants incorrects.");
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
              Connexion
            </h1>
            <p className="text-stone-500 text-xs uppercase tracking-widest font-light">
              Ravi de vous revoir
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Affichage des erreurs */}
            {error && (
              <div className="bg-red-50 text-red-600 p-4 text-[10px] uppercase tracking-widest text-center border border-red-100 italic">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="inputEmail" className="text-[10px] uppercase tracking-widest font-bold text-stone-400">
                Email
              </label>
              <input
                type="email"
                id="inputEmail"
                required
                autoFocus
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FDFBF7] border border-stone-200 px-4 py-4 text-sm outline-none focus:border-stone-900 transition-colors font-light"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="inputPassword" className="text-[10px] uppercase tracking-widest font-bold text-stone-400">
                Mot de passe
              </label>

              {/* Conteneur relatif pour l'oeil */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="inputPassword"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#FDFBF7] border border-stone-200 pl-4 pr-12 py-4 text-sm outline-none focus:border-stone-900 transition-colors font-light"
                />

                {/* Bouton Oeil */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 block" />
                  ) : (
                    <Eye className="w-5 h-5 block" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-stone-900 text-white py-5 uppercase tracking-[0.3em] text-[11px] font-bold hover:bg-stone-800 transition-colors duration-500 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Connexion..." : "Se connecter"}
            </button>

            <div className="mt-12 pt-8 border-t border-stone-100 text-center">
              <p className="text-stone-400 text-[11px] uppercase tracking-widest mb-4">
                Nouveau chez nous ?
              </p>
              <Link
                href="/register"
                className="inline-block text-stone-900 text-[11px] font-bold uppercase tracking-[0.2em] border-b border-stone-900 pb-1 hover:opacity-50 transition-opacity"
              >
                Créer un compte
              </Link>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
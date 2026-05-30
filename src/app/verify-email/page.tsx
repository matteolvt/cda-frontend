"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { API_URL } from "@/lib/api";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      router.push("/");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/verify-email/?token=${token}`);

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || data.detail || "Lien invalide ou expiré.");
        }

        setStatus("success");
      } catch (err: unknown) {
        setMessage(err instanceof Error ? err.message : "Une erreur est survenue.");
        setStatus("error");
      }
    };

    verify();
  }, [token, router]);

  return (
    <>
      <div className="w-full h-[120px] md:h-[208px] bg-[#FDFBF7]"></div>

      <section className="bg-[#EFDDD1] min-h-[calc(100vh-140px)] flex items-center justify-center py-10 md:py-20 px-4">
        <div className="bg-white w-full max-w-[500px] p-6 sm:p-10 md:p-16 shadow-sm text-center space-y-6">

          {status === "loading" && (
            <>
              <h1 className="font-serif text-2xl md:text-4xl text-stone-900 uppercase tracking-[0.2em]">
                Vérification
              </h1>
              <p className="text-stone-400 text-[10px] uppercase tracking-widest animate-pulse">
                Vérification en cours...
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <h1 className="font-serif text-2xl md:text-4xl text-stone-900 uppercase tracking-[0.2em]">
                Email vérifié
              </h1>
              <div className="bg-green-50 border border-green-100 p-4">
                <p className="text-green-700 text-[10px] uppercase tracking-widest">
                  Votre email a bien été vérifié. Vous pouvez maintenant vous connecter.
                </p>
              </div>
              <Link
                href="/login"
                className="inline-block text-stone-900 text-[10px] uppercase tracking-widest border-b border-stone-900 pb-1 hover:opacity-50 transition-opacity"
              >
                Se connecter
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <h1 className="font-serif text-2xl md:text-4xl text-stone-900 uppercase tracking-[0.2em]">
                Erreur
              </h1>
              <div className="bg-red-50 border border-red-100 p-4">
                <p className="text-red-700 text-[10px] uppercase tracking-widest">
                  {message || "Lien invalide ou expiré."}
                </p>
              </div>
              <Link
                href="/login"
                className="inline-block text-stone-400 text-[10px] uppercase tracking-widest hover:text-stone-900 transition-colors"
              >
                Retour à la connexion
              </Link>
            </>
          )}

        </div>
      </section>
    </>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  );
}
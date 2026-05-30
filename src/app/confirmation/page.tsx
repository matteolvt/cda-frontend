"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      router.push("/");
      return;
    }
    clearCart();
    localStorage.removeItem("shads_order_address");
  }, [sessionId]);

  if (!sessionId) return null;

  return (
    <>
      <div className="w-full h-[120px] md:h-[208px] bg-[#FDFBF7]"></div>

      <section className="bg-[#EFDDD1] min-h-[calc(100vh-140px)] flex items-center justify-center py-10 md:py-20 px-4">
        <div className="bg-white w-full max-w-[500px] p-6 sm:p-10 md:p-16 shadow-sm border border-[#EFDDD1] text-center space-y-8">
          
          <div className="flex justify-center">
            <CheckCircle className="text-green-600 w-14 h-14 md:w-16 md:h-16" />
          </div>

          <div className="space-y-3">
            <h1 className="font-serif text-2xl md:text-4xl text-stone-900 uppercase tracking-[0.15em]">
              Commande confirmée
            </h1>
            <p className="text-stone-500 text-[10px] md:text-xs uppercase tracking-widest font-light">
              Merci pour votre achat. Vous recevrez un email de confirmation sous peu.
            </p>
          </div>

          <div className="pt-6 border-t border-stone-100 space-y-3">
            <Link
              href="/produits"
              className="block w-full bg-stone-900 text-white py-4 md:py-5 uppercase tracking-[0.3em] text-[10px] md:text-[11px] font-bold hover:bg-stone-800 transition-colors duration-500 shadow-lg"
            >
              Continuer mes achats
            </Link>
            <Link
              href="/profile"
              className="block w-full border border-stone-300 text-stone-600 py-4 md:py-5 uppercase tracking-[0.3em] text-[10px] md:text-[11px] font-bold hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-colors"
            >
              Voir mes commandes
            </Link>
          </div>

        </div>
      </section>
    </>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#EFDDD1] flex items-center justify-center">
        <p className="text-stone-500 text-xs uppercase tracking-widest animate-pulse">Chargement...</p>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}

export default function ConfirmationPage() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <Suspense fallback={<div className="text-stone-500 text-sm uppercase tracking-widest animate-pulse">Chargement de votre confirmation...</div>}>
        <ConfirmationContent />
      </Suspense>
    </div>
  );
}
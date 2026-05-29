"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { CheckCircle } from "lucide-react";


function ConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { cart, isLogged, clearCart } = useCart();
  const [orderCreated, setOrderCreated] = useState(false);
  const [error, setError] = useState("");

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      router.push("/");
      return;
    }

    if (!isLogged || cart.length === 0 || orderCreated) return;

    const createOrder = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const items = cart.map((item) => ({
          // Petite note : Vérifie si c'est item.product.id ou item.product.product_id
          // selon comment ton CartContext est fait !
          product_id: item.product.id, 
          quantity: item.quantity,
        }));

        console.log("Token:", token);
        console.log("Items:", items);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ items }),
        });

        console.log("Status:", res.status);
        const data = await res.json();
        console.log("Response:", data);

        if (!res.ok) {
          throw new Error(data.errors?.[0] || data.detail || "Erreur création commande");
        }

        setOrderCreated(true);
        clearCart();
      } catch (err: any) {
        setError(err.message);
      }
    };

    createOrder();
  }, [sessionId, isLogged, cart, orderCreated, router, clearCart]);

  if (!sessionId) return null;

  return (
    <div className="max-w-md w-full text-center space-y-8">
      <div className="flex justify-center">
        <CheckCircle className="text-green-600 w-16 h-16" />
      </div>

      <div className="space-y-3">
        <h1 className="font-serif italic text-3xl md:text-4xl text-stone-900">
          Commande confirmée
        </h1>
        <p className="text-stone-500 text-sm tracking-wide">
          Merci pour votre achat. Vous recevrez un email de confirmation sous peu.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 p-4">
          <p className="text-red-800 text-xs uppercase tracking-widest">{error}</p>
        </div>
      )}

      {orderCreated && (
        <div className="bg-green-50 border border-green-200 p-4">
          <p className="text-green-800 text-xs uppercase tracking-widest">
            Commande enregistrée avec succès
          </p>
        </div>
      )}

      <div className="border-t border-stone-200 pt-8 space-y-4">
        <Link
          href="/produits"
          className="block w-full bg-stone-900 text-white py-4 uppercase tracking-widest text-xs hover:bg-stone-700 transition duration-300"
        >
          Continuer mes achats
        </Link>
        <Link
          href="/profile"
          className="block w-full border border-stone-300 text-stone-900 py-4 uppercase tracking-widest text-xs hover:bg-stone-100 transition duration-300"
        >
          Voir mes commandes
        </Link>
      </div>
    </div>
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
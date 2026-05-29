"use client";

import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function CommandePage() {
  const { cart, isLogged } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    country: "France",
  });

  const displayTotal = cart.reduce(
    (acc, item) => acc + (item.product.price / 100) * item.quantity,
    0
  );

  useEffect(() => {
    if (!isLogged) {
      router.push("/login?redirect=/commande");
    }
    if (cart.length === 0) {
      router.push("/panier");
    }
  }, [isLogged, cart, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Erreur lors de la création de la session");

      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (!isLogged || cart.length === 0) return null;

  return (
    <div className="min-h-screen bg-stone-50 pt-32 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-serif italic text-3xl md:text-4xl text-stone-900 mb-10 text-center">
          Finaliser la commande
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Formulaire adresse */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="uppercase tracking-widest text-xs text-stone-500 mb-6">
              Adresse de livraison
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Prénom</label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={form.firstName}
                  onChange={handleChange}
                  className="w-full border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 focus:outline-none focus:border-stone-400"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Nom</label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={form.lastName}
                  onChange={handleChange}
                  className="w-full border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 focus:outline-none focus:border-stone-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Email</label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 focus:outline-none focus:border-stone-400"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Adresse</label>
              <input
                type="text"
                name="address"
                required
                value={form.address}
                onChange={handleChange}
                className="w-full border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 focus:outline-none focus:border-stone-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Ville</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={form.city}
                  onChange={handleChange}
                  className="w-full border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 focus:outline-none focus:border-stone-400"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Code postal</label>
                <input
                  type="text"
                  name="postalCode"
                  required
                  value={form.postalCode}
                  onChange={handleChange}
                  className="w-full border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 focus:outline-none focus:border-stone-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Pays</label>
              <input
                type="text"
                name="country"
                required
                value={form.country}
                onChange={handleChange}
                className="w-full border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 focus:outline-none focus:border-stone-400"
              />
            </div>

            {error && (
              <p className="text-red-800 text-xs uppercase tracking-widest">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-stone-900 text-white py-4 uppercase tracking-widest text-xs hover:bg-stone-700 transition duration-300 disabled:opacity-50 mt-4"
            >
              {loading ? "Redirection..." : "Payer avec Stripe"}
            </button>
          </form>

          {/* Récap commande */}
          <div>
            <h2 className="uppercase tracking-widest text-xs text-stone-500 mb-6">
              Récapitulatif
            </h2>

            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4 border-b border-stone-100 pb-4">
                  {item.product.image && (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <p className="text-sm text-stone-900">{item.product.name}</p>
                    {item.custom_name && (
                      <p className="text-xs text-stone-400">Prénom : {item.custom_name}</p>
                    )}
                    {item.custom_scent && (
                      <p className="text-xs text-stone-400">Parfum : {item.custom_scent}</p>
                    )}
                    <p className="text-xs text-stone-500 mt-1">Qté : {item.quantity}</p>
                  </div>
                  <p className="text-sm text-stone-900">
                    {((item.product.price / 100) * item.quantity).toFixed(2)} €
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-stone-200 pt-4 space-y-2">
              <div className="flex justify-between text-xs uppercase tracking-widest text-stone-500">
                <span>Sous-total</span>
                <span>{displayTotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-xs uppercase tracking-widest text-stone-500">
                <span>Livraison</span>
                <span>Gratuite</span>
              </div>
              <div className="flex justify-between text-sm uppercase tracking-widest text-stone-900 font-medium pt-2 border-t border-stone-200">
                <span>Total</span>
                <span>{displayTotal.toFixed(2)} €</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
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
    addressComplement: "",
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
      localStorage.setItem("shads_order_address", JSON.stringify(form));
      const token = localStorage.getItem("access_token");

      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart, token, address: form }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de la création de la session");
      window.location.href = data.url;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      setLoading(false);
    }
  };

  if (!isLogged || cart.length === 0) return null;

  return (
    <>
      <div className="w-full h-[120px] md:h-[208px] bg-[#FDFBF7]"></div>

      <section className="bg-[#EFDDD1] min-h-[calc(100vh-140px)] py-10 md:py-16 px-4 md:px-12">
        <div className="max-w-[1100px] mx-auto">
          <h1 className="font-serif text-2xl md:text-4xl text-stone-900 uppercase tracking-[0.15em] mb-8 md:mb-12 text-center">
            Finaliser la commande
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="bg-white p-5 md:p-8 shadow-sm border border-[#EFDDD1]">
              <h2 className="text-[10px] md:text-xs uppercase tracking-widest text-stone-400 mb-6 md:mb-8">
                Adresse de livraison
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-2">Prénom</label>
                    <input type="text" name="firstName" required value={form.firstName} onChange={handleChange}
                      className="w-full border border-stone-200 bg-[#FDFBF7] px-3 md:px-4 py-3 text-sm text-stone-900 focus:outline-none focus:border-stone-900 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-2">Nom</label>
                    <input type="text" name="lastName" required value={form.lastName} onChange={handleChange}
                      className="w-full border border-stone-200 bg-[#FDFBF7] px-3 md:px-4 py-3 text-sm text-stone-900 focus:outline-none focus:border-stone-900 transition-colors" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-2">Email</label>
                  <input type="email" name="email" required value={form.email} onChange={handleChange}
                    className="w-full border border-stone-200 bg-[#FDFBF7] px-3 md:px-4 py-3 text-sm text-stone-900 focus:outline-none focus:border-stone-900 transition-colors" />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-2">Adresse</label>
                  <input type="text" name="address" required value={form.address} onChange={handleChange}
                    className="w-full border border-stone-200 bg-[#FDFBF7] px-3 md:px-4 py-3 text-sm text-stone-900 focus:outline-none focus:border-stone-900 transition-colors" />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-2">
                    Complément d&apos;adresse <span className="text-stone-300 normal-case">(facultatif)</span>
                  </label>
                  <input type="text" name="addressComplement" value={form.addressComplement} onChange={handleChange}
                    placeholder="Bâtiment, étage, interphone..."
                    className="w-full border border-stone-200 bg-[#FDFBF7] px-3 md:px-4 py-3 text-sm text-stone-900 focus:outline-none focus:border-stone-900 transition-colors placeholder:text-stone-300" />
                </div>

                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-2">Ville</label>
                    <input type="text" name="city" required value={form.city} onChange={handleChange}
                      className="w-full border border-stone-200 bg-[#FDFBF7] px-3 md:px-4 py-3 text-sm text-stone-900 focus:outline-none focus:border-stone-900 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-2">Code postal</label>
                    <input type="text" name="postalCode" required value={form.postalCode} onChange={handleChange}
                      className="w-full border border-stone-200 bg-[#FDFBF7] px-3 md:px-4 py-3 text-sm text-stone-900 focus:outline-none focus:border-stone-900 transition-colors" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-2">Pays</label>
                  <input type="text" name="country" required value={form.country} onChange={handleChange}
                    className="w-full border border-stone-200 bg-[#FDFBF7] px-3 md:px-4 py-3 text-sm text-stone-900 focus:outline-none focus:border-stone-900 transition-colors" />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-100 p-3">
                    <p className="text-red-800 text-[10px] uppercase tracking-widest">{error}</p>
                  </div>
                )}

                <button type="submit" disabled={loading}
                  className="w-full bg-stone-900 text-white py-4 md:py-5 uppercase tracking-[0.3em] text-[10px] md:text-[11px] font-bold hover:bg-stone-800 transition-colors duration-500 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-2">
                  {loading ? "Redirection..." : "Payer avec Stripe"}
                </button>
              </div>
            </form>

            {/* Récapitulatif */}
            <div className="bg-white p-5 md:p-8 shadow-sm border border-[#EFDDD1] h-fit lg:sticky lg:top-32">
              <h2 className="text-[10px] md:text-xs uppercase tracking-widest text-stone-400 mb-6 md:mb-8">
                Récapitulatif
              </h2>

              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 md:gap-4 border-b border-stone-100 pb-4">
                    {item.product.image && (
                      <img src={item.product.image} alt={item.product.name} className="w-14 h-14 md:w-16 md:h-16 object-cover shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs md:text-sm text-stone-900 truncate">{item.product.name}</p>
                      {item.custom_name && <p className="text-[10px] text-stone-400">Prénom : {item.custom_name}</p>}
                      {item.custom_scent && <p className="text-[10px] text-stone-400">Parfum : {item.custom_scent}</p>}
                      <p className="text-[10px] text-stone-500 mt-1">Qté : {item.quantity}</p>
                    </div>
                    <p className="text-xs md:text-sm text-stone-900 shrink-0">
                      {((item.product.price / 100) * item.quantity).toFixed(2)} €
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-[10px] md:text-xs uppercase tracking-widest">
                <div className="flex justify-between text-stone-500">
                  <span>Sous-total</span>
                  <span>{displayTotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Livraison</span>
                  <span>Gratuite</span>
                </div>
                <div className="flex justify-between text-stone-900 font-medium text-xs md:text-sm pt-3 border-t border-stone-200 mt-3">
                  <span>Total</span>
                  <span>{displayTotal.toFixed(2)} €</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
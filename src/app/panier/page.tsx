"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cart, updateQuantity, removeItem, total } = useCart();
  const formattedTotal = (total / 100).toFixed(2).replace('.', ',');

  return (
    <main>
      <div className="w-full h-[208px] bg-[#FDFBF7]"></div>

      <section className="bg-[#EFDDD1] min-h-[calc(100vh-140px)] py-12 px-4 md:px-12">
        <div className="max-w-[1200px] mx-auto">
          <h1 className="font-serif text-3xl text-stone-900 uppercase tracking-[0.2em] mb-12 text-center">
            Votre Panier
          </h1>

          {cart.length > 0 ? (
            <div className="flex flex-col lg:flex-row gap-12">

              {/* LISTE DES PRODUITS */}
              <div className="lg:w-2/3">
                <div className="bg-white shadow-sm border border-[#EFDDD1] overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-stone-50 border-b border-[#EFDDD1] hidden sm:table-header-group">
                      <tr>
                        <th className="p-4 text-[10px] uppercase tracking-widest text-stone-500 font-medium">Produit</th>
                        <th className="p-4 text-[10px] uppercase tracking-widest text-stone-500 font-medium text-center">Quantité</th>
                        <th className="p-4 text-[10px] uppercase tracking-widest text-stone-500 font-medium text-right">Total</th>
                        <th className="p-4"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 block sm:table-row-group">
                      {cart.map((item) => (
                        <tr key={item.id} className="block sm:table-row py-4 sm:py-0">

                          <td className="p-4 block sm:table-cell">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 bg-stone-100 flex-shrink-0">
                                {item.product.image ? (
                                  <img
                                    src={item.product.image}
                                    alt={item.product.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-stone-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                                  </div>
                                )}
                              </div>
                              <div>
                                <h3 className="text-sm font-medium text-stone-900 uppercase tracking-wide">
                                  {item.product.name}
                                </h3>
                                <p className="text-xs text-stone-500">
                                  {(item.product.price / 100).toFixed(2).replace('.', ',')} €
                                </p>
                                {item.custom_name && (
                                  <p className="text-[10px] text-stone-500 italic mt-1">
                                    {item.custom_name} — {item.custom_scent}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="p-4 text-center block sm:table-cell">
                            <div className="inline-flex items-center border border-stone-200">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="w-8 h-8 flex items-center justify-center text-stone-500 hover:bg-stone-100 transition-colors"
                              >
                                -
                              </button>
                              <span className="w-8 h-8 flex items-center justify-center text-xs font-bold text-stone-900">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="w-8 h-8 flex items-center justify-center text-stone-500 hover:bg-stone-100 transition-colors"
                              >
                                +
                              </button>
                            </div>
                          </td>

                          <td className="p-4 text-right text-sm font-bold text-stone-900 block sm:table-cell">
                            {((item.product.price * item.quantity) / 100).toFixed(2).replace('.', ',')} €
                          </td>

                          <td className="p-4 text-right block sm:table-cell">
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-stone-400 hover:text-red-500 transition-colors inline-flex justify-end w-full sm:w-auto"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* RÉSUMÉ COMMANDE */}
              <div className="lg:w-1/3">
                <div className="bg-white p-8 shadow-sm border border-[#EFDDD1] sticky top-32">
                  <h2 className="font-serif text-xl text-stone-900 uppercase tracking-widest mb-6">
                    Récapitulatif
                  </h2>
                  <div className="flex justify-between items-center mb-4 text-sm">
                    <span className="text-stone-500">Sous-total</span>
                    <span className="font-medium text-stone-900">{formattedTotal} €</span>
                  </div>
                  <div className="flex justify-between items-center mb-6 text-sm">
                    <span className="text-stone-500">Livraison</span>
                    <span className="text-stone-400 italic text-xs">Calculé à l&apos;étape suivante</span>
                  </div>
                  <div className="border-t border-stone-100 pt-6 mb-8 flex justify-between items-center">
                    <span className="font-bold text-base uppercase tracking-widest">Total</span>
                    <span className="font-bold text-xl">{formattedTotal} €</span>
                  </div>
                  <Link
                    href="/commande"
                    className="block text-center w-full bg-stone-900 text-white py-4 uppercase tracking-[0.2em] text-[10px] font-bold hover:bg-stone-800 transition-colors shadow-lg mb-4"
                  >
                    Passer au paiement
                  </Link>
                  <Link
                    href="/produits"
                    className="block text-center text-[10px] text-stone-500 underline hover:text-stone-900 uppercase tracking-wider"
                  >
                    Continuer mes achats
                  </Link>
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6 text-stone-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                  <path d="M3 6h18"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              </div>
              <p className="text-stone-900 text-lg font-medium uppercase tracking-widest mb-2">
                Votre panier est vide
              </p>
              <Link
                href="/produits"
                className="inline-block mt-4 bg-stone-900 text-white px-8 py-4 uppercase tracking-[0.2em] text-[10px] font-bold hover:bg-stone-800 transition-colors shadow-lg"
              >
                Découvrir la boutique
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
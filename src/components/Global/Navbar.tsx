"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { cart } = useCart();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className={`absolute top-0 left-0 w-full z-50 grid grid-cols-3 items-center px-12 py-8 uppercase tracking-[0.2em] text-[13px] font-light ${isHome ? 'text-white' : 'text-stone-900'}`}>

      {/* Navigation gauche */}
      <div className="flex justify-center gap-8">
        <Link href="/produits" className="hover:opacity-60 transition duration-300">Produits</Link>
        <Link href="/a-propos" className="hover:opacity-60 transition duration-300">À Propos</Link>
        <Link href="/contact" className="hover:opacity-60 transition duration-300">Contact</Link>
      </div>

      {/* Logo centre */}
      <div className="flex justify-center">
        <Link href="/">
          <img
            src="/images/logo.svg"
            alt="Shad's Candle"
            className={`h-36 w-auto block transition-all duration-300 ${isHome ? '' : 'invert'}`}
          />
        </Link>
      </div>

      {/* Icônes droite */}
      <div className="flex justify-center gap-6">

        {/* Recherche */}
        <button className="flex items-center justify-center hover:opacity-60 transition duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </button>

        {/* Utilisateur */}
        <div className="relative group flex items-center justify-center">
          {isLoggedIn ? (
            <>
              <Link href="/profil" className="flex items-center justify-center hover:opacity-60 transition duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>
              </Link>
              <div className="absolute right-0 top-full mt-2 w-56 bg-white shadow-2xl border border-stone-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 py-3 text-stone-900">
                <div className="px-4 py-2 border-b border-stone-50 mb-2">
                  <p className="text-[9px] text-stone-400 uppercase tracking-widest">Bonjour</p>
                  <p className="text-[11px] font-medium truncate">Client</p>
                </div>
                <Link href="/profil" className="block px-4 py-2 text-stone-600 hover:bg-stone-50 text-[11px] transition-colors tracking-widest">Mon Compte</Link>
                <button onClick={() => setIsLoggedIn(false)} className="w-full text-left block px-4 py-2 text-red-800 hover:bg-red-50 text-[11px] transition-colors tracking-widest">Déconnexion</button>
              </div>
            </>
          ) : (
            <Link href="/register" className="flex items-center justify-center hover:opacity-60 transition duration-300" title="Se connecter">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </Link>
          )}
        </div>

        {/* Panier */}
        <Link href="/panier" className="flex items-center justify-center hover:opacity-60 transition duration-300 relative">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-800 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-medium">
              {cartCount > 99 ? '99+' : cartCount}
            </span>
          )}
        </Link>

      </div>
    </nav>
  );
}
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { authService } from "@/services/auth";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Search, User, UserCheck, ShoppingCart } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  
  const { cart, isLogged } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    authService.logout();
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setIsScrolled(currentScrollY > 50);

      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Position initiale homepage = transparent, sinon toujours fond
  const isTransparent = isHome && !isScrolled;

  const navClasses = [
    isScrolled ? "fixed" : "absolute",
    isTransparent ? "text-white" : "bg-white/95 backdrop-blur-md shadow-sm text-stone-900",
    isVisible ? "translate-y-0" : "-translate-y-full",
    isScrolled ? "py-4" : "py-8",
    "transition-all duration-300",
  ].join(" ");

  const logoClasses = [
    "w-auto block transition-all duration-300",
    isScrolled ? "h-16 md:h-20" : "h-16 md:h-36",
    isTransparent ? "" : "invert",
  ].join(" ");

  return (
    <>
      <nav className={`${navClasses} top-0 left-0 w-full z-50 flex justify-between items-center md:grid md:grid-cols-3 px-6 md:px-12 uppercase tracking-[0.2em] text-[13px] font-light`}>

        <div className="flex md:justify-center items-center flex-1 md:flex-none">
          <button 
            type="button"
            className="md:hidden flex items-center justify-center hover:opacity-60 transition duration-300 cursor-pointer p-4 -ml-4 relative z-50"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Ouvrir le menu"
          >
            <Menu size={24} />
          </button>

          <div className="hidden md:flex gap-8">
            <Link href="/produits" className="hover:opacity-60 transition duration-300">Produits</Link>
            <Link href="/a-propos" className="hover:opacity-60 transition duration-300">À Propos</Link>
            <Link href="/contact" className="hover:opacity-60 transition duration-300">Contact</Link>
          </div>
        </div>

        <div className="flex justify-center flex-1 md:flex-none">
          <Link href="/">
            <img
              src="/images/logo.svg"
              alt="Shad's Candle"
              className={logoClasses}
            />
          </Link>
        </div>

        <div className="flex justify-end md:justify-center items-center gap-4 md:gap-6 flex-1 md:flex-none">

          <Link href="/search" className="flex items-center justify-center hover:opacity-60 transition duration-300">
            <Search size={20} />
          </Link>

          <div className="relative group flex items-center justify-center">
            {isLogged ? (
              <>
                <Link href="/profile" className="flex items-center justify-center hover:opacity-60 transition duration-300">
                  <UserCheck size={20} />
                </Link>
                <div className="absolute right-0 top-full mt-2 w-56 bg-white shadow-2xl border border-stone-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 py-3 text-stone-900">
                  <div className="px-4 py-2 border-b border-stone-50 mb-2">
                    <p className="text-[9px] text-stone-400 uppercase tracking-widest">Bonjour</p>
                    <p className="text-[11px] font-medium truncate">Ravi de vous revoir</p>
                  </div>
                  <Link href="/profile" className="block px-4 py-2 text-stone-600 hover:bg-stone-50 text-[11px] transition-colors tracking-widest">Mon Compte</Link>
                  <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-red-800 hover:bg-red-50 text-[11px] transition-colors tracking-widest">Déconnexion</button>
                </div>
              </>
            ) : (
              <Link href="/login" className="flex items-center justify-center hover:opacity-60 transition duration-300" title="Se connecter">
                <User size={20} />
              </Link>
            )}
          </div>

          <Link href="/panier" className="flex items-center justify-center hover:opacity-60 transition duration-300 relative">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-800 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-medium">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>

        </div>
      </nav>

      {/* Menu Mobile */}
      <div 
        className={`fixed inset-0 bg-stone-900/60 backdrop-blur-xl z-[60] flex flex-col items-center justify-center space-y-10 text-white uppercase tracking-[0.2em] font-light transition-transform duration-500 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="absolute top-0 left-0 w-full flex justify-between items-center px-6 py-8">
          <div className="flex items-center flex-1">
            <button 
              type="button"
              className="flex items-center justify-center p-4 -ml-4 hover:opacity-60 transition duration-300 cursor-pointer"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Fermer le menu"
            >
              <X size={24} /> 
            </button>
          </div>
          <div className="flex justify-center flex-1">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
              <img src="/images/logo.svg" alt="Shad's Candle" className="h-16 w-auto block" />
            </Link>
          </div>
          <div className="flex-1"></div>
        </div>

        <Link href="/produits" className="text-xl hover:opacity-60 transition duration-300" onClick={() => setIsMobileMenuOpen(false)}>Produits</Link>
        <Link href="/a-propos" className="text-xl hover:opacity-60 transition duration-300" onClick={() => setIsMobileMenuOpen(false)}>À Propos</Link>
        <Link href="/contact" className="text-xl hover:opacity-60 transition duration-300" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
      </div>
    </>
  );
}
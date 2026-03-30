import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#FDFBF7] pt-20 pb-10 px-4 font-sans border-t border-[#EFDDD1]">
      <div className="max-w-[1542px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-4 mb-24 items-start">
          
          {/* Réseaux Sociaux */}
          <div className="flex gap-3 lg:col-span-1">
            <a href="#" className="w-10 h-10 border border-stone-800 rounded-full flex items-center justify-center text-stone-800 hover:bg-stone-800 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="#" className="w-10 h-10 border border-stone-800 rounded-full flex items-center justify-center text-stone-800 hover:bg-stone-800 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a href="#" className="w-10 h-10 border border-stone-800 rounded-full flex items-center justify-center text-stone-800 hover:bg-stone-800 hover:text-white transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
            </a>
            <a href="#" className="w-10 h-10 border border-stone-800 rounded-full flex items-center justify-center text-stone-800 hover:bg-stone-800 hover:text-white transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="17" y2="22"/><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"/></svg>
            </a>
          </div>

          {/* Nos Produits */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-xs uppercase tracking-widest text-[#5B2C28] mb-2">Nos Produits</h4>
            <Link href="/produits/parfumees" className="text-sm text-stone-800 hover:underline">Bougies parfumées</Link>
            <Link href="/produits/moulees" className="text-sm text-stone-800 hover:underline">Bougies moulées</Link>
            <Link href="/produits/naissance" className="text-sm text-stone-800 hover:underline">Bougies de naissance</Link>
            <Link href="/produits/coffrets" className="text-sm text-stone-800 hover:underline">Coffrets</Link>
            <Link href="/produits/fondants" className="text-sm text-stone-800 hover:underline">Fondants</Link>
          </div>

          {/* Informations */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-xs uppercase tracking-widest text-[#5B2C28] mb-2">INFORMATIONS</h4>
            <Link href="/faq" className="text-sm text-stone-800 hover:underline">Faq</Link>
            <Link href="/mentions-legales" className="text-sm text-stone-800 hover:underline">Mentions Légales</Link>
            <Link href="/cgv" className="text-sm text-stone-800 hover:underline">Conditions Générales de Vente</Link>
            <Link href="/confidentialite" className="text-sm text-stone-800 hover:underline">Politique de Confidentialité</Link>
            <Link href="/donnees" className="text-sm text-stone-800 hover:underline">Données Personnelles</Link>
          </div>

          {/* À Propos */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-xs uppercase tracking-widest text-[#5B2C28] mb-2">À PROPOS</h4>
            <Link href="/suivi-commande" className="text-sm text-stone-800 hover:underline">Suivre ma Commande</Link>
            <Link href="/blog" className="text-sm text-stone-800 hover:underline">Blog</Link>
            <Link href="/contact" className="text-sm text-stone-800 hover:underline">Contact</Link>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-1">
            <h4 className="font-bold text-xs uppercase tracking-widest text-[#5B2C28] mb-4">NEWSLETTER</h4>
            <div className="flex items-center gap-2">
              <input type="email" className="w-full h-10 px-4 border border-stone-300 rounded-md text-sm outline-none focus:border-stone-500 bg-white" placeholder="Votre email" />
              <button className="w-10 h-10 bg-stone-200 rounded-md flex items-center justify-center hover:bg-stone-300 transition-colors text-black">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </button>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="text-center text-[10px] md:text-xs text-stone-400 flex flex-col md:flex-row justify-center gap-2 md:gap-12">
          <p>© Shad’s Candle – Tous droits réservés 2025</p>
          <p>Site réalisé par Studio 19.21</p>
        </div>
      </div>
    </footer>
  );
}
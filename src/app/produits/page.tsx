"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import ProductCard from '../../components/Product/ProductCard';
import ReassuranceSection from '../../components/Global/ReassuranceSection';

interface Product {
  id: number;
  name: string;
  price: number;
  image?: string;
  category_id?: number; 
}

const PRODUCTS_PER_PAGE = 16;

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get('category');

  // --- ÉTATS ---
  // Produits
  const [allFetchedProducts, setAllFetchedProducts] = useState<Product[]>([]);
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtres
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  
  // Pagination Client
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // --- 1. FETCH DES DONNÉES (Se déclenche si filtres ou catégorie changent) ---
  useEffect(() => {
    // On demande un maximum de produits d'un coup pour paginer côté front
    let url = `http://127.0.0.1:8000/api/products/?limit=500`;
    
    if (categoryFilter) url += `&category=${categoryFilter}`;
    if (minPrice) url += `&min_price=${parseInt(minPrice) * 100}`;
    if (maxPrice) url += `&max_price=${parseInt(maxPrice) * 100}`;

    setLoading(true);
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Erreur réseau');
        return res.json();
      })
      .then(data => {
        // Gère les deux formats d'API (liste simple ou objet paginé de Django)
        const items = data.results || data; 
        
        setAllFetchedProducts(items);
        setCurrentPage(1); // On reset la page à 1 quand on change de filtre
        setVisibleProducts(items.slice(0, PRODUCTS_PER_PAGE));
        setHasMore(items.length > PRODUCTS_PER_PAGE);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur Fetch API:", err);
        setLoading(false);
      });
  }, [categoryFilter, minPrice, maxPrice]); // Ne dépend plus de "page" !

  // --- 2. GESTION DE LA PAGINATION CÔTÉ CLIENT ---
  useEffect(() => {
    if (currentPage > 1) {
      const endIndex = currentPage * PRODUCTS_PER_PAGE;
      setVisibleProducts(allFetchedProducts.slice(0, endIndex));
      setHasMore(endIndex < allFetchedProducts.length);
    }
  }, [currentPage, allFetchedProducts]);

  // --- HANDLERS ---
  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Le submit va déclencher un re-render qui relancera le Fetch useEffect
    // car on a mis à jour minPrice et maxPrice dans les inputs
  };

  const handleResetFilters = () => {
    setMinPrice('');
    setMaxPrice('');
  };

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  // --- TITRE DYNAMIQUE ---
  const getPageTitle = () => {
    if (categoryFilter === 'parfumees') return 'Bougies Parfumées';
    if (categoryFilter === 'moulees') return 'Bougies Moulées';
    if (categoryFilter === 'coffrets') return 'Coffrets';
    if (categoryFilter === 'fondants') return 'Fondants';
    return 'Toute la Collection';
  };

  return (
    <main className="bg-[#EFDDD1] min-h-screen relative overflow-hidden">
      
      {/* Espace pour la navbar absolue (depuis le layout) */}
      <div className="w-full h-[208px] bg-[#FDFBF7]"></div>

      <section className="px-4 md:px-12 py-20 relative">
        <div className="max-w-[1542px] mx-auto">
          
          {/* --- EN-TÊTE --- */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-[35px] md:text-[55px] text-stone-900 uppercase tracking-widest mb-6">
              {getPageTitle()}
            </h1>
            <p className="text-stone-700 text-lg font-light italic mb-12">
              Des créations uniques pour une ambiance chaleureuse.
            </p>

            {/* MENU CATÉGORIES */}
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 text-xs md:text-sm uppercase tracking-[0.15em] font-medium text-stone-500 mx-auto max-w-5xl">
              <Link href="/produits" className={`${!categoryFilter ? 'text-stone-900 border-b-2 border-stone-900' : 'hover:text-stone-900'} pb-2 transition-colors`}>
                Tout voir
              </Link>
              <Link href="/produits?category=parfumees" className={`${categoryFilter === 'parfumees' ? 'text-stone-900 border-b-2 border-stone-900' : 'hover:text-stone-900'} pb-2 transition-colors`}>
                Bougies Parfumées
              </Link>
              <Link href="/produits?category=moulees" className={`${categoryFilter === 'moulees' ? 'text-stone-900 border-b-2 border-stone-900' : 'hover:text-stone-900'} pb-2 transition-colors`}>
                Bougies Moulées
              </Link>
              <Link href="/produits?category=coffrets" className={`${categoryFilter === 'coffrets' ? 'text-stone-900 border-b-2 border-stone-900' : 'hover:text-stone-900'} pb-2 transition-colors`}>
                Coffrets
              </Link>
              <Link href="/produits?category=fondants" className={`${categoryFilter === 'fondants' ? 'text-stone-900 border-b-2 border-stone-900' : 'hover:text-stone-900'} pb-2 transition-colors`}>
                Fondants
              </Link>
            </div>
          </div>

          {/* --- FORMULAIRE FILTRES --- */}
          <div className="mb-10">
            <div className="flex justify-between items-center px-2 pb-4 border-b border-stone-300/50">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)} 
                className="flex items-center gap-3 group hover:opacity-70 transition-opacity text-stone-900 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/></svg>
                <span className="uppercase tracking-[0.15em] text-xs font-medium">Filtrer</span>
                {(minPrice || maxPrice) && <span className="w-2 h-2 rounded-full bg-stone-900 ml-1"></span>}
              </button>
              <span className="text-xs text-stone-600 font-sans tracking-wide">
                {visibleProducts.length} produits affichés sur {allFetchedProducts.length}
              </span>
            </div>

            {/* Panneau de filtres */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out bg-[#FDFBF7] rounded-lg shadow-sm ${isFilterOpen ? 'max-h-64 mt-4 p-6 opacity-100' : 'max-h-0 opacity-0'}`}>
              <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl">
                <div>
                  <h4 className="font-serif text-stone-900 mb-4 uppercase text-xs tracking-widest">Prix (€)</h4>
                  <div className="flex gap-4 items-center">
                    <input 
                      type="number" 
                      placeholder="Min" 
                      value={minPrice} 
                      onChange={(e) => setMinPrice(e.target.value)} 
                      className="w-full bg-white border border-stone-200 p-2 text-sm outline-none focus:border-stone-500"
                    />
                    <span className="text-stone-400">-</span>
                    <input 
                      type="number" 
                      placeholder="Max" 
                      value={maxPrice} 
                      onChange={(e) => setMaxPrice(e.target.value)} 
                      className="w-full bg-white border border-stone-200 p-2 text-sm outline-none focus:border-stone-500"
                    />
                  </div>
                </div>
                <div className="flex items-end gap-4">
                  <button type="submit" className="bg-stone-900 text-white px-6 py-2 uppercase text-xs tracking-widest hover:bg-stone-700 transition-colors h-[42px]">
                    Appliquer
                  </button>
                  <button type="button" onClick={handleResetFilters} className="text-stone-500 text-xs underline underline-offset-4 hover:text-stone-900 mb-3">
                    Réinitialiser
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* --- GRILLE PRODUITS (16 Max) --- */}
          {loading ? (
            <div className="py-24 text-center text-stone-600">Chargement du catalogue...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-500">
              {visibleProducts.length > 0 ? (
                visibleProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="col-span-full py-24 text-center">
                  <p className="text-xl font-serif italic text-stone-600">Aucune bougie trouvée pour ces critères.</p>
                  <button onClick={handleResetFilters} className="inline-block mt-4 text-xs uppercase tracking-widest border-b border-black pb-1">
                    Voir tout le catalogue
                  </button>
                </div>
              )}
            </div>
          )}

          {/* === BOUTON LOAD MORE === */}
          {hasMore && !loading && (
            <div className="mt-20 flex justify-center">
              <button 
                onClick={handleLoadMore} 
                className="text-stone-900 text-xs uppercase tracking-widest border-b border-stone-900 pb-1 hover:opacity-60 transition-all duration-300"
              >
                Voir plus de produits
              </button>
            </div>
          )}

        </div>
      </section>

      {/* --- RÉASSURANCE --- */}
      <ReassuranceSection />
    </main>
  );
}
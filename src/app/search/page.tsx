"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_URL } from "@/lib/api";

interface Product {
  product_id: number;
  name: string;
  price: number;
  image?: string;
  stock?: number;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/products/?limit=500`);
        const data = await res.json();
        const items = data.results || data;
        setAllProducts(items);
        setProducts(items.slice(0, 8));
      } catch {
        console.error("Erreur chargement produits");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (query.trim() === "") {
      setProducts(allProducts.slice(0, 8));
    } else {
      const filtered = allProducts.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase())
      );
      setProducts(filtered);
    }
  }, [query, allProducts]);

  const formatPrice = (cents: number) =>
    (Number(cents) / 100).toFixed(2).replace(".", ",");

  return (
    <main className="bg-[#FDFBF7] min-h-screen">

      {/* Header recherche */}
      <div className="sticky top-0 z-50 bg-[#FDFBF7] border-b border-stone-200">
        <div className="max-w-[1200px] mx-auto px-4 md:px-12 py-4 md:py-6 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-stone-400 hover:text-stone-900 transition-colors shrink-0"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="flex-1 relative">
            <Search size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un produit..."
              className="w-full pl-8 pr-8 py-2 bg-transparent text-stone-900 text-sm md:text-base font-light placeholder:text-stone-400 focus:outline-none border-b border-stone-300 focus:border-stone-900 transition-colors"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-900 transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <button
            onClick={() => router.back()}
            className="text-[10px] uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors shrink-0 hidden sm:block"
          >
            Fermer
          </button>
        </div>
      </div>

      {/* Résultats */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-12 py-8 md:py-12">

        {query.trim() === "" ? (
          <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-6 md:mb-8">
            Découvrir nos produits
          </p>
        ) : (
          <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-6 md:mb-8">
            {products.length} résultat{products.length > 1 ? "s" : ""} pour &quot;{query}&quot;
          </p>
        )}

        {isLoading ? (
          <div className="py-20 text-center">
            <p className="text-stone-400 text-xs uppercase tracking-widest animate-pulse">
              Chargement...
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <p className="text-stone-900 font-serif text-lg md:text-xl">
              Aucun résultat trouvé
            </p>
            <p className="text-stone-500 text-xs uppercase tracking-widest">
              Essayez avec un autre mot-clé
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {products.map((product) => {
              const isSoldOut = product.stock !== undefined && product.stock === 0;

              return (
                <Link
                  key={product.product_id}
                  href={`/produits/${product.product_id}`}
                  className="group"
                >
                  <div className="bg-white shadow-sm hover:shadow-lg transition-shadow duration-300">
                    <div className="relative aspect-[4/5] overflow-hidden bg-stone-100 flex items-center justify-center">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ${isSoldOut ? "opacity-50 grayscale" : ""}`}
                        />
                      ) : (
                        <div className="text-stone-300">
                          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                        </div>
                      )}
                      {isSoldOut && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span className="bg-white/90 text-stone-900 text-[10px] uppercase tracking-widest font-medium px-4 py-2 border border-stone-200">
                            Épuisé
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-start mt-3 px-1">
                    <h3 className="text-stone-900 text-sm leading-tight truncate pr-3">
                      {product.name}
                    </h3>
                    <span className={`text-sm whitespace-nowrap ${isSoldOut ? "text-stone-400" : "text-stone-900"}`}>
                      {formatPrice(product.price)} €
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
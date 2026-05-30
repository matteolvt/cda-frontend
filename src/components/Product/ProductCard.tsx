"use client";

import Link from 'next/link';
import { useCart } from '../../context/CartContext';

interface Product {
  product_id: number;
  name: string;
  price: number;
  image?: string;
  is_customizable?: number;
  stock?: number;
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  
  const formattedPrice = (product.price / 100).toFixed(2).replace('.', ',');
  const isSoldOut = product.stock !== undefined && product.stock === 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (isSoldOut) return;

    if (product.is_customizable === 1) {
      alert("Ce produit nécessite une personnalisation. Veuillez cliquer sur la fiche produit.");
      return;
    }

    try {
      await addToCart(product.product_id, 1);
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier:", error);
    }
  };

  return (
    <div className="flex flex-col group/card cursor-pointer">
      <div className="bg-white flex flex-col shadow-sm group-hover/card:shadow-xl transition-shadow duration-300">
        
        {/* Conteneur Image */}
        <div className="relative aspect-[4/5] overflow-hidden bg-stone-100 flex items-center justify-center">
          <Link href={`/produits/${product.product_id}`} className="absolute inset-0">
            {product.image ? (
              <img 
                src={product.image} 
                alt={product.name} 
                className={`w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700 ${isSoldOut ? 'opacity-50 grayscale' : ''}`}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
              </div>
            )}
          </Link>

          {/* Badge Sold Out */}
          {isSoldOut && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="bg-white/90 text-stone-900 text-[10px] uppercase tracking-widest font-medium px-4 py-2 border border-stone-200">
                Épuisé
              </span>
            </div>
          )}
        </div>

        {/* Bouton Ajouter au Panier */}
        <button 
          onClick={handleAddToCart}
          disabled={isSoldOut}
          className={`block w-full text-center py-4 border-t border-stone-100 text-[11px] uppercase tracking-widest font-medium transition-colors duration-300 z-10 relative ${
            isSoldOut
              ? 'text-stone-400 cursor-not-allowed bg-stone-50'
              : 'text-stone-900 hover:bg-stone-900 hover:text-white'
          }`}
        >
          {isSoldOut ? 'Épuisé' : 'Ajouter au panier'}
        </button>
      </div>

      {/* Informations Textuelles */}
      <div className="flex justify-between items-start mt-4 px-1">
        <h3 className="text-stone-900 font-nokora text-lg leading-tight truncate pr-4">
          <Link href={`/produits/${product.product_id}`} className="hover:underline">
            {product.name}
          </Link>
        </h3>
        <span className={`font-nokora text-lg whitespace-nowrap ${isSoldOut ? 'text-stone-400' : 'text-stone-900'}`}>
          {formattedPrice} €
        </span>
      </div>
    </div>
  );
}
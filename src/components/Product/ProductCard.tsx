"use client";

import Link from 'next/link';
import { useCart } from '../../context/CartContext';

interface Product {
  id: number;
  name: string;
  price: number;
  image?: string;
  is_customizable?: number;
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  
  const formattedPrice = (product.price / 100).toFixed(2).replace('.', ',');

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (product.is_customizable === 1) {
       alert("Ce produit nécessite une personnalisation. Veuillez cliquer sur la fiche produit.");
       return;
    }

    try {
      await addToCart(product.id, 1);
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier:", error);
    }
  };

  return (
    <div className="flex flex-col group/card cursor-pointer">
      <div className="bg-white flex flex-col shadow-sm group-hover/card:shadow-xl transition-shadow duration-300">
        
        {/* Conteneur Image */}
        <div className="relative aspect-[4/5] overflow-hidden bg-stone-100 flex items-center justify-center">
          <Link href={`/produits/${product.id}`} className="absolute inset-0">
            {product.image ? (
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700" 
              />
            ) : (
              // Fallback si pas d'image
              <div className="w-full h-full flex items-center justify-center text-stone-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
              </div>
            )}
          </Link>
        </div>

        {/* Bouton Ajouter au Panier */}
        <button 
          onClick={handleAddToCart} 
          className="block w-full text-center py-4 border-t border-stone-100 text-[11px] uppercase tracking-widest font-medium text-stone-900 hover:bg-stone-900 hover:text-white transition-colors duration-300 z-10 relative"
        >
          Ajouter au panier
        </button>
      </div>

      {/* Informations Textuelles */}
      <div className="flex justify-between items-start mt-4 px-1">
        <h3 className="text-stone-900 font-nokora text-lg leading-tight truncate pr-4">
          <Link href={`/produits/${product.id}`} className="hover:underline">
            {product.name}
          </Link>
        </h3>
        <span className="text-stone-900 font-nokora text-lg whitespace-nowrap">
          {formattedPrice} €
        </span>
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import ProductCard from "../../../components/Product/ProductCard";
import { useCart } from "../../../context/CartContext";

// Interfaces basées sur ton modèle
interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image?: string;
  category?: Category;
  is_customizable: number;
}

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id;

  const { addToCart } = useCart(); 

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  
  const [customName, setCustomName] = useState("");
  const [customScent, setCustomScent] = useState("");

  const SCENTS = ['Vanille', 'Framboise', 'Mure Myrtille', 'Fleur de Tiaré', 'Rose', 'Bois de Santal', 'Fruits Tropicaux', 'Jasmin', 'Barbe à papa', 'Bubble Gum', 'Noix de Coco', 'Fleur de Coton', 'Musty', 'Fruits rouge', 'Fraise', 'Pomme d’amour', 'Bouquet Solaire'].sort();
  const productImages = product?.image ? [product.image, product.image, product.image, product.image] : [];

  useEffect(() => {
    fetch(`https://backcda-api.onrender.com/api/products/?limit=500`)
      .then(res => res.json())
      .then(data => {
        const items = data.results || data;
        const foundProduct = items.find((p: Product) => p.id.toString() === productId);
        setProduct(foundProduct || null);
        
        setRelatedProducts(items.filter((p: Product) => p.id !== foundProduct?.id).slice(0, 4));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [productId]);

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);

  const handleQtyChange = (change: number) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  const handleAddToCart = async () => {
    if (!product) return;

    // Vérification si personnalisable
    if (product.is_customizable === 1 && (!customName || !customScent)) {
      alert("Veuillez remplir tous les champs de personnalisation obligatoires (*)");
      return;
    }

    try {
      // Appel de la VRAIE fonction qui parle au Back-end (via le CartContext)
      await addToCart(
        product.id, 
        quantity, 
        product.is_customizable === 1 ? customName : undefined, 
        product.is_customizable === 1 ? customScent : undefined
      );
    } catch (error) {
      console.error("Erreur ajout panier:", error);
    }
  };

  if (loading) return <div className="min-h-screen pt-40 text-center">Chargement du produit...</div>;
  if (!product) return <div className="min-h-screen pt-40 text-center font-serif text-2xl">Produit introuvable.</div>;

  return (
    <main className="bg-[#EFDDD1] min-h-screen">
      {/* 1. NAVBAR SPACE */}
      <div className="w-full h-[208px] bg-[#FFF9F3]"></div>

      {/* 2. MAIN SECTION */}
      <section className="py-20 md:py-20">
        <div className="max-w-[1542px] mx-auto px-4 md:px-12">
          
          <nav className="mb-12 text-xs uppercase tracking-widest text-stone-400">
            <Link href="/" className="hover:text-stone-900 transition-colors">Accueil</Link>
            <span className="mx-2">/</span>
            <Link href="/produits" className="hover:text-stone-900 transition-colors">Boutique</Link>
            <span className="mx-2">/</span>
            <span className="text-stone-900">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
            
            {/* --- COLONNE GAUCHE : GALERIE --- */}
            <div className="flex flex-col gap-6 sticky top-32">
              <div className="relative aspect-[4/5] bg-white overflow-hidden shadow-sm group select-none flex items-center justify-center">
                {productImages.length > 0 ? (
                  <img src={productImages[currentImageIndex]} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                   <div className="text-stone-300">
                     <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                   </div>
                )}
                
                {productImages.length > 1 && (
                  <>
                    <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-stone-900 hover:text-white text-stone-900 p-3 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100 z-20">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                    <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-stone-900 hover:text-white text-stone-900 p-3 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100 z-20">
                       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {productImages.length > 1 && (
                <div className="grid grid-cols-6 gap-3">
                  {productImages.map((img, idx) => (
                    <button key={idx} onClick={() => setCurrentImageIndex(idx)} className={`aspect-square bg-white overflow-hidden border transition-all ${idx === currentImageIndex ? 'border-stone-900 opacity-100' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                      <img src={img} className="w-full h-full object-cover pointer-events-none" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* --- COLONNE DROITE : INFO --- */}
            <div className="flex flex-col pt-4">
              <span className="text-stone-500 text-xs uppercase tracking-[0.2em] mb-4">
                {product.category?.name || "Bougie"}
              </span>
              <h1 className="font-serif text-4xl md:text-[50px] text-stone-900 leading-tight mb-6">{product.name}</h1>
              
              <p className="text-2xl text-stone-900 font-medium mb-8">
                {(product.price / 100).toFixed(2).replace('.', ',')} €
              </p>

              <div className="text-stone-600 font-light leading-relaxed mb-10 text-lg">
                <p>{product.description.substring(0, 150)}...</p>
              </div>

              {/* BLOC PERSONNALISATION */}
              {product.is_customizable === 1 && (
                <div className="mb-10 p-6 bg-[#FDFBF7] border border-stone-200 shadow-sm">
                  <h3 className="font-serif text-xl text-stone-900 mb-6 border-b border-stone-200 pb-2">Personnalisation</h3>
                  <div className="flex flex-col gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">Prénom (Max 7 lettres) <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        maxLength={7} 
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        placeholder="Ex: Léo" 
                        className="w-full bg-white border border-stone-300 px-4 py-3 text-stone-900 outline-none focus:border-stone-900 transition-all font-medium placeholder-stone-400" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">Choix du Parfum <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <select 
                          value={customScent}
                          onChange={(e) => setCustomScent(e.target.value)}
                          className="w-full bg-white border border-stone-300 px-4 py-3 text-stone-900 outline-none focus:border-stone-900 appearance-none cursor-pointer font-light"
                        >
                          <option value="" disabled>Sélectionnez une senteur...</option>
                          {SCENTS.map(scent => (
                            <option key={scent} value={scent}>{scent}</option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-500">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* BOUTONS D'ACTION (QUANTITÉ + AJOUT) */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12 pb-12 border-b border-stone-200">
                <div className="flex items-center border border-stone-300 w-32 h-[54px] bg-white/50">
                  <button onClick={() => handleQtyChange(-1)} className="w-10 h-full text-stone-500 hover:text-stone-900 text-lg">-</button>
                  <input 
                    type="number" 
                    value={quantity} 
                    readOnly 
                    className="w-full h-full text-center border-none outline-none text-stone-900 font-medium bg-transparent pointer-events-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                  />
                  <button onClick={() => handleQtyChange(1)} className="w-10 h-full text-stone-500 hover:text-stone-900 text-lg">+</button>
                </div>
                
                <button onClick={handleAddToCart} className="flex-1 bg-[#6F1E1A] text-white h-[54px] uppercase tracking-[0.15em] text-xs font-medium hover:bg-[#43120F] transition-colors flex items-center justify-center gap-3">
                  <span>Ajouter au panier</span>
                  <span className="w-px h-4 bg-white/20"></span>
                  <span>{((product.price * quantity) / 100).toFixed(2).replace('.', ',')} €</span>
                </button>
              </div>

              {/* ACCORDÉONS */}
              <div className="flex flex-col gap-0 [&_details>summary::-webkit-details-marker]:hidden">
                <details className="group py-6 border-b border-stone-200 cursor-pointer" open>
                  <summary className="flex justify-between items-center list-none outline-none">
                    <span className="font-serif text-lg text-stone-900">Description</span>
                    <span className="text-stone-400 group-open:rotate-45 transition-transform duration-300 text-2xl font-light">+</span>
                  </summary>
                  <div className="text-stone-600 font-light leading-relaxed mt-4">
                    <p>{product.description}</p>
                  </div>
                </details>
                <details className="group py-6 border-b border-stone-200 cursor-pointer">
                  <summary className="flex justify-between items-center list-none outline-none">
                    <span className="font-serif text-lg text-stone-900">Détails</span>
                    <span className="text-stone-400 group-open:rotate-45 transition-transform duration-300 text-2xl font-light">+</span>
                  </summary>
                  <div className="text-stone-600 font-light leading-relaxed mt-4">
                    <ul className="list-disc list-inside space-y-1">
                      <li>Dimensions : 8cm de diamètre x 10cm de hauteur</li>
                      <li>Durée de combustion : environ 40 heures</li>
                      <li>Matériaux : cire de soja naturelle, mèche en coton</li>
                      <li>Fabriquée à la main avec amour en France</li>
                    </ul>
                  </div>
                </details>
              </div>

              {/* RÉASSURANCE LIVRAISON */}
              <div className="grid grid-cols-2 gap-6 mt-12 pt-8">
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-stone-400"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>
                  <span className="text-xs uppercase tracking-wider text-stone-500">Expédition 48h</span>
                </div>
                <div className="flex items-center gap-3">
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-stone-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
                  <span className="text-xs uppercase tracking-wider text-stone-500">Paiement Sécurisé</span>
                </div>
              </div>
              
            </div>
          </div>

          {/* --- SECTION : VOUS AIMEREZ AUSSI --- */}
          <div className="mt-32 border-t border-stone-200 pt-20">
            <h3 className="font-serif text-3xl text-center text-stone-900 mb-12">Vous aimerez aussi</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.length > 0 ? (
                relatedProducts.map(related => (
                  <ProductCard key={related.id} product={related} />
                ))
              ) : (
                <p className="col-span-4 text-center text-stone-500 italic">D&apos;autres créations arrivent bientôt...</p>
              )}
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
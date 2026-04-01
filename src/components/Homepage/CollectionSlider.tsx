"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { API_URL } from "@/lib/api";

import "swiper/css";
import "swiper/css/navigation";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

export default function CollectionSlider() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/products/slider/`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur de connexion au Back-end:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div id="collection" className="bg-[#EFDDD1] relative overflow-hidden pb-24">
      <div className="w-full relative group">
        <h2 className="font-serif text-4xl text-center my-[140px] text-stone-800">
          Découvrez nos bougies
        </h2>

        <div className="relative w-full">
          {loading ? (
            <p className="text-center w-full py-10 font-sans">Chargement des bougies...</p>
          ) : (
            <Swiper
              modules={[Navigation]}
              navigation={{ nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" }}
              grabCursor={true}
              breakpoints={{
                320: { slidesPerView: 1.2, spaceBetween: 12, slidesOffsetBefore: 16 },
                640: { slidesPerView: 2.5, spaceBetween: 16, slidesOffsetBefore: 24 },
                1024: { slidesPerView: 3.5, spaceBetween: 16, slidesOffsetBefore: 48 },
                1280: { slidesPerView: 4.5, spaceBetween: 20, slidesOffsetBefore: 48 },
              }}
              className="py-6"
            >
              {products.map((product) => (
                <SwiperSlide key={product.id}>
                  <div className="flex flex-col cursor-pointer group/card">
                    <div className="bg-white flex flex-col shadow-sm group-hover/card:shadow-xl transition-shadow duration-300">
                      <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
                        <Link href={`/produits/${product.id}`}>
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700"
                          />
                        </Link>
                      </div>
                      <button onClick={() => console.log("Ajout au panier", product.id)} className="block w-full text-center py-4 border-t border-stone-100 text-[11px] uppercase tracking-widest font-medium text-stone-900 hover:bg-stone-900 hover:text-white transition-colors duration-300">
                        Ajouter au panier
                      </button>
                    </div>
                    <div className="flex justify-between items-start mt-4 px-1">
                      <h3 className="text-stone-900 font-nokora text-lg leading-tight truncate pr-4">{product.name}</h3>
                      <span className="text-stone-900 font-nokora text-lg whitespace-nowrap">{(product.price / 100).toFixed(2).replace(".", ",")} €</span>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}

          <div className="swiper-button-next !text-stone-900 !scale-50 font-bold z-50 hidden md:block !right-2 transition-opacity duration-300 [&.swiper-button-disabled]:!opacity-0 [&.swiper-button-disabled]:!pointer-events-none"></div>
          <div className="swiper-button-prev !text-stone-900 !scale-50 font-bold z-50 hidden md:block !left-2 md:!left-6 transition-opacity duration-300 [&.swiper-button-disabled]:!opacity-0 [&.swiper-button-disabled]:!pointer-events-none"></div>
        </div>
      </div>
      <div className="text-center mt-20">
        <Link href="/produits" className="inline-block text-black text-xl font-sans border-b border-black pb-1 hover:opacity-70 transition-opacity duration-300">
          Voir tous nos produits
        </Link>
      </div>
    </div>
  );
}
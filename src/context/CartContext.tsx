"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const API = "http://localhost:8000/api";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  custom_name?: string;
  custom_scent?: string;
}

interface CartContextType {
  cart: CartItem[];
  total: number;
  addToCart: (productId: number, quantity: number, customName?: string, customScent?: string) => Promise<void>;
  updateQuantity: (itemId: number, delta: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Étape 1 : détection client + chargement localStorage
  useEffect(() => {
    setIsClient(true);
    try {
      const saved = localStorage.getItem('shads_cart');
      if (saved) setCart(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  // Étape 2 : sync localStorage à chaque changement du panier
  useEffect(() => {
    if (!isClient) return;
    localStorage.setItem('shads_cart', JSON.stringify(cart));
  }, [cart, isClient]);

  // Étape 3 : chargement depuis Django (source de vérité)
  // On n'écrase le localStorage QUE si Django retourne des items
  useEffect(() => {
    if (!isClient) return;
    fetch(`${API}/cart/`, { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const items = Array.isArray(data) ? data : [];
        if (items.length > 0) {
          setCart(items);
          localStorage.setItem('shads_cart', JSON.stringify(items));
        }
      })
      .catch((err) => console.error("Erreur chargement panier:", err));
  }, [isClient]);

  // AJOUTER AU PANIER
  const addToCart = async (
    productId: number,
    quantity: number,
    customName?: string,
    customScent?: string
  ) => {
    try {
      const res = await fetch(`${API}/cart/add/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({
          product_id: productId,
          quantity,
          custom_name: customName,
          custom_scent: customScent,
        }),
      });
      if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
      const updatedCart = await res.json();
      const items = Array.isArray(updatedCart) ? updatedCart : [];
      setCart(items);
      localStorage.setItem('shads_cart', JSON.stringify(items));
      alert("Produit ajouté au panier !");
    } catch (error) {
      console.error("Erreur ajout panier:", error);
    }
  };

  // MODIFIER LA QUANTITÉ
  const updateQuantity = async (itemId: number, delta: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
    try {
      const res = await fetch(`${API}/cart/update/${itemId}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ delta }),
      });
      if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
      const updatedCart = await res.json();
      const items = Array.isArray(updatedCart) ? updatedCart : [];
      if (items.length > 0) {
        setCart(items);
        localStorage.setItem('shads_cart', JSON.stringify(items));
      }
    } catch (error) {
      console.error("Erreur mise à jour:", error);
      fetch(`${API}/cart/`, { credentials: 'include' })
        .then((res) => res.json())
        .then((data) => {
          const items = Array.isArray(data) ? data : [];
          if (items.length > 0) {
            setCart(items);
            localStorage.setItem('shads_cart', JSON.stringify(items));
          }
        });
    }
  };

  // SUPPRIMER DU PANIER
  const removeItem = async (itemId: number) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
    try {
      await fetch(`${API}/cart/remove/${itemId}/`, {
        method: "DELETE",
        credentials: 'include',
      });
    } catch (error) {
      console.error("Erreur suppression:", error);
      fetch(`${API}/cart/`, { credentials: 'include' })
        .then((res) => res.json())
        .then((data) => {
          const items = Array.isArray(data) ? data : [];
          if (items.length > 0) {
            setCart(items);
            localStorage.setItem('shads_cart', JSON.stringify(items));
          }
        });
    }
  };

  const total = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider value={{ cart, total, addToCart, updateQuantity, removeItem }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart doit être utilisé dans un CartProvider");
  return context;
}
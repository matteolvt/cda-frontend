"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { API_URL } from "@/lib/api";

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
  updateQuantity: (itemId: number, delta: number) => void;
  removeItem: (itemId: number) => void;
  clearCart: () => void;
  isLogged: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  // ─── INIT ────────────────────────────────────────────────────
  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem("access_token");
    setIsLogged(!!token);

    try {
      const saved = localStorage.getItem("shads_cart");
      if (saved) setCart(JSON.parse(saved));
    } catch {}
  }, []);

  // ─── SYNC localStorage ───────────────────────────────────────
  useEffect(() => {
    if (!isClient) return;
    localStorage.setItem("shads_cart", JSON.stringify(cart));
  }, [cart, isClient]);

  // ─── AJOUTER AU PANIER ───────────────────────────────────────
  const addToCart = async (
    productId: number,
    quantity: number,
    customName?: string,
    customScent?: string
  ) => {
    const existing = cart.find((item) => item.product.id === productId);

    if (existing) {
      setCart((prev) =>
        prev.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
      return;
    }

    try {
      const res = await fetch(`${API_URL}/products/${productId}/`);
      if (!res.ok) throw new Error("Produit introuvable");
      const product = await res.json();

      setCart((prev) => [
        ...prev,
        {
          id: productId,
          product: {
            id: product.product_id || product.id,
            name: product.name,
            price: product.price,
            image: product.image || "",
          },
          quantity,
          custom_name: customName,
          custom_scent: customScent,
        },
      ]);
    } catch {
      console.error("Impossible de récupérer les infos produit");
    }
  };

  // ─── METTRE À JOUR LA QUANTITÉ ───────────────────────────────
  const updateQuantity = (itemId: number, delta: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  // ─── SUPPRIMER UN ITEM ───────────────────────────────────────
  const removeItem = (itemId: number) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  // ─── VIDER LE PANIER ─────────────────────────────────────────
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("shads_cart");
  };

  const total = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider value={{ cart, total, addToCart, updateQuantity, removeItem, clearCart, isLogged }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart doit être utilisé dans un CartProvider");
  return context;
}
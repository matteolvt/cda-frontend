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
  updateQuantity: (itemId: number, delta: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  isLogged: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  const getHeaders = () => {
    const token = localStorage.getItem("access_token");
    return {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    };
  };

  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem("access_token");
    setIsLogged(!!token);

    try {
      const saved = localStorage.getItem('shads_cart');
      if (saved) setCart(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    if (!isClient) return;
    localStorage.setItem('shads_cart', JSON.stringify(cart));
  }, [cart, isClient]);

  useEffect(() => {
    if (!isClient) return;
    const token = localStorage.getItem("access_token");
    if (!token) return;

    fetch(`${API_URL}/cart/`, { headers: getHeaders() })
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

  const addToCart = async (
    productId: number,
    quantity: number,
    customName?: string,
    customScent?: string
  ) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("🔒 Vous devez être connecté pour ajouter au panier.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/cart/add/`, {
        method: "POST",
        headers: getHeaders(),
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
      alert("✅ Produit ajouté au panier !");
    } catch (error) {
      console.error("Erreur ajout panier:", error);
    }
  };

  const updateQuantity = async (itemId: number, delta: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
    try {
      const res = await fetch(`${API_URL}/cart/update/${itemId}/`, {
        method: "PATCH",
        headers: getHeaders(),
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
    }
  };

  const removeItem = async (itemId: number) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
    try {
      await fetch(`${API_URL}/cart/remove/${itemId}/`, {
        method: "DELETE",
        headers: getHeaders(),
      });
    } catch (error) {
      console.error("Erreur suppression:", error);
    }
  };

  const total = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider value={{ cart, total, addToCart, updateQuantity, removeItem, isLogged }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart doit être utilisé dans un CartProvider");
  return context;
}
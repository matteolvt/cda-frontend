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

interface GuestCartItem {
  product_id: number;
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

  // ─── INIT ────────────────────────────────────────────────────
  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem("access_token");
    setIsLogged(!!token);

    try {
      const saved = localStorage.getItem('shads_cart');
      if (saved) setCart(JSON.parse(saved));
    } catch {}
  }, []);

  // ─── SYNC localStorage ───────────────────────────────────────
  useEffect(() => {
    if (!isClient) return;
    localStorage.setItem('shads_cart', JSON.stringify(cart));
  }, [cart, isClient]);

  // ─── CHARGEMENT PANIER (connecté uniquement) ─────────────────
  useEffect(() => {
    if (!isClient) return;
    const token = localStorage.getItem("access_token");
    if (!token) return;

    fetch(`${API_URL}/cart/`, { headers: getHeaders() })
      .then((res) => {
        // 🔑 MODIFICATION : Si le token est invalide, on le nettoie proprement
        if (res.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          setIsLogged(false);
          throw new Error("Token expiré, passage en mode visiteur");
        }
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

  // ─── AJOUTER AU PANIER ───────────────────────────────────────
  const addToCart = async (
    productId: number,
    quantity: number,
    customName?: string,
    customScent?: string
  ) => {
    const token = localStorage.getItem("access_token");

    // ✅ Connecté → appel API Django
    if (token) {
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
        
        if (res.status === 401) {
          localStorage.removeItem("access_token");
          setIsLogged(false);
          throw new Error("Token expiré");
        }
        
        if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
        const updatedCart = await res.json();
        const items = Array.isArray(updatedCart) ? updatedCart : [];
        setCart(items);
        localStorage.setItem('shads_cart', JSON.stringify(items));
      } catch (error) {
        console.error("Erreur ajout panier:", error);
      }
      return;
    }

    // ✅ Non connecté → panier local avec vraies infos produit
    const guestCart: GuestCartItem[] = JSON.parse(localStorage.getItem('shads_cart_guest') || '[]');
    const existing = guestCart.find(item => item.product_id === productId);

    if (existing) {
      existing.quantity += quantity;
      localStorage.setItem('shads_cart_guest', JSON.stringify(guestCart));
      setCart(prev => prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      guestCart.push({ product_id: productId, quantity, custom_name: customName, custom_scent: customScent });
      localStorage.setItem('shads_cart_guest', JSON.stringify(guestCart));

      try {
        const res = await fetch(`${API_URL}/products/${productId}/`);
        const product = await res.json();
        setCart(prev => [...prev, {
          id: productId,
          product: {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image || "",
          },
          quantity,
          custom_name: customName,
          custom_scent: customScent,
        }]);
      } catch {
        console.error("Impossible de récupérer les infos produit");
      }
    }
  };

  // ─── METTRE À JOUR LA QUANTITÉ ───────────────────────────────
  const updateQuantity = async (itemId: number, delta: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );

    const token = localStorage.getItem("access_token");
    if (!token) return;

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

  // ─── SUPPRIMER UN ITEM ───────────────────────────────────────
  const removeItem = async (itemId: number) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));

    const token = localStorage.getItem("access_token");
    if (!token) return;

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
"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, FileText } from "lucide-react";
import { authService } from "@/services/auth";
import { API_URL } from "@/lib/api";

interface User {
  user_id?: number;
  id?: number;
  email: string;
  firstname: string;
  lastname: string;
}

interface Order {
  reference: string;
  createdAt: string;
  isPaid: boolean;
  total: number;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem("access_token");
      
      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        const res = await fetch(`${API_URL}/auth/profile/`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (!res.ok) {
          if (res.status === 401) {
            authService.logout();
            return;
          }
          throw new Error(`Erreur HTTP ${res.status}`);
        }
        
        const data = await res.json();
        
        console.log("🕵️ Données brutes reçues de Django :", data);

        // 🛡️ ON S'ADAPTE AUX DEUX FORMATS :
        if (data.user) {
          // Format 1 : Les données sont bien rangées dans "user"
          setUser(data.user);
          setOrders(data.orders || []);
        } else if (data.email) {
          // Format 2 : Les données sont en vrac (anciennes routes Django)
          setUser(data);
          setOrders(data.orders || []); 
        } else {
          throw new Error("Format de réponse inattendu de l'API.");
        }
        
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : "Erreur inconnue";
        console.error("Erreur Profil:", msg);
        setErrorMsg(msg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    authService.logout();
  };

  if (errorMsg) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#EFDDD1] gap-4">
        <p className="text-red-600 uppercase tracking-widest text-sm font-bold">Aïe, une erreur s&apos;est produite :</p>
        <p className="text-stone-600 text-xs">{errorMsg}</p>
        <button onClick={handleLogout} className="mt-4 px-4 py-2 bg-stone-900 text-white text-xs uppercase tracking-widest">
          Se déconnecter pour l&apos;instant
        </button>
      </div>
    );
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EFDDD1]">
        <p className="text-stone-500 uppercase tracking-widest text-sm">Chargement...</p>
      </div>
    );
  }

  const capitalize = (str: string) => str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";
  const formatPrice = (cents: number) => (cents / 100).toFixed(2).replace('.', ',');

  return (
    <>
      <div className="w-full h-[208px] bg-[#FFF9F3]"></div>
      <section className="bg-[#EFDDD1] min-h-[calc(100vh-140px)] py-12 px-4 md:px-12">
        <div className="max-w-[1200px] mx-auto">

          {/* ─── EN-TÊTE ─────────────────────────────────────── */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-stone-300/50 pb-8 gap-6">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl text-stone-900 uppercase tracking-[0.2em] mb-2">
                Mon Compte
              </h1>
              <p className="text-stone-500 text-xs uppercase tracking-widest font-light">
                Ravi de vous revoir,{" "}
                <span className="text-stone-900 font-bold">
                  {capitalize(user.firstname)}
                </span>
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-3 border border-stone-300 text-stone-600 text-[10px] uppercase tracking-widest hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-colors"
            >
              Se déconnecter
            </button>
          </div>

          {/* ─── INFOS PERSONNELLES ───────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 shadow-sm border border-[#EFDDD1]">
              <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Prénom</p>
              <p className="text-stone-900 font-serif text-lg">{capitalize(user.firstname)}</p>
            </div>
            <div className="bg-white p-6 shadow-sm border border-[#EFDDD1]">
              <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Nom</p>
              <p className="text-stone-900 font-serif text-lg">{capitalize(user.lastname)}</p>
            </div>
            <div className="bg-white p-6 shadow-sm border border-[#EFDDD1]">
              <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Email</p>
              <p className="text-stone-900 font-serif text-lg">{user.email}</p>
            </div>
          </div>

          {/* ─── COMMANDES ───────────────────────────────────── */}
          <div className="bg-white p-8 shadow-sm border border-[#EFDDD1]">
            <div className="flex items-center gap-3 mb-6">
              <ShoppingBag className="w-4 h-4 text-stone-400" />
              <h2 className="font-serif text-xl text-stone-900 uppercase tracking-widest">
                Mes Commandes
              </h2>
            </div>
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-8 h-8 text-stone-300 mx-auto mb-4" />
                <p className="text-stone-400 text-xs uppercase tracking-widest">
                  Aucune commande pour le moment
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.reference} className="flex justify-between items-center p-4 border border-stone-100">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-stone-900 font-bold">
                        #{order.reference}
                      </p>
                      <p className="text-xs text-stone-400 mt-1">{order.createdAt}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-stone-900 font-serif">{formatPrice(order.total)} €</p>
                      <p className={`text-[10px] uppercase tracking-widest mt-1 ${order.isPaid ? 'text-green-600' : 'text-orange-500'}`}>
                        {order.isPaid ? 'Payée' : 'En attente'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </section>
    </>
  );
}
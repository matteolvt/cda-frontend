"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, FileText, ChevronDown, ChevronUp, Pencil } from "lucide-react";
import { authService } from "@/services/auth";
import { API_URL } from "@/lib/api";
import Link from "next/link";

interface User {
  user_id?: number;
  id?: number;
  email: string;
  firstname: string;
  lastname: string;
}

interface OrderDetail {
  order_detail_id: number;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

interface Order {
  order_id: number;
  reference: string;
  date: string;
  paid: boolean;
  address?: string;
  details: OrderDetail[];
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  // Edition profil
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ firstname: "", lastname: "", email: "" });
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState("");
  const [saveError, setSaveError] = useState("");

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

        if (data.user) {
          setUser(data.user);
          setEditForm({ firstname: data.user.firstname, lastname: data.user.lastname, email: data.user.email });
          setOrders(data.orders || []);
        } else if (data.email) {
          setUser(data);
          setEditForm({ firstname: data.firstname, lastname: data.lastname, email: data.email });
          setOrders(data.orders || []);
        } else {
          throw new Error("Format de réponse inattendu de l'API.");
        }
        
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : "Erreur inconnue";
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

  const toggleOrder = (orderId: number) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleSave = async () => {
    setSaveLoading(true);
    setSaveError("");
    setSaveSuccess("");

    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_URL}/auth/profile/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(JSON.stringify(data));
      }

      const data = await res.json();
      setUser(data.user || data);
      setIsEditing(false);
      setSaveSuccess("Profil mis à jour.");
      setTimeout(() => setSaveSuccess(""), 3000);
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : "Erreur lors de la sauvegarde.");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setEditForm({ firstname: user.firstname, lastname: user.lastname, email: user.email });
    }
    setIsEditing(false);
    setSaveError("");
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
  const orderTotal = (order: Order) => order.details.reduce((acc, d) => acc + d.total, 0);

  return (
    <>
      <div className="w-full h-[120px] md:h-[208px] bg-[#FFF9F3]"></div>
      
      <section className="bg-[#EFDDD1] min-h-[calc(100vh-140px)] py-10 md:py-12 px-4 md:px-12">
        <div className="max-w-[1200px] mx-auto">

          {/* En-tête */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 border-b border-stone-300/50 pb-6 md:pb-8 gap-4 md:gap-6">
            <div>
              <h1 className="font-serif text-2xl md:text-4xl text-stone-900 uppercase tracking-[0.2em] mb-2">
                Mon Compte
              </h1>
              <p className="text-stone-500 text-[10px] md:text-xs uppercase tracking-widest font-light">
                Ravi de vous revoir {" "}
                <span className="text-stone-900 font-bold">
                  {capitalize(user.firstname)}
                </span>
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full md:w-auto px-6 py-3 border border-stone-300 text-stone-600 text-[10px] md:text-xs uppercase tracking-widest text-center hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-colors"
            >
              Se déconnecter
            </button>
          </div>

          {/* Notifications */}
          {saveSuccess && (
            <div className="bg-green-50 border border-green-200 px-4 py-3 mb-6">
              <p className="text-green-800 text-xs uppercase tracking-widest">{saveSuccess}</p>
            </div>
          )}

          {/* Infos personnelles */}
          <div className="bg-white p-5 md:p-8 shadow-sm border border-[#EFDDD1] mb-8 md:mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-lg md:text-xl text-stone-900 uppercase tracking-widest">
                Informations personnelles
              </h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors"
                >
                  <Pencil className="w-3 h-3" />
                  Modifier
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-2">Prénom</label>
                    <input
                      type="text"
                      value={editForm.firstname}
                      onChange={(e) => setEditForm({ ...editForm, firstname: e.target.value })}
                      className="w-full border border-stone-200 bg-[#FDFBF7] px-4 py-3 text-sm text-stone-900 focus:outline-none focus:border-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-2">Nom</label>
                    <input
                      type="text"
                      value={editForm.lastname}
                      onChange={(e) => setEditForm({ ...editForm, lastname: e.target.value })}
                      className="w-full border border-stone-200 bg-[#FDFBF7] px-4 py-3 text-sm text-stone-900 focus:outline-none focus:border-stone-900"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-2">Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full border border-stone-200 bg-[#FDFBF7] px-4 py-3 text-sm text-stone-900 focus:outline-none focus:border-stone-900"
                  />
                </div>

                {saveError && (
                  <p className="text-red-600 text-xs uppercase tracking-widest">{saveError}</p>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleCancel}
                    className="flex-1 py-3 border border-stone-200 text-xs uppercase tracking-widest text-stone-600 hover:bg-stone-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saveLoading}
                    className="flex-1 py-3 bg-stone-900 text-white text-xs uppercase tracking-widest hover:bg-stone-700 transition-colors disabled:opacity-50"
                  >
                    {saveLoading ? "Sauvegarde..." : "Sauvegarder"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Prénom</p>
                  <p className="text-stone-900 font-serif text-base md:text-lg">{capitalize(user.firstname)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Nom</p>
                  <p className="text-stone-900 font-serif text-base md:text-lg">{capitalize(user.lastname)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Email</p>
                  <p className="text-stone-900 font-serif text-base md:text-lg overflow-hidden text-ellipsis">{user.email}</p>
                </div>
              </div>
            )}
          </div>

          {/* Commandes */}
          <div className="bg-white p-5 md:p-8 shadow-sm border border-[#EFDDD1]">
            <div className="flex items-center gap-3 mb-6">
              <ShoppingBag className="w-4 h-4 text-stone-400" />
              <h2 className="font-serif text-lg md:text-xl text-stone-900 uppercase tracking-widest">
                Mes Commandes
              </h2>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-8 md:py-12">
                <FileText className="w-8 h-8 text-stone-300 mx-auto mb-4" />
                <p className="text-stone-400 text-[10px] md:text-xs uppercase tracking-widest">
                  Aucune commande pour le moment
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.order_id} className="border border-stone-100">
                    
                    <button
                      onClick={() => toggleOrder(order.order_id)}
                      className="w-full flex justify-between items-center p-4 hover:bg-stone-50 transition-colors"
                    >
                      <div className="text-left">
                        <p className="text-[10px] md:text-xs uppercase tracking-widest text-stone-900 font-bold">
                          #{order.reference}
                        </p>
                        <p className="text-[10px] md:text-xs text-stone-400 mt-1">
                          {new Date(order.date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-stone-900 font-serif text-sm md:text-base">
                            {formatPrice(orderTotal(order))} €
                          </p>
                          <p className={`text-[9px] md:text-[10px] uppercase tracking-widest mt-1 ${order.paid ? 'text-green-600' : 'text-orange-500'}`}>
                            {order.paid ? 'Payée' : 'En attente'}
                          </p>
                        </div>
                        {expandedOrder === order.order_id
                          ? <ChevronUp className="w-4 h-4 text-stone-400 shrink-0" />
                          : <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                        }
                      </div>
                    </button>

                    {expandedOrder === order.order_id && (
                      <div className="border-t border-stone-100 p-4 space-y-4 bg-stone-50">

                        {order.address && (
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Adresse de livraison</p>
                            <p className="text-xs text-stone-700">{order.address}</p>
                          </div>
                        )}

                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-3">Produits</p>
                          <div className="space-y-2">
                            {(order.details || []).map((detail) => (
                              <div key={detail.order_detail_id} className="flex justify-between items-center py-2 border-b border-stone-100 last:border-0">
                                <div>
                                  <p className="text-xs text-stone-900">{detail.name}</p>
                                  <p className="text-[10px] text-stone-400 mt-0.5">
                                    {detail.quantity} × {formatPrice(detail.price)} €
                                  </p>
                                </div>
                                <p className="text-xs font-medium text-stone-900">
                                  {formatPrice(detail.total)} €
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-stone-200">
                          <p className="text-[10px] uppercase tracking-widest text-stone-500">Total</p>
                          <p className="font-serif text-stone-900">{formatPrice(orderTotal(order))} €</p>
                        </div>

                      </div>
                    )}

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
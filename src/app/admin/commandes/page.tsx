"use client";

import { useEffect, useState } from "react";
import { Search, Eye } from "lucide-react";
import { API_URL } from "@/lib/api";

interface OrderDetail {
  order_detail_id: number;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

interface UserDetail {
  email: string;
  firstname: string;
  lastname: string;
}

interface Order {
  order_id: number;
  reference: string;
  date: string;
  paid: boolean;
  address: string;
  details: OrderDetail[];
  user: number;
  user_detail?: UserDetail;
}

export default function AdminCommandesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : "";

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/orders/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : data.results || []);
    } catch {
      console.error("Erreur chargement commandes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const capitalize = (str: string) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

  const filtered = orders.filter(
    (o) =>
      o.reference.toLowerCase().includes(search.toLowerCase()) ||
      o.address?.toLowerCase().includes(search.toLowerCase()) ||
      o.user_detail?.email.toLowerCase().includes(search.toLowerCase()) ||
      o.user_detail?.firstname.toLowerCase().includes(search.toLowerCase()) ||
      o.user_detail?.lastname.toLowerCase().includes(search.toLowerCase())
  );

  const formatPrice = (cents: number) => (cents / 100).toFixed(2).replace(".", ",");
  const orderTotal = (order: Order) => order.details.reduce((acc, d) => acc + d.total, 0);

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-serif text-gray-900">Commandes</h1>
        <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">
          {orders.length} commande{orders.length > 1 ? "s" : ""}
        </p>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher par référence, adresse ou client..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:border-gray-400"
        />
      </div>

      <div className="bg-white border border-gray-100 shadow-sm overflow-x-auto">
        {isLoading ? (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-400 text-xs uppercase tracking-widest animate-pulse">Chargement...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-400 text-xs uppercase tracking-widest">Aucune commande</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-gray-400">Référence</th>
                <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-gray-400 hidden md:table-cell">Client</th>
                <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-gray-400 hidden md:table-cell">Date</th>
                <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-gray-400 hidden lg:table-cell">Adresse</th>
                <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-gray-400">Total</th>
                <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-gray-400">Statut</th>
                <th className="px-6 py-4 text-right text-[10px] uppercase tracking-widest text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((order) => (
                  <tr key={order.order_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-xs font-medium text-gray-900 uppercase tracking-widest">
                        #{order.reference}
                      </p>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      {order.user_detail ? (
                        <div>
                          <p className="text-xs text-gray-900">
                            {capitalize(order.user_detail.firstname)} {capitalize(order.user_detail.lastname)}
                          </p>
                          <p className="text-[10px] text-gray-400">{order.user_detail.email}</p>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400">—</p>
                      )}
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <p className="text-xs text-gray-600">
                        {new Date(order.date).toLocaleDateString("fr-FR")}
                      </p>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <p className="text-xs text-gray-600 truncate max-w-[200px]">
                        {order.address || "—"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-serif text-gray-900">
                        {formatPrice(orderTotal(order))} €
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] uppercase tracking-widest font-medium ${
                        order.paid ? "text-green-600" : "text-orange-500"
                      }`}>
                        {order.paid ? "Payée" : "En attente"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal détail commande */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xs uppercase tracking-widest text-gray-900 font-medium">
                #{selectedOrder.reference}
              </h2>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-900">✕</button>
            </div>

            <div className="p-6 space-y-6">

              {/* Infos générales */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Date</p>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedOrder.date).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Statut</p>
                  <span className={`text-sm font-medium ${selectedOrder.paid ? "text-green-600" : "text-orange-500"}`}>
                    {selectedOrder.paid ? "Payée" : "En attente"}
                  </span>
                </div>
              </div>

              {/* Infos client */}
              {selectedOrder.user_detail && (
                <div className="bg-gray-50 p-4 space-y-1">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">Client</p>
                  <p className="text-sm text-gray-900 font-medium">
                    {capitalize(selectedOrder.user_detail.firstname)} {capitalize(selectedOrder.user_detail.lastname)}
                  </p>
                  <p className="text-xs text-gray-500">{selectedOrder.user_detail.email}</p>
                </div>
              )}

              {/* Adresse */}
              {selectedOrder.address && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Adresse de livraison</p>
                  <p className="text-sm text-gray-900">{selectedOrder.address}</p>
                </div>
              )}

              {/* Produits */}
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-3">Produits</p>
                <div className="space-y-3">
                  {selectedOrder.details.map((detail) => (
                    <div key={detail.order_detail_id} className="flex justify-between items-center py-2 border-b border-gray-50">
                      <div>
                        <p className="text-sm text-gray-900">{detail.name}</p>
                        <p className="text-[10px] text-gray-400">
                          {detail.quantity} × {formatPrice(detail.price)} €
                        </p>
                      </div>
                      <p className="text-sm font-serif text-gray-900">
                        {formatPrice(detail.total)} €
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <p className="text-xs uppercase tracking-widest text-gray-900 font-medium">Total</p>
                <p className="text-lg font-serif text-gray-900">
                  {formatPrice(orderTotal(selectedOrder))} €
                </p>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
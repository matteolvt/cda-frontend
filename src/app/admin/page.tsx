"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Package, TrendingUp } from "lucide-react";
import { API_URL } from "@/lib/api";

interface Order {
  order_id: number;
  reference: string;
  date: string;
  paid: boolean;
  details: { total: number }[];
}

interface Product {
  product_id: number;
  name: string;
  stock: number;
  price: number;
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    const fetchData = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          fetch(`${API_URL}/orders/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/products/?limit=500`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const ordersData = await ordersRes.json();
        const productsData = await productsRes.json();

        setOrders(Array.isArray(ordersData) ? ordersData : ordersData.results || []);
        setProducts(Array.isArray(productsData) ? productsData : productsData.results || []);
      } catch (err) {
        console.error("Erreur dashboard:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalRevenue = orders
    .filter((o) => o.paid)
    .reduce((acc, o) => acc + o.details.reduce((s, d) => s + d.total, 0), 0);

  const paidOrders = orders.filter((o) => o.paid).length;
  const pendingOrders = orders.filter((o) => !o.paid).length;
  const lowStockProducts = products.filter((p) => p.stock < 5).length;

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const formatPrice = (cents: number) =>
    (cents / 100).toFixed(2).replace(".", ",");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400 text-xs uppercase tracking-widest animate-pulse">
          Chargement...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-2xl font-serif text-gray-900">Dashboard</h1>
        <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">
          Vue d&apos;ensemble
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={<TrendingUp size={20} />}
          label="Chiffre d'affaires"
          value={`${formatPrice(totalRevenue)} €`}
          color="bg-gray-900 text-white"
        />
        <StatCard
          icon={<ShoppingBag size={20} />}
          label="Commandes payées"
          value={paidOrders.toString()}
          color="bg-white text-gray-900"
        />
        <StatCard
          icon={<ShoppingBag size={20} />}
          label="En attente"
          value={pendingOrders.toString()}
          color="bg-white text-gray-900"
          valueColor="text-orange-500"
        />
        <StatCard
          icon={<Package size={20} />}
          label="Stock faible"
          value={lowStockProducts.toString()}
          color="bg-white text-gray-900"
          valueColor={lowStockProducts > 0 ? "text-red-600" : "text-green-600"}
        />
      </div>

      <div className="bg-white border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <ShoppingBag size={16} className="text-gray-400" />
          <h2 className="text-xs uppercase tracking-widest text-gray-900 font-medium">
            Dernières commandes
          </h2>
        </div>

        {recentOrders.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-400 text-xs uppercase tracking-widest">
              Aucune commande
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentOrders.map((order) => (
              <div key={order.order_id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-900 uppercase tracking-widest">
                    #{order.reference}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {new Date(order.date).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-serif text-gray-900">
                    {formatPrice(order.details.reduce((acc, d) => acc + d.total, 0))} €
                  </p>
                  <span className={`text-[10px] uppercase tracking-widest ${order.paid ? "text-green-600" : "text-orange-500"}`}>
                    {order.paid ? "Payée" : "En attente"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {lowStockProducts > 0 && (
        <div className="bg-white border border-red-100 shadow-sm">
          <div className="px-6 py-4 border-b border-red-100 flex items-center gap-3">
            <Package size={16} className="text-red-400" />
            <h2 className="text-xs uppercase tracking-widest text-red-600 font-medium">
              Produits en stock faible
            </h2>
          </div>
          <div className="divide-y divide-gray-50">
            {products
              .filter((p) => p.stock < 5)
              .map((product) => (
                <div key={product.product_id} className="px-6 py-4 flex items-center justify-between">
                  <p className="text-xs text-gray-900">{product.name}</p>
                  <span className={`text-xs font-medium ${product.stock === 0 ? "text-red-600" : "text-orange-500"}`}>
                    {product.stock === 0 ? "Rupture" : `${product.stock} restants`}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
  valueColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  valueColor?: string;
}) {
  return (
    <div className={`${color} border border-gray-100 shadow-sm p-6`}>
      <div className="flex items-center justify-between mb-4">
        <span className="opacity-60">{icon}</span>
      </div>
      <p className={`text-2xl font-serif mb-1 ${valueColor || ""}`}>{value}</p>
      <p className="text-[10px] uppercase tracking-widest opacity-60">{label}</p>
    </div>
  );
}
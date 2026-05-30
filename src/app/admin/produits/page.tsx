"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { API_URL } from "@/lib/api";

interface Category {
  category_id: number;
  name: string;
}

interface Product {
  product_id: number;
  name: string;
  price: number;
  stock: number;
  description: string;
  image: string;
  customizable: boolean;
  weight: number;
  categories: Category[];
}

export default function AdminProduitsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const emptyForm = {
    name: "",
    description: "",
    price: "",
    stock: "",
    weight: "",
    image: "",
    customizable: false,
    category_ids: [] as number[],
  };

  const [form, setForm] = useState(emptyForm);

  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : "";

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products/?limit=500`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : data.results || []);
    } catch {
      console.error("Erreur chargement produits");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/categories/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : data.results || []);
    } catch {
      console.error("Erreur chargement catégories");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setError("");
    setShowModal(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price?.toString() || "",
      stock: product.stock?.toString() || "",
      weight: product.weight?.toString() || "",
      image: product.image || "",
      customizable: product.customizable || false,
      category_ids: product.categories?.map((c) => c.category_id) || [],
    });
    setError("");
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      weight: parseInt(form.weight),
      image: form.image,
      customizable: form.customizable,
      category_ids: form.category_ids,
    };

    try {
      const url = editingProduct
        ? `${API_URL}/products/${editingProduct.product_id}/`
        : `${API_URL}/products/`;
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(JSON.stringify(data));
      }

      setSuccess(editingProduct ? "Produit modifié." : "Produit créé.");
      setShowModal(false);
      fetchProducts();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur");
    }
  };

  const handleDelete = async (productId: number) => {
    try {
      await fetch(`${API_URL}/products/${productId}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteConfirm(null);
      setSuccess("Produit supprimé.");
      fetchProducts();
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Erreur lors de la suppression.");
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const formatPrice = (cents: number) => (Number(cents) / 100).toFixed(2).replace(".", ",");

  return (
    <div className="space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-gray-900">Produits</h1>
          <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">
            {products.length} produit{products.length > 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-3 bg-gray-900 text-white text-xs uppercase tracking-widest hover:bg-gray-700 transition-colors"
        >
          <Plus size={16} />
          Nouveau produit
        </button>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 px-4 py-3">
          <p className="text-green-800 text-xs uppercase tracking-widest">{success}</p>
        </div>
      )}

      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher un produit..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:border-gray-400"
        />
      </div>

      <div className="bg-white border border-gray-100 shadow-sm">
        {isLoading ? (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-400 text-xs uppercase tracking-widest animate-pulse">Chargement...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-400 text-xs uppercase tracking-widest">Aucun produit</p>
          </div>
        ) : (
          <>
            {/* Mobile : cartes */}
            <div className="md:hidden divide-y divide-gray-50">
              {filtered.map((product) => (
                <div key={product.product_id} className="p-4 space-y-2">
                  <p className="text-sm text-gray-900 font-medium">{product.name}</p>
                  {product.customizable && (
                    <span className="text-[10px] text-blue-600 uppercase tracking-widest">Personnalisable</span>
                  )}
                  {product.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {product.categories.map((c) => (
                        <span key={c.category_id} className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[9px] uppercase tracking-widest">
                          {c.name}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-gray-900">{formatPrice(product.price)} €</span>
                      <span className={`font-medium ${
                        product.stock === 0 ? "text-red-600" :
                        product.stock < 5 ? "text-orange-500" :
                        "text-green-600"
                      }`}>
                        {product.stock === 0 ? "Rupture" : `${product.stock} en stock`}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleOpenEdit(product)} className="p-2 text-gray-400 hover:text-gray-900">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => setDeleteConfirm(product.product_id)} className="p-2 text-gray-400 hover:text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop : tableau */}
            <table className="w-full hidden md:table">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-gray-400">Nom</th>
                  <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-gray-400">Catégories</th>
                  <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-gray-400">Prix</th>
                  <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-gray-400">Stock</th>
                  <th className="px-6 py-4 text-right text-[10px] uppercase tracking-widest text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((product) => (
                  <tr key={product.product_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{product.name}</p>
                      {product.customizable && (
                        <span className="text-[10px] text-blue-600 uppercase tracking-widest">Personnalisable</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {product.categories.map((c) => (
                          <span key={c.category_id} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] uppercase tracking-widest">
                            {c.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{formatPrice(product.price)} €</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${
                        product.stock === 0 ? "text-red-600" :
                        product.stock < 5 ? "text-orange-500" :
                        "text-green-600"
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleOpenEdit(product)} className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => setDeleteConfirm(product.product_id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>

      {/* Modal création/édition */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xs uppercase tracking-widest text-gray-900 font-medium">
                {editingProduct ? "Modifier le produit" : "Nouveau produit"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-900">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Nom *</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-gray-400" />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
                  className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-gray-400 resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Prix (centimes) *</label>
                  <input type="number" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-gray-400" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Stock *</label>
                  <input type="number" required value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Poids (grammes) *</label>
                <input type="number" required value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })}
                  className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-gray-400" />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Image (URL)</label>
                <input type="text" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-gray-400" />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Catégories</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.category_id}
                      type="button"
                      onClick={() => {
                        const ids = form.category_ids.includes(cat.category_id)
                          ? form.category_ids.filter((id) => id !== cat.category_id)
                          : [...form.category_ids, cat.category_id];
                        setForm({ ...form, category_ids: ids });
                      }}
                      className={`px-3 py-1.5 text-[10px] uppercase tracking-widest transition-colors ${
                        form.category_ids.includes(cat.category_id)
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input type="checkbox" id="customizable" checked={form.customizable}
                  onChange={(e) => setForm({ ...form, customizable: e.target.checked })}
                  className="w-4 h-4" />
                <label htmlFor="customizable" className="text-xs uppercase tracking-widest text-gray-600">
                  Produit personnalisable
                </label>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 px-4 py-3">
                  <p className="text-red-800 text-xs">{error}</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border border-gray-200 text-xs uppercase tracking-widest text-gray-600 hover:bg-gray-50 transition-colors">
                  Annuler
                </button>
                <button type="submit"
                  className="flex-1 py-3 bg-gray-900 text-white text-xs uppercase tracking-widest hover:bg-gray-700 transition-colors">
                  {editingProduct ? "Modifier" : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal suppression */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm p-6 space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-gray-900 font-medium">
              Confirmer la suppression
            </h2>
            <p className="text-sm text-gray-500">
              Cette action est irréversible. Le produit sera définitivement supprimé.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3 border border-gray-200 text-xs uppercase tracking-widest text-gray-600 hover:bg-gray-50 transition-colors">
                Annuler
              </button>
              <button onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-3 bg-red-600 text-white text-xs uppercase tracking-widest hover:bg-red-700 transition-colors">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
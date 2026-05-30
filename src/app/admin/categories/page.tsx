"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
import { API_URL } from "@/lib/api";

interface Category {
  category_id: number;
  name: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : "";

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/categories/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : data.results || []);
    } catch {
      console.error("Erreur chargement catégories");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setName("");
    setError("");
    setShowModal(true);
  };

  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    setName(category.name);
    setError("");
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const url = editingCategory
        ? `${API_URL}/categories/${editingCategory.category_id}/`
        : `${API_URL}/categories/`;
      const method = editingCategory ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(JSON.stringify(data));
      }

      setSuccess(editingCategory ? "Catégorie modifiée." : "Catégorie créée.");
      setShowModal(false);
      fetchCategories();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur");
    }
  };

  const handleDelete = async (categoryId: number) => {
    try {
      await fetch(`${API_URL}/categories/${categoryId}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteConfirm(null);
      setSuccess("Catégorie supprimée.");
      fetchCategories();
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Erreur lors de la suppression.");
    }
  };

  return (
    <div className="space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-gray-900">Catégories</h1>
          <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">
            {categories.length} catégorie{categories.length > 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-3 bg-gray-900 text-white text-xs uppercase tracking-widest hover:bg-gray-700 transition-colors"
        >
          <Plus size={16} />
          Nouvelle catégorie
        </button>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 px-4 py-3">
          <p className="text-green-800 text-xs uppercase tracking-widest">{success}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 px-4 py-3">
          <p className="text-red-800 text-xs uppercase tracking-widest">{error}</p>
        </div>
      )}

      <div className="bg-white border border-gray-100 shadow-sm">
        {isLoading ? (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-400 text-xs uppercase tracking-widest animate-pulse">Chargement...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Tag className="w-8 h-8 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400 text-xs uppercase tracking-widest">Aucune catégorie</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {categories.map((cat) => (
              <div key={cat.category_id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Tag size={14} className="text-gray-400" />
                  <p className="text-sm text-gray-900">{cat.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(cat.category_id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal création/édition */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xs uppercase tracking-widest text-gray-900 font-medium">
                {editingCategory ? "Modifier la catégorie" : "Nouvelle catégorie"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-900">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Nom *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-gray-400"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 px-4 py-3">
                  <p className="text-red-800 text-xs">{error}</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border border-gray-200 text-xs uppercase tracking-widest text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gray-900 text-white text-xs uppercase tracking-widest hover:bg-gray-700 transition-colors"
                >
                  {editingCategory ? "Modifier" : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal confirmation suppression */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm p-6 space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-gray-900 font-medium">
              Confirmer la suppression
            </h2>
            <p className="text-sm text-gray-500">
              Cette catégorie sera définitivement supprimée. Les produits associés ne seront pas supprimés.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3 border border-gray-200 text-xs uppercase tracking-widest text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-3 bg-red-600 text-white text-xs uppercase tracking-widest hover:bg-red-700 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
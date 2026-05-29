"use client";

import { useEffect, useState } from "react";
import { Search, Users } from "lucide-react";
import { API_URL } from "@/lib/api";

interface User {
  user_id: number;
  email: string;
  firstname: string;
  lastname: string;
  roles: string[];
  is_staff: boolean;
}

export default function AdminUtilisateursPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : "";

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/users/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 404) {
        setError("La route /users/ n'existe pas encore dans le backend.");
        return;
      }

      if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);

      const data = await res.json();
      setUsers(Array.isArray(data) ? data : data.results || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur chargement utilisateurs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.firstname?.toLowerCase().includes(search.toLowerCase()) ||
      u.lastname?.toLowerCase().includes(search.toLowerCase())
  );

  const capitalize = (str: string) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-serif text-gray-900">Utilisateurs</h1>
        <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">
          {users.length} utilisateur{users.length > 1 ? "s" : ""}
        </p>
      </div>

      {error ? (
        <div className="bg-orange-50 border border-orange-200 px-4 py-3">
          <p className="text-orange-800 text-xs uppercase tracking-widest">{error}</p>
          <p className="text-orange-600 text-xs mt-1">
            À ajouter dans le backend : route GET /api/users/ accessible aux admins uniquement.
          </p>
        </div>
      ) : (
        <>
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par email, prénom ou nom..."
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
                <Users className="w-8 h-8 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-400 text-xs uppercase tracking-widest">Aucun utilisateur</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-gray-400">Utilisateur</th>
                    <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-gray-400 hidden md:table-cell">Email</th>
                    <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-gray-400">Rôle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((user) => (
                    <tr key={user.user_id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">
                          {capitalize(user.firstname)} {capitalize(user.lastname)}
                        </p>
                        <p className="text-[10px] text-gray-400 md:hidden">{user.email}</p>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] uppercase tracking-widest font-medium px-2 py-1 ${
                          user.is_staff
                            ? "bg-gray-900 text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          {user.is_staff ? "Admin" : "Client"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

    </div>
  );
}
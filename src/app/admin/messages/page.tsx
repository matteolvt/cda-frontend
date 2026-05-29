"use client";

import { useEffect, useState } from "react";
import { Search, Eye, Trash2, MessageSquare } from "lucide-react";
import { API_URL } from "@/lib/api";

interface Message {
  message_id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [success, setSuccess] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : "";

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${API_URL}/messages/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : data.results || []);
    } catch {
      console.error("Erreur chargement messages");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (messageId: number) => {
    try {
      await fetch(`${API_URL}/messages/${messageId}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteConfirm(null);
      setSelectedMessage(null);
      setSuccess("Message supprimé.");
      fetchMessages();
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      console.error("Erreur suppression message");
    }
  };

  const filtered = messages.filter(
    (m) =>
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.firstname.toLowerCase().includes(search.toLowerCase()) ||
      m.lastname.toLowerCase().includes(search.toLowerCase())
  );

  const capitalize = (str: string) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-serif text-gray-900">Messages</h1>
        <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">
          {messages.length} message{messages.length > 1 ? "s" : ""}
        </p>
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
          placeholder="Rechercher par email, nom ou sujet..."
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
            <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400 text-xs uppercase tracking-widest">Aucun message</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-gray-400">Expéditeur</th>
                <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-gray-400 hidden md:table-cell">Sujet</th>
                <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-gray-400 hidden lg:table-cell">Date</th>
                <th className="px-6 py-4 text-right text-[10px] uppercase tracking-widest text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((msg) => (
                  <tr key={msg.message_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">
                        {capitalize(msg.firstname)} {capitalize(msg.lastname)}
                      </p>
                      <p className="text-[10px] text-gray-400">{msg.email}</p>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <p className="text-sm text-gray-600 truncate max-w-[200px]">{msg.subject}</p>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <p className="text-xs text-gray-400">
                        {new Date(msg.date).toLocaleDateString("fr-FR")}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedMessage(msg)}
                          className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(msg.message_id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal détail message */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xs uppercase tracking-widest text-gray-900 font-medium">
                {selectedMessage.subject}
              </h2>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-gray-400 hover:text-gray-900"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Expéditeur</p>
                  <p className="text-sm text-gray-900">
                    {capitalize(selectedMessage.firstname)} {capitalize(selectedMessage.lastname)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Date</p>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedMessage.date).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Email</p>
                  
                    <a  href={`mailto:${selectedMessage.email}`}
                    className="text-sm text-gray-900 hover:underline"
                  >
                    {selectedMessage.email}
                  </a>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Téléphone</p>
                  <p className="text-sm text-gray-900">{selectedMessage.phone}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">Message</p>
                <div className="bg-gray-50 p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                
                <a  href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                  className="flex-1 py-3 bg-gray-900 text-white text-xs uppercase tracking-widest hover:bg-gray-700 transition-colors text-center"
                >
                  Répondre par email
                </a>
                <button
                  onClick={() => setDeleteConfirm(selectedMessage.message_id)}
                  className="px-4 py-3 border border-red-200 text-red-600 text-xs uppercase tracking-widest hover:bg-red-50 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm p-6 space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-gray-900 font-medium">
              Confirmer la suppression
            </h2>
            <p className="text-sm text-gray-500">
              Ce message sera définitivement supprimé.
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
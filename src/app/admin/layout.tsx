"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  LogOut,
  ChevronRight,
  Users,
  MessageSquare,
  Tag,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  is_staff: boolean;
  user_id: string;
  exp: number;
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/produits", label: "Produits", icon: Package },
  { href: "/admin/commandes", label: "Commandes", icon: ShoppingBag },
  { href: "/admin/utilisateurs", label: "Utilisateurs", icon: Users },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/categories", label: "Catégories", icon: Tag },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.push("/");
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);

      if (!decoded.is_staff) {
        router.push("/");
        return;
      }

      setAdminEmail(decoded.user_id);
      setAuthorized(true);
    } catch {
      router.push("/");
    }
  }, [router]);

  // Ferme le menu mobile au changement de page
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    router.push("/");
  };

  if (!authorized) return null;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-8 border-b border-gray-800">
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Administration</p>
        <p className="text-white font-serif italic text-xl">Shad&apos;s Candle</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest transition-colors rounded ${
                isActive
                  ? "bg-white text-gray-900 font-medium"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon size={16} />
              {label}
              {isActive && <ChevronRight size={14} className="ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer sidebar */}
      <div className="px-4 py-6 border-t border-gray-800 space-y-1">
        {/* Retour au site */}
        <Link
          href="/"
          className="flex items-center gap-3 w-full px-4 py-3 text-xs uppercase tracking-widest text-gray-400 hover:bg-gray-800 hover:text-white transition-colors rounded"
        >
          <ExternalLink size={16} />
          Retour au site
        </Link>

        {/* <p className="text-[10px] text-gray-500 uppercase tracking-widest px-4 py-2 truncate">
          {adminEmail}
        </p> */}

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-xs uppercase tracking-widest text-gray-400 hover:bg-gray-800 hover:text-red-400 transition-colors rounded"
        >
          <LogOut size={16} />
          Déconnexion
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex fixed top-0 left-0 h-full w-64 bg-gray-900 text-white flex-col z-50">
        <SidebarContent />
      </aside>

      {/* Sidebar Mobile — Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Mobile — Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white flex flex-col z-50 lg:hidden transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-2"
          onClick={() => setSidebarOpen(false)}
        >
          <X size={20} />
        </button>
        <SidebarContent />
      </aside>

      {/* Contenu principal */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">

        {/* Header mobile */}
        <header className="lg:hidden flex items-center justify-between px-4 py-4 bg-white border-b border-gray-100 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            <Menu size={20} />
          </button>
          <p className="font-serif italic text-gray-900">Shad&apos;s Candle</p>
          <div className="w-8" />
        </header>

        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>

      </div>
    </div>
  );
}
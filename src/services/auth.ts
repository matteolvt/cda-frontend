const API_URL = "http://localhost:8000/api";

export const authService = {
  // Inscription
  register: async (userData: any) => {
    const res = await fetch(`${API_URL}/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!res.ok) throw new Error("Erreur lors de l'inscription");
    return res.json();
  },

  // Connexion
  login: async (credentials: any) => {
    const res = await fetch(`${API_URL}/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    if (!res.ok) throw new Error("Email ou mot de passe incorrect");
    const data = await res.json();
    
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);
    
    return data;
  },

  // Déconnexion
  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/login";
  }
};
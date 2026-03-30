// src/app/contact/page.tsx
"use client";

import ReassuranceSection from "../../components/Global/ReassuranceSection";

export default function ContactPage() {
  
  // Fonction qui s'exécutera quand on clique sur "J'envoie ma requête"
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Empêche le rechargement classique de la page
    
    // Récupération des données du formulaire
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    console.log("Données du formulaire prêtes à être envoyées :", data);
    alert("Merci pour votre message ! Nous vous répondrons très vite.");
    
    // Ici, plus tard, on fera le fetch() vers ton API Django pour envoyer l'email !
    
    // Optionnel : vider le formulaire après envoi
    e.currentTarget.reset();
  };

  return (
    <main>
      {/* === 1. NAVBAR SPACE === */}
      <div className="w-full h-[208px] bg-[#FFF9F3]"></div>

      {/* === 2. SECTION FORMULAIRE === */}
      <section className="bg-[#EFDDD1] w-full py-20 min-h-[calc(100vh-140px-300px)]">
        
        {/* Conteneur formulaire (étroit) */}
        <div className="max-w-[800px] mx-auto px-4 md:px-0">
          
          <div className="text-center mb-16">
            <h1 className="font-serif text-[35px] md:text-[55px] text-stone-900 uppercase tracking-widest mb-6">
              Nous Contacter
            </h1>
            <div className="text-stone-700 text-xl font-light italic">
              <p>Une question, une demande ?</p>
              <p>Nous serons ravis de vous répondre dans les plus brefs délais</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input 
                type="text" 
                name="firstname" 
                placeholder="Prénom" 
                required 
                className="w-full bg-white px-6 py-4 text-stone-900 placeholder-stone-900 font-medium outline-none focus:ring-1 focus:ring-stone-500 rounded-sm" 
              />
              <input 
                type="text" 
                name="lastname" 
                placeholder="Nom" 
                required 
                className="w-full bg-white px-6 py-4 text-stone-900 placeholder-stone-900 font-medium outline-none focus:ring-1 focus:ring-stone-500 rounded-sm" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input 
                type="email" 
                name="email" 
                placeholder="Email" 
                required 
                className="w-full bg-white px-6 py-4 text-stone-900 placeholder-stone-900 font-medium outline-none focus:ring-1 focus:ring-stone-500 rounded-sm" 
              />
              <input 
                type="tel" 
                name="phone" 
                placeholder="Téléphone" 
                className="w-full bg-white px-6 py-4 text-stone-900 placeholder-stone-900 font-medium outline-none focus:ring-1 focus:ring-stone-500 rounded-sm" 
              />
            </div>

            <input 
              type="text" 
              name="subject" 
              placeholder="Objet" 
              required 
              className="w-full bg-white px-6 py-4 text-stone-900 placeholder-stone-900 font-medium outline-none focus:ring-1 focus:ring-stone-500 rounded-sm" 
            />

            <textarea 
              name="message" 
              rows={8} 
              placeholder="Message" 
              required 
              className="w-full bg-white px-6 py-4 text-stone-900 placeholder-stone-900 font-medium outline-none focus:ring-1 focus:ring-stone-500 rounded-sm resize-none"
            ></textarea>

            <div className="flex items-start gap-3 mt-2">
              <input 
                type="checkbox" 
                id="rgpd" 
                name="rgpd"
                required 
                className="mt-1 accent-stone-900 cursor-pointer" 
              />
              <label htmlFor="rgpd" className="text-xs text-stone-700 font-light cursor-pointer select-none">
                En soumettant ce formulaire, j&apos;accepte que les informations saisies soient exploitées dans le cadre de ma demande et de la relation commerciale qui peut en découler.
              </label>
            </div>

            <div className="mt-6">
              <button 
                type="submit" 
                className="bg-[#6F1E1A] text-white font-medium uppercase tracking-[0.1em] px-8 py-4 shadow-md hover:bg-[#43120F] transition-colors w-full md:w-auto text-sm md:text-base rounded-sm"
              >
                J&apos;envoie ma requête
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* === 3. SECTION RÉASSURANCE === */}
      <ReassuranceSection />
      
    </main>
  );
}
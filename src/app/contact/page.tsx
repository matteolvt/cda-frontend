"use client";

import ReassuranceSection from "../../components/Global/ReassuranceSection";

export default function ContactPage() {
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    console.log("Données du formulaire prêtes à être envoyées :", data);
    alert("Merci pour votre message ! Nous vous répondrons très vite.");
    
    
    e.currentTarget.reset();
  };

  return (
    <main>
      {/* === 1. NAVBAR SPACE === */}
      {/* Modification ici : hauteur réduite sur mobile (h-[120px]) et normale sur ordi (md:h-[208px]) */}
      <div className="w-full h-[120px] md:h-[208px] bg-[#FFF9F3]"></div>

      {/* === 2. SECTION FORMULAIRE === */}
      {/* Espacement vertical réduit sur mobile (py-12 au lieu de py-20) */}
      <section className="bg-[#EFDDD1] w-full py-12 md:py-20 min-h-[calc(100vh-140px-300px)]">
        
        {/* Conteneur formulaire */}
        <div className="max-w-[800px] mx-auto px-4 md:px-0">
          
          <div className="text-center mb-10 md:mb-16">
            <h1 className="font-serif text-3xl md:text-[55px] text-stone-900 uppercase tracking-widest mb-4 md:mb-6">
              Nous Contacter
            </h1>
            <div className="text-stone-700 text-base md:text-xl font-light italic">
              <p>Une question, une demande ?</p>
              <p>Nous serons ravis de vous répondre dans les plus brefs délais</p>
            </div>
          </div>

          {/* Réduction de l'espace entre les champs sur mobile (gap-4) */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <input 
                type="text" 
                name="firstname" 
                placeholder="Prénom" 
                required 
                className="w-full bg-white px-4 py-3 md:px-6 md:py-4 text-sm md:text-base text-stone-900 placeholder-stone-900 font-medium outline-none focus:ring-1 focus:ring-stone-500 rounded-sm" 
              />
              <input 
                type="text" 
                name="lastname" 
                placeholder="Nom" 
                required 
                className="w-full bg-white px-4 py-3 md:px-6 md:py-4 text-sm md:text-base text-stone-900 placeholder-stone-900 font-medium outline-none focus:ring-1 focus:ring-stone-500 rounded-sm" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <input 
                type="email" 
                name="email" 
                placeholder="Email" 
                required 
                className="w-full bg-white px-4 py-3 md:px-6 md:py-4 text-sm md:text-base text-stone-900 placeholder-stone-900 font-medium outline-none focus:ring-1 focus:ring-stone-500 rounded-sm" 
              />
              <input 
                type="tel" 
                name="phone" 
                placeholder="Téléphone" 
                className="w-full bg-white px-4 py-3 md:px-6 md:py-4 text-sm md:text-base text-stone-900 placeholder-stone-900 font-medium outline-none focus:ring-1 focus:ring-stone-500 rounded-sm" 
              />
            </div>

            <input 
              type="text" 
              name="subject" 
              placeholder="Objet" 
              required 
              className="w-full bg-white px-4 py-3 md:px-6 md:py-4 text-sm md:text-base text-stone-900 placeholder-stone-900 font-medium outline-none focus:ring-1 focus:ring-stone-500 rounded-sm" 
            />

            <textarea 
              name="message" 
              rows={8} 
              placeholder="Message" 
              required 
              className="w-full bg-white px-4 py-3 md:px-6 md:py-4 text-sm md:text-base text-stone-900 placeholder-stone-900 font-medium outline-none focus:ring-1 focus:ring-stone-500 rounded-sm resize-none"
            ></textarea>

            <div className="flex items-start gap-3 mt-2">
              <input 
                type="checkbox" 
                id="rgpd" 
                name="rgpd"
                required 
                className="mt-1 accent-stone-900 cursor-pointer w-4 h-4 shrink-0" 
              />
              <label htmlFor="rgpd" className="text-[10px] md:text-xs text-stone-700 font-light cursor-pointer select-none leading-relaxed">
                En soumettant ce formulaire, j&apos;accepte que les informations saisies soient exploitées dans le cadre de ma demande et de la relation commerciale qui peut en découler.
              </label>
            </div>

            <div className="mt-2 md:mt-6">
              <button 
                type="submit" 
                className="bg-[#6F1E1A] text-white font-medium uppercase tracking-[0.1em] px-8 py-3 md:py-4 shadow-md hover:bg-[#43120F] transition-colors w-full md:w-auto text-sm md:text-base rounded-sm"
              >
                Envoyer
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
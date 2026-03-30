export default function ReassuranceSection() {
  return (
    <section className="bg-[#EFDDD1] pt-[140px] pb-24 font-sans">
      <hr className="w-full border-none h-[1px] bg-black opacity-20 mb-[90px]" />
      <div className="w-full px-4 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
        {[
          { title: "PAIEMENT SÉCURISÉ", text: "Carte bancaire, Paypal, Apple Pay" },
          { title: "LIVRAISON GRATUITE", text: "À domicile ou en point de retrait" },
          { title: "SAV RÉACTIF", text: "Une question, un problème ? Contactez-nous" },
          { title: "POLITIQUE ANTI-CASSE", text: "Bougie reçue cassée ?<br />Nous prenons tout en charge" },
        ].map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <h3 className="font-bold uppercase text-black mb-3 tracking-wider text-sm md:text-base">{item.title}</h3>
            <p className="text-stone-800 text-sm leading-relaxed max-w-[200px] mx-auto" dangerouslySetInnerHTML={{ __html: item.text }} />
          </div>
        ))}
      </div>
    </section>
  );
}
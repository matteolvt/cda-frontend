import Link from "next/link";

export default function CategorySection() {
  return (
    <section className="bg-[#EFDDD1] pt-[140px] pb-24 px-4">
      <div className="flex flex-wrap justify-center gap-[80px]">
        <Link href="/produits?category=parfumees" className="relative w-full max-w-[731px] h-[829px] overflow-hidden group cursor-pointer shrink-0 block">
          <img src="/images/bougiesParf.png" alt="Bougies parfumées" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/20 transition-opacity group-hover:bg-black/30"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-start pt-16 text-center text-[#FDFBF7] p-6">
            <h3 className="font-serif text-2xl md:text-3xl lg:text-4xl mb-3 tracking-wide">LES BOUGIES PARFUMÉES</h3>
            <p className="text-[10px] md:text-xs tracking-[0.2em] uppercase font-light max-w-md leading-relaxed">DES BOUGIES EN POT AVEC DES PARFUMS SOIGNÉS QUE VOUS ALLEZ ADORER</p>
          </div>
        </Link>
        <Link href="/produits?category=moulees" className="relative w-full max-w-[731px] h-[829px] overflow-hidden group cursor-pointer shrink-0 block">
          <img src="/images/bougiesMoul.png" alt="Bougies moulées" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/20 transition-opacity group-hover:bg-black/30"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-start pt-16 text-center text-[#FDFBF7] p-6">
            <h3 className="font-serif text-2xl md:text-3xl lg:text-4xl mb-3 tracking-wide">LES BOUGIES MOULÉES</h3>
            <p className="text-[10px] md:text-xs tracking-[0.2em] uppercase font-light max-w-md leading-relaxed">DES BOUGIES AVEC UN ESTHÉTISME TRÈS FORT ET PARFAIT POUR LES FÊTES</p>
          </div>
        </Link>
      </div>
    </section>
  );
}
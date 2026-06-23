import Link from "next/link";
import Image from "next/image";

export default function CategorySection() {
  return (
    <section className="bg-[#EFDDD1] pt-20 md:pt-[140px] pb-12 md:pb-24 px-2 md:px-4">
      <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap md:justify-center md:gap-[80px]">
        
        {/* BOUGIES PARFUMÉES */}
        <Link href="/produits?category=parfumees" className="relative w-full h-[350px] md:max-w-[731px] md:h-[829px] overflow-hidden group cursor-pointer block">
          <Image src="/images/bougiesParf.png" alt="Bougies parfumées" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" width={731} height={829} />
          <div className="absolute inset-0 bg-black/20 transition-opacity group-hover:bg-black/30"></div>
          
          <div className="absolute inset-0 flex flex-col items-center justify-start pt-8 md:pt-16 text-center text-[#FDFBF7] px-2 md:px-6">
            <h3 className="font-serif text-[16px] leading-tight md:text-3xl lg:text-4xl mb-2 md:mb-3 tracking-wide">
              LES BOUGIES<br className="md:hidden" /> PARFUMÉES
            </h3>
            <p className="text-[8px] md:text-xs tracking-[0.1em] md:tracking-[0.2em] uppercase font-light max-w-md leading-relaxed">
              DES BOUGIES EN POT AVEC DES PARFUMS SOIGNÉS<span className="hidden md:inline"> QUE VOUS ALLEZ ADORER</span>
            </p>
          </div>
        </Link>

        {/* BOUGIES MOULÉES */}
        <Link href="/produits?category=moulees" className="relative w-full h-[350px] md:max-w-[731px] md:h-[829px] overflow-hidden group cursor-pointer block">
          <Image src="/images/bougiesMoul.png" alt="Bougies moulées" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" width={731} height={829} />
          <div className="absolute inset-0 bg-black/20 transition-opacity group-hover:bg-black/30"></div>
          
          <div className="absolute inset-0 flex flex-col items-center justify-start pt-8 md:pt-16 text-center text-[#FDFBF7] px-2 md:px-6">
            <h3 className="font-serif text-[16px] leading-tight md:text-3xl lg:text-4xl mb-2 md:mb-3 tracking-wide">
              LES BOUGIES<br className="md:hidden" /> MOULÉES
            </h3>
            <p className="text-[8px] md:text-xs tracking-[0.1em] md:tracking-[0.2em] uppercase font-light max-w-md leading-relaxed">
              DES BOUGIES AVEC UN ESTHÉTISME TRÈS FORT<span className="hidden md:inline"> ET PARFAIT POUR LES FÊTES</span>
            </p>
          </div>
        </Link>

      </div>
    </section>
  );
}
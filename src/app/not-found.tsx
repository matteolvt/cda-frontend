import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <div className="w-full h-[120px] md:h-[208px] bg-[#FDFBF7]"></div>

      <section className="bg-[#EFDDD1] min-h-[calc(100vh-140px)] flex items-center justify-center py-10 md:py-20 px-4">
        <div className="text-center space-y-6">

          <p className="font-serif text-[80px] md:text-[120px] text-stone-900 leading-none">
            404
          </p>

          <h1 className="font-serif text-xl md:text-3xl text-stone-900 uppercase tracking-[0.2em]">
            Page introuvable
          </h1>

          <p className="text-stone-500 text-[10px] md:text-xs uppercase tracking-widest font-light max-w-md mx-auto">
            La page que vous recherchez n&apos;existe pas ou a été déplacée.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="bg-stone-900 text-white px-8 py-4 uppercase tracking-[0.3em] text-[10px] md:text-[11px] font-bold hover:bg-stone-800 transition-colors duration-500 shadow-lg"
            >
              Retour à l&apos;accueil
            </Link>
            <Link
              href="/produits"
              className="border border-stone-300 text-stone-600 px-8 py-4 uppercase tracking-[0.3em] text-[10px] md:text-[11px] font-bold hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-colors"
            >
              Voir la boutique
            </Link>
          </div>

        </div>
      </section>
    </>
  );
}
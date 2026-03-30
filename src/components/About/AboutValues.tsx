export default function AboutValues() {
  return (
    <section className="w-full bg-[#FDFBF7] py-24">
      <div className="max-w-[1542px] mx-auto px-4 md:px-12">
        <h2 className="font-serif text-[42px] text-center mb-20 tracking-widest text-stone-900">
          Nos Valeurs
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
          {/* Bloc 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-full aspect-[4/5] bg-[#D9D9D9] mb-8"></div>
            <h3 className="font-bold uppercase tracking-[0.2em] text-sm mb-4">
              Nature & Authenticité
            </h3>
            <p className="font-light text-base leading-relaxed text-stone-600 px-4">
              Des cires végétales, des mèches en coton, et des senteurs inspirées de la nature.
            </p>
          </div>

          {/* Bloc 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-full aspect-[4/5] bg-[#D9D9D9] mb-8"></div>
            <h3 className="font-bold uppercase tracking-[0.2em] text-sm mb-4">
              Savoir-faire artisanal
            </h3>
            <p className="font-light text-base leading-relaxed text-stone-600 px-4">
              Chaque bougie est fabriquée à la main, avec le souci du détail.
            </p>
          </div>

          {/* Bloc 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-full aspect-[4/5] bg-[#D9D9D9] mb-8"></div>
            <h3 className="font-bold uppercase tracking-[0.2em] text-sm mb-4">
              Partage & Bien-être
            </h3>
            <p className="font-light text-base leading-relaxed text-stone-600 px-4">
              Nos créations sont pensées pour offrir des moments de douceur.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
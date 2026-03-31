import Link from "next/link";
import AboutValues from "../../components/About/AboutValues";
import ReassuranceSection from "../../components/Global/ReassuranceSection";

export default function AboutPage() {
  return (
    <main>
      <div className="w-full h-[208px] bg-[#FFF9F3]"></div>

      <section className="bg-[#EFDDD1] w-full py-20">
        <div className="max-w-[1542px] mx-auto px-4 md:px-12">

          <div className="text-center mb-16">
            <h1 className="font-serif text-[35px] md:text-[55px] text-stone-900 uppercase tracking-widest mb-6">
              À Propos de Nous
            </h1>
            <p className="text-stone-700 text-xl font-light italic">
              Une passion pour la lumière, la douceur et l&apos;artisanat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="w-full h-auto aspect-square bg-stone-200 rounded-sm overflow-hidden shadow-sm">
              <img 
                src="/images/histoire.png" 
                alt="Notre histoire" 
                className="w-full h-full object-cover" 
              />
            </div>

            <div className="flex flex-col gap-6">
              <h2 className="font-serif text-3xl md:text-4xl text-stone-900">
                Notre Histoire, vos bougies.
              </h2>
              <div className="prose prose-stone font-light leading-relaxed text-stone-800 text-lg">
                <p>
                  Shad&apos;s Candle est né d&apos;une passion qui m&apos;anime depuis l&apos;adolescence : 
                  celle de créer et de fabriquer de mes propres mains.
                </p>
                <p className="mt-4">
                  Au départ, je confectionnais des bougies pour mes proches et mes amis, 
                  à l&apos;occasion d&apos;un anniversaire ou des fêtes de Noël, simplement pour 
                  le plaisir d&apos;offrir et de faire sourire.
                </p>
                <p className="mt-4">
                  Quelques années plus tard, avec le soutien de mon compagnon, j&apos;ai décidé 
                  d&apos;en faire ma vocation. Aujourd&apos;hui, je souhaite partager avec vous cette 
                  passion et le savoir-faire que j&apos;ai acquis au fil du temps.
                </p>
                <p className="mt-4">
                  Shad&apos;s Candle, c&apos;est bien plus qu&apos;un projet : c&apos;est une aventure humaine, 
                  faite de créativité, de passion et d&apos;échanges avec vous.
                </p>
                <p className="font-medium italic mt-6 text-stone-900">
                  Et ce n&apos;est que le début d&apos;une belle histoire !
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AboutValues />

      <section className="bg-[#EFDDD1] w-full py-24">
        <div className="max-w-[1542px] mx-auto px-4 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">
            
            <div className="flex flex-col gap-6 order-2 md:order-1">
              <h2 className="font-serif text-3xl md:text-[42px] text-stone-900 leading-tight">
                Pourquoi choisir nos bougies ?
              </h2>

              <div className="font-sans font-light text-stone-800 text-base md:text-lg leading-relaxed flex flex-col gap-5">
                <p>Chez Shad&apos;s Candle, chaque bougie est pensée pour apporter chaleur, élégance et bien-être à votre intérieur.</p>
                <p>Nos créations sont éco-responsables et fabriquées à la main en France avec des ingrédients naturels et durables :</p>

                <ul className="list-disc pl-5 space-y-1 marker:text-stone-900">
                  <li>Cire 100 % naturelle</li>
                  <li>Colorants naturels</li>
                  <li>Mèches en coton bio</li>
                  <li>Parfums de Grasse, capitale mondiale de la parfumerie</li>
                </ul>

                <p className="font-bold italic text-stone-900 text-sm tracking-wide mt-2">MAIS CE N&apos;EST PAS TOUT.</p>
                <p>Nos senteurs évoquent des souvenirs d&apos;enfance, des voyages, ou simplement le confort du quotidien.</p>
                <p>Enfin, nous accordons une importance toute particulière à la relation que nous entretenons avec vous. Vos envies et vos retours inspirent nos futures créations.</p>

                <p className="mt-2 text-sm md:text-base">
                  Rejoignez-nous sur Instagram{" "}
                  <a href="#" className="font-bold underline hover:opacity-70 transition-opacity">
                    @shads.candle
                  </a>{" "}
                  pour découvrir nos nouveautés.
                </p>
              </div>
            </div>

            <div className="rounded-sm overflow-hidden shadow-sm aspect-[4/3] md:aspect-square lg:aspect-[4/3] order-1 md:order-2">
              <img 
                src="/images/histoire.png" 
                alt="Bougies Shad's Candle ambiance cocooning" 
                className="w-full h-full object-cover" 
              />
            </div>

          </div>
        </div>
      </section>

      <ReassuranceSection />
      
    </main>
  );
}
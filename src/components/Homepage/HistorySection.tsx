export default function HistorySection() {
  return (
    <section className="bg-[#EFDDD1] pt-[140px] pb-24 px-4">
      <div className="w-full max-w-[1542px] mx-auto flex flex-col md:flex-row items-center gap-[80px]">
        <div className="w-full md:w-1/2">
          <img src="/images/histoire.png" alt="Notre histoire" className="w-full h-auto object-cover shadow-sm" />
        </div>
        <div className="w-full md:w-1/2 text-stone-900">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-8 text-black">Notre Histoire, vos bougies.</h2>
          <div className="font-sans text-sm md:text-base leading-relaxed flex flex-col gap-6 text-stone-800">
            <p>Shad’s Candle est né d’une passion qui m’anime depuis l’adolescence : celle de créer et de fabriquer de mes propres mains.</p>
            <p>Au départ, je confectionnais des bougies pour mes proches et mes amis, à l’occasion d’un anniversaire ou des fêtes de Noël, simplement pour le plaisir d’offrir et de faire sourire.</p>
            <p>Quelques années plus tard, avec le soutien de mon compagnon, j’ai décidé d’en faire ma vocation. Aujourd’hui, je souhaite partager avec vous cette passion et le savoir-faire que j’ai acquis au fil du temps.</p>
            <p>Shad’s Candle, c’est bien plus qu’un projet : c’est une aventure humaine, faite de créativité, de passion et d’échanges avec vous.</p>
            <p className="font-bold text-black mt-2">Et ce n’est que le début d’une belle histoire !</p>
          </div>
        </div>
      </div>
    </section>
  );
}
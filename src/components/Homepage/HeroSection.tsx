import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <img
        src="/images/herosection.png"
        alt="Ambiance Bougie"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 text-center text-white px-4 animate-fade-in-up">
        <h1 className="font-serif italic text-5xl md:text-7xl mb-6 drop-shadow-lg">
          L&apos;art de l&apos;ambiance
        </h1>
        <p className="uppercase tracking-[0.3em] text-xs md:text-sm font-light mb-10 drop-shadow-md">
          Bougies Artisanales & Parfumées
        </p>
        <a
          href="#collection"
          className="border border-white px-8 py-4 text-xs uppercase tracking-widest hover:bg-white hover:text-stone-900 transition duration-500 ease-in-out"
        >
          Découvrir la collection
        </a>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-white">
        <svg
          className="w-8 h-8 opacity-70"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
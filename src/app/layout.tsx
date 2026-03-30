import type { Metadata } from "next";
import { Montserrat, Playfair_Display, Nokora } from "next/font/google";
import "./globals.css";

import Navbar from "../components/Global/Navbar";
import Footer from "../components/Global/Footer";
import { CartProvider } from "../context/CartContext";

const montserrat = Montserrat({ 
  subsets: ["latin"], 
  variable: "--font-montserrat" 
});

const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: "--font-playfair" 
});

const nokora = Nokora({ 
  weight: ["300", "400", "700"],
  subsets: ["latin"], 
  variable: "--font-nokora" 
});

export const metadata: Metadata = {
  title: "Shad's Candle - L'art de l'ambiance",
  description: "L'art de l'ambiance - Bougies Artisanales & Parfumées",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${montserrat.variable} ${playfair.variable} ${nokora.variable} font-sans antialiased bg-stone-50 text-stone-900 flex flex-col min-h-screen`}>

        <CartProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </CartProvider>

      </body>
    </html>
  );
}
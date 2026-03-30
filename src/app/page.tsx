import HeroSection from "../components/Homepage/HeroSection";
import CollectionSlider from "../components/Homepage/CollectionSlider";
import CategorySection from "../components/Homepage/CategorySection";
import HistorySection from "../components/Homepage/HistorySection";
import ReassuranceSection from "../components/Global/ReassuranceSection";

export default function HomePage() {
  return (
    <main className="font-sans">
      <HeroSection />
      <CollectionSlider />
      <CategorySection />
      <HistorySection />
      <ReassuranceSection />
    </main>
  );
}
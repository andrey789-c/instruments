import { ComparisonSection } from "@/src/widgets/comparison-section/ui";
import { HeroSection } from "@/src/widgets/hero-section/ui";
import { PainPoints } from "@/src/widgets/paint-points/ui";


export const HomePage = () => {
  return (
    <>
      <HeroSection />
      <PainPoints />
      <ComparisonSection />
    </>
  );
}
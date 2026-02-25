import { ComparisonSection } from "@/src/widgets/comparison-section/ui";
import { FeaturesSection } from "@/src/widgets/features-section/ui";
import { HeroSection } from "@/src/widgets/hero-section/ui";
import { PainPoints } from "@/src/widgets/paint-points/ui";
import { StepsWork } from "@/src/widgets/steps-work/ui";


export const HomePage = () => {
  return (
    <>
      <HeroSection />
      <PainPoints />
      <ComparisonSection />
      <StepsWork />
      <FeaturesSection />
    </>
  );
}
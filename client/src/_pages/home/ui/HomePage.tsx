import { ComparisonSection } from "@/src/widgets/comparison-section/ui";
import { Faq } from "@/src/widgets/faq/ui";
import { FeaturesSection } from "@/src/widgets/features-section/ui";
import { FinalCta } from "@/src/widgets/final-cta/ui";
import { HeroSection } from "@/src/widgets/hero-section/ui";
import { PainPoints } from "@/src/widgets/paint-points/ui";
import { PricingSection } from "@/src/widgets/pricing-section/ui";
import { StepsWork } from "@/src/widgets/steps-work/ui";


export const HomePage = () => {
  return (
    <>
      <HeroSection />
      <PainPoints />
      <ComparisonSection />
      <StepsWork />
      <FeaturesSection />
      <PricingSection />
      <Faq />
      <FinalCta />
    </>
  );
}
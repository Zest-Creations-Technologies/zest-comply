import { LandingHeader } from '@/components/landing/LandingHeader';
import { HeroSection } from '@/components/landing/HeroSection';
import { WhySection } from '@/components/landing/WhySection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { useEffect, useState } from 'react';

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger page load animation
    setMounted(true);
  }, []);

  return (
    <div 
      className={`min-h-screen bg-background transition-opacity duration-700 ease-out ${
        mounted ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <LandingHeader />
      <main>
        <HeroSection />
        <WhySection />
        <HowItWorksSection />
        <PricingSection />
      </main>
      <LandingFooter />
    </div>
  );
}

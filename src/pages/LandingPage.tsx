import { LandingHeader } from '@/components/landing/LandingHeader';
import { HeroSection } from '@/components/landing/HeroSection';
import { WhySection } from '@/components/landing/WhySection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { PartnersSection } from '@/components/landing/PartnersSection';
import { PartnershipSection } from '@/components/landing/PartnershipSection';
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
        <PartnersSection />
        <PartnershipSection />
      </main>
      <LandingFooter />
    </div>
  );
}

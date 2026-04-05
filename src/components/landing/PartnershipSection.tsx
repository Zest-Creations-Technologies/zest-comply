import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

export function PartnershipSection() {
  return (
    <section id="pricing" className="py-20 bg-card">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Partnership & Pricing
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Every organization's compliance journey is unique. Let's find the right solution tailored to your needs.
        </p>
        <Button size="lg" className="hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300" asChild>
          <a href="https://partners.zestcomply.com" target="_blank" rel="noopener noreferrer">
            Get in Touch
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>
    </section>
  );
}

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useScrollReveal, getStaggerDelay } from '@/hooks/useScrollReveal';

export function HeroSection() {
  const [heroRef, heroVisible] = useScrollReveal<HTMLDivElement>();
  const [trustRef, trustVisible] = useScrollReveal<HTMLDivElement>();

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
      
      {/* Decorative elements with float animation */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      <div className="container mx-auto px-4 relative z-10">
        <div 
          ref={heroRef}
          className={`max-w-4xl mx-auto text-center transition-all duration-700 ease-out ${
            heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 transition-all duration-500 hover:bg-primary/15 hover:border-primary/30"
            style={{ transitionDelay: '100ms' }}
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm text-foreground">AI-Powered Compliance Documentation</span>
          </div>

          <h1 
            className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight"
            style={{ transitionDelay: '200ms' }}
          >
            Compliance Documentation{' '}
            <span className="text-primary">Made Simple</span>
          </h1>

          <p 
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            style={{ transitionDelay: '300ms' }}
          >
            Transform weeks of compliance work into hours. Our AI assistant guides you through 
            creating comprehensive, audit-ready documentation for SOC 2, GDPR, ISO 27001, and more.
          </p>

          <div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            style={{ transitionDelay: '400ms' }}
          >
            <Button 
              size="lg" 
              asChild 
              className="text-lg px-8 transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5"
            >
              <Link to="/auth/signup">
                Start Free Assessment
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              asChild 
              className="text-lg px-8 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
            >
              <a href="#how-it-works">See How It Works</a>
            </Button>
          </div>

          {/* Trust indicators */}
          <div 
            ref={trustRef}
            className={`mt-16 flex flex-wrap items-center justify-center gap-8 text-muted-foreground transition-all duration-700 ease-out ${
              trustVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            {[
              { label: 'SOC 2 Compliant' },
              { label: 'GDPR Ready' },
              { label: 'ISO 27001 Certified' }
            ].map((item, index) => (
              <div 
                key={item.label}
                className="flex items-center gap-2 transition-all duration-300 hover:text-foreground"
                style={{ transitionDelay: getStaggerDelay(index, 100) }}
              >
                <ShieldCheck className="h-5 w-5 text-primary" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

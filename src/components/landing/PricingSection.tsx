import { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { plansApi, type Plan } from '@/lib/api';
import { useScrollReveal, getStaggerDelay } from '@/hooks/useScrollReveal';

export function PricingSection() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [headerRef, headerVisible] = useScrollReveal<HTMLDivElement>();
  const [cardsRef, cardsVisible] = useScrollReveal<HTMLDivElement>();

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const data = await plansApi.getPlans();
        // Only show active plans
        setPlans(data.filter(p => p.is_active));
      } catch (error) {
        console.error('Failed to load plans:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPlans();
  }, []);

  if (loading) {
    return (
      <section id="pricing" className="py-20 bg-card">
        <div className="container mx-auto px-4 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  return (
    <section id="pricing" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div 
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-700 ease-out ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your compliance needs
          </p>
        </div>

        <div ref={cardsRef} className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => {
            const isPopular = index === 1;
            return (
              <Card
                key={plan.id}
                className={`relative bg-background border-border transition-all duration-500 ease-out hover:shadow-xl hover:-translate-y-2 ${
                  isPopular ? 'border-primary ring-2 ring-primary/20 hover:shadow-primary/10' : 'hover:border-primary/50 hover:shadow-lg'
                } ${cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: cardsVisible ? getStaggerDelay(index, 150) : '0ms' }}
              >
                {isPopular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground shadow-md shadow-primary/30">
                    Most Popular
                  </Badge>
                )}
                {plan.trial_days && (
                  <Badge variant="outline" className="absolute -top-3 right-4 bg-background border-accent text-accent">
                    {plan.trial_days}-day free trial
                  </Badge>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl text-foreground">{plan.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-foreground">
                      {plan.display_price || 'Contact us'}
                    </span>
                  </div>
                  <ul className="space-y-3 text-left">
                    {plan.features.map((feature, i) => (
                      <li 
                        key={i} 
                        className={`flex items-start gap-2 transition-all duration-300 ${
                          cardsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                        }`}
                        style={{ transitionDelay: cardsVisible ? `${(index * 150) + (i * 50)}ms` : '0ms' }}
                      >
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div className="flex flex-col">
                          <span className="text-foreground font-medium">{feature.title}</span>
                          {feature.description && (
                            <span className="text-sm text-muted-foreground">{feature.description}</span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className={`w-full transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
                      isPopular ? 'hover:shadow-primary/25' : ''
                    }`}
                    variant={isPopular ? 'default' : 'outline'}
                    asChild
                  >
                    <Link to="/auth/signup">Get Started</Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <p 
          className={`text-center text-muted-foreground mt-8 transition-all duration-500 ${
            cardsVisible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: '600ms' }}
        >
          No credit card required to start your free trial.
        </p>
      </div>
    </section>
  );
}

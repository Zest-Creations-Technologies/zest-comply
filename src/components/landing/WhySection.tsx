import { Card, CardContent } from '@/components/ui/card';
import { 
  Clock, 
  AlertTriangle, 
  DollarSign, 
  Brain,
  Zap,
  FileCheck,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { useScrollReveal, getStaggerDelay } from '@/hooks/useScrollReveal';

const problems = [
  {
    icon: Clock,
    problem: 'Weeks of manual work',
    solution: 'Hours with AI assistance',
  },
  {
    icon: AlertTriangle,
    problem: 'Risk of compliance gaps',
    solution: 'Comprehensive coverage guaranteed',
  },
  {
    icon: DollarSign,
    problem: 'Expensive consultants',
    solution: 'Fraction of the cost',
  },
  {
    icon: Brain,
    problem: 'Complex framework requirements',
    solution: 'Guided step-by-step process',
  },
  {
    icon: RefreshCw,
    problem: 'One-time audits, outdated docs',
    solution: 'Continuous Compliance Monitoring',
  },
];

export function WhySection() {
  const [headerRef, headerVisible] = useScrollReveal<HTMLDivElement>();
  const [cardsRef, cardsVisible] = useScrollReveal<HTMLDivElement>();
  const [benefitsRef, benefitsVisible] = useScrollReveal<HTMLDivElement>();

  return (
    <section id="why" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div 
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-700 ease-out ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose ZestComply?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Traditional compliance documentation is painful. We fix that.
          </p>
        </div>

        <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          {problems.map((item, index) => (
            <Card 
              key={index} 
              className={`bg-background border-border transition-all duration-500 ease-out hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 ${
                cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: cardsVisible ? getStaggerDelay(index, 100) : '0ms' }}
            >
              <CardContent className="p-6">
                <item.icon className="h-10 w-10 text-primary mb-4 transition-transform duration-300 group-hover:scale-110" />
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-destructive">
                    <span className="text-sm line-through">{item.problem}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <div className="flex items-center gap-2 text-primary">
                    <span className="font-medium">{item.solution}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional benefits */}
        <div 
          ref={benefitsRef}
          className="mt-16 grid md:grid-cols-3 gap-8 text-center"
        >
          {[
            { icon: Zap, title: '10x Faster', desc: 'Generate comprehensive documentation in hours, not weeks' },
            { icon: FileCheck, title: 'Audit-Ready', desc: 'Documentation that meets auditor expectations every time' },
            { icon: Brain, title: 'AI-Guided', desc: 'Intelligent assistant that understands compliance requirements' }
          ].map((benefit, index) => (
            <div 
              key={benefit.title}
              className={`flex flex-col items-center transition-all duration-700 ease-out ${
                benefitsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: benefitsVisible ? getStaggerDelay(index, 150) : '0ms' }}
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 transition-all duration-300 hover:bg-primary/20 hover:scale-105">
                <benefit.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

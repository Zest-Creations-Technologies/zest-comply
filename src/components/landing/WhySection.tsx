import { Card, CardContent } from '@/components/ui/card';
import { 
  Clock, 
  AlertTriangle, 
  DollarSign, 
  Brain,
  Zap,
  FileCheck,
  ArrowRight
} from 'lucide-react';

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
];

export function WhySection() {
  return (
    <section id="why" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose Zest Comply?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Traditional compliance documentation is painful. We fix that.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((item, index) => (
            <Card key={index} className="bg-background border-border hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <item.icon className="h-10 w-10 text-primary mb-4" />
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
        <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">10x Faster</h3>
            <p className="text-muted-foreground">
              Generate comprehensive documentation in hours, not weeks
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <FileCheck className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Audit-Ready</h3>
            <p className="text-muted-foreground">
              Documentation that meets auditor expectations every time
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">AI-Guided</h3>
            <p className="text-muted-foreground">
              Intelligent assistant that understands compliance requirements
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

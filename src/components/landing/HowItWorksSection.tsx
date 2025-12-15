import { Card, CardContent } from '@/components/ui/card';
import { 
  MessageSquare, 
  Shield, 
  FolderTree, 
  FileText, 
  Download,
  CheckCircle2
} from 'lucide-react';
import { useScrollReveal, getStaggerDelay } from '@/hooks/useScrollReveal';

const steps = [
  {
    number: 1,
    icon: MessageSquare,
    title: 'Answer Questions',
    description: 'Our AI assistant asks about your organization, processes, and security practices through a natural conversation.',
  },
  {
    number: 2,
    icon: Shield,
    title: 'Pick Your Frameworks',
    description: 'Select the compliance frameworks you need: SOC 2, GDPR, ISO 27001, HIPAA, and more.',
  },
  {
    number: 3,
    icon: FolderTree,
    title: 'Approve Structure',
    description: 'Review and approve the recommended document structure tailored to your requirements.',
  },
  {
    number: 4,
    icon: FileText,
    title: 'Generate Documents',
    description: 'Watch as comprehensive, customized compliance documents are generated based on your inputs.',
  },
  {
    number: 5,
    icon: Download,
    title: 'Export & Use',
    description: 'Download your audit-ready documents or sync directly to your cloud storage.',
  },
];

export function HowItWorksSection() {
  const [headerRef, headerVisible] = useScrollReveal<HTMLDivElement>();
  const [stepsRef, stepsVisible] = useScrollReveal<HTMLDivElement>();
  const [frameworksRef, frameworksVisible] = useScrollReveal<HTMLDivElement>();

  return (
    <section id="how-it-works" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div 
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-700 ease-out ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Five simple steps to compliance documentation excellence
          </p>
        </div>

        <div ref={stepsRef} className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2" />

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {steps.map((step, index) => (
              <Card 
                key={step.number} 
                className={`relative bg-card border-border transition-all duration-500 ease-out hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 ${
                  stepsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: stepsVisible ? getStaggerDelay(index, 100) : '0ms' }}
              >
                <CardContent className="p-6 text-center">
                  {/* Step number badge */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-md shadow-primary/30">
                    {step.number}
                  </div>

                  <div className="mt-4 mb-4">
                    <div className="w-14 h-14 mx-auto rounded-xl bg-primary/10 flex items-center justify-center transition-all duration-300 hover:bg-primary/20 hover:scale-105">
                      <step.icon className="h-7 w-7 text-primary" />
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Supported frameworks */}
        <div 
          ref={frameworksRef}
          className={`mt-20 text-center transition-all duration-700 ease-out ${
            frameworksVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h3 className="text-xl font-semibold text-foreground mb-4">
            Works With Any Compliance Framework
          </h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Our AI understands and generates documentation for any compliance framework — popular standards 
            or industry-specific requirements. If it exists, we can help you document it.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {['SOC 2', 'ISO 27001', 'GDPR', 'HIPAA', 'PCI DSS', 'NIST', 'CCPA', 'and more...'].map((framework, index) => (
              <div
                key={framework}
                className={`flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border transition-all duration-300 hover:border-primary/50 hover:shadow-md ${
                  framework === 'and more...' ? 'border-dashed text-muted-foreground' : ''
                } ${frameworksVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                style={{ transitionDelay: frameworksVisible ? getStaggerDelay(index, 50) : '0ms' }}
              >
                {framework !== 'and more...' && <CheckCircle2 className="h-4 w-4 text-primary" />}
                <span className={framework === 'and more...' ? 'text-muted-foreground italic' : 'text-foreground'}>{framework}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

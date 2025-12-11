import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  History, 
  CreditCard, 
  Cloud, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function ActionCenterPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Start New Assessment',
      description: 'Begin a new AI-guided compliance documentation process',
      icon: MessageSquare,
      action: () => navigate('/app/assistant'),
      primary: true,
    },
    {
      title: 'Continue Last Assessment',
      description: 'Resume your most recent compliance session',
      icon: History,
      action: () => navigate('/app/conversations'),
    },
    {
      title: 'Manage Billing',
      description: 'View subscription, invoices, and payment methods',
      icon: CreditCard,
      action: () => navigate('/app/billing'),
    },
    {
      title: 'Link Cloud Storage',
      description: 'Connect Google Drive, Dropbox, or OneDrive',
      icon: Cloud,
      action: () => navigate('/app/settings/storage'),
    },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Welcome section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {user?.name || 'there'}!
        </h1>
        <p className="text-muted-foreground">
          What would you like to work on today?
        </p>
      </div>

      {/* Featured action */}
      <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
        <CardContent className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
              <Sparkles className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Start Your AI-Powered Assessment
              </h2>
              <p className="text-muted-foreground">
                Our AI assistant will guide you through creating comprehensive compliance documentation
              </p>
            </div>
          </div>
          <Button size="lg" onClick={() => navigate('/app/assistant')}>
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </CardContent>
      </Card>

      {/* Quick actions grid */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {quickActions.map((action) => (
            <Card
              key={action.title}
              className="cursor-pointer hover:border-primary/50 transition-colors bg-card"
              onClick={action.action}
            >
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <action.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{action.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Stats or recent activity could go here */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardDescription>Active Assessments</CardDescription>
            <CardTitle className="text-3xl">2</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardDescription>Documents Generated</CardDescription>
            <CardTitle className="text-3xl">12</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardDescription>Frameworks Covered</CardDescription>
            <CardTitle className="text-3xl">3</CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}

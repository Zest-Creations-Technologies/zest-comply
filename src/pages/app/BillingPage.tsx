import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Check, 
  Download, 
  Loader2,
  Calendar,
  RefreshCw
} from 'lucide-react';
import { plansApi, type Plan, type Invoice } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export default function BillingPage() {
  const { user, refreshUser } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();

  // Handle checkout redirect feedback
  useEffect(() => {
    const checkoutStatus = searchParams.get('checkout');
    if (checkoutStatus === 'success') {
      toast({
        title: 'Payment successful',
        description: 'Your subscription has been activated',
      });
      setSearchParams({}, { replace: true });
    } else if (checkoutStatus === 'cancelled') {
      toast({
        title: 'Checkout cancelled',
        description: 'No changes were made to your subscription',
        variant: 'destructive',
      });
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams, toast]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [plansData, invoicesData] = await Promise.all([
        plansApi.getPlans(),
        plansApi.getInvoices(),
      ]);
      setPlans(plansData.filter(p => p.is_active));
      setInvoices(invoicesData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load billing information',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async (planId: string) => {
    setActionLoading(planId);
    try {
      const { checkout_url } = await plansApi.createCheckoutSession(planId);
      if (checkout_url !== '#checkout-mock') {
        window.location.href = checkout_url;
      } else {
        toast({ title: 'Demo mode', description: 'Checkout would redirect to Stripe' });
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to start checkout',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelSubscription = async () => {
    setActionLoading('cancel');
    try {
      await plansApi.cancelSubscription();
      await refreshUser();
      toast({ title: 'Subscription cancelled', description: 'Your subscription will end at the current period' });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to cancel subscription',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleResumeSubscription = async () => {
    setActionLoading('resume');
    try {
      await plansApi.resumeSubscription();
      await refreshUser();
      toast({ title: 'Subscription resumed' });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to resume subscription',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const subscription = user?.user_plan;
  const currentPlan = subscription?.plan;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Billing & Subscription</h1>
        <p className="text-muted-foreground">
          Manage your subscription and billing information
        </p>
      </div>

      {/* Current subscription */}
      {subscription && currentPlan && (
        <Card className="bg-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Current Plan: {currentPlan.name}</CardTitle>
                <CardDescription>{currentPlan.description}</CardDescription>
              </div>
              <Badge
                variant={subscription.status === 'active' ? 'default' : 'secondary'}
                className={subscription.cancel_at_period_end ? 'bg-destructive/10 text-destructive' : ''}
              >
                {subscription.cancel_at_period_end ? 'Cancelling' : subscription.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {subscription.cancel_at_period_end
                  ? `Access until ${formatDate(subscription.current_period_end)}`
                  : `Next billing date: ${formatDate(subscription.current_period_end)}`}
              </span>
            </div>
            <div className="text-foreground text-2xl font-bold">
              {currentPlan.display_price || 'Contact us'}
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            {subscription.cancel_at_period_end ? (
              <Button onClick={handleResumeSubscription} disabled={actionLoading === 'resume'}>
                {actionLoading === 'resume' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <RefreshCw className="mr-2 h-4 w-4" />
                Resume Subscription
              </Button>
            ) : (
              <Button variant="outline" onClick={handleCancelSubscription} disabled={actionLoading === 'cancel'}>
                {actionLoading === 'cancel' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Cancel Subscription
              </Button>
            )}
          </CardFooter>
        </Card>
      )}

      {/* Plans */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">
          {subscription ? 'Change Plan' : 'Choose a Plan'}
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {plans.map((plan) => {
            const isCurrent = plan.id === subscription?.plan?.id;
            return (
              <Card
                key={plan.id}
                className={`bg-card ${isCurrent ? 'border-primary ring-1 ring-primary' : ''}`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {plan.name}
                    {isCurrent && <Badge>Current</Badge>}
                  </CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-foreground">
                      {plan.display_price || 'Contact us'}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{feature.title}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    variant={isCurrent ? 'outline' : 'default'}
                    disabled={isCurrent || actionLoading === plan.id}
                    onClick={() => handleCheckout(plan.id)}
                  >
                    {actionLoading === plan.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isCurrent ? 'Current Plan' : 'Select Plan'}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Invoice history */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Invoice History</h2>
        <Card className="bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Invoice</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    No invoices yet
                  </TableCell>
                </TableRow>
              ) : (
                invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>{formatDate(invoice.created)}</TableCell>
                    <TableCell>${invoice.amount_paid.toFixed(2)} {invoice.currency.toUpperCase()}</TableCell>
                    <TableCell>
                      <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'}>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {invoice.invoice_pdf && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={invoice.invoice_pdf} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  Check, 
  Download, 
  Loader2,
  Calendar,
  RefreshCw
} from 'lucide-react';
import { plansApi, type Plan, type Invoice, type PreviewPlanChangeResponse } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ProrationPreviewDialog } from '@/components/app/ProrationPreviewDialog';

export default function BillingPage() {
  const { user, refreshUser } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Proration preview state
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewData, setPreviewData] = useState<PreviewPlanChangeResponse | null>(null);
  const [pendingPlanId, setPendingPlanId] = useState<string | null>(null);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();

  // Handle checkout redirect feedback
  useEffect(() => {
    const checkoutStatus = searchParams.get('checkout');
    if (checkoutStatus === 'success') {
      refreshUser(); // Refresh user to get updated subscription
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
  }, [searchParams, setSearchParams, toast, refreshUser]);

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

  const handleSelectPlan = async (planId: string) => {
    const subscription = user?.user_plan;
    const currentPlanId = subscription?.plan?.id;
    
    // Check if this is a PAID→PAID change (user has active paid subscription)
    const hasPaidSubscription = subscription && 
      subscription.status === 'active' && 
      !subscription.cancel_at_period_end;
    
    if (hasPaidSubscription && currentPlanId && currentPlanId !== planId) {
      // Show proration preview for PAID→PAID changes
      setPendingPlanId(planId);
      setPreviewDialogOpen(true);
      setPreviewLoading(true);
      setPreviewData(null);
      
      try {
        const preview = await plansApi.previewPlanChange(planId);
        setPreviewData(preview);
      } catch {
        toast({
          title: 'Error',
          description: 'Failed to load proration preview',
          variant: 'destructive',
        });
      } finally {
        setPreviewLoading(false);
      }
      return;
    }
    
    // For FREE→PAID or other flows, proceed directly
    await executeChangePlan(planId);
  };

  const executeChangePlan = async (planId: string) => {
    setActionLoading(planId);
    try {
      const result = await plansApi.changePlan(planId);
      
      // FREE → PAID: Redirect to Stripe checkout
      if (result.paid_plan_change?.checkout_url) {
        if (result.paid_plan_change.checkout_url !== '#checkout-mock') {
          window.location.href = result.paid_plan_change.checkout_url;
        } else {
          toast({ title: 'Demo mode', description: 'Checkout would redirect to Stripe' });
        }
        return;
      }
      
      // FREE→FREE, PAID→PAID, or PAID→FREE: Immediate migration
      if (result.migrate_plan_change) {
        await refreshUser();
        const { new_plan_name, proration_amount, effective_date } = result.migrate_plan_change;
        const prorationText = proration_amount !== 0 
          ? ` Proration: $${Math.abs(proration_amount).toFixed(2)} ${proration_amount > 0 ? 'charged' : 'credited'}.`
          : '';
        toast({ 
          title: `Switched to ${new_plan_name}`, 
          description: `Effective ${formatDate(effective_date)}.${prorationText}` 
        });
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to change plan',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleConfirmProrationChange = async () => {
    if (!pendingPlanId) return;
    setPreviewDialogOpen(false);
    await executeChangePlan(pendingPlanId);
    setPendingPlanId(null);
    setPreviewData(null);
  };

  const handleCancelSubscription = async () => {
    setActionLoading('cancel');
    try {
      const result = await plansApi.cancelSubscription();
      await refreshUser();
      toast({ 
        title: 'Subscription cancelled', 
        description: `You will retain access until ${formatDate(result.current_period_end)}` 
      });
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
      const result = await plansApi.resumeSubscription();
      await refreshUser();
      toast({ 
        title: 'Subscription resumed', 
        description: `Your subscription will continue. Next billing: ${formatDate(result.next_billing_date)}` 
      });
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
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" disabled={actionLoading === 'cancel'}>
                    {actionLoading === 'cancel' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Cancel Subscription
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel Subscription?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to cancel your subscription? You'll retain access until {formatDate(subscription.current_period_end)}, but your subscription will not renew.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                    <AlertDialogAction onClick={handleCancelSubscription} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Yes, Cancel
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
                    onClick={() => handleSelectPlan(plan.id)}
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
                    <TableCell>${Number(invoice.amount_paid).toFixed(2)} {invoice.currency.toUpperCase()}</TableCell>
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

      {/* Proration Preview Dialog */}
      <ProrationPreviewDialog
        open={previewDialogOpen}
        onOpenChange={setPreviewDialogOpen}
        preview={previewData}
        loading={previewLoading}
        onConfirm={handleConfirmProrationChange}
      />
    </div>
  );
}

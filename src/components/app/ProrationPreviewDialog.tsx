import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowUp, ArrowDown } from 'lucide-react';
import type { PreviewPlanChangeResponse } from '@/lib/api/types';

interface ProrationPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preview: PreviewPlanChangeResponse | null;
  loading: boolean;
  onConfirm: () => void;
}

export function ProrationPreviewDialog({
  open,
  onOpenChange,
  preview,
  loading,
  onConfirm,
}: ProrationPreviewDialogProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatAmount = (amount: number) => {
    return `$${Math.abs(amount).toFixed(2)}`;
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {preview?.is_upgrade ? (
              <>
                <ArrowUp className="h-5 w-5 text-primary" />
                Upgrade Plan
              </>
            ) : (
              <>
                <ArrowDown className="h-5 w-5 text-muted-foreground" />
                Downgrade Plan
              </>
            )}
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4 pt-2">
              {loading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : preview ? (
                <>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Current Plan</span>
                    <span className="font-medium text-foreground">{preview.current_plan_name}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">New Plan</span>
                    <span className="font-medium text-foreground">{preview.new_plan_name}</span>
                  </div>
                  <div className="border-t border-border my-3" />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {preview.prorated_amount >= 0 ? 'Amount Due Today' : 'Credit Applied'}
                    </span>
                    <Badge variant={preview.prorated_amount >= 0 ? 'default' : 'secondary'}>
                      {preview.prorated_amount >= 0 ? '' : '-'}{formatAmount(preview.prorated_amount)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Next Invoice</span>
                    <span className="text-foreground">{formatDate(preview.next_invoice_date)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    {preview.prorated_amount >= 0
                      ? 'This amount will be charged to your payment method immediately.'
                      : 'This credit will be applied to your next invoice.'}
                  </p>
                </>
              ) : (
                <p className="text-destructive">Failed to load preview. Please try again.</p>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={loading || !preview}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Change
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

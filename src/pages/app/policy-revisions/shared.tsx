import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText } from "lucide-react";
import type { PolicyRevisionProposalStatus } from "@/lib/api";

export const statusLabels: Record<PolicyRevisionProposalStatus, string> = {
  suggested: "Needs Target Confirmation",
  target_confirmed: "Target Confirmed",
  drafted: "Drafted, Ready for Review",
  approved: "Approved",
  rejected: "Rejected",
};

const statusVariant: Record<PolicyRevisionProposalStatus, "default" | "secondary" | "destructive" | "outline"> = {
  suggested: "outline",
  target_confirmed: "secondary",
  drafted: "secondary",
  approved: "default",
  rejected: "destructive",
};

export function StatusBadge({ status }: { status: PolicyRevisionProposalStatus }) {
  return <Badge variant={statusVariant[status]}>{statusLabels[status]}</Badge>;
}

export function formatDateTime(value?: string | null) {
  if (!value) return "Not available";
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <Card className="bg-card">
      <CardContent className="flex flex-col items-center justify-center py-14 text-center">
        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
      </CardContent>
    </Card>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-48 w-full" />
    </div>
  );
}

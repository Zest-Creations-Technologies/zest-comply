import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ClipboardCheck } from "lucide-react";
import type {
  CompanyValidationProfile,
  HumanValidationAuditEventType,
  HumanValidationStatus,
} from "@/lib/api";

export const statusLabels: Record<HumanValidationStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  in_review: "In Review",
  changes_requested: "Changes Requested",
  approved: "Approved",
  rejected: "Rejected",
  signed_off: "Signed Off",
};

const statusVariant: Record<HumanValidationStatus, "default" | "secondary" | "destructive" | "outline"> = {
  draft: "outline",
  submitted: "secondary",
  in_review: "secondary",
  changes_requested: "destructive",
  approved: "default",
  rejected: "destructive",
  signed_off: "default",
};

export const auditEventLabels: Record<HumanValidationAuditEventType, string> = {
  profile_created: "Profile created",
  profile_updated: "Profile updated",
  reviewer_assigned: "Reviewer assigned",
  approver_assigned: "Approver assigned",
  executive_signer_assigned: "Executive signer assigned",
  submitted_for_review: "Submitted for review",
  comment_added: "Comment added",
  changes_requested: "Changes requested",
  approved: "Approved",
  rejected: "Rejected",
  executive_signoff_updated: "Executive sign-off updated",
};

export function StatusBadge({ status }: { status: HumanValidationStatus }) {
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

export function profileTitle(profile: CompanyValidationProfile) {
  return profile.legal_name || profile.business_unit || "Validation profile";
}

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="bg-card">
      <CardContent className="flex flex-col items-center justify-center py-14 text-center">
        <ClipboardCheck className="h-12 w-12 text-muted-foreground mb-4" />
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

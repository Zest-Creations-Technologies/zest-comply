import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { Radar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ScannerIntegrationBadge() {
  return <Badge variant="secondary">Optional Scanner Integration</Badge>;
}

export function SecurityEmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <Card className="border-dashed border-slate-200 bg-slate-50/60">
      <CardContent className="flex flex-col items-start gap-4 py-10">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#d8b45d]/30 bg-gradient-to-br from-[#fff7df] to-[#f3e6bd] text-[#7a622b] shadow-sm">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="font-medium text-slate-900">{title}</p>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">{description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link to="/app/security/connect">
              <Radar className="mr-2 h-4 w-4" />
              Connect a Scanner
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function ComplianceImpactSection() {
  return (
    <Card className="border-slate-200/80 bg-white shadow-sm shadow-slate-200/60">
      <CardHeader>
        <CardTitle className="text-slate-950">Compliance Impact</CardTitle>
        <CardDescription>Optional connected-scanner security signals will later map into compliance workflows.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm md:grid-cols-2">
        {[
          "Evidence requests",
          "Risks",
          "Governance reviews",
          "Compliance monitoring alerts",
          "Executive reports",
        ].map((item) => (
          <div key={item} className="rounded-md border border-slate-200 bg-slate-50 p-3 text-slate-600">
            {item}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

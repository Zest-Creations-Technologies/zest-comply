import { Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportsEmptyState, ReportsPageHeader } from "./ReportsShared";

const exportFormats = ["PDF", "Word", "Excel", "Executive Board Report"];

export default function ExportCenterPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <ReportsPageHeader
        title="Export Center"
        description="Export approved report packages for leadership, audits, and internal compliance reviews when report generation is available."
      />

      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Future Export Formats</CardTitle>
          <CardDescription>Exports will use generated report data once source records are available.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {exportFormats.map((format) => (
            <div key={format} className="rounded-md border border-border p-3 text-sm text-muted-foreground">
              {format}
            </div>
          ))}
        </CardContent>
      </Card>

      <ReportsEmptyState icon={Download} />
    </div>
  );
}

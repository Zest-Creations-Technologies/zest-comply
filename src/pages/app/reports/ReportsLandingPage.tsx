import { BarChart3, ClipboardCheck, Download, FileText, FolderOpen, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ReportActionCard, ReportsEmptyState, ReportsPageHeader } from "./ReportsShared";

export default function ReportsLandingPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <ReportsPageHeader
          title="Executive Reports"
          description="Prepare board-ready reporting from completed assessments, evidence, reviews, approvals, risks, and audit readiness data."
        />
        <Button asChild>
          <Link to="/app/reports/executive">Executive Summary</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ReportActionCard title="Executive Summary" description="Aggregate leadership-level compliance, risk, evidence, approval, and audit context." href="/app/reports/executive" icon={BarChart3} />
        <ReportActionCard title="Compliance Reports" description="Review framework progress and compliance posture once platform data is available." href="/app/reports/compliance" icon={ClipboardCheck} />
        <ReportActionCard title="Risk Reports" description="Summarize risk posture from the Risk Management workspace." href="/app/reports/risk" icon={Scale} />
        <ReportActionCard title="Evidence Reports" description="Summarize evidence coverage and readiness across control requirements." href="/app/reports/evidence" icon={FolderOpen} />
        <ReportActionCard title="Audit Readiness" description="Prepare audit-facing views from governance, evidence, and compliance activity." href="/app/reports/audit" icon={FileText} />
        <ReportActionCard title="Export Center" description="Export approved reporting packages when report generation is available." href="/app/reports/export" icon={Download} />
      </div>

      <ReportsEmptyState />
    </div>
  );
}

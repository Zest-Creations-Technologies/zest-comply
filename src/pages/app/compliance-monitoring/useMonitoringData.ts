import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { evidenceApi, humanValidationApi } from "@/lib/api";
import type {
  ComplianceCalendarEvent,
  ComplianceTask,
  FrameworkHealth,
  MonitoringAlert,
  MonitoringStatus,
} from "./monitoring-data";

function daysUntil(dateString: string, now: Date) {
  return Math.round((new Date(dateString).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function statusFor(evidenceCoverage: number, totalEvidence: number): MonitoringStatus {
  if (totalEvidence === 0) return "overdue";
  if (evidenceCoverage >= 80) return "healthy";
  if (evidenceCoverage >= 50) return "watch";
  return "at_risk";
}

export function useMonitoringData() {
  const evidenceQuery = useQuery({ queryKey: ["evidence"], queryFn: () => evidenceApi.list() });
  const queueQuery = useQuery({ queryKey: ["human-validation", "queue"], queryFn: () => humanValidationApi.getQueue() });

  const data = useMemo(() => {
    const records = evidenceQuery.data?.records ?? [];
    const profiles = queueQuery.data?.profiles ?? [];
    const now = new Date();

    const byFramework = new Map<string, typeof records>();
    for (const record of records) {
      for (const framework of record.frameworks) {
        if (!byFramework.has(framework)) byFramework.set(framework, []);
        byFramework.get(framework)!.push(record);
      }
    }

    const frameworkHealth: FrameworkHealth[] = Array.from(byFramework.entries()).map(([name, items]) => {
      const approvedItems = items.filter((item) => item.status === "approved");
      const evidenceCoverage = items.length > 0 ? Math.round((approvedItems.length / items.length) * 100) : 0;
      const controlsComplete = new Set(approvedItems.flatMap((item) => item.control_ids)).size;
      const controlsMissing = new Set(
        items.filter((item) => item.status !== "approved").flatMap((item) => item.control_ids)
      ).size;
      const lastAssessmentDate = items.reduce((latest, item) => (item.updated_at > latest ? item.updated_at : latest), items[0]?.updated_at ?? "");
      const nextReviewDate = [...items.map((item) => item.expiration_date).filter((d): d is string => Boolean(d))].sort()[0] ?? "";

      return {
        name,
        overallPercentage: evidenceCoverage,
        controlsComplete,
        controlsMissing,
        evidenceCoverage,
        lastAssessmentDate,
        nextReviewDate,
        status: statusFor(evidenceCoverage, items.length),
      };
    });

    const monitoringAlerts: MonitoringAlert[] = [];
    for (const record of records) {
      const frameworkLabel = record.frameworks.join(", ") || "Unassigned";
      if (record.expiration_date) {
        const days = daysUntil(record.expiration_date, now);
        if (days < 0) {
          monitoringAlerts.push({
            id: `${record.id}-expired`,
            type: "Evidence expiring soon",
            title: `${record.title} has expired`,
            framework: frameworkLabel,
            owner: record.owner || "Unassigned",
            dueDate: record.expiration_date,
            severity: "High",
            status: "Open",
          });
        } else if (days <= 30) {
          monitoringAlerts.push({
            id: `${record.id}-expiring`,
            type: "Evidence expiring soon",
            title: `${record.title} expires in ${days} day${days === 1 ? "" : "s"}`,
            framework: frameworkLabel,
            owner: record.owner || "Unassigned",
            dueDate: record.expiration_date,
            severity: days <= 7 ? "High" : "Medium",
            status: "Open",
          });
        }
      }
      if (record.status === "rejected") {
        monitoringAlerts.push({
          id: `${record.id}-rejected`,
          type: "Control failed",
          title: `${record.title} was rejected`,
          framework: frameworkLabel,
          owner: record.owner || "Unassigned",
          dueDate: record.updated_at,
          severity: "High",
          status: "Open",
        });
      }
      if (!record.frameworks.length && !record.control_ids.length) {
        monitoringAlerts.push({
          id: `${record.id}-missing`,
          type: "Missing evidence",
          title: `${record.title} has no framework or control mapping`,
          framework: "Unassigned",
          owner: record.owner || "Unassigned",
          dueDate: record.updated_at,
          severity: "Low",
          status: "Open",
        });
      }
    }

    const complianceTasks: ComplianceTask[] = [
      ...records
        .filter((record) => record.status === "draft" || record.status === "pending_review")
        .map((record) => ({
          id: `evidence-${record.id}`,
          title: record.status === "draft" ? `Complete evidence: ${record.title}` : `Review evidence: ${record.title}`,
          assignedOwner: record.owner || "Unassigned",
          dueDate: record.due_date || "",
          priority: (record.status === "pending_review" ? "Medium" : "Low") as ComplianceTask["priority"],
          status: (record.status === "draft" ? "Not Started" : "In Progress") as ComplianceTask["status"],
          relatedFramework: record.frameworks.join(", ") || "Unassigned",
          relatedPackageControl: record.control_ids.join(", ") || "Unassigned",
        })),
      ...profiles
        .filter((profile) => ["draft", "in_review", "changes_requested"].includes(profile.status))
        .map((profile) => ({
          id: `profile-${profile.id}`,
          title:
            profile.status === "changes_requested"
              ? `Address changes: ${profile.legal_name || "Untitled profile"}`
              : `Complete review: ${profile.legal_name || "Untitled profile"}`,
          assignedOwner: profile.compliance_owner_name || profile.system_owner_name || "Unassigned",
          dueDate: "",
          priority: "Medium" as ComplianceTask["priority"],
          status: (profile.status === "draft" ? "Not Started" : "In Progress") as ComplianceTask["status"],
          relatedFramework: "Governance",
          relatedPackageControl: profile.legal_name || "Not set",
        })),
    ];

    const calendarEvents: ComplianceCalendarEvent[] = records.flatMap((record) => {
      const events: ComplianceCalendarEvent[] = [];
      const frameworkLabel = record.frameworks.join(", ") || "Unassigned";
      if (record.due_date) {
        events.push({
          id: `${record.id}-due`,
          title: `${record.title} due`,
          date: record.due_date,
          type: "Review",
          framework: frameworkLabel,
          owner: record.owner || "Unassigned",
        });
      }
      if (record.expiration_date) {
        events.push({
          id: `${record.id}-expiration`,
          title: `${record.title} expires`,
          date: record.expiration_date,
          type: "Evidence Expiration",
          framework: frameworkLabel,
          owner: record.owner || "Unassigned",
        });
      }
      return events;
    });

    return { frameworkHealth, monitoringAlerts, complianceTasks, calendarEvents };
  }, [evidenceQuery.data, queueQuery.data]);

  return {
    ...data,
    isLoading: evidenceQuery.isLoading || queueQuery.isLoading,
    isError: evidenceQuery.isError || queueQuery.isError,
  };
}

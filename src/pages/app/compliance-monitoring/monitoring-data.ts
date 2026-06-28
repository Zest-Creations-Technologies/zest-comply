export type MonitoringStatus = "healthy" | "watch" | "at_risk" | "overdue";
export type AlertType =
  | "Missing evidence"
  | "Evidence expiring soon"
  | "Policy review due"
  | "Approval overdue"
  | "Control failed"
  | "Annual review due"
  | "Framework update available";
export type TaskPriority = "High" | "Medium" | "Low";
export type TaskStatus = "Not Started" | "In Progress" | "Blocked" | "Complete";
export type CalendarEventType = "Review" | "Audit" | "Evidence Expiration" | "Assessment" | "Governance Approval";

export interface FrameworkHealth {
  name: string;
  overallPercentage: number;
  controlsComplete: number;
  controlsMissing: number;
  evidenceCoverage: number;
  lastAssessmentDate: string;
  nextReviewDate: string;
  status: MonitoringStatus;
}

export interface MonitoringAlert {
  id: string;
  type: AlertType;
  title: string;
  framework: string;
  owner: string;
  dueDate: string;
  severity: TaskPriority;
  status: "Open" | "In Review" | "Resolved";
}

export interface ComplianceTask {
  id: string;
  title: string;
  assignedOwner: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  relatedFramework: string;
  relatedPackageControl: string;
}

export interface ComplianceCalendarEvent {
  id: string;
  title: string;
  date: string;
  type: CalendarEventType;
  framework: string;
  owner: string;
}

export const frameworkHealth: FrameworkHealth[] = [
  { name: "CMMC", overallPercentage: 78, controlsComplete: 86, controlsMissing: 24, evidenceCoverage: 72, lastAssessmentDate: "2026-05-18", nextReviewDate: "2026-07-15", status: "watch" },
  { name: "NIST 800-171", overallPercentage: 84, controlsComplete: 92, controlsMissing: 18, evidenceCoverage: 81, lastAssessmentDate: "2026-06-10", nextReviewDate: "2026-08-01", status: "healthy" },
  { name: "NIST 800-53", overallPercentage: 73, controlsComplete: 218, controlsMissing: 82, evidenceCoverage: 70, lastAssessmentDate: "2026-05-30", nextReviewDate: "2026-08-09", status: "watch" },
  { name: "ISO 27001", overallPercentage: 91, controlsComplete: 103, controlsMissing: 8, evidenceCoverage: 88, lastAssessmentDate: "2026-06-04", nextReviewDate: "2026-09-12", status: "healthy" },
  { name: "SOC 2", overallPercentage: 87, controlsComplete: 58, controlsMissing: 9, evidenceCoverage: 83, lastAssessmentDate: "2026-05-27", nextReviewDate: "2026-07-22", status: "healthy" },
  { name: "HIPAA", overallPercentage: 74, controlsComplete: 61, controlsMissing: 21, evidenceCoverage: 69, lastAssessmentDate: "2026-04-29", nextReviewDate: "2026-07-08", status: "watch" },
  { name: "PCI DSS", overallPercentage: 69, controlsComplete: 49, controlsMissing: 22, evidenceCoverage: 64, lastAssessmentDate: "2026-04-12", nextReviewDate: "2026-07-03", status: "at_risk" },
  { name: "FedRAMP", overallPercentage: 62, controlsComplete: 126, controlsMissing: 77, evidenceCoverage: 58, lastAssessmentDate: "2026-03-30", nextReviewDate: "2026-07-01", status: "at_risk" },
  { name: "GDPR", overallPercentage: 82, controlsComplete: 44, controlsMissing: 10, evidenceCoverage: 79, lastAssessmentDate: "2026-06-02", nextReviewDate: "2026-08-18", status: "healthy" },
  { name: "CIS Controls", overallPercentage: 76, controlsComplete: 119, controlsMissing: 31, evidenceCoverage: 74, lastAssessmentDate: "2026-05-16", nextReviewDate: "2026-08-11", status: "watch" },
  { name: "COBIT", overallPercentage: 71, controlsComplete: 37, controlsMissing: 15, evidenceCoverage: 66, lastAssessmentDate: "2026-05-09", nextReviewDate: "2026-09-04", status: "watch" },
  { name: "HITRUST", overallPercentage: 68, controlsComplete: 96, controlsMissing: 45, evidenceCoverage: 62, lastAssessmentDate: "2026-04-23", nextReviewDate: "2026-07-29", status: "at_risk" },
  { name: "NYDFS", overallPercentage: 80, controlsComplete: 34, controlsMissing: 8, evidenceCoverage: 77, lastAssessmentDate: "2026-06-12", nextReviewDate: "2026-08-20", status: "healthy" },
  { name: "StateRAMP", overallPercentage: 65, controlsComplete: 101, controlsMissing: 54, evidenceCoverage: 60, lastAssessmentDate: "2026-04-18", nextReviewDate: "2026-07-25", status: "at_risk" },
];

export const monitoringAlerts: MonitoringAlert[] = [
  { id: "alert-1", type: "Missing evidence", title: "Access management evidence missing", framework: "FedRAMP", owner: "Security Operations", dueDate: "2026-07-01", severity: "High", status: "Open" },
  { id: "alert-2", type: "Evidence expiring soon", title: "PCI DSS vulnerability scan expires this month", framework: "PCI DSS", owner: "Infrastructure", dueDate: "2026-07-03", severity: "High", status: "Open" },
  { id: "alert-3", type: "Policy review due", title: "HIPAA incident response policy review due", framework: "HIPAA", owner: "Compliance", dueDate: "2026-07-08", severity: "Medium", status: "In Review" },
  { id: "alert-4", type: "Approval overdue", title: "Governance approval past target date", framework: "CMMC", owner: "Program Management", dueDate: "2026-06-30", severity: "High", status: "Open" },
  { id: "alert-5", type: "Control failed", title: "Audit logging requirement failed validation", framework: "NIST 800-171", owner: "Platform Engineering", dueDate: "2026-07-11", severity: "Medium", status: "Open" },
  { id: "alert-6", type: "Annual review due", title: "SOC 2 vendor risk annual review due", framework: "SOC 2", owner: "Vendor Management", dueDate: "2026-07-22", severity: "Medium", status: "Open" },
  { id: "alert-7", type: "Framework update available", title: "ISO 27001 control mapping update available", framework: "ISO 27001", owner: "Compliance Architecture", dueDate: "2026-08-05", severity: "Low", status: "In Review" },
];

export const complianceTasks: ComplianceTask[] = [
  { id: "task-1", title: "Upload access review evidence", assignedOwner: "Security Operations", dueDate: "2026-07-01", priority: "High", status: "In Progress", relatedFramework: "FedRAMP", relatedPackageControl: "AC-2" },
  { id: "task-2", title: "Refresh PCI DSS vulnerability scan", assignedOwner: "Infrastructure", dueDate: "2026-07-03", priority: "High", status: "Not Started", relatedFramework: "PCI DSS", relatedPackageControl: "11.3.1" },
  { id: "task-3", title: "Complete HIPAA policy review", assignedOwner: "Compliance", dueDate: "2026-07-08", priority: "Medium", status: "In Progress", relatedFramework: "HIPAA", relatedPackageControl: "164.308(a)(6)" },
  { id: "task-4", title: "Remediate audit logging exception", assignedOwner: "Platform Engineering", dueDate: "2026-07-11", priority: "Medium", status: "Blocked", relatedFramework: "NIST 800-171", relatedPackageControl: "AU-2" },
  { id: "task-5", title: "Prepare SOC 2 vendor review packet", assignedOwner: "Vendor Management", dueDate: "2026-07-22", priority: "Medium", status: "Not Started", relatedFramework: "SOC 2", relatedPackageControl: "CC9.2" },
];

export const calendarEvents: ComplianceCalendarEvent[] = [
  { id: "event-1", title: "Readiness assessment", date: "2026-07-01", type: "Assessment", framework: "FedRAMP", owner: "Compliance Architecture" },
  { id: "event-2", title: "PCI DSS evidence expiration", date: "2026-07-03", type: "Evidence Expiration", framework: "PCI DSS", owner: "Infrastructure" },
  { id: "event-3", title: "HIPAA policy review", date: "2026-07-08", type: "Review", framework: "HIPAA", owner: "Compliance" },
  { id: "event-4", title: "Requirement remediation review", date: "2026-07-11", type: "Review", framework: "NIST 800-171", owner: "Platform Engineering" },
  { id: "event-5", title: "Governance approval", date: "2026-07-15", type: "Governance Approval", framework: "CMMC", owner: "Program Management" },
  { id: "event-6", title: "SOC 2 audit planning meeting", date: "2026-07-22", type: "Audit", framework: "SOC 2", owner: "Audit Readiness" },
];

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

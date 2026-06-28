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

export const frameworkHealth: FrameworkHealth[] = [];

export const monitoringAlerts: MonitoringAlert[] = [];

export const complianceTasks: ComplianceTask[] = [];

export const calendarEvents: ComplianceCalendarEvent[] = [];

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

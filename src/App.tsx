// Main application entry point
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { BrandBadge } from "@/components/BrandBadge";

// Public pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import RequestAccessPage from "./pages/auth/RequestAccessPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import NotFound from "./pages/NotFound";
import PrivacyPolicyPage from "./pages/legal/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/legal/TermsOfServicePage";
import SecurityPage from "./pages/legal/SecurityPage";

// App pages
import AppLayout from "./pages/app/AppLayout";
import ActionCenterPage from "./pages/app/ActionCenterPage";
import AssistantPage from "./pages/app/AssistantPage";
import PackagesPage from "./pages/app/PackagesPage";
import ProfileSettingsPage from "./pages/app/ProfileSettingsPage";
import DocumentSettingsPage from "./pages/app/DocumentSettingsPage";
import HumanValidationDashboardPage from "./pages/app/human-validation/HumanValidationDashboardPage";
import CompanyProfilePage from "./pages/app/human-validation/CompanyProfilePage";
import ReviewQueuePage from "./pages/app/human-validation/ReviewQueuePage";
import ApprovalDetailsPage from "./pages/app/human-validation/ApprovalDetailsPage";
import AuditTrailPage from "./pages/app/human-validation/AuditTrailPage";
import ComplianceRepositoryDashboardPage from "./pages/app/compliance-repository/ComplianceRepositoryDashboardPage";
import ApprovedDocumentsPage from "./pages/app/compliance-repository/ApprovedDocumentsPage";
import RepositoryCategoryPage from "./pages/app/compliance-repository/RepositoryCategoryPage";
import DocumentDetailsPage from "./pages/app/compliance-repository/DocumentDetailsPage";
import EvidenceDashboardPage from "./pages/app/evidence/EvidenceDashboardPage";
import EvidenceLibraryPage from "./pages/app/evidence/EvidenceLibraryPage";
import EvidenceUploadPage from "./pages/app/evidence/EvidenceUploadPage";
import EvidenceRequestsPage from "./pages/app/evidence/EvidenceRequestsPage";
import EvidenceReviewQueuePage from "./pages/app/evidence/EvidenceReviewQueuePage";
import EvidenceArchivePage from "./pages/app/evidence/EvidenceArchivePage";
import EvidenceDetailsPage from "./pages/app/evidence/EvidenceDetailsPage";
import ComplianceMonitoringDashboardPage from "./pages/app/compliance-monitoring/ComplianceMonitoringDashboardPage";
import MonitoringAlertsPage from "./pages/app/compliance-monitoring/MonitoringAlertsPage";
import FrameworkHealthPage from "./pages/app/compliance-monitoring/FrameworkHealthPage";
import CrossFrameworkPage from "./pages/app/compliance-monitoring/CrossFrameworkPage";
import CopilotPage from "./pages/app/copilot/CopilotPage";
import AIGovernancePage from "./pages/app/governance/AIGovernancePage";
import ComplianceTasksPage from "./pages/app/compliance-monitoring/ComplianceTasksPage";
import ComplianceCalendarPage from "./pages/app/compliance-monitoring/ComplianceCalendarPage";
import ComplianceWorkspacePage from "./pages/app/workspaces/ComplianceWorkspacePage";
import GovernanceWorkspacePage from "./pages/app/workspaces/GovernanceWorkspacePage";
import PlatformWorkspacePage from "./pages/app/workspaces/PlatformWorkspacePage";
import SecurityOperationsPage from "./pages/app/security/SecurityOperationsPage";
import ZestReconOverviewPage from "./pages/app/security/ZestReconOverviewPage";
import ConnectZestReconPage from "./pages/app/security/ConnectZestReconPage";
import SecurityFindingsPage from "./pages/app/security/SecurityFindingsPage";
import SecurityAssetsPage from "./pages/app/security/SecurityAssetsPage";
import SecurityAlertsPage from "./pages/app/security/SecurityAlertsPage";
import SecurityVulnerabilitiesPage from "./pages/app/security/SecurityVulnerabilitiesPage";
import SecurityAttackSurfacePage from "./pages/app/security/SecurityAttackSurfacePage";
import RiskManagementPage from "./pages/app/risk/RiskManagementPage";
import RiskRegisterPage from "./pages/app/risk/RiskRegisterPage";
import RiskAssessmentsPage from "./pages/app/risk/RiskAssessmentsPage";
import RiskTreatmentPlansPage from "./pages/app/risk/RiskTreatmentPlansPage";
import RiskExceptionsPage from "./pages/app/risk/RiskExceptionsPage";
import RiskPoamPage from "./pages/app/risk/RiskPoamPage";
import ReportsLandingPage from "./pages/app/reports/ReportsLandingPage";
import ExecutiveSummaryPage from "./pages/app/reports/ExecutiveSummaryPage";
import ComplianceReportsPage from "./pages/app/reports/ComplianceReportsPage";
import RiskReportsPage from "./pages/app/reports/RiskReportsPage";
import EvidenceReportsPage from "./pages/app/reports/EvidenceReportsPage";
import AuditReadinessPage from "./pages/app/reports/AuditReadinessPage";
import ExportCenterPage from "./pages/app/reports/ExportCenterPage";
import AdministrationPage from "./pages/app/admin/AdministrationPage";
import OrganizationProfilePage from "./pages/app/admin/OrganizationProfilePage";
import DocumentBrandingAdminPage from "./pages/app/admin/DocumentBrandingAdminPage";
import UsersAdminPage from "./pages/app/admin/UsersAdminPage";
import RolesPermissionsPage from "./pages/app/admin/RolesPermissionsPage";
import NotificationsAdminPage from "./pages/app/admin/NotificationsAdminPage";
import AuditLogsAdminPage from "./pages/app/admin/AuditLogsAdminPage";
import ApiKeysPage from "./pages/app/admin/ApiKeysPage";

const queryClient = new QueryClient();

const App = () => {
  // Enable dark mode by default
  if (!document.documentElement.classList.contains('dark')) {
    document.documentElement.classList.add('dark');
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrandBadge />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/request-access" element={<RequestAccessPage />} />
              <Route path="/auth/signup" element={<Navigate to="/auth/request-access" replace />} />
              <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
              <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsOfServicePage />} />
              <Route path="/security" element={<SecurityPage />} />

              {/* Protected app routes */}
              <Route
                path="/app"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<ActionCenterPage />} />
                <Route path="compliance" element={<ComplianceWorkspacePage />} />
                <Route path="governance" element={<GovernanceWorkspacePage />} />
                <Route path="security" element={<SecurityOperationsPage />} />
                <Route path="security/zestrecon" element={<ZestReconOverviewPage />} />
                <Route path="security/connect" element={<ConnectZestReconPage />} />
                <Route path="security/findings" element={<SecurityFindingsPage />} />
                <Route path="security/assets" element={<SecurityAssetsPage />} />
                <Route path="security/alerts" element={<SecurityAlertsPage />} />
                <Route path="security/vulnerabilities" element={<SecurityVulnerabilitiesPage />} />
                <Route path="security/attack-surface" element={<SecurityAttackSurfacePage />} />
                <Route path="risk" element={<RiskManagementPage />} />
                <Route path="risk/register" element={<RiskRegisterPage />} />
                <Route path="risk/assessments" element={<RiskAssessmentsPage />} />
                <Route path="risk/treatment-plans" element={<RiskTreatmentPlansPage />} />
                <Route path="risk/exceptions" element={<RiskExceptionsPage />} />
                <Route path="risk/poam" element={<RiskPoamPage />} />
                <Route path="reports" element={<ReportsLandingPage />} />
                <Route path="reports/executive" element={<ExecutiveSummaryPage />} />
                <Route path="reports/compliance" element={<ComplianceReportsPage />} />
                <Route path="reports/risk" element={<RiskReportsPage />} />
                <Route path="reports/evidence" element={<EvidenceReportsPage />} />
                <Route path="reports/audit" element={<AuditReadinessPage />} />
                <Route path="reports/export" element={<ExportCenterPage />} />
                <Route path="platform" element={<PlatformWorkspacePage />} />
                <Route path="admin" element={<AdministrationPage />} />
                <Route path="admin/organization" element={<OrganizationProfilePage />} />
                <Route path="admin/branding" element={<DocumentBrandingAdminPage />} />
                <Route path="admin/users" element={<UsersAdminPage />} />
                <Route path="admin/roles" element={<RolesPermissionsPage />} />
                <Route path="admin/notifications" element={<NotificationsAdminPage />} />
                <Route path="admin/audit-logs" element={<AuditLogsAdminPage />} />
                <Route path="admin/api-keys" element={<ApiKeysPage />} />
                <Route path="assistant" element={<AssistantPage />} />
                <Route path="packages" element={<PackagesPage />} />
                <Route path="human-validation" element={<HumanValidationDashboardPage />} />
                <Route path="human-validation/company-profile" element={<CompanyProfilePage />} />
                <Route path="human-validation/review-queue" element={<ReviewQueuePage />} />
                <Route path="human-validation/approvals/:profileId" element={<ApprovalDetailsPage />} />
                <Route path="human-validation/audit/:profileId" element={<AuditTrailPage />} />
                <Route path="compliance-repository" element={<ComplianceRepositoryDashboardPage />} />
                <Route path="compliance-repository/approved-documents" element={<ApprovedDocumentsPage />} />
                <Route path="compliance-repository/documents/:documentId" element={<DocumentDetailsPage />} />
                <Route path="compliance-repository/:category" element={<RepositoryCategoryPage />} />
                <Route path="evidence" element={<EvidenceDashboardPage />} />
                <Route path="evidence/library" element={<EvidenceLibraryPage />} />
                <Route path="evidence/upload" element={<EvidenceUploadPage />} />
                <Route path="evidence/requests" element={<EvidenceRequestsPage />} />
                <Route path="evidence/review" element={<EvidenceReviewQueuePage />} />
                <Route path="evidence/archive" element={<EvidenceArchivePage />} />
                <Route path="evidence/:evidenceId" element={<EvidenceDetailsPage />} />
                <Route path="compliance-monitoring" element={<ComplianceMonitoringDashboardPage />} />
                <Route path="compliance-monitoring/dashboard" element={<ComplianceMonitoringDashboardPage />} />
                <Route path="compliance-monitoring/alerts" element={<MonitoringAlertsPage />} />
                <Route path="compliance-monitoring/frameworks" element={<FrameworkHealthPage />} />
                <Route path="compliance-monitoring/cross-framework" element={<CrossFrameworkPage />} />
                <Route path="copilot" element={<CopilotPage />} />
                <Route path="governance/ai-oversight" element={<AIGovernancePage />} />
                <Route path="compliance-monitoring/tasks" element={<ComplianceTasksPage />} />
                <Route path="compliance-monitoring/calendar" element={<ComplianceCalendarPage />} />
                <Route path="settings/profile" element={<ProfileSettingsPage />} />
                <Route path="settings/documents" element={<DocumentSettingsPage />} />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;

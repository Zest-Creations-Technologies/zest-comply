// Main application entry point
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Public pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
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
import BillingPage from "./pages/app/BillingPage";
import StorageSettingsPage from "./pages/app/StorageSettingsPage";
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
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/signup" element={<SignupPage />} />
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
                <Route path="billing" element={<BillingPage />} />
                <Route path="settings/storage" element={<StorageSettingsPage />} />
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

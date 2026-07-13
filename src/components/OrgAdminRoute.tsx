import { ShieldAlert } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface OrgAdminRouteProps {
  children: React.ReactNode;
}

// Gates org-management pages (Users, Organization Profile, Branding,
// Security, Notifications, Audit Logs, API Keys) to org admins only.
// Rendered inside AppLayout/ProtectedRoute, so the user is already known
// to be authenticated by the time this runs.
export function OrgAdminRoute({ children }: OrgAdminRouteProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user?.org_role !== 'admin') {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 p-16 text-center">
        <ShieldAlert className="h-10 w-10 text-muted-foreground" />
        <h1 className="text-xl font-semibold">Admin access required</h1>
        <p className="text-muted-foreground">
          This section is only available to organization admins. Ask an admin on your team if you
          need something changed here.
        </p>
        <Button onClick={() => navigate('/app')}>Back to Dashboard</Button>
      </div>
    );
  }

  return <>{children}</>;
}

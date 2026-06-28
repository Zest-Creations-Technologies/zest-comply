import { useLocation, Link } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Building2, Gauge, Landmark, Settings, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/Logo';
import { ApiHealthIndicator } from '@/components/app/ApiHealthIndicator';

const workspaceNavItems = [
  { title: 'Operations Center', url: '/app/operations', icon: Gauge },
  { title: 'Compliance', url: '/app/compliance', icon: Building2 },
  { title: 'Governance', url: '/app/governance', icon: Landmark },
  { title: 'Security Operations', url: '/app/security', icon: Shield },
  { title: 'Platform', url: '/app/platform', icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (url: string) => {
    if (url === '/app/operations') return location.pathname === '/app' || location.pathname.startsWith('/app/operations');
    if (url === '/app/compliance') {
      return location.pathname.startsWith('/app/compliance')
        || location.pathname.startsWith('/app/packages')
        || location.pathname.startsWith('/app/evidence');
    }
    if (url === '/app/governance') {
      return location.pathname.startsWith('/app/governance')
        || location.pathname.startsWith('/app/human-validation');
    }
    if (url === '/app/security') return location.pathname.startsWith('/app/security');
    if (url === '/app/platform') {
      return location.pathname.startsWith('/app/platform')
        || location.pathname.startsWith('/app/assistant')
        || location.pathname.startsWith('/app/settings')
        || location.pathname.startsWith('/app/billing');
    }
    return location.pathname.startsWith(url);
  };

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-4">
        <Logo size="md" textClassName="text-sidebar-foreground" />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {workspaceNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border space-y-3">
        <ApiHealthIndicator showLabel={true} />
        <div className="flex items-center gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user?.full_name || user?.email}
            </p>
            <Badge variant="secondary" className="text-xs">
              {user?.user_plan?.plan?.name || 'No plan'}
            </Badge>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

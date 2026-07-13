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
import { Building2, Gauge, Landmark, Settings, Shield, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Logo } from '@/components/Logo';
import { ApiHealthIndicator } from '@/components/app/ApiHealthIndicator';
import logoIcon from '@/assets/logo-icon.png';

function ZestComplyAIIcon({ className }: { className?: string }) {
  return <img src={logoIcon} alt="" className={className} />;
}

const workspaceNavItems = [
  { title: 'Dashboard', url: '/app', icon: Gauge },
  { title: 'Compliance', url: '/app/compliance', icon: Building2 },
  { title: 'Governance', url: '/app/governance', icon: Landmark },
  { title: 'Security', url: '/app/security', icon: Shield },
  { title: 'Copilot', url: '/app/copilot', icon: ZestComplyAIIcon },
  { title: 'Settings', url: '/app/platform', icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (url: string) => {
    if (url === '/app') return location.pathname === '/app';
    if (url === '/app/compliance') {
      return location.pathname.startsWith('/app/compliance')
        || location.pathname.startsWith('/app/packages')
        || location.pathname.startsWith('/app/evidence');
    }
    if (url === '/app/governance') {
      return location.pathname.startsWith('/app/governance')
        || location.pathname.startsWith('/app/human-validation')
        || location.pathname.startsWith('/app/risk')
        || location.pathname.startsWith('/app/reports');
    }
    if (url === '/app/security') return location.pathname.startsWith('/app/security');
    if (url === '/app/platform') {
      return location.pathname.startsWith('/app/platform')
        || location.pathname.startsWith('/app/admin')
        || location.pathname.startsWith('/app/assistant')
        || location.pathname.startsWith('/app/settings');
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
            <SidebarMenu className="gap-1">
              {workspaceNavItems.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={active} className="h-10 text-[0.925rem] font-medium tracking-[-0.01em]">
                      <Link to={item.url}>
                        <item.icon className={active ? 'h-[18px] w-[18px] shrink-0' : 'h-[18px] w-[18px] shrink-0 opacity-80'} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border space-y-3">
        <ApiHealthIndicator showLabel={true} />
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 shrink-0">
            {user?.avatar_url && <AvatarImage src={user.avatar_url} alt={user.full_name || user.email} />}
            <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
              <UserIcon className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
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

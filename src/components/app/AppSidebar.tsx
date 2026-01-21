import { useLocation, Link } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { 
  Home, 
  MessageSquare, 
  CreditCard, 
  Cloud, 
  User,
  Package,
  FileEdit,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/Logo';
import { ApiHealthIndicator } from '@/components/app/ApiHealthIndicator';

const mainNavItems = [
  { title: 'Action Center', url: '/app', icon: Home },
  { title: 'AI Assistant', url: '/app/assistant', icon: MessageSquare },
  { title: 'Packages', url: '/app/packages', icon: Package },
];

const settingsNavItems = [
  { title: 'Billing', url: '/app/billing', icon: CreditCard },
  { title: 'Cloud Storage', url: '/app/settings/storage', icon: Cloud },
  { title: 'Document Branding', url: '/app/settings/documents', icon: FileEdit },
  { title: 'Profile', url: '/app/settings/profile', icon: User },
];

export function AppSidebar() {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (url: string) => {
    if (url === '/app') {
      return location.pathname === '/app';
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
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
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

        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsNavItems.map((item) => (
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

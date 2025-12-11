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
  History, 
  CreditCard, 
  Cloud, 
  User,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';

const mainNavItems = [
  { title: 'Action Center', url: '/app', icon: Home },
  { title: 'AI Assistant', url: '/app/assistant', icon: MessageSquare },
  { title: 'Conversations', url: '/app/conversations', icon: History },
];

const settingsNavItems = [
  { title: 'Billing', url: '/app/billing', icon: CreditCard },
  { title: 'Cloud Storage', url: '/app/settings/storage', icon: Cloud },
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
        <Link to="/" className="flex items-center gap-2">
          <div className="relative">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <Zap className="h-3 w-3 text-accent absolute -bottom-0.5 -right-0.5" />
          </div>
          <span className="font-bold text-lg text-sidebar-foreground">Zest Comply</span>
        </Link>
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

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user?.name || user?.email}
            </p>
            <Badge variant="secondary" className="text-xs">
              Professional
            </Badge>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

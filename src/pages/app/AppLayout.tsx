import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { AppSidebar } from '@/components/app/AppSidebar';
import { UserMenu } from '@/components/app/UserMenu';
import { NotificationBell } from '@/components/app/NotificationBell';

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const isTopLevel = location.pathname === '/app';

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          {/* Top bar */}
          <header className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-4">
            <div className="flex items-center gap-1">
              <SidebarTrigger className="text-slate-500 hover:text-slate-900" />
              {!isTopLevel && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-500 hover:text-slate-900"
                  onClick={() => navigate(-1)}
                  aria-label="Go back"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <NotificationBell />
              <UserMenu />
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 overflow-auto bg-[#f8faf8]">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

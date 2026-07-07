import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app/AppSidebar';
import { UserMenu } from '@/components/app/UserMenu';

export default function AppLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          {/* Top bar */}
          <header className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-4">
            <SidebarTrigger className="text-slate-500 hover:text-slate-900" />
            <UserMenu />
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

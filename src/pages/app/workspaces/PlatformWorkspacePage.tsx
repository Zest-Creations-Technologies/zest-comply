import { Link } from "react-router-dom";
import { ArrowRight, Building2, FileEdit, KeyRound, Settings, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toneFor } from "@/lib/tone-palette";
import { MeterBar } from "@/components/app/dashboard-charts";
import { usePlanUsageStats } from "@/hooks/useDashboardStats";

const quickLinks = [
  { title: "Administration", href: "/app/admin", icon: Settings },
  { title: "Organization Profile", href: "/app/admin/organization", icon: Building2 },
  { title: "Users", href: "/app/admin/users", icon: Users },
  { title: "API Keys", href: "/app/admin/api-keys", icon: KeyRound },
  { title: "Profile", href: "/app/settings/profile", icon: User },
  { title: "Document Branding", href: "/app/admin/branding", icon: FileEdit },
];

export default function PlatformWorkspacePage() {
  const usage = usePlanUsageStats();

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#d8b45d] via-[#f0d990] to-[#98d8c5]" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7a622b]">Workspace</p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">Platform</h1>
            <p className="text-slate-600">Manage AI assistance, integrations, administration, profile settings, and document branding.</p>
          </div>
          <Button asChild size="lg" className="shadow-lg shadow-primary/20">
            <Link to="/app/assistant">
              Open ZestComply AI
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[0.8fr_1.2fr]">
        <Card className="border-slate-200/80 bg-white shadow-sm shadow-slate-200/60">
          <CardContent className="flex h-full items-center p-5">
            <div>
              <p className="text-2xl font-bold text-slate-900">{usage.data?.planName ?? "No plan"}</p>
              <p className="mt-1 text-sm text-slate-500">Current plan</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200/80 bg-white shadow-sm shadow-slate-200/60">
          <CardContent className="flex h-full flex-col justify-center gap-4 p-5">
            <MeterBar
              label="Documents this period"
              value={usage.data?.documentsGenerated ?? 0}
              max={Math.max(usage.data?.documentsGenerated ?? 0, 5)}
              tone="teal"
            />
            <MeterBar
              label="Packages this period"
              value={usage.data?.packagesGenerated ?? 0}
              max={Math.max(usage.data?.packagesGenerated ?? 0, 5)}
              tone="gold"
            />
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-slate-950 mb-4">Quick links</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map((link, index) => {
            const tone = toneFor(index);
            return (
              <Link
                key={link.title}
                to={link.href}
                className={`group flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm shadow-slate-200/60 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${tone.ring}`}
              >
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-105 ${tone.box} ${tone.icon}`}>
                  <link.icon className="h-4 w-4" />
                </span>
                <span className="text-sm font-medium text-slate-900">{link.title}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toneFor } from "@/lib/tone-palette";

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  caption,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  caption?: string;
}) {
  return (
    <div className="space-y-2">
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7a622b]">{eyebrow}</p>
      )}
      <h1 className="text-3xl font-bold tracking-tight text-slate-950">{title}</h1>
      <p className="max-w-3xl text-slate-600">{description}</p>
      {caption && <p className="max-w-3xl text-sm italic text-slate-500">{caption}</p>}
    </div>
  );
}

export function AdminEmptyState({
  icon: Icon = Settings,
  title,
  description,
  action,
}: {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm shadow-slate-200/60">
      <div className="flex flex-col items-start gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="font-medium text-slate-900">{title}</p>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">{description}</p>
        </div>
        {action && (
          <Button asChild>
            <Link to={action.href}>{action.label}</Link>
          </Button>
        )}
      </div>
    </div>
  );
}

export function AdminActionCard({
  title,
  description,
  href,
  icon: Icon,
  tone,
}: {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  tone?: ReturnType<typeof toneFor>;
}) {
  const resolvedTone = tone ?? toneFor(0);
  return (
    <Link
      to={href}
      className={`group flex flex-col gap-3 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/60 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${resolvedTone.ring}`}
    >
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-105 ${resolvedTone.box} ${resolvedTone.icon}`}>
        <Icon className="h-5 w-5" />
      </span>
      <div className="space-y-1">
        <p className="font-semibold text-slate-900">{title}</p>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
    </Link>
  );
}

export function AdminFieldGrid({ fields }: { fields: string[] }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/60">
      <div className="mb-4 space-y-1">
        <p className="font-semibold text-slate-900">Profile Fields</p>
        <p className="text-sm text-slate-500">These settings will use organization data when administration APIs are connected.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {fields.map((field) => (
          <div key={field} className="rounded-lg border border-slate-200 p-3">
            <p className="text-sm font-medium text-slate-900">{field}</p>
            <p className="mt-1 text-sm text-slate-500">Not configured</p>
          </div>
        ))}
      </div>
    </div>
  );
}

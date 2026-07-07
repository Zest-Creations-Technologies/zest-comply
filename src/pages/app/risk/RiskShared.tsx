import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { GitBranch } from "lucide-react";
import { toneFor } from "@/lib/tone-palette";

export function RiskPageHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold tracking-tight text-slate-950">{title}</h1>
      <p className="max-w-3xl text-slate-600">{description}</p>
    </div>
  );
}

export function RiskEmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
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
      </div>
    </div>
  );
}

export function RiskRelationshipSection() {
  const relationships = [
    "Assessments -> Risks",
    "Governance Reviews -> Risks",
    "Compliance Monitoring -> Risks",
    "ZestRecon Findings -> Risks",
    "Risks -> Executive Reports",
    "Risks -> Evidence Requests",
  ];

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/60">
      <div className="mb-4 space-y-1">
        <p className="font-semibold text-slate-900">Future Integrations</p>
        <p className="text-sm text-slate-500">Risk Management will connect evidence, governance, monitoring, and security operations workflows.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {relationships.map((relationship) => (
          <div key={relationship} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
            <GitBranch className="h-4 w-4 text-slate-400" />
            {relationship}
          </div>
        ))}
      </div>
    </div>
  );
}

export function RiskActionCard({
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

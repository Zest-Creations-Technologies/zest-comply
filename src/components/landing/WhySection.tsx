import { Card, CardContent } from "@/components/ui/card";
import { BadgeCheck, Bell, FileText, GitBranch, MonitorCheck, Scale, ShieldCheck } from "lucide-react";


const frameworkExamples = [
  "CMMC",
  "NIST",
  "ISO 27001",
  "SOC 2",
  "HIPAA",
  "PCI DSS",
  "FedRAMP",
  "GDPR",
  "CJIS",
  "SOX",
  "GLBA",
  "HITRUST",
  "State privacy",
  "Custom internal frameworks",
];

const capabilities = [
  {
    icon: ShieldCheck,
    title: "Framework intelligence",
    description: "Maintain a data-driven registry for industry, government, enterprise, privacy, and custom internal frameworks without hardcoded framework limits.",
  },
  {
    icon: FileText,
    title: "Policy generation",
    description: "Generate policies, procedures, plans, evidence matrices, manifests, and supporting package artifacts from approved context.",
  },
  {
    icon: BadgeCheck,
    title: "Human validation",
    description: "Route profile inputs, generated documents, review comments, decisions, and sign-off records through accountable workflows.",
  },
  {
    icon: GitBranch,
    title: "Traceability",
    description: "Connect documents and sections back to controls, document requirements, evidence references, and audit trail events.",
  },
  {
    icon: MonitorCheck,
    title: "Continuous monitoring",
    description: "Track reviews, due dates, missing evidence, approval status, risk inputs, and readiness signals over time.",
  },
  {
    icon: Scale,
    title: "Executive reporting",
    description: "Prepare decision-ready reporting from compliance posture, evidence coverage, risk work, approvals, and audit readiness.",
  },
  {
    icon: Bell,
    title: "Microsoft Teams alerts",
    description: "Send evidence, coverage, and approval alerts straight to your organization's own Microsoft Teams channel in real time.",
  },
];

export function WhySection() {
  return (
    <section id="platform" className="relative overflow-hidden bg-[#f8faf8] py-28">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d8b45d]/50 to-transparent" />
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#7a622b]">Platform intelligence</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">
              One operating layer for the compliance work auditors actually inspect.
            </h2>
          </div>
          <p className="text-lg leading-8 text-slate-600">
            ZestComply is designed around the real evidence chain for any framework: requirements, generated artifacts, human review, approvals, monitoring, and executive accountability. Named frameworks are examples, not limits.
          </p>
        </div>

        <div className="mt-10 rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-xl shadow-slate-200/60 backdrop-blur">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#7a622b]">Framework-agnostic by design</p>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                Manage industry, government, enterprise, privacy, and custom internal frameworks through a shared compliance operations model.
              </p>
            </div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Examples only</p>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {frameworkExamples.map((framework) => (
              <span key={framework} className="rounded-full border border-slate-200 bg-[#f8faf8] px-3 py-1.5 text-xs font-medium text-slate-700">
                {framework}
              </span>
            ))}
          </div>
        </div>

        <div id="operations" className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((item) => (
            <Card key={item.title} className="group overflow-hidden border-slate-200/80 bg-white shadow-sm shadow-slate-200/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/90">
              <CardContent className="p-6">
                <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#d8b45d]/25 bg-gradient-to-br from-[#fff7df] to-[#eef8f3] text-[#36544d] shadow-inner">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold tracking-[-0.02em] text-slate-950">{item.title}</h3>
                <p className="mt-4 text-sm leading-6 text-slate-600">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

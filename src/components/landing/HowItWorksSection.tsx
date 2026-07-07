import { ArrowRight, FileSearch, FileText, FolderCheck, MonitorCheck, UsersRound } from "lucide-react";

const workflow = [
  {
    icon: FileSearch,
    title: "Resolve",
    description: "Select any framework or custom control set, then resolve controls, document requirements, and mappings from registry data.",
  },
  {
    icon: FileText,
    title: "Generate",
    description: "Create policies, procedures, plans, evidence matrices, manifests, and package artifacts with deterministic structure.",
  },
  {
    icon: UsersRound,
    title: "Validate",
    description: "Assign reviewers and approvers, capture comments, record decisions, and preserve audit trail events.",
  },
  {
    icon: FolderCheck,
    title: "Evidence",
    description: "Organize evidence requests, ownership, status, due dates, expiration dates, and control traceability.",
  },
  {
    icon: MonitorCheck,
    title: "Monitor",
    description: "Track approvals, missing evidence, review cycles, risk work, and executive reporting readiness.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="workflow" className="relative overflow-hidden bg-[#081313] py-28 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(216,180,93,0.18),transparent_28%),radial-gradient(circle_at_90%_30%,rgba(91,197,170,0.14),transparent_32%)]" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#d8b45d]">Governed workflow</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
            From requirement to evidence to executive decision.
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            Each phase is designed to produce a defensible record across regulated, industry, enterprise, and custom compliance programs.
          </p>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-5">
          {workflow.map((step, index) => (
            <div key={step.title} className="relative rounded-2xl border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/10 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.07]">
              <div className="mb-7 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#d8b45d]/25 bg-[#d8b45d]/10">
                  <step.icon className="h-5 w-5 text-[#f0d990]" />
                </div>
                {index < workflow.length - 1 && <ArrowRight className="hidden h-5 w-5 text-slate-500 lg:block" />}
              </div>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#98d8c5]">0{index + 1}</p>
              <h3 className="mt-3 text-xl font-semibold tracking-[-0.02em] text-white">{step.title}</h3>
              <p className="mt-4 text-sm leading-6 text-slate-300">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

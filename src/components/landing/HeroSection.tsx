import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BadgeCheck, BarChart3, CheckCircle2, FileCheck2, GitBranch, ShieldCheck, Sparkles, UsersRound } from "lucide-react";

const trustSignals = ["All-framework registry", "Evidence traceability", "Approval governance"];
const workflowItems = [
  { label: "Frameworks", value: "Industry, government, enterprise, custom", icon: ShieldCheck },
  { label: "Policies", value: "Drafted from approved context", icon: FileCheck2 },
  { label: "Evidence", value: "Mapped to controls", icon: GitBranch },
  { label: "Approvals", value: "Reviewer sign-off trail", icon: UsersRound },
];

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[#071112] pt-36 text-white sm:pt-40">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_18%,rgba(216,180,93,0.22),transparent_30%),radial-gradient(circle_at_74%_14%,rgba(80,180,160,0.22),transparent_34%),linear-gradient(135deg,#071112_0%,#0b1b20_46%,#11170d_100%)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-black/50 to-transparent" />
      <div className="absolute left-1/2 top-24 -z-10 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full border border-white/10 bg-white/[0.025] blur-3xl" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-b from-transparent via-[#f8faf8]/80 to-[#f8faf8]" />

      <div className="mx-auto grid max-w-7xl items-center gap-16 px-5 pb-28 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
        <div className="max-w-3xl">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#d8b45d]/30 bg-[#d8b45d]/10 px-4 py-2 text-sm text-[#f4deb0] shadow-lg shadow-amber-950/20">
            <Sparkles className="h-4 w-4" />
            AI-assisted compliance operations platform
          </div>

          <h1 className="text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">
            Turn compliance into a governed operating system.
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
            ZestComply unifies any compliance framework with policy generation, evidence operations, human validation, continuous monitoring, and executive reporting in one premium compliance command center.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 bg-[#d8b45d] px-6 text-slate-950 shadow-xl shadow-amber-950/25 hover:bg-[#f0d990]">
              <Link to="/auth/request-access">
                Request Access
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 border-white/18 bg-white/[0.04] px-6 text-white backdrop-blur hover:bg-white/[0.09]">
              <a href="#platform">Explore Platform</a>
            </Button>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {trustSignals.map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-[#98d8c5]" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-w-0">
          <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-[#d8b45d]/20 blur-3xl" />
          <div className="absolute -right-8 bottom-12 h-52 w-52 rounded-full bg-[#65c7ad]/20 blur-3xl" />
          <div className="relative rounded-[1.6rem] border border-white/12 bg-white/[0.06] p-3 shadow-2xl shadow-black/45 backdrop-blur-xl">
            <div className="overflow-hidden rounded-[1.25rem] border border-white/12 bg-[#0b1416]/95">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[#d8b45d]">ZestComply Command Center</p>
                  <p className="mt-1 text-lg font-semibold text-white">Audit readiness workflow</p>
                </div>
                <div className="rounded-full border border-[#98d8c5]/30 bg-[#98d8c5]/10 px-3 py-1 text-xs font-medium text-[#c9f4e7]">Governed</div>
              </div>

              <div className="grid gap-0 lg:grid-cols-[0.78fr_1.22fr]">
                <div className="border-b border-white/10 p-5 lg:border-b-0 lg:border-r">
                  <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-sm text-slate-400">All-framework coverage</span>
                      <BadgeCheck className="h-5 w-5 text-[#d8b45d]" />
                    </div>
                    <div className="space-y-3">
                      {["Controls resolved", "Documents mapped", "Evidence requested", "Approval trail"].map((item, index) => (
                        <div key={item} className="flex items-center gap-3">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full border border-[#98d8c5]/30 bg-[#98d8c5]/10 text-[11px] text-[#c9f4e7]">{index + 1}</div>
                          <span className="text-sm text-slate-300">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl border border-white/10 bg-gradient-to-br from-[#d8b45d]/12 to-transparent p-4">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="h-5 w-5 text-[#f0d990]" />
                      <div>
                        <p className="text-sm font-medium text-white">Executive reporting</p>
                        <p className="text-xs text-slate-400">Board-ready evidence chain</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {workflowItems.map((item) => (
                      <div key={item.label} className="rounded-xl border border-white/10 bg-white/[0.045] p-4 transition-transform duration-300 hover:-translate-y-1 hover:bg-white/[0.07]">
                        <item.icon className="mb-5 h-5 w-5 text-[#98d8c5]" />
                        <p className="text-sm text-slate-400">{item.label}</p>
                        <p className="mt-1 text-sm font-medium leading-5 text-white">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 rounded-xl border border-white/10 bg-[#071112] p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-sm font-medium text-white">Package lifecycle</p>
                      <p className="text-xs text-slate-500">Deterministic trace</p>
                    </div>
                    <div className="relative space-y-3 before:absolute before:left-[7px] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-gradient-to-b before:from-[#d8b45d] before:to-[#98d8c5]">
                      {[
                        "Framework or custom control set selected",
                        "Policy and evidence package generated",
                        "Reviewer requested changes",
                        "Executive report prepared",
                      ].map((item) => (
                        <div key={item} className="relative flex items-center gap-3 pl-7 text-sm text-slate-300">
                          <span className="absolute left-0 h-3.5 w-3.5 rounded-full border border-[#f0d990] bg-[#071112] shadow-[0_0_18px_rgba(216,180,93,0.45)]" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

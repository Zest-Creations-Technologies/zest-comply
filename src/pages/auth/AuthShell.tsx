import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { BadgeCheck, FileCheck2, GitBranch, LockKeyhole, Scale, ShieldCheck, UsersRound } from "lucide-react";
import { cn } from "@/lib/utils";
import logoIcon from "@/assets/logo-icon.png";

export const authCardClass = "relative overflow-hidden rounded-[1.75rem] border border-white/14 bg-[#0b1416]/88 text-white shadow-[0_34px_100px_rgba(0,0,0,0.46)] backdrop-blur-2xl before:absolute before:inset-x-8 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-[#f0d990]/70 before:to-transparent after:absolute after:inset-0 after:pointer-events-none after:bg-[radial-gradient(circle_at_50%_0%,rgba(216,180,93,0.12),transparent_34%)]";
export const authInputClass = "h-12 rounded-xl border-white/12 bg-white/[0.06] text-white shadow-inner shadow-black/10 placeholder:text-slate-500 transition-all duration-200 hover:border-white/20 focus-visible:border-[#d8b45d]/70 focus-visible:ring-2 focus-visible:ring-[#d8b45d]/35";
export const authPrimaryButtonClass = "h-12 rounded-xl bg-gradient-to-r from-[#caa95c] via-[#dfc171] to-[#9ed5c2] font-semibold text-slate-950 shadow-[0_18px_40px_rgba(136,104,35,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:from-[#d8b45d] hover:via-[#f0d990] hover:to-[#b8ead9] hover:shadow-[0_24px_52px_rgba(136,104,35,0.34)] focus-visible:ring-[#d8b45d]/45";
export const authLinkClass = "font-medium text-[#e2c678] transition-colors hover:text-[#f7e5ad] hover:underline";
export const authMutedLinkClass = "text-slate-400 transition-colors hover:text-white";
export const authLabelClass = "text-sm font-medium text-slate-200";
export const authErrorClass = "text-sm text-red-300";
export const authIconBubbleClass = "mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#d8b45d]/25 bg-[#d8b45d]/10 text-[#f0d990] shadow-inner";

const trustItems = [
  { icon: ShieldCheck, label: "All-framework registry", detail: "Industry, government, enterprise, and custom controls" },
  { icon: FileCheck2, label: "Evidence chain", detail: "Policies, evidence, approvals, and reporting connected" },
  { icon: UsersRound, label: "Human validation", detail: "Reviewer accountability and governance decisions" },
];

const visualNodes = [
  { label: "Frameworks", icon: ShieldCheck },
  { label: "Evidence", icon: GitBranch },
  { label: "Approvals", icon: BadgeCheck },
  { label: "Security", icon: LockKeyhole },
  { label: "Reporting", icon: Scale },
];

export function AuthWordmark({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("inline-flex items-center gap-3", className)} aria-label="ZestComply home">
      <span className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-amber-200/30 bg-gradient-to-br from-slate-950 via-slate-900 to-[#153b38] shadow-xl shadow-emerald-950/30">
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_15%,rgba(250,204,21,0.38),transparent_34%),radial-gradient(circle_at_75%_80%,rgba(94,234,212,0.24),transparent_36%)]" />
        <span className="absolute inset-x-2 top-0 h-px bg-gradient-to-r from-transparent via-[#f7e5ad]/80 to-transparent" />
        <img src={logoIcon} alt="" className="relative h-8 w-8 opacity-95" />
      </span>
      <span className="flex items-baseline text-[1.7rem] font-semibold tracking-[-0.055em] text-white">
        <span>Zest</span>
        <span className="bg-gradient-to-r from-[#d6b66a] via-[#f7e5ad] to-[#8bd6c2] bg-clip-text text-transparent">Comply</span>
      </span>
    </Link>
  );
}

function AuthVisualPanel() {
  return (
    <aside className="relative hidden min-h-[42rem] overflow-hidden rounded-[2rem] border border-white/12 bg-white/[0.045] p-8 shadow-[0_34px_100px_rgba(0,0,0,0.32)] backdrop-blur-2xl lg:block">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(216,180,93,0.20),transparent_32%),radial-gradient(circle_at_82%_70%,rgba(101,199,173,0.18),transparent_34%)]" />
      <div className="relative flex h-full flex-col justify-between">
        <div>
          <div className="inline-flex rounded-full border border-[#d8b45d]/25 bg-[#d8b45d]/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-[#f0d990]">
            Compliance command center
          </div>
          <h2 className="mt-6 max-w-md text-4xl font-semibold leading-tight tracking-[-0.045em] text-white">
            Govern access to every compliance workflow from one trusted surface.
          </h2>
          <p className="mt-5 max-w-md text-sm leading-7 text-slate-300">
            Framework coverage, evidence, approvals, security, and executive reporting stay connected from sign-in through audit readiness.
          </p>
        </div>

        <div className="my-10 rounded-3xl border border-white/12 bg-[#071112]/70 p-5 shadow-2xl shadow-black/20">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Governance trace</p>
              <p className="text-xs text-slate-500">Authentication to approval trail</p>
            </div>
            <span className="rounded-full border border-[#98d8c5]/25 bg-[#98d8c5]/10 px-3 py-1 text-xs text-[#c9f4e7]">Secure</span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {visualNodes.map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.045] p-3 text-center">
                <item.icon className="mx-auto h-4 w-4 text-[#98d8c5]" />
                <p className="mt-2 text-[10px] font-medium text-slate-400">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {trustItems.map((item) => (
            <div key={item.label} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#d8b45d]/10 text-[#f0d990]">
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">{item.label}</p>
                <p className="mt-1 text-xs leading-5 text-slate-400">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#071112] px-4 py-8 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(216,180,93,0.20),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(80,180,160,0.19),transparent_34%),linear-gradient(135deg,#071112_0%,#0b1b20_46%,#11170d_100%)]" />
      <div className="absolute left-1/2 top-16 h-[46rem] w-[46rem] -translate-x-1/2 rounded-full border border-white/10 bg-white/[0.025] blur-3xl" />
      <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-[#d8b45d]/10 blur-3xl" />
      <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-[#65c7ad]/10 blur-3xl" />
      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(27rem,32rem)] xl:grid-cols-[minmax(0,1.1fr)_minmax(30rem,34rem)]">
        <AuthVisualPanel />
        <main className="flex w-full justify-center lg:justify-end">
          <div className="w-full max-w-[34rem] xl:max-w-[36rem]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

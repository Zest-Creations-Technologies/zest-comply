import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function PartnershipSection() {
  return (
    <section id="reporting" className="bg-[#f8faf8] py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] border border-slate-900/10 bg-[#071112] p-8 text-white shadow-2xl shadow-slate-300/70 sm:p-12 lg:p-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(216,180,93,0.22),transparent_34%),radial-gradient(circle_at_88%_60%,rgba(91,197,170,0.18),transparent_36%)]" />
          <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#d8b45d]">Enterprise readiness</p>
              <h2 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                Build the compliance operating system your next audit will depend on.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                Start with any framework or custom control set, then expand into policy generation, governance approvals, evidence management, continuous monitoring, and executive reporting.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Button asChild size="lg" className="h-12 bg-[#d8b45d] px-6 text-slate-950 hover:bg-[#f0d990]">
                <Link to="/auth/signup">Request Access</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 border-white/20 bg-white/[0.04] px-6 text-white hover:bg-white/[0.09]">
                <Link to="/auth/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

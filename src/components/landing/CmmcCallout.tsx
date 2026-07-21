import { Link } from "react-router-dom";
import { ArrowRight, CalendarClock, FileCheck2, ListChecks, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { icon: ShieldAlert, label: "110 controls", detail: "NIST SP 800-171 Rev 2, mapped to CMMC Level 2" },
  { icon: ListChecks, label: "14 domains", detail: "Access Control through System Integrity" },
  { icon: FileCheck2, label: "16 documents", detail: "System Security Plan, POA&M, and domain policies" },
];

export function CmmcCallout() {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-24">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d8b45d]/50 to-transparent" />
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d8b45d]/30 bg-[#d8b45d]/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#f0d990]">
              <CalendarClock className="h-3.5 w-3.5" />
              CMMC 2.0 enforcement — November 10
            </div>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
              Built for CMMC 2.0 Level 2, not bolted on.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
              A dedicated control structure, not a generic template — every one of the 110 NIST SP 800-171 requirements mapped to a real document, ready before the deadline hits.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="shadow-lg shadow-[#d8b45d]/20">
                <Link to="/auth/request-access">
                  Get CMMC 2.0 Ready
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-slate-700 bg-transparent text-white hover:bg-slate-900">
                <a href="#platform">See how it works</a>
              </Button>
            </div>
          </div>

          <div className="grid gap-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#98d8c5]/30 bg-[#98d8c5]/10 text-[#98d8c5]">
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">{stat.label}</p>
                  <p className="text-sm text-slate-400">{stat.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

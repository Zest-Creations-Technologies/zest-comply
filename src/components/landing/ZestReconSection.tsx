import { Radar } from "lucide-react";

export function ZestReconSection() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-gradient-to-br from-[#f8faf8] to-white p-8 shadow-xl shadow-slate-200/60 sm:p-12 lg:p-16 lg:text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#65c7ad]/25 bg-gradient-to-br from-[#eef8f3] to-[#fff7df] text-[#36544d] shadow-inner">
            <Radar className="h-6 w-6" />
          </div>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.22em] text-[#7a622b]">Optional Scanner Integration</p>
          <h2 className="mx-auto mt-4 max-w-2xl text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">
            From security findings to audit-ready evidence.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Connect ZestRecon, our own security intelligence platform, or any scanner you already run — Qualys, Tenable, Wiz, Rapid7, or a custom API. ZestComply turns their findings into policies, controls, and audit-ready evidence — automatically.
          </p>
        </div>
      </div>
    </section>
  );
}

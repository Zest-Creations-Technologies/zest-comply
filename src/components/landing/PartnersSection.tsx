const platformSignals = [
  "All-framework control intelligence",
  "Governance-ready evidence workflows",
  "Board-level reporting preparation",
];

export function PartnersSection() {
  return (
    <section id="evidence" className="bg-[#f8faf8] py-14">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-xl shadow-slate-200/60 backdrop-blur md:grid-cols-3">
          {platformSignals.map((signal) => (
            <div key={signal} className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white to-[#f3f7f4] p-5 text-sm font-medium text-slate-700">
              {signal}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

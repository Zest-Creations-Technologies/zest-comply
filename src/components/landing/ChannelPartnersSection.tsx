const channelCredentials = [
  {
    label: "Microsoft Azure Marketplace",
    detail: "Co-sell Ready",
  },
  {
    label: "AWS Marketplace",
    detail: "Public Listing",
  },
  {
    label: "IBM Business Partner",
    detail: "Authorized Reseller",
  },
];

export function ChannelPartnersSection() {
  return (
    <section id="partners" className="bg-white py-14">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-semibold uppercase tracking-[0.22em] text-[#36544d]">
          Trusted channel status
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {channelCredentials.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white to-[#f3f7f4] p-6 text-center shadow-sm shadow-slate-200/70"
            >
              <p className="text-base font-semibold text-slate-950">{item.label}</p>
              <p className="mt-1 text-sm text-slate-600">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const channelCredentials = [
  {
    label: "Microsoft Azure Marketplace",
    detail: "Co-sell Ready",
    href: "https://marketplace.microsoft.com/en-us/product/saas/zestcreationstechnologiesllc1776027867181.zestcomply",
  },
  {
    label: "AWS Marketplace",
    detail: "Public Listing",
    href: "https://aws.amazon.com/marketplace/pp/prodview-bzxdpmmwaqu7a",
  },
  {
    label: "IBM Business Partner",
    detail: "Authorized Reseller",
    href: "https://www.ibm.com/partnerplus/directory/company/9935",
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
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white to-[#f3f7f4] p-6 text-center shadow-sm shadow-slate-200/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/90"
            >
              <p className="text-base font-semibold text-slate-950 group-hover:text-[#36544d]">{item.label}</p>
              <p className="mt-1 text-sm text-slate-600">{item.detail}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

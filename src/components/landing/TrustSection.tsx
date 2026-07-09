import { Card, CardContent } from "@/components/ui/card";
import { Fingerprint, KeyRound, ScrollText, Lock, DatabaseBackup, Accessibility, UsersRound, ShieldCheck } from "lucide-react";

const trustCapabilities = [
  {
    icon: Fingerprint,
    title: "Single sign-on",
    description: "Connect your organization's identity provider — no proprietary lock-in. Password sign-in stays available too.",
  },
  {
    icon: UsersRound,
    title: "Role-based access control",
    description: "Admin, Member, and Viewer roles scope what each teammate can see and change, with enforced separation of duties for reviewers, approvers, and executive sign-off.",
  },
  {
    icon: ScrollText,
    title: "Complete audit trail",
    description: "Every action is logged and exportable to your organization's own security monitoring platform, so your security team can track ZestComply activity in the tools they already use.",
  },
  {
    icon: Lock,
    title: "Encryption in transit and at rest",
    description: "All traffic runs over TLS. Passwords are hashed with bcrypt — never stored in plaintext. Sensitive credentials, like API keys and identity-provider secrets, are encrypted at rest, and uploaded files are encrypted at rest by our storage provider.",
  },
  {
    icon: DatabaseBackup,
    title: "Automated, verified backups",
    description: "Scheduled backups with retention, run and verified end-to-end — your compliance data doesn't depend on hope.",
  },
  {
    icon: Accessibility,
    title: "Accessible by design",
    description: "Built for accessibility — keyboard navigation, screen reader support, and color contrast — so every teammate can use the platform.",
  },
];

export function TrustSection() {
  return (
    <section id="trust" className="relative overflow-hidden bg-white py-28">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#65c7ad]/50 to-transparent" />
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-end">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-[#36544d]">
              <ShieldCheck className="h-4 w-4" />
              Trust &amp; security
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">
              Built for the buyers who scrutinize this the hardest.
            </h2>
          </div>
          <p className="text-lg leading-8 text-slate-600">
            Compliance and security teams evaluate every vendor that touches their data. Here's what's actually built into the platform today — not a roadmap promise.
          </p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {trustCapabilities.map((item) => (
            <Card key={item.title} className="group overflow-hidden border-slate-200/80 bg-white shadow-sm shadow-slate-200/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/90">
              <CardContent className="p-6">
                <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#65c7ad]/25 bg-gradient-to-br from-[#eef8f3] to-[#fff7df] text-[#36544d] shadow-inner">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold tracking-[-0.02em] text-slate-950">{item.title}</h3>
                <p className="mt-4 text-sm leading-6 text-slate-600">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="mt-8 text-sm text-slate-500">
          Have a security questionnaire or need our data processing terms? <a href="mailto:info@zestcyber.com" className="font-medium text-[#36544d] underline underline-offset-2 hover:text-[#1f332e]">Get in touch</a> — we're happy to walk through our architecture directly.
        </p>
      </div>
    </section>
  );
}

// A segmented, multi-column feature/admin list - colorful circular icon per
// item, bold title, short description, divided by vertical rules on wide
// screens. Distinct from the card-grid quick-link pattern used elsewhere;
// suited to "list of settings/administration destinations" pages.

import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

export interface SegmentedFeatureItem {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

const ICON_PALETTE = [
  { bg: "#eef2ff", icon: "#4f46e5" }, // indigo
  { bg: "#f5f0ff", icon: "#7c3aed" }, // purple
  { bg: "#eff6ff", icon: "#2563eb" }, // blue
  { bg: "#fff7df", icon: "#8a6d1f" }, // gold
  { bg: "#f1f5f9", icon: "#475569" }, // slate
  { bg: "#eef8f3", icon: "#2f6d5c" }, // teal
  { bg: "#fef2f2", icon: "#dc2626" }, // red
  { bg: "#fdf4ff", icon: "#a21caf" }, // fuchsia
];

export function SegmentedFeatureList({
  eyebrow,
  title,
  description,
  items,
}: {
  eyebrow: string;
  title: string;
  description: string;
  items: SegmentedFeatureItem[];
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/60">
      <div className="p-6 pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7a622b]">{eyebrow}</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      <div className="grid grid-cols-2 divide-x divide-y divide-slate-100 border-t border-slate-100 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item, index) => {
          const tone = ICON_PALETTE[index % ICON_PALETTE.length];
          return (
            <Link
              key={item.title}
              to={item.href}
              className="group flex flex-col gap-3 p-5 transition-colors hover:bg-slate-50"
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-105"
                style={{ backgroundColor: tone.bg, color: tone.icon }}
              >
                <item.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold text-slate-900">{item.title}</p>
                <p className="mt-1 text-sm text-slate-500">{item.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

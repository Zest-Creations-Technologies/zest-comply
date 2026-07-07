// Shared gold/teal icon-tone palette for app dashboard cards, matching the
// marketing landing page's accent colors. Alternate per item so icon-heavy
// grids (workspace cards, action tiles) don't read as monotone.

export const TONES = [
  {
    // Light cream icon chip + deep gold icon - same combo as the landing
    // page's WhySection capability cards, reused here for real white/light
    // presence against the light dashboard canvas.
    box: "border-[#d8b45d]/30 bg-gradient-to-br from-[#fff7df] to-[#f3e6bd] shadow-[0_2px_8px_rgba(122,98,43,0.15)]",
    icon: "text-[#7a622b]",
    bar: "bg-[#d8b45d]/70",
    ring: "group-hover:border-[#d8b45d]/60",
    glow: "group-hover:shadow-[0_8px_24px_rgba(122,98,43,0.12)]",
  },
  {
    box: "border-[#98d8c5]/30 bg-gradient-to-br from-[#eef8f3] to-[#d6efe4] shadow-[0_2px_8px_rgba(54,84,77,0.15)]",
    icon: "text-[#36544d]",
    bar: "bg-[#98d8c5]/70",
    ring: "group-hover:border-[#98d8c5]/60",
    glow: "group-hover:shadow-[0_8px_24px_rgba(54,84,77,0.12)]",
  },
] as const;

export function toneFor(index: number) {
  return TONES[index % TONES.length];
}

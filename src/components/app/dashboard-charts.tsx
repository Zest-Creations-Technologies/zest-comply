// Real chart primitives for dashboard pages - a stat ring (radial progress
// with a center number), donut breakdown, meter bar, and activity feed,
// styled to match the marketing page's light sections (white cards, slate
// text, gold/teal accents) rather than dark glass panels. Deliberately
// data-driven, not decorative: every consumer passes real counts, and a
// zero value renders as an honest empty state rather than fabricated
// activity.

import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, RadialBar, RadialBarChart, PolarAngleAxis, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

const GOLD = "#c9a24a";
const TEAL = "#3f8f7a";
const DONUT_PALETTE = ["#c9a24a", "#3f8f7a", "#e0b354", "#5fa392", "#8a6d1f", "#2f6d5c"];

export function StatRing({
  label,
  value,
  max,
  tone = "gold",
  suffix,
}: {
  label: string;
  value: number;
  max: number;
  tone?: "gold" | "teal";
  suffix?: string;
}) {
  const color = tone === "gold" ? GOLD : TEAL;
  const safeMax = max > 0 ? max : Math.max(value, 1);
  const data = [{ name: label, value, fill: color }];

  return (
    <div className="flex items-center gap-4">
      <ChartContainer config={{ [label]: { label, color } }} className="aspect-square h-24 w-24 shrink-0">
        <RadialBarChart
          data={data}
          innerRadius="72%"
          outerRadius="100%"
          startAngle={90}
          endAngle={-270}
          barSize={8}
        >
          <PolarAngleAxis type="number" domain={[0, safeMax]} tick={false} axisLine={false} />
          <RadialBar dataKey="value" cornerRadius={8} background={{ fill: "#eef1ef" }} />
        </RadialBarChart>
      </ChartContainer>
      <div>
        <p className="text-2xl font-bold text-slate-900">
          {value.toLocaleString()}
          {suffix && <span className="ml-1 text-sm font-normal text-slate-500">{suffix}</span>}
        </p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const largeArcFlag = Math.abs(startAngle - endAngle) > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
}

// Speedometer-style gauge with green/amber/red severity zones and a needle -
// distinct from the donut StatRing so pages like Security Operations, where
// "how much attention does this need" matters more than a plain count, read
// differently at a glance.
export function GaugeMeter({
  label,
  value,
  max,
  zones = { green: 0.6, amber: 0.85 },
  variant = "dark",
  palette = "severity",
}: {
  label: string;
  value: number;
  max: number;
  zones?: { green: number; amber: number };
  variant?: "light" | "dark";
  /** "severity" = green/amber/red danger zones (higher is worse). "gold"/"teal" = single brand-color fill (neutral usage/progress, no danger implication). */
  palette?: "severity" | "gold" | "teal";
}) {
  const safeMax = max > 0 ? max : Math.max(value, 1);
  const pct = Math.max(0, Math.min(1, value / safeMax));
  const needleAngle = 180 - pct * 180;

  const cx = 100;
  const cy = 100;
  const r = 78;
  const greenEndAngle = 180 - zones.green * 180;
  const amberEndAngle = 180 - zones.amber * 180;
  const needlePoint = polarToCartesian(cx, cy, r - 22, needleAngle);

  const needleColor = variant === "dark" ? "#e5e7eb" : "#1e293b";
  const tickColor = variant === "dark" ? "#94a3b8" : "#64748b";
  const labelClass = variant === "dark" ? "text-muted-foreground" : "text-slate-500";
  const valueClass = variant === "dark" ? "text-white" : "text-slate-900";
  const trackColor = variant === "dark" ? "#334155" : "#e2e8f0";

  return (
    <div className="flex flex-col items-center gap-1">
      <p className={cn("text-sm", labelClass)}>{label}</p>
      <svg viewBox="0 0 200 130" className="w-full max-w-[200px]">
        {palette === "severity" ? (
          <>
            <path d={describeArc(cx, cy, r, 180, greenEndAngle)} stroke="#3fb37f" strokeWidth={14} strokeLinecap="round" fill="none" />
            <path d={describeArc(cx, cy, r, greenEndAngle, amberEndAngle)} stroke="#e0b354" strokeWidth={14} strokeLinecap="round" fill="none" />
            <path d={describeArc(cx, cy, r, amberEndAngle, 0)} stroke="#e0644a" strokeWidth={14} strokeLinecap="round" fill="none" />
          </>
        ) : (
          <>
            <path d={describeArc(cx, cy, r, 180, 0)} stroke={trackColor} strokeWidth={14} strokeLinecap="round" fill="none" />
            <path d={describeArc(cx, cy, r, 180, needleAngle)} stroke={palette === "gold" ? GOLD : TEAL} strokeWidth={14} strokeLinecap="round" fill="none" />
          </>
        )}
        <line x1={cx} y1={cy} x2={needlePoint.x} y2={needlePoint.y} stroke={needleColor} strokeWidth={3} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={7} fill={needleColor} />
        <text x={cx - r} y={cy + 18} textAnchor="middle" fill={tickColor} fontSize={11}>0</text>
        <text x={cx + r} y={cy + 18} textAnchor="middle" fill={tickColor} fontSize={11}>{safeMax}</text>
      </svg>
      <p className={cn("text-2xl font-bold", valueClass)}>{value.toLocaleString()}</p>
    </div>
  );
}

export interface BreakdownDatum {
  name: string;
  count: number;
}

const tooltipClassName = "border-slate-200 bg-white text-slate-900 shadow-lg";

export function BreakdownBarChart({
  data,
  tone = "gold",
  emptyLabel = "No data yet",
}: {
  data: BreakdownDatum[];
  tone?: "gold" | "teal";
  emptyLabel?: string;
}) {
  const color = tone === "gold" ? GOLD : TEAL;

  if (data.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-slate-500">
        {emptyLabel}
      </div>
    );
  }

  return (
    <ChartContainer config={{ count: { label: "Count", color } }} className="h-40 w-full">
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 8 }}>
        <CartesianGrid horizontal={false} stroke="#e2e8f0" />
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="name"
          tickLine={false}
          axisLine={false}
          width={110}
          tick={{ fill: "#64748b", fontSize: 12 }}
        />
        <ChartTooltip content={<ChartTooltipContent hideLabel className={tooltipClassName} />} />
        <Bar dataKey="count" fill={color} radius={[0, 6, 6, 0]} barSize={16} />
      </BarChart>
    </ChartContainer>
  );
}

export interface DailyActivityDatum {
  day: string;
  count: number;
}

export function ActivityBarChart({
  data,
  tone = "gold",
  emptyLabel = "No activity yet",
}: {
  data: DailyActivityDatum[];
  tone?: "gold" | "teal";
  emptyLabel?: string;
}) {
  const color = tone === "gold" ? GOLD : TEAL;
  const hasData = data.some((d) => d.count > 0);
  const maxValue = Math.max(...data.map((d) => d.count), 5);

  return (
    <div className="relative">
      <ChartContainer config={{ count: { label: "Activity", color } }} className="h-40 w-full">
        <BarChart data={data} margin={{ left: 0, right: 0 }}>
          <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 10 }} interval={Math.max(0, Math.ceil(data.length / 7) - 1)} />
          <YAxis domain={[0, maxValue]} hide />
          <ChartTooltip content={<ChartTooltipContent hideLabel className={tooltipClassName} />} />
          <Bar dataKey="count" fill={color} radius={[3, 3, 0, 0]} barSize={10} />
        </BarChart>
      </ChartContainer>
      {!hasData && (
        <div className="pointer-events-none absolute inset-x-0 top-8 flex justify-center">
          <p className="rounded-full bg-white/90 px-3 py-1 text-sm text-slate-500 shadow-sm">{emptyLabel}</p>
        </div>
      )}
    </div>
  );
}

export interface CalendarEventDatum {
  date: string;
  title: string;
  subtitle?: string;
}

export function MiniCalendar({
  events,
  emptyLabel = "No upcoming events",
}: {
  events: CalendarEventDatum[];
  emptyLabel?: string;
}) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const eventDaysThisMonth = new Set(
    events
      .map((e) => new Date(e.date))
      .filter((d) => d.getFullYear() === year && d.getMonth() === month)
      .map((d) => d.getDate())
  );

  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const startOfToday = new Date(year, month, today).getTime();
  const upcoming = [...events]
    .filter((e) => new Date(e.date).getTime() >= startOfToday)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4);

  return (
    <div className="grid gap-6 sm:grid-cols-[auto_1fr]">
      <div>
        <p className="mb-2 text-center text-sm font-semibold text-slate-900">
          {new Date(year, month, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </p>
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-medium text-slate-400">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div key={i}>{d}</div>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {cells.map((day, i) => (
            <div key={i} className={cn("relative flex h-7 w-7 items-center justify-center", day === null && "invisible")}>
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-lg text-xs",
                  day === today ? "bg-[#d8b45d] font-semibold text-white" : "text-slate-600"
                )}
              >
                {day ?? ""}
              </span>
              {day !== null && day !== today && eventDaysThisMonth.has(day) && (
                <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-[#3f8f7a]" />
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-900">Upcoming</p>
        {upcoming.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-sm text-slate-500">{emptyLabel}</div>
        ) : (
          <div className="space-y-2">
            {upcoming.map((event) => {
              const eventDate = new Date(event.date);
              return (
                <div key={`${event.title}-${event.date}`} className="flex items-center gap-3 rounded-lg border border-slate-200 p-2.5">
                  <div className="flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-lg border border-[#d8b45d]/30 bg-[#fff7df] text-[#7a622b]">
                    <span className="text-[10px] leading-none">{eventDate.toLocaleDateString("en-US", { month: "short" })}</span>
                    <span className="text-sm font-bold leading-none">{eventDate.getDate()}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900">{event.title}</p>
                    {event.subtitle && <p className="truncate text-xs text-slate-500">{event.subtitle}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export interface MonthlyTrendDatum {
  month: string;
  started: number;
  completed: number;
}

export function MonthlyTrendChart({
  data,
  emptyLabel = "No activity yet",
}: {
  data: MonthlyTrendDatum[];
  emptyLabel?: string;
}) {
  const hasData = data.some((d) => d.started > 0 || d.completed > 0);
  const maxValue = Math.max(...data.flatMap((d) => [d.started, d.completed]), 5);

  return (
    <div className="relative">
      <ChartContainer config={{ started: { label: "Started", color: GOLD }, completed: { label: "Completed", color: TEAL } }} className="h-56 w-full">
        <BarChart data={data} margin={{ left: 8, right: 8 }}>
          <CartesianGrid vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
          <YAxis domain={[0, maxValue]} tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} allowDecimals={false} width={28} />
          <ChartTooltip content={<ChartTooltipContent className={tooltipClassName} />} />
          <Legend wrapperStyle={{ fontSize: 12, color: "#64748b" }} />
          <Bar dataKey="started" name="Started" fill={GOLD} radius={[4, 4, 0, 0]} barSize={16} />
          <Bar dataKey="completed" name="Completed" fill={TEAL} radius={[4, 4, 0, 0]} barSize={16} />
        </BarChart>
      </ChartContainer>
      {!hasData && (
        <div className="pointer-events-none absolute inset-x-0 top-10 flex justify-center">
          <p className="rounded-full bg-white/90 px-3 py-1 text-sm text-slate-500 shadow-sm">{emptyLabel}</p>
        </div>
      )}
    </div>
  );
}

export function DonutBreakdown({
  data,
  emptyLabel = "No data yet",
  compact = false,
}: {
  data: BreakdownDatum[];
  emptyLabel?: string;
  compact?: boolean;
}) {
  if (data.length === 0) {
    return (
      <div className={cn("flex items-center justify-center text-sm text-slate-500", compact ? "h-24" : "h-48")}>
        {emptyLabel}
      </div>
    );
  }

  const total = data.reduce((sum, d) => sum + d.count, 0);
  const config = Object.fromEntries(data.map((d, i) => [d.name, { label: d.name, color: DONUT_PALETTE[i % DONUT_PALETTE.length] }]));

  return (
    <div className={cn("flex flex-col items-center gap-4", !compact && "gap-6 sm:flex-row")}>
      <ChartContainer config={config} className={cn("aspect-square shrink-0", compact ? "h-20 w-20" : "h-40 w-40")}>
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent hideLabel className={tooltipClassName} />} />
          <Pie data={data} dataKey="count" nameKey="name" innerRadius="65%" outerRadius="100%" paddingAngle={2} strokeWidth={0}>
            {data.map((d, i) => (
              <Cell key={d.name} fill={DONUT_PALETTE[i % DONUT_PALETTE.length]} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
      <div className={cn("w-full min-w-0 space-y-2", !compact && "flex-1")}>
        <p className={cn("font-bold text-slate-900", compact ? "text-center text-lg" : "text-2xl")}>
          {total.toLocaleString()} <span className="text-sm font-normal text-slate-500">total</span>
        </p>
        <div className="space-y-1.5">
          {data.map((d, i) => (
            <div key={d.name} className="flex items-center justify-between gap-4 text-sm">
              <span className="flex min-w-0 items-center gap-2 text-slate-500">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: DONUT_PALETTE[i % DONUT_PALETTE.length] }} />
                <span className="truncate">{d.name}</span>
              </span>
              <span className="shrink-0 font-medium text-slate-900">{d.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MeterBar({
  label,
  value,
  max,
  tone = "gold",
}: {
  label: string;
  value: number;
  max: number;
  tone?: "gold" | "teal";
}) {
  const color = tone === "gold" ? GOLD : TEAL;
  const safeMax = max > 0 ? max : Math.max(value, 1);
  const pct = Math.min(100, Math.round((value / safeMax) * 100));

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-sm text-slate-500">{label}</span>
        <span className="text-sm font-semibold text-slate-900">{value.toLocaleString()}</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

const HEAT_MAP_SEVERITY_ROWS = ["Critical", "High", "Moderate", "Low"] as const;
const HEAT_MAP_LIKELIHOOD_COLS = ["Rare", "Unlikely", "Possible", "Likely", "Almost certain"] as const;

// Inherent risk tier per severity/likelihood combination - a standard risk
// matrix convention, not derived from live data. Cell counts (what's
// actually rendered as numbers) always come from the caller; an all-zero
// grid is the honest empty state for an account with no risks yet.
const HEAT_MAP_TIERS = [
  [2, 3, 3, 4, 4],
  [1, 2, 3, 3, 4],
  [1, 1, 2, 3, 3],
  [0, 1, 1, 2, 2],
];

const HEAT_MAP_TIER_CLASSES = [
  "bg-[#eef8f3] text-[#2f6d5c]",
  "bg-[#fdf6e0] text-[#8a6d1f]",
  "bg-[#fbe3bb] text-[#8a5a1f]",
  "bg-[#f6c9a8] text-[#8a3a1f]",
  "bg-[#f3a8a3] text-[#7a1f1f]",
];

export function RiskHeatMap({ counts }: { counts?: number[][] }) {
  const data = counts ?? HEAT_MAP_TIERS.map((row) => row.map(() => 0));

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] border-separate border-spacing-1 text-center">
        <thead>
          <tr>
            <th className="p-2" />
            {HEAT_MAP_LIKELIHOOD_COLS.map((col) => (
              <th key={col} className="p-2 text-xs font-medium text-slate-500">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {HEAT_MAP_SEVERITY_ROWS.map((row, rowIndex) => (
            <tr key={row}>
              <th className="whitespace-nowrap p-2 pr-3 text-right text-xs font-medium text-slate-500">{row}</th>
              {HEAT_MAP_LIKELIHOOD_COLS.map((_, colIndex) => (
                <td
                  key={colIndex}
                  className={cn("rounded-lg p-3 text-sm font-semibold", HEAT_MAP_TIER_CLASSES[HEAT_MAP_TIERS[rowIndex][colIndex]])}
                >
                  {data[rowIndex]?.[colIndex] ?? 0}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export interface ActivityDatum {
  title: string;
  subtitle: string;
  timestamp: string;
}

export function ActivityFeed({
  items,
  emptyLabel = "No activity yet",
}: {
  items: ActivityDatum[];
  emptyLabel?: string;
}) {
  if (items.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-sm text-slate-500">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100">
      {items.map((item, i) => {
        const tone = i % 2 === 0 ? GOLD : TEAL;
        return (
          <div key={`${item.title}-${item.timestamp}`} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: tone }} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-900">{item.title}</p>
              <p className="truncate text-xs text-slate-500">{item.subtitle}</p>
            </div>
            <span className="shrink-0 text-xs text-slate-500">{item.timestamp}</span>
          </div>
        );
      })}
    </div>
  );
}

export function StatCallout({
  label,
  value,
  tone = "gold",
  size = "sm",
  className,
}: {
  label: string;
  value: string | number;
  tone?: "gold" | "teal";
  size?: "sm" | "lg";
  className?: string;
}) {
  const toneClasses =
    tone === "gold"
      ? "border-[#d8b45d]/25 bg-gradient-to-br from-[#fff7df] to-[#f8f0d8]"
      : "border-[#98d8c5]/25 bg-gradient-to-br from-[#eef8f3] to-[#dcf0e8]";

  return (
    <div className={cn("rounded-xl border p-4", toneClasses, size === "lg" && "flex flex-col items-center justify-center py-6 text-center", className)}>
      <p className={cn("font-bold text-slate-900", size === "lg" ? "text-4xl" : "text-2xl")}>{value}</p>
      <p className={cn("text-slate-500", size === "lg" ? "mt-2 text-sm font-medium" : "mt-1 text-sm")}>{label}</p>
    </div>
  );
}

export function TrendBadge({
  label,
  changePercent,
  direction,
  detail,
}: {
  label: string;
  changePercent: number;
  direction: "up" | "down" | "flat";
  detail?: string;
}) {
  const iconBg = direction === "flat" ? "bg-slate-100 text-slate-500" : direction === "up" ? "bg-[#eef8f3] text-[#2f6d5c]" : "bg-[#fff7df] text-[#7a622b]";
  const Icon = direction === "flat" ? Minus : direction === "up" ? ArrowUp : ArrowDown;

  return (
    <div className="flex items-center gap-3">
      <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-full", iconBg)}>
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="text-2xl font-bold text-slate-900">
          {changePercent > 0 ? "+" : ""}
          {changePercent}%
        </p>
        <p className="truncate text-sm text-slate-500">{label}</p>
        {detail && <p className="truncate text-xs text-slate-400">{detail}</p>}
      </div>
    </div>
  );
}

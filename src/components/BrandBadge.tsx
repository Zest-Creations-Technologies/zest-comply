import logoIcon from '@/assets/logo-icon.png';

export function BrandBadge() {
  return (
    <div
      aria-hidden="true"
      className="fixed bottom-4 right-4 z-50 flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-amber-200/30 bg-gradient-to-br from-slate-950 via-slate-900 to-[#153b38] shadow-lg shadow-emerald-950/30"
    >
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_15%,rgba(250,204,21,0.38),transparent_34%),radial-gradient(circle_at_75%_80%,rgba(94,234,212,0.24),transparent_36%)]" />
      <img src={logoIcon} alt="" className="relative h-5 w-5 opacity-95" />
    </div>
  );
}

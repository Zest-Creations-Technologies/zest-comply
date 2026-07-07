import { Link } from 'react-router-dom';
import logoIcon from '@/assets/logo-icon.png';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  linkTo?: string;
  className?: string;
  textClassName?: string;
}

const sizeConfig = {
  sm: { badge: 'h-8 w-8', icon: 'h-5 w-5', text: 'text-base' },
  md: { badge: 'h-10 w-10', icon: 'h-6 w-6', text: 'text-xl' },
  lg: { badge: 'h-14 w-14', icon: 'h-8 w-8', text: 'text-2xl' },
};

export function Logo({ size = 'md', linkTo = '/', className, textClassName }: LogoProps) {
  const { badge, icon, text } = sizeConfig[size];

  const content = (
    <div className={cn('group flex items-center gap-3', className)}>
      <span className={cn('relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-amber-200/30 bg-gradient-to-br from-slate-950 via-slate-900 to-[#153b38] shadow-lg shadow-emerald-950/30', badge)}>
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_15%,rgba(250,204,21,0.38),transparent_34%),radial-gradient(circle_at_75%_80%,rgba(94,234,212,0.24),transparent_36%)]" />
        <img src={logoIcon} alt="" className={cn('relative opacity-95', icon)} />
      </span>
      <span className={cn('flex items-baseline font-semibold tracking-[-0.03em] transition-colors duration-300', text, textClassName)}>
        <span>Zest</span>
        <span className="bg-gradient-to-r from-[#d6b66a] via-[#f7e5ad] to-[#8bd6c2] bg-clip-text text-transparent">Comply</span>
      </span>
    </div>
  );

  if (linkTo) {
    return <Link to={linkTo} aria-label="ZestComply home">{content}</Link>;
  }

  return content;
}

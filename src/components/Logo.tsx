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
  sm: { icon: 'h-8 w-8', text: 'text-sm' },
  md: { icon: 'h-10 w-10', text: 'text-base' },
  lg: { icon: 'h-14 w-14', text: 'text-lg' },
};

export function Logo({ size = 'md', linkTo = '/', className, textClassName }: LogoProps) {
  const { icon, text } = sizeConfig[size];

  const content = (
    <div className={cn('flex items-center gap-1.5 group', className)}>
      <img 
        src={logoIcon} 
        alt="Zest Comply logo" 
        className={cn(icon, 'transition-transform duration-300')} 
      />
      <div className={cn('font-logo font-black tracking-wide transition-colors duration-300 group-hover:text-primary', text, textClassName)}>
        <div className="leading-none">ZEST</div>
        <div className="leading-none mt-px">COMPLY</div>
      </div>
    </div>
  );

  if (linkTo) {
    return <Link to={linkTo}>{content}</Link>;
  }

  return content;
}

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
  sm: { icon: 'h-5 w-5', text: 'text-base' },
  md: { icon: 'h-6 w-6', text: 'text-lg' },
  lg: { icon: 'h-8 w-8', text: 'text-xl' },
};

export function Logo({ size = 'md', linkTo = '/', className, textClassName }: LogoProps) {
  const { icon, text } = sizeConfig[size];

  const content = (
    <div className={cn('flex items-center gap-2 group', className)}>
      <img 
        src={logoIcon} 
        alt="Zest Comply logo" 
        className={cn(icon, 'transition-transform duration-300 group-hover:scale-110')} 
      />
      <div className={cn('font-logo font-bold tracking-wide leading-[0.75]', text, textClassName)}>
        <div className="transition-colors duration-300 group-hover:text-primary">ZEST</div>
        <div>COMPLY</div>
      </div>
    </div>
  );

  if (linkTo) {
    return <Link to={linkTo}>{content}</Link>;
  }

  return content;
}

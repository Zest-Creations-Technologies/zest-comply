import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Loader2, RefreshCw } from 'lucide-react';
import { checkApiHealth, type HealthStatus } from '@/lib/api/health';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ApiHealthIndicatorProps {
  className?: string;
  showLabel?: boolean;
}

export function ApiHealthIndicator({ className, showLabel = true }: ApiHealthIndicatorProps) {
  const [health, setHealth] = useState<HealthStatus>({ status: 'checking' });

  const runHealthCheck = async () => {
    setHealth({ status: 'checking' });
    const result = await checkApiHealth();
    setHealth(result);
  };

  useEffect(() => {
    runHealthCheck();
    
    // Check every 30 seconds
    const interval = setInterval(runHealthCheck, 30000);
    return () => clearInterval(interval);
  }, []);

  const statusConfig = {
    connected: {
      icon: CheckCircle2,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
      label: 'API Connected',
    },
    disconnected: {
      icon: XCircle,
      color: 'text-destructive',
      bg: 'bg-destructive/10',
      label: 'API Disconnected',
    },
    checking: {
      icon: Loader2,
      color: 'text-muted-foreground',
      bg: 'bg-muted',
      label: 'Checking...',
    },
  };

  const config = statusConfig[health.status];
  const Icon = config.icon;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn('flex items-center gap-2', className)}>
            <div className={cn('flex items-center gap-1.5 px-2 py-1 rounded-full', config.bg)}>
              <Icon 
                className={cn(
                  'h-3.5 w-3.5',
                  config.color,
                  health.status === 'checking' && 'animate-spin'
                )} 
              />
              {showLabel && (
                <span className={cn('text-xs font-medium', config.color)}>
                  {config.label}
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={runHealthCheck}
              disabled={health.status === 'checking'}
            >
              <RefreshCw className={cn(
                'h-3 w-3',
                health.status === 'checking' && 'animate-spin'
              )} />
            </Button>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-xs space-y-1">
            <p className="font-medium">{config.label}</p>
            {health.latency !== undefined && (
              <p className="text-muted-foreground">Latency: {health.latency}ms</p>
            )}
            {health.error && (
              <p className="text-destructive">{health.error}</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

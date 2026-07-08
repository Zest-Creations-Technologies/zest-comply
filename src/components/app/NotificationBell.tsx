import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bell } from 'lucide-react';
import { telemetryApi, type TelemetryEvent, type TelemetryEventType } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';

const LAST_SEEN_KEY = 'notifications:last_seen_at';

const EVENT_LABELS: Record<TelemetryEventType, string> = {
  login_success: 'Signed in',
  login_failure: 'Failed sign-in attempt',
  document_generated: 'Document generated',
  evidence_uploaded: 'Evidence uploaded',
  evidence_status_changed: 'Evidence status changed',
  evidence_expired: 'Evidence expired',
  api_error: 'Something went wrong',
  copilot_query: 'Copilot query',
};

function timeAgo(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function describeEvent(event: TelemetryEvent): string {
  return event.message || EVENT_LABELS[event.event_type] || event.event_type;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [lastSeenAt, setLastSeenAt] = useState<string | null>(() =>
    localStorage.getItem(LAST_SEEN_KEY),
  );

  const eventsQuery = useQuery({
    queryKey: ['notifications', 'mine'],
    queryFn: () => telemetryApi.listMyEvents(20),
    refetchInterval: 60000,
  });

  const events = eventsQuery.data?.events ?? [];
  const unreadCount = lastSeenAt
    ? events.filter((event) => event.created_at > lastSeenAt).length
    : events.length;

  useEffect(() => {
    if (!open || events.length === 0) return;
    const newest = events[0].created_at;
    localStorage.setItem(LAST_SEEN_KEY, newest);
    setLastSeenAt(newest);
  }, [open, events]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-slate-900">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] leading-none"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="border-b border-border px-4 py-3">
          <p className="text-sm font-medium text-foreground">Notifications</p>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {eventsQuery.isLoading && (
            <div className="space-y-3 p-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          )}
          {!eventsQuery.isLoading && events.length === 0 && (
            <p className="p-4 text-sm text-muted-foreground">No recent activity.</p>
          )}
          {!eventsQuery.isLoading &&
            events.map((event) => (
              <div
                key={event.id}
                className="border-b border-border px-4 py-3 last:border-0 hover:bg-accent"
              >
                <p className="text-sm text-foreground">{describeEvent(event)}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{timeAgo(event.created_at)}</p>
              </div>
            ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

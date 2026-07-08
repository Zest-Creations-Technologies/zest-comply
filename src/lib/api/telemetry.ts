// Telemetry / activity log API client (staff-facing)

import { apiClient } from './client';
import { getApiUrl } from './config';

export type TelemetryEventType =
  | 'login_success'
  | 'login_failure'
  | 'document_generated'
  | 'evidence_uploaded'
  | 'evidence_status_changed'
  | 'evidence_expired'
  | 'api_error'
  | 'copilot_query';

export interface TelemetryEvent {
  id: string;
  user_id: string | null;
  event_type: TelemetryEventType;
  message: string | null;
  metadata_json: Record<string, unknown>;
  created_at: string;
}

export interface TelemetryEventListResponse {
  events: TelemetryEvent[];
  total: number;
}

export interface TelemetryEventFilters {
  event_type?: TelemetryEventType;
  user_id?: string;
  since?: string;
  limit?: number;
  offset?: number;
}

function buildQuery(filters: TelemetryEventFilters): string {
  const params = new URLSearchParams();
  if (filters.event_type) params.set('event_type', filters.event_type);
  if (filters.user_id) params.set('user_id', filters.user_id);
  if (filters.since) params.set('since', filters.since);
  if (filters.limit !== undefined) params.set('limit', String(filters.limit));
  if (filters.offset !== undefined) params.set('offset', String(filters.offset));
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export const telemetryApi = {
  async listEvents(filters: TelemetryEventFilters = {}): Promise<TelemetryEventListResponse> {
    return apiClient.get<TelemetryEventListResponse>(`/telemetry/events${buildQuery(filters)}`);
  },

  // Any authenticated user can call this (unlike listEvents, which is
  // staff-only) - it's force-scoped server-side to the caller's own events.
  async listMyEvents(limit = 20): Promise<TelemetryEventListResponse> {
    return apiClient.get<TelemetryEventListResponse>(`/telemetry/events/mine?limit=${limit}`);
  },

  // Auth headers can't be set on a plain <a href> download, so fetch the CSV
  // as a blob with the token attached and trigger the download client-side.
  async downloadEventsCsv(filters: Omit<TelemetryEventFilters, 'limit' | 'offset'> = {}): Promise<void> {
    const token = localStorage.getItem('access_token');
    const response = await fetch(getApiUrl(`/telemetry/events/export${buildQuery(filters)}`), {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!response.ok) {
      throw new Error('Failed to download activity log');
    }

    const blob = await response.blob();
    const disposition = response.headers.get('Content-Disposition') ?? '';
    const match = disposition.match(/filename="?([^"]+)"?/);
    const filename = match?.[1] ?? 'activity-log.csv';

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  },
};

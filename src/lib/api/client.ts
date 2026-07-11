// API Client - cookie-based auth (httpOnly access/refresh cookies set by
// the backend on login/refresh/etc., see zct-backend app/core/cookies.py).
// No tokens are ever stored in JS-accessible storage; the browser attaches
// the auth cookies automatically on every request via `credentials: 'include'`.

import { API_CONFIG, getApiUrl } from './config';
import type { ApiError } from './types';

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

const CSRF_COOKIE_NAME = 'zc_csrf_token';
const CSRF_HEADER_NAME = 'X-CSRF-Token';
const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

function getCsrfToken(): string | null {
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${CSRF_COOKIE_NAME}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) : null;
}

class ApiClient {
  private async refreshAccessToken(): Promise<boolean> {
    try {
      const response = await fetch(getApiUrl('/auth/refresh'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({}),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { skipAuth = false, ...fetchOptions } = options;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(fetchOptions.headers as Record<string, string>),
    };

    const method = (fetchOptions.method ?? 'GET').toUpperCase();
    if (!skipAuth && MUTATING_METHODS.has(method)) {
      const csrfToken = getCsrfToken();
      if (csrfToken) {
        headers[CSRF_HEADER_NAME] = csrfToken;
      }
    }

    const url = getApiUrl(path);

    const controller = fetchOptions.signal ? null : new AbortController();
    const signal = fetchOptions.signal ?? controller?.signal;
    const timeoutMs = API_CONFIG.timeout ?? 30000;
    const timeoutId = controller ? window.setTimeout(() => controller.abort(), timeoutMs) : null;

    try {
      let response = await fetch(url, {
        ...fetchOptions,
        headers,
        credentials: 'include',
        signal,
      });

      // Handle 401 - try to refresh the session cookie
      if (response.status === 401 && !skipAuth) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          if (MUTATING_METHODS.has(method)) {
            const csrfToken = getCsrfToken();
            if (csrfToken) headers[CSRF_HEADER_NAME] = csrfToken;
          }
          response = await fetch(url, {
            ...fetchOptions,
            headers,
            credentials: 'include',
            signal,
          });
        } else {
          window.dispatchEvent(new CustomEvent('auth:logout'));
          throw new Error('Session expired. Please log in again.');
        }
      }

      if (!response.ok) {
        const error: ApiError = await response.json().catch(() => ({
          detail: 'An unexpected error occurred',
          status_code: response.status,
        }));
        // Create error with additional properties for plan restrictions
        const err = new Error(error.detail || error.message || 'An unexpected error occurred') as Error & {
          status?: number;
          details?: Record<string, unknown>;
        };
        err.status = response.status;
        if (error.details) {
          err.details = error.details as Record<string, unknown>;
        }
        throw err;
      }

      // Handle empty responses
      const text = await response.text();
      if (!text) return {} as T;

      return JSON.parse(text);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        throw new Error('Request timed out. Please try again.');
      }
      throw err;
    } finally {
      if (timeoutId) window.clearTimeout(timeoutId);
    }
  }

  get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: 'GET' });
  }

  post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: 'DELETE' });
  }

  /**
   * Upload FormData (for file uploads)
   * Does NOT set Content-Type header - browser sets it with boundary
   */
  async uploadFormData<T>(path: string, formData: FormData, options?: RequestOptions): Promise<T> {
    const { skipAuth = false, ...fetchOptions } = options || {};

    const headers: Record<string, string> = {};
    if (!skipAuth) {
      const csrfToken = getCsrfToken();
      if (csrfToken) headers[CSRF_HEADER_NAME] = csrfToken;
    }

    const url = getApiUrl(path);

    const controller = new AbortController();
    const timeoutMs = API_CONFIG.timeout ?? 60000; // Longer timeout for uploads
    const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

    try {
      let response = await fetch(url, {
        ...fetchOptions,
        method: 'POST',
        headers,
        body: formData,
        credentials: 'include',
        signal: controller.signal,
      });

      // Handle 401 - try to refresh the session cookie
      if (response.status === 401 && !skipAuth) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          const csrfToken = getCsrfToken();
          if (csrfToken) headers[CSRF_HEADER_NAME] = csrfToken;
          response = await fetch(url, {
            ...fetchOptions,
            method: 'POST',
            headers,
            body: formData,
            credentials: 'include',
            signal: controller.signal,
          });
        } else {
          window.dispatchEvent(new CustomEvent('auth:logout'));
          throw new Error('Session expired. Please log in again.');
        }
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          detail: 'An unexpected error occurred',
          status_code: response.status,
        }));
        // Create error with additional properties for plan restrictions
        const err = new Error(error.detail || error.message || 'An unexpected error occurred') as Error & {
          status?: number;
          details?: Record<string, unknown>;
        };
        err.status = response.status;
        if (error.details) {
          err.details = error.details as Record<string, unknown>;
        }
        throw err;
      }

      const text = await response.text();
      if (!text) return {} as T;
      return JSON.parse(text);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        throw new Error('Upload timed out. Please try again.');
      }
      throw err;
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  /**
   * Whether a session cookie appears to be present. This is a client-side
   * signal only (the CSRF cookie is the one non-httpOnly cookie set
   * alongside the real auth cookies, so its presence is a reasonable
   * proxy) - it is NOT authoritative. The real check is always whatever
   * the API says on the next request; AuthContext calls GET /auth/me on
   * mount and treats a 401 there as "not authenticated" regardless of
   * what this returns.
   */
  hasSession(): boolean {
    return getCsrfToken() !== null;
  }
}

export const apiClient = new ApiClient();

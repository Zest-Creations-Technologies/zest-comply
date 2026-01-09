// API Client with token handling

import { API_CONFIG, getApiUrl } from './config';
import { tokenStorage } from './tokenStorage';
import type { ApiError } from './types';

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

class ApiClient {
  private getAccessToken(): string | null {
    return tokenStorage.getAccessToken();
  }

  private getRefreshToken(): string | null {
    return tokenStorage.getRefreshToken();
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    tokenStorage.setTokens(accessToken, refreshToken);
  }

  private clearTokens(): void {
    tokenStorage.clearTokens();
  }

  private async refreshAccessToken(): Promise<boolean> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const response = await fetch(getApiUrl('/auth/refresh'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        this.clearTokens();
        return false;
      }

      const data = await response.json();
      this.setTokens(data.access_token, data.refresh_token);
      return true;
    } catch {
      this.clearTokens();
      return false;
    }
  }

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { skipAuth = false, ...fetchOptions } = options;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(fetchOptions.headers as Record<string, string>),
    };

    if (!skipAuth) {
      const token = this.getAccessToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const url = getApiUrl(path);

    const controller = fetchOptions.signal ? null : new AbortController();
    const signal = fetchOptions.signal ?? controller?.signal;
    const timeoutMs = API_CONFIG.timeout ?? 30000;
    const timeoutId = controller ? window.setTimeout(() => controller.abort(), timeoutMs) : null;

    try {
      let response = await fetch(url, { ...fetchOptions, headers, signal });

      // Handle 401 - try to refresh token
      if (response.status === 401 && !skipAuth) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          headers['Authorization'] = `Bearer ${this.getAccessToken()}`;
          response = await fetch(url, { ...fetchOptions, headers, signal });
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
        throw new Error(error.detail);
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

  // Token management exposed for auth
  saveTokens(accessToken: string, refreshToken: string): void {
    this.setTokens(accessToken, refreshToken);
  }

  removeTokens(): void {
    this.clearTokens();
  }

  hasTokens(): boolean {
    return !!this.getAccessToken();
  }
}

export const apiClient = new ApiClient();

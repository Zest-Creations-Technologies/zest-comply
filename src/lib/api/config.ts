// API Configuration

export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_URL || '',
  useMocks: !import.meta.env.VITE_API_URL,
  timeout: 30000,
};

export const getApiUrl = (path: string): string => {
  if (API_CONFIG.useMocks) {
    return path;
  }
  return `${API_CONFIG.baseUrl}${path}`;
};

export const getWebSocketUrl = (): string => {
  if (API_CONFIG.useMocks) {
    return 'ws://localhost:8000/ws';
  }
  const wsUrl = API_CONFIG.baseUrl.replace(/^http/, 'ws');
  return `${wsUrl}/ws`;
};

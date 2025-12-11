// API Configuration

const API_BASE_URL = 'https://zct.onrender.com/v1';

export const API_CONFIG = {
  baseUrl: API_BASE_URL,
  useMocks: false,
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

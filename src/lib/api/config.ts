// API Configuration

// Fail loudly instead of silently falling back to a guessed host - a
// missing VITE_API_URL previously defaulted to an unresolvable dev
// subdomain and broke every API call on production with no build-time
// warning. .env.local (dev) and .env.production (prod) both set this;
// reaching this branch means one of those is missing or wasn't loaded.
const API_BASE_URL = import.meta.env.VITE_API_URL as string | undefined;
if (!API_BASE_URL) {
  throw new Error(
    "VITE_API_URL is not set. Check .env.local (dev) or .env.production (prod) - the app cannot reach the backend without it."
  );
}

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
    return "ws://localhost:8000/ws/agent";
  }
  const wsUrl = API_CONFIG.baseUrl.replace(/^http/, "ws");
  return `${wsUrl}/ws/agent`;
};

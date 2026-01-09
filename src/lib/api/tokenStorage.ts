// Secure token storage with basic obfuscation
// Note: For production, consider httpOnly cookies (requires backend changes)

const STORAGE_PREFIX = 'zc_';
const ACCESS_TOKEN_KEY = `${STORAGE_PREFIX}at`;
const REFRESH_TOKEN_KEY = `${STORAGE_PREFIX}rt`;

// Simple XOR-based obfuscation (not true encryption, but adds a layer of protection)
// For true security, use httpOnly cookies with backend support
const obfuscationKey = 'zestcomply2024';

function obfuscate(value: string): string {
  let result = '';
  for (let i = 0; i < value.length; i++) {
    result += String.fromCharCode(
      value.charCodeAt(i) ^ obfuscationKey.charCodeAt(i % obfuscationKey.length)
    );
  }
  return btoa(result);
}

function deobfuscate(value: string): string {
  try {
    const decoded = atob(value);
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      result += String.fromCharCode(
        decoded.charCodeAt(i) ^ obfuscationKey.charCodeAt(i % obfuscationKey.length)
      );
    }
    return result;
  } catch {
    return '';
  }
}

export const tokenStorage = {
  getAccessToken(): string | null {
    const stored = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!stored) {
      // Migration: check for old key format
      const legacy = localStorage.getItem('access_token');
      if (legacy) {
        this.setAccessToken(legacy);
        localStorage.removeItem('access_token');
        return legacy;
      }
      return null;
    }
    return deobfuscate(stored);
  },

  getRefreshToken(): string | null {
    const stored = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!stored) {
      // Migration: check for old key format
      const legacy = localStorage.getItem('refresh_token');
      if (legacy) {
        this.setRefreshToken(legacy);
        localStorage.removeItem('refresh_token');
        return legacy;
      }
      return null;
    }
    return deobfuscate(stored);
  },

  setAccessToken(token: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, obfuscate(token));
  },

  setRefreshToken(token: string): void {
    localStorage.setItem(REFRESH_TOKEN_KEY, obfuscate(token));
  },

  setTokens(accessToken: string, refreshToken: string): void {
    this.setAccessToken(accessToken);
    this.setRefreshToken(refreshToken);
  },

  clearTokens(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    // Also clear legacy keys if present
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  hasTokens(): boolean {
    return !!this.getAccessToken();
  },
};

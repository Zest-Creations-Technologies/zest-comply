// API Health Check

import { API_CONFIG, getApiUrl } from './config';

export interface HealthStatus {
  status: 'connected' | 'disconnected' | 'checking';
  latency?: number;
  error?: string;
}

export async function checkApiHealth(): Promise<HealthStatus> {
  const startTime = performance.now();
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(getApiUrl('/health'), {
      method: 'GET',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    const latency = Math.round(performance.now() - startTime);
    
    if (response.ok) {
      return { status: 'connected', latency };
    } else {
      return { 
        status: 'disconnected', 
        latency,
        error: `HTTP ${response.status}` 
      };
    }
  } catch (err) {
    const latency = Math.round(performance.now() - startTime);
    
    if (err instanceof DOMException && err.name === 'AbortError') {
      return { status: 'disconnected', latency, error: 'Request timed out' };
    }
    
    return { 
      status: 'disconnected', 
      latency,
      error: err instanceof Error ? err.message : 'Connection failed' 
    };
  }
}

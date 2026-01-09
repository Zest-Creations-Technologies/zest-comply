// WebSocket message validation utilities
import { z } from 'zod';

// Outgoing message schema - validates messages to the server
export const wsOutgoingMessageSchema = z.object({
  text: z.string().max(10000).optional(),
  action: z.string().max(100).optional(),
  selected_documents: z.array(z.string().max(500)).max(100).optional(),
});

export type WsOutgoingMessage = z.infer<typeof wsOutgoingMessageSchema>;

// Type for incoming messages - uses any for payload to maintain compatibility
// with existing code that accesses dynamic payload properties
export interface WsIncomingMessage {
  event_type: string;
  session_id?: string;
  timestamp?: string;
  payload?: Record<string, any>;
  text?: string;
  data?: any;
  [key: string]: any;
}

// Safely parse incoming WebSocket messages with basic security validation
export function parseWsMessage(data: string): WsIncomingMessage | null {
  // Validate message size to prevent DoS (1MB limit)
  if (data.length > 1000000) {
    console.warn('WebSocket message too large, rejecting');
    return null;
  }

  try {
    const parsed = JSON.parse(data);
    
    // Basic structure validation - must be an object
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      console.warn('WebSocket message is not a valid object');
      return null;
    }
    
    // Must have event_type string
    if (typeof parsed.event_type !== 'string') {
      console.warn('WebSocket message missing or invalid event_type');
      return null;
    }
    
    // Validate event_type length to prevent abuse
    if (parsed.event_type.length > 100) {
      console.warn('WebSocket event_type too long');
      return null;
    }
    
    return parsed as WsIncomingMessage;
  } catch (error) {
    console.error('Failed to parse WebSocket message:', error);
    return null;
  }
}

// Sanitize and validate outgoing messages
export function sanitizeOutgoingMessage(message: WsOutgoingMessage): string | null {
  const result = wsOutgoingMessageSchema.safeParse(message);
  if (!result.success) {
    console.error('Invalid outgoing message:', result.error.errors);
    return null;
  }
  return JSON.stringify(result.data);
}

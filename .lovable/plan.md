

# Fix WebSocket Connection Leak on New Session

## Problem Summary

When clicking "New Session" on the assistant page, the WebSocket connection from the current chat session leaks into the new session. This happens because:

1. There is no mechanism to distinguish between an intentional close (user clicked "New Session") vs. an unexpected disconnect
2. The `onclose` handler automatically triggers reconnection for non-1000 close codes
3. When `startNewConversation` is called, it closes the old WebSocket, but if it closes with code 1005 (common browser behavior), the reconnection logic kicks in using stale session data from the closure
4. This creates a race condition where both old and new WebSocket connections can be active simultaneously

## Solution

Add an `intentionalClose` ref that prevents reconnection when the user explicitly switches sessions or starts a new conversation.

## Implementation Steps

### Step 1: Add Intentional Close Ref

Add a new ref to track whether a WebSocket close was intentional:

```typescript
// Near other refs (around line 233)
const intentionalCloseRef = useRef(false);
```

### Step 2: Update onclose Handler

Modify the WebSocket `onclose` handler to check if the close was intentional before attempting reconnection:

```typescript
// In ws.onclose handler (around line 699-722)
ws.onclose = (event) => {
  console.log('WebSocket closed:', event.code, event.reason);
  setIsConnected(false);
  
  // Skip reconnection if this was an intentional close
  if (intentionalCloseRef.current) {
    console.log('WebSocket closed intentionally, skipping reconnection');
    intentionalCloseRef.current = false; // Reset for future connections
    return;
  }
  
  if (event.code === 1008) {
    // Authentication error - existing logic
    ...
  } else if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
    // Reconnection logic - only if not intentional
    ...
  }
};
```

### Step 3: Create Cleanup Helper Function

Create a dedicated function to properly close the WebSocket:

```typescript
// Add after connectWebSocket (around line 735)
const closeWebSocket = useCallback(() => {
  if (wsRef.current) {
    intentionalCloseRef.current = true;
    wsRef.current.close(1000, 'User initiated close');
    wsRef.current = null;
  }
  reconnectAttemptsRef.current = 0;
}, []);
```

### Step 4: Update Session Switching Functions

Update all places that close the WebSocket to use the new cleanup helper:

**startNewConversation:**
```typescript
const startNewConversation = useCallback(() => {
  setView('chat');
  setIsLoading(true);
  setMessages([]);
  setSessionId(null);
  // ... other resets
  
  // Use cleanup helper instead of direct close
  closeWebSocket();
  
  if (API_CONFIG.useMocks) {
    // mock logic
  } else {
    connectWebSocket();
  }
}, [closeWebSocket, connectWebSocket, setSearchParams]);
```

**openConversation:**
```typescript
const openConversation = useCallback(async (conversationId: string) => {
  setView('chat');
  setIsLoading(true);
  // ... other setup
  
  // Use cleanup helper instead of direct close
  closeWebSocket();
  
  try {
    // ... fetch and connect logic
  } catch (error) {
    // ... error handling
  }
}, [closeWebSocket, connectWebSocket, toast]);
```

**goBackToList:**
```typescript
const goBackToList = () => {
  closeWebSocket();
  setView('list');
  setMessages([]);
  setSessionId(null);
  setSearchParams({});
  loadConversations();
};
```

### Step 5: Update Unmount Cleanup

Update the unmount effect to use the cleanup helper:

```typescript
// Cleanup on unmount (around line 990-995)
useEffect(() => {
  return () => {
    closeWebSocket();
  };
}, [closeWebSocket]);
```

## Files to Modify

| File | Changes |
|------|---------|
| `src/pages/app/AssistantPage.tsx` | Add `intentionalCloseRef`, create `closeWebSocket` helper, update all WebSocket close operations, modify `onclose` handler |

## Technical Details

### Race Condition Prevention

The `intentionalCloseRef` acts as a synchronization mechanism:
- It's set to `true` immediately before calling `close()`
- The `onclose` handler checks this flag and skips reconnection if set
- The flag is reset to `false` after being checked to allow future reconnections

### Close Code Usage

Using `close(1000, 'User initiated close')` sends a "normal closure" code, which:
- Signals to the server that this is a clean shutdown
- Provides additional protection (the handler already skips code 1000)
- Follows WebSocket best practices

### Reconnect Counter Reset

Resetting `reconnectAttemptsRef.current = 0` in `closeWebSocket` ensures:
- Fresh reconnection attempts for the new session if needed
- No carry-over of failed attempts from previous sessions


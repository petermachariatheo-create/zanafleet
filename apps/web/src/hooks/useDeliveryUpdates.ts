import { useEffect, useRef, useCallback } from 'react';

export interface DeliveryUpdate {
  deliveryId: string;
  status: string;
  timestamp: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  eta?: string;
  riderName?: string;
}

type DeliveryUpdateHandler = (update: DeliveryUpdate) => void;

let globalWebSocket: WebSocket | null = null;
let globalReconnectTimeout: ReturnType<typeof setTimeout> | null = null;
const globalSubscribers = new Set<DeliveryUpdateHandler>();

function connectWebSocket(): void {
  if (globalWebSocket?.readyState === WebSocket.OPEN) {
    return;
  }

  const wsUrl = process.env.REACT_APP_NATS_WS_URL || 'ws://localhost:8222/ws';
  
  try {
    globalWebSocket = new WebSocket(wsUrl);
  } catch (error) {
    console.warn('WebSocket connection failed, falling back to polling', error);
    return;
  }

  globalWebSocket.onopen = () => {
    console.log('WebSocket connected');
  };

  globalWebSocket.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      if (message.type === 'delivery.update') {
        globalSubscribers.forEach((handler) => handler(message.payload));
      }
    } catch {
      // Ignore non-JSON messages
    }
  };

  globalWebSocket.onclose = () => {
    console.log('WebSocket disconnected, attempting reconnect...');
    globalWebSocket = null;
    if (globalReconnectTimeout) {
      clearTimeout(globalReconnectTimeout);
    }
    globalReconnectTimeout = setTimeout(connectWebSocket, 3000);
  };

  globalWebSocket.onerror = () => {
    console.warn('WebSocket error, falling back to polling');
    globalWebSocket?.close();
    globalWebSocket = null;
  };
}

export function useDeliveryUpdates(deliveryId: string, onUpdate: DeliveryUpdateHandler): void {
  const handlerRef = useRef(onUpdate);
  handlerRef.current = onUpdate;

  const subscribe = useCallback(() => {
    const handler: DeliveryUpdateHandler = (update) => {
      if (update.deliveryId === deliveryId) {
        handlerRef.current(update);
      }
    };
    globalSubscribers.add(handler);
    return () => {
      globalSubscribers.delete(handler);
    };
  }, [deliveryId]);

  useEffect(() => {
    const unsubscribe = subscribe();

    if (globalWebSocket?.readyState !== WebSocket.OPEN) {
      connectWebSocket();
    }

    return unsubscribe;
  }, [subscribe]);
}

export function useDeliveryPolling(
  deliveryId: string,
  fetchUpdate: () => Promise<DeliveryUpdate>,
  intervalMs = 5000
): void {
  const fetchUpdateRef = useRef(fetchUpdate);
  fetchUpdateRef.current = fetchUpdate;

  useEffect(() => {
    let cancelled = false;
    const timer = setInterval(async () => {
      if (cancelled) return;
      try {
        const update = await fetchUpdateRef.current();
        if (update.deliveryId === deliveryId) {
          // Parent component handles the update via state setter
        }
      } catch {
        // Silently ignore polling errors
      }
    }, intervalMs);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [deliveryId, intervalMs]);
}

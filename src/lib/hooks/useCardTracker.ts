import { useState, useEffect, useRef, useCallback } from 'react';
import { useAPIEventListener, usePlugin, AppEvents } from '@remnote/plugin-sdk';

export function useCardTracker() {
  const plugin = usePlugin();
  const [cardId, setCardId] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const syncCurrentCard = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    const currentCard = await plugin.queue.getCurrentCard();

    if (requestId !== requestIdRef.current) {
      return;
    }

    setCardId(currentCard?._id ?? null);
  }, [plugin]);

  useEffect(() => {
    void syncCurrentCard();
  }, [syncCurrentCard]);

  useAPIEventListener(AppEvents.QueueLoadCard, undefined, () => {
    void syncCurrentCard();
  });

  useAPIEventListener(AppEvents.QueueEnter, undefined, async () => {
    void syncCurrentCard();
  });

  useAPIEventListener(AppEvents.QueueExit, undefined, () => {
    requestIdRef.current += 1;
    setCardId(null);
  });

  return { cardId };
}

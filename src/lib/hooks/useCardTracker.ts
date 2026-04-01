import { useState, useEffect, useRef } from 'react';
import { useAPIEventListener, usePlugin, AppEvents, WidgetLocation } from '@remnote/plugin-sdk';

export function useCardTracker() {
  const plugin = usePlugin();
  const [cardId, setCardId] = useState<string | null>(null);
  const cardIdRef = useRef<string | null>(null);

  // Keep ref in sync to avoid stale closures in event listeners
  useEffect(() => {
    cardIdRef.current = cardId;
  }, [cardId]);

  // Initial fetch
  useEffect(() => {
    async function fetchInitial() {
      const ctx = await plugin.widget.getWidgetContext<WidgetLocation.QueueBelowTopBar>();
      if (ctx?.cardId) {
        setCardId(ctx.cardId);
      }
    }
    fetchInitial();
  }, [plugin]);

  // When a card is completed, wait slightly for the queue to transition to the next card
  useAPIEventListener(AppEvents.QueueCompleteCard, undefined, async () => {
    setTimeout(async () => {
      const oldCardIdInEvent = cardIdRef.current;
      const ctx = await plugin.widget.getWidgetContext<WidgetLocation.QueueBelowTopBar>();
      if (ctx?.cardId !== oldCardIdInEvent) {
        setCardId(ctx?.cardId ?? null);
      } else if (!ctx?.cardId && oldCardIdInEvent) {
        setCardId(null);
      }
    }, 150);
  });

  // Handle entering and exiting the queue
  useAPIEventListener(AppEvents.QueueEnter, undefined, async () => {
    const ctx = await plugin.widget.getWidgetContext<WidgetLocation.QueueBelowTopBar>();
    setCardId(ctx?.cardId ?? null);
  });

  useAPIEventListener(AppEvents.QueueExit, undefined, () => {
    setCardId(null);
  });

  return { cardId };
}

import { useEffect, useRef } from 'react';
import { usePlugin } from '@remnote/plugin-sdk';
import { useSessionStats } from './useSessionStats';

/**
 * Monitors the cardId for transitions into 'null' (end of queue).
 * Shows a summary toast with the session performance and resets stats.
 */
export function useSessionSummary(cardId: string | null, enabled: boolean) {
  const plugin = usePlugin();
  const stats = useSessionStats();
  const prevCardId = useRef<string | null>(null);

  useEffect(() => {
    // Session Detection:
    // If we transition to null and were previously on a card, the session has (likely) ended.
    if (enabled && cardId === null && prevCardId.current !== null) {
      const total = stats.autoAnsweredCount + stats.skippedCount;
      if (total > 0) {
        plugin.app.toast(
          `⚡ Speed Summary: ${stats.autoAnsweredCount} answered | ⏭️ ${stats.skippedCount} skipped`
        );
        // We delay the reset slightly to ensure the UI has finished any current transitions.
        setTimeout(() => stats.resetStats(), 100);
      }
    }

    // Resetting for a NEW session:
    // If we were null and now have a cardId, ensure the stats are fresh if they weren't reset.
    if (enabled && cardId !== null && prevCardId.current === null) {
        // Optional: Auto-reset stats if they were left over from a previous unfinished session?
        // For now, we rely on the end-of-session reset.
    }

    prevCardId.current = cardId;
  }, [cardId, enabled, stats.autoAnsweredCount, stats.skippedCount, plugin]);
}

import { useSessionStorageState } from '@remnote/plugin-sdk';

export function useSessionStats() {
  const [autoAnsweredCount, setAutoAnsweredCount] = useSessionStorageState<number>('stats-auto-answered', 0);
  const [skippedCount, setSkippedCount] = useSessionStorageState<number>('stats-skipped', 0);

  return { autoAnsweredCount, skippedCount, setAutoAnsweredCount, setSkippedCount };
}

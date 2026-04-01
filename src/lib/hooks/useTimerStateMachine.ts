import React, { useState, useEffect } from 'react';
import { QueueInteractionScore, usePlugin } from '@remnote/plugin-sdk';
import { QueueSettings } from './useQueueSettings';
import { useSessionStats } from './useSessionStats';
import type { AlarmPlaybackResult } from './useAlarmAudio';

const VISUAL_ALARM_DURATION_MS = 1500;
let hasShownAudioFallbackToast = false;

export function useTimerStateMachine(
  cardId: string | null,
  alarmDelaySec: number,
  isAlarmDelayResolved: boolean,
  settings: {
    alarm: QueueSettings['alarm'];
    auto: QueueSettings['auto'];
  },
  playAlarm: () => Promise<AlarmPlaybackResult>
) {
  const plugin = usePlugin();
  const [startTime, setStartTime] = useState<number | null>(null);
  const [visualAlarmUntil, setVisualAlarmUntil] = useState<number | null>(null);
  const { autoAnsweredCount, setAutoAnsweredCount, skippedCount, setSkippedCount } = useSessionStats();
  const pluginRef = React.useRef(plugin);
  const playAlarmRef = React.useRef(playAlarm);
  // Track latest counts in refs so setTimeout closures don't go stale
  const autoAnsweredCountRef = React.useRef(autoAnsweredCount);
  const skippedCountRef = React.useRef(skippedCount);
  const setAutoAnsweredCountRef = React.useRef(setAutoAnsweredCount);
  const setSkippedCountRef = React.useRef(setSkippedCount);
  React.useEffect(() => { pluginRef.current = plugin; }, [plugin]);
  React.useEffect(() => { playAlarmRef.current = playAlarm; }, [playAlarm]);
  React.useEffect(() => { autoAnsweredCountRef.current = autoAnsweredCount; }, [autoAnsweredCount]);
  React.useEffect(() => { skippedCountRef.current = skippedCount; }, [skippedCount]);
  React.useEffect(() => { setAutoAnsweredCountRef.current = setAutoAnsweredCount; }, [setAutoAnsweredCount]);
  React.useEffect(() => { setSkippedCountRef.current = setSkippedCount; }, [setSkippedCount]);

  const triggerAlarmRef = React.useRef(async () => {
    const now = Date.now();
    setVisualAlarmUntil(now + VISUAL_ALARM_DURATION_MS);

    const result = await playAlarmRef.current();
    if (!result.played && result.reason !== 'disabled' && !hasShownAudioFallbackToast) {
      hasShownAudioFallbackToast = true;
      void pluginRef.current.app.toast('Enhanced Speed Queue: audio playback is blocked here, using visual alarm fallback.');
    }
  });

  // Reset timer start point when card changes
  useEffect(() => {
    let cancelled = false;

    if (cardId) {
      const nextStartTime = Date.now();
      pluginRef.current.queue.inLookbackMode().then((lookback) => {
        if (cancelled) return;
        if (lookback) {
          setStartTime(null);
          setVisualAlarmUntil(null);
          return; // Don't start timer in lookback/review mode
        }
        setStartTime(nextStartTime);
        setVisualAlarmUntil(null);
      });
    } else {
      setStartTime(null);
      setVisualAlarmUntil(null);
    }

    return () => {
      cancelled = true;
    };
  }, [cardId]);

  // Handle specific timed triggers using exact setTimeouts
  useEffect(() => {
    if (!cardId || !startTime || !isAlarmDelayResolved) return;

    // This effect must depend only on stable scalar timing inputs.
    // The bar rerenders every animation frame for progress updates; if runtime
    // objects or callback identities are added here, the effect can resubscribe
    // after the deadline has passed and repeatedly fire "immediate" alarms.
    const timers: ReturnType<typeof setTimeout>[] = [];
    const intervals: ReturnType<typeof setInterval>[] = [];
    const alarmTriggerTimeMs = alarmDelaySec * 1000;
    const showAnswerTriggerTimeMs = (alarmDelaySec + settings.auto.additiveShowAnswerDelaySec) * 1000;
    const autoAnswerTriggerTimeMs = (alarmDelaySec + settings.auto.additiveShowAnswerDelaySec + settings.auto.additiveAutoAnswerDelaySec) * 1000;

    // Timer 1: Initial alarm
    const alarmDelay = Math.max(0, alarmTriggerTimeMs - (Date.now() - startTime));
    timers.push(setTimeout(async () => {
      await triggerAlarmRef.current();
      if (settings.alarm.repeatIntervalSec > 0) {
        const repeatMs = Math.max(1000, settings.alarm.repeatIntervalSec * 1000);
        intervals.push(setInterval(() => {
          void triggerAlarmRef.current();
        }, repeatMs));
      }
    }, alarmDelay));

    // Timer 2: Auto Show Answer
    if (settings.auto.autoShowAnswerEnabled) {
      const showDelay = Math.max(0, showAnswerTriggerTimeMs - (Date.now() - startTime));
      timers.push(setTimeout(async () => {
        await pluginRef.current.queue.showAnswer();
      }, showDelay));
    }

    // Timer 3: Auto Answer
    if (settings.auto.autoAnswerAction !== 'off') {
      const answerDelay = Math.max(0, autoAnswerTriggerTimeMs - (Date.now() - startTime));
      timers.push(setTimeout(async () => {
        if (settings.auto.autoAnswerAction === 'skip') {
          await pluginRef.current.queue.removeCurrentCardFromQueue(false);
          pluginRef.current.app.toast('Card Skipped.');
          setSkippedCountRef.current(skippedCountRef.current + 1);
        } else {
          await pluginRef.current.queue.rateCurrentCard(QueueInteractionScore.AGAIN);
          setAutoAnsweredCountRef.current(autoAnsweredCountRef.current + 1);
        }
      }, answerDelay));
    }

    return () => {
      timers.forEach(clearTimeout);
      intervals.forEach(clearInterval);
    };
  }, [
    cardId, startTime, alarmDelaySec, isAlarmDelayResolved,
    settings.auto.autoShowAnswerEnabled, settings.auto.additiveShowAnswerDelaySec,
    settings.auto.additiveAutoAnswerDelaySec, settings.auto.autoAnswerAction,
    settings.alarm.repeatIntervalSec
    // Note: *CountRef refs are intentionally excluded — they're updated via separate useEffects
  ]);

  return { startTime, visualAlarmUntil };
}

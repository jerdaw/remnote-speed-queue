import React, { useState, useEffect } from 'react';
import { QueueInteractionScore, usePlugin } from '@remnote/plugin-sdk';
import { QueueSettings } from './useQueueSettings';
import { useSessionStats } from './useSessionStats';

export function useTimerStateMachine(
  cardId: string | null,
  alarmDelaySec: number,
  settings: QueueSettings['auto'] & QueueSettings['alarm'],
  playAlarm: () => Promise<void>,
  clearContinuousAlarm: () => void,
  continuousAlarmIntervalRef: React.MutableRefObject<NodeJS.Timeout | null>
) {
  const plugin = usePlugin();
  const [startTime, setStartTime] = useState<number | null>(null);
  const { autoAnsweredCount, setAutoAnsweredCount, skippedCount, setSkippedCount } = useSessionStats();
  // Track latest counts in refs so setTimeout closures don't go stale
  const autoAnsweredCountRef = React.useRef(autoAnsweredCount);
  const skippedCountRef = React.useRef(skippedCount);
  React.useEffect(() => { autoAnsweredCountRef.current = autoAnsweredCount; }, [autoAnsweredCount]);
  React.useEffect(() => { skippedCountRef.current = skippedCount; }, [skippedCount]);

  // Reset timer start point when card changes
  useEffect(() => {
    if (cardId) {
      plugin.queue.inLookbackMode().then((lookback) => {
        if (lookback) {
          setStartTime(null);
          return; // Don't start timer in lookback/review mode
        }
        setStartTime(Date.now());
      });
    } else {
      clearContinuousAlarm();
      setStartTime(null);
    }
  }, [cardId, clearContinuousAlarm, plugin]);

  // Handle specific timed triggers using exact setTimeouts
  useEffect(() => {
    if (!cardId || !startTime) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    const alarmTriggerTimeMs = alarmDelaySec * 1000;
    const showAnswerTriggerTimeMs = (alarmDelaySec + settings.additiveShowAnswerDelaySec) * 1000;
    const autoAnswerTriggerTimeMs = (alarmDelaySec + settings.additiveShowAnswerDelaySec + settings.additiveAutoAnswerDelaySec) * 1000;

    // Timer 1: Initial alarm
    const alarmDelay = Math.max(0, alarmTriggerTimeMs - (Date.now() - startTime));
    timers.push(setTimeout(async () => {
      await playAlarm();
      if (settings.continuousAlarmEnabled) {
        const repeatMs = Math.max(1000, settings.continuousAlarmIntervalSec * 1000);
        continuousAlarmIntervalRef.current = setInterval(() => playAlarm(), repeatMs);
      }
    }, alarmDelay));

    // Timer 2: Auto Show Answer
    if (settings.autoShowAnswerEnabled) {
      const showDelay = Math.max(0, showAnswerTriggerTimeMs - (Date.now() - startTime));
      timers.push(setTimeout(async () => {
        await plugin.queue.showAnswer();
      }, showDelay));
    }

    // Timer 3: Auto Answer
    if (settings.autoAnswerEnabled) {
      const answerDelay = Math.max(0, autoAnswerTriggerTimeMs - (Date.now() - startTime));
      timers.push(setTimeout(async () => {
        if (settings.autoAnswerAction === 'skip') {
          await plugin.queue.removeCurrentCardFromQueue(false);
          plugin.app.toast('Card Skipped.');
          setSkippedCount(skippedCountRef.current + 1);
        } else {
          await plugin.queue.rateCurrentCard(QueueInteractionScore.AGAIN);
          setAutoAnsweredCount(autoAnsweredCountRef.current + 1);
        }
      }, answerDelay));
    }

    return () => {
      timers.forEach(clearTimeout);
      clearContinuousAlarm();
    };
  }, [
    cardId, startTime, alarmDelaySec,
    settings.autoShowAnswerEnabled, settings.additiveShowAnswerDelaySec,
    settings.autoAnswerEnabled, settings.additiveAutoAnswerDelaySec, settings.autoAnswerAction,
    settings.continuousAlarmEnabled, settings.continuousAlarmIntervalSec,
    playAlarm, clearContinuousAlarm, continuousAlarmIntervalRef, plugin,
    setSkippedCount, setAutoAnsweredCount
    // Note: *CountRef refs are intentionally excluded — they're updated via separate useEffects
  ]);

  return { startTime };
}

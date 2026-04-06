import { useTracker } from '@remnote/plugin-sdk';
import {
  ENABLE_PROGRESS_BAR_KEY,
  TIMER_MODE_KEY,
  READING_SPEED_KEY,
  INITIAL_ALARM_DELAY_KEY,
  ALARM_VOLUME_KEY,
  REPEAT_ALARM_INTERVAL_KEY,
  AUTO_SHOW_ANSWER_KEY,
  ADDITIVE_SHOW_ANSWER_DELAY_KEY,
  AUTO_ANSWER_ACTION_KEY,
  ADDITIVE_AUTO_ANSWER_DELAY_KEY,
  DEFAULT_ENABLE_PROGRESS_BAR,
  DEFAULT_READING_SPEED,
  DEFAULT_INITIAL_ALARM_DELAY,
  DEFAULT_MANUAL_FALLBACK_DELAY,
  MIN_READING_SPEED,
  MAX_READING_SPEED,
  DEFAULT_ALARM_VOLUME,
  DEFAULT_REPEAT_ALARM_INTERVAL,
  DEFAULT_AUTO_SHOW_ANSWER,
  DEFAULT_ADDITIVE_SHOW_ANSWER_DELAY,
  DEFAULT_ADDITIVE_AUTO_ANSWER_DELAY,
  DEFAULT_AUTO_ANSWER_ACTION,
} from '../constants';

export type AutoAnswerAction = 'off' | 'again' | 'skip';
export type AlarmVolume = 'off' | 'low' | 'medium' | 'high';


export interface QueueSettings {
  display: {
    enableProgressBar: boolean;
  };
  timer: {
    readingSpeed: number;
    initialDelaySec: number; // 0 = auto, >0 = manual override
  };
  alarm: {
    volume: AlarmVolume;       // 'off' | 'low' | 'medium' | 'high'
    repeatIntervalSec: number; // 0 = no repeat
  };
  auto: {
    autoShowAnswerEnabled: boolean;
    additiveShowAnswerDelaySec: number;
    additiveAutoAnswerDelaySec: number;
    autoAnswerAction: AutoAnswerAction;
  };
}

export function useQueueSettings(): QueueSettings {
  // Group 1: display
  const display = useTracker(async (rp) => ({
    enableProgressBar: (await rp.settings.getSetting<boolean>(ENABLE_PROGRESS_BAR_KEY)) ?? DEFAULT_ENABLE_PROGRESS_BAR,
  }), []);

  // Group 2: timer + alarm
  const timerAlarm = useTracker(async (rp) => ({
    legacyMode: await rp.settings.getSetting<string>(TIMER_MODE_KEY),
    readingSpeed: (await rp.settings.getSetting<number>(READING_SPEED_KEY)) ?? DEFAULT_READING_SPEED,
    initialDelaySec: (await rp.settings.getSetting<number>(INITIAL_ALARM_DELAY_KEY)) ?? DEFAULT_INITIAL_ALARM_DELAY,
    volume: (await rp.settings.getSetting<AlarmVolume>(ALARM_VOLUME_KEY)) ?? DEFAULT_ALARM_VOLUME as AlarmVolume,
    repeatIntervalSec: (await rp.settings.getSetting<number>(REPEAT_ALARM_INTERVAL_KEY)) ?? DEFAULT_REPEAT_ALARM_INTERVAL,
  }), []);

  // Group 3: automation
  const autoRaw = useTracker(async (rp) => ({
    autoShowAnswerEnabled: (await rp.settings.getSetting<boolean>(AUTO_SHOW_ANSWER_KEY)) ?? DEFAULT_AUTO_SHOW_ANSWER,
    additiveShowAnswerDelaySec: (await rp.settings.getSetting<number>(ADDITIVE_SHOW_ANSWER_DELAY_KEY)) ?? DEFAULT_ADDITIVE_SHOW_ANSWER_DELAY,
    autoAnswerAction: (await rp.settings.getSetting<AutoAnswerAction>(AUTO_ANSWER_ACTION_KEY)) ?? DEFAULT_AUTO_ANSWER_ACTION as AutoAnswerAction,
    additiveAutoAnswerDelaySec: (await rp.settings.getSetting<number>(ADDITIVE_AUTO_ANSWER_DELAY_KEY)) ?? DEFAULT_ADDITIVE_AUTO_ANSWER_DELAY,
  }), []);

  // Apply safe clamping
  const safeReadingSpeed = Math.max(MIN_READING_SPEED, Math.min(MAX_READING_SPEED, timerAlarm?.readingSpeed ?? DEFAULT_READING_SPEED));
  const rawInitialDelay = Math.max(0, timerAlarm?.initialDelaySec ?? DEFAULT_INITIAL_ALARM_DELAY);
  const safeInitialDelay =
    timerAlarm?.legacyMode === 'manual'
      ? rawInitialDelay || DEFAULT_MANUAL_FALLBACK_DELAY
      : rawInitialDelay;
  const safeRepeatInterval = Math.max(0, timerAlarm?.repeatIntervalSec ?? DEFAULT_REPEAT_ALARM_INTERVAL);

  return {
    display: display ?? { enableProgressBar: DEFAULT_ENABLE_PROGRESS_BAR },
    timer: {
      readingSpeed: safeReadingSpeed,
      initialDelaySec: safeInitialDelay,
    },
    alarm: {
      volume: timerAlarm?.volume ?? DEFAULT_ALARM_VOLUME,
      repeatIntervalSec: safeRepeatInterval,
    },
    auto: {
      autoShowAnswerEnabled: autoRaw?.autoShowAnswerEnabled ?? DEFAULT_AUTO_SHOW_ANSWER,
      additiveShowAnswerDelaySec: Math.max(0, autoRaw?.additiveShowAnswerDelaySec ?? DEFAULT_ADDITIVE_SHOW_ANSWER_DELAY),
      autoAnswerAction: (autoRaw?.autoAnswerAction ?? DEFAULT_AUTO_ANSWER_ACTION) as AutoAnswerAction,
      additiveAutoAnswerDelaySec: Math.max(0, autoRaw?.additiveAutoAnswerDelaySec ?? DEFAULT_ADDITIVE_AUTO_ANSWER_DELAY),
    },
  };
}

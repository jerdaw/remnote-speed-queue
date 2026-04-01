import { useTracker } from '@remnote/plugin-sdk';
import {
  ENABLE_PROGRESS_BAR_KEY,
  BAR_COLOR_KEY,
  PLAY_ALARM_SOUND_KEY,
  ALARM_VOLUME_KEY,
  ENABLE_AUTO_DETECT_DELAY_KEY,
  INCLUDE_ANSWER_IN_AUTO_DETECT_KEY,
  AUTO_DETECT_DELAY_MULTIPLIER_KEY,
  MIN_AUTO_DETECT_LIMIT_KEY,
  MAX_AUTO_DETECT_LIMIT_KEY,
  INITIAL_ALARM_DELAY_KEY,
  CONTINUOUS_ALARM_KEY,
  CONTINUOUS_ALARM_INTERVAL_KEY,
  AUTO_SHOW_ANSWER_KEY,
  ADDITIVE_SHOW_ANSWER_DELAY_KEY,
  AUTO_ANSWER_KEY,
  ADDITIVE_AUTO_ANSWER_DELAY_KEY,
  AUTO_ANSWER_ACTION_KEY,
  DEFAULT_ENABLE_PROGRESS_BAR,
  DEFAULT_BAR_COLOR,
  DEFAULT_PLAY_ALARM_SOUND,
  DEFAULT_ALARM_VOLUME,
  DEFAULT_ENABLE_AUTO_DETECT_DELAY,
  DEFAULT_INCLUDE_ANSWER_IN_AUTO_DETECT,
  DEFAULT_AUTO_DETECT_DELAY_MULTIPLIER,
  DEFAULT_MIN_AUTO_DETECT_LIMIT,
  DEFAULT_MAX_AUTO_DETECT_LIMIT,
  DEFAULT_INITIAL_ALARM_DELAY,
  DEFAULT_CONTINUOUS_ALARM,
  DEFAULT_CONTINUOUS_ALARM_INTERVAL,
  DEFAULT_AUTO_SHOW_ANSWER,
  DEFAULT_ADDITIVE_SHOW_ANSWER_DELAY,
  DEFAULT_AUTO_ANSWER,
  DEFAULT_ADDITIVE_AUTO_ANSWER_DELAY,
  DEFAULT_AUTO_ANSWER_ACTION,
  MIN_AUTO_DETECT_MULTIPLIER,
  MAX_AUTO_DETECT_MULTIPLIER,
} from '../constants';

export interface QueueSettings {
  display: { enableProgressBar: boolean; barColor: string; };
  delay: {
    manualInitialAlarmDelaySec: number;
    enableAutoDetectDelay: boolean;
    includeAnswerInAutoDetect: boolean;
    autoDetectDelayMultiplierSetting: number;
    minAutoDetectLimitSec: number;
    maxAutoDetectLimitSec: number;
  };
  alarm: {
    playAlarmSoundEnabled: boolean;
    alarmVolumeSetting: number;
    continuousAlarmEnabled: boolean;
    continuousAlarmIntervalSec: number;
  };
  auto: {
    autoShowAnswerEnabled: boolean;
    additiveShowAnswerDelaySec: number;
    autoAnswerEnabled: boolean;
    additiveAutoAnswerDelaySec: number;
    autoAnswerAction: string;
  };
}

export function useQueueSettings(): QueueSettings {
  // Group 1: display settings
  const display = useTracker(async (rp) => ({
    enableProgressBar: (await rp.settings.getSetting<boolean>(ENABLE_PROGRESS_BAR_KEY)) ?? DEFAULT_ENABLE_PROGRESS_BAR,
    barColor: (await rp.settings.getSetting<string>(BAR_COLOR_KEY)) ?? DEFAULT_BAR_COLOR,
  }), []);

  // Group 2: delay/auto-detect settings
  const delayRaw = useTracker(async (rp) => ({
    manualInitialAlarmDelaySec: (await rp.settings.getSetting<number>(INITIAL_ALARM_DELAY_KEY)) ?? DEFAULT_INITIAL_ALARM_DELAY,
    enableAutoDetectDelay: (await rp.settings.getSetting<boolean>(ENABLE_AUTO_DETECT_DELAY_KEY)) ?? DEFAULT_ENABLE_AUTO_DETECT_DELAY,
    includeAnswerInAutoDetect: (await rp.settings.getSetting<boolean>(INCLUDE_ANSWER_IN_AUTO_DETECT_KEY)) ?? DEFAULT_INCLUDE_ANSWER_IN_AUTO_DETECT,
    autoDetectDelayMultiplierSetting: (await rp.settings.getSetting<number>(AUTO_DETECT_DELAY_MULTIPLIER_KEY)) ?? DEFAULT_AUTO_DETECT_DELAY_MULTIPLIER,
    minAutoDetectLimitSec: (await rp.settings.getSetting<number>(MIN_AUTO_DETECT_LIMIT_KEY)) ?? DEFAULT_MIN_AUTO_DETECT_LIMIT,
    maxAutoDetectLimitSec: (await rp.settings.getSetting<number>(MAX_AUTO_DETECT_LIMIT_KEY)) ?? DEFAULT_MAX_AUTO_DETECT_LIMIT,
  }), []);

  // Safe delay settings
  const safeMin = Math.max(0, delayRaw?.minAutoDetectLimitSec ?? DEFAULT_MIN_AUTO_DETECT_LIMIT);
  const safeMax = Math.max(safeMin, delayRaw?.maxAutoDetectLimitSec ?? DEFAULT_MAX_AUTO_DETECT_LIMIT);
  const safeMultiplier = Math.max(MIN_AUTO_DETECT_MULTIPLIER, Math.min(MAX_AUTO_DETECT_MULTIPLIER, delayRaw?.autoDetectDelayMultiplierSetting ?? DEFAULT_AUTO_DETECT_DELAY_MULTIPLIER));
  
  const delay = {
    manualInitialAlarmDelaySec: Math.max(0, delayRaw?.manualInitialAlarmDelaySec ?? DEFAULT_INITIAL_ALARM_DELAY),
    enableAutoDetectDelay: delayRaw?.enableAutoDetectDelay ?? DEFAULT_ENABLE_AUTO_DETECT_DELAY,
    includeAnswerInAutoDetect: delayRaw?.includeAnswerInAutoDetect ?? DEFAULT_INCLUDE_ANSWER_IN_AUTO_DETECT,
    autoDetectDelayMultiplierSetting: safeMultiplier,
    minAutoDetectLimitSec: safeMin,
    maxAutoDetectLimitSec: safeMax,
  };

  // Group 3: alarm settings
  const alarmRaw = useTracker(async (rp) => ({
    playAlarmSoundEnabled: (await rp.settings.getSetting<boolean>(PLAY_ALARM_SOUND_KEY)) ?? DEFAULT_PLAY_ALARM_SOUND,
    alarmVolumeSetting: (await rp.settings.getSetting<number>(ALARM_VOLUME_KEY)) ?? DEFAULT_ALARM_VOLUME,
    continuousAlarmEnabled: (await rp.settings.getSetting<boolean>(CONTINUOUS_ALARM_KEY)) ?? DEFAULT_CONTINUOUS_ALARM,
    continuousAlarmIntervalSec: (await rp.settings.getSetting<number>(CONTINUOUS_ALARM_INTERVAL_KEY)) ?? DEFAULT_CONTINUOUS_ALARM_INTERVAL,
  }), []);

  const alarm = {
    playAlarmSoundEnabled: alarmRaw?.playAlarmSoundEnabled ?? DEFAULT_PLAY_ALARM_SOUND,
    alarmVolumeSetting: Math.max(0, Math.min(100, alarmRaw?.alarmVolumeSetting ?? DEFAULT_ALARM_VOLUME)),
    continuousAlarmEnabled: alarmRaw?.continuousAlarmEnabled ?? DEFAULT_CONTINUOUS_ALARM,
    continuousAlarmIntervalSec: Math.max(1, alarmRaw?.continuousAlarmIntervalSec ?? DEFAULT_CONTINUOUS_ALARM_INTERVAL),
  };

  // Group 4: auto-answer settings
  const autoRaw = useTracker(async (rp) => ({
    autoShowAnswerEnabled: (await rp.settings.getSetting<boolean>(AUTO_SHOW_ANSWER_KEY)) ?? DEFAULT_AUTO_SHOW_ANSWER,
    additiveShowAnswerDelaySec: (await rp.settings.getSetting<number>(ADDITIVE_SHOW_ANSWER_DELAY_KEY)) ?? DEFAULT_ADDITIVE_SHOW_ANSWER_DELAY,
    autoAnswerEnabled: (await rp.settings.getSetting<boolean>(AUTO_ANSWER_KEY)) ?? DEFAULT_AUTO_ANSWER,
    autoAnswerAction: (await rp.settings.getSetting<string>(AUTO_ANSWER_ACTION_KEY)) ?? DEFAULT_AUTO_ANSWER_ACTION,
    additiveAutoAnswerDelaySec: (await rp.settings.getSetting<number>(ADDITIVE_AUTO_ANSWER_DELAY_KEY)) ?? DEFAULT_ADDITIVE_AUTO_ANSWER_DELAY,
  }), []);

  const autoSettings = {
    autoShowAnswerEnabled: autoRaw?.autoShowAnswerEnabled ?? DEFAULT_AUTO_SHOW_ANSWER,
    additiveShowAnswerDelaySec: Math.max(0, autoRaw?.additiveShowAnswerDelaySec ?? DEFAULT_ADDITIVE_SHOW_ANSWER_DELAY),
    autoAnswerEnabled: autoRaw?.autoAnswerEnabled ?? DEFAULT_AUTO_ANSWER,
    autoAnswerAction: autoRaw?.autoAnswerAction ?? DEFAULT_AUTO_ANSWER_ACTION,
    additiveAutoAnswerDelaySec: Math.max(0, autoRaw?.additiveAutoAnswerDelaySec ?? DEFAULT_ADDITIVE_AUTO_ANSWER_DELAY),
  };

  // Default values for initial render when useTracker might return null initially
  return {
    display: display || { enableProgressBar: DEFAULT_ENABLE_PROGRESS_BAR, barColor: DEFAULT_BAR_COLOR },
    delay,
    alarm,
    auto: autoSettings,
  };
}

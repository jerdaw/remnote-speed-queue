// --- Settings Keys ---

// --- Display ---
export const ENABLE_PROGRESS_BAR_KEY = 'enableProgressBar';

// --- Timer ---
export const READING_SPEED_KEY = 'autoDetectDelayMultiplier'; // keep same storage key for backward compat
export const INITIAL_ALARM_DELAY_KEY = 'initialAlarmDelay'; // kept for storage compat, now hidden fallback

// --- Alarm ---
export const ALARM_VOLUME_KEY = 'alarmVolume';
export const REPEAT_ALARM_INTERVAL_KEY = 'continuousAlarmInterval'; // keep same storage key

// --- Automation ---
export const AUTO_SHOW_ANSWER_KEY = 'autoShowAnswer';
export const ADDITIVE_SHOW_ANSWER_DELAY_KEY = 'additiveShowAnswerDelay';
export const AUTO_ANSWER_KEY = 'autoAnswer';
export const AUTO_ANSWER_ACTION_KEY = 'autoAnswerAction';
export const ADDITIVE_AUTO_ANSWER_DELAY_KEY = 'additiveAutoAnswerDelay';


// --- Default Values ---

// --- Display ---
export const DEFAULT_ENABLE_PROGRESS_BAR = true;

// --- Timer ---
export const DEFAULT_READING_SPEED = 1.0;
export const MIN_READING_SPEED = 0.1;
export const MAX_READING_SPEED = 10.0;
export const DEFAULT_MANUAL_FALLBACK_DELAY = 7; // seconds — hardcoded fallback when card text can't be parsed

// --- Auto-Detect Hardcoded Bounds ---
export const AUTO_DETECT_MIN_SEC = 2;
export const AUTO_DETECT_MAX_SEC = 30;

// --- Reading Time Calculation ---
export const WORDS_PER_MINUTE = 200;

// --- Alarm ---
export const DEFAULT_ALARM_VOLUME = 'medium'; // 'off' | 'low' | 'medium' | 'high'
export const ALARM_VOLUME_MAP: Record<string, number> = {
  off: 0.0,
  low: 0.2,
  medium: 0.5,
  high: 1.0,
};
export const DEFAULT_REPEAT_ALARM_INTERVAL = 0; // 0 = no repeat

// --- Automation ---
export const DEFAULT_AUTO_SHOW_ANSWER = true;
export const DEFAULT_ADDITIVE_SHOW_ANSWER_DELAY = 3; // seconds
export const DEFAULT_AUTO_ANSWER = true;
export const DEFAULT_AUTO_ANSWER_ACTION = 'again'; // 'again' or 'skip'
export const DEFAULT_ADDITIVE_AUTO_ANSWER_DELAY = 2; // seconds

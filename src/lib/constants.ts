// --- Settings Keys ---

// --- General ---
export const BAR_COLOR_KEY = 'barColor';

// --- Timing ---
// Original setting for enabling the alarm sound (behavior might be tied to initial alarm)
export const PLAY_ALARM_SOUND_KEY = 'playAlarmSound'; // Renamed for clarity if it's just about the sound

// Delays (now additive)
export const INITIAL_ALARM_DELAY_KEY = 'initialAlarmDelay'; // Time from card display to first alarm
export const ADDITIVE_SHOW_ANSWER_DELAY_KEY = 'additiveShowAnswerDelay'; // Seconds after alarm before auto-showing answer
export const ADDITIVE_AUTO_ANSWER_DELAY_KEY = 'additiveAutoAnswerDelay'; // Seconds after answer is shown before auto-answering

// --- Alarm Behavior ---
export const CONTINUOUS_ALARM_KEY = 'continuousAlarm';
export const CONTINUOUS_ALARM_INTERVAL_KEY = 'continuousAlarmInterval';

// --- Auto-Actions ---
export const AUTO_SHOW_ANSWER_KEY = 'autoShowAnswer'; // Original key, still relevant
export const AUTO_ANSWER_KEY = 'autoAnswer';         // Original key, still relevant
export const AUTO_ANSWER_ACTION_KEY = 'autoAnswerAction';

// --- Default Values ---

// --- General ---
export const DEFAULT_BAR_COLOR = '#A9A9A9'; // A light grey, less distracting

// --- Timing ---
export const DEFAULT_PLAY_ALARM_SOUND = true;

export const DEFAULT_INITIAL_ALARM_DELAY = 5; // seconds
export const DEFAULT_ADDITIVE_SHOW_ANSWER_DELAY = 3; // seconds (total 5+3=8 for default settings)
export const DEFAULT_ADDITIVE_AUTO_ANSWER_DELAY = 2; // seconds (total 5+3+2=10 for default settings)

// --- Alarm Behavior ---
export const DEFAULT_CONTINUOUS_ALARM = false;
export const DEFAULT_CONTINUOUS_ALARM_INTERVAL = 10; // seconds

// --- Auto-Actions ---
export const DEFAULT_AUTO_SHOW_ANSWER = true;
export const DEFAULT_AUTO_ANSWER = true;
export const DEFAULT_AUTO_ANSWER_ACTION = 'again'; // 'again' or 'skip'

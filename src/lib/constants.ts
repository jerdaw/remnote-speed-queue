// --- Settings Keys ---

// --- General Display ---
export const ENABLE_PROGRESS_BAR_KEY = 'enableProgressBar';
export const BAR_COLOR_KEY = 'barColor';

// --- Initial Alarm ---
export const PLAY_ALARM_SOUND_KEY = 'playAlarmSound';
export const ALARM_VOLUME_KEY = 'alarmVolume'; 
export const ENABLE_AUTO_DETECT_DELAY_KEY = 'enableAutoDetectInitialDelay';
export const INCLUDE_ANSWER_IN_AUTO_DETECT_KEY = 'includeAnswerInAutoDetect'; 
export const AUTO_DETECT_DELAY_MULTIPLIER_KEY = 'autoDetectDelayMultiplier'; 
export const MIN_AUTO_DETECT_LIMIT_KEY = 'minAutoDetectLimit'; 
export const MAX_AUTO_DETECT_LIMIT_KEY = 'maxAutoDetectLimit'; 
export const INITIAL_ALARM_DELAY_KEY = 'initialAlarmDelay'; 

// --- Repeating Alarm (Continuous Dinging) ---
export const CONTINUOUS_ALARM_KEY = 'continuousAlarm';
export const CONTINUOUS_ALARM_INTERVAL_KEY = 'continuousAlarmInterval';

// --- Auto Show Answer ---
export const AUTO_SHOW_ANSWER_KEY = 'autoShowAnswer';
export const ADDITIVE_SHOW_ANSWER_DELAY_KEY = 'additiveShowAnswerDelay';

// --- Auto Answer Card ---
export const AUTO_ANSWER_KEY = 'autoAnswer';
export const AUTO_ANSWER_ACTION_KEY = 'autoAnswerAction'; 
export const ADDITIVE_AUTO_ANSWER_DELAY_KEY = 'additiveAutoAnswerDelay';


// --- Default Values ---

// --- General Display ---
export const DEFAULT_ENABLE_PROGRESS_BAR = true;
export const DEFAULT_BAR_COLOR = '#A9A9A9'; 

// --- Initial Alarm ---
export const DEFAULT_PLAY_ALARM_SOUND = true;
export const DEFAULT_ALARM_VOLUME = 66; 
export const DEFAULT_ENABLE_AUTO_DETECT_DELAY = true; 
export const DEFAULT_INCLUDE_ANSWER_IN_AUTO_DETECT = true; 
export const DEFAULT_AUTO_DETECT_DELAY_MULTIPLIER = 1.0; 
export const DEFAULT_MIN_AUTO_DETECT_LIMIT = 3; 
export const DEFAULT_MAX_AUTO_DETECT_LIMIT = 20; 
export const DEFAULT_INITIAL_ALARM_DELAY = 7; // seconds (manual/fallback)

// --- Reading Time Calculation Parameters --- 
export const WORDS_PER_MINUTE = 200; 
export const MIN_AUTO_DETECT_MULTIPLIER = 0.1; 
export const MAX_AUTO_DETECT_MULTIPLIER = 10.0; 

// --- Repeating Alarm (Continuous Dinging) ---
export const DEFAULT_CONTINUOUS_ALARM = false;
export const DEFAULT_CONTINUOUS_ALARM_INTERVAL = 10; // seconds

// --- Auto Show Answer ---
export const DEFAULT_AUTO_SHOW_ANSWER = true;
export const DEFAULT_ADDITIVE_SHOW_ANSWER_DELAY = 3; // seconds 

// --- Auto Answer Card ---
export const DEFAULT_AUTO_ANSWER = true;
export const DEFAULT_AUTO_ANSWER_ACTION = 'again'; // 'again' or 'skip'
export const DEFAULT_ADDITIVE_AUTO_ANSWER_DELAY = 2; // seconds

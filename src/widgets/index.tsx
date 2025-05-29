import { declareIndexPlugin, ReactRNPlugin, WidgetLocation } from '@remnote/plugin-sdk';
import '../style.css';
import '../App.css';
import {
  // General Display
  ENABLE_PROGRESS_BAR_KEY,
  BAR_COLOR_KEY,
  // Initial Alarm
  PLAY_ALARM_SOUND_KEY,
  ALARM_VOLUME_KEY,
  ENABLE_AUTO_DETECT_DELAY_KEY,
  INCLUDE_ANSWER_IN_AUTO_DETECT_KEY,
  AUTO_DETECT_DELAY_MULTIPLIER_KEY, 
  MIN_AUTO_DETECT_LIMIT_KEY, 
  MAX_AUTO_DETECT_LIMIT_KEY, 
  INITIAL_ALARM_DELAY_KEY,
  // Repeating Alarm
  CONTINUOUS_ALARM_KEY,
  CONTINUOUS_ALARM_INTERVAL_KEY,
  // Auto Show Answer
  AUTO_SHOW_ANSWER_KEY,
  ADDITIVE_SHOW_ANSWER_DELAY_KEY,
  // Auto Answer Card
  AUTO_ANSWER_KEY,
  AUTO_ANSWER_ACTION_KEY, 
  ADDITIVE_AUTO_ANSWER_DELAY_KEY,

  // Defaults
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
  MIN_AUTO_DETECT_MULTIPLIER, 
  MAX_AUTO_DETECT_MULTIPLIER, 
  DEFAULT_CONTINUOUS_ALARM,
  DEFAULT_CONTINUOUS_ALARM_INTERVAL,
  DEFAULT_AUTO_SHOW_ANSWER,
  DEFAULT_ADDITIVE_SHOW_ANSWER_DELAY,
  DEFAULT_AUTO_ANSWER,
  DEFAULT_AUTO_ANSWER_ACTION,
  DEFAULT_ADDITIVE_AUTO_ANSWER_DELAY,
} from '../lib/constants';

async function onActivate(plugin: ReactRNPlugin) {
  // --- General Display Settings ---
  await plugin.settings.registerBooleanSetting({
    id: ENABLE_PROGRESS_BAR_KEY,
    title: 'Enable Progress Bar',
    description: 'Show or hide the 1px timer progress bar.',
    defaultValue: DEFAULT_ENABLE_PROGRESS_BAR,
  });

  await plugin.settings.registerStringSetting({
    id: BAR_COLOR_KEY,
    title: 'Progress Bar Color',
    description: 'Enter a valid HTML color code for the timer bar (e.g., #A9A9A9, lightblue). Only active if Progress Bar is enabled.',
    defaultValue: DEFAULT_BAR_COLOR,
  });

  // --- Initial Alarm Settings ---
  await plugin.settings.registerBooleanSetting({
    id: PLAY_ALARM_SOUND_KEY,
    title: 'Play Alarm Sound',
    description: 'Enable or disable the alarm sound that plays when the initial timer elapses.',
    defaultValue: DEFAULT_PLAY_ALARM_SOUND,
  });

  await plugin.settings.registerNumberSetting({
    id: ALARM_VOLUME_KEY,
    title: 'Alarm Volume (0-100)',
    description: 'Set the volume of the alarm sound. 0 is silent, 100 is full. Only active if "Play Alarm Sound" is on.',
    defaultValue: DEFAULT_ALARM_VOLUME,
  });

  await plugin.settings.registerBooleanSetting({ 
    id: ENABLE_AUTO_DETECT_DELAY_KEY,
    title: 'Auto-Detect Initial Alarm Delay',
    description: 'Automatically set the initial alarm delay based on the length of the card content.',
    defaultValue: DEFAULT_ENABLE_AUTO_DETECT_DELAY,
  });

  await plugin.settings.registerBooleanSetting({ 
    id: INCLUDE_ANSWER_IN_AUTO_DETECT_KEY,
    title: 'Include Answer in Auto-Detect',
    description: 'Include the text of the answer side when calculating the auto-detected delay. Only active if "Auto-Detect" is enabled.',
    defaultValue: DEFAULT_INCLUDE_ANSWER_IN_AUTO_DETECT,
  });

  await plugin.settings.registerNumberSetting({ 
    id: AUTO_DETECT_DELAY_MULTIPLIER_KEY,
    title: 'Auto-Detect Delay Multiplier',
    description: `Adjusts the auto-detected delay. E.g., 0.5 for half, 2.0 for double. Effective range ${MIN_AUTO_DETECT_MULTIPLIER}x to ${MAX_AUTO_DETECT_MULTIPLIER}x. Only active if "Auto-Detect" is enabled.`,
    defaultValue: DEFAULT_AUTO_DETECT_DELAY_MULTIPLIER,
  });

  await plugin.settings.registerNumberSetting({ 
    id: MIN_AUTO_DETECT_LIMIT_KEY,
    title: 'Min Auto-Detected Delay (sec)',
    description: 'Minimum alarm delay (in seconds) when auto-detect is enabled.',
    defaultValue: DEFAULT_MIN_AUTO_DETECT_LIMIT,
  });

  await plugin.settings.registerNumberSetting({ 
    id: MAX_AUTO_DETECT_LIMIT_KEY,
    title: 'Max Auto-Detected Delay (sec)',
    description: 'Maximum alarm delay (in seconds) when auto-detect is enabled.',
    defaultValue: DEFAULT_MAX_AUTO_DETECT_LIMIT,
  });

  await plugin.settings.registerNumberSetting({
    id: INITIAL_ALARM_DELAY_KEY,
    title: 'Manual Initial Alarm Delay (sec)', 
    description: 'Time in seconds until the first alarm. Used if "Auto-Detect" is disabled, or as a fallback if content analysis fails.',
    defaultValue: DEFAULT_INITIAL_ALARM_DELAY,
  });
  
  // --- Repeating Alarm (Continuous Dinging) Settings ---
  await plugin.settings.registerBooleanSetting({
    id: CONTINUOUS_ALARM_KEY,
    title: 'Enable Repeating Alarm',
    description: 'If enabled, the alarm will repeat at the specified interval until the next card is shown.',
    defaultValue: DEFAULT_CONTINUOUS_ALARM,
  });

  await plugin.settings.registerNumberSetting({
    id: CONTINUOUS_ALARM_INTERVAL_KEY,
    title: 'Repeating Alarm Interval (sec)',
    description: 'How often the alarm repeats (requires "Enable Repeating Alarm" to be active). Minimum 1 second.',
    defaultValue: DEFAULT_CONTINUOUS_ALARM_INTERVAL,
  });

  // --- Auto Show Answer Settings ---
  await plugin.settings.registerBooleanSetting({
    id: AUTO_SHOW_ANSWER_KEY,
    title: 'Enable Auto Show Answer',
    description: 'Automatically show the card answer after the specified delays have passed.',
    defaultValue: DEFAULT_AUTO_SHOW_ANSWER,
  });

  await plugin.settings.registerNumberSetting({
    id: ADDITIVE_SHOW_ANSWER_DELAY_KEY,
    title: 'Show Answer Delay (after alarm, sec)',
    description: 'Additional time in seconds *after* the initial alarm before the answer is automatically shown. Only active if "Enable Auto Show Answer" is on.',
    defaultValue: DEFAULT_ADDITIVE_SHOW_ANSWER_DELAY,
  });

  // --- Auto Answer Card Settings ---
  await plugin.settings.registerBooleanSetting({
    id: AUTO_ANSWER_KEY,
    title: 'Enable Auto Answer Card',
    description: 'Automatically answer the card after the answer has been shown and the specified delay has passed.',
    defaultValue: DEFAULT_AUTO_ANSWER,
  });
  
  await plugin.settings.registerDropdownSetting({
    id: AUTO_ANSWER_ACTION_KEY,
    title: 'Auto-Answer Action',
    description: 'Choose how the card is automatically answered. Only active if "Enable Auto Answer Card" is on.',
    defaultValue: DEFAULT_AUTO_ANSWER_ACTION,
    options: [
      { key: 'again', value: 'again', label: 'Forgotten/Again', },
      { key: 'skip', value: 'skip', label: 'Skip Card (remove from current session)', },
    ],
  });

  await plugin.settings.registerNumberSetting({
    id: ADDITIVE_AUTO_ANSWER_DELAY_KEY,
    title: 'Auto-Answer Delay (after answer shown, sec)',
    description: 'Additional time in seconds *after* the answer is shown before the card is automatically answered. Only active if "Enable Auto Answer Card" is on.',
    defaultValue: DEFAULT_ADDITIVE_AUTO_ANSWER_DELAY,
  });


  await plugin.app.registerWidget('bar', WidgetLocation.QueueBelowTopBar, {
    dimensions: { height: 'auto', width: '100%' },
  });
}

async function onDeactivate(_: ReactRNPlugin) {}

declareIndexPlugin(onActivate, onDeactivate);

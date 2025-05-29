import { declareIndexPlugin, ReactRNPlugin, WidgetLocation } from '@remnote/plugin-sdk';
import '../style.css';
import '../App.css';
import {
  PLAY_ALARM_SOUND_KEY,
  INITIAL_ALARM_DELAY_KEY,
  AUTO_SHOW_ANSWER_KEY,
  ADDITIVE_SHOW_ANSWER_DELAY_KEY,
  AUTO_ANSWER_KEY,
  ADDITIVE_AUTO_ANSWER_DELAY_KEY,
  AUTO_ANSWER_ACTION_KEY,
  CONTINUOUS_ALARM_KEY, // New for Phase 3
  CONTINUOUS_ALARM_INTERVAL_KEY, // New for Phase 3

  DEFAULT_PLAY_ALARM_SOUND,
  DEFAULT_INITIAL_ALARM_DELAY,
  DEFAULT_AUTO_SHOW_ANSWER,
  DEFAULT_ADDITIVE_SHOW_ANSWER_DELAY,
  DEFAULT_AUTO_ANSWER,
  DEFAULT_ADDITIVE_AUTO_ANSWER_DELAY,
  DEFAULT_AUTO_ANSWER_ACTION,
  DEFAULT_CONTINUOUS_ALARM, // New for Phase 3
  DEFAULT_CONTINUOUS_ALARM_INTERVAL, // New for Phase 3

  BAR_COLOR_KEY,
  DEFAULT_BAR_COLOR,
} from '../lib/constants';

async function onActivate(plugin: ReactRNPlugin) {
  // --- General Settings ---
  await plugin.settings.registerStringSetting({
    id: BAR_COLOR_KEY,
    title: 'Progress Bar Color',
    description: 'Enter a valid HTML color code for the timer bar (e.g., #A9A9A9, lightblue).',
    defaultValue: DEFAULT_BAR_COLOR,
  });

  // --- Timing Settings (Additive Logic) ---
  await plugin.settings.registerBooleanSetting({
    id: PLAY_ALARM_SOUND_KEY,
    title: 'Play Alarm Sound',
    description: 'Enable or disable the alarm sound that plays when the initial timer elapses.',
    defaultValue: DEFAULT_PLAY_ALARM_SOUND,
  });

  await plugin.settings.registerNumberSetting({
    id: INITIAL_ALARM_DELAY_KEY,
    title: 'Initial Alarm Delay (sec)',
    description: 'Time in seconds from when a card appears until the first alarm sounds.',
    defaultValue: DEFAULT_INITIAL_ALARM_DELAY,
  });

  await plugin.settings.registerNumberSetting({
    id: ADDITIVE_SHOW_ANSWER_DELAY_KEY,
    title: 'Show Answer Delay (after alarm, sec)',
    description: 'Additional time in seconds *after* the initial alarm before the answer is automatically shown. Set to 0 to show immediately with alarm (if Auto Show Answer is enabled).',
    defaultValue: DEFAULT_ADDITIVE_SHOW_ANSWER_DELAY,
  });

  await plugin.settings.registerNumberSetting({
    id: ADDITIVE_AUTO_ANSWER_DELAY_KEY,
    title: 'Auto-Answer Delay (after answer shown, sec)',
    description: 'Additional time in seconds *after* the answer is shown before the card is automatically answered. (if Auto Answer is enabled).',
    defaultValue: DEFAULT_ADDITIVE_AUTO_ANSWER_DELAY,
  });
  
  // --- Alarm Behavior Settings ---
  await plugin.settings.registerBooleanSetting({
    id: CONTINUOUS_ALARM_KEY,
    title: 'Enable Repeating Alarm',
    description: 'If enabled, the alarm will repeat at the specified interval until the answer is revealed by the plugin.',
    defaultValue: DEFAULT_CONTINUOUS_ALARM,
  });

  await plugin.settings.registerNumberSetting({
    id: CONTINUOUS_ALARM_INTERVAL_KEY,
    title: 'Repeating Alarm Interval (sec)',
    description: 'How often the alarm repeats if the answer has not been shown (requires "Enable Repeating Alarm" to be active). Minimum 1 second.',
    defaultValue: DEFAULT_CONTINUOUS_ALARM_INTERVAL,
  });

  // --- Auto-Actions Settings ---
  await plugin.settings.registerBooleanSetting({
    id: AUTO_SHOW_ANSWER_KEY,
    title: 'Enable Auto Show Answer',
    description: 'Automatically show the card answer after the "Initial Alarm Delay" + "Show Answer Delay" have passed.',
    defaultValue: DEFAULT_AUTO_SHOW_ANSWER,
  });

  await plugin.settings.registerBooleanSetting({
    id: AUTO_ANSWER_KEY,
    title: 'Enable Auto Answer Card',
    description: 'Automatically answer the card after the answer has been shown and the "Auto-Answer Delay" has passed.',
    defaultValue: DEFAULT_AUTO_ANSWER,
  });

  await plugin.settings.registerDropdownSetting({
    id: AUTO_ANSWER_ACTION_KEY,
    title: 'Auto-Answer Action',
    description: 'Choose how the card is automatically answered.',
    defaultValue: DEFAULT_AUTO_ANSWER_ACTION,
    options: [
      {
        key: 'again',
        value: 'again',
        label: 'Mark as "Again"',
      },
      {
        key: 'skip',
        value: 'skip',
        label: 'Skip Card (remove from current session)',
      },
    ],
  });

  await plugin.app.registerWidget('bar', WidgetLocation.QueueBelowTopBar, {
    dimensions: { height: 'auto', width: '100%' },
  });
}

async function onDeactivate(_: ReactRNPlugin) {}

declareIndexPlugin(onActivate, onDeactivate);

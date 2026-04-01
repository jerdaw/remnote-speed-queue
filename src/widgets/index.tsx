import { declareIndexPlugin, ReactRNPlugin, WidgetLocation } from '@remnote/plugin-sdk';
import '../style.css';
import '../App.css';
import {
  ENABLE_PROGRESS_BAR_KEY,
  READING_SPEED_KEY,
  ALARM_VOLUME_KEY,
  REPEAT_ALARM_INTERVAL_KEY,
  AUTO_SHOW_ANSWER_KEY,
  ADDITIVE_SHOW_ANSWER_DELAY_KEY,
  AUTO_ANSWER_KEY,
  AUTO_ANSWER_ACTION_KEY,
  ADDITIVE_AUTO_ANSWER_DELAY_KEY,
  DEFAULT_ENABLE_PROGRESS_BAR,
  DEFAULT_READING_SPEED,
  MIN_READING_SPEED,
  MAX_READING_SPEED,
  DEFAULT_ALARM_VOLUME,
  DEFAULT_REPEAT_ALARM_INTERVAL,
  DEFAULT_AUTO_SHOW_ANSWER,
  DEFAULT_ADDITIVE_SHOW_ANSWER_DELAY,
  DEFAULT_AUTO_ANSWER,
  DEFAULT_AUTO_ANSWER_ACTION,
  DEFAULT_ADDITIVE_AUTO_ANSWER_DELAY,
} from '../lib/constants';

async function onActivate(plugin: ReactRNPlugin) {
  // --- Timer ---
  await plugin.settings.registerNumberSetting({
    id: READING_SPEED_KEY,
    title: 'Reading Speed',
    description: `How fast you read. Lower = less time per card, higher = more time. Range: ${MIN_READING_SPEED}x to ${MAX_READING_SPEED}x. The timer automatically adapts to card length.`,
    defaultValue: DEFAULT_READING_SPEED,
  });

  // --- Alarm ---
  await plugin.settings.registerDropdownSetting({
    id: ALARM_VOLUME_KEY,
    title: 'Alarm Volume',
    description: 'Volume of the alarm sound when time is up. "Off" disables the alarm entirely.',
    defaultValue: DEFAULT_ALARM_VOLUME,
    options: [
      { key: 'off', value: 'off', label: 'Off' },
      { key: 'low', value: 'low', label: 'Low' },
      { key: 'medium', value: 'medium', label: 'Medium' },
      { key: 'high', value: 'high', label: 'High' },
    ],
  });

  await plugin.settings.registerNumberSetting({
    id: REPEAT_ALARM_INTERVAL_KEY,
    title: 'Repeat Alarm Every (sec, 0 = off)',
    description: 'How often the alarm repeats after the initial trigger. Set to 0 to disable repeating.',
    defaultValue: DEFAULT_REPEAT_ALARM_INTERVAL,
  });

  // --- Automation ---
  await plugin.settings.registerBooleanSetting({
    id: AUTO_SHOW_ANSWER_KEY,
    title: 'Auto Show Answer',
    description: 'Automatically reveal the card answer after the alarm fires plus the delay below.',
    defaultValue: DEFAULT_AUTO_SHOW_ANSWER,
  });

  await plugin.settings.registerNumberSetting({
    id: ADDITIVE_SHOW_ANSWER_DELAY_KEY,
    title: 'Show Answer Delay (sec after alarm)',
    description: 'Seconds after the alarm before the answer is automatically shown.',
    defaultValue: DEFAULT_ADDITIVE_SHOW_ANSWER_DELAY,
  });

  await plugin.settings.registerBooleanSetting({
    id: AUTO_ANSWER_KEY,
    title: 'Auto Answer Card',
    description: 'Automatically answer the card after the answer has been shown for the delay below.',
    defaultValue: DEFAULT_AUTO_ANSWER,
  });

  await plugin.settings.registerDropdownSetting({
    id: AUTO_ANSWER_ACTION_KEY,
    title: 'Auto-Answer Action',
    description: 'How the card is automatically answered.',
    defaultValue: DEFAULT_AUTO_ANSWER_ACTION,
    options: [
      { key: 'again', value: 'again', label: 'Forgotten/Again' },
      { key: 'skip', value: 'skip', label: 'Skip Card (remove from session)' },
    ],
  });

  await plugin.settings.registerNumberSetting({
    id: ADDITIVE_AUTO_ANSWER_DELAY_KEY,
    title: 'Auto-Answer Delay (sec after answer shown)',
    description: 'Seconds after the answer is revealed before the auto-answer action triggers.',
    defaultValue: DEFAULT_ADDITIVE_AUTO_ANSWER_DELAY,
  });

  // --- Display ---
  await plugin.settings.registerBooleanSetting({
    id: ENABLE_PROGRESS_BAR_KEY,
    title: 'Show Progress Bar',
    description: 'Show or hide the 1px timer progress bar above the card.',
    defaultValue: DEFAULT_ENABLE_PROGRESS_BAR,
  });

  await plugin.app.registerWidget('bar', WidgetLocation.QueueBelowTopBar, {
    dimensions: { height: 'auto', width: '100%' },
  });
}

// onDeactivate: sandboxed plugins auto-clean event listeners; nothing to do here.
async function onDeactivate(_: ReactRNPlugin) {}
declareIndexPlugin(onActivate, onDeactivate);

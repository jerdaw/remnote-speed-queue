import { declareIndexPlugin, ReactRNPlugin, WidgetLocation } from '@remnote/plugin-sdk';
import '../style.css';
import '../App.css';
import {
  ENABLE_PROGRESS_BAR_KEY,
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
  MIN_READING_SPEED,
  MAX_READING_SPEED,
  DEFAULT_ALARM_VOLUME,
  DEFAULT_REPEAT_ALARM_INTERVAL,
  DEFAULT_AUTO_SHOW_ANSWER,
  DEFAULT_ADDITIVE_SHOW_ANSWER_DELAY,
  DEFAULT_AUTO_ANSWER_ACTION,
  DEFAULT_ADDITIVE_AUTO_ANSWER_DELAY,
  ENABLE_VISUAL_FLASH_KEY,
  ALARM_FLASH_COLOR_KEY,
  PROGRESS_BAR_COLOR_KEY,
  ENABLE_SESSION_SUMMARY_KEY,
  ENABLE_TAG_OVERRIDES_KEY,
  DEFAULT_ENABLE_VISUAL_FLASH,
  DEFAULT_ALARM_FLASH_COLOR,
  DEFAULT_PROGRESS_BAR_COLOR,
  DEFAULT_ENABLE_SESSION_SUMMARY,
  DEFAULT_ENABLE_TAG_OVERRIDES,
} from '../lib/constants';

async function onActivate(plugin: ReactRNPlugin) {
  // --- Timer ---
  await plugin.settings.registerNumberSetting({
    id: INITIAL_ALARM_DELAY_KEY,
    title: 'Initial Wait Time (sec, 0 = auto)',
    description: '0 = auto-calculate from the full rem length. Any positive value = fixed manual delay.',
    defaultValue: DEFAULT_INITIAL_ALARM_DELAY,
  });

  await plugin.settings.registerNumberSetting({
    id: READING_SPEED_KEY,
    title: 'Auto Timing Multiplier',
    description: `Used only when Initial Wait Time is 0. 1.0 = default. Lower = less time, higher = more time. Range: ${MIN_READING_SPEED}x to ${MAX_READING_SPEED}x. Auto mode uses the full rem, including hidden/back content.`,
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
    title: 'Repeat Alarm Interval (sec, 0 = off)',
    description: 'How often the alarm repeats after the initial trigger. Set to 0 to disable repeating.',
    defaultValue: DEFAULT_REPEAT_ALARM_INTERVAL,
  });

  // --- Automation ---
  await plugin.settings.registerBooleanSetting({
    id: AUTO_SHOW_ANSWER_KEY,
    title: 'Auto-Reveal Answer',
    description: 'Automatically reveal the card answer after the alarm fires plus the delay below.',
    defaultValue: DEFAULT_AUTO_SHOW_ANSWER,
  });

  await plugin.settings.registerNumberSetting({
    id: ADDITIVE_SHOW_ANSWER_DELAY_KEY,
    title: 'Reveal Delay (sec after alarm)',
    description: 'Seconds after the alarm before the answer is automatically shown.',
    defaultValue: DEFAULT_ADDITIVE_SHOW_ANSWER_DELAY,
  });

  await plugin.settings.registerDropdownSetting({
    id: AUTO_ANSWER_ACTION_KEY,
    title: 'Auto Rate / Skip Card',
    description: 'Automatically rate or skip the card after the answer is shown. Select "Off" to disable auto-answering.',
    defaultValue: DEFAULT_AUTO_ANSWER_ACTION,
    options: [
      { key: 'off', value: 'off', label: 'Off (Do nothing)' },
      { key: 'again', value: 'again', label: 'Forgotten/Again' },
      { key: 'skip', value: 'skip', label: 'Skip Card (remove from session)' },
    ],
  });

  await plugin.settings.registerNumberSetting({
    id: ADDITIVE_AUTO_ANSWER_DELAY_KEY,
    title: 'Auto Rate Delay (sec after reveal)',
    description: 'Seconds after the answer is revealed before the auto-answer action triggers.',
    defaultValue: DEFAULT_ADDITIVE_AUTO_ANSWER_DELAY,
  });

  await plugin.settings.registerBooleanSetting({
    id: ENABLE_PROGRESS_BAR_KEY,
    title: 'Show Progress Bar',
    description: 'Show the timer bar above the card. It also flashes when the alarm fires.',
    defaultValue: DEFAULT_ENABLE_PROGRESS_BAR,
  });

  // --- Advanced (Phase 3) ---
  await plugin.settings.registerBooleanSetting({
    id: ENABLE_VISUAL_FLASH_KEY,
    title: 'Enable Visual Screen Flash',
    description: 'Flashes the entire screen border/overlay when the alarm triggers. Great for silent study.',
    defaultValue: DEFAULT_ENABLE_VISUAL_FLASH,
  });

  await plugin.settings.registerStringSetting({
    id: ALARM_FLASH_COLOR_KEY,
    title: 'Alarm Flash Color',
    description: 'CSS color (Hex or name) for the screen flash. Default: #f59e0b (Amber)',
    defaultValue: DEFAULT_ALARM_FLASH_COLOR,
  });

  await plugin.settings.registerStringSetting({
    id: PROGRESS_BAR_COLOR_KEY,
    title: 'Custom Progress Bar Color',
    description: 'CSS color (Hex or name) for the progress bar. Leave empty to use theme defaults.',
    defaultValue: DEFAULT_PROGRESS_BAR_COLOR,
  });

  await plugin.settings.registerBooleanSetting({
    id: ENABLE_SESSION_SUMMARY_KEY,
    title: 'Show Session Summary',
    description: 'Automatically show a performance summary (Answered vs Skipped) when you finish a queue session.',
    defaultValue: DEFAULT_ENABLE_SESSION_SUMMARY,
  });

  await plugin.settings.registerBooleanSetting({
    id: ENABLE_TAG_OVERRIDES_KEY,
    title: 'Allow Tag Overrides (#Speed:X)',
    description: 'Allow folders/documents tagged with #Speed:1.5 to override the global reading speed.',
    defaultValue: DEFAULT_ENABLE_TAG_OVERRIDES,
  });

  await plugin.app.registerWidget('bar', WidgetLocation.QueueBelowTopBar, {
    dimensions: { height: 'auto', width: '100%' },
  });
}

// onDeactivate: sandboxed plugins auto-clean event listeners; nothing to do here.
async function onDeactivate(_: ReactRNPlugin) {}
declareIndexPlugin(onActivate, onDeactivate);

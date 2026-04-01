# Enhanced Speed Queue (for RemNote)

A plugin by **jerdaw** to supercharge your RemNote flashcard review speed and focus with adaptive timers and automation. Built upon and significantly extending the original "Queue Speed Mode" plugin by **Jamesb**.

## How It Works

The plugin automatically calculates how long you need to read each flashcard based on its word count, then:

1. **⏱️ Timer** — A progress bar fills as you read. When time's up, an alarm sounds.
2. **⚡ Auto-Show** — The answer is revealed automatically after a short delay.
3. **🔁 Auto-Answer** — The card is rated (Again) or skipped, and the next card appears.

All three stages are configurable. Out of the box, the plugin runs fully hands-free with sensible defaults.

## Known Limitations

- **Mobile Audio:** iOS and some Android browsers block programmatic audio playback without a preceding user gesture. The alarm sound may not play on mobile devices. All other features work normally on mobile.

## Settings

All settings are in `Settings > Plugins > Enhanced Speed Queue`.

### Timer
| Setting | Description | Default |
|---|---|---|
| **Reading Speed** | How fast you read. Lower = less time per card, higher = more. Range 0.1x–10x. | 1.0 |

### Alarm
| Setting | Description | Default |
|---|---|---|
| **Alarm Volume** | Off / Low / Medium / High. "Off" disables sound entirely. | Medium |
| **Repeat Alarm Every (sec)** | How often the alarm repeats after the initial trigger. 0 = no repeat. | 0 |

### Automation
| Setting | Description | Default |
|---|---|---|
| **Auto Show Answer** | Automatically reveal the answer after the alarm. | ✅ On |
| **Show Answer Delay** | Seconds after the alarm before the answer is shown. | 3 |
| **Auto-Answer Action** | How to rate the card. Off / Forgotten (Again) / Skip (remove from session). "Off" disables auto-answering completely. | Again |
| **Auto-Answer Delay** | Seconds after the answer is shown before auto-answer triggers. | 2 |

### Display
| Setting | Description | Default |
|---|---|---|
| **Show Progress Bar** | Show or hide the 1px timer bar above the card. | ✅ On |

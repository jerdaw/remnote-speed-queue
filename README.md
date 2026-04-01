# Enhanced Speed Queue (for RemNote)

A performance-focused plugin by **jerdaw** to supercharge your RemNote flashcard review speed with adaptive timers and hands-free automation.

## Quick Start

1. Install the plugin in RemNote (`Settings > Plugins > Search`).
2. Open your flashcard queue.
3. A subtle 1px progress bar fills in the top bar.
4. Set `Initial Wait Time (sec, 0 = auto)` to `0` for auto timing based on the full rem, or to any positive number for a fixed manual delay.
5. When time's up, the top bar alarm triggers. If audio playback is allowed, a chime plays; otherwise the bar flashes as a visual fallback, then the answer is shown and the card is rated.

## How It Works

The plugin either uses a fixed initial delay or automatically calculates reading time from the full rem text, including hidden/back content, then drives a 3-step state machine:

1. **⏱️ Timer** — Fills as you read. Triggers an alarm event.
2. **⚡ Auto-Show** — Automatically reveals the answer after the alarm.
3. **🔁 Auto-Answer** — Rates the card (Again/Skip) and jumps to the next one.

## Alarm Behavior

The alarm is intentionally designed as:

- **Visual-first reliable signal**: the top bar pulses when the alarm fires.
- **Audio as best effort**: the ding plays only when the RemNote/browser runtime allows it.

This matters because RemNote may keep a plugin sandboxed even when the manifest requests native mode. In sandboxed runtimes, browser autoplay restrictions can block or degrade audio playback. The plugin therefore treats visual feedback as the guaranteed cue and audio as an optional enhancement.

## Settings

Settings are located in `Settings > Plugins > Enhanced Speed Queue`.

| Category | Setting | Description | Default |
| --- | --- | --- | --- |
| **Timer** | **Initial Wait Time (sec, 0 = auto)** | `0` = auto-calculate from full rem length, `>0` = fixed manual delay. | `0` |
| **Timer** | **Auto Timing Multiplier** | Used only when Initial Wait Time is `0`. `1.0` = default. Lower = less time, higher = more time. | `1.0` |
| **Alarm** | **Alarm Volume** | Off / Low / Medium / High. | `Medium` |
| **Alarm** | **Repeat Alarm Interval (sec, 0 = off)** | Interval for repeated alarms after the first trigger. | `0` |
| **Auto** | **Auto-Reveal Answer** | Automatically reveal the answer after the alarm. | ✅ On |
| **Auto** | **Reveal Delay (sec after alarm)** | Extra delay between the alarm and answer reveal. | `3` |
| **Auto** | **Auto Rate / Skip Card** | Off / Again / Skip Card. | `Again` |
| **Auto** | **Auto Rate Delay (sec after reveal)** | Extra delay between answer reveal and auto rate/skip. | `2` |
| **Display** | **Show Progress Bar** | Show the timer bar above the card; it also flashes on alarm. | ✅ On |

## Architecture Overview

The plugin is built with a composition-of-hooks pattern to ensure high-frequency UI updates remain smooth and predictable.

### Core Logic (Hooks)
- `useTimerStateMachine.ts`: Manages the progression from reading → showing → answering. The scheduling effect intentionally depends only on stable scalar timing inputs; runtime objects and callbacks are read through refs to avoid accidental rescheduling on every render.
- `useAutoDetectDelay.ts`: Uses a manual initial delay when configured, otherwise computes dynamic delays from the full rem text, including hidden/back content.
- `useAlarmAudio.ts`: Handles best-effort alarm playback through Web Audio with unlock/resume listeners and returns explicit playback success/failure.
- `useCardTracker.ts`: Listens for RemNote events to reset state when the card ID changes.

### View Layer
- `bar.tsx`: A lightweight widget (`QueueBelowTopBar`) using `requestAnimationFrame` to draw the progress bar at 60fps without overhead.

## Development Setup

### Prerequisites
- **Node.js** 18+
- **npm** 8+

### Installation
```bash
npm install
```

### Local Development
```bash
# Start the dev server
npm run dev

# In RemNote, go to Settings > Plugins > "Develop from localhost"
# Use http://localhost:8080/
```

### Local Native-Like Development
```bash
# Start a localhost server that serves the non-sandbox bundle
npm run dev:native-like

# In RemNote, go to Settings > Plugins > "Develop from localhost"
# Use http://localhost:8080/
```

### Native Audio Testing
```bash
# Build the packaged plugin zip
npm run package:native-test
```

Then install the generated `PluginZip.zip` from this repository root into RemNote.

## Known Runtime Constraints

- `requestNative: true` is only a request. RemNote may still keep the plugin sandboxed.
- If the plugin is sandboxed, audio autoplay can be blocked, delayed, or degraded by the browser.
- The timer itself is based on normal wall-clock `Date.now()` / `setTimeout()` behavior; if alarm timing appears wrong, the first suspect is usually effect rescheduling or blocked audio playback, not "different time" in the environment.
- A previous bug caused the alarm to retrigger rapidly because the timer scheduling effect depended on unstable objects/functions while the bar rerendered every animation frame. The current implementation documents and avoids that pattern.

### Running Tests
```bash
npm run test
```

### Building for Production
```bash
npm run build
```

---

*Enhanced and maintained by **jerdaw**. Portions based on the "Queue Speed Mode" original plugin by **Jamesb**.*

# Enhanced Speed Queue (for RemNote)

A performance-focused plugin by **jerdaw** to supercharge your RemNote flashcard review speed with adaptive timers and hands-free automation.

## Quick Start

1. Install the plugin in RemNote (`Settings > Plugins > Search`).
2. Open your flashcard queue.
3. A subtle 1px progress bar fills in the top bar.
4. When time's up, a chime plays, the answer is shown, and the card is rated.

## How It Works

The plugin automatically calculates the optimal reading time for each flashcard based on its word count, then drives a 3-step state machine:

1. **⏱️ Timer** — Fills as you read. Triggers an alarm chime.
2. **⚡ Auto-Show** — Automatically reveals the answer after the alarm.
3. **🔁 Auto-Answer** — Rates the card (Again/Skip) and jumps to the next one.

## Settings

Settings are located in `Settings > Plugins > Enhanced Speed Queue`.

| Category | Setting | Description | Default |
| --- | --- | --- | --- |
| **Timer** | **Reading Speed** | How fast you read. Range 0.1x–10x. | `1.0` |
| **Alarm** | **Alarm Volume** | Off / Low / Medium / High. | `Medium` |
| **Alarm** | **Repeat (sec)** | Interval for continuous alarms. `0` = off. | `0` |
| **Auto** | **Show Answer** | Automatically reveal the answer. | ✅ On |
| **Auto** | **Answer Action** | Off / Again / Skip Card. | `Again` |
| **Display** | **Progress Bar** | Toggle the visible 1px timer. | ✅ On |

## Architecture Overview

The plugin is built with a composition-of-hooks pattern to ensure high-frequency UI updates remain smooth and predictable.

### Core Logic (Hooks)
- `useTimerStateMachine.ts`: Manages the progression from reading → showing → answering.
- `useAutoDetectDelay.ts`: Analyzes Rem text to compute dynamic delays based on character/word count.
- `useAlarmAudio.ts`: Handles the persistent audio buffer in memory to avoid clipping during fast skips.
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

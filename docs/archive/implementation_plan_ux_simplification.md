# UX Simplification Plan: `remnote-speed-queue`

## Problem

The plugin currently exposes **17 settings** to the user. For a plugin whose core value is "put time pressure on flashcard reviews," that's a lot of knobs. A new user opens the settings page and sees a wall of toggles and number fields. Several settings only matter when other settings are enabled, creating invisible dependencies. The result is decision fatigue and a settings UI that feels more like a config file than a product.

## Core Use Cases

Before cutting anything, let's define what this plugin actually does for people:

1. **⏱️ Timed pressure** — A countdown that adapts to card length, giving you just enough time to think before the alarm fires.
2. **🔔 Audible nudge** — A sound that says "time's up, decide now."
3. **⚡ Full autopilot** — For grinding through large queues: auto-show answer → auto-rate → next card, hands-free.

Everything else is configuration chrome around those three pillars.

---

## Current Settings Inventory (17 total)

| # | Setting | Core? | Verdict |
|---|---|---|---|
| 1 | Enable Progress Bar | ✅ | **KEEP** |
| 2 | Progress Bar Color | ❌ | **REMOVE** — cosmetic micro-setting; use a sensible default color that adapts to theme |
| 3 | Play Alarm Sound | ✅ | **MERGE** — volume=0 already means "off"; the toggle is redundant |
| 4 | Alarm Volume (0-100) | ✅ | **SIMPLIFY** — change from free-form number to a dropdown: Off / Low / Medium / High |
| 5 | Auto-Detect Delay | ✅ | **KEEP** (but make it the *only* mode, see below) |
| 6 | Include Answer in Auto-Detect | ⚠️ | **REMOVE** — niche. Should always include answer for accuracy; no user story for excluding it |
| 7 | Auto-Detect Delay Multiplier | ✅ | **RENAME** to "Speed" — this is the primary user dial. Reframe as a speed slider (faster ↔ slower) |
| 8 | Min Auto-Detect Limit (sec) | ⚠️ | **REMOVE** — merge into a single "Timer Range" concept or hardcode sensible bounds (2s–30s) |
| 9 | Max Auto-Detect Limit (sec) | ⚠️ | **REMOVE** — same as above |
| 10 | Manual Initial Alarm Delay (sec) | ⚠️ | **REMOVE as standalone setting** — only needed when auto-detect is off; if we make auto-detect always-on, this becomes the internal fallback constant |
| 11 | Enable Repeating Alarm | ❌ | **REMOVE toggle** — merge into interval: interval=0 means "don't repeat" |
| 12 | Repeating Alarm Interval (sec) | ⚠️ | **RENAME** to "Repeat Alarm Every (sec)" with 0=off |
| 13 | Enable Auto Show Answer | ✅ | **KEEP** |
| 14 | Show Answer Delay (sec) | ✅ | **KEEP** |
| 15 | Enable Auto Answer | ✅ | **KEEP** |
| 16 | Auto-Answer Action | ✅ | **KEEP** |
| 17 | Auto-Answer Delay (sec) | ✅ | **KEEP** |

---

## Proposed Changes

### Remove 6 settings → go from 17 to 11

| Removed Setting | Rationale |
|---|---|
| **Progress Bar Color** | Cosmetic fluff. Replace with theme-aware default (use CSS `currentColor` or a muted accent). Users who want to keep their color can always edit the CSS. |
| **Play Alarm Sound** (toggle) | Redundant — volume=Off already disables sound. The toggle just adds a second way to turn it off, creating confusion ("I have volume at 66 but sound is off?"). |
| **Include Answer in Auto-Detect** | Niche power-user toggle. Always include the answer — it makes the auto-detect more accurate, and no user has a compelling reason to exclude it. |
| **Min Auto-Detect Limit** | Hardcode to 2 seconds. No card should ever have a sub-2-second timer, and exposing this creates footgun edge cases (set to 0 → instant alarm). |
| **Max Auto-Detect Limit** | Hardcode to 30 seconds. The multiplier already lets you speed up or slow down. If someone genuinely has a card that needs >30 seconds of passive reading time, they should rethink the card. |
| **Enable Repeating Alarm** (toggle) | Merge into the interval field. `0` = no repeat. This is a standard pattern (like "snooze every X minutes, 0 to disable"). |

### Simplify 2 settings

| Setting | Change |
|---|---|
| **Alarm Volume (0-100)** | Change from free-form number input to a **dropdown**: `Off`, `Low`, `Medium`, `High`. This also absorbs the "Play Alarm Sound" toggle — "Off" = sound disabled. Maps to 0.0, 0.2, 0.5, 1.0 internally. |
| **Auto-Detect Delay Multiplier** | **Rename** to **"Reading Speed"**. Reframe the description: "How fast you read. Higher = more time per card." This is the single most important tuning dial; giving it a human name makes it accessible. |

### Always-on auto-detect

| Setting | Change |
|---|---|
| **Auto-Detect Initial Alarm Delay** (toggle) | **REMOVE** — make auto-detect always on. The "Manual Initial Alarm Delay" becomes a hardcoded internal fallback (used only when card text can't be parsed). This eliminates the entire "manual vs auto-detect" branching confusion. |

> [!IMPORTANT]
> This removes the ability to set a flat fixed timer for all cards. If you feel some users specifically want a uniform timer regardless of card content, we could keep this toggle. **Do you want to preserve a "fixed timer" mode, or is auto-detect-always the right call?**

---

## Result: 10 settings

After all changes, the settings page would be:

### Timer
| Setting | Type | Default |
|---|---|---|
| Reading Speed (multiplier) | Number | 1.0 |

### Alarm
| Setting | Type | Default |
|---|---|---|
| Alarm Volume | Dropdown: Off / Low / Med / High | Medium |
| Repeat Alarm Every (sec, 0=off) | Number | 0 |

### Automation
| Setting | Type | Default |
|---|---|---|
| Auto Show Answer | Boolean | ✅ |
| Show Answer Delay (sec after alarm) | Number | 3 |
| Auto Answer Card | Boolean | ✅ |
| Auto-Answer Action | Dropdown: Again / Skip | Again |
| Auto-Answer Delay (sec after answer) | Number | 2 |

### Display
| Setting | Type | Default |
|---|---|---|
| Show Progress Bar | Boolean | ✅ |

That's **10 settings** (down from 17), logically grouped, with zero invisible dependencies.

---

## User Review Required

> [!IMPORTANT]
> **Should auto-detect be always-on?** This removes the "fixed timer" mode. If you think some users want a uniform X-second timer for all cards, we could keep the toggle (going to 11 settings instead of 10). My recommendation is to remove it — the multiplier already gives full control.

> [!IMPORTANT]
> **Bar color removal?** The current default is `#A9A9A9` (gray). I'd replace this with a theme-aware approach using `var(--rem-text-color)` or similar. If you want to keep the color picker, say so.

> [!WARNING]
> **Manual alarm delay removal** — this setting currently acts as the fallback when auto-detect fails (e.g. card has no text, only images). I'll hardcode the fallback to **7 seconds** (the current default). If a user needs to change it, they'd adjust the speed multiplier instead. Is 7 seconds a good universal fallback?

---

## Open Questions

1. Should we keep the "Manual Initial Alarm Delay" as a hidden/advanced setting for edge-case users, or fully remove it?
2. Should the progress bar color become `currentColor` (inherits the theme's text color), or stay as the fixed gray `#A9A9A9`?
3. Any of the 6 removed settings you feel should stay?

## Verification Plan

### Functional Testing
- Verify all 10 remaining settings register correctly and are reactive
- Confirm volume dropdown maps correctly to audio levels
- Confirm alarm repeat=0 disables repeating
- Confirm auto-detect works on all card types (text, image-only, mixed)

### Regression Testing  
- Run a full queue session to ensure timer → alarm → show → answer → next card flow is unbroken
- Verify defaults produce a good out-of-the-box experience with zero configuration

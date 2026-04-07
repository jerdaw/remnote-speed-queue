# Implementation Plan - Phase 3: Advanced Optimization

Objective: Mature the plugin with advanced features for silent focus, session-level feedback, and granular control via RemNote tags.

## Proposed Changes

### 1. Visual Feedback (Screen Flash)

#### [MODIFY] [constants.ts](file:///home/jer/repos/remnote-plugins/remnote-speed-queue/src/lib/constants.ts)
- Add `ENABLE_VISUAL_FLASH_KEY` and `ALARM_FLASH_COLOR_KEY`.
- Add `PROGRESS_BAR_COLOR_KEY`.

#### [MODIFY] [index.tsx](file:///home/jer/repos/remnote-plugins/remnote-speed-queue/src/widgets/index.tsx)
- Register the new visual settings.

#### [MODIFY] [bar.tsx](file:///home/jer/repos/remnote-plugins/remnote-speed-queue/src/widgets/bar.tsx)
- Add a `fixed` position `div` that triggers a "flash" animation when `visualAlarmUntil` is active.
- Ensure `pointer-events: none` so it doesn't block interactions.

### 2. Session Stats Summary

#### [MODIFY] [useSessionStats.ts](file:///home/jer/repos/remnote-plugins/remnote-speed-queue/src/lib/hooks/useSessionStats.ts)
- Add a `resetStats` function.

#### [NEW] [useSessionSummary.ts](file:///home/jer/repos/remnote-plugins/remnote-speed-queue/src/lib/hooks/useSessionSummary.ts)
- A hook to track the "Session Lifecycle".
- Detects transition to "Queue Complete" (where `cardId` is null but the user is still in the queue view).
- Shows a summary `Toast`: "Speed Session Complete! ⚡ Answers: X | ⏭️ Skips: Y".
- Resets counts for the next session.

### 3. Per-Document Speed Overrides

#### [MODIFY] [useAutoDetectDelay.ts](file:///home/jer/repos/remnote-plugins/remnote-speed-queue/src/lib/hooks/useAutoDetectDelay.ts)
- Update to check for tags on the Rem or its ancestors.
- Logic: `const tags = await associatedRem.ancestorTagRem();`
- Look for a tag matching `Speed:<number>` (e.g. `Speed:1.5`).
- Override the `readingSpeed` multiplier if found.

### 4. Custom Colors

#### [MODIFY] [bar.tsx](file:///home/jer/repos/remnote-plugins/remnote-speed-queue/src/widgets/bar.tsx)
- Use `PROGRESS_BAR_COLOR_KEY` and `ALARM_FLASH_COLOR_KEY` from settings instead of hardcoded hex values.

## User Review Required

> [!IMPORTANT]
> **Screen Flashing**: This feature will pulse the entire viewport bright orange (or a custom color) for 1.5s when time's up. It is excellent for silent focus but can be distracting. It will be **Off** by default.
>
> **Tag Overrides**: To use this, you'll need to tag a folder/document with a Rem named exactly `Speed:1.5` (or similar). The plugin will automatically detect this and adjust the timer for all cards within that folder.

## Open Questions

- **Summary Trigger**: Should the summary appear as a Toast (temporary) or should we try to inject it into the "Queue Complete" screen (more persistent but harder to implement)?
- **Speed Tag Format**: Are you comfortable with the `#Speed:X` format, or would you prefer a different naming convention?

## Verification Plan

### Automated Tests
- `npm run test`: Update math tests to include multiplier overrides.

### Manual Verification
- **Visuals**: Verify the flash works across the whole screen.
- **Stats**: Run a small queue, answer/skip, and verify the toast appears at the end.
- **Tags**: Create a card in a folder tagged `#Speed:0.1` and verify it triggers almost instantly.

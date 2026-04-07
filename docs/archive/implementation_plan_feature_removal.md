# Implementation Plan: Removal of Summaries and Personalized Aesthetics

Objective: Fully and properly remove the Session Stats/Summary feature and the Custom Color (Personalized Aesthetics) feature from the plugin, leaving the rest of the Phase 3 functionality (Visual Flash, Tag Overrides) intact.

## Proposed Changes

### 1. Remove Session Summaries
#### [DELETE] [useSessionStats.ts](file:///home/jer/repos/remnote-plugins/remnote-speed-queue/src/lib/hooks/useSessionStats.ts)
#### [DELETE] [useSessionSummary.ts](file:///home/jer/repos/remnote-plugins/remnote-speed-queue/src/lib/hooks/useSessionSummary.ts)

#### [MODIFY] [bar.tsx](file:///home/jer/repos/remnote-plugins/remnote-speed-queue/src/widgets/bar.tsx)
- Remove `import { useSessionSummary }` and the `useSessionSummary(cardId, ...)` hook call.

#### [MODIFY] [constants.ts](file:///home/jer/repos/remnote-plugins/remnote-speed-queue/src/lib/constants.ts)
- Remove `ENABLE_SESSION_SUMMARY_KEY` and `DEFAULT_ENABLE_SESSION_SUMMARY`.

#### [MODIFY] [index.tsx](file:///home/jer/repos/remnote-plugins/remnote-speed-queue/src/widgets/index.tsx)
- Unregister the `ENABLE_SESSION_SUMMARY_KEY` setting.

#### [MODIFY] [useQueueSettings.ts](file:///home/jer/repos/remnote-plugins/remnote-speed-queue/src/lib/hooks/useQueueSettings.ts)
- Remove `enableSessionSummary` from the `advanced` settings interface and object.

### 2. Remove Personalized Aesthetics (Custom Colors)
#### [MODIFY] [constants.ts](file:///home/jer/repos/remnote-plugins/remnote-speed-queue/src/lib/constants.ts)
- Remove `ALARM_FLASH_COLOR_KEY`, `PROGRESS_BAR_COLOR_KEY`, `DEFAULT_ALARM_FLASH_COLOR`, and `DEFAULT_PROGRESS_BAR_COLOR`.

#### [MODIFY] [index.tsx](file:///home/jer/repos/remnote-plugins/remnote-speed-queue/src/widgets/index.tsx)
- Unregister the `ALARM_FLASH_COLOR_KEY` and `PROGRESS_BAR_COLOR_KEY` string settings.

#### [MODIFY] [useQueueSettings.ts](file:///home/jer/repos/remnote-plugins/remnote-speed-queue/src/lib/hooks/useQueueSettings.ts)
- Remove `alarmFlashColor` and `progressBarColor` from the `advanced` settings interface and object.

#### [MODIFY] [bar.tsx](file:///home/jer/repos/remnote-plugins/remnote-speed-queue/src/widgets/bar.tsx)
- Remove the `barColor` variable and revert the progress bar to using native theme logic directly.
- Remove the `flashColor` setting reference and revert the visual flash feature (which is being kept) to use the hardcoded amber color (`#f59e0b`).

### 3. Documentation Alignment
#### [MODIFY] [roadmap.md](file:///home/jer/repos/remnote-plugins/remnote-speed-queue/roadmap.md)
- Remove the "Session Stats" and "Color Customization" items.

#### [MODIFY] [CHANGELOG.md](file:///home/jer/repos/remnote-plugins/remnote-speed-queue/CHANGELOG.md)
- Remove mentions of Session Stats and Custom colors if they were recently added to a log.

## User Review Required

> [!WARNING]
> Please confirm: The Visual Flash feature itself (the screen pulsing when the alarm rings) **will remain**, but the ability to pick a *custom color* for the flash/bar will be removed, restoring them to standard RemNote colors.

## Verification Plan
1. Delete the files and run `npm run check-types && npm run build` to ensure no dangling variables or imports remain.
2. Verify visual flash still works with the default amber color in settings.

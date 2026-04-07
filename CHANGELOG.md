# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-04-06

### Added
- **Theme Intelligence**: Multi-mode theme detection with high-contrast color palettes for the progress bar (Bright Blue in Dark Mode, Deep Blue in Light Mode).
- **Mobile Audio Priming**: Implemented a "first-gesture" priming mechanism in `useAlarmAudio.ts` to unlock Web Audio context on mobile browsers (iOS/Android).
- **Consolidated Math Logic**: Unified word counting and timing calculations into a robust `timer-math.ts` utility.
- **Enhanced Test Suite**: Added a comprehensive suite of unit tests covering the math engine and state machine transitions.
- **Visual Screen Flash**: Optional, minimal screen-border flash overlay when the alarm triggers (off by default). Designed for silent study without seizure risk.
- **Tag-Based Speed Overrides**: Tag folders/documents with `#Speed:X` to override the global reading speed for all cards within.

### Changed
- **Visual Feedback**: The alarm is now visual-first, using the progress bar as a high-reliability fallback pulse if audio is blocked.
- **Settings Clarity**: Aligned setting titles (e.g., "Auto Timing Multiplier") with the core documentation and implementation.
- **Infrastructure**: Refactored monolithic code into the composition-of-hooks pattern (`useTimerStateMachine`, `useAlarmAudio`, `useTheme`).

### Fixed
- **Scheduler Stability**: Eliminated rapid alarm retriggering by ensuring the scheduling effect only depends on stable scalar timing inputs.
- **Timer Jitter**: Resolved race conditions where the timer could be calculated using the previous card's context during rapid reviews.
- **Stale Closures**: Improved ref-tracking for event listeners and storage setters to ensure reliability throughout the widget lifecycle.

---

## [0.1.0] - 2026-04-01
- Initial public release of Enhanced Speed Queue.

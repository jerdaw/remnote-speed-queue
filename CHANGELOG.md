# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-04-01

## [Unreleased]

### Changed
- **Alarm Semantics**: The alarm is now documented and implemented as visual-first with best-effort audio, rather than assuming audio is always available.
- **Development Workflow**: Added a `dev:native-like` localhost mode.

### Fixed
- **Scheduler Stability**: Prevented rapid alarm retriggering caused by unstable timer-effect dependencies during bar rerenders.
- **Audio Fallback**: Added a reliable visual alarm pulse when RemNote/browser runtime blocks audio playback.
- **Auto Timing Input**: Auto-detect delay now uses the full rem, including hidden/back content.

### Added
- **Native Mode**: Switched to `requestNative: true` to unlock consistent audio autoplay.
- **Persistent Audio**: Audio is now managed in JS memory to prevent cutting off during fast card skips.
- **Architectural Cleanup**: Decoupled monolithic components into hooks (`useTimerStateMachine`, `useAlarmAudio`, etc.).
- **Unit Testing Infrastructure**: Integrated Vitest for logic verification (Current work).

### Changed
- **UX Simplification**: Reduced settings from 17 down to 9 intuitive options.
- **Timer UX**: `Initial Wait Time (sec)` now controls both modes: `0` means auto, any positive value means a fixed manual delay.
- **Theme Support**: Progress bar now uses `currentColor` to match RemNote themes automatically.
- **Multiplier Renaming**: Changed "Multiplier" to "Reading Speed" for better clarity.

### Fixed
- **Timer Jitter**: Resolved a race condition where the timer was calculated for the previous card instead of the current one.
- **Audio Autoplay**: Fixed sandbox restriction issues blocking the alarm chime.
- **Stale Closures**: Fixed event listener cleanup and state ref-tracking for reliability.

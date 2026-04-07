# Roadmap - Enhanced Speed Queue

Strategic goals and planned technical improvements for the RemNote Speed Queue plugin.

## Phase 1: Core Performance & UX (Completed)

- [x] Decouple monolithic Bar logic into specialized hooks.
- [x] Implement `requestAnimationFrame` for smooth progress bar updates.
- [x] Standardize on "Auto-Detect" as the primary timer mode.
- [x] Simplify settings UI from 17 down to 9 intuitive options.
- [x] Resolve sandbox audio autoplay restrictions by switching to Native mode.

## Phase 2: Reliability & Visibility (Completed)

- [x] **Automated Testing**: Established Vitest suite for word-count (12 tests).
- [x] **Theme Intelligence**: Theme-aware progress bar (Dark/Light detection).
- [x] **Mobile Parity**: Audio context priming for mobile audio reliability.

## Phase 3: Advanced Optimization (Completed)

- [x] **Visual Feedback**: Minimal screen flash/overlay for silent focus.
- [x] **Per-Document Settings**: Tag-based speed overrides using `#Speed:X`.

## Phase 4: Adaptive Intelligence (Planned)

- [ ] **Adaptive Learning**: Automatically adjust `Reading Speed` based on recent skip/answer ratios.
- [ ] **Multi-Sound Library**: Allow choosing between different alarm tones.
- [ ] **Hotkey Overrides**: Temporary speed adjustments via hotkeys during a session.

---

*Last Updated: 2026-04-01*

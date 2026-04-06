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

## Phase 3: Advanced Optimization (Current)

- [ ] **Visual Feedback**: Subtly flash the screen or border when the alarm triggers for silent focus.
- [ ] **Session Stats**: Provide a "Speed Summary" at the end of a queue session.
- [ ] **Per-Document Settings**: Research allowing different reading speeds for specific folders.
- [ ] **Color Customization**: Allow users to pick their own progress bar colors in settings.

- [ ] **Per-Document Settings**: Allow different reading speeds for different folders or documents.
- [ ] **Session Stats**: Provide a "Speed Summary" at the end of a queue session.
- [ ] **Visual Feedback**: Subly flash the screen or border when the alarm triggers for silent focus.

---

*Last Updated: 2026-04-01*

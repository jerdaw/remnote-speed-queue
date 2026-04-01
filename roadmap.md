# Roadmap - Enhanced Speed Queue

Strategic goals and planned technical improvements for the RemNote Speed Queue plugin.

## Phase 1: Core Performance & UX (Completed)

- [x] Decouple monolithic Bar logic into specialized hooks.
- [x] Implement `requestAnimationFrame` for smooth progress bar updates.
- [x] Standardize on "Auto-Detect" as the primary timer mode.
- [x] Simplify settings UI from 17 down to 9 intuitive options.
- [x] Resolve sandbox audio autoplay restrictions by switching to Native mode.

## Phase 2: Reliability & Visibility (Current)

- [ ] **Automated Testing**: Establish a Vitest suite for non-obvious logic in hooks (e.g., word-count time calculation).
- [ ] **Theme Intelligence**: Improve detection of RemNote theme colors for the progress bar.
- [ ] **Mobile Parity**: Research workarounds for mobile audio limitations (browser-level gesture requirements).

## Phase 3: Advanced Optimization (Planned)

- [ ] **Per-Document Settings**: Allow different reading speeds for different folders or documents.
- [ ] **Session Stats**: Provide a "Speed Summary" at the end of a queue session.
- [ ] **Visual Feedback**: Subly flash the screen or border when the alarm triggers for silent focus.

---

*Last Updated: 2026-04-01*

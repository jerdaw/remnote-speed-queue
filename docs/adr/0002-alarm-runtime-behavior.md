# ADR: Alarm Runtime Behavior and Scheduler Stability

## Status

Accepted

## Context

Enhanced Speed Queue originally treated alarm audio as the primary signal and assumed that requesting native mode would be enough to make autoplay reliable.

In practice, testing showed two separate runtime realities:

1. RemNote may keep the plugin sandboxed even when `requestNative: true` is present.
2. The queue bar rerenders continuously for progress animation, so any timer scheduling effect that depends on unstable objects or callbacks can accidentally resubscribe and retrigger once the alarm deadline has already passed.

These two issues produced confusing symptoms:

- delayed or missing ding playback
- clipped or degraded audio
- repeated alarm bursts after the initial trigger
- difficulty distinguishing real timer bugs from blocked audio playback

## Decision

We will treat the alarm as:

- **visual-first and reliable**
- **audio as best effort**

Concretely:

- The top bar visually pulses when the alarm fires, regardless of audio success.
- Audio playback uses a shared Web Audio buffer and returns an explicit success/failure result.
- If playback is blocked, the plugin falls back to the visual alarm instead of assuming the runtime is broken.
- Timer scheduling effects must depend only on stable scalar timing inputs. Runtime objects (`plugin`) and live callbacks (`playAlarm`, storage setters) are read through refs.

## Consequences

### Positive

- The plugin remains usable in sandboxed RemNote runtimes.
- Alarm timing is stable even though the bar rerenders every animation frame.
- Future maintainers have an explicit guardrail: do not add unstable object/function dependencies back into the scheduling effect.

### Negative

- Audio behavior can still vary by RemNote/browser/runtime, because the environment may reject or degrade playback.
- The plugin cannot promise sound as a guaranteed cue unless RemNote truly grants native execution.

## Implementation Notes

- `useTimerStateMachine.ts` owns the stable scheduling model.
- `useAlarmAudio.ts` owns best-effort playback and runtime unlock behavior.
- `bar.tsx` renders the reliable visual fallback signal.

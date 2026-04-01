# ADR: Running as a Native Plugin for Audio Autoplay

## Context
The RemNote Speed Queue plugin automatically plays an alarm chime (`ding.mp3`) when the calculated reading timer has expired. Because it runs autonomously, this audio must play without explicit user interaction within the plugin's `QueueBelowTopBar` widget.

## Problem
When a plugin runs in Sandboxed mode (`requestNative: false`), it executes within a cross-origin `iframe`. Modern browsers enforce strict autoplay policies on `iframe` environments: they block programmatic audio playback unless there is an active user interaction directly inside the `iframe` or the `iframe` is explicitly granted `allow="autoplay"`. In RemNote, users interact with the main parent window (keyboard shortcuts) to answer flashcards, meaning the widget `iframe` never receives the user gestures required to unlock audio playback.

## Decision
We will configure the plugin to run in **Native mode** (`"requestNative": true` in `manifest.json`). Native plugins execute their code on the main RemNote thread and share the parent window's DOM context. 

By operating natively, the newly instantiated `new window.Audio()` object inherits the user's keystrokes and interactions from the RemNote queue, completely satisfying the browser's autoplay policies.

## Consequences
- **Positive:** Autonomous audio playback is completely unblocked and reliable.
- **Positive:** Using `new window.Audio()` (a JS memory object) prevents the audio from being abruptly cut off when React unmounts the visual `QueueBelowTopBar` widget during rapid flashcard skipping.
- **Negative:** Native mode requires the user to grant elevated permissions during plugin installation. Given the requirement for reliable audio, this is an acceptable tradeoff.

# Enhanced Speed Queue (for RemNote)

A plugin by **jerdaw** to supercharge your RemNote flashcard review speed and focus with highly configurable timers and automation. This plugin is built upon and significantly extends the original "Queue Speed Mode" plugin by **Jamesb**.

## Features

This plugin provides a suite of tools to help you maintain a quick and focused pace during your flashcard reviews.

-   **Dynamic Initial Timer:**
    -   **Auto-Detect Delay:** Automatically calculates an appropriate time limit based on the length of your card's content (front and optionally back).
    -   **Reading Time Multiplier:** Speed up or slow down the auto-detected time with a configurable multiplier (e.g., 0.5x for faster, 2.0x for slower).
    -   **Min/Max Safeguards:** Set minimum and maximum time limits to ensure auto-detected delays always fall within a reasonable range.
    -   **Manual Fallback:** A manual timer can be used if you prefer a fixed delay for all cards or if content analysis fails.

-   **Customizable Alarms:**
    -   **Volume Control:** Adjust the alarm sound's volume from 0 to 100.
    -   **Repeating Alarm:** Optionally set the alarm to repeat at a custom interval. The alarm will continue until you move to the next card, even after the answer is revealed.

-   **Flexible Automation:**
    -   **Auto-Show Answer:** Automatically reveal the answer after a set additive delay passes the initial alarm time.
    -   **Auto-Answer Card:** Automatically rate the card after the answer has been shown for a set duration.
    -   **Configurable Auto-Answer Action:** Choose whether the plugin automatically rates cards as **"Forgotten/Again"** or **"Skip Card"**, removing it from the current session.

-   **Minimalist Visual Cue:**
    -   A sleek, **1px tall progress bar** visually represents the initial timer.
    -   The color of the progress bar is fully customizable.
    -   The bar can be completely hidden for an even cleaner interface.

## Settings Guide

All features can be configured in RemNote via `Settings > Plugins > Enhanced Speed Queue`.

---
### General Display Settings
* **Enable Progress Bar:** Show or hide the 1px timer progress bar.
* **Progress Bar Color:** Set a custom HTML color code for the progress bar (e.g., `#A9A9A9`, `lightblue`).

---
### Initial Alarm Settings
* **Play Alarm Sound:** Toggle the alarm sound on or off.
* **Alarm Volume (0-100):** Adjust the loudness of the alarm sound.
* **Auto-Detect Initial Alarm Delay:** Enable to automatically set the timer based on card length. If disabled, the "Manual Initial Alarm Delay" is used.
* **Include Answer in Auto-Detect:** If auto-detect is on, this includes the answer text in the reading time calculation.
* **Auto-Detect Delay Multiplier:** Scales the auto-calculated time (e.g., `0.8` for 80% of the calculated time, `1.5` for 150%).
* **Min/Max Auto-Detected Delay (sec):** Sets the floor and ceiling for the auto-detected timer to ensure it's never too short or too long.
* **Manual Initial Alarm Delay (sec):** The fixed timer delay used when auto-detect is disabled.

---
### Repeating Alarm
* **Enable Repeating Alarm:** If enabled, the alarm will repeat after its initial trigger.
* **Repeating Alarm Interval (sec):** Sets how often the alarm repeats.

---
### Auto Show Answer Settings
* **Enable Auto Show Answer:** Toggle to automatically reveal the card's answer.
* **Show Answer Delay (after alarm, sec):** The additional time *after* the initial alarm sounds before the answer is shown.

---
### Auto Answer Card Settings
* **Enable Auto Answer Card:** Toggle to automatically rate the card and move to the next one.
* **Auto-Answer Action:** Choose the automatic rating:
    * **Forgotten/Again:** Rates the card as forgotten (standard SRS behavior for failed recall).
    * **Skip Card:** Removes the card from the current review session without rating it.
* **Auto-Answer Delay (after answer shown, sec):** The additional time *after* the answer is revealed before the auto-answer action is triggered.

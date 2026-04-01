import {
  WORDS_PER_MINUTE,
  AUTO_DETECT_MIN_SEC,
  AUTO_DETECT_MAX_SEC,
  DEFAULT_MANUAL_FALLBACK_DELAY,
} from '../constants';

/**
 * Calculates the reading delay in seconds based on word count and reading speed.
 * Clamps the result between AUTO_DETECT_MIN_SEC and AUTO_DETECT_MAX_SEC.
 */
export function calculateClampedDelay(
  wordCount: number,
  readingSpeed: number
): number {
  if (wordCount <= 0) {
    return DEFAULT_MANUAL_FALLBACK_DELAY;
  }

  const baseDelay = (wordCount / WORDS_PER_MINUTE) * 60;
  const scaledDelay = baseDelay * readingSpeed;
  const clampedDelay = Math.max(
    AUTO_DETECT_MIN_SEC,
    Math.min(AUTO_DETECT_MAX_SEC, scaledDelay)
  );

  return Math.round(clampedDelay);
}

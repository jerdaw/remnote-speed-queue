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

/**
 * Counts words in a string, filtering out empty entries.
 */
export function countWords(plainText: string): number {
  return plainText.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Joins front and back text with a space and trims.
 */
export function getFullRemPlainText(
  frontText: string,
  backText = ''
): string {
  return `${frontText} ${backText}`.trim();
}

/**
 * Combined high-level logic for Rem auto-detection.
 */
export function calculateAutoDetectDelayFromText(
  frontText: string,
  backText: string,
  readingSpeed: number
): { remWordCount: number; finalDelay: number } {
  const remText = getFullRemPlainText(frontText, backText);
  const remWordCount = countWords(remText);

  if (remWordCount <= 0) {
    return {
      remWordCount: 0,
      finalDelay: DEFAULT_MANUAL_FALLBACK_DELAY,
    };
  }

  return {
    remWordCount,
    finalDelay: calculateClampedDelay(remWordCount, readingSpeed),
  };
}

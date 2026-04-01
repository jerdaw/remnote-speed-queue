import { DEFAULT_MANUAL_FALLBACK_DELAY } from '../constants';
import { calculateClampedDelay } from './timer-utils';

export function countWords(plainText: string): number {
  return plainText.trim().split(/\s+/).filter(Boolean).length;
}

export function getFullRemPlainText(
  frontText: string,
  backText = ''
): string {
  return `${frontText} ${backText}`.trim();
}

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

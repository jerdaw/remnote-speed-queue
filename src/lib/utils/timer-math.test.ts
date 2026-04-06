import { describe, it, expect } from 'vitest';
import {
  calculateClampedDelay,
  countWords,
  getFullRemPlainText,
  calculateAutoDetectDelayFromText,
} from './timer-math';
import {
  AUTO_DETECT_MIN_SEC,
  AUTO_DETECT_MAX_SEC,
  DEFAULT_MANUAL_FALLBACK_DELAY,
} from '../constants';

describe('timer-math logic', () => {
  describe('calculateClampedDelay', () => {
    it('returns fallback for 0 words', () => {
      expect(calculateClampedDelay(0, 1.0)).toBe(DEFAULT_MANUAL_FALLBACK_DELAY);
    });

    it('scales delay properly within bounds', () => {
      // 200 wpm (3.33 words/s). 20 words = 6s at 1.0 speed.
      expect(calculateClampedDelay(20, 1.0)).toBe(6);
      expect(calculateClampedDelay(20, 0.5)).toBe(3);
      expect(calculateClampedDelay(20, 2.0)).toBe(12);
    });

    it('clamps to boundaries', () => {
      expect(calculateClampedDelay(1, 1.0)).toBe(AUTO_DETECT_MIN_SEC);
      expect(calculateClampedDelay(1000, 1.0)).toBe(AUTO_DETECT_MAX_SEC);
    });
  });

  describe('word counting', () => {
    it('counts words and handles whitespace', () => {
      expect(countWords('hello world')).toBe(2);
      expect(countWords('  extra   spaces  ')).toBe(2);
      expect(countWords('')).toBe(0);
    });

    it('joins text properly', () => {
      expect(getFullRemPlainText('front', 'back')).toBe('front back');
      expect(getFullRemPlainText('front', '')).toBe('front');
    });
  });

  describe('calculateAutoDetectDelayFromText', () => {
    it('performs full detection pipeline', () => {
      // 20 total words @ 1.0 speed = 6s delay.
      const result = calculateAutoDetectDelayFromText(
        '1 2 3 4 5 6 7 8 9 10',
        '11 12 13 14 15 16 17 18 19 20',
        1.0
      );
      expect(result.remWordCount).toBe(20);
      expect(result.finalDelay).toBe(6);
    });
  });
});

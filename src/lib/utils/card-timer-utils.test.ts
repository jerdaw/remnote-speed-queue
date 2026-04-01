import { describe, it, expect } from 'vitest';

import { DEFAULT_MANUAL_FALLBACK_DELAY } from '../constants';
import {
  calculateAutoDetectDelayFromText,
  countWords,
  getFullRemPlainText,
} from './card-timer-utils';

describe('card-timer-utils', () => {
  it('combines front and back text for full-rem timing', () => {
    expect(getFullRemPlainText('front prompt', 'back answer')).toBe('front prompt back answer');
  });

  it('counts words in normalized plain text', () => {
    expect(countWords('  one   two\nthree  ')).toBe(3);
  });

  it('falls back when the full rem is empty', () => {
    expect(calculateAutoDetectDelayFromText('', '', 1)).toEqual({
      remWordCount: 0,
      finalDelay: DEFAULT_MANUAL_FALLBACK_DELAY,
    });
  });

  it('includes hidden/back text in the calculated delay', () => {
    expect(calculateAutoDetectDelayFromText('one two', 'three four', 1)).toEqual({
      remWordCount: 4,
      finalDelay: 2,
    });
  });
});

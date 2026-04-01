import { describe, it, expect } from 'vitest';
import { calculateClampedDelay } from './timer-utils';
import {
  AUTO_DETECT_MIN_SEC,
  AUTO_DETECT_MAX_SEC,
  DEFAULT_MANUAL_FALLBACK_DELAY,
} from '../constants';

describe('calculateClampedDelay', () => {
  it('should return default fallback if word count is 0', () => {
    expect(calculateClampedDelay(0, 1.0)).toBe(DEFAULT_MANUAL_FALLBACK_DELAY);
  });

  it('should scale delay by reading speed', () => {
    // 200 wpm default. (40 / 200) * 60 = 12s.
    // 40 words @ 1.0 speed = 12s
    expect(calculateClampedDelay(40, 1.0)).toBe(12);
    // 40 words @ 0.5 speed = 6s
    expect(calculateClampedDelay(40, 0.5)).toBe(6);
    // 40 words @ 2.0 speed = 24s
    expect(calculateClampedDelay(40, 2.0)).toBe(24);
  });

  it('should clamp delay to minimum boundary', () => {
    // 1 word @ 1.0 speed = tiny delay
    expect(calculateClampedDelay(1, 1.0)).toBe(AUTO_DETECT_MIN_SEC);
  });

  it('should clamp delay to maximum boundary', () => {
    // 10,000 words @ 1.0 speed = massive delay
    expect(calculateClampedDelay(10000, 1.0)).toBe(AUTO_DETECT_MAX_SEC);
  });

  it('should round the final result', () => {
    // 11 words @ 1.0 speed = 3.3s -> rounds to 3
    // (11 / 200) * 60 = 3.3
    expect(calculateClampedDelay(11, 1.0)).toBe(3);
    
    // 15 words @ 1.0 speed = 4.5s -> rounds to 5
    // (15 / 200) * 60 = 4.5
    expect(calculateClampedDelay(15, 1.0)).toBe(5);
  });
});

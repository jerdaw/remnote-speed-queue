import { describe, it, expect } from 'vitest';
import { calculateDeadlines, TimerAutomationSettings } from './timer-state';

describe('calculateDeadlines', () => {
  const startTime = 1000000;
  const alarmDelay = 10; // 10s
  
  const defaultSettings: TimerAutomationSettings = {
    autoShowAnswerEnabled: true,
    additiveShowAnswerDelaySec: 3,
    autoAnswerAction: 'again',
    additiveAutoAnswerDelaySec: 2,
  };

  it('calculates perfect progression', () => {
    const deadlines = calculateDeadlines(startTime, alarmDelay, defaultSettings);
    
    // Alarm: 10s after start
    expect(deadlines.alarmMs).toBe(startTime + 10000);
    // Show Answer: 3s after alarm
    expect(deadlines.showAnswerMs).toBe(startTime + 13000);
    // Auto Answer: 2s after show answer
    expect(deadlines.autoAnswerMs).toBe(startTime + 15000);
  });

  it('disables show answer correctly', () => {
    const settings: TimerAutomationSettings = {
      ...defaultSettings,
      autoShowAnswerEnabled: false,
    };
    const deadlines = calculateDeadlines(startTime, alarmDelay, settings);
    
    expect(deadlines.alarmMs).toBe(startTime + 10000);
    expect(deadlines.showAnswerMs).toBe(Infinity);
    // If show answer is disabled, auto answer happens based on the alarm + additive delay?
    // Wait, let's check my logic in timer-state.ts.
    // (settings.autoShowAnswerEnabled ? showAnswerMs : alarmMs) + settings.additiveAutoAnswerDelaySec * 1000
    expect(deadlines.autoAnswerMs).toBe(startTime + 12000);
  });

  it('disables auto answer correctly', () => {
    const settings: TimerAutomationSettings = {
      ...defaultSettings,
      autoAnswerAction: 'off',
    };
    const deadlines = calculateDeadlines(startTime, alarmDelay, settings);
    
    expect(deadlines.alarmMs).toBe(startTime + 10000);
    expect(deadlines.showAnswerMs).toBe(startTime + 13000);
    expect(deadlines.autoAnswerMs).toBe(Infinity);
  });
});

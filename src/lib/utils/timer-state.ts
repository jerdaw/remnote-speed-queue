export interface TimerDeadlines {
  alarmMs: number;
  showAnswerMs: number;
  autoAnswerMs: number;
}

export interface TimerAutomationSettings {
  autoShowAnswerEnabled: boolean;
  additiveShowAnswerDelaySec: number;
  autoAnswerAction: 'off' | 'again' | 'skip';
  additiveAutoAnswerDelaySec: number;
}

/**
 * Calculates absolute deadlines in milliseconds for the three stages of the speed queue.
 */
export function calculateDeadlines(
  startTimeMs: number,
  alarmDelaySec: number,
  settings: TimerAutomationSettings
): TimerDeadlines {
  const alarmMs = startTimeMs + alarmDelaySec * 1000;
  
  const showAnswerMs = settings.autoShowAnswerEnabled
    ? alarmMs + settings.additiveShowAnswerDelaySec * 1000
    : Infinity;
    
  const autoAnswerMs = settings.autoAnswerAction !== 'off'
    ? (settings.autoShowAnswerEnabled ? showAnswerMs : alarmMs) + settings.additiveAutoAnswerDelaySec * 1000
    : Infinity;

  return {
    alarmMs,
    showAnswerMs,
    autoAnswerMs,
  };
}

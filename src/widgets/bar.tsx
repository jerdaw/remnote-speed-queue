import React from 'react';
import { usePlugin, renderWidget } from '@remnote/plugin-sdk';
import clsx from 'clsx';

import { useQueueSettings } from '../lib/hooks/useQueueSettings';
import { useCardTracker } from '../lib/hooks/useCardTracker';
import { useAutoDetectDelay } from '../lib/hooks/useAutoDetectDelay';
import { useAlarmAudio } from '../lib/hooks/useAlarmAudio';
import { useTimerStateMachine } from '../lib/hooks/useTimerStateMachine';

export function Bar() {
  const plugin = usePlugin();
  const settings = useQueueSettings();
  const { cardId } = useCardTracker();
  const alarmDelaySec = useAutoDetectDelay(cardId, settings.timer.readingSpeed);
  const { audioRef, playAlarm, clearContinuousAlarm, continuousAlarmIntervalRef } = useAlarmAudio(settings.alarm);
  const { startTime } = useTimerStateMachine(
    cardId,
    alarmDelaySec,
    { alarm: settings.alarm, auto: settings.auto },
    playAlarm,
    clearContinuousAlarm,
    continuousAlarmIntervalRef
  );

  // Progress bar animation (rAF-based)
  const nowRef = React.useRef(Date.now());
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  React.useEffect(() => {
    let rafId: number;
    const tick = () => {
      nowRef.current = Date.now();
      forceUpdate();
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const alarmDelayMs = alarmDelaySec * 1000;

  const width = Math.min(
    100,
    alarmDelayMs > 0 && startTime
      ? ((nowRef.current - startTime) / alarmDelayMs) * 100
      : 0
  );

  return (
    <div className="w-[100%]">
      {settings.display.enableProgressBar && (
        <div
          className={clsx(width === 100 && alarmDelayMs > 0 && 'animate-pulse')}
          style={{
            height: '1px',
            backgroundColor: 'currentColor',
            opacity: 0.4,
            width: `${width}%`,
          }}
        ></div>
      )}
      <audio ref={audioRef} src={plugin.rootURL ? `${plugin.rootURL}ding.mp3` : ''} />
    </div>
  );
}

renderWidget(Bar);

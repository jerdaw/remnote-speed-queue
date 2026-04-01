import React from 'react';
import { renderWidget } from '@remnote/plugin-sdk';
import clsx from 'clsx';

import { useQueueSettings } from '../lib/hooks/useQueueSettings';
import { useCardTracker } from '../lib/hooks/useCardTracker';
import { useAutoDetectDelay } from '../lib/hooks/useAutoDetectDelay';
import { useAlarmAudio } from '../lib/hooks/useAlarmAudio';
import { useTimerStateMachine } from '../lib/hooks/useTimerStateMachine';

export function Bar() {
  const settings = useQueueSettings();
  const { cardId } = useCardTracker();
  const delayState = useAutoDetectDelay(
    cardId,
    settings.timer.readingSpeed,
    settings.timer.initialDelaySec
  );
  const { playAlarm } = useAlarmAudio(settings.alarm);
  const { startTime, visualAlarmUntil } = useTimerStateMachine(
    cardId,
    delayState.alarmDelaySec,
    delayState.isResolved && delayState.resolvedCardId === cardId,
    { alarm: settings.alarm, auto: settings.auto },
    playAlarm
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

  const alarmDelayMs = delayState.alarmDelaySec * 1000;
  const visualAlarmActive = visualAlarmUntil !== null && nowRef.current <= visualAlarmUntil;

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
          className={clsx((width === 100 || visualAlarmActive) && alarmDelayMs > 0 && 'animate-pulse')}
          style={{
            height: visualAlarmActive ? '4px' : '2px',
            backgroundColor: visualAlarmActive
              ? 'var(--rn-clr-background-orange, #f59e0b)'
              : 'var(--rn-clr-content-accent, currentColor)',
            boxShadow: visualAlarmActive ? '0 0 0 1px rgba(245, 158, 11, 0.2)' : 'none',
            opacity: visualAlarmActive ? 1 : 0.8,
            width: visualAlarmActive ? '100%' : `${width}%`,
            transition: 'height 120ms ease, opacity 120ms ease, width 120ms linear',
          }}
        ></div>
      )}
    </div>
  );
}

renderWidget(Bar);

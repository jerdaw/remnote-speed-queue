import React from 'react';
import { renderWidget } from '@remnote/plugin-sdk';
import clsx from 'clsx';

import { useQueueSettings } from '../lib/hooks/useQueueSettings';
import { useCardTracker } from '../lib/hooks/useCardTracker';
import { useAutoDetectDelay } from '../lib/hooks/useAutoDetectDelay';
import { useAlarmAudio } from '../lib/hooks/useAlarmAudio';
import { useTimerStateMachine } from '../lib/hooks/useTimerStateMachine';
import { useTheme } from '../lib/hooks/useTheme';

export function Bar() {
  const settings = useQueueSettings();
  const { isDark } = useTheme();
  const { cardId } = useCardTracker();
  const delayState = useAutoDetectDelay(
    cardId,
    settings.timer.readingSpeed,
    settings.timer.initialDelaySec,
    settings.advanced.enableTagOverrides
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

  const barColor = isDark
    ? 'var(--rn-clr-content-accent, #3b82f6)' // Bright blue in dark mode
    : 'var(--rn-clr-content-accent, #2563eb)'; // Strong blue in light mode

  const flashColor = 'var(--rn-clr-background-orange, #f59e0b)';

  return (
    <>
      {/* Screen Flash Overlay */}
      {settings.advanced.enableVisualFlash && visualAlarmActive && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
            zIndex: 9999,
            border: `2px solid ${flashColor}`,
            backgroundColor: 'transparent',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }}
        />
      )}

      <div className="w-[100%]">
        {settings.display.enableProgressBar && (
          <div
            className={clsx((width === 100 || visualAlarmActive) && alarmDelayMs > 0 && 'animate-pulse')}
            style={{
              height: visualAlarmActive ? '4px' : '2px',
              backgroundColor: visualAlarmActive
                ? flashColor
                : barColor,
              boxShadow: visualAlarmActive
                ? `0 0 10px ${flashColor}`
                : isDark
                  ? `0 0 4px ${barColor}4D` // 30% opacity
                  : 'none',
              opacity: visualAlarmActive ? 1 : 0.7,
              width: visualAlarmActive ? '100%' : `${width}%`,
              transition: 'height 120ms ease, opacity 120ms ease, background-color 200ms ease',
            }}
          ></div>
        )}
      </div>
    </>
  );
}

renderWidget(Bar);

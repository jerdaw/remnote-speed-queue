import {
  AppEvents,
  QueueInteractionScore,
  WidgetLocation,
  renderWidget,
  useAPIEventListener,
  usePlugin,
  useTracker,
} from '@remnote/plugin-sdk';
import React from 'react';
import {
  PLAY_ALARM_SOUND_KEY,
  INITIAL_ALARM_DELAY_KEY,
  AUTO_SHOW_ANSWER_KEY,
  ADDITIVE_SHOW_ANSWER_DELAY_KEY,
  AUTO_ANSWER_KEY,
  ADDITIVE_AUTO_ANSWER_DELAY_KEY,
  AUTO_ANSWER_ACTION_KEY,
  CONTINUOUS_ALARM_KEY, 
  CONTINUOUS_ALARM_INTERVAL_KEY, 

  DEFAULT_INITIAL_ALARM_DELAY,
  DEFAULT_ADDITIVE_SHOW_ANSWER_DELAY,
  DEFAULT_ADDITIVE_AUTO_ANSWER_DELAY,
  DEFAULT_AUTO_ANSWER_ACTION,
  DEFAULT_CONTINUOUS_ALARM, 
  DEFAULT_CONTINUOUS_ALARM_INTERVAL, 

  BAR_COLOR_KEY,
  DEFAULT_BAR_COLOR,
} from '../lib/constants';
import clsx from 'clsx';

export function Bar() {
  const plugin = usePlugin();
  const [cardId, setCardId] = React.useState<string | null>(null);

  useTracker(async (rp) => {
    const ctx = await rp.widget.getWidgetContext<WidgetLocation.QueueBelowTopBar>();
    setCardId(ctx?.cardId || null);
  }, []);

  useAPIEventListener(AppEvents.QueueCompleteCard, undefined, async () => {
    setTimeout(async () => {
      const ctx = await plugin.widget.getWidgetContext<WidgetLocation.QueueBelowTopBar>();
      setCardId(ctx?.cardId || null);
    }, 100);
  });

  // --- Fetch Settings ---
  const barColor = useTracker(
    async (rp) => await rp.settings.getSetting<string>(BAR_COLOR_KEY),
    []
  ) || DEFAULT_BAR_COLOR;

  const initialAlarmDelaySec = useTracker(
    async (rp) => await rp.settings.getSetting<number>(INITIAL_ALARM_DELAY_KEY),
    []
  ) || DEFAULT_INITIAL_ALARM_DELAY;

  const additiveShowAnswerDelaySec = useTracker(
    async (rp) => await rp.settings.getSetting<number>(ADDITIVE_SHOW_ANSWER_DELAY_KEY),
    []
  ) || DEFAULT_ADDITIVE_SHOW_ANSWER_DELAY;

  const additiveAutoAnswerDelaySec = useTracker(
    async (rp) => await rp.settings.getSetting<number>(ADDITIVE_AUTO_ANSWER_DELAY_KEY),
    []
  ) || DEFAULT_ADDITIVE_AUTO_ANSWER_DELAY;

  const autoShowAnswerEnabled = useTracker(
    async (rp) => await rp.settings.getSetting<boolean>(AUTO_SHOW_ANSWER_KEY),
    []
  );

  const autoAnswerEnabled = useTracker(
    async (rp) => await rp.settings.getSetting<boolean>(AUTO_ANSWER_KEY),
    []
  );

  const autoAnswerAction = useTracker(
    async (rp) => await rp.settings.getSetting<string>(AUTO_ANSWER_ACTION_KEY),
    []
  ) || DEFAULT_AUTO_ANSWER_ACTION;

  const playAlarmSoundEnabled = useTracker(
    async (rp) => await rp.settings.getSetting<boolean>(PLAY_ALARM_SOUND_KEY),
    []
  );

  const continuousAlarmEnabled = useTracker(
    async (rp) => await rp.settings.getSetting<boolean>(CONTINUOUS_ALARM_KEY),
    []
  ) ?? DEFAULT_CONTINUOUS_ALARM; 

  const continuousAlarmIntervalSec = useTracker(
    async (rp) => await rp.settings.getSetting<number>(CONTINUOUS_ALARM_INTERVAL_KEY),
    []
  ) || DEFAULT_CONTINUOUS_ALARM_INTERVAL;


  // --- Calculate Effective Trigger Times in Milliseconds (Additive Logic) ---
  const alarmTriggerTimeMs = initialAlarmDelaySec * 1000;
  const showAnswerTriggerTimeMs = (initialAlarmDelaySec + additiveShowAnswerDelaySec) * 1000;
  const autoAnswerTriggerTimeMs = (initialAlarmDelaySec + additiveShowAnswerDelaySec + additiveAutoAnswerDelaySec) * 1000;

  const audioRef = React.useRef<HTMLAudioElement>(null);
  const continuousAlarmIntervalRef = React.useRef<NodeJS.Timeout | null>(null); 

  const [isAnswerRevealedForCard, setIsAnswerRevealedForCard] = React.useState(false); 

  const clearContinuousAlarm = () => {
    if (continuousAlarmIntervalRef.current) {
      clearInterval(continuousAlarmIntervalRef.current);
      continuousAlarmIntervalRef.current = null;
    }
  };

  const playAlarm = async () => {
    if (playAlarmSoundEnabled && audioRef.current) {
      audioRef.current.play();
    }
  };

  const [startTime, setStartTime] = React.useState<number | null>(null);
  const [playedAlarm, setPlayedAlarm] = React.useState(false); 
  const [answered, setAnswered] = React.useState(false);


  React.useEffect(() => {
    const actualContinuousIntervalMs = Math.max(1000, continuousAlarmIntervalSec * 1000); 

    const ivl = setInterval(async () => {
      const now = Date.now();
      if (!cardId || !startTime || (await plugin.queue.isTypeAnswerEnabled())) {
        return;
      }

      const elapsedTime = now - startTime;

      // 1. Play Initial Alarm & Start Continuous Alarm if enabled
      if (!playedAlarm && elapsedTime > alarmTriggerTimeMs) {
        playAlarm(); 
        setPlayedAlarm(true);

        if (continuousAlarmEnabled && !isAnswerRevealedForCard) {
          clearContinuousAlarm(); 
          continuousAlarmIntervalRef.current = setInterval(() => {
            if (!isAnswerRevealedForCard) { 
                playAlarm();
            } else {
                clearContinuousAlarm(); 
            }
          }, actualContinuousIntervalMs);
        }
      }
      
      // 2. Auto Show Answer
      if (!isAnswerRevealedForCard && autoShowAnswerEnabled && elapsedTime > showAnswerTriggerTimeMs) {
        await plugin.queue.showAnswer();
        setIsAnswerRevealedForCard(true); 
        clearContinuousAlarm(); 
      }

      // 3. Auto Answer Card
      if (!answered && autoAnswerEnabled && elapsedTime > autoAnswerTriggerTimeMs) {
        if (autoAnswerAction === 'skip') {
          await plugin.queue.removeCurrentCardFromQueue(false);
          plugin.app.toast('Card Skipped.');
        } else { 
          await plugin.queue.rateCurrentCard(QueueInteractionScore.AGAIN);
        }
        setAnswered(true);
        clearContinuousAlarm(); 
      }
    }, 300);

    return () => {
      clearInterval(ivl);
      clearContinuousAlarm(); 
    };
  }, [
    cardId,
    startTime,
    alarmTriggerTimeMs,
    showAnswerTriggerTimeMs,
    autoAnswerTriggerTimeMs,
    autoShowAnswerEnabled,
    autoAnswerEnabled,
    autoAnswerAction,
    playAlarmSoundEnabled,
    playedAlarm,
    isAnswerRevealedForCard, 
    answered,
    plugin,
    continuousAlarmEnabled, 
    continuousAlarmIntervalSec, 
  ]);

  React.useEffect(() => {
    if (cardId) {
      setStartTime(Date.now());
      setAnswered(false);
      setPlayedAlarm(false);
      setIsAnswerRevealedForCard(false); 
      clearContinuousAlarm(); 
    }
  }, [cardId]);

  const [now, setNow] = React.useState(Date.now());
  React.useEffect(() => {
    const ivl = setInterval(() => {
      setNow(Date.now());
    }, 10);
    return () => {
      clearInterval(ivl);
    };
  }, []);

  const currentInitialAlarmDelayMs = initialAlarmDelaySec * 1000;
  const width = Math.min(
    100,
    currentInitialAlarmDelayMs > 0 ? 
      ((now - (startTime || now)) / currentInitialAlarmDelayMs) * 100 : 
      (playedAlarm ? 100 : 0)
  );

  return (
    <div className="w-[100%]">
      <div
        className={clsx(width === 100 && currentInitialAlarmDelayMs > 0 && 'animate-pulse')}
        style={{
          height: '1px',
          backgroundColor: barColor,
          width: `${width}%`,
        }}
      ></div>
      <audio ref={audioRef} src={plugin.rootURL + 'ding.mp3'} />
    </div>
  );
}

renderWidget(Bar);

import {
  AppEvents,
  QueueInteractionScore,
  WidgetLocation,
  renderWidget,
  useAPIEventListener,
  usePlugin,
  useTracker,
  Rem, 
  Card, 
  RichTextInterface 
} from '@remnote/plugin-sdk';
import React from 'react';
import {
  ENABLE_PROGRESS_BAR_KEY, 
  BAR_COLOR_KEY,
  PLAY_ALARM_SOUND_KEY,
  ALARM_VOLUME_KEY, 
  ENABLE_AUTO_DETECT_DELAY_KEY, 
  INCLUDE_ANSWER_IN_AUTO_DETECT_KEY, 
  AUTO_DETECT_DELAY_MULTIPLIER_KEY, 
  MIN_AUTO_DETECT_LIMIT_KEY, 
  MAX_AUTO_DETECT_LIMIT_KEY, 
  INITIAL_ALARM_DELAY_KEY,      
  CONTINUOUS_ALARM_KEY, 
  CONTINUOUS_ALARM_INTERVAL_KEY, 
  AUTO_SHOW_ANSWER_KEY,
  ADDITIVE_SHOW_ANSWER_DELAY_KEY,
  AUTO_ANSWER_KEY,
  ADDITIVE_AUTO_ANSWER_DELAY_KEY,
  AUTO_ANSWER_ACTION_KEY,

  DEFAULT_ENABLE_PROGRESS_BAR, 
  DEFAULT_BAR_COLOR,
  DEFAULT_ALARM_VOLUME, 
  DEFAULT_ENABLE_AUTO_DETECT_DELAY, 
  DEFAULT_INCLUDE_ANSWER_IN_AUTO_DETECT, 
  DEFAULT_AUTO_DETECT_DELAY_MULTIPLIER, 
  DEFAULT_MIN_AUTO_DETECT_LIMIT, 
  DEFAULT_MAX_AUTO_DETECT_LIMIT, 
  DEFAULT_INITIAL_ALARM_DELAY,
  WORDS_PER_MINUTE,                 
  MIN_AUTO_DETECT_MULTIPLIER,       
  MAX_AUTO_DETECT_MULTIPLIER,       
  DEFAULT_ADDITIVE_SHOW_ANSWER_DELAY,
  DEFAULT_ADDITIVE_AUTO_ANSWER_DELAY,
  DEFAULT_AUTO_ANSWER_ACTION,
  DEFAULT_CONTINUOUS_ALARM, 
  DEFAULT_CONTINUOUS_ALARM_INTERVAL, 
} from '../lib/constants';
import clsx from 'clsx';

const COMPONENT_NAME = "EnhancedSpeedQueueBar";

export function Bar() {
  const plugin = usePlugin();
  const [cardId, setCardId] = React.useState<string | null>(null);
  
  const [currentInitialAlarmDelaySec, setCurrentInitialAlarmDelaySec] = React.useState(DEFAULT_INITIAL_ALARM_DELAY);

  // --- Fetch Settings ---
  const manualInitialAlarmDelaySec = useTracker(async (rp) => rp.settings.getSetting<number>(INITIAL_ALARM_DELAY_KEY), []) || DEFAULT_INITIAL_ALARM_DELAY;
  const enableAutoDetectDelay = useTracker(async (rp) => rp.settings.getSetting<boolean>(ENABLE_AUTO_DETECT_DELAY_KEY), []) ?? DEFAULT_ENABLE_AUTO_DETECT_DELAY;
  const includeAnswerInAutoDetect = useTracker(async (rp) => rp.settings.getSetting<boolean>(INCLUDE_ANSWER_IN_AUTO_DETECT_KEY), []) ?? DEFAULT_INCLUDE_ANSWER_IN_AUTO_DETECT;
  const autoDetectDelayMultiplierSetting = useTracker(async (rp) => rp.settings.getSetting<number>(AUTO_DETECT_DELAY_MULTIPLIER_KEY), []) ?? DEFAULT_AUTO_DETECT_DELAY_MULTIPLIER;
  const minAutoDetectLimitSec = useTracker(async (rp) => rp.settings.getSetting<number>(MIN_AUTO_DETECT_LIMIT_KEY), []) ?? DEFAULT_MIN_AUTO_DETECT_LIMIT; 
  const maxAutoDetectLimitSec = useTracker(async (rp) => rp.settings.getSetting<number>(MAX_AUTO_DETECT_LIMIT_KEY), []) ?? DEFAULT_MAX_AUTO_DETECT_LIMIT; 

  const barColor = useTracker(async (rp) => rp.settings.getSetting<string>(BAR_COLOR_KEY), []) || DEFAULT_BAR_COLOR;
  const additiveShowAnswerDelaySec = useTracker(async (rp) => rp.settings.getSetting<number>(ADDITIVE_SHOW_ANSWER_DELAY_KEY), []) || DEFAULT_ADDITIVE_SHOW_ANSWER_DELAY;
  const additiveAutoAnswerDelaySec = useTracker(async (rp) => rp.settings.getSetting<number>(ADDITIVE_AUTO_ANSWER_DELAY_KEY), []) || DEFAULT_ADDITIVE_AUTO_ANSWER_DELAY;
  const autoShowAnswerEnabled = useTracker(async (rp) => rp.settings.getSetting<boolean>(AUTO_SHOW_ANSWER_KEY), []) ?? false; 
  const autoAnswerEnabled = useTracker(async (rp) => rp.settings.getSetting<boolean>(AUTO_ANSWER_KEY), []) ?? false; 
  const autoAnswerAction = useTracker(async (rp) => rp.settings.getSetting<string>(AUTO_ANSWER_ACTION_KEY), []) || DEFAULT_AUTO_ANSWER_ACTION;
  const playAlarmSoundEnabled = useTracker(async (rp) => rp.settings.getSetting<boolean>(PLAY_ALARM_SOUND_KEY), []) ?? false; 
  const alarmVolumeSetting = useTracker(async (rp) => rp.settings.getSetting<number>(ALARM_VOLUME_KEY), []) ?? DEFAULT_ALARM_VOLUME;
  const continuousAlarmEnabled = useTracker(async (rp) => rp.settings.getSetting<boolean>(CONTINUOUS_ALARM_KEY), []) ?? DEFAULT_CONTINUOUS_ALARM; 
  const continuousAlarmIntervalSec = useTracker(async (rp) => rp.settings.getSetting<number>(CONTINUOUS_ALARM_INTERVAL_KEY), []) || DEFAULT_CONTINUOUS_ALARM_INTERVAL;
  const enableProgressBar = useTracker(async (rp) => rp.settings.getSetting<boolean>(ENABLE_PROGRESS_BAR_KEY), []) ?? DEFAULT_ENABLE_PROGRESS_BAR;

  useTracker(async (rp) => {
    const ctx = await rp.widget.getWidgetContext<WidgetLocation.QueueBelowTopBar>();
    setCardId(ctx?.cardId || null);
  }, []);

  useAPIEventListener(AppEvents.QueueCompleteCard, undefined, async () => {
    setTimeout(async () => {
      const oldCardIdInEvent = cardId; 
      const ctx = await plugin.widget.getWidgetContext<WidgetLocation.QueueBelowTopBar>();
      if (ctx?.cardId !== oldCardIdInEvent) {
        setCardId(ctx?.cardId || null);
      } else if (!ctx?.cardId && oldCardIdInEvent) { 
        setCardId(null);
      }
    }, 150); 
  });
  
  React.useEffect(() => {
    const calculateAndSetDelay = async () => {
      if (!cardId) {
        setCurrentInitialAlarmDelaySec(manualInitialAlarmDelaySec); 
        return;
      }

      if (enableAutoDetectDelay) {
        try {
          const currentCardObject = await plugin.queue.getCurrentCard(); 
          let frontRichText: RichTextInterface | undefined = undefined;
          let backRichText: RichTextInterface | undefined = undefined;

          if (currentCardObject) {
            const associatedRem = await currentCardObject.getRem();
            if (associatedRem) {
              frontRichText = associatedRem.text;
              if (includeAnswerInAutoDetect) {
                backRichText = associatedRem.backText;
              }
            }
          }
          
          let plainText = '';
          if (frontRichText) {
            plainText += await plugin.richText.toString(frontRichText);
          }
          if (backRichText) {
            plainText += ' ' + await plugin.richText.toString(backRichText);
          }
          
          if (plainText.trim()) {
            const words = plainText.split(/\s+/).filter(Boolean); 
            const wordCount = words.length;
            
            if (wordCount > 0) {
              const baseCalculatedDelay = (wordCount / WORDS_PER_MINUTE) * 60;
              const effectiveMultiplier = Math.max(MIN_AUTO_DETECT_MULTIPLIER, Math.min(MAX_AUTO_DETECT_MULTIPLIER, autoDetectDelayMultiplierSetting));
              const multipliedDelay = baseCalculatedDelay * effectiveMultiplier;
              const clampedDelay = Math.max(minAutoDetectLimitSec, Math.min(maxAutoDetectLimitSec, multipliedDelay));
              
              // Only log the final results line
              console.log(`[${COMPONENT_NAME}] AutoDetect Results for ${cardId}: Words=${wordCount}, BaseCalc=${baseCalculatedDelay.toFixed(2)}s, Multiplier=${effectiveMultiplier.toFixed(1)}x, Final Clamped Delay=${Math.round(clampedDelay)}s`);

              setCurrentInitialAlarmDelaySec(Math.round(clampedDelay));
            } else {
              setCurrentInitialAlarmDelaySec(manualInitialAlarmDelaySec);
            }
          } else {
            setCurrentInitialAlarmDelaySec(manualInitialAlarmDelaySec);
          }
        } catch (error) {
          console.error(`[${COMPONENT_NAME}] Error auto-detecting delay:`, error);
          setCurrentInitialAlarmDelaySec(manualInitialAlarmDelaySec); 
        }
      } else {
        setCurrentInitialAlarmDelaySec(manualInitialAlarmDelaySec);
      }
    };

    calculateAndSetDelay();
  }, [cardId, enableAutoDetectDelay, includeAnswerInAutoDetect, manualInitialAlarmDelaySec, autoDetectDelayMultiplierSetting, minAutoDetectLimitSec, maxAutoDetectLimitSec, plugin]); 
  
  const alarmTriggerTimeMs = currentInitialAlarmDelaySec * 1000;
  const showAnswerTriggerTimeMs = (currentInitialAlarmDelaySec + additiveShowAnswerDelaySec) * 1000;
  const autoAnswerTriggerTimeMs = (currentInitialAlarmDelaySec + additiveShowAnswerDelaySec + additiveAutoAnswerDelaySec) * 1000;

  const audioRef = React.useRef<HTMLAudioElement>(null);
  const continuousAlarmIntervalRef = React.useRef<NodeJS.Timeout | null>(null); 

  const [startTime, setStartTime] = React.useState<number | null>(null);
  
  const [playedAlarm, setPlayedAlarm] = React.useState(false); 
  const [isAnswerShownByPlugin, setIsAnswerShownByPlugin] = React.useState(false); 
  const [answered, setAnswered] = React.useState(false);

  const playedAlarmRef = React.useRef(playedAlarm);
  const isAnswerShownByPluginRef = React.useRef(isAnswerShownByPlugin);
  const answeredRef = React.useRef(answered);

  React.useEffect(() => { playedAlarmRef.current = playedAlarm; }, [playedAlarm]);
  React.useEffect(() => { isAnswerShownByPluginRef.current = isAnswerShownByPlugin; }, [isAnswerShownByPlugin]);
  React.useEffect(() => { answeredRef.current = answered; }, [answered]);

  const clearContinuousAlarm = React.useCallback(() => {
    if (continuousAlarmIntervalRef.current) {
      clearInterval(continuousAlarmIntervalRef.current);
      continuousAlarmIntervalRef.current = null;
    }
  }, []); 

  const playAlarm = React.useCallback(async () => {
    if (playAlarmSoundEnabled && audioRef.current) {
      let newVolume = (alarmVolumeSetting ?? DEFAULT_ALARM_VOLUME) / 100;
      newVolume = Math.max(0, Math.min(1, newVolume)); 
      audioRef.current.volume = newVolume;
      try {
        if (audioRef.current.paused || audioRef.current.ended) {
            audioRef.current.currentTime = 0; 
            await audioRef.current.play();
        } else {
            audioRef.current.currentTime = 0;
            await audioRef.current.play();
        }
      } catch (error) {
        console.error(`[EnhancedSpeedQueueBar] Error playing audio:`, error);
      }
    }
  }, [playAlarmSoundEnabled, alarmVolumeSetting]);
  
  React.useEffect(() => {
    clearContinuousAlarm(); 
    const actualContinuousIntervalMs = Math.max(1000, continuousAlarmIntervalSec * 1000); 

    if (!cardId || !startTime) {
        return () => { clearContinuousAlarm(); };
    }

    const ivl = setInterval(async () => {
      const now = Date.now();
      if (!startTime) return; 
      const elapsedTime = now - startTime;

      if (!playedAlarmRef.current && elapsedTime > alarmTriggerTimeMs) {
        playAlarm(); 
        setPlayedAlarm(true); 
        if (continuousAlarmEnabled) { 
          continuousAlarmIntervalRef.current = setInterval(() => {
            playAlarm(); 
          }, actualContinuousIntervalMs);
        }
      }
      
      if (!isAnswerShownByPluginRef.current && autoShowAnswerEnabled && elapsedTime > showAnswerTriggerTimeMs) {
        await plugin.queue.showAnswer();
        setIsAnswerShownByPlugin(true); 
      }

      if (!answeredRef.current && autoAnswerEnabled && elapsedTime > autoAnswerTriggerTimeMs) {
        const currentCardIdBeforeAction = cardId; 
        if (autoAnswerAction === 'skip') {
          await plugin.queue.removeCurrentCardFromQueue(false);
          plugin.app.toast('Card Skipped.');
          setTimeout(async () => {
            const newCtx = await plugin.widget.getWidgetContext<WidgetLocation.QueueBelowTopBar>();
            if (newCtx?.cardId !== currentCardIdBeforeAction) {
              setCardId(newCtx?.cardId || null);
            } else if (!newCtx?.cardId && currentCardIdBeforeAction) { 
                setCardId(null);
            }
          }, 200); 
        } else { 
          await plugin.queue.rateCurrentCard(QueueInteractionScore.AGAIN);
        }
        setAnswered(true); 
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
    continuousAlarmEnabled, 
    continuousAlarmIntervalSec, 
    playAlarm, 
    clearContinuousAlarm,
    plugin, 
  ]);

  React.useEffect(() => {
    if (cardId) {
      setStartTime(Date.now());
      setAnswered(false);
      setPlayedAlarm(false); 
      setIsAnswerShownByPlugin(false); 
    } else {
        clearContinuousAlarm();
        setStartTime(null); 
    }
  }, [cardId, clearContinuousAlarm]); 

  const [now, setNow] = React.useState(Date.now());
  React.useEffect(() => {
    const ivl = setInterval(() => { setNow(Date.now()); }, 10);
    return () => { clearInterval(ivl); };
  }, []);

  const currentInitialAlarmDelayMsForBar = currentInitialAlarmDelaySec * 1000;
  const width = Math.min(
    100,
    currentInitialAlarmDelayMsForBar > 0 && startTime ? 
      ((now - startTime) / currentInitialAlarmDelayMsForBar) * 100 : 
      (playedAlarm ? 100 : 0) 
  );

  return (
    <div className="w-[100%]"> 
      {enableProgressBar && (
        <div
          className={clsx(width === 100 && currentInitialAlarmDelayMsForBar > 0 && 'animate-pulse')}
          style={{
            height: '1px',
            backgroundColor: barColor,
            width: `${width}%`,
          }}
        ></div>
      )}
      <audio ref={audioRef} src={plugin.rootURL + 'ding.mp3'} />
    </div>
  );
}

renderWidget(Bar);

import { useRef, useCallback } from 'react';
import { QueueSettings } from './useQueueSettings';
import { ALARM_VOLUME_MAP } from '../constants';

export function useAlarmAudio(settings: QueueSettings['alarm']) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const continuousAlarmIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearContinuousAlarm = useCallback(() => {
    if (continuousAlarmIntervalRef.current) {
      clearInterval(continuousAlarmIntervalRef.current);
      continuousAlarmIntervalRef.current = null;
    }
  }, []);

  const playAlarm = useCallback(async () => {
    if (settings.volume === 'off' || !audioRef.current) return;

    const volumeLevel = ALARM_VOLUME_MAP[settings.volume] ?? ALARM_VOLUME_MAP['medium'];
    audioRef.current.volume = volumeLevel;

    try {
      audioRef.current.currentTime = 0;
      await audioRef.current.play();
    } catch (error) {
      console.warn("EnhancedSpeedQueue: Failed to play alarm audio. This is normal if the user hasn't interacted with the page yet.", error);
    }
  }, [settings.volume]);

  return {
    audioRef,
    playAlarm,
    clearContinuousAlarm,
    continuousAlarmIntervalRef,
  };
}

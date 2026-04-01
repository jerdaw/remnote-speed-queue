import { useRef, useCallback } from 'react';
import { QueueSettings } from './useQueueSettings';

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
    if (!settings.playAlarmSoundEnabled || !audioRef.current) return;
    
    const volumeLevels: Record<number, number> = {
      0: 0.0,
      33: 0.2,
      66: 0.5,
      100: 1.0,
    };
    
    // Find closest volume preset or calculate exact fraction
    const rawVolume = settings.alarmVolumeSetting;
    audioRef.current.volume = volumeLevels[rawVolume as keyof typeof volumeLevels] ?? (Math.max(0, Math.min(100, rawVolume)) / 100);

    try {
      audioRef.current.currentTime = 0;
      await audioRef.current.play();
    } catch (error) {
      console.warn("EnhancedSpeedQueue: Failed to play alarm audio. This is normal if the user hasn't interacted with the page yet.", error);
    }
  }, [settings.playAlarmSoundEnabled, settings.alarmVolumeSetting]);

  return {
    audioRef,
    playAlarm,
    clearContinuousAlarm,
    continuousAlarmIntervalRef,
  };
}

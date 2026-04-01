import { useCallback, useEffect, useRef } from 'react';
import { usePlugin } from '@remnote/plugin-sdk';
import { QueueSettings } from './useQueueSettings';
import { ALARM_VOLUME_MAP } from '../constants';

let globalAudio: HTMLAudioElement | null = null;

export function useAlarmAudio(settings: QueueSettings['alarm']) {
  const plugin = usePlugin();
  const continuousAlarmIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!globalAudio && plugin.rootURL) {
      globalAudio = new window.Audio(`${plugin.rootURL}ding.mp3`);
    }
  }, [plugin.rootURL]);

  const clearContinuousAlarm = useCallback(() => {
    if (continuousAlarmIntervalRef.current) {
      clearInterval(continuousAlarmIntervalRef.current);
      continuousAlarmIntervalRef.current = null;
    }
  }, []);

  const playAlarm = useCallback(async () => {
    if (settings.volume === 'off' || !globalAudio) return;

    const volumeLevel = ALARM_VOLUME_MAP[settings.volume] ?? ALARM_VOLUME_MAP['medium'];
    globalAudio.volume = volumeLevel;

    try {
      globalAudio.currentTime = 0;
      await globalAudio.play();
    } catch (error) {
      console.warn("EnhancedSpeedQueue: Failed to play alarm audio. This is normal if the user hasn't interacted with the page yet.", error);
    }
  }, [settings.volume]);

  return {
    playAlarm,
    clearContinuousAlarm,
    continuousAlarmIntervalRef,
  };
}

import { useCallback, useEffect, useRef } from 'react';
import { usePlugin } from '@remnote/plugin-sdk';
import { QueueSettings } from './useQueueSettings';
import { ALARM_VOLUME_MAP } from '../constants';

type SharedAlarmAudioState = {
  src: string | null;
  context: AudioContext | null;
  gainNode: GainNode | null;
  buffer: AudioBuffer | null;
  loadingPromise: Promise<AudioBuffer | null> | null;
  unlockListenersAttached: boolean;
  isPrimed: boolean;
};

let sharedAlarmAudioState: SharedAlarmAudioState = {
  src: null,
  context: null,
  gainNode: null,
  buffer: null,
  loadingPromise: null,
  unlockListenersAttached: false,
  isPrimed: false,
};

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;

  const AudioContextCtor = window.AudioContext
    ?? (window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  if (!AudioContextCtor) return null;

  if (!sharedAlarmAudioState.context) {
    sharedAlarmAudioState.context = new AudioContextCtor();
    sharedAlarmAudioState.gainNode = sharedAlarmAudioState.context.createGain();
    sharedAlarmAudioState.gainNode.connect(sharedAlarmAudioState.context.destination);
  }

  return sharedAlarmAudioState.context;
}

async function loadAlarmBuffer(src?: string): Promise<AudioBuffer | null> {
  if (!src) return null;

  const context = getAudioContext();
  if (!context) return null;

  if (sharedAlarmAudioState.src === src && sharedAlarmAudioState.buffer) {
    return sharedAlarmAudioState.buffer;
  }

  if (sharedAlarmAudioState.src === src && sharedAlarmAudioState.loadingPromise) {
    return sharedAlarmAudioState.loadingPromise;
  }

  sharedAlarmAudioState.src = src;
  sharedAlarmAudioState.buffer = null;
  sharedAlarmAudioState.loadingPromise = (async () => {
    const response = await fetch(src);
    const arrayBuffer = await response.arrayBuffer();
    const decodedBuffer = await context.decodeAudioData(arrayBuffer.slice(0));
    sharedAlarmAudioState.buffer = decodedBuffer;
    return decodedBuffer;
  })().catch((error) => {
    console.warn('EnhancedSpeedQueue: Failed to preload alarm audio buffer.', error);
    return null;
  }).finally(() => {
    sharedAlarmAudioState.loadingPromise = null;
  });

  return sharedAlarmAudioState.loadingPromise;
}

async function primeAlarmAudioContext() {
  const context = getAudioContext();
  if (!context || sharedAlarmAudioState.isPrimed) return;

  try {
    // Play a tiny silent buffer to "prime" the speaker and satisfy browser autoplay requirements.
    const silentBuffer = context.createBuffer(1, 1, 22050);
    const source = context.createBufferSource();
    source.buffer = silentBuffer;
    source.connect(context.destination);
    source.start(0);
    
    if (context.state === 'suspended') {
      await context.resume();
    }
    
    sharedAlarmAudioState.isPrimed = true;
    console.log('EnhancedSpeedQueue: Audio context primed successfully.');
  } catch (error) {
    console.warn('EnhancedSpeedQueue: Failed to prime audio context.', error);
  }
}

async function unlockAlarmAudioContext() {
  const context = getAudioContext();
  if (!context) return;

  if (context.state !== 'running') {
    try {
      await context.resume();
      await primeAlarmAudioContext();
    } catch (error) {
      console.warn('EnhancedSpeedQueue: Failed to resume audio context.', error);
    }
  }
}

function attachUnlockListeners() {
  if (typeof window === 'undefined' || sharedAlarmAudioState.unlockListenersAttached) return;

  const handler = () => {
    void unlockAlarmAudioContext();
  };

  const options: AddEventListenerOptions = { capture: true };

  window.addEventListener('keydown', handler, options);
  window.addEventListener('mousedown', handler, options);
  window.addEventListener('pointerdown', handler, options);
  window.addEventListener('touchstart', handler, options);
  sharedAlarmAudioState.unlockListenersAttached = true;
}

export interface AlarmPlaybackResult {
  played: boolean;
  reason: 'played' | 'disabled' | 'unsupported' | 'blocked' | 'failed';
}

export function useAlarmAudio(settings: QueueSettings['alarm']) {
  const plugin = usePlugin();
  const audioSrc = plugin.rootURL ? `${plugin.rootURL}ding.mp3` : undefined;

  useEffect(() => {
    attachUnlockListeners();
    void loadAlarmBuffer(audioSrc);
  }, [audioSrc, settings.volume]);

  const playAlarm = useCallback(async (): Promise<AlarmPlaybackResult> => {
    if (settings.volume === 'off') {
      return { played: false, reason: 'disabled' };
    }

    const context = getAudioContext();
    if (!context) {
      return { played: false, reason: 'unsupported' };
    }

    const volumeLevel = ALARM_VOLUME_MAP[settings.volume] ?? ALARM_VOLUME_MAP['medium'];
    if (sharedAlarmAudioState.gainNode) {
      sharedAlarmAudioState.gainNode.gain.value = volumeLevel;
    }

    try {
      await unlockAlarmAudioContext();
      const buffer = await loadAlarmBuffer(audioSrc);
      if (!buffer || !sharedAlarmAudioState.gainNode) {
        return { played: false, reason: 'failed' };
      }

      const source = context.createBufferSource();
      source.buffer = buffer;
      source.connect(sharedAlarmAudioState.gainNode);
      source.start(0);
      return { played: true, reason: 'played' };
    } catch (error) {
      console.warn('EnhancedSpeedQueue: Failed to play alarm audio buffer.', error);
      return {
        played: false,
        reason: context.state === 'running' ? 'failed' : 'blocked',
      };
    }
  }, [audioSrc, settings.volume]);

  return {
    playAlarm,
  };
}

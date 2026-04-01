import { useState, useEffect } from 'react';
import { usePlugin } from '@remnote/plugin-sdk';
import type { RichTextInterface } from '@remnote/plugin-sdk';
import { QueueSettings } from './useQueueSettings';
import { WORDS_PER_MINUTE } from '../constants';

const COMPONENT_NAME = "EnhancedSpeedQueueBar";

export function useAutoDetectDelay(
  cardId: string | null,
  settings: QueueSettings['delay']
): number {
  const plugin = usePlugin();
  const [currentInitialAlarmDelaySec, setCurrentInitialAlarmDelaySec] = useState(settings.manualInitialAlarmDelaySec);

  useEffect(() => {
    const calculateAndSetDelay = async () => {
      if (!cardId) {
        setCurrentInitialAlarmDelaySec(settings.manualInitialAlarmDelaySec); 
        return;
      }

      if (settings.enableAutoDetectDelay) {
        try {
          const currentCardObject = await plugin.queue.getCurrentCard(); 
          let frontRichText: RichTextInterface | undefined = undefined;
          let backRichText: RichTextInterface | undefined = undefined;

          if (currentCardObject) {
            const associatedRem = await currentCardObject.getRem();
            if (associatedRem) {
              frontRichText = associatedRem.text;
              if (settings.includeAnswerInAutoDetect) {
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
              const multipliedDelay = baseCalculatedDelay * settings.autoDetectDelayMultiplierSetting;
              const clampedDelay = Math.max(settings.minAutoDetectLimitSec, Math.min(settings.maxAutoDetectLimitSec, multipliedDelay));
              
              console.log(`[${COMPONENT_NAME}] AutoDetect Results for ${cardId}: Words=${wordCount}, BaseCalc=${baseCalculatedDelay.toFixed(2)}s, Multiplier=${settings.autoDetectDelayMultiplierSetting.toFixed(1)}x, Final Clamped Delay=${Math.round(clampedDelay)}s`);

              setCurrentInitialAlarmDelaySec(Math.round(clampedDelay));
            } else {
              setCurrentInitialAlarmDelaySec(settings.manualInitialAlarmDelaySec);
            }
          } else {
            setCurrentInitialAlarmDelaySec(settings.manualInitialAlarmDelaySec);
          }
        } catch (error) {
          console.error(`[${COMPONENT_NAME}] Error auto-detecting delay:`, error);
          setCurrentInitialAlarmDelaySec(settings.manualInitialAlarmDelaySec); 
        }
      } else {
        setCurrentInitialAlarmDelaySec(settings.manualInitialAlarmDelaySec);
      }
    };

    calculateAndSetDelay();
  }, [cardId, settings.enableAutoDetectDelay, settings.includeAnswerInAutoDetect, settings.manualInitialAlarmDelaySec, settings.autoDetectDelayMultiplierSetting, settings.minAutoDetectLimitSec, settings.maxAutoDetectLimitSec, plugin]);

  return currentInitialAlarmDelaySec;
}

import { useState, useEffect } from 'react';
import { usePlugin } from '@remnote/plugin-sdk';
import {
  DEFAULT_MANUAL_FALLBACK_DELAY,
} from '../constants';
import { calculateAutoDetectDelayFromText } from '../utils/timer-math';

const COMPONENT_NAME = "EnhancedSpeedQueueBar";

export interface AutoDetectDelayState {
  alarmDelaySec: number;
  resolvedCardId: string | null;
  isResolved: boolean;
}

/**
 * Uses a fixed initial delay when one is provided (>0).
 * Uses full-rem auto-detection when the configured initial delay is 0.
 * Falls back to DEFAULT_MANUAL_FALLBACK_DELAY if card text can't be parsed.
 */
export function useAutoDetectDelay(
  cardId: string | null,
  readingSpeed: number,
  initialDelaySec: number
): AutoDetectDelayState {
  const plugin = usePlugin();
  const [state, setState] = useState<AutoDetectDelayState>({
    alarmDelaySec: DEFAULT_MANUAL_FALLBACK_DELAY,
    resolvedCardId: null,
    isResolved: false,
  });

  useEffect(() => {
    let cancelled = false;

    if (initialDelaySec > 0) {
      setState({
        alarmDelaySec: initialDelaySec,
        resolvedCardId: cardId,
        isResolved: true,
      });
      return () => {
        cancelled = true;
      };
    }

    setState({
      alarmDelaySec: DEFAULT_MANUAL_FALLBACK_DELAY,
      resolvedCardId: null,
      isResolved: false,
    });

    const calculateDelay = async () => {
      if (!cardId) {
        if (!cancelled) {
          setState({
            alarmDelaySec: DEFAULT_MANUAL_FALLBACK_DELAY,
            resolvedCardId: null,
            isResolved: false,
          });
        }
        return;
      }

      try {
        const currentCardObject = await plugin.card.findOne(cardId);
        if (!currentCardObject) {
          if (!cancelled) {
            setState({
              alarmDelaySec: DEFAULT_MANUAL_FALLBACK_DELAY,
              resolvedCardId: cardId,
              isResolved: true,
            });
          }
          return;
        }

        const associatedRem = await currentCardObject.getRem();
        if (!associatedRem) {
          if (!cancelled) {
            setState({
              alarmDelaySec: DEFAULT_MANUAL_FALLBACK_DELAY,
              resolvedCardId: cardId,
              isResolved: true,
            });
          }
          return;
        }

        let frontPlainText = '';
        let backPlainText = '';

        if (associatedRem.text) {
          frontPlainText = await plugin.richText.toString(associatedRem.text);
        }

        if (associatedRem.backText) {
          backPlainText = await plugin.richText.toString(associatedRem.backText);
        }

        if (cancelled) return;

        const { remWordCount, finalDelay } = calculateAutoDetectDelayFromText(
          frontPlainText,
          backPlainText,
          readingSpeed
        );

        console.log(
          `[${COMPONENT_NAME}] AutoDetect: ${cardId} — remWords=${remWordCount} speed=${readingSpeed}x → ${finalDelay}s`
        );

        if (!cancelled) {
          setState({
            alarmDelaySec: finalDelay,
            resolvedCardId: cardId,
            isResolved: true,
          });
        }
      } catch (error) {
        console.error(`[${COMPONENT_NAME}] Error auto-detecting delay:`, error);
        if (!cancelled) {
          setState({
            alarmDelaySec: DEFAULT_MANUAL_FALLBACK_DELAY,
            resolvedCardId: cardId,
            isResolved: true,
          });
        }
      }
    };

    void calculateDelay();

    return () => {
      cancelled = true;
    };
  }, [cardId, readingSpeed, initialDelaySec, plugin]);

  return state;
}

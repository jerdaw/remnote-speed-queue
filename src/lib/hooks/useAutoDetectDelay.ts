import { useState, useEffect } from 'react';
import { usePlugin } from '@remnote/plugin-sdk';
import type { RichTextInterface } from '@remnote/plugin-sdk';
import {
  DEFAULT_MANUAL_FALLBACK_DELAY,
} from '../constants';
import { calculateClampedDelay } from '../utils/timer-utils';

const COMPONENT_NAME = "EnhancedSpeedQueueBar";

/**
 * Always auto-detects delay based on card content length and reading speed.
 * Falls back to DEFAULT_MANUAL_FALLBACK_DELAY if card text can't be parsed.
 */
export function useAutoDetectDelay(
  cardId: string | null,
  readingSpeed: number
): number {
  const plugin = usePlugin();
  const [currentDelaySec, setCurrentDelaySec] = useState(DEFAULT_MANUAL_FALLBACK_DELAY);

  useEffect(() => {
    const calculateDelay = async () => {
      if (!cardId) {
        setCurrentDelaySec(DEFAULT_MANUAL_FALLBACK_DELAY);
        return;
      }

      try {
        const currentCardObject = await plugin.card.findOne(cardId);
        let frontRichText: RichTextInterface | undefined = undefined;
        let backRichText: RichTextInterface | undefined = undefined;

        if (currentCardObject) {
          const associatedRem = await currentCardObject.getRem();
          if (associatedRem) {
            frontRichText = associatedRem.text;
            backRichText = associatedRem.backText; // always include answer
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
            const finalDelay = calculateClampedDelay(wordCount, readingSpeed);
            console.log(`[${COMPONENT_NAME}] AutoDetect: ${cardId} — ${wordCount} words, ${readingSpeed}x speed → ${finalDelay}s`);
            setCurrentDelaySec(finalDelay);
          } else {
            setCurrentDelaySec(DEFAULT_MANUAL_FALLBACK_DELAY);
          }
        } else {
          setCurrentDelaySec(DEFAULT_MANUAL_FALLBACK_DELAY);
        }
      } catch (error) {
        console.error(`[${COMPONENT_NAME}] Error auto-detecting delay:`, error);
        setCurrentDelaySec(DEFAULT_MANUAL_FALLBACK_DELAY);
      }
    };

    calculateDelay();
  }, [cardId, readingSpeed, plugin]);

  return currentDelaySec;
}

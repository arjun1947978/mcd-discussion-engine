import { useState, useRef, useCallback } from 'react';

/**
 * Unified hook for both Swipe-to-Reply AND Long-Press Context Menu.
 * Resolves event collisions between touch and mouse gestures.
 */
export const useBubbleInteraction = ({
  onSwipeReply,
  onLongPress,
  onClick,
  threshold = 45,
  maxOffset = 75,
  longPressDelay = 450,
  enabled = true
}) => {
  const [offsetX, setOffsetX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const startX = useRef(0);
  const startY = useRef(0);
  const isPointerDown = useRef(false);
  const longPressTimer = useRef(null);
  const hasTriggeredLongPress = useRef(false);
  const hasMoved = useRef(false);
  const hapticTriggered = useRef(false);

  const clearLongPress = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const handlePointerDown = useCallback(
    (e) => {
      if (!enabled) return;
      // Don't hijack right clicks
      if (e.button && e.button !== 0) return;

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      startX.current = clientX;
      startY.current = clientY;
      isPointerDown.current = true;
      hasMoved.current = false;
      hasTriggeredLongPress.current = false;
      hapticTriggered.current = false;

      // Start long press timer
      clearLongPress();
      longPressTimer.current = setTimeout(() => {
        if (isPointerDown.current && !hasMoved.current) {
          hasTriggeredLongPress.current = true;
          if (onLongPress) {
            onLongPress(e, { x: clientX, y: clientY });
          }
        }
      }, longPressDelay);
    },
    [enabled, clearLongPress, longPressDelay, onLongPress]
  );

  const handlePointerMove = useCallback(
    (e) => {
      if (!isPointerDown.current || !enabled) return;

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const diffX = clientX - startX.current;
      const diffY = clientY - startY.current;

      // If user moved more than 6px, it's a drag/scroll, so cancel long press
      if (Math.abs(diffX) > 6 || Math.abs(diffY) > 6) {
        hasMoved.current = true;
        clearLongPress();
      }

      // If vertical movement dominates and not already swiping, allow natural scrolling
      if (Math.abs(diffY) > Math.abs(diffX) * 1.2 && !isSwiping) {
        return;
      }

      // Horizontal swipe to the right (WhatsApp reply gesture)
      if (diffX > 4) {
        setIsSwiping(true);
        // Damped rubber-band physics
        const progress = Math.min(diffX, maxOffset * 1.6);
        const damped = Math.min(progress * 0.72, maxOffset);
        setOffsetX(damped);

        if (damped >= threshold && !hapticTriggered.current) {
          hapticTriggered.current = true;
          if (navigator.vibrate) {
            try {
              navigator.vibrate(25);
            } catch (err) {}
          }
        }
      }
    },
    [enabled, isSwiping, maxOffset, threshold, clearLongPress]
  );

  const handlePointerUp = useCallback(
    (e) => {
      if (!isPointerDown.current) return;
      isPointerDown.current = false;
      clearLongPress();

      // Check if swipe threshold was met
      if (offsetX >= threshold) {
        if (onSwipeReply) {
          onSwipeReply();
        }
      } else if (!hasMoved.current && !hasTriggeredLongPress.current) {
        // Simple click
        if (onClick) {
          onClick(e);
        }
      }

      // Spring back to 0px
      setIsSwiping(false);
      setOffsetX(0);
    },
    [clearLongPress, offsetX, threshold, onSwipeReply, onClick]
  );

  return {
    offsetX,
    isSwiping,
    isThresholdReached: offsetX >= threshold,
    interactionProps: {
      onMouseDown: handlePointerDown,
      onMouseMove: handlePointerMove,
      onMouseUp: handlePointerUp,
      onMouseLeave: handlePointerUp,
      onTouchStart: handlePointerDown,
      onTouchMove: handlePointerMove,
      onTouchEnd: handlePointerUp,
      onTouchCancel: handlePointerUp
    }
  };
};

export default useBubbleInteraction;


import { useState, useRef, useCallback } from 'react';

export const useSwipeGesture = ({
  onSwipeReply,
  threshold = 45,
  maxOffset = 70,
  enabled = true
}) => {
  const [offsetX, setOffsetX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const isDragging = useRef(false);
  const hasTriggeredHaptic = useRef(false);

  const onTouchStart = useCallback(
    (e) => {
      if (!enabled) return;
      const touch = e.touches ? e.touches[0] : e;
      startX.current = touch.clientX;
      startY.current = touch.clientY;
      isDragging.current = true;
      hasTriggeredHaptic.current = false;
    },
    [enabled]
  );

  const onTouchMove = useCallback(
    (e) => {
      if (!isDragging.current || !enabled) return;
      const touch = e.touches ? e.touches[0] : e;
      const diffX = touch.clientX - startX.current;
      const diffY = touch.clientY - startY.current;

      // If vertical scroll dominates, don't hijack
      if (Math.abs(diffY) > Math.abs(diffX) && !isSwiping) {
        return;
      }

      // WhatsApp swipe to reply is swiping right
      if (diffX > 5) {
        setIsSwiping(true);
        // Apply resistance curve
        const progress = Math.min(diffX, maxOffset * 1.5);
        const damped = Math.min(progress * 0.7, maxOffset);
        setOffsetX(damped);

        if (damped >= threshold && !hasTriggeredHaptic.current) {
          hasTriggeredHaptic.current = true;
          if (navigator.vibrate) {
            try {
              navigator.vibrate(20);
            } catch (err) {}
          }
        }
      }
    },
    [enabled, isSwiping, maxOffset, threshold]
  );

  const endSwipe = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;

    if (offsetX >= threshold) {
      if (onSwipeReply) {
        onSwipeReply();
      }
    }

    setIsSwiping(false);
    setOffsetX(0);
  }, [offsetX, threshold, onSwipeReply]);

  return {
    offsetX,
    isSwiping,
    isThresholdReached: offsetX >= threshold,
    gestureProps: {
      onTouchStart,
      onTouchMove,
      onTouchEnd: endSwipe,
      onTouchCancel: endSwipe,
      onMouseDown: onTouchStart,
      onMouseMove: onTouchMove,
      onMouseUp: endSwipe,
      onMouseLeave: endSwipe
    }
  };
};

export default useSwipeGesture;


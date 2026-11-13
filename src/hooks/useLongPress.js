import { useRef, useCallback } from 'react';

export const useLongPress = (onLongPress, onClick, { delay = 500 } = {}) => {
  const timeoutRef = useRef(null);
  const targetRef = useRef(null);
  const startPos = useRef({ x: 0, y: 0 });
  const isLongPressTriggered = useRef(false);

  const start = useCallback(
    (event) => {
      // Don't trigger on right click
      if (event.button && event.button !== 0) return;

      isLongPressTriggered.current = false;
      targetRef.current = event.currentTarget;

      const clientX = event.touches ? event.touches[0].clientX : event.clientX;
      const clientY = event.touches ? event.touches[0].clientY : event.clientY;
      startPos.current = { x: clientX, y: clientY };

      timeoutRef.current = setTimeout(() => {
        isLongPressTriggered.current = true;
        if (onLongPress) {
          onLongPress(event, { x: clientX, y: clientY });
        }
      }, delay);
    },
    [onLongPress, delay]
  );

  const clear = useCallback(
    (event, shouldTriggerClick = true) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (shouldTriggerClick && !isLongPressTriggered.current && onClick) {
        onClick(event);
      }
    },
    [onClick]
  );

  const move = useCallback((event) => {
    if (!timeoutRef.current) return;
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;

    // If moved more than 10px, cancel long press (user is scrolling or swiping)
    const deltaX = Math.abs(clientX - startPos.current.x);
    const deltaY = Math.abs(clientY - startPos.current.y);
    if (deltaX > 10 || deltaY > 10) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
  }, []);

  return {
    onMouseDown: start,
    onTouchStart: start,
    onMouseUp: (e) => clear(e, true),
    onTouchEnd: (e) => clear(e, true),
    onMouseLeave: (e) => clear(e, false),
    onMouseMove: move,
    onTouchMove: move
  };
};

export default useLongPress;


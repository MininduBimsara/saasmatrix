import { useEffect, useRef, useCallback } from 'react';

const IDLE_EVENTS: (keyof WindowEventMap)[] = [
  'mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click',
];

/**
 * Calls `onIdle` after `timeoutMs` of no user interaction.
 * The timer resets on any mouse, keyboard, or touch event.
 */
export function useIdleTimeout(onIdle: () => void, timeoutMs: number): void {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onIdleRef = useRef(onIdle);

  // Keep callback ref current without resetting the timer
  useEffect(() => {
    onIdleRef.current = onIdle;
  }, [onIdle]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onIdleRef.current(), timeoutMs);
  }, [timeoutMs]);

  useEffect(() => {
    resetTimer();
    IDLE_EVENTS.forEach((event) => window.addEventListener(event, resetTimer, { passive: true }));
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      IDLE_EVENTS.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [resetTimer]);
}

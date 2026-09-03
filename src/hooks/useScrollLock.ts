import { useEffect } from 'react';

/** Trava o scroll do body enquanto `locked` for true (usado em modais/drawers). */
export function useScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;
    document.body.classList.add('scroll-locked');
    return () => document.body.classList.remove('scroll-locked');
  }, [locked]);
}

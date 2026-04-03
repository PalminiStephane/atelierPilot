import { useCallback } from 'react';

interface SwipeHandlers {
  onNext: () => void;
  onPrev: () => void;
}

/** Hook pour gérer les gestes swipe avec Framer Motion */
export function useSwipe({ onNext, onPrev }: SwipeHandlers) {
  const handleDragEnd = useCallback(
    (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
      if (info.offset.x < -100 || info.velocity.x < -500) {
        onNext();
        // Feedback haptique sur mobile
        if (navigator.vibrate) navigator.vibrate(30);
      }
      if (info.offset.x > 100 || info.velocity.x > 500) {
        onPrev();
        if (navigator.vibrate) navigator.vibrate(30);
      }
    },
    [onNext, onPrev]
  );

  return { handleDragEnd };
}

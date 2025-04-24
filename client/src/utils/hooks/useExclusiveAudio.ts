import { useCallback, useRef } from 'react';

export function useExclusiveAudio() {
  const currentRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback((el: HTMLAudioElement) => {
    if (currentRef.current && currentRef.current !== el) {
      currentRef.current.pause();
    }
    currentRef.current = el;
    el.play();
  }, []);

  const pauseAll = useCallback(() => {
    currentRef.current?.pause();
    currentRef.current = null;
  }, []);

  return { play, pauseAll };
}

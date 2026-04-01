import { useEffect } from 'react';
import { useTheatreStore } from '@/stores/theatreStore';
import { CURTAIN_CLOSE_MS, CURTAIN_HOLD_MS } from '@/constants/curtain';

const isEditableTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;

  return (
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.isContentEditable
  );
};

export const useKeyboardNavigation = () => {
  const {
    acts,
    currentAct,
    activeProp,
    setCurrentAct,
    setActiveProp,
    setTransitioning,
  } = useTheatreStore();

  useEffect(() => {
    const focusStageRoot = () => {
      document.getElementById('theatre-stage-root')?.focus();
    };

    const transitionToAct = (nextIndex: number) => {
      if (nextIndex < 0 || nextIndex >= acts.length || nextIndex === currentAct) return;

      setTransitioning(true);
      setActiveProp(null);

      window.setTimeout(() => {
        setCurrentAct(nextIndex);
        window.setTimeout(() => {
          setTransitioning(false);
          focusStageRoot();
        }, CURTAIN_HOLD_MS);
      }, CURTAIN_CLOSE_MS);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        setActiveProp(null);
        setTransitioning(false);
        focusStageRoot();
        return;
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        transitionToAct(currentAct - 1);
        return;
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        transitionToAct(currentAct + 1);
        return;
      }

      if (/^[1-9]$/.test(event.key)) {
        const actIndex = Number(event.key) - 1;
        event.preventDefault();
        transitionToAct(actIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    activeProp,
    acts.length,
    currentAct,
    setActiveProp,
    setCurrentAct,
    setTransitioning,
  ]);
};

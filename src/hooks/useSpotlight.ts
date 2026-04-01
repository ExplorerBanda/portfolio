import { useEffect, useRef, useCallback } from 'react';
import { useSpotlightStore } from '@/stores/spotlightStore';

export const useSpotlight = () => {
  const setPosition = useSpotlightStore((s) => s.setPosition);
  const updateSmoothPosition = useSpotlightStore((s) => s.updateSmoothPosition);
  const animationRef = useRef<number>();

  // Mouse position tracking
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      setPosition(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        setPosition(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [setPosition]);

  // Smooth interpolation animation loop
  useEffect(() => {
    const animate = () => {
      updateSmoothPosition();
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [updateSmoothPosition]);

  const resetSpotlight = useCallback(() => {
    useSpotlightStore.getState().reset();
  }, []);

  return { resetSpotlight };
};

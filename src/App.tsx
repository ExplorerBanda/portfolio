import { useState, useEffect, Suspense, lazy } from 'react';
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities';
import { useSpotlight } from '@/hooks/useSpotlight';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import { useTheatreStore } from '@/stores/theatreStore';
import { SpotlightOverlay } from '@/components/ui/SpotlightOverlay';
import { ActIndicator } from '@/components/ui/ActIndicator';
import { MobileNavigation } from '@/components/mobile/MobileNavigation';
import { CurtainOverlay } from '@/components/ui/CurtainOverlay';

const TheatreStage = lazy(() => import('@/components/three/TheatreStage'));

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showHint, setShowHint] = useState(true);
  const capabilities = useDeviceCapabilities();
  useSpotlight();
  useKeyboardNavigation();

  const {
    isMobile,
    setIsMobile,
    spotlightEnabled,
    setTransitioning,
  } = useTheatreStore();

  // Set mobile state
  useEffect(() => {
    setIsMobile(capabilities.isMobile);
  }, [capabilities.isMobile, setIsMobile]);

  // Hide hint after first interaction
  useEffect(() => {
    const handleInteraction = () => setShowHint(false);
    window.addEventListener('mousemove', handleInteraction, { once: true });
    window.addEventListener('touchstart', handleInteraction, { once: true });
    return () => {
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  // Opening stage reveal
  useEffect(() => {
    setTransitioning(true);

    const loadingTimer = window.setTimeout(() => {
      setIsLoading(false);
      window.setTimeout(() => setTransitioning(false), 120);
    }, 2000);

    return () => {
      window.clearTimeout(loadingTimer);
      setTransitioning(false);
    };
  }, [setTransitioning]);

  // Mobile fallback
  if (isMobile || !capabilities.webgl) {
    return (
      <div className="relative w-full h-full bg-theatre-dark">
        <MobileNavigation />
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full overflow-hidden bg-theatre-darker ${spotlightEnabled ? 'stage-cursor' : ''}`}>
      <div id="theatre-stage-root" tabIndex={-1} className="absolute inset-0 outline-none" />
      {/* Curtain Transition Overlay */}
      <CurtainOverlay />

      {/* 3D Theatre Stage */}
      {!isLoading && (
        <Suspense fallback={null}>
          {capabilities.webgl && <TheatreStage />}
        </Suspense>
      )}

      {/* Spotlight Mask Overlay */}
      {!isLoading && spotlightEnabled && <SpotlightOverlay />}

      {/* Cinematic Vignette Overlay */}
      {!isLoading && <div className="vignette-overlay" />}

      {/* Act Progress Indicator */}
      {!isLoading && <ActIndicator />}

      {/* Navigation Hint */}
      {!isLoading && showHint && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <p className="text-white/40 text-sm font-body animate-pulse">
            Explore the stage layout. Use arrow keys or 1-6 to change acts.
          </p>
        </div>
      )}
    </div>
  );
}

export default App;

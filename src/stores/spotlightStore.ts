import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface SpotlightState {
  // Position (raw from mouse)
  x: number;
  y: number;

  // Smooth position (interpolated)
  smoothX: number;
  smoothY: number;

  // Configuration
  size: number;
  softness: number;
  intensity: number;

  // State
  isActive: boolean;
  isHovering: boolean;
  hoveredPropId: string | null;

  // Actions
  setPosition: (x: number, y: number) => void;
  updateSmoothPosition: () => void;
  setHovering: (isHovering: boolean, propId?: string | null) => void;
  setSize: (size: number) => void;
  setIntensity: (intensity: number) => void;
  reset: () => void;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const getStageViewportBounds = () => {
  if (typeof window === 'undefined') {
    return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
  }

  return {
    minX: window.innerWidth * 0.16,
    maxX: window.innerWidth * 0.84,
    minY: window.innerHeight * 0.22,
    maxY: window.innerHeight * 0.84,
  };
};

// Responsive spotlight smoothing
// Higher = quicker response while preserving a soft theatre feel
const SMOOTH_FACTOR = 0.18;

export const useSpotlightStore = create<SpotlightState>()(
  devtools(
    (set, get) => ({
      // Initial position
      x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
      y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
      smoothX: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
      smoothY: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,

      // Default configuration
      size: 305,
      softness: 0.85,
      intensity: 1,

      // State
      isActive: true,
      isHovering: false,
      hoveredPropId: null,

      // Actions
      setPosition: (x, y) => {
        const bounds = getStageViewportBounds();
        set({
          x: clamp(x, bounds.minX, bounds.maxX),
          y: clamp(y, bounds.minY, bounds.maxY),
        });
      },

      updateSmoothPosition: () => {
        const { x, y, smoothX, smoothY } = get();
        // Smooth interpolation with lerp for cinematic feel
        set({
          smoothX: smoothX + (x - smoothX) * SMOOTH_FACTOR,
          smoothY: smoothY + (y - smoothY) * SMOOTH_FACTOR,
        });
      },

      setHovering: (isHovering, propId = null) => {
        set({
          isHovering,
          hoveredPropId: propId,
          size: isHovering ? 335 : 305,
        });
      },

      setSize: (size) => set({ size }),
      setIntensity: (intensity) => set({ intensity }),

      reset: () => set({
        x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
        y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
        smoothX: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
        smoothY: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
        isHovering: false,
        hoveredPropId: null,
      }),
    }),
    { name: 'spotlight-store' }
  )
);

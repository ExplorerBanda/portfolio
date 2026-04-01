import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Act } from '@/types';

interface TheatreState {
  // Act management
  currentAct: number;
  acts: Act[];
  setCurrentAct: (act: number) => void;
  nextAct: () => void;
  prevAct: () => void;

  // Prop interaction
  activeProp: string | null;
  setActiveProp: (propId: string | null) => void;

  // Transitions
  isTransitioning: boolean;
  setTransitioning: (value: boolean) => void;

  // Settings
  spotlightEnabled: boolean;
  setSpotlightEnabled: (enabled: boolean) => void;
  audioEnabled: boolean;
  setAudioEnabled: (enabled: boolean) => void;

  // Props revealed
  revealedProps: Set<string>;
  revealProp: (propId: string) => void;

  // Mobile
  isMobile: boolean;
  setIsMobile: (value: boolean) => void;
}

const defaultActs: Act[] = [
  {
    id: 'prologue',
    title: 'Prologue',
    subtitle: 'The stage is set...',
    props: ['microphone'],
  },
  {
    id: 'act1',
    title: 'Act I: Builder',
    subtitle: 'Code, systems, and product thinking',
    props: ['laptop'],
  },
  {
    id: 'act2',
    title: 'Act II: Intelligence',
    subtitle: 'Machine learning and applied AI',
    props: ['projection-screen'],
  },
  {
    id: 'act3',
    title: 'Act III: Education',
    subtitle: 'Experiences designed for the hand',
    props: ['android-phone'],
  },
  {
    id: 'act4',
    title: 'Act IV: Leadership',
    subtitle: 'Teams, direction, and execution',
    props: ['director-chair'],
  },
  {
    id: 'finale',
    title: 'Finale',
    subtitle: 'The show must go on...',
    props: ['exit-door'],
  },
];

export const useTheatreStore = create<TheatreState>()(
  devtools(
    (set, get) => ({
      // Act management
      currentAct: 0,
      acts: defaultActs,
      setCurrentAct: (act) => set({ currentAct: act }),
      nextAct: () => {
        const { currentAct, acts } = get();
        if (currentAct < acts.length - 1) {
          set({ currentAct: currentAct + 1 });
        }
      },
      prevAct: () => {
        const { currentAct } = get();
        if (currentAct > 0) {
          set({ currentAct: currentAct - 1 });
        }
      },

      // Prop interaction
      activeProp: null,
      setActiveProp: (propId) => set({ activeProp: propId }),

      // Transitions
      isTransitioning: false,
      setTransitioning: (value) => set({ isTransitioning: value }),

      // Settings
      spotlightEnabled: false,
      setSpotlightEnabled: (enabled) => set({ spotlightEnabled: enabled }),
      audioEnabled: false,
      setAudioEnabled: (enabled) => set({ audioEnabled: enabled }),

      // Props revealed
      revealedProps: new Set(),
      revealProp: (propId) => {
        const { revealedProps } = get();
        const newSet = new Set(revealedProps);
        newSet.add(propId);
        set({ revealedProps: newSet });
      },

      // Mobile
      isMobile: false,
      setIsMobile: (value) => set({ isMobile: value }),
    }),
    { name: 'theatre-store' }
  )
);

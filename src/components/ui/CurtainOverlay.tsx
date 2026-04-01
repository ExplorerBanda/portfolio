import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheatreStore } from '@/stores/theatreStore';
import { CURTAIN_TRANSITION_SECONDS } from '@/constants/curtain';

export const CurtainOverlay: React.FC = () => {
  const { isTransitioning, acts, currentAct } = useTheatreStore();
  const activeAct = acts[currentAct];
  const curtainTransition = {
    duration: CURTAIN_TRANSITION_SECONDS,
    ease: [0.65, 0, 0.35, 1] as const,
  };

  return (
    <AnimatePresence>
      {isTransitioning && (
        <div className="fixed inset-0 z-[60] flex">
          {/* Left curtain */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={curtainTransition}
            className="h-full curtain-left"
            style={{
              width: 'calc(50% + 12px)',
              background: 'linear-gradient(90deg, #1a0000 0%, #8B0000 20%, #5c0000 50%, #8B0000 80%, #1a0000 100%)',
              boxShadow: 'inset -24px 0 34px rgba(0,0,0,0.35)',
            }}
          >
            <div className="w-full h-full curtain-texture" />
          </motion.div>

          {/* Right curtain */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={curtainTransition}
            className="h-full curtain-right"
            style={{
              width: 'calc(50% + 12px)',
              background: 'linear-gradient(-90deg, #1a0000 0%, #8B0000 20%, #5c0000 50%, #8B0000 80%, #1a0000 100%)',
              boxShadow: 'inset 24px 0 34px rgba(0,0,0,0.35)',
            }}
          >
            <div className="w-full h-full curtain-texture" />
          </motion.div>

          <div
            className="pointer-events-none absolute inset-y-0 left-1/2 z-10 -translate-x-1/2"
            style={{
              width: '24px',
              background: 'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.35) 100%)',
              filter: 'blur(8px)',
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
          >
            <div className="rounded-full border border-[#f6d79a]/35 bg-black/18 px-10 py-6 text-center backdrop-blur-[2px]">
              <p
                className="text-[0.72rem] uppercase tracking-[0.5em] text-white/90"
                style={{ textShadow: '0 2px 14px rgba(0, 0, 0, 0.45)' }}
              >
                Introducing
              </p>
              <h2
                className="mt-3 text-4xl font-semibold tracking-[0.06em] text-white"
                style={{ textShadow: '0 2px 18px rgba(0, 0, 0, 0.35)' }}
              >
                {activeAct?.title}
              </h2>
              <p
                className="mt-2 text-sm tracking-[0.24em] uppercase text-white/85"
                style={{ textShadow: '0 2px 12px rgba(0, 0, 0, 0.42)' }}
              >
                {activeAct?.subtitle}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

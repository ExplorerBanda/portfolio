import React from 'react';
import { motion } from 'framer-motion';
import { useTheatreStore } from '@/stores/theatreStore';
import { CURTAIN_CLOSE_MS, CURTAIN_HOLD_MS } from '@/constants/curtain';

export const ActIndicator: React.FC = () => {
  const { acts, currentAct, setCurrentAct, setTransitioning, setActiveProp } = useTheatreStore();

  const handleActChange = (index: number) => {
    if (index === currentAct) return;

    setActiveProp(null);
    setTransitioning(true);
    window.setTimeout(() => {
      setCurrentAct(index);
      window.setTimeout(() => setTransitioning(false), CURTAIN_HOLD_MS);
    }, CURTAIN_CLOSE_MS);
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
      <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-full px-4 py-2">
        {acts.map((act, index) => (
          <button
            key={act.id}
            onClick={() => handleActChange(index)}
            className="group relative"
            aria-label={`Go to ${act.title}`}
          >
            <motion.div
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentAct
                  ? 'bg-theatre-gold'
                  : 'bg-white/30 group-hover:bg-white/50'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
            {index === currentAct && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute inset-0 rounded-full border-2 border-theatre-gold"
                initial={false}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 0.5 }}
              />
            )}
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              <div className="bg-black/80 text-white text-xs px-2 py-1 rounded">
                {act.title}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Current act label */}
      <motion.div
        key={currentAct}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 text-center"
      >
        <span className="text-white/40 text-xs font-body">
          {acts[currentAct]?.subtitle}
        </span>
      </motion.div>
    </div>
  );
};

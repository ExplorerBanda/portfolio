import React from 'react';
import { motion } from 'framer-motion';

export const LoadingScreen: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] bg-theatre-darker flex flex-col items-center justify-center"
    >
      {/* Theatre mask icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <svg
          width="80"
          height="80"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Comedy mask */}
          <path
            d="M25 25C25 15 35 5 50 5C65 5 75 15 75 25V50C75 60 65 70 50 70C35 70 25 60 25 50V25Z"
            fill="#FFD700"
            fillOpacity="0.2"
            stroke="#FFD700"
            strokeWidth="2"
          />
          {/* Happy eyes */}
          <circle cx="38" cy="35" r="5" fill="#FFD700" />
          <circle cx="62" cy="35" r="5" fill="#FFD700" />
          {/* Happy mouth */}
          <path
            d="M35 50C40 58 60 58 65 50"
            stroke="#FFD700"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>

      {/* Loading text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-white/60 text-sm font-body tracking-widest uppercase"
      >
        Preparing the stage...
      </motion.p>

      {/* Loading bar */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '200px' }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
        className="mt-6 h-0.5 bg-theatre-gold rounded-full"
      />
    </motion.div>
  );
};
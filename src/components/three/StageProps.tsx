import React from 'react';
import { motion } from 'framer-motion';
import { stageProps } from '@/data/content';
import { useSpotlightStore } from '@/stores/spotlightStore';
import { useTheatreStore } from '@/stores/theatreStore';

// 2D fallback props for when Three.js is not available or for mobile
export const StageProps: React.FC = () => {
  const { acts, currentAct, setActiveProp } = useTheatreStore();
  const { smoothX, smoothY } = useSpotlightStore();
  const visibleProps = acts[currentAct]?.props ?? [];
  const activeStageProps = stageProps.filter((prop) => visibleProps.includes(prop.id));

  // Check if spotlight is near a prop
  const checkProximity = (propId: string) => {
    const prop = stageProps.find((p) => p.id === propId);
    if (!prop) return false;

    // Approximate screen position based on stage coordinates
    const screenX = ((prop.position[0] + 10) / 20) * window.innerWidth;
    const screenY = ((prop.position[2] + 5) / 10) * window.innerHeight;

    const distance = Math.sqrt(
      Math.pow(smoothX - screenX, 2) + Math.pow(smoothY - screenY, 2)
    );

    return distance < 150;
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {activeStageProps.map((prop) => {
        const isNear = checkProximity(prop.id);

        return (
          <motion.div
            key={prop.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: isNear ? 1 : 0.3,
              scale: isNear ? 1 : 0.95,
            }}
            transition={{ duration: 0.3 }}
            className="absolute pointer-events-auto cursor-pointer"
            style={{
              left: `${((prop.position[0] + 10) / 20) * 100}%`,
              top: `${50 - ((prop.position[2] + 5) / 10) * 30}%`,
              transform: 'translate(-50%, -50%)',
            }}
            onMouseEnter={() => {/* hover effect */}}
            onMouseLeave={() => {/* hover effect */}}
            onClick={() => setActiveProp(prop.id)}
          >
            {/* Prop visual */}
            <div
              className="relative transition-all duration-300"
              style={{
                filter: isNear ? 'brightness(1.2)' : 'brightness(0.6)',
              }}
            >
              {/* Glow effect when near */}
              {isNear && (
                <div
                  className="absolute inset-0 blur-xl opacity-50"
                  style={{ backgroundColor: prop.color }}
                />
              )}

              {/* Prop icon/visual */}
              <PropVisual propId={prop.id} color={prop.color} />

              {/* Label */}
              {isNear && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap"
                >
                  <span
                    className="px-3 py-1 rounded-full text-sm font-medium text-white/90"
                    style={{ backgroundColor: `${prop.color}33` }}
                  >
                    {prop.name}
                  </span>
                </motion.div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

// Visual representation for each prop type
const PropVisual: React.FC<{ propId: string; color: string }> = ({
  propId,
  color,
}) => {
  const baseSize = { width: 60, height: 60 };

  switch (propId) {
    case 'microphone':
      return (
        <svg
          width={baseSize.width}
          height={baseSize.height + 20}
          viewBox="0 0 60 80"
        >
          <circle cx="30" cy="20" r="15" fill={color} opacity="0.8" />
          <rect x="27" y="30" width="6" height="30" fill="#333" />
          <ellipse cx="30" cy="70" rx="15" ry="5" fill="#222" />
        </svg>
      );

    case 'laptop':
      return (
        <svg
          width={baseSize.width + 40}
          height={baseSize.height}
          viewBox="0 0 100 60"
        >
          <rect x="5" y="40" width="90" height="8" rx="2" fill="#333" />
          <rect x="10" y="5" width="80" height="35" rx="2" fill="#222" />
          <rect x="15" y="10" width="70" height="25" fill={color} opacity="0.7" />
        </svg>
      );

    case 'projection-screen':
      return (
        <svg
          width={baseSize.width + 60}
          height={baseSize.height + 40}
          viewBox="0 0 120 100"
        >
          <rect x="5" y="5" width="110" height="70" fill={color} opacity="0.6" />
          <rect x="0" y="0" width="5" height="80" fill="#222" />
          <rect x="115" y="0" width="5" height="80" fill="#222" />
          <rect x="55" y="75" width="10" height="25" fill="#333" />
        </svg>
      );

    case 'android-phone':
      return (
        <svg width={baseSize.width} height={baseSize.height + 40} viewBox="0 0 60 100">
          <rect x="5" y="5" width="50" height="90" rx="8" fill="#111" />
          <rect x="10" y="10" width="40" height="75" fill={color} opacity="0.8" />
          <circle cx="30" cy="90" r="5" fill="#333" />
        </svg>
      );

    case 'director-chair':
      return (
        <svg width={baseSize.width} height={baseSize.height} viewBox="0 0 60 60">
          <rect x="10" y="10" width="40" height="25" fill={color} opacity="0.7" />
          <rect x="5" y="35" width="50" height="5" fill={color} opacity="0.8" />
          <rect x="15" y="40" width="4" height="20" fill="#333" />
          <rect x="41" y="40" width="4" height="20" fill="#333" />
        </svg>
      );

    case 'exit-door':
      return (
        <svg width={baseSize.width} height={baseSize.height + 40} viewBox="0 0 60 100">
          <rect x="5" y="5" width="50" height="90" fill="#1a1410" />
          <rect x="10" y="10" width="40" height="80" fill="#2a2018" />
          <rect x="20" y="85" width="20" height="6" rx="1" fill={color} />
        </svg>
      );

    default:
      return (
        <div
          className="w-16 h-16 rounded-lg"
          style={{ backgroundColor: color, opacity: 0.7 }}
        />
      );
  }
};

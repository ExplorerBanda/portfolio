import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { stageProps } from '@/data/content';
import { useTheatreStore } from '@/stores/theatreStore';

const acts = [
  { id: 'intro', title: 'Prologue', icon: '🎭' },
  { id: 'skills', title: 'Skills', icon: '💻' },
  { id: 'projects', title: 'Projects', icon: '🎬' },
  { id: 'journey', title: 'Journey', icon: '🗺️' },
  { id: 'contact', title: 'Finale', icon: '✉️' },
];

export const MobileNavigation: React.FC = () => {
  const [currentAct, setCurrentAct] = useState(0);
  const [activeProp, setActiveProp] = useState<string | null>(null);
  const { setTransitioning } = useTheatreStore();

  const handleActChange = (index: number) => {
    if (index === currentAct) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrentAct(index);
      setTransitioning(false);
    }, 300);
  };

  const propData = activeProp ? stageProps.find((p) => p.id === activeProp) : null;

  return (
    <div className="min-h-screen bg-theatre-dark">
      {/* Curtain overlay */}
      <CurtainTransition />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-30 p-4">
        <h1 className="text-theatre-gold font-display text-xl">Theatre Portfolio</h1>
      </header>

      {/* Content area */}
      <main className="pt-16 pb-24 px-4">
        <AnimatePresence mode="wait">
          {!activeProp ? (
            <motion.div
              key={currentAct}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Act title */}
              <div className="text-center mb-8">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-white/40 text-xs tracking-widest uppercase"
                >
                  {acts[currentAct].title}
                </motion.span>
              </div>

              {/* Props grid */}
              <div className="grid grid-cols-2 gap-4">
                {stageProps.map((prop, index) => (
                  <motion.button
                    key={prop.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setActiveProp(prop.id)}
                    className="relative aspect-square rounded-2xl overflow-hidden group"
                    style={{ backgroundColor: `${prop.color}20` }}
                  >
                    {/* Glow */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{
                        background: `radial-gradient(circle at center, ${prop.color}40 0%, transparent 70%)`,
                      }}
                    />

                    {/* Content */}
                    <div className="relative flex flex-col items-center justify-center h-full p-4">
                      <span className="text-4xl mb-2">
                        {getPropEmoji(prop.id)}
                      </span>
                      <span className="text-white text-sm font-medium">
                        {prop.name}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={activeProp}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              {propData && (
                <MobilePropContent
                  propData={propData}
                  onBack={() => setActiveProp(null)}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-theatre-dark/90 backdrop-blur-lg border-t border-white/10">
        <div className="flex justify-around py-2">
          {acts.map((act, index) => (
            <button
              key={act.id}
              onClick={() => handleActChange(index)}
              className={`flex flex-col items-center py-2 px-4 rounded-lg transition-all ${
                currentAct === index
                  ? 'bg-theatre-red/20 text-white'
                  : 'text-white/50'
              }`}
            >
              <span className="text-xl">{act.icon}</span>
              <span className="text-xs mt-1">{act.title}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

// Helper to get emoji for prop
const getPropEmoji = (propId: string): string => {
  const emojis: Record<string, string> = {
    microphone: '🎤',
    laptop: '💻',
    'projection-screen': '🎬',
    'android-phone': '📱',
    'director-chair': '🪑',
    'exit-door': '🚪',
  };
  return emojis[propId] || '📦';
};

// Curtain transition component
const CurtainTransition: React.FC = () => {
  const { isTransitioning } = useTheatreStore();

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          exit={{ scaleY: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 bg-theatre-red origin-bottom"
        />
      )}
    </AnimatePresence>
  );
};

// Mobile prop content component
const MobilePropContent: React.FC<{
  propData: typeof stageProps[0];
  onBack: () => void;
}> = ({ propData, onBack }) => {
  const { content, color } = propData;

  return (
    <div className="min-h-[70vh]">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-white/60 mb-6"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      {/* Header */}
      <div className="mb-6">
        <span
          className="text-xs font-semibold tracking-widest uppercase"
          style={{ color }}
        >
          {propData.name}
        </span>
        <h2 className="text-3xl font-display font-bold text-white mt-1">
          {content.title}
        </h2>
        <p className="text-white/60 mt-1">{content.subtitle}</p>
      </div>

      {/* Description */}
      <p className="text-white/80 mb-6">{content.description}</p>

      {/* Skills */}
      {content.skills && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold tracking-widest uppercase text-white/40 mb-3">
            Skills
          </h3>
          <div className="space-y-2">
            {content.skills.map((skill) => (
              <div key={skill.name}>
                <div className="flex justify-between text-sm">
                  <span className="text-white/90">{skill.name}</span>
                  <span className="text-white/40">{skill.level}%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full mt-1">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${skill.level}%`, backgroundColor: color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {content.projects && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold tracking-widest uppercase text-white/40 mb-3">
            Featured Work
          </h3>
          <div className="space-y-3">
            {content.projects.map((project) => (
              <div
                key={project.id}
                className="p-3 rounded-xl bg-white/5 border border-white/10"
              >
                <h4 className="text-white font-medium">{project.title}</h4>
                <p className="text-white/60 text-sm mt-1">{project.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Links */}
      {content.links && (
        <div className="flex flex-wrap gap-3">
          {content.links.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full font-medium text-sm"
              style={{ backgroundColor: color, color: '#0a0a0f' }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
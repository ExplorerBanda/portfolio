import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { stageProps } from '@/data/content';

interface InfoPanelProps {
  propId: string;
  onClose: () => void;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ propId, onClose }) => {
  const propData = stageProps.find((p) => p.id === propId);

  if (!propData) return null;

  const { content, color } = propData;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed inset-4 md:inset-8 lg:inset-16 z-50 pointer-events-auto"
      >
        <div className="info-panel w-full h-full rounded-2xl overflow-hidden relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center group"
          >
            <svg
              className="w-5 h-5 text-white/70 group-hover:text-white transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Decorative spotlight effect */}
          <div
            className="absolute -top-20 -left-20 w-40 h-40 rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: color }}
          />

          {/* Content */}
          <div className="h-full overflow-y-auto p-8 md:p-12">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <span
                className="text-xs font-semibold tracking-widest uppercase"
                style={{ color }}
              >
                {propData.name}
              </span>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white mt-2 text-glow">
                {content.title}
              </h2>
              <p className="text-xl text-white/60 mt-2 font-body">
                {content.subtitle}
              </p>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-white/80 text-lg leading-relaxed mb-10 max-w-2xl"
            >
              {content.description}
            </motion.p>

            {/* Skills */}
            {content.skills && content.skills.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-10"
              >
                <h3 className="text-sm font-semibold tracking-widest uppercase text-white/40 mb-4">
                  Skills
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {content.skills.map((skill, index) => (
                    <div key={skill.name} className="group">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-white/90 font-medium">
                          {skill.name}
                        </span>
                        <span className="text-white/40 text-sm">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.level}%` }}
                          transition={{ delay: 0.4 + index * 0.05, duration: 0.5 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Projects */}
            {content.projects && content.projects.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-10"
              >
                <h3 className="text-sm font-semibold tracking-widest uppercase text-white/40 mb-4">
                  Featured Work
                </h3>
                <div className="space-y-4">
                  {content.projects.map((project) => (
                    <div
                      key={project.id}
                      className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
                    >
                      <h4 className="text-white font-semibold text-lg">
                        {project.title}
                      </h4>
                      <p className="text-white/60 text-sm mt-1">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/70"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      {project.links && (
                        <div className="flex gap-4 mt-3">
                          {project.links.github && (
                            <a
                              href={project.links.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-white/50 hover:text-white transition-colors"
                            >
                              GitHub →
                            </a>
                          )}
                          {project.links.demo && (
                            <a
                              href={project.links.demo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-white/50 hover:text-white transition-colors"
                            >
                              Demo →
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Links */}
            {content.links && content.links.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-4"
              >
                {content.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-full font-medium transition-all hover:scale-105"
                    style={{
                      backgroundColor: color,
                      color: '#0a0a0f',
                    }}
                  >
                    {link.label}
                  </a>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
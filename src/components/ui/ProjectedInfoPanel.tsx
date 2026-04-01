import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { stageProps } from '@/data/content';

interface ProjectedInfoPanelProps {
  propId: string;
  onClose: () => void;
}

const projectLinkEntries = (links: {
  github?: string;
  demo?: string;
  paper?: string;
}) =>
  [
    links.github ? { label: 'GitHub', url: links.github } : null,
    links.demo ? { label: 'Demo', url: links.demo } : null,
    links.paper ? { label: 'Paper', url: links.paper } : null,
  ].filter((entry): entry is { label: string; url: string } => Boolean(entry));

export const ProjectedInfoPanel: React.FC<ProjectedInfoPanelProps> = ({
  propId,
  onClose,
}) => {
  const propData = stageProps.find((prop) => prop.id === propId);

  if (!propData) return null;

  const { content, color } = propData;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={propId}
        initial={{ opacity: 0, y: 26, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.985 }}
        transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none fixed inset-0 z-[70] flex items-center justify-center"
      >
        <div className="pointer-events-auto relative mt-3 h-[56vh] max-h-[520px] w-[min(72vw,980px)] min-w-[320px]">
          <div
            className="pointer-events-none absolute -top-8 left-1/2 h-24 w-40 -translate-x-1/2 rounded-full blur-3xl"
            style={{ backgroundColor: `${color}24` }}
          />

          <button
            onClick={onClose}
            aria-label="Close projected panel"
            className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[#2d231a]/15 bg-[#f7f1e4]/90 text-[#4b3521] transition-colors hover:bg-white"
          >
            <svg
              className="h-4 w-4"
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

          <div className="relative h-full overflow-hidden rounded-[24px] border border-[#2d231a]/10 bg-[#f4ecdc]/95 text-[#20150d] shadow-[0_30px_90px_rgba(0,0,0,0.26)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.92),rgba(244,236,220,0.96)_58%,rgba(228,216,194,0.92))]" />
            <div className="absolute inset-x-0 top-0 h-px bg-white/80" />
            <div className="absolute inset-x-12 bottom-0 h-8 rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.12),transparent_68%)] blur-xl" />

            <div className="relative grid h-full grid-cols-1 gap-6 overflow-y-auto p-6 md:grid-cols-[minmax(0,1.25fr)_minmax(260px,0.95fr)] md:gap-8 md:p-8">
              <section className="min-w-0">
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05, duration: 0.24 }}
                  className="mb-6"
                >
                  <span
                    className="text-[11px] font-semibold uppercase tracking-[0.36em]"
                    style={{ color }}
                  >
                    {propData.name}
                  </span>
                  <h2 className="mt-3 text-3xl font-bold leading-tight text-[#20150d] md:text-[2.6rem]">
                    {content.title}
                  </h2>
                  <p className="mt-2 text-base text-[#5f4d3d] md:text-lg">
                    {content.subtitle}
                  </p>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.26 }}
                  className="max-w-2xl text-[15px] leading-7 text-[#3f3024] md:text-base"
                >
                  {content.description}
                </motion.p>

                {content.projects && content.projects.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.28 }}
                    className="mt-8"
                  >
                    <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#7a6756]">
                      Featured Work
                    </h3>
                    <div className="space-y-4">
                      {content.projects.map((project) => {
                        const projectLinks = projectLinkEntries(project.links);

                        return (
                          <article
                            key={project.id}
                            className="rounded-[18px] border border-[#3d2c1f]/10 bg-white/55 p-4 shadow-[0_8px_30px_rgba(66,40,10,0.07)]"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <h4 className="text-lg font-semibold text-[#20150d]">
                                  {project.title}
                                </h4>
                                <p className="mt-1 text-sm text-[#634d3a]">
                                  {project.description}
                                </p>
                              </div>
                              <span className="shrink-0 rounded-full bg-[#eadfcb] px-3 py-1 text-xs font-medium text-[#6d5641]">
                                {project.year}
                              </span>
                            </div>

                            <div className="mt-3 flex flex-wrap gap-2">
                              {project.technologies.map((tech) => (
                                <span
                                  key={tech}
                                  className="rounded-full border border-[#3d2c1f]/10 bg-[#fbf7ef] px-3 py-1 text-xs text-[#5d4835]"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>

                            {project.highlights.length > 0 && (
                              <div className="mt-4 flex flex-wrap gap-2">
                                {project.highlights.map((highlight) => (
                                  <span
                                    key={highlight}
                                    className="rounded-full px-3 py-1 text-xs font-medium"
                                    style={{
                                      backgroundColor: `${color}1f`,
                                      color: '#3c2a1d',
                                    }}
                                  >
                                    {highlight}
                                  </span>
                                ))}
                              </div>
                            )}

                            {projectLinks.length > 0 && (
                              <div className="mt-4 flex flex-wrap gap-3">
                                {projectLinks.map((link) => (
                                  <a
                                    key={link.label}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-medium text-[#6b4b1f] underline underline-offset-4 transition-colors hover:text-[#2d1d10]"
                                  >
                                    {link.label}
                                  </a>
                                ))}
                              </div>
                            )}
                          </article>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </section>

              <section className="min-w-0">
                {content.skills && content.skills.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.28 }}
                    className="rounded-[20px] border border-[#3d2c1f]/10 bg-white/52 p-5 shadow-[0_8px_30px_rgba(66,40,10,0.06)]"
                  >
                    <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#7a6756]">
                      Skills
                    </h3>
                    <div className="space-y-4">
                      {content.skills.map((skill, index) => (
                        <div key={skill.name}>
                          <div className="mb-1.5 flex items-center justify-between gap-4">
                            <span className="text-sm font-medium text-[#2b1f15]">
                              {skill.name}
                            </span>
                            <span className="text-xs text-[#7a6756]">
                              {skill.level}%
                            </span>
                          </div>
                          <div className="h-2.5 overflow-hidden rounded-full bg-[#dfd2be]">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.level}%` }}
                              transition={{ delay: 0.24 + index * 0.05, duration: 0.45 }}
                              className="h-full rounded-full"
                              style={{
                                background: `linear-gradient(90deg, ${color}, #ffd699)`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {content.links && content.links.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.28 }}
                    className="mt-6 rounded-[20px] border border-[#3d2c1f]/10 bg-white/46 p-5 shadow-[0_8px_30px_rgba(66,40,10,0.06)]"
                  >
                    <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#7a6756]">
                      Contact
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {content.links.map((link) => (
                        <a
                          key={link.label}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full px-4 py-2 text-sm font-semibold transition-transform hover:scale-[1.03]"
                          style={{
                            backgroundColor: color,
                            color: '#16100a',
                          }}
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </section>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

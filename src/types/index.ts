// Core types for the theatre portfolio

export interface SpotlightPosition {
  x: number;
  y: number;
  smoothX: number;
  smoothY: number;
}

export interface Prop {
  id: string;
  name: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  color: string;
  content: PropContent;
}

export interface PropContent {
  title: string;
  subtitle: string;
  description: string;
  skills?: Skill[];
  projects?: Project[];
  links?: Link[];
}

export interface Skill {
  name: string;
  level: number; // 0-100
  category: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  highlights: string[];
  links: {
    github?: string;
    demo?: string;
    paper?: string;
  };
  image?: string;
  year: string;
}

export interface Link {
  label: string;
  url: string;
  icon?: string;
}

export interface Act {
  id: string;
  title: string;
  subtitle: string;
  props: string[]; // prop ids
}

export interface TheatreState {
  currentAct: number;
  acts: Act[];
  activeProp: string | null;
  isTransitioning: boolean;
  spotlightEnabled: boolean;
  audioEnabled: boolean;
}

export interface DeviceCapabilities {
  webgl: boolean;
  webgl2: boolean;
  isMobile: boolean;
  isLowEnd: boolean;
  reducedMotion: boolean;
  maxTextureSize: number;
}
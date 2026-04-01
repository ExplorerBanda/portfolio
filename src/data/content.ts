import type { Prop, Project } from '@/types';

// THEATRE BLOCKING LAYOUT (Professional Stage Design)
// =====================================================
// BACK (Z=-9):     Projection Screen (large backdrop)
// MID-BACK (Z=-4): Laptop (stage-left arc), Chair (stage-right arc)
// CENTER (Z=-2):   Microphone (main focal prop)
// MID-FRONT(Z=-1): Phone (front-right support)
// FRONT (Z=1):     Exit Door (center - contact point)
//
// Visual Hierarchy:
// - Primary: Microphone (center, brightest)
// - Secondary: Laptop, Chair, Phone (mid-layer)
// - Tertiary: Screen (background), Exit Door (front interaction)

// Prop definitions with positions on the stage
export const stageProps: Prop[] = [
  {
    id: 'microphone',
    name: 'Stage Artist',
    // CENTER SPOTLIGHT - hanging stage microphone as the prologue hero prop
    position: [0, 1.8, -1.95],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    color: '#FFD700',
    content: {
      title: 'Stage Artist',
      subtitle: 'From scripts to standing ovations',
      description: 'Theatre has taught me the art of storytelling, presence, and connecting with an audience. These skills translate directly into how I present ideas and lead teams.',
      skills: [
        { name: 'Public Speaking', level: 95, category: 'performance' },
        { name: 'Theatre Direction', level: 85, category: 'performance' },
        { name: 'Storytelling', level: 90, category: 'performance' },
        { name: 'Event Hosting', level: 88, category: 'performance' },
      ],
      projects: [
        {
          id: 'college-play',
          title: 'College Annual Play Director',
          description: 'Directed and produced the annual college theatrical production, managing a team of 40+ students.',
          technologies: ['Direction', 'Script Writing', 'Stage Management'],
          highlights: ['Standing ovation from 500+ audience', 'Best Production Award'],
          links: {},
          year: '2024',
        },
      ],
    },
  },
  {
    id: 'laptop',
    name: 'Technical Toolkit',
    // CENTER SPOTLIGHT - toolkit hero prop for the skills page
    position: [0, 0.18, -1.95],
    rotation: [0, 0, 0],
    scale: [0.82, 0.82, 0.82],
    color: '#00D4FF',
    content: {
      title: 'Software Engineer',
      subtitle: 'Code that makes a difference',
      description: 'Building meaningful software solutions across web, mobile, and AI domains. Passionate about clean code and innovative solutions.',
      skills: [
        { name: 'Python', level: 95, category: 'programming' },
        { name: 'JavaScript/TypeScript', level: 88, category: 'programming' },
        { name: 'React', level: 85, category: 'web' },
        { name: 'Node.js', level: 80, category: 'web' },
        { name: 'SQL', level: 85, category: 'data' },
      ],
      projects: [
        {
          id: 'portfolio',
          title: 'This Interactive Portfolio',
          description: 'A theatre-themed interactive portfolio built with React, Three.js, and GSAP.',
          technologies: ['React', 'Three.js', 'TypeScript', 'GSAP', 'Framer Motion'],
          highlights: ['Unique concept execution', '60fps animations', 'Mobile fallback'],
          links: { github: 'https://github.com/' },
          year: '2025',
        },
      ],
    },
  },
  {
    id: 'projection-screen',
    name: 'ML Knowledge',
    // CENTER SPOTLIGHT - clickable robot that triggers the projection area
    position: [0, 0.08, -1.95],
    rotation: [0, 0, 0],
    scale: [1.08, 1.08, 1.08],
    color: '#FF6B6B',
    content: {
      title: 'ML & AI Engineer',
      subtitle: 'Teaching machines to learn',
      description: 'Exploring the frontiers of artificial intelligence through research and practical applications. Focused on making complex concepts accessible.',
      skills: [
        { name: 'Machine Learning', level: 85, category: 'ml' },
        { name: 'TensorFlow', level: 80, category: 'ml' },
        { name: 'Data Science', level: 88, category: 'ml' },
        { name: 'Computer Vision', level: 75, category: 'ml' },
      ],
      projects: [
        {
          id: 'ml-research',
          title: 'Research on Neural Network Optimization',
          description: 'Published research on improving neural network training efficiency.',
          technologies: ['Python', 'TensorFlow', 'NumPy', 'Jupyter'],
          highlights: ['Published paper', '15% accuracy improvement'],
          links: { paper: 'https://...' },
          year: '2024',
        },
      ],
    },
  },
  {
    id: 'android-phone',
    name: 'Education Canvas',
    // CENTER SPOTLIGHT - education easel as the hero prop
    position: [0, 0.08, -1.95],
    rotation: [0, 0, 0],
    scale: [0.98, 0.98, 0.98],
    color: '#3DDC84',
    content: {
      title: 'Android Developer',
      subtitle: 'Apps in millions of pockets',
      description: 'Creating intuitive mobile experiences with modern Android development practices.',
      skills: [
        { name: 'Kotlin', level: 85, category: 'android' },
        { name: 'Jetpack Compose', level: 80, category: 'android' },
        { name: 'Firebase', level: 85, category: 'android' },
        { name: 'Material Design', level: 88, category: 'android' },
      ],
      projects: [
        {
          id: 'android-app',
          title: 'Published Android Application',
          description: 'A utility app published on Google Play Store with 10K+ downloads.',
          technologies: ['Kotlin', 'Jetpack Compose', 'Firebase', 'Material 3'],
          highlights: ['10K+ downloads', '4.5 star rating'],
          links: { demo: 'https://play.google.com/' },
          year: '2024',
        },
      ],
    },
  },
  {
    id: 'director-chair',
    name: 'Leadership',
    // CENTER SPOTLIGHT - leadership podium as the hero prop for its act
    position: [0, 0.1, -1.95],
    rotation: [0, 0, 0],
    scale: [1.12, 1.12, 1.12],
    color: '#9B59B6',
    content: {
      title: 'Leader',
      subtitle: 'Guiding teams to success',
      description: 'Leadership experience from NSS and various technical communities. Believes in empowering others to achieve collective goals.',
      skills: [
        { name: 'Team Management', level: 90, category: 'soft' },
        { name: 'Project Planning', level: 85, category: 'soft' },
        { name: 'Stakeholder Communication', level: 88, category: 'soft' },
        { name: 'Agile/Scrum', level: 82, category: 'soft' },
      ],
      projects: [
        {
          id: 'nss-leadership',
          title: 'NSS Unit Leader',
          description: 'Led the National Service Scheme unit, organizing community service events and managing 200+ volunteers.',
          technologies: ['Event Management', 'Volunteer Coordination', 'Budget Planning'],
          highlights: ['200+ volunteers managed', '50+ events organized', 'Community Impact Award'],
          links: {},
          year: '2023-2024',
        },
      ],
    },
  },
  {
    id: 'exit-door',
    name: 'Contact',
    // CENTER SPOTLIGHT - contact telephone vignette as the finale prop
    position: [0, 0.02, -1.95],
    rotation: [0, 0, 0],
    scale: [1.08, 1.08, 1.08],
    color: '#FFFFFF',
    content: {
      title: 'Let\'s Connect',
      subtitle: 'The show must go on... with you',
      description: 'Ready for the next act. Open to opportunities in software engineering, ML/AI, or Android development.',
      links: [
        { label: 'GitHub', url: 'https://github.com/', icon: 'github' },
        { label: 'LinkedIn', url: 'https://linkedin.com/', icon: 'linkedin' },
        { label: 'Email', url: 'mailto:your@email.com', icon: 'email' },
      ],
    },
  },
];

// Skills by category
export const skillCategories = {
  programming: {
    title: 'Programming Languages',
    skills: [
      { name: 'Python', level: 95, category: 'programming' },
      { name: 'JavaScript', level: 88, category: 'programming' },
      { name: 'TypeScript', level: 82, category: 'programming' },
      { name: 'Kotlin', level: 85, category: 'programming' },
      { name: 'Java', level: 78, category: 'programming' },
      { name: 'SQL', level: 85, category: 'programming' },
    ],
  },
  ml: {
    title: 'Machine Learning & AI',
    skills: [
      { name: 'TensorFlow', level: 80, category: 'ml' },
      { name: 'Scikit-learn', level: 85, category: 'ml' },
      { name: 'Pandas', level: 90, category: 'ml' },
      { name: 'NumPy', level: 88, category: 'ml' },
      { name: 'Computer Vision', level: 75, category: 'ml' },
      { name: 'NLP', level: 70, category: 'ml' },
    ],
  },
  web: {
    title: 'Web Development',
    skills: [
      { name: 'React', level: 85, category: 'web' },
      { name: 'Node.js', level: 80, category: 'web' },
      { name: 'Three.js', level: 65, category: 'web' },
      { name: 'Next.js', level: 75, category: 'web' },
      { name: 'Tailwind CSS', level: 88, category: 'web' },
    ],
  },
  android: {
    title: 'Android Development',
    skills: [
      { name: 'Kotlin', level: 85, category: 'android' },
      { name: 'Jetpack Compose', level: 80, category: 'android' },
      { name: 'Firebase', level: 85, category: 'android' },
      { name: 'Material Design', level: 88, category: 'android' },
      { name: 'Room Database', level: 75, category: 'android' },
    ],
  },
  soft: {
    title: 'Leadership & Soft Skills',
    skills: [
      { name: 'Public Speaking', level: 95, category: 'soft' },
      { name: 'Team Leadership', level: 90, category: 'soft' },
      { name: 'Project Management', level: 85, category: 'soft' },
      { name: 'Event Organization', level: 88, category: 'soft' },
      { name: 'Technical Writing', level: 80, category: 'soft' },
    ],
  },
};

// Sample projects
export const featuredProjects: Project[] = [
  {
    id: 'portfolio-theatre',
    title: 'Theatre Portfolio',
    description: 'An immersive, interactive portfolio website designed as a theatre stage with cursor-as-spotlight navigation.',
    technologies: ['React', 'Three.js', 'GSAP', 'TypeScript', 'Framer Motion'],
    highlights: [
      'Unique theatre-themed concept',
      'Cursor-as-spotlight interaction',
      'Smooth 60fps animations',
      'Mobile-responsive fallback',
    ],
    links: { github: 'https://github.com/' },
    year: '2025',
  },
  {
    id: 'ml-model',
    title: 'Neural Network Optimization Research',
    description: 'Published research on improving neural network training efficiency through novel optimization techniques.',
    technologies: ['Python', 'TensorFlow', 'NumPy', 'Jupyter'],
    highlights: [
      'Published in conference proceedings',
      '15% improvement in training efficiency',
      'Open-source implementation',
    ],
    links: { github: 'https://github.com/', paper: 'https://...' },
    year: '2024',
  },
];

export interface ProjectionLinkItem {
  label: string;
  value: string;
}

export interface ProjectionSlide {
  id: string;
  label: string;
  title: string;
  subtitle?: string;
  highlights: string[];
  techStack?: string[];
  links?: ProjectionLinkItem[];
  footer?: string;
  status?: string;
}

export const projectionDecks: Record<string, ProjectionSlide[]> = {
  microphone: [
    {
      id: 'about',
      label: 'ABOUT',
      title: 'Yash Rawat',
      subtitle: 'Machine Learning Developer',
      highlights: [
        'Backend-focused ML developer building intelligent systems',
        'Recommendation engines and data-driven applications',
        'Machine Learning Engineering and Data Analysis',
        'Backend Development for practical AI systems',
      ],
      footer: 'Seeking entry-level ML / Data opportunities.',
    },
  ],
  laptop: [
    {
      id: 'skills',
      label: 'SKILLS',
      title: 'My Technical Toolkit',
      subtitle: 'Builder stack for ML and data work',
      highlights: [
        'Programming: Python, SQL',
        'Machine Learning: Scikit-learn, Feature Engineering, Model Evaluation',
        'Data Analysis: Pandas, NumPy, Matplotlib',
        'Tools: Git, GitHub, Streamlit',
        'Familiar: JavaScript, Kotlin, REST APIs',
      ],
      techStack: ['Python', 'SQL', 'Scikit-learn', 'Pandas', 'NumPy', 'Streamlit'],
    },
    {
      id: 'anu',
      label: 'PROJECTS',
      title: 'ANU - Anytime Near You',
      subtitle: 'AI Recommendation System',
      highlights: [
        'Intelligent recommendation engine',
        'Content-based filtering',
        'Real-time backend processing',
        'Scalable architecture design',
      ],
      techStack: ['Python', 'Recommendation Logic', 'Backend APIs'],
      status: 'Ongoing Project',
    },
    {
      id: 'pipeline-visualizer',
      label: 'PROJECTS',
      title: 'ML Pipeline Visualizer',
      subtitle: 'ML Workflow Education Tool',
      highlights: [
        'Visual ML pipeline demonstration',
        'Preprocessing to evaluation stages',
        'Model comparison interface',
        'Educational visualization design',
      ],
      techStack: ['Python', 'Streamlit', 'Scikit-learn'],
    },
    {
      id: 'fraudshield',
      label: 'PROJECTS',
      title: 'FraudShield AI',
      subtitle: 'Transaction Fraud Detection',
      highlights: [
        'ML classification pipeline',
        '500K+ transaction analysis',
        '15% detection improvement',
        'Real-time fraud dashboard',
      ],
      techStack: ['Python', 'Scikit-learn', 'Streamlit'],
    },
    {
      id: 'placement-predictor',
      label: 'PROJECTS',
      title: 'Placement Prediction ML Dashboard',
      subtitle: 'ML Prediction System',
      highlights: [
        'End-to-end ML pipeline',
        'Model comparison testing',
        '~90% prediction accuracy',
        'Real-time dashboard',
      ],
      techStack: ['Python', 'Scikit-learn', 'Streamlit'],
    },
  ],
  'projection-screen': [
    {
      id: 'ml-knowledge',
      label: 'ML KNOWLEDGE',
      title: 'Machine Learning Knowledge',
      subtitle: 'Core algorithms and concepts',
      highlights: [
        'Logistic Regression and KNN',
        'Decision Trees and Random Forest',
        'Cross Validation and Model Evaluation',
        'Overfitting, Feature Scaling, and generalization',
      ],
      techStack: ['Scikit-learn', 'Model Evaluation', 'Feature Engineering'],
    },
    {
      id: 'current-learning',
      label: 'CURRENT LEARNING',
      title: 'Currently Learning',
      subtitle: 'Sharpening the stack',
      highlights: [
        'SQL Optimization',
        'Model Deployment',
        'Advanced Scikit-learn',
      ],
      techStack: ['SQL', 'Deployment', 'Scikit-learn'],
    },
  ],
  'director-chair': [
    {
      id: 'hackathon',
      label: 'HACKATHON',
      title: 'Hackathon Victory',
      subtitle: 'Codathon Winner 2025',
      highlights: [
        'Built hospital management system',
        'Led team of 5 developers',
        'Full stack development leadership',
        'Optimized workflows',
      ],
      footer: '1st place among 30+ teams',
    },
    {
      id: 'leadership',
      label: 'LEADERSHIP',
      title: 'Leadership Experience',
      subtitle: 'Teams, events, and execution',
      highlights: [
        'NSS President',
        'Managing volunteer teams',
        'Event coordination',
        'Technical presentations',
        'Cross-team collaboration',
      ],
    },
  ],
  'android-phone': [
    {
      id: 'education',
      label: 'EDUCATION',
      title: 'Education',
      subtitle: 'Academic foundation',
      highlights: [
        'Bachelor of Computer Applications',
        'Noida International University',
        '2023 - 2026',
        'CBSE Senior Secondary: 80%',
        'CBSE Secondary: 79%',
      ],
    },
  ],
  'exit-door': [
    {
      id: 'contact',
      label: 'CONTACT',
      title: "Let's Connect",
      subtitle: 'Machine learning and data opportunities',
      highlights: [
        'Email: yashrawat.ml@gmail.com',
        'Location: New Delhi',
        'GitHub: ExplorerBanda',
        'LinkedIn: yash-rawat-ml',
      ],
      links: [
        { label: 'GitHub', value: 'ExplorerBanda' },
        { label: 'LinkedIn', value: 'yash-rawat-ml' },
        { label: 'Email', value: 'yashrawat.ml@gmail.com' },
      ],
      footer: 'Open to ML and Data opportunities.',
    },
  ],
};

// ============================================================
//  PORTFOLIO CONFIG — edit this file to customize everything
// ============================================================

export const OWNER = {
  name: 'Agustin Lancuba',
  title: 'Full Stack Developer | Migrating monoliths to microservices',
  greeting: '👋 Hi, I\'m',
  bio: [
    'Software Engineer specialized in Full Stack and Cloud Architecture.',
    'I build systems that are secure by design and pleasant to use.',
    'This portfolio is proof of that: a fully functional RCE environment.',
    '',
    'Contact: agustinlancuba.sistemas@gmail.com',
  ].join('\n'),
  description:
    'I build scalable architectures and transform legacy systems. ' +
    'You can explore my work through the terminal or use the quick actions below.',
  cv: 'https://drive.google.com/your-cv-link', // ← replace with your real URL
  social: {
    github:   'https://github.com/lancubal',
    linkedin: 'https://linkedin.com/in/agustinlancuba',
    email:    'agustinlancuba.sistemas@gmail.com',
  },
};

// Proyectos — usados en la GUI y en el comando `ls projects` de la terminal
export const PROJECTS = [
  {
    id: '1',
    name: 'RootResume',
    description: 'This very portfolio — Remote Code Execution with real containers',
    stack: ['Next.js', 'Node.js', 'Docker', 'AWS'],
    status: 'Production-Ready',
    github: 'https://github.com/lancubal/RootResumeOS',
  },
  {
    id: '2',
    name: 'legacy-migrator',
    description: 'Tool to migrate monolithic apps to microservices',
    stack: ['Python', 'Bash', 'Ansible'],
    status: 'Concept',
    github: 'https://github.com/lancubal/legacy-migrator',
  },
];

// GUI panel pills → each one fires a real command in the terminal
export const QUICK_COMMANDS = [
  {
    emoji: '🚀',
    label: 'Python Demo',
    command: 'python3 /home/demo/demo.py',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    emoji: '⚙️',
    label: 'Tech Stack',
    command: 'cat /home/demo/tech-stack.md',
    color: 'from-purple-500 to-pink-500',
  },
  {
    emoji: '📂',
    label: 'My Projects',
    command: 'ls projects',
    color: 'from-amber-500 to-orange-500',
  },
  {
    emoji: '❓',
    label: 'Help',
    command: 'help',
    color: 'from-zinc-600 to-zinc-800',
  },
];

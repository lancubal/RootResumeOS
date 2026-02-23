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

// ── Project status options ────────────────────────────────────────────────────
export type ProjectStatus = 'Production-Ready' | 'In Progress' | 'Concept' | 'Archived';

// ── Projects — used in the GUI, terminal `ls projects`, and /projects page ───
export const PROJECTS = [
  {
    id: '1',
    name: 'RootResume',
    description: 'This very portfolio — a fully functional RCE environment running real Alpine Linux containers per browser session. Includes algorithm visualizations streamed via SSE.',
    stack: ['Next.js', 'Node.js', 'Docker', 'AWS', 'Nginx', 'TypeScript'],
    category: 'Web',
    status: 'Production-Ready' as ProjectStatus,
    year: 2026,
    github: 'https://github.com/lancubal/RootResumeOS',
    url: '',
    tags: ['portfolio', 'containers', 'real-time', 'SSE', 'linux', 'RCE'],
    featured: true,
  },
  {
    id: '2',
    name: 'legacy-migrator',
    description: 'CLI tool that analyzes monolithic codebases, maps inter-module dependencies, and generates Ansible playbooks to extract services incrementally with zero downtime.',
    stack: ['Python', 'Bash', 'Ansible'],
    category: 'DevOps',
    status: 'Concept' as ProjectStatus,
    year: 2025,
    github: 'https://github.com/lancubal/legacy-migrator',
    url: '',
    tags: ['migration', 'microservices', 'monolith', 'automation', 'CLI'],
    featured: false,
  },
  {
    id: '3',
    name: 'api-sentinel',
    description: 'Lightweight middleware layer that validates all inbound API contracts against OpenAPI schemas, logs anomalies, and blocks malformed requests before they hit the service layer.',
    stack: ['Node.js', 'Express', 'OpenAPI', 'Redis'],
    category: 'Backend',
    status: 'In Progress' as ProjectStatus,
    year: 2025,
    github: 'https://github.com/lancubal/api-sentinel',
    url: '',
    tags: ['API', 'validation', 'middleware', 'security', 'OpenAPI'],
    featured: false,
  },
  {
    id: '4',
    name: 'infra-snapshot',
    description: 'Terraform + Python tool that audits live AWS infrastructure and produces a human-readable drift report comparing the actual state against IaC definitions.',
    stack: ['Python', 'Terraform', 'AWS', 'Boto3'],
    category: 'DevOps',
    status: 'Concept' as ProjectStatus,
    year: 2024,
    github: 'https://github.com/lancubal/infra-snapshot',
    url: '',
    tags: ['terraform', 'AWS', 'IaC', 'drift', 'DevOps'],
    featured: false,
  },
  {
    id: '5',
    name: 'react-term-ui',
    description: 'Headless React component library for building terminal-style UIs. Provides shell prompt, history navigation, tab completion, and streaming output primitives.',
    stack: ['React', 'TypeScript', 'Tailwind CSS'],
    category: 'Web',
    status: 'Concept' as ProjectStatus,
    year: 2026,
    github: 'https://github.com/lancubal/react-term-ui',
    url: '',
    tags: ['component-library', 'terminal', 'headless', 'open-source'],
    featured: false,
  },
];

// ── Blog posts — add/remove entries freely ───────────────────────────────────
export const BLOG_POSTS = [
  {
    id: '1',
    slug: 'rce-portfolio',
    title: 'Building a portfolio that runs real code in the browser',
    summary: 'How I wired Docker, Server-Sent Events, and a custom React terminal emulator to create RootResume — a portfolio where every visitor gets a live Alpine Linux container.',
    date: '2026-02-20',
    readTime: 8,
    tags: ['portfolio', 'Docker', 'SSE', 'Next.js', 'architecture'],
    published: true,
  },
  {
    id: '2',
    slug: 'sse-vs-websockets',
    title: 'SSE vs WebSockets for real-time terminal output',
    summary: 'When I needed to stream live process output to the browser I chose Server-Sent Events over WebSockets. Here is the reasoning, the trade-offs, and when each one wins.',
    date: '2026-02-10',
    readTime: 6,
    tags: ['SSE', 'WebSockets', 'real-time', 'Node.js', 'architecture'],
    published: true,
  },
  {
    id: '3',
    slug: 'monolith-to-microservices',
    title: 'Practical patterns for migrating a monolith — without burning it down',
    summary: 'A field guide to incremental service extraction: strangler fig, anti-corruption layers, feature flags, and the mistakes I made along the way.',
    date: '2026-01-28',
    readTime: 12,
    tags: ['microservices', 'migration', 'architecture', 'backend'],
    published: true,
  },
  {
    id: '4',
    slug: 'docker-per-session',
    title: 'One Docker container per browser tab — is it sane?',
    summary: 'Exploration of the resource model, security posture, and scaling limits of spinning up a fresh container on every session. Spoiler: at portfolio scale, it works fine.',
    date: '2026-01-15',
    readTime: 7,
    tags: ['Docker', 'security', 'isolation', 'containers'],
    published: true,
  },
  {
    id: '5',
    slug: 'openapi-validation-middleware',
    title: 'Zero-overhead API contract validation with OpenAPI and Express',
    summary: 'How to validate every request and response against your OpenAPI spec at runtime without measurable latency cost — and why you should.',
    date: '2025-12-05',
    readTime: 9,
    tags: ['API', 'OpenAPI', 'Express', 'middleware', 'Node.js'],
    published: true,
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

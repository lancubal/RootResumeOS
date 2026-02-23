// ============================================================
//  PORTFOLIO CONFIG — editá este archivo para personalizar todo
// ============================================================

export const OWNER = {
  name: 'Agustin Lancuba',
  title: 'Full Stack Developer | Migrando monolitos a microservicios',
  greeting: '👋 Hola, soy',
  bio: [
    'Software Engineer especializado en Full Stack y Cloud Architecture.',
    'Creo sistemas seguros por diseño y agradables de usar.',
    'Este portfolio es prueba de eso: un entorno RCE completamente funcional.',
    '',
    'Contacto: agustinlancuba.sistemas@gmail.com',
  ].join('\n'),
  description:
    'Construyo arquitecturas escalables y transformo sistemas legacy. ' +
    'Podés explorar mi trabajo a través de la terminal o usar los accesos rápidos de abajo.',
  cv: 'https://drive.google.com/your-cv-link', // ← reemplazá con tu URL real
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
    description: 'Este mismo portfolio — Remote Code Execution con contenedores reales',
    stack: ['Next.js', 'Node.js', 'Docker', 'AWS'],
    status: 'Production-Ready',
    github: 'https://github.com/lancubal/RootResumeOS',
  },
  {
    id: '2',
    name: 'legacy-migrator',
    description: 'Herramienta para migrar apps monolíticas a microservicios',
    stack: ['Python', 'Bash', 'Ansible'],
    status: 'Concept',
    github: 'https://github.com/lancubal/legacy-migrator',
  },
];

// Pills del panel GUI → cada uno dispara un comando real en la terminal
export const QUICK_COMMANDS = [
  {
    emoji: '🚀',
    label: 'Demo en Python',
    command: 'python3 /home/demo/demo.py',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    emoji: '⚙️',
    label: 'Ver Tech Stack',
    command: 'cat /home/demo/tech-stack.md',
    color: 'from-purple-500 to-pink-500',
  },
  {
    emoji: '📂',
    label: 'Mis Proyectos',
    command: 'ls projects',
    color: 'from-amber-500 to-orange-500',
  },
  {
    emoji: '❓',
    label: 'Ayuda',
    command: 'help',
    color: 'from-zinc-600 to-zinc-800',
  },
];

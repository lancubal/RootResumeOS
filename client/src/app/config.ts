// ============================================================
//  PORTFOLIO CONFIG — edit this file to customize everything
// ============================================================

export const OWNER = {
  name: 'Luna Lancuba',
  title: 'Full Stack Developer\nMigrating monoliths to microservices',
  greeting: '👋 Hi, I\'m',
  bio: [
    'Software Engineer specialized in Full Stack and Cloud Architecture.',
    'I build systems that are secure by design and pleasant to use.',
    'This portfolio is proof of that: a fully functional RCE environment.',
    '',
    'Contact: lunalancuba.sistemas@gmail.com',
  ].join('\n'),
  description:
    'I build scalable architectures and transform legacy systems. ' +
    'You can explore my work through the terminal or use the quick actions below.',
  cv: 'https://drive.google.com/your-cv-link', // ← replace with your real URL
  social: {
    github:   'https://github.com/lancubal',
    linkedin: 'https://linkedin.com/in/luna-lancuba-6621491b8',
    email:    'lunalancuba.sistemas@gmail.com',
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
    content: [
      {
        heading: 'The problem with most developer portfolios',
        body: `Most portfolios are a list of links and buzzwords. You read a description that says "I know Docker" or "I build scalable systems" and you just have to take the person's word for it. I wanted to build something that *shows* instead of *tells* — a portfolio where the infrastructure itself is the proof of skill.`,
      },
      {
        heading: 'The idea: a real Linux terminal in the browser',
        body: `The core concept is simple: when you load the page, the server spins up a fresh Alpine Linux container just for you. Everything you type in the terminal runs inside that container — real GCC compilation, real Python execution, real filesystem navigation. Nothing is simulated.\n\nThis isn't a toy shell. It's a Docker container with a full userland, mounted with a small set of demo files, and exposed to the frontend through a Node.js Express server that proxies exec calls and streams stdout back in real time.`,
      },
      {
        heading: 'Architecture overview',
        body: `The stack has three layers:\n\n1. **Frontend** — Next.js 15 with a custom React terminal emulator. The terminal holds session state, renders history, handles Tab completion, and connects to the backend via HTTP.\n\n2. **Backend** — Node.js + Express. It talks to the Docker socket directly (no Docker SDK, just raw socket calls) to create containers, exec commands, and stream stdout. SSE (Server-Sent Events) carries the stream to the browser.\n\n3. **Container** — Alpine Linux, ~6MB image. GCC and Python3 are pre-installed. Containers are network-isolated, read-only except for /tmp, and get a 1-hour TTL before auto-cleanup.`,
      },
      {
        heading: 'Why SSE instead of WebSockets?',
        body: `Server-Sent Events are unidirectional (server → client) and that's exactly what I need for streaming process output. WebSockets are bidirectional, which adds handshake complexity and a stateful connection that I don't need. SSE works over standard HTTP/2, is trivially proxied by Nginx, and has native browser support via the EventSource API. See my dedicated post on this tradeoff for a deeper comparison.`,
      },
      {
        heading: 'The visualization engine',
        body: `To demonstrate algorithm animations, I embedded source code strings for 9 algorithms directly in the server. When you run \`visualize bubble\`, the server base64-encodes the C source, writes it to the container, compiles it with GCC, executes it, and streams each animation frame as an SSE message. The terminal replaces the previous frame in-place, creating smooth terminal animation at ~30fps.`,
      },
      {
        heading: 'Security considerations',
        body: `Running arbitrary code from anonymous visitors is inherently risky. The mitigations I put in place: containers run as an unprivileged user, network interfaces are disabled, filesystem is read-only except for /tmp capped at 50MB, memory is capped at 128MB, and CPU shares are throttled. Sessions self-destruct after 60 minutes. It's not perfect for a production SaaS, but for a portfolio with low traffic it's a reasonable tradeoff.`,
      },
    ],
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
    content: [
      {
        heading: 'The default answer is wrong',
        body: `When developers need to push data from server to browser in real time, the instinct is to reach for WebSockets. They're the "real-time" technology. But WebSockets are a bidirectional full-duplex protocol — and sometimes you simply don't need full duplex. Choosing the right tool starts with asking: who needs to talk, and in which direction?`,
      },
      {
        heading: 'What SSE actually is',
        body: `Server-Sent Events (SSE) is an HTTP-based protocol where the server keeps a connection open and pushes newline-delimited text frames to the browser. The browser side is the native \`EventSource\` API. That's it. No upgrade handshake, no binary framing, no persistent socket state. Just a long-lived GET request with \`Content-Type: text/event-stream\`.`,
      },
      {
        heading: 'When SSE wins',
        body: `SSE is the right choice when:\n- The flow is **server → client only** (live logs, notifications, progress bars, streaming LLM output)\n- You want **automatic reconnect** for free (EventSource reconnects on drop without any code)\n- You're behind a **standard HTTP reverse proxy** (Nginx, Caddy, AWS ALB — no special WebSocket config needed)\n- You want **HTTP/2 multiplexing** — SSE rides on the existing H2 connection, WebSockets require a separate socket\n\nFor RootResume, streaming process stdout to the browser is a perfect one-way flow. SSE was the obvious choice.`,
      },
      {
        heading: 'When WebSockets win',
        body: `WebSockets win when:\n- You need **true bidirectional low-latency communication** (multiplayer games, collaborative editing, chat with typing indicators)\n- You're sending **binary data** at high frequency (audio/video, binary game state)\n- You need **sub-100ms round-trip** where the HTTP overhead of SSE frames actually matters\n\nFor a chat app, a multiplayer canvas, or a real-time collaborative IDE — use WebSockets.`,
      },
      {
        heading: 'The practical difference in Node.js',
        body: `With SSE, the server side is a plain Express response handler:\n\n\`\`\`js\nres.setHeader('Content-Type', 'text/event-stream');\nres.setHeader('Cache-Control', 'no-cache');\nprocess.stdout.on('data', chunk => {\n  res.write(\`data: \${encode(chunk)}\\n\\n\`);\n});\n\`\`\`\n\nWith WebSockets you need an upgrade handler, a ws library, and to manage socket lifecycle separately from your HTTP server. More surface area, more failure modes.`,
      },
    ],
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
    content: [
      {
        heading: 'The big-bang rewrite fantasy',
        body: `Every engineer who has worked on a legacy monolith has had the same thought: "Let's just rewrite it from scratch." And almost every team that acts on that impulse regrets it. The new system takes twice as long as expected. The monolith keeps accumulating bug fixes and features during the rewrite. By the time the new system is ready, it's already behind — and it inherited all the subtle business logic bugs that nobody documented.`,
      },
      {
        heading: 'The Strangler Fig pattern',
        body: `The strangler fig is a tree that grows around its host, slowly replacing it from the outside in. Applied to software: instead of replacing the monolith, you route specific traffic slices away from it and into new services, one at a time. The monolith keeps running. Users don't notice. You strangle it gradually.\n\nIn practice this means putting a proxy (Nginx, an API gateway, or a simple routing layer) in front of the monolith and redirecting specific URL prefixes or feature flags to new services as they're ready.`,
      },
      {
        heading: 'Anti-Corruption Layers',
        body: `When you extract a service, it needs to talk to the monolith during the transition. Don't let the new service import the monolith's domain model — that creates exactly the coupling you're trying to escape. Instead, build an Anti-Corruption Layer (ACL): a translation module that converts between the monolith's concepts and the new service's domain.\n\nThe ACL lives in the new service and is temporary. Once the monolith feature is fully retired, the ACL is deleted.`,
      },
      {
        heading: 'Feature flags for safe extraction',
        body: `Feature flags let you deploy extracted services to production without exposing them to users. You can exercise the new path in staging, run it in shadow mode (fire requests at both old and new, compare responses), and gradually roll out by user segment. If something breaks, you flip the flag without a deploy.`,
      },
      {
        heading: 'The database problem',
        body: `The hardest part of a monolith migration is the shared database. Microservices are supposed to own their data, but the monolith probably has one big relational database that everything touches. The migration path: first, identify which tables belong to the domain you're extracting. Then add an API layer over those tables in the monolith. Then cut the new service over to its own database and let the API layer handle the sync period.`,
      },
      {
        heading: 'Mistakes I made',
        body: `1. Extracted too many services at once — each one was fine in isolation but the operational overhead multiplied.\n2. Forgot to migrate the shared event bus, so events were still tying services together through the monolith's message queue.\n3. Underestimated the "unknown" business logic buried in stored procedures.\n\nRule of thumb: extract one service, run it in production for a month, learn from it, then extract the next.`,
      },
    ],
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
    content: [
      {
        heading: 'The model',
        body: `When you load RootResume in your browser, the server calls \`docker create\` and spins up a fresh Alpine Linux container. That container persists for the duration of your session (up to 60 minutes) and then gets auto-removed. No state is shared between sessions. Every visitor gets a clean slate.`,
      },
      {
        heading: 'Resource cost',
        body: `An idle Alpine container with GCC and Python installed consumes about 4-6MB of RAM and essentially zero CPU. That's because Alpine Linux is designed to be minimal — the base image is 6MB on disk. At 100 concurrent visitors, that's under 600MB of RAM just for container overhead. The GCC compilations and Python executions spike CPU briefly (under 1 second each), but since they're short-lived and containerized, contention is minimal at portfolio traffic levels.`,
      },
      {
        heading: 'Security posture',
        body: `The container runs with:\n- **No network interface** — can't make outbound connections, can't scan your LAN\n- **Read-only rootfs** except \`/tmp\` (capped at 50MB)\n- **Non-root user** inside the container\n- **Memory cap**: 128MB — can't exhaust the host\n- **CPU shares** throttled so one session can't starve others\n- **No privileged mode**, no extra capabilities\n\nThis is defense-in-depth. Any single escape attempt has multiple layers to get through.`,
      },
      {
        heading: 'Container lifecycle management',
        body: `Every container gets a UUID session ID. The backend stores a map of \`sessionId → containerId\`. A background job runs every 5 minutes and calls \`docker ps\` to find containers older than 60 minutes and removes them. If a visitor closes the tab without finishing their session, the container orphans and gets cleaned up on the next sweep.`,
      },
      {
        heading: 'Scaling limits',
        body: `At portfolio traffic (~50-200 concurrent visitors), this is fine. At production SaaS scale you'd want a container pool (pre-warm N containers and hand them to users on demand), a container orchestrator (Kubernetes with resource quotas), and a distributed session store. But for a portfolio? The current architecture is intentionally over-engineered for learning and intentionally simple for maintenance.`,
      },
    ],
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
    content: [
      {
        heading: 'Why validate at all?',
        body: `The classic argument against runtime validation is performance — "just don't, it's slow." This is outdated. Modern JSON Schema validators (ajv, zod, typebox) run in microseconds per request. The cost is negligible compared to a database query or an external API call. The benefit — catching contract violations at the boundary before they propagate — is enormous for debugging and reliability.`,
      },
      {
        heading: 'The approach: OpenAPI spec as the single source of truth',
        body: `Instead of writing validation code by hand, I define the API contract once in an OpenAPI 3.1 spec and let tooling derive validators from it. The spec is used for:\n- Runtime request/response validation (ajv)\n- TypeScript type generation (openapi-typescript)\n- Documentation (Swagger UI)\n- Client SDK generation (openapi-generator)\n\nOne spec, four consumers. Change the spec and everything stays in sync.`,
      },
      {
        heading: 'Wiring it into Express',
        body: `The key insight is to precompile the validators at startup, not per-request. Load the spec once, walk the \`paths\` object, compile an ajv validator for each request body schema and response schema, and store them in a lookup map keyed by \`METHOD /path\`. The middleware then just does a lookup in O(1) and runs a precompiled validator. There's no schema parsing at request time — that work is already done.`,
      },
      {
        heading: 'Handling validation errors gracefully',
        body: `When validation fails, return a structured 400 response with the ajv \`errors\` array. I wrap ajv errors into a consistent format:\n\n\`\`\`json\n{\n  "error": "ValidationError",\n  "issues": [\n    { "path": "/body/userId", "message": "must be string" }\n  ]\n}\n\`\`\`\n\nThis tells clients exactly what's wrong without leaking internal stack traces.`,
      },
      {
        heading: 'Response validation in staging',
        body: `Validating responses (not just requests) catches bugs in your own code — when your handler returns a shape that doesn't match the spec. I run response validation in staging and log violations without rejecting the response, so I can fix latent bugs without impacting production. Once the spec drift is cleaned up, I flip to strict mode that returns 500 on spec violation in all environments.`,
      },
    ],
  },
];

// ── Skills — used in the terminal `skills` command and PresentationPanel pills ─
export type SkillCategory = 'Languages' | 'Backend' | 'Frontend' | 'DevOps';

export const SKILLS: { name: string; level: number; category: SkillCategory }[] = [
  // Languages
  { name: 'TypeScript', level: 90, category: 'Languages' },
  { name: 'Python',     level: 85, category: 'Languages' },
  { name: 'Java',       level: 75, category: 'Languages' },
  { name: 'Bash',       level: 82, category: 'Languages' },
  // Backend
  { name: 'Node.js',    level: 88, category: 'Backend' },
  { name: 'Express',    level: 85, category: 'Backend' },
  { name: 'PostgreSQL', level: 80, category: 'Backend' },
  { name: 'Redis',      level: 74, category: 'Backend' },
  // Frontend
  { name: 'React',      level: 88, category: 'Frontend' },
  { name: 'Next.js',    level: 85, category: 'Frontend' },
  { name: 'Tailwind',   level: 92, category: 'Frontend' },
  // DevOps
  { name: 'Docker',     level: 86, category: 'DevOps' },
  { name: 'AWS',        level: 76, category: 'DevOps' },
  { name: 'Nginx',      level: 80, category: 'DevOps' },
  { name: 'Terraform',  level: 70, category: 'DevOps' },
  { name: 'Linux',      level: 88, category: 'DevOps' },
];

// ── Skill category colors — used by PresentationPanel pills ─────────────────
export const SKILL_CATEGORY_COLORS: Record<SkillCategory, string> = {
  Languages: 'bg-blue-50 text-blue-700 border-blue-200',
  Backend:   'bg-emerald-50 text-emerald-700 border-emerald-200',
  Frontend:  'bg-violet-50 text-violet-700 border-violet-200',
  DevOps:    'bg-amber-50 text-amber-700 border-amber-200',
};

// GUI panel pills → each one fires a real command in the terminal
export const QUICK_COMMANDS = [
  {
    emoji: '�',
    label: 'My Projects',
    command: 'ls projects',
    color: 'from-amber-500 to-orange-500',
  },
  {
    emoji: '🚀',
    label: 'Python Demo',
    command: 'python3 /home/demo/demo.py',
    color: 'from-rose-500 to-pink-500',
  },
  {
    emoji: '⚙️',
    label: 'Tech Stack',
    command: 'cat /home/demo/tech-stack.md',
    color: 'from-indigo-500 to-violet-500',
  },
  {
    emoji: '❓',
    label: 'Help',
    command: 'help',
    color: 'from-green-500 to-emerald-500',
  },
];

// ── Fortune quotes — shown by `fortune` terminal command ─────────────────────
export const FORTUNE_QUOTES = [
  { text: 'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.', author: 'Martin Fowler' },
  { text: 'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.', author: 'Brian W. Kernighan' },
  { text: 'Before software can be reusable it first has to be usable.', author: 'Ralph Johnson' },
  { text: 'The best performance improvement is the transition from the nonworking state to the working state.', author: 'J. Osterhout' },
  { text: 'Make it work, make it right, make it fast.', author: 'Kent Beck' },
  { text: 'Premature optimization is the root of all evil.', author: 'Donald Knuth' },
  { text: 'Programs must be written for people to read, and only incidentally for machines to execute.', author: 'Harold Abelson' },
  { text: 'Simplicity is the soul of efficiency.', author: 'Austin Freeman' },
  { text: 'Code is like humor. When you have to explain it, it\'s bad.', author: 'Cory House' },
  { text: 'The only way to go fast is to go well.', author: 'Robert C. Martin' },
  { text: 'Talk is cheap. Show me the code.', author: 'Linus Torvalds' },
  { text: 'First, solve the problem. Then, write the code.', author: 'John Johnson' },
  { text: 'Java is to JavaScript what Car is to Carpet.', author: 'Chris Heilmann' },
  { text: 'It\'s not a bug — it\'s an undocumented feature.', author: 'Anonymous' },
  { text: 'The best error message is the one that never shows up.', author: 'Thomas Fuchs' },
  { text: 'Real programmers don\'t comment their code. If it was hard to write, it should be hard to understand.', author: 'Anonymous' },
  { text: 'The function of good software is to make the complex appear simple.', author: 'Grady Booch' },
  { text: 'Experience is the name everyone gives to their mistakes.', author: 'Oscar Wilde' },
];

// ── Uses — tools, hardware, and services ─────────────────────────────────────
export const USES = [
  {
    category: 'Editor & IDE',
    icon: '🖊️',
    items: [
      { name: 'VS Code', description: 'Primary editor. Theme: One Dark Pro. Font: Geist Mono.' },
      { name: 'Neovim', description: 'For quick edits in the terminal. Lazy.nvim plugin manager.' },
      { name: 'IntelliJ IDEA', description: 'When working on heavy Java / Spring Boot projects.' },
    ],
  },
  {
    category: 'Terminal',
    icon: '⌨️',
    items: [
      { name: 'Warp', description: 'Modern terminal with AI command completion and blocks.' },
      { name: 'Zsh + Oh My Zsh', description: 'Shell. Plugins: git, zsh-autosuggestions, z.' },
      { name: 'tmux', description: 'Session management. Custom status bar, prefix: Ctrl+A.' },
      { name: 'fzf', description: 'Fuzzy finder — history search, file jump, git branch switcher.' },
    ],
  },
  {
    category: 'Services & DevOps',
    icon: '☁️',
    items: [
      { name: 'AWS EC2 + ECS', description: 'Compute. This portfolio runs on a t3.small.' },
      { name: 'Cloudflare', description: 'DNS, CDN, and WAF in front of everything.' },
      { name: 'GitHub', description: 'Version control. GitHub Actions for CI.' },
      { name: 'Vercel', description: 'Staging deployments and preview URLs.' },
      { name: 'Docker Hub', description: 'Container registry for session images.' },
    ],
  },
  {
    category: 'Hardware',
    icon: '💻',
    items: [
      { name: 'ThinkPad T14', description: 'Daily driver. Solid Linux compatibility, great keyboard.' },
      { name: 'Acer KG271U', description: '27" 1440p monitor. Sharp display for both code and everything else.' },
      { name: 'Ultimate Hacking Keyboard', description: 'Split mechanical keyboard. Programmable, modular, built to last.' },
      { name: 'Logitech MX Master 3', description: 'Mouse. The scroll wheel alone is worth it.' },
    ],
  },
  {
    category: 'Fonts & Design',
    icon: '🔤',
    items: [
      { name: 'Geist Mono', description: 'Coding font. Used in this portfolio.' },
      { name: 'Inter', description: 'UI font for everything web.' },
      { name: 'Figma', description: 'Design and wireframing. Free tier is plenty.' },
    ],
  },
];

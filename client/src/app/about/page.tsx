"use client";

import { motion } from "motion/react";
import Link from "next/link";
import {
    ArrowLeft,
    Globe,
    Server,
    Layers,
    Terminal,
    Cpu,
    Zap,
    Shield,
    GitBranch,
} from "lucide-react";

const Section = ({
    icon: Icon,
    title,
    color,
    children,
    delay = 0,
}: {
    icon: React.ElementType;
    title: string;
    color: string;
    children: React.ReactNode;
    delay?: number;
}) => (
    <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-8">
        <div className="flex items-center gap-3 mb-6">
            <div
                className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center shadow`}>
                <Icon className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-zinc-800">{title}</h2>
        </div>
        {children}
    </motion.section>
);

const Pill = ({
    text,
    color = "bg-zinc-100 text-zinc-700",
}: {
    text: string;
    color?: string;
}) => (
    <span
        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        {text}
    </span>
);

const CodeBlock = ({ children }: { children: React.ReactNode }) => (
    <pre className="bg-zinc-900 text-green-400 rounded-lg p-4 text-xs font-mono overflow-x-auto leading-relaxed mt-3 mb-3">
        {children}
    </pre>
);

const Flow = ({ steps }: { steps: { label: string; detail?: string }[] }) => (
    <div className="flex flex-wrap items-center gap-2 my-4">
        {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
                <div className="bg-zinc-800 text-zinc-100 rounded-lg px-3 py-1.5 text-xs font-mono">
                    <div className="font-semibold">{s.label}</div>
                    {s.detail && (
                        <div className="text-zinc-400 text-[10px]">
                            {s.detail}
                        </div>
                    )}
                </div>
                {i < steps.length - 1 && (
                    <span className="text-zinc-400 text-sm">→</span>
                )}
            </div>
        ))}
    </div>
);

export default function AboutPage() {
    return (
        <div className="min-h-screen" style={{ backgroundColor: "#f6f6f7" }}>
            {/* Top bar */}
            <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-zinc-200 px-6 py-4 flex items-center gap-4">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-zinc-500 hover:text-zinc-800 transition-colors text-sm font-medium">
                    <ArrowLeft className="w-4 h-4" />
                    Back to portfolio
                </Link>
                <div className="h-4 w-px bg-zinc-300" />
                <span className="text-zinc-400 text-sm">
                    Architecture deep-dive
                </span>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-12 space-y-8">
                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}>
                    <div className="flex items-center gap-2 text-sm text-indigo-600 font-medium mb-3">
                        <Terminal className="w-4 h-4" />
                        RootResume OS — Technical breakdown
                    </div>
                    <h1 className="text-4xl font-bold text-zinc-900 mb-4 leading-tight">
                        How this portfolio works
                    </h1>
                    <p className="text-zinc-500 text-lg leading-relaxed max-w-2xl">
                        Behind the terminal interface there&apos;s a real Linux
                        container running in the cloud. Every command you type
                        executes inside an isolated Alpine environment — this
                        page explains how all the pieces fit together.
                    </p>
                </motion.div>

                {/* Architecture overview */}
                <Section
                    icon={Layers}
                    title="Architecture overview"
                    color="bg-gradient-to-br from-indigo-500 to-violet-500"
                    delay={0.1}>
                    <p className="text-zinc-600 text-sm leading-relaxed mb-4">
                        The system follows a{" "}
                        <strong>stateful session model</strong>: when you open
                        the page a session is created on the backend, which
                        spins up a Docker container assigned exclusively to your
                        browser tab. All subsequent commands go to that
                        container and nowhere else.
                    </p>

                    <Flow
                        steps={[
                            { label: "Browser", detail: "Next.js + React" },
                            {
                                label: "API Gateway",
                                detail: "Nginx reverse proxy",
                            },
                            { label: "Node.js API", detail: "Express + SSE" },
                            {
                                label: "Docker daemon",
                                detail: "container per session",
                            },
                            {
                                label: "Alpine Linux",
                                detail: "GCC · Python3 · bash",
                            },
                        ]}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                        <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-100">
                            <div className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-1">
                                Isolation
                            </div>
                            <div className="text-sm text-zinc-700">
                                Each session runs in its own container — no
                                shared filesystem or process namespace between
                                users.
                            </div>
                        </div>
                        <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-100">
                            <div className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-1">
                                Streaming
                            </div>
                            <div className="text-sm text-zinc-700">
                                Visualizations stream frame-by-frame via
                                Server-Sent Events so you see output in real
                                time.
                            </div>
                        </div>
                        <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-100">
                            <div className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-1">
                                Ephemeral
                            </div>
                            <div className="text-sm text-zinc-700">
                                Containers are destroyed after inactivity.
                                Nothing persists between sessions — by design.
                            </div>
                        </div>
                    </div>
                </Section>

                {/* Frontend */}
                <Section
                    icon={Globe}
                    title="Frontend"
                    color="bg-gradient-to-br from-cyan-500 to-blue-500"
                    delay={0.2}>
                    <div className="flex flex-wrap gap-2 mb-5">
                        {[
                            "Next.js 15 (App Router)",
                            "React 18",
                            "TypeScript",
                            "Tailwind CSS v4",
                            "Framer Motion",
                            "Geist Font",
                        ].map((t) => (
                            <Pill
                                key={t}
                                text={t}
                                color="bg-blue-50 text-blue-700"
                            />
                        ))}
                    </div>

                    <p className="text-zinc-600 text-sm leading-relaxed mb-4">
                        The UI is a <strong>custom terminal emulator</strong>{" "}
                        built entirely in React — no xterm.js or third-party
                        shell libraries. It manages command history, tab
                        completion, streaming output buffers, and a code editor
                        (Monaco-style) for the challenge system, all in a single
                        TSX component.
                    </p>

                    <h3 className="text-sm font-semibold text-zinc-700 mb-2">
                        Real-time streaming with EventSource
                    </h3>
                    <p className="text-zinc-600 text-sm leading-relaxed mb-2">
                        Visualizations (sorting algorithms, maze generation,
                        fractals) use the browser&apos;s native{" "}
                        <code className="bg-zinc-100 px-1 rounded text-xs">
                            EventSource
                        </code>{" "}
                        API to open a persistent SSE connection. Each frame
                        arrives as a base64-encoded chunk and overwrites the
                        last history slot in-place, creating smooth in-terminal
                        animations without any WebSocket overhead.
                    </p>

                    <CodeBlock>{`// Simplified streaming handler
const evtSource = new EventSource(\`/api/stream?sessionId=\${id}&vizId=maze\`);

evtSource.onmessage = (event) => {
  const frame = atob(event.data);   // base64 → text frame
  setHistory(prev => {
    const next = [...prev];
    next[next.length - 1] = { text: frame, type: "output" };
    return next;                     // replace last slot → animated update
  });
};`}</CodeBlock>

                    <h3 className="text-sm font-semibold text-zinc-700 mb-2 mt-4">
                        Layout
                    </h3>
                    <p className="text-zinc-600 text-sm leading-relaxed">
                        Desktop renders a CSS Grid split — left panel
                        (presentation) + vertical separator + right panel
                        (terminal + quick-action buttons). On mobile the
                        terminal collapses into a slide-up drawer triggered by a
                        floating action button. Animations across the whole UI
                        use Framer Motion with optimistic render patterns.
                    </p>
                </Section>

                {/* Backend */}
                <Section
                    icon={Server}
                    title="Backend"
                    color="bg-gradient-to-br from-emerald-500 to-teal-500"
                    delay={0.3}>
                    <div className="flex flex-wrap gap-2 mb-5">
                        {[
                            "Node.js",
                            "Express",
                            "SSE",
                            "Dockerode / docker exec",
                            "Alpine Linux",
                            "GCC",
                            "Python 3",
                        ].map((t) => (
                            <Pill
                                key={t}
                                text={t}
                                color="bg-emerald-50 text-emerald-700"
                            />
                        ))}
                    </div>

                    <p className="text-zinc-600 text-sm leading-relaxed mb-4">
                        The Express API exposes a small set of endpoints. The
                        most important ones are
                        <code className="bg-zinc-100 px-1 rounded text-xs mx-1">
                            /exec
                        </code>{" "}
                        for standard commands and
                        <code className="bg-zinc-100 px-1 rounded text-xs mx-1">
                            /stream
                        </code>{" "}
                        for visualization output. It is structured around three
                        managers:
                    </p>

                    <div className="space-y-4">
                        <div className="border-l-2 border-emerald-400 pl-4">
                            <div className="text-sm font-semibold text-zinc-800 mb-1">
                                SessionManager
                            </div>
                            <div className="text-sm text-zinc-600">
                                Creates and tracks Docker containers (one per
                                browser session) using
                                <code className="bg-zinc-100 px-1 rounded text-xs mx-1">
                                    docker exec
                                </code>
                                . Handles session TTL, cleanup on inactivity,
                                and command execution with stdout/stderr
                                capture. Each session is a UUID mapped to a live
                                container ID.
                            </div>
                        </div>
                        <div className="border-l-2 border-blue-400 pl-4">
                            <div className="text-sm font-semibold text-zinc-800 mb-1">
                                VisualizationManager
                            </div>
                            <div className="text-sm text-zinc-600">
                                Holds the source code for all 9 visualizations
                                (5 in C, 4 in Python) as in-memory strings. On
                                request, it base64-encodes the source, writes it
                                into the container filesystem via{" "}
                                <code className="bg-zinc-100 px-1 rounded text-xs mx-1">
                                    echo &quot;$b64&quot; | base64 -d &gt;
                                    file.c
                                </code>
                                , compiles it with GCC if needed, and returns
                                the runnable command to the streaming endpoint.
                            </div>
                        </div>
                        <div className="border-l-2 border-purple-400 pl-4">
                            <div className="text-sm font-semibold text-zinc-800 mb-1">
                                ChallengeManager
                            </div>
                            <div className="text-sm text-zinc-600">
                                Scaffolds coding challenges by writing broken
                                source files into the container. The user edits
                                them via the built-in code editor, and
                                <code className="bg-zinc-100 px-1 rounded text-xs mx-1">
                                    verify
                                </code>{" "}
                                compiles and runs the fixed code against a test
                                harness — all inside the container.
                            </div>
                        </div>
                    </div>

                    <h3 className="text-sm font-semibold text-zinc-700 mt-6 mb-2">
                        SSE streaming pipeline
                    </h3>
                    <p className="text-zinc-600 text-sm leading-relaxed mb-2">
                        For visualizations the server spawns the binary/script
                        inside the container and attaches to its stdout stream.
                        Each chunk is base64-encoded and pushed as an SSE event.
                        The response headers set{" "}
                        <code className="bg-zinc-100 px-1 rounded text-xs">
                            Content-Type: text/event-stream
                        </code>{" "}
                        and disable buffering (
                        <code className="bg-zinc-100 px-1 rounded text-xs">
                            X-Accel-Buffering: no
                        </code>
                        ) so Nginx forwards data immediately without
                        accumulation.
                    </p>

                    <CodeBlock>{`// Simplified /stream endpoint
res.setHeader("Content-Type", "text/event-stream");
res.setHeader("X-Accel-Buffering", "no");   // tell nginx: don't buffer

const cmd = await vizManager.prepareVisualization(sessionId, vizId);
const proc = await sessionManager.spawnStream(sessionId, cmd);

proc.stdout.on("data", (chunk) => {
  const encoded = Buffer.from(chunk).toString("base64");
  res.write(\`data: \${encoded}\\n\\n\`);   // SSE format
});

proc.on("close", () => {
  res.write("event: close\\ndata: done\\n\\n");
  res.end();
});`}</CodeBlock>
                </Section>

                {/* Container isolation */}
                <Section
                    icon={Shield}
                    title="Container isolation & security"
                    color="bg-gradient-to-br from-rose-500 to-orange-500"
                    delay={0.4}>
                    <p className="text-zinc-600 text-sm leading-relaxed mb-4">
                        Letting strangers run arbitrary code is risky by
                        definition. The mitigation strategy is{" "}
                        <strong>isolation by design</strong> rather than a
                        sandbox within a shared process — actual separate
                        containers.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-rose-50 rounded-xl p-4 border border-rose-100">
                            <div className="text-xs font-semibold text-rose-700 uppercase tracking-widest mb-2">
                                Network
                            </div>
                            <div className="text-sm text-zinc-700">
                                Containers run with no outbound internet access
                                (
                                <code className="bg-white px-1 rounded text-xs">
                                    --network none
                                </code>
                                ). They can&apos;t reach external services or
                                exfiltrate data.
                            </div>
                        </div>
                        <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                            <div className="text-xs font-semibold text-orange-700 uppercase tracking-widest mb-2">
                                Resources
                            </div>
                            <div className="text-sm text-zinc-700">
                                CPU and memory are capped per container. A
                                fork-bomb or memory hog affects only its own
                                container and gets killed on TTL expiry.
                            </div>
                        </div>
                        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                            <div className="text-xs font-semibold text-amber-700 uppercase tracking-widest mb-2">
                                Filesystem
                            </div>
                            <div className="text-sm text-zinc-700">
                                Each container starts from a clean Alpine image.
                                There is no shared volume — one user&apos;s
                                files are invisible to another&apos;s.
                            </div>
                        </div>
                        <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-100">
                            <div className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2">
                                Ephemeral TTL
                            </div>
                            <div className="text-sm text-zinc-700">
                                Idle containers are reaped automatically.
                                There&apos;s no persistent state between page
                                loads — intentional, to keep the host clean.
                            </div>
                        </div>
                    </div>
                </Section>

                {/* Infrastructure */}
                <Section
                    icon={Cpu}
                    title="Infrastructure & deployment"
                    color="bg-gradient-to-br from-amber-500 to-yellow-500"
                    delay={0.5}>
                    <div className="flex flex-wrap gap-2 mb-5">
                        {[
                            "AWS EC2",
                            "Docker",
                            "Nginx",
                            "PM2",
                            "Let's Encrypt / HTTPS",
                        ].map((t) => (
                            <Pill
                                key={t}
                                text={t}
                                color="bg-amber-50 text-amber-700"
                            />
                        ))}
                    </div>

                    <p className="text-zinc-600 text-sm leading-relaxed mb-4">
                        Both the Next.js frontend and the Node.js API run on a
                        single <strong>AWS EC2 instance</strong> behind Nginx.
                        Nginx acts as a reverse proxy, routing{" "}
                        <code className="bg-zinc-100 px-1 rounded text-xs">
                            /api/*
                        </code>{" "}
                        to the Node backend and everything else to the Next.js
                        server. PM2 keeps both processes alive and restarts them
                        on crash.
                    </p>

                    <Flow
                        steps={[
                            { label: "EC2 :443", detail: "HTTPS / TLS" },
                            { label: "Nginx", detail: "reverse proxy" },
                            { label: ":3000", detail: "Next.js (PM2)" },
                            { label: ":4000", detail: "Express API (PM2)" },
                            { label: "Docker", detail: "container pool" },
                        ]}
                    />

                    <p className="text-zinc-600 text-sm leading-relaxed mt-2">
                        The Docker daemon runs on the host and the Node.js
                        process has access to the Docker socket. This means the
                        API can create, exec into, and destroy containers
                        without needing a sidecar process — but it also means
                        the API process itself must be trusted (it runs as a
                        dedicated non-root user with socket access, not as
                        root).
                    </p>
                </Section>

                {/* Visualization engine */}
                <Section
                    icon={Zap}
                    title="Visualization engine"
                    color="bg-gradient-to-br from-violet-500 to-fuchsia-500"
                    delay={0.6}>
                    <p className="text-zinc-600 text-sm leading-relaxed mb-4">
                        All 9 algorithm visualizations are{" "}
                        <strong>source code stored as JS strings</strong> in
                        <code className="bg-zinc-100 px-1 rounded text-xs mx-1">
                            visualizationManager.js
                        </code>
                        . Nothing is pre-compiled or cached on disk — every run
                        writes the source fresh, compiles it (for C), and
                        executes it inside the session&apos;s container.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <div className="text-sm font-semibold text-zinc-700 mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-400 rounded-full" />
                                C visualizations (GCC)
                            </div>
                            <ul className="space-y-1 text-sm text-zinc-600">
                                <li>• Bubble Sort — O(n²) compare & swap</li>
                                <li>• Selection Sort — min-scan passes</li>
                                <li>• Quick Sort — pivot partitioning</li>
                                <li>
                                    • BFS Pathfinding — queue-based flood fill
                                </li>
                                <li>
                                    • DFS Pathfinding — recursive backtracking
                                </li>
                            </ul>
                            <CodeBlock>{`# Write → Compile → Execute pipeline
echo "$b64" | base64 -d > bubble.c
gcc bubble.c -o bubble_app
./bubble_app       # stdout → SSE frames`}</CodeBlock>
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-zinc-700 mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 bg-yellow-400 rounded-full" />
                                Python visualizations
                            </div>
                            <ul className="space-y-1 text-sm text-zinc-600">
                                <li>
                                    • Conway&apos;s Game of Life — B3/S23 rules
                                </li>
                                <li>• Mandelbrot Set — fractal depth chars</li>
                                <li>
                                    • Monte Carlo π — probabilistic estimation
                                </li>
                                <li>
                                    • Maze Gen + Solver — DFS build / BFS solve
                                </li>
                            </ul>
                            <CodeBlock>{`# Write → Execute (no compilation step)
echo "$b64" | base64 -d > maze_app.py
python3 ./maze_app.py  # stdout → SSE frames`}</CodeBlock>
                        </div>
                    </div>

                    <p className="text-zinc-600 text-sm leading-relaxed mt-2">
                        Each program prints full frames to stdout. The terminal
                        client receives them via SSE and replaces the last
                        history slot in-place, creating a smooth animation with
                        no DOM thrashing. Pressing{" "}
                        <code className="bg-zinc-100 px-1 rounded text-xs">
                            Ctrl+C
                        </code>{" "}
                        closes the EventSource on the client and sends a kill
                        signal to the container process.
                    </p>
                </Section>

                {/* Source */}
                <Section
                    icon={GitBranch}
                    title="Open source"
                    color="bg-gradient-to-br from-zinc-700 to-zinc-900"
                    delay={0.7}>
                    <p className="text-zinc-600 text-sm leading-relaxed mb-4">
                        The full source code is public on GitHub. Feel free to
                        fork it, run it locally with Docker Compose, or adapt it
                        for your own portfolio.
                    </p>
                    <a
                        href="https://github.com/lancubal/RootResumeOS"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-700 text-white text-sm font-medium transition-colors shadow">
                        <GitBranch className="w-4 h-4" />
                        View on GitHub
                    </a>
                </Section>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="text-center text-zinc-400 text-sm pb-8">
                    Built by Luna Lancuba · {new Date().getFullYear()}
                </motion.div>
            </main>
        </div>
    );
}

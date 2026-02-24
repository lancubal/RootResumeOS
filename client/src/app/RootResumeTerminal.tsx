"use client";

import { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import CodeEditor from "./CodeEditor";
import { Tv2 } from "lucide-react";
import { PROJECTS, OWNER, SKILLS, FORTUNE_QUOTES } from "./config";

interface HistoryItem {
    text: string;
    type?: "cmd" | "output" | "error" | "header" | "logo" | "info" | "viz";
    cwd?: string;
    username?: string;
}

const VIZ_DESCRIPTIONS: Record<string, string[]> = {
    bubble: [
        "Bubble Sort  |  O(n²) time  |  O(1) space",
        "Repeatedly steps through the list, compares adjacent elements and swaps",
        "them if out of order. The largest values 'bubble up' to the end.",
    ],
    selection: [
        "Selection Sort  |  O(n²) time  |  O(1) space",
        "Scans the unsorted portion for the minimum element and swaps it into",
        "its correct position at the front of the sorted region.",
    ],
    quick: [
        "Quick Sort  |  O(n log n) avg, O(n²) worst  |  O(log n) space",
        "Divide & Conquer: picks a pivot, partitions the array so that all",
        "smaller elements are left of it, larger to the right, then recurses.",
    ],
    pathfinder: [
        "BFS Pathfinding  |  O(V + E)  |  Guarantees shortest path",
        "Explores all nodes at the current depth before moving deeper.",
        "Uses a queue — expansion spreads like a ripple from the start (S) to end (E).",
    ],
    dfs: [
        "DFS Pathfinding  |  O(V + E)  |  Does NOT guarantee shortest path",
        "Plunges as deep as possible along one branch before backtracking.",
        "Uses recursion (implicit call-stack) — can find long winding paths.",
    ],
    life: [
        "Conway's Game of Life  |  Cellular Automaton  |  Rule B3/S23",
        "Each cell lives or dies based on its 8 neighbors each generation:",
        "Born if exactly 3 neighbors alive | Survives with 2–3 | Dies otherwise.",
    ],
    mandelbrot: [
        "Mandelbrot Set  |  Fractal  |  f(z) = z² + c",
        "For each pixel c in the complex plane, iterate z = z² + c from z=0.",
        "Char density shows iteration depth before |z| > 2 — revealing infinite boundary detail.",
    ],
    montecarlo: [
        "Monte Carlo π Estimation  |  Probabilistic  |  Convergence: O(1/√n)",
        "Scatter random points in a 2×2 square; count those inside the unit circle.",
        "Ratio inside/total ≈ π/4 — more samples → better approximation of π.",
    ],
    maze: [
        "Maze Gen + Solver  |  Gen: DFS recursive backtracker  |  Solve: BFS",
        "Phase 1 — Generation: carve passages using randomized depth-first search.",
        "Phase 2 — Solving: find shortest path S→E with breadth-first search (*=path, .=explored).",
    ],
};

interface TerminalProps {
    /** Command injected from the GUI quick-buttons */
    command?: string;
    onCommandExecuted?: () => void;
}

export default function RootResumeTerminal({
    command: injectedCommand,
    onCommandExecuted,
}: TerminalProps = {}) {
    const [input, setInput] = useState("");
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);
    const [username, setUsername] = useState("guest");
    const [cwd, setCwd] = useState("~");

    // Command History Navigation
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    // Environment Configuration
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

    // Editor State
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editorFilename, setEditorFilename] = useState("");
    const [editorContent, setEditorContent] = useState("");

    // CRT phosphor mode
    const [crtMode, setCrtMode] = useState(false);

    // Ref to hold the active EventSource stream for commands like 'top' or 'visualize'
    const streamRef = useRef<EventSource | null>(null);

    const ALL_COMMANDS = [
        // Custom
        "ls projects",
        "cat about-me.md",
        "visualize",
        "skills",
        "matrix",
        "fortune",
        "konami",
        "challenge",
        "start",
        "edit",
        "verify",
        "about",
        "top",
        "help",
        "?",
        "clear",
        "whoami",
        "login",
        // Common Linux
        "ls",
        "pwd",
        "echo",
        "touch",
        "rm",
        "mkdir",
        "cd",
        "cat",
        "python",
        "gcc",
        "rustc",
    ];

    // Data from config
    const ABOUT_ME = OWNER.bio;

    // Refs for auto-scrolling and focus
    const terminalEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Inject command from GUI buttons — typewriter effect
    useEffect(() => {
        if (!injectedCommand || !sessionId || isInitializing) return;

        setInput("");
        const timeouts: ReturnType<typeof setTimeout>[] = [];

        // Type each character at 30ms intervals
        [...injectedCommand].forEach((char, i) => {
            const t = setTimeout(() => {
                setInput((prev) => prev + char);
            }, i * 30);
            timeouts.push(t);
        });

        // Submit after all chars are typed + short pause
        const submitDelay = injectedCommand.length * 30 + 150;
        const submitT = setTimeout(() => {
            handleSubmitCommand(injectedCommand);
            onCommandExecuted?.();
        }, submitDelay);
        timeouts.push(submitT);

        return () => timeouts.forEach(clearTimeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [injectedCommand, sessionId, isInitializing]);

    // Global Ctrl+C handler for streams
    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && (e.key === "l" || e.key === "L")) {
                e.preventDefault();
                setHistory([]);
                setIsLoading(false);
                setTimeout(() => inputRef.current?.focus(), 10);
                return;
            }
            if (e.ctrlKey && (e.key === "c" || e.key === "C")) {
                if (streamRef.current) {
                    e.preventDefault();
                    streamRef.current.close();
                    streamRef.current = null;
                    setHistory((prev) => [
                        ...prev,
                        {
                            text: "^C",
                            type: "cmd",
                            cwd: cwd,
                            username: username,
                        },
                    ]);
                    setIsLoading(false);
                    setTimeout(() => inputRef.current?.focus(), 10);
                }
            }
        };

        window.addEventListener("keydown", handleGlobalKeyDown);
        return () => {
            window.removeEventListener("keydown", handleGlobalKeyDown);
        };
    }, [streamRef, cwd, username]); // Dependency array ensures the listener always has the latest ref

    const handleTerminalClick = () => {
        inputRef.current?.focus();
    };

    useEffect(() => {
        terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [history]);

    // Initialize Session
    useEffect(() => {
        const initSession = async () => {
            try {
                // Session persistence can be disabled via env var (useful during development)
                const persistSession =
                    process.env.NEXT_PUBLIC_PERSIST_SESSION !== "false";

                if (persistSession) {
                    const storedSid = sessionStorage.getItem("rootresume_sid");
                    const storedHistory =
                        sessionStorage.getItem("rootresume_history");
                    if (storedSid && storedHistory) {
                        // Validate the session is still alive on the server before
                        // trusting it. If the server was restarted its in-memory Map
                        // is empty even though sessionStorage still holds the old ID.
                        try {
                            const checkRes = await fetch(
                                `${API_URL}/session/${storedSid}`,
                            );
                            if (checkRes.ok) {
                                setSessionId(storedSid);
                                setHistory(JSON.parse(storedHistory));
                                setIsInitializing(false);
                                return;
                            }
                        } catch {
                            // Server unreachable — fall through to start fresh
                        }
                        // Session no longer valid — clear stale storage
                        sessionStorage.removeItem("rootresume_sid");
                        sessionStorage.removeItem("rootresume_history");
                    }
                }

                const res = await fetch(`${API_URL}/start`, { method: "POST" });
                const data = await res.json();

                if (data.sessionId) {
                    const initialHistory: HistoryItem[] = [
                        {
                            text: "Welcome to RootResume OS v1.0",
                            type: "header",
                        },
                        {
                            text: "Copyright (c) 2026 Luna Lancuba.",
                            type: "output",
                        },
                        { text: "", type: "output" },
                        {
                            text: "CTF CHALLENGE: During boot, a legacy script left a .db artifact in one of the lib directories. It might contain sensitive credentials.",
                            type: "error",
                        },
                        {
                            text: "Type 'help' for available commands.",
                            type: "output",
                        },
                        {
                            text: "────────────────────────────────",
                            type: "output",
                        },
                        { text: "", type: "output" },
                    ];
                    sessionStorage.setItem("rootresume_sid", data.sessionId);
                    sessionStorage.setItem(
                        "rootresume_history",
                        JSON.stringify(initialHistory),
                    );
                    setSessionId(data.sessionId);
                    setHistory(initialHistory);
                } else {
                    setHistory([
                        {
                            text: "Error: Failed to initialize session.",
                            type: "error",
                        },
                    ]);
                }
            } catch (err) {
                setHistory([
                    {
                        text: `Connection Error: ${err instanceof Error ? err.message : "Unknown error"}`,
                        type: "error",
                    },
                ]);
            } finally {
                setIsInitializing(false);
            }
        };

        initSession();
    }, []);

    // Persist history to sessionStorage on every change (cap at 300 items)
    useEffect(() => {
        if (sessionId && history.length > 0) {
            sessionStorage.setItem(
                "rootresume_history",
                JSON.stringify(history.slice(-300)),
            );
        }
    }, [history, sessionId]);

    // --- EDITOR HANDLERS ---
    const handleEditorSave = async (content: string) => {
        setIsEditorOpen(false);
        if (!sessionId) return;

        try {
            const b64 = btoa(content);
            const cmd = `echo "${b64}" | base64 -d > ${editorFilename}`;
            setIsLoading(true);
            setHistory((prev) => [
                ...prev,
                { text: `> Saving ${editorFilename}...`, type: "output" },
            ]);

            await fetch(`${API_URL}/exec`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sessionId, code: cmd }),
            });
            setHistory((prev) => [
                ...prev,
                { text: `> Saved.`, type: "output" },
            ]);
        } catch (err) {
            setHistory((prev) => [
                ...prev,
                { text: `> Error saving file.`, type: "error" },
            ]);
        } finally {
            setIsLoading(false);
            setTimeout(() => inputRef.current?.focus(), 10);
        }
    };

    const handleEditorClose = () => {
        setIsEditorOpen(false);
        setTimeout(() => inputRef.current?.focus(), 10);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "ArrowUp") {
            e.preventDefault();
            if (commandHistory.length > 0) {
                const newIndex = Math.min(
                    historyIndex + 1,
                    commandHistory.length - 1,
                );
                setHistoryIndex(newIndex);
                setInput(commandHistory[commandHistory.length - 1 - newIndex]);
            }
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1;
                setHistoryIndex(newIndex);
                setInput(commandHistory[commandHistory.length - 1 - newIndex]);
            } else {
                setHistoryIndex(-1);
                setInput("");
            }
        } else if (e.key === "Enter") {
            handleSubmit();
        } else if (e.key === "Tab") {
            e.preventDefault();

            if (input.includes(" ")) {
                // Path completion
                const parts = input.trim().split(" ");
                const partialPath = parts[parts.length - 1];

                fetch(`${API_URL}/autocomplete`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ sessionId, partial: partialPath }),
                })
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.completions && data.completions.length > 0) {
                            if (data.completions.length === 1) {
                                const completed = data.completions[0];
                                const lastPartIndex = input.lastIndexOf(" ");
                                const newInput =
                                    input.substring(0, lastPartIndex) +
                                    ` ${completed}`;
                                setInput(
                                    newInput +
                                        (completed.endsWith("/") ? "" : " "),
                                );
                            } else {
                                setHistory((prev) => [
                                    ...prev,
                                    {
                                        text: input,
                                        type: "cmd",
                                        cwd: cwd,
                                        username: username,
                                    },
                                ]);
                                setHistory((prev) => [
                                    ...prev,
                                    {
                                        text: data.completions.join("\t"),
                                        type: "output",
                                    },
                                ]);
                            }
                        }
                    })
                    .catch((err) => console.error("Autocomplete failed:", err));
            } else {
                // Command completion
                const matches = ALL_COMMANDS.filter((cmd) =>
                    cmd.startsWith(input),
                );
                if (matches.length === 1) {
                    setInput(matches[0] + " ");
                } else if (matches.length > 1) {
                    setHistory((prev) => [
                        ...prev,
                        {
                            text: input,
                            type: "cmd",
                            cwd: cwd,
                            username: username,
                        },
                    ]);
                    setHistory((prev) => [
                        ...prev,
                        { text: matches.join("\t"), type: "output" },
                    ]);
                }
            }
        }
    };

    const handleSubmitCommand = async (commandToRun: string) => {
        if (!commandToRun.trim()) return;
        if (!sessionId) {
            setHistory((prev) => [
                ...prev,
                { text: "Error: No active session.", type: "error" },
            ]);
            return;
        }
        const command = commandToRun.trim();
        if (
            commandHistory.length === 0 ||
            commandHistory[commandHistory.length - 1] !== command
        ) {
            setCommandHistory((prev) => [...prev, command]);
        }
        setHistoryIndex(-1);
        setInput("");
        setIsLoading(true);
        setHistory((prev) => [
            ...prev,
            { text: command, type: "cmd", cwd: cwd, username: username },
        ]);
        await runCommand(command);
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim()) return;
        await handleSubmitCommand(input.trim());
    };

    const runCommand = async (command: string) => {
        if (!sessionId) return;

        // --- START COMMAND HANDLING ---

        // --- Client-Side Commands ---
        if (command === "about") {
            const logo = [
                "  RRRRRRRRR   ",
                "  RR      RR  ",
                "  RR      RR  ",
                "  RRRRRRRRR   ",
                "  RR    RR    ",
                "  RR     RR   ",
                "  RR      RR  ",
            ];
            const info = [
                `USER: ${username}`,
                "OS: RootResume OS (Alpine)",
                "HOST: Portfolio-Runner-v1",
                "UPTIME: 1 hour max",
                "PACKAGES: GCC, Rust, Python, SQLite",
                "SHELL: Custom React-Bash",
                "CPU: 0.5 Virtual Cores",
                "MEMORY: 128MB",
                "ARCH: x86_64",
                "DE: TailwindCSS-v3",
                "WM: NextJS-AppRouter",
            ];
            setHistory((prev) => [...prev, { text: "", type: "output" }]);
            for (let i = 0; i < Math.max(logo.length, info.length); i++) {
                const l = (logo[i] || "").padEnd(18, " ");
                const r = info[i] || "";
                setHistory((prev) => [
                    ...prev,
                    {
                        text: `${l} ${r}`,
                        type: i < logo.length ? "logo" : "output",
                    },
                ]);
            }
            setHistory((prev) => [...prev, { text: "", type: "output" }]);
            setIsLoading(false);
            setTimeout(() => inputRef.current?.focus(), 10);
        } else if (command === "help") {
            const helpLines = [
                "Available Commands:",
                "  ls projects    - View my projects",
                "  skills         - Proficiency bar chart",
                "  fortune        - Random dev quote",
                "  cat about-me.md- My bio",
                "  visualize <id> - Run algo demo:",
                "    C:      bubble, selection, quick, pathfinder, dfs",
                "    Python: life, mandelbrot, montecarlo, maze",
                "  matrix         - 🌧️  Green raining symbols",
                "  challenge      - List coding challenges (then: start <n>)",
                "  command &      - Run a command in the background",
                "  -- System --",
                "  about          - View system architecture",
                "  top            - Real-time container resource usage",
                "  help           - Show this help message",
                "  ?              - Show keyboard shortcuts",
                "  clear          - Clear terminal  (or Ctrl+L)",
                "  [linux]        - Run real commands (ls, python, etc.)",
            ];
            helpLines.forEach((l) => pushToHistory(l));
            setIsLoading(false);
            setTimeout(() => inputRef.current?.focus(), 10);
        } else if (command === "clear") {
            setHistory([]);
            setIsLoading(false);
            setTimeout(() => inputRef.current?.focus(), 10);
        } else if (command === "fortune") {
            const q =
                FORTUNE_QUOTES[
                    Math.floor(Math.random() * FORTUNE_QUOTES.length)
                ];
            const W = 56;
            const bar = "+" + "-".repeat(W + 2) + "+";
            const wrap = (text: string, w: number): string[] => {
                const words = text.split(" ");
                const lines: string[] = [];
                let cur = "";
                for (const word of words) {
                    if ((cur + " " + word).trim().length > w) {
                        lines.push(cur.trim());
                        cur = word;
                    } else cur = (cur + " " + word).trim();
                }
                if (cur) lines.push(cur);
                return lines;
            };
            pushToHistory("");
            pushToHistory(bar);
            wrap(q.text, W).forEach((l) =>
                pushToHistory("| " + l.padEnd(W) + " |"),
            );
            pushToHistory("|" + " ".repeat(W + 2) + "|");
            pushToHistory("| " + ("— " + q.author).padEnd(W) + " |");
            pushToHistory(bar);
            pushToHistory("");
            setIsLoading(false);
            setTimeout(() => inputRef.current?.focus(), 10);
        } else if (command === "?") {
            const lines = [
                "Keyboard Shortcuts:",
                "  ↑ / ↓        Navigate command history",
                "  Tab          Autocomplete command or path",
                "  Enter        Submit command",
                "  Ctrl+C       Interrupt running stream",
                "  Ctrl+L       Clear terminal",
                "  ↑↑↓↓←→←→BA  ???",
            ];
            pushToHistory("");
            lines.forEach((l) => pushToHistory(l));
            pushToHistory("");
            setIsLoading(false);
            setTimeout(() => inputRef.current?.focus(), 10);
        } else if (command === "konami") {
            const lines = [
                "  ##  ##   ####   ##  ##   ####   ##   ##  ######",
                "  ## ##   ##  ##  ### ##  ##  ##  ### ###    ##  ",
                "  #####   ##  ##  ## ###  ######  ## # ##    ##  ",
                "  ## ##   ##  ##  ##  ##  ##  ##  ##   ##    ##  ",
                "  ##  ##   ####   ##  ##  ##  ##  ##   ##  ######",
            ];
            pushToHistory("");
            lines.forEach((l) => pushToHistory(l, "header"));
            pushToHistory("");
            pushToHistory(
                "  \u2191\u2191\u2193\u2193\u2190\u2192\u2190\u2192 B A  \u2014  Cheat code accepted. You found it.",
                "info",
            );
            pushToHistory("");
            setIsLoading(false);
            setTimeout(() => inputRef.current?.focus(), 10);
        } else if (command === "skills") {
            const BAR_WIDTH = 12;
            const CATEGORIES = [
                "Languages",
                "Frontend",
                "Backend",
                "DevOps",
                "Databases",
                "Spoken",
            ] as const;
            const SEP = "─".repeat(32);
            pushToHistory(SEP);
            pushToHistory("  SKILLS");
            pushToHistory(SEP);
            CATEGORIES.forEach((cat) => {
                pushToHistory("");
                pushToHistory(`  [${cat}]`);
                SKILLS.filter((s) => s.category === cat).forEach((s) => {
                    const filled = Math.round((s.level / 100) * BAR_WIDTH);
                    const bar =
                        "█".repeat(filled) + "░".repeat(BAR_WIDTH - filled);
                    const label = s.name.padEnd(12, " ");
                    pushToHistory(`  ${label} ${bar}  ${s.level}%`);
                });
            });
            pushToHistory("");
            pushToHistory(SEP);
            setIsLoading(false);
            setTimeout(() => inputRef.current?.focus(), 10);
        } else if (command === "matrix") {
            const COLS = 48;
            const ROWS = 18;
            const CHARS =
                "ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝABCDEFGHIJKL0123456789";
            const drops = Array.from({ length: COLS }, () =>
                Math.floor(Math.random() * ROWS),
            );
            const grid: string[][] = Array.from({ length: ROWS }, () =>
                Array(COLS).fill(" "),
            );
            let frameCount = 0;
            const maxFrames = 100;

            const renderFrame = () => {
                // advance drops
                drops.forEach((row, col) => {
                    const ch = CHARS[Math.floor(Math.random() * CHARS.length)];
                    if (row < ROWS) grid[row][col] = ch;
                    drops[col] =
                        (row + 1) % (ROWS + 1 + Math.floor(Math.random() * 6));
                    // fade tail — guard against out-of-bounds
                    if (row - 1 >= 0 && row - 1 < ROWS)
                        grid[row - 1][col] =
                            CHARS[Math.floor(Math.random() * CHARS.length)];
                    if (row - 3 >= 0 && row - 3 < ROWS)
                        grid[row - 3][col] = " ";
                });
                return grid.map((r) => r.join("")).join("\n");
            };

            pushToHistory("[matrix] Press Ctrl+C to exit");
            setHistory((prev) => [...prev, { text: "", type: "logo" }]);

            const interval = setInterval(() => {
                if (frameCount >= maxFrames || !streamRef.current) {
                    clearInterval(interval);
                    streamRef.current = null;
                    setHistory((prev) => [
                        ...prev,
                        { text: "[matrix] Simulation ended.", type: "output" },
                    ]);
                    setIsLoading(false);
                    setTimeout(() => inputRef.current?.focus(), 10);
                    return;
                }
                const frame = renderFrame();
                setHistory((prev) => {
                    const next = [...prev];
                    next[next.length - 1] = { text: frame, type: "logo" };
                    return next;
                });
                frameCount++;
            }, 80);

            // store a fake EventSource-shaped object so Ctrl+C can kill it
            streamRef.current = {
                close: () => clearInterval(interval),
            } as unknown as EventSource;
            setIsLoading(true);
        } else if (command === "ls projects") {
            pushToHistory(
                JSON.stringify(
                    PROJECTS.map((p) => ({
                        id: p.id,
                        name: p.name,
                        description: p.description,
                        stack: p.stack,
                        status: p.status,
                        github: p.github,
                    })),
                    null,
                    2,
                ),
            );
            setIsLoading(false);
        } else if (command === "cat about-me.md") {
            pushToHistory(ABOUT_ME);
            setIsLoading(false);
        } else if (command === "whoami") {
            pushToHistory(username);
            setIsLoading(false);
        } else if (command.startsWith("login ")) {
            const name = command.split(" ")[1];
            if (name) {
                setUsername(name);
                pushToHistory(`> Authenticated as: ${name}`);
            }
            setIsLoading(false);
        } else if (command === "challenge") {
            try {
                const res = await fetch(`${API_URL}/challenges`);
                const list = await res.json();
                pushToHistory("\nAvailable Challenges:");
                list.forEach((c: any) =>
                    pushToHistory(`${c.id}. ${c.name} - ${c.description}`),
                );
                pushToHistory(
                    "\nTo start a challenge, run: start <number>\nExample: start 1",
                    "info",
                );
            } catch (e) {
                pushToHistory("Error fetching challenges.", "error");
            }
            setIsLoading(false);
        } else if (command.startsWith("start ")) {
            const id = command.split(" ")[1];
            pushToHistory(
                "[Narrator] Creating challenge files in the container's virtual filesystem...",
                "info",
            );
            try {
                const res = await fetch(`${API_URL}/challenge/load`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ sessionId, challengeId: id }),
                });
                const data = await res.json();
                pushToHistory(`\n${data.message}`);
                pushToHistory("Files: " + data.files.join(", "));
            } catch (e) {
                pushToHistory("Error starting challenge.", "error");
            }
            setIsLoading(false);
        } else if (command.startsWith("edit ")) {
            const filename = command.split(" ")[1];
            if (!filename) {
                setIsLoading(false);
            } else {
                try {
                    const res = await fetch(`${API_URL}/exec`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            sessionId,
                            code: `cat ${filename}`,
                        }),
                    });
                    const data = await res.json();
                    if (data.output) {
                        setEditorFilename(filename);
                        setEditorContent(data.output);
                        setIsEditorOpen(true);
                    } else {
                        pushToHistory("File not found.", "error");
                    }
                } catch (e) {
                    pushToHistory("Error reading file.", "error");
                }
                setIsLoading(false);
            }
        } else if (command === "verify") {
            pushToHistory(
                "[Narrator] Running test suite against your code inside the container...",
                "info",
            );
            try {
                const res = await fetch(`${API_URL}/challenge/verify`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ sessionId }),
                });
                const data = await res.json();
                if (data.passed) {
                    pushToHistory("\n✅ SUCCESS! Logic fixed.");
                    confetti({
                        particleCount: 150,
                        spread: 70,
                        origin: { y: 0.6 },
                    });
                } else {
                    pushToHistory("\n❌ FAILED:", "error");
                    pushToHistory(data.output);
                }
            } catch (e) {
                pushToHistory("Error verifying.", "error");
            }
            setIsLoading(false);

            // --- Server-Side Commands ---
        } else {
            // --- Streaming Commands ---
            if (command === "visualize") {
                const vizList = ["quicksort", "pathfinder", "dfs", "life", "mandelbrot", "montecarlo", "maze"];
                pushToHistory("");
                pushToHistory("Usage:  visualize <id>");
                pushToHistory("");
                pushToHistory("Available visualizations:");
                vizList.forEach((v) => pushToHistory(`  visualize ${v}`));
                pushToHistory("");
                pushToHistory("Example: visualize mandelbrot", "info");
                pushToHistory("");
                setIsLoading(false);
                setTimeout(() => inputRef.current?.focus(), 10);
            } else if (command === "python" || command === "python3") {
                pushToHistory("Running: python3 /home/demo/demo.py", "info");
                try {
                    const response = await fetch(`${API_URL}/exec`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ sessionId, code: "python3 /home/demo/demo.py" }),
                    });
                    const data = await response.json();
                    pushToHistory(data.error || data.output || "");
                } catch {
                    pushToHistory("Network Error", "error");
                } finally {
                    setIsLoading(false);
                    setTimeout(() => inputRef.current?.focus(), 10);
                }
            } else if (command.startsWith("visualize ")) {
                const vizId = command.split(" ")[1];
                if (streamRef.current) streamRef.current.close();

                const pythonViz = ["life", "mandelbrot", "montecarlo", "maze"];
                const isPython = pythonViz.includes(vizId);

                if (isPython) {
                    pushToHistory(
                        `[Narrator] Writing Python script to container filesystem...`,
                        "info",
                    );
                }

                const desc = VIZ_DESCRIPTIONS[vizId];
                if (desc) {
                    pushToHistory("");
                    desc.forEach((line) => pushToHistory(line, "viz"));
                    pushToHistory("");
                }
                pushToHistory(`Starting ${vizId} visualization...`);
                const evtSource = new EventSource(
                    `${API_URL}/stream?sessionId=${sessionId}&vizId=${vizId}`,
                );
                streamRef.current = evtSource;
                setHistory((prev) => [...prev, { text: "", type: "logo" }]);
                evtSource.onmessage = (event) => {
                    const text = atob(event.data);
                    setHistory((prev) => {
                        const newHistory = [...prev];
                        newHistory[newHistory.length - 1] = {
                            text,
                            type: "logo",
                        };
                        return newHistory;
                    });
                };
                evtSource.addEventListener("close", () => {
                    evtSource.close();
                    streamRef.current = null;
                    setIsLoading(false);
                    pushToHistory("Finished.");
                });
                evtSource.onerror = () => {
                    evtSource.close();
                    streamRef.current = null;
                    setIsLoading(false);
                    pushToHistory("Stream failed.", "error");
                };
            } else if (command === "top") {
                if (streamRef.current) streamRef.current.close();
                pushToHistory(
                    "Starting 'top' command. Press Ctrl+C to stop.",
                    "header",
                );
                pushToHistory(
                    "Tip: run a heavy process in another tab (e.g. visualize quicksort &) to see CPU spike.",
                    "info",
                );
                pushToHistory("CPU %\tMEM USAGE\tNET I/O\tBLOCK I/O", "info");
                setHistory((prev) => [
                    ...prev,
                    { text: "Gathering data...", type: "output" },
                ]);
                const evtSource = new EventSource(
                    `${API_URL}/stats?sessionId=${sessionId}`,
                );
                streamRef.current = evtSource;
                evtSource.onmessage = (event) => {
                    const text = atob(event.data);
                    setHistory((prev) => {
                        const newHistory = [...prev];
                        newHistory[newHistory.length - 1] = {
                            text: text,
                            type: "output",
                        };
                        return newHistory;
                    });
                };
                evtSource.onerror = () => {
                    evtSource.close();
                    streamRef.current = null;
                    setIsLoading(false);
                    pushToHistory(
                        "'top' command stream closed or failed.",
                        "error",
                    );
                    setTimeout(() => inputRef.current?.focus(), 10);
                };
                evtSource.addEventListener("close", () => {
                    evtSource.close();
                    streamRef.current = null;
                    setIsLoading(false);
                    pushToHistory("Top command finished.", "output");
                    setTimeout(() => inputRef.current?.focus(), 10);
                });

                // --- Background Job ---
            } else if (command.endsWith(" &")) {
                const bgCommand = command.slice(0, -2).trim();
                pushToHistory(`[+] Starting background process: ${bgCommand}`);
                fetch(`${API_URL}/exec`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        sessionId,
                        code: bgCommand,
                        background: true,
                    }),
                }).catch((err) =>
                    console.error("Background command failed to send:", err),
                );
                setIsLoading(false);
                setTimeout(() => inputRef.current?.focus(), 10);

                // --- Standard Exec ---
            } else {
                console.log(">>> EXECUTING STANDARD COMMAND:", command);
                try {
                    const response = await fetch(`${API_URL}/exec`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ sessionId, code: command }),
                    });
                    const data = await response.json();
                    // Session expired (e.g. server restarted) — clear stale storage
                    // and reload so a fresh session is created automatically.
                    if (response.status === 404 && data.error?.includes?.("expired")) {
                        sessionStorage.removeItem("rootresume_sid");
                        sessionStorage.removeItem("rootresume_history");
                        pushToHistory(
                            "Session expired. Starting a new session...",
                            "error",
                        );
                        setTimeout(() => window.location.reload(), 1500);
                        return;
                    }
                    pushToHistory(data.error || data.output || "");
                    if (data.cwd) {
                        setCwd(data.cwd.replace("/home/guest", "~"));
                    }
                } catch (error) {
                    pushToHistory("Network Error", "error");
                } finally {
                    setIsLoading(false);
                    setTimeout(() => inputRef.current?.focus(), 10);
                }
            }
        }
    };

    const pushToHistory = (
        text: string,
        type: HistoryItem["type"] = "output",
    ) => {
        setHistory((prev) => [...prev, { text, type }]);
    };

    return (
        <>
            <CodeEditor
                isOpen={isEditorOpen}
                filename={editorFilename}
                initialContent={editorContent}
                onSave={handleEditorSave}
                onClose={handleEditorClose}
            />
            <div
                className="relative flex h-full w-full min-w-0 flex-col overflow-hidden rounded-lg border border-zinc-800 bg-black shadow-2xl font-mono text-sm"
                onClick={handleTerminalClick}>
                <div
                    className={`flex items-center gap-2 border-b border-zinc-800 px-4 py-2 ${crtMode ? "bg-zinc-950" : "bg-gray-800"}`}>
                    <div className="flex-1" />
                    <div
                        className={`text-sm font-bold ${crtMode ? "text-green-400" : "text-zinc-400"}`}>
                        {username}@RootResume: {cwd}
                    </div>
                    <div className="flex-1 flex justify-end">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setCrtMode((p) => !p);
                            }}
                            title="Toggle CRT mode"
                            className={`p-1.5 rounded transition-colors ${crtMode ? "text-green-400 bg-green-900/30 hover:bg-green-900/50" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-700"}`}>
                            <Tv2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                {crtMode && (
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 z-10 rounded-lg overflow-hidden"
                        style={{
                            background:
                                "repeating-linear-gradient(to bottom, transparent 0px, transparent 1px, rgba(0,0,0,0.18) 1px, rgba(0,0,0,0.18) 2px)",
                        }}
                    />
                )}
                <div
                    className="flex-1 overflow-y-auto overflow-x-hidden p-4 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent"
                    style={
                        crtMode
                            ? {
                                  textShadow:
                                      "0 0 5px rgba(0,255,80,0.6), 0 0 2px rgba(0,255,80,0.9)",
                              }
                            : undefined
                    }>
                    {isInitializing && (
                        <div className="animate-pulse text-green-500">
                            Booting RootResume OS...
                        </div>
                    )}
                    {history.map((item, i) => (
                        <div
                            key={i}
                            className="whitespace-pre-wrap break-words leading-relaxed mb-1">
                            {item.type === "cmd" ? (
                                <div
                                    className={`font-bold ${crtMode ? "text-green-300" : "text-green-400"}`}>
                                    <span className="shrink-0">
                                        {item.username || username}@RootResume:
                                        {item.cwd || "~"}${" "}
                                    </span>
                                    <span>{item.text}</span>
                                </div>
                            ) : (
                                <div
                                    className={
                                        crtMode
                                            ? item.type === "error"
                                                ? "text-red-400"
                                                : item.type === "header"
                                                  ? "text-green-300 font-bold"
                                                  : "text-green-400"
                                            : item.type === "error"
                                              ? "text-red-400"
                                              : item.type === "header"
                                                ? "text-blue-400 font-bold"
                                                : item.type === "info"
                                                  ? "text-yellow-400"
                                                  : item.type === "logo"
                                                    ? "text-emerald-500"
                                                    : item.type === "viz"
                                                      ? "text-cyan-400 italic"
                                                      : "text-zinc-300"
                                    }>
                                    {item.text}
                                </div>
                            )}
                        </div>
                    ))}
                    {!isInitializing && !isLoading && (
                        <form
                            onSubmit={handleSubmit}
                            className="flex items-center">
                            <span
                                className={`mr-2 shrink-0 ${crtMode ? "text-green-400" : "text-green-500"}`}>
                                {username}@RootResume:{cwd}$
                            </span>
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={isLoading}
                                autoFocus
                                className={`w-full flex-1 border-none bg-transparent p-0 outline-none focus:ring-0 placeholder-zinc-600 ${crtMode ? "text-green-400" : "text-zinc-100"}`}
                                autoComplete="off"
                                spellCheck="false"
                            />
                        </form>
                    )}
                    <div ref={terminalEndRef} className="h-4" />
                </div>
            </div>
        </>
    );
}

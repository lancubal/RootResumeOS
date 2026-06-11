const { exec, spawn } = require("child_process");
const { v4: uuidv4 } = require("uuid");

class SessionManager {
    constructor() {
        // Map stores: sessionId -> { containerId, name, cwd, lastActivity, createdAt }
        this.sessions = new Map();

        // Configuration
        this.INACTIVITY_LIMIT_MS = 10 * 60 * 1000; // 10 Min (Inactivity)
        this.MAX_LIFETIME_MS = 60 * 60 * 1000; // 1 Hour (Absolute)
        this.MAX_CONCURRENT_SESSIONS = 10; // Concurrency limit
        this.GC_INTERVAL_MS = 60 * 1000; // 1 Minute check

        // Start the Janitor
        this.gcInterval = setInterval(
            () => this.runGarbageCollector(),
            this.GC_INTERVAL_MS,
        );
        this.gcInterval.unref(); // Allows the process to exit even if the interval is active
        console.log(
            `[SessionManager] GC started. Limits: ${this.MAX_CONCURRENT_SESSIONS} containers, 1h max life.`,
        );
    }

    /**
     * Creates a new Docker container.
     * Enforces concurrency limits by evicting the oldest session.
     */
    async startSession() {
        // 1. Eviction Logic: If we are at capacity, kill the oldest session (LRU based on lastActivity)
        if (this.sessions.size >= this.MAX_CONCURRENT_SESSIONS) {
            console.log(
                "[SessionManager] Capacity reached. Evicting oldest session...",
            );
            let oldestSessionId = null;
            let oldestTime = Infinity;

            this.sessions.forEach((data, id) => {
                if (data.lastActivity < oldestTime) {
                    oldestTime = data.lastActivity;
                    oldestSessionId = id;
                }
            });

            if (oldestSessionId) {
                this.terminateSession(oldestSessionId);
            }
        }

        const sessionId = uuidv4();
        const containerName = `session_${sessionId}`;
        const flagContent =
            "4pyoIFlvdSBhcmUgYSB0cnVlIGV4cGxvcmVyISBMZXQncyBidWlsZCBzb21ldGhpbmcgYW1hemluZyB0b2dldGhlci4gQ29udGFjdCBtZTogYWd1c3RpbmxhbmN1YmEuc2lzdGVtYXNAZ21haWwuY29t";
        const hiddenPath = "/usr/local/lib/.secret_cache";
        const hiddenFile = "config.db";

        const startCommand = `docker run -d --rm --name ${containerName} --network none --memory 128m --cpus 0.5 portfolio-runner sh -c "mkdir -p ${hiddenPath} && echo '${flagContent}' > ${hiddenPath}/${hiddenFile} && sleep infinity"`;

        return new Promise((resolve, reject) => {
            exec(startCommand, (error, stdout, stderr) => {
                if (error) {
                    console.error(`[${sessionId}] Failed to start:`, stderr);
                    return reject(error);
                }

                const containerId = stdout.trim();
                const now = Date.now();

                // Create a developer-themed Linux home directory structure
                const setupDirsCommand = `docker exec ${containerName} sh -c "mkdir -p /home/guest && cd /home/guest && mkdir -p projects docs scripts .config .local .ssh && touch about-me.md"`;
                exec(setupDirsCommand);

                this.sessions.set(sessionId, {
                    containerId: containerId,
                    name: containerName,
                    cwd: "/home/guest",
                    lastActivity: now,
                    createdAt: now,
                });

                console.log(
                    `[${sessionId}] Started. Total active: ${this.sessions.size}`,
                );
                resolve(sessionId);
            });
        });
    }

    /**
     * Checks if a command is attempting to use sudo.
     * Returns true if the command starts with 'sudo', false otherwise.
     */
    isSudoCommand(code) {
        const trimmedCode = code.trim();
        return trimmedCode.startsWith("sudo ");
    }

    /**
     * Executes a command inside the user's container.
     */
    async executeCommand(sessionId, code) {
        const session = this.sessions.get(sessionId);
        if (!session) throw new Error("Session expired or invalid.");

        session.lastActivity = Date.now();

        // Check for sudo command and block it
        if (this.isSudoCommand(code)) {
            return {
                output: "",
                error: "Permiso denegado. Este incidente será reportado.",
            };
        }

        if (code.trim().startsWith("cd ")) {
            const targetDir = code.trim().substring(3).trim();
            const checkCmd = `docker exec ${session.name} sh -c "cd ${session.cwd} && cd ${targetDir} && pwd"`;
            return new Promise((resolve) => {
                exec(checkCmd, (error, stdout, stderr) => {
                    if (error) {
                        resolve({
                            output: "",
                            error: `cd: ${targetDir}: No such file or directory`,
                        });
                    } else {
                        const newCwd = stdout.trim();
                        session.cwd = newCwd;
                        resolve({ output: "", error: "", cwd: newCwd });
                    }
                });
            });
        }

        const safeCode = code.replace(/"/g, '\\"');
        const execCommand = `docker exec ${session.name} sh -c "cd ${session.cwd} && ${safeCode}"`;

        return new Promise((resolve, reject) => {
            exec(execCommand, { timeout: 5000 }, (error, stdout, stderr) => {
                if (error) {
                    // Timeout or other exec error
                    if (error.killed) {
                        resolve({
                            output: "",
                            error: "Timeout: 5s limit reached.",
                        });
                    } else {
                        resolve({
                            output: "",
                            error: stderr || error.message,
                        });
                    }
                } else {
                    resolve({ output: stdout, error: stderr || "" });
                }
            });
        });
    }

    /**
     * Provides autocomplete suggestions for a partial command.
     */
    async getCompletions(sessionId, partial) {
        const session = this.sessions.get(sessionId);
        if (!session) throw new Error("Session expired or invalid.");

        const commands = [
            "about",
            "ls",
            "pwd",
            "cd",
            "cat",
            "echo",
            "whoami",
            "help",
            "clear",
            "skills",
            "fortune",
            "matrix",
            "konami",
            "challenge",
            "visualize",
            "python3",
            "gcc",
            "top",
            "?",
        ];

        return commands.filter((cmd) =>
            cmd.toLowerCase().startsWith(partial.toLowerCase()),
        );
    }

    /**
     * Executes a command in the background (without waiting for completion).
     */
    executeInBackground(sessionId, code) {
        const session = this.sessions.get(sessionId);
        if (!session) {
            console.error(`[${sessionId}] Session not found for background exec`);
            return;
        }

        session.lastActivity = Date.now();

        const safeCode = code.replace(/"/g, '\\"');
        const execCommand = `docker exec ${session.name} sh -c "cd ${session.cwd} && ${safeCode}"`;

        exec(execCommand, (error, stdout, stderr) => {
            if (error && !error.killed) {
                console.error(`[${sessionId}] Background error:`, stderr);
            }
        });
    }

    /**
     * Spawns a process for streaming (used for visualizations and real-time output).
     */
    spawnCommand(sessionId, executable) {
        const session = this.sessions.get(sessionId);
        if (!session) {
            throw new Error("Session expired or invalid.");
        }

        session.lastActivity = Date.now();

        const child = spawn("docker", [
            "exec",
            session.name,
            "sh",
            "-c",
            `cd ${session.cwd} && ${executable}`,
        ]);

        return child;
    }

    /**
     * Gracefully terminates a session and its container.
     */
    terminateSession(sessionId) {
        const session = this.sessions.get(sessionId);
        if (!session) {
            console.warn(`[${sessionId}] Already terminated or not found.`);
            return;
        }

        const stopCommand = `docker stop ${session.name}`;
        exec(stopCommand, (error) => {
            if (error) {
                console.error(
                    `[${sessionId}] Error stopping container:`,
                    error.message,
                );
            } else {
                console.log(`[${sessionId}] Container stopped.`);
            }
        });

        this.sessions.delete(sessionId);
        console.log(`[${sessionId}] Removed from sessions map.`);
    }

    /**
     * Garbage collector: checks for expired or inactive sessions.
     */
    runGarbageCollector() {
        const now = Date.now();
        const sessionsToDelete = [];

        this.sessions.forEach((session, sessionId) => {
            const inactivityAge = now - session.lastActivity;
            const absoluteAge = now - session.createdAt;

            if (
                inactivityAge > this.INACTIVITY_LIMIT_MS ||
                absoluteAge > this.MAX_LIFETIME_MS
            ) {
                sessionsToDelete.push(sessionId);
            }
        });

        sessionsToDelete.forEach((sessionId) => {
            console.log(
                `[GC] Evicting expired session: ${sessionId} (${this.sessions.size} total before)`,
            );
            this.terminateSession(sessionId);
        });

        if (sessionsToDelete.length > 0) {
            console.log(`[GC] Evicted ${sessionsToDelete.length} sessions.`);
        }
    }
}

module.exports = new SessionManager();
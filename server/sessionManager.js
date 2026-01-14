const { exec } = require('child_process');
const { v4: uuidv4 } = require('uuid');

class SessionManager {
    constructor() {
        // Map stores: sessionId -> { containerId: string, lastActivity: number }
        this.sessions = new Map();
        
        // Garbage Collector Configuration
        this.INACTIVITY_LIMIT_MS = 10 * 60 * 1000; // 10 Minutes
        this.GC_INTERVAL_MS = 60 * 1000; // 1 Minute

        // Start the Janitor
        setInterval(() => this.runGarbageCollector(), this.GC_INTERVAL_MS);
        console.log('[SessionManager] Garbage Collector started.');
    }

    /**
     * Creates a new Docker container for the user session.
     * Uses 'sleep infinity' to keep it alive.
     */
    async startSession() {
        const sessionId = uuidv4();
        const containerName = `session_${sessionId}`;

        // CTF Challenge: Injecting a hidden flag
        // The flag contains: "✨ You are a true explorer! Let's build something amazing together. Contact me: agustinlancuba.sistemas@gmail.com" encoded in Base64
        const flagContent = '4pyoIFlvdSBhcmUgYSB0cnVlIGV4cGxvcmVyISBMZXQncyBidWlsZCBzb21ldGhpbmcgYW1hemluZyB0b2dldGhlci4gQ29udGFjdCBtZTogYWd1c3RpbmxhbmN1YmEuc2lzdGVtYXNAZ21haWwuY29t';
        
        // Hide flag in a deep system directory disguised as a config file
        const hiddenPath = '/usr/local/lib/.secret_cache';
        const hiddenFile = 'config.db'; // Camouflage name
        
        const startCommand = `docker run -d --rm --name ${containerName} --network none --memory 128m --cpus 0.5 python:3.10-alpine sh -c "mkdir -p ${hiddenPath} && echo '${flagContent}' > ${hiddenPath}/${hiddenFile} && sleep infinity"`;

        console.log(`[${sessionId}] Starting container...`);

        return new Promise((resolve, reject) => {
            exec(startCommand, (error, stdout, stderr) => {
                if (error) {
                    console.error(`[${sessionId}] Failed to start:`, stderr);
                    return reject(error);
                }

                const containerId = stdout.trim();
                this.sessions.set(sessionId, {
                    containerId: containerId,
                    name: containerName,
                    cwd: '/home', // Default starting directory
                    lastActivity: Date.now()
                });

                // Create the home directory since it might not exist in alpine basic
                exec(`docker exec ${containerName} mkdir -p /home`);

                console.log(`[${sessionId}] Container started: ${containerId.substring(0, 12)}`);
                resolve(sessionId);
            });
        });
    }

    /**
     * Executes a command inside the user's container.
     */
    async executeCommand(sessionId, code) {
        const session = this.sessions.get(sessionId);
        
        if (!session) {
            throw new Error('Session expired or invalid.');
        }

        // Update heartbeat
        session.lastActivity = Date.now();

        // Handle 'cd' commands specifically to persist state
        // Regex to catch "cd /path", "cd ..", "cd"
        if (code.trim().startsWith('cd ')) {
            const targetDir = code.trim().substring(3).trim();
            // We run "cd <current> && cd <target> && pwd" to verify and get new path
            const checkCmd = `docker exec ${session.name} sh -c "cd ${session.cwd} && cd ${targetDir} && pwd"`;
            
            return new Promise((resolve) => {
                exec(checkCmd, (error, stdout, stderr) => {
                    if (error) {
                        // Directory doesn't exist or permission denied
                        resolve({ output: '', error: `cd: ${targetDir}: No such file or directory` });
                    } else {
                        // Update session CWD
                        session.cwd = stdout.trim();
                        resolve({ output: '', error: '' }); // cd usually produces no output on success
                    }
                });
            });
        }

        // Standard execution
        // We prepend "cd <cwd> &&" to maintain the user's location
        const safeCode = code.replace(/"/g, '\\"');
        const execCommand = `docker exec ${session.name} sh -c "cd ${session.cwd} && ${safeCode}"`;

        console.log(`[${sessionId}] Executing in ${session.cwd}: ${code}`);

        return new Promise((resolve, reject) => {
            // Timeout for the execution itself
            exec(execCommand, { timeout: 5000 }, (error, stdout, stderr) => {
                if (error) {
                    if (error.killed) {
                        return resolve({ output: stdout, error: 'Timeout: Execution exceeded 5 seconds.' });
                    }
                    return resolve({ output: stdout, error: stderr || error.message });
                }
                resolve({ output: stdout, error: stderr });
            });
        });
    }

    /**
     * The Janitor: Removes containers that haven't been used recently.
     */
    runGarbageCollector() {
        const now = Date.now();
        let collectedCount = 0;

        this.sessions.forEach((data, sessionId) => {
            if (now - data.lastActivity > this.INACTIVITY_LIMIT_MS) {
                this.terminateSession(sessionId);
                collectedCount++;
            }
        });

        if (collectedCount > 0) {
            console.log(`[GC] Cleaned up ${collectedCount} abandoned sessions.`);
        }
    }

    terminateSession(sessionId) {
        const session = this.sessions.get(sessionId);
        if (!session) return;

        console.log(`[${sessionId}] Terminating session (Container: ${session.name})...
`);
        
        // We just need to stop it. The --rm flag on creation handles the removal.
        exec(`docker stop ${session.name}`, (error) => {
            if (error) console.error(`[${sessionId}] Error stopping container:`, error.message);
        });

        this.sessions.delete(sessionId);
    }
}

module.exports = new SessionManager();

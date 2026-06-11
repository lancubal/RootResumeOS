console.log('Código gestionado por Copiloto IA');

const express = require("express");
const { exec } = require("child_process");
const cors = require("cors");
const sessionManager = require("./sessionManager");
const challengeManager = require("./challengeManager");
const visualizationManager = require("./visualizationManager");

const app = express();
const port = 3001;

// A more permissive CORS for the Docker environment.
app.use(cors({ origin: "*" }));
app.use(express.json());

// --- CORE ENDPOINTS ---

app.post("/start", async (req, res) => {
    try {
        const sessionId = await sessionManager.startSession();
        res.json({ sessionId });
    } catch (error) {
        res.status(500).json({
            error: "Failed to start session",
            details: error.message,
        });
    }
});

app.post("/exec", async (req, res) => {
    const { sessionId, code, background } = req.body;
    if (!sessionId || !code) {
        return res.status(400).json({ error: "Missing sessionId or code" });
    }
    try {
        if (background) {
            sessionManager.executeInBackground(sessionId, code);
            return res
                .status(202)
                .json({ message: "Process started in background" });
        }
        const result = await sessionManager.executeCommand(sessionId, code);
        res.json(result);
    } catch (error) {
        if (error.message === "Session expired or invalid.") {
            return res
                .status(404)
                .json({
                    error: "Session expired. Please refresh to start a new session.",
                });
        }
        res.status(500).json({
            error: "Execution failed",
            details: error.message,
        });
    }
});

app.post("/autocomplete", async (req, res) => {
    const { sessionId, partial } = req.body;
    if (!sessionId || partial === undefined) {
        return res.status(400).json({ error: "Missing sessionId or partial" });
    }
    try {
        const completions = await sessionManager.getCompletions(
            sessionId,
            partial,
        );
        res.json({ completions });
    } catch (error) {
        res.status(500).json({
            error: "Autocomplete failed",
            details: error.message,
        });
    }
});

// --- CHALLENGE ENDPOINTS ---

app.get("/challenges", (req, res) => {
    res.json(challengeManager.getChallengeList());
});

app.post("/challenge/load", async (req, res) => {
    const { sessionId, challengeId } = req.body;
    try {
        const challenge = await challengeManager.loadChallenge(
            sessionId,
            challengeId,
        );
        res.json({
            message: `Challenge '${challenge.name}' loaded. Files created.`,
            files: Object.keys(challenge.files),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/challenge/verify", async (req, res) => {
    const { sessionId } = req.body;
    try {
        const result = await challengeManager.verifyChallenge(sessionId);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- SESSION VALIDATION ---
// Used by the frontend to check if a stored session is still alive before restoring it.
app.get("/session/:id", (req, res) => {
    const { id } = req.params;
    if (sessionManager.sessions.has(id)) {
        res.json({ valid: true });
    } else {
        res.status(404).json({ valid: false });
    }
});

// --- STREAMING ENDPOINTS ---

app.get("/stream", async (req, res) => {
    const { sessionId, vizId } = req.query;
    if (!sessionId || !vizId) {
        return res.status(400).send("Missing sessionId or vizId");
    }
    try {
        const executable = await visualizationManager.prepareVisualization(
            sessionId,
            vizId,
        );
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        res.setHeader("X-Accel-Buffering", "no");
        const child = sessionManager.spawnCommand(sessionId, executable);
        child.stdout.on("data", (chunk) =>
            res.write(`data: ${chunk.toString("base64")}\n\n`),
        );
        child.stderr.on("data", (chunk) =>
            res.write(`data: ${chunk.toString("base64")}\n\n`),
        );
        child.on("close", () => {
            res.write("event: close\ndata: closed\n\n");
            res.end();
        });
        req.on("close", () => child.kill());
    } catch (error) {
        console.error("Stream error:", error);
        if (!res.headersSent) res.status(500).json({ error: error.message });
        else res.end();
    }
});

app.get("/stats", async (req, res) => {
    const { sessionId } = req.query;
    if (!sessionId) {
        return res.status(400).send("Missing sessionId");
    }
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    const session = sessionManager.sessions.get(sessionId);
    if (!session) {
        res.write("event: close\ndata: invalid-session\n\n");
        return res.end();
    }

    const statsCommand = `docker stats ${session.name} --no-stream --format "{{.CPUPerc}}|{{.MemUsage}}|{{.NetIO}}|{{.BlockIO}}"`;

    const interval = setInterval(() => {
        exec(statsCommand, (error, stdout) => {
            if (error) {
                clearInterval(interval);
                res.write("event: close\ndata: closed\n\n");
                return res.end();
            }
            res.write(`data: ${Buffer.from(stdout.trim()).toString("base64")}\n\n`);
        });
    }, 2000);

    req.on("close", () => clearInterval(interval));
});

// Only start listening when run directly (not when imported by tests)
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server listening at http://localhost:${port}`);
    });
}

module.exports = app;

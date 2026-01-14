const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const sessionManager = require('./sessionManager');

// --- CHALLENGE DATA DEFINITION ---
const CHALLENGES = {
    '1': {
        name: "Broken Calculator",
        description: "The 'add' function is subtracting instead of adding. Fix it to pass the tests!",
        files: {
            'calculator.py': "
class Calculator:
    def add(self, a, b):
        # BUG: This should be addition!
        return a - b

    def subtract(self, a, b):
        return a - b
",
            'test_calc.py': "
import unittest
from calculator import Calculator

class TestCalculator(unittest.TestCase):
    def setUp(self):
        self.calc = Calculator()

    def test_add(self):
        self.assertEqual(self.calc.add(5, 3), 8, "5 + 3 should be 8")
        self.assertEqual(self.calc.add(-1, 1), 0, "-1 + 1 should be 0")

if __name__ == '__main__':
    unittest.main()
"
        }
    }
};

class ChallengeManager {
    
    constructor() {
        this.activeChallenges = new Map(); // sessionId -> challengeId
    }

    getChallengeList() {
        return Object.entries(CHALLENGES).map(([id, data]) => ({
            id,
            name: data.name,
            description: data.description
        }));
    }

    async loadChallenge(sessionId, challengeId) {
        const challenge = CHALLENGES[challengeId];
        if (!challenge) throw new Error("Challenge not found.");

        const session = sessionManager.sessions.get(sessionId);
        if (!session) throw new Error("Session invalid.");

        console.log(`[${sessionId}] Loading Challenge ${challengeId}...`);

        // Write files to container
        for (const [filename, content] of Object.entries(challenge.files)) {
            // Escape special chars for echo
            // Ideally we would use 'docker cp', but echo is faster for small text
            // We use a safe persistent writing method via sessionManager
            await sessionManager.executeCommand(sessionId, `cat <<EOF > ${filename}
${content}
EOF`);
        }
        
        this.activeChallenges.set(sessionId, challengeId);
        return challenge;
    }

    async verifyChallenge(sessionId) {
        const challengeId = this.activeChallenges.get(sessionId);
        if (!challengeId) throw new Error("No active challenge.");

        // Hardcoded verification command for Python unittest
        // In the future this could be dynamic based on challenge config
        const cmd = "python3 -m unittest test_calc.py";
        
        const result = await sessionManager.executeCommand(sessionId, cmd);
        
        // Check if unittest passed (usually output contains "OK")
        // Note: executeCommand returns { output, error }
        // Standard python unittest writes to stderr for status dots, but exit code matters.
        // Since our executeCommand captures stdout/stderr, we parse the text.
        
        const combinedOutput = (result.output + "\n" + (result.error || "")).toLowerCase();
        
        const passed = combinedOutput.includes("ok") && !combinedOutput.includes("failed");
        
        return {
            passed,
            output: result.output || result.error
        };
    }
}

module.exports = new ChallengeManager();

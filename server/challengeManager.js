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
            'calculator.py': 
"\n" +
"class Calculator:\n" +
"    def add(self, a, b):\n" +
"        # BUG: This should be addition!\n" +
"        return a - b\n" +
"\n" +
"    def subtract(self, a, b):\n" +
"        return a - b\n",

            'test_calc.py': 
"\n" +
"import unittest\n" +
"from calculator import Calculator\n" +
"\n" +
"class TestCalculator(unittest.TestCase):\n" +
"    def setUp(self):        self.calc = Calculator()\n" +
"\n" +
"    def test_add(self):\n" +
"        self.assertEqual(self.calc.add(5, 3), 8, '5 + 3 should be 8')\n" +
"        self.assertEqual(self.calc.add(-1, 1), 0, '-1 + 1 should be 0')\n" +
"\n" +
"if __name__ == '__main__':\n" +
"    unittest.main()\n"
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

        // Write files to container using Base64 to avoid escaping hell
        for (const [filename, content] of Object.entries(challenge.files)) {
            const b64 = Buffer.from(content).toString('base64');
            // Command: echo "BASE64" | base64 -d > filename
            const cmd = `echo "${b64}" | base64 -d > ${filename}`;
            
            await sessionManager.executeCommand(sessionId, cmd);
        }
        
        this.activeChallenges.set(sessionId, challengeId);
        return challenge;
    }

    async verifyChallenge(sessionId) {
        const challengeId = this.activeChallenges.get(sessionId);
        if (!challengeId) throw new Error("No active challenge.");

        const cmd = "python3 -m unittest test_calc.py";
        const result = await sessionManager.executeCommand(sessionId, cmd);
        
        // Output from unittest usually goes to stderr (dots .F.E)
        const combinedOutput = (result.output + "\n" + (result.error || "")).toLowerCase();
        
        // Strict Check:
        // 1. Must contain "OK"
        // 2. Must NOT contain "FAILED"
        // 3. Must NOT contain "ERROR" (Syntax error, etc)
        const isSuccess = combinedOutput.includes("ok") && 
                          !combinedOutput.includes("failed") && 
                          !combinedOutput.includes("error");
        
        return {
            passed: isSuccess,
            output: result.error || result.output || "No output from tests."
        };
    }
}

module.exports = new ChallengeManager();
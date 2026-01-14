const challengeManager = require('../challengeManager');
const sessionManager = require('../sessionManager');

jest.mock('../sessionManager', () => ({
    sessions: new Map(),
    executeCommand: jest.fn()
}));

describe('ChallengeManager', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        challengeManager.activeChallenges.clear();
    });

    test('should list challenges', () => {
        const list = challengeManager.getChallengeList();
        expect(list.length).toBeGreaterThan(0);
        expect(list[0]).toHaveProperty('name');
    });

    test('should load a challenge and write files to container', async () => {
        sessionManager.sessions.set('test-uuid', { name: 'n1' });
        sessionManager.executeCommand.mockResolvedValue({ output: '', error: '' });

        const challenge = await challengeManager.loadChallenge('test-uuid', '1');

        expect(challenge.name).toBeDefined();
        expect(challengeManager.activeChallenges.get('test-uuid')).toBe('1');
        // Check that executeCommand was called for each file (at least 2 files in challenge 1)
        expect(sessionManager.executeCommand).toHaveBeenCalledTimes(Object.keys(challenge.files).length);
    });

    test('should verify a successful challenge', async () => {
        challengeManager.activeChallenges.set('test-uuid', '1');
        sessionManager.executeCommand.mockResolvedValue({ output: 'OK', error: '' });

        const result = await challengeManager.verifyChallenge('test-uuid');

        expect(result.passed).toBe(true);
    });

    test('should fail verification if tests fail', async () => {
        challengeManager.activeChallenges.set('test-uuid', '1');
        sessionManager.executeCommand.mockResolvedValue({ output: 'FAILED (failures=1)', error: '' });

        const result = await challengeManager.verifyChallenge('test-uuid');

        expect(result.passed).toBe(false);
    });

    test('should handle timeout in verification', async () => {
        challengeManager.activeChallenges.set('test-uuid', '1');
        sessionManager.executeCommand.mockResolvedValue({ output: '', error: 'Timeout: 5s limit reached.' });

        const result = await challengeManager.verifyChallenge('test-uuid');

        expect(result.passed).toBe(false);
        expect(result.output).toContain('TIMEOUT');
    });
});

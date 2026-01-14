const visualizationManager = require('../visualizationManager');
const sessionManager = require('../sessionManager');

jest.mock('../sessionManager', () => ({
    executeCommand: jest.fn()
}));

describe('VisualizationManager', () => {
    test('should prepare a visualization by writing and compiling code', async () => {
        sessionManager.executeCommand.mockResolvedValue({ output: 'Compiled successfully', error: '' });

        const executable = await visualizationManager.prepareVisualization('test-uuid', 'bubble');

        expect(executable).toBe('./bubble_app');
        // 1 for echo (write), 1 for gcc (compile)
        expect(sessionManager.executeCommand).toHaveBeenCalledTimes(2);
        expect(sessionManager.executeCommand).toHaveBeenCalledWith('test-uuid', expect.stringContaining('gcc bubble.c'));
    });

    test('should throw error if compilation fails', async () => {
        // First call (write) success, second call (compile) fail
        sessionManager.executeCommand
            .mockResolvedValueOnce({ output: '', error: '' })
            .mockResolvedValueOnce({ output: '', error: 'GCC Error' });

        await expect(visualizationManager.prepareVisualization('test-uuid', 'bubble'))
            .rejects.toThrow('Compilation failed: GCC Error');
    });
});

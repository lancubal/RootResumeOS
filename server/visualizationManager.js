const sessionManager = require('./sessionManager');

const VISUALIZATIONS = {
    'bubble': {
        name: "Bubble Sort (C)",
        file: 'bubble.c',
        code: [
            '#include <stdio.h>',
            '#include <stdlib.h>',
            '#include <unistd.h>',
            '#include <time.h>',
            '',
            '#define SIZE 10',
            '#define DELAY 100000 // 100ms',
            '',
                        'void print_array(int arr[], int size, int current_idx) {',
                        '    puts("Visualizing Bubble Sort (C)");',
                        '    puts("---------------------------");',
                        '    puts("");',
                        '    ',
                        '    for (int i = 0; i < size; i++) {',
                        '        for (int j = 0; j < arr[i]; j++) {',
                        '            printf("#");',
                        '        }',
                        '        printf(" (%d)", arr[i]);',
                        '        puts("");',
                        '    }',
                        '    puts("");',
                        '    fflush(stdout);',
                        '}',
             
            '', 
            'int main() {', 
            '    int arr[SIZE] = {9, 3, 5, 1, 8, 2, 7, 4, 10, 6};', 
            '    int i, j, temp;', 
            '    ', 
            '    srand(time(NULL));', 
            '', 
            '    for (i = 0; i < SIZE - 1; i++) {', 
            '        for (j = 0; j < SIZE - i - 1; j++) {', 
            '            print_array(arr, SIZE, j);', 
            '            usleep(DELAY);', 
            '            ', 
            '            if (arr[j] > arr[j + 1]) {', 
            '                temp = arr[j];', 
            '                arr[j] = arr[j + 1];', 
            '                arr[j + 1] = temp;', 
            '                ', 
            '                print_array(arr, SIZE, j);', 
            '                usleep(DELAY);', 
            '            }', 
            '        }', 
            '    }', 
            '    ', 
            '    print_array(arr, SIZE, -1);', 
            '    puts("Sorted!");', 
            '    return 0;', 
            '}'
        ].join('\n')
    }
};

class VisualizationManager {
    
    async prepareVisualization(sessionId, vizId) {
        const viz = VISUALIZATIONS[vizId];
        if (!viz) throw new Error("Visualization not found.");

        // 1. Write the C file to the container using Base64 to avoid escaping hell
        const b64 = Buffer.from(viz.code).toString('base64');
        await sessionManager.executeCommand(sessionId, `echo "${b64}" | base64 -d > ${viz.file}`);
        
        // 2. Compile it
        const compileCmd = `gcc ${viz.file} -o ${vizId}_app`;
        const result = await sessionManager.executeCommand(sessionId, compileCmd);
        
        if (result.error) {
            console.error("Compilation Error:", result.error);
            throw new Error(`Compilation failed: ${result.error}`);
        }
        
        return `./${vizId}_app`;
    }
}

module.exports = new VisualizationManager();

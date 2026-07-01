#!/usr/bin/env node

import { runAllTests } from './activityOutcomePipeline.test.js';

function main() {
    try {
        runAllTests();
        // Allow setTimeout assertions in test files to finish before exit
        setTimeout(() => {
            console.log('\nAll Activity Outcome Pipeline unit tests passed.');
            process.exit(0);
        }, 30);
    } catch (error) {
        console.error('\nActivity Outcome Pipeline unit tests failed:');
        console.error(error.message);
        process.exit(1);
    }
}

main();

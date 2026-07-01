#!/usr/bin/env node

import { runAllTests } from './activityCompletionSurface.test.js';

function main() {
    try {
        runAllTests();
        console.log('\nAll activity completion surface contract tests passed.');
        process.exit(0);
    } catch (error) {
        console.error('\nActivity completion surface contract tests failed:');
        console.error(error.message);
        process.exit(1);
    }
}

main();

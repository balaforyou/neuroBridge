#!/usr/bin/env node

import { runAllTests } from './activityFeedback.test.js';

function main() {
    try {
        runAllTests();
        console.log('\nAll activity feedback contract tests passed.');
        process.exit(0);
    } catch (error) {
        console.error('\nActivity feedback contract tests failed:');
        console.error(error.message);
        process.exit(1);
    }
}

main();

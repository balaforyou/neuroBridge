#!/usr/bin/env node

import { runAllTests } from './siraashFeedback.test.js';

function main() {
    try {
        runAllTests();
        console.log('\nAll SIRAASH feedback contract tests passed.');
        process.exit(0);
    } catch (error) {
        console.error('\nSIRAASH feedback contract tests failed:');
        console.error(error.message);
        process.exit(1);
    }
}

main();

#!/usr/bin/env node

import { runAllTests } from './matchingWorksheet.test.js';

function main() {
    try {
        runAllTests();
        console.log('\nAll matching worksheet tests passed.');
        process.exit(0);
    } catch (error) {
        console.error('\nMatching worksheet tests failed:');
        console.error(error.message);
        process.exit(1);
    }
}

main();

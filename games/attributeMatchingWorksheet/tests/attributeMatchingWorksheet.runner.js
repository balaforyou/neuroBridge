#!/usr/bin/env node

import { runAllTests } from './attributeMatchingWorksheet.test.js';

function main() {
    try {
        runAllTests();
        console.log('\nAll attribute matching worksheet tests passed.');
        process.exit(0);
    } catch (error) {
        console.error('\nAttribute matching worksheet tests failed:');
        console.error(error.message);
        process.exit(1);
    }
}

main();

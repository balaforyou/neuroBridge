#!/usr/bin/env node

import { runAllTests } from './patternMemory.test.js';

function main() {
    try {
        runAllTests();
        console.log('\nAll pattern memory tests passed.');
        process.exit(0);
    } catch (error) {
        console.error('\nPattern memory tests failed:');
        console.error(error.message);
        process.exit(1);
    }
}

main();

#!/usr/bin/env node

import { runAllTests } from './schulteMasteryProgression.test.js';

function main() {
    try {
        runAllTests();
        console.log('\nAll Schulte mastery progression tests passed.');
        process.exit(0);
    } catch (error) {
        console.error('\nSchulte mastery progression tests failed:');
        console.error(error.message);
        process.exit(1);
    }
}

main();

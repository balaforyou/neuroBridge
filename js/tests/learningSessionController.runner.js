#!/usr/bin/env node

import { runAllTests } from './learningSessionController.test.js';

function main() {
    try {
        runAllTests();
        console.log('\nAll Learning Session Controller unit tests passed.');
        process.exit(0);
    } catch (error) {
        console.error('\nLearning Session Controller unit tests failed:');
        console.error(error.message);
        process.exit(1);
    }
}

main();

#!/usr/bin/env node

import { runAllTests } from './kumonQuiz.test.js';

function main() {
    try {
        runAllTests();
        console.log('\nAll Kumon Quiz tests passed.');
        process.exit(0);
    } catch (error) {
        console.error('\nKumon Quiz tests failed:');
        console.error(error.message);
        process.exit(1);
    }
}

main();

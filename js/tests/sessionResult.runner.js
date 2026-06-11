#!/usr/bin/env node

import { runAllTests } from './sessionResult.test.js';

function main() {
    try {
        runAllTests();
        console.log('\nAll session result tests passed.');
        process.exit(0);
    } catch (error) {
        console.error('\nSession result tests failed:');
        console.error(error.message);
        process.exit(1);
    }
}

main();

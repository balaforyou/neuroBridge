#!/usr/bin/env node

import { runAllTests } from './directions.test.js';

function main() {
    try {
        runAllTests();
        process.exit(0);
    } catch (error) {
        console.error('\nDirections tests failed:');
        console.error(error.message);
        process.exit(1);
    }
}

main();

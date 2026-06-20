#!/usr/bin/env node

import { runAllTests } from './schulteCore.test.js';

function main() {
    try {
        runAllTests();
        console.log('\nAll Schulte core grid tests passed.');
        process.exit(0);
    } catch (error) {
        console.error('\nSchulte core grid tests failed:');
        console.error(error.message);
        process.exit(1);
    }
}

main();

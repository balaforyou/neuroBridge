#!/usr/bin/env node

import { runAllTests } from './gameRegistry.test.js';

function main() {
    try {
        runAllTests();
        console.log('\nAll game registry tests passed.');
        process.exit(0);
    } catch (error) {
        console.error('\nGame registry tests failed:');
        console.error(error.message);
        process.exit(1);
    }
}

main();

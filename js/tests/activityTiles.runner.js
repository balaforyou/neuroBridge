#!/usr/bin/env node

import { runAllTests } from './activityTiles.test.js';

function main() {
    try {
        runAllTests();
        console.log('\nAll activity tile tests passed.');
        process.exit(0);
    } catch (error) {
        console.error('\nActivity tile tests failed:');
        console.error(error.message);
        process.exit(1);
    }
}

main();

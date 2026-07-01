#!/usr/bin/env node

import { runAllTests } from './activityShell.test.js';

function main() {
    try {
        runAllTests();
        console.log('\nAll Shared Activity Shell Foundation unit tests passed.');
        process.exit(0);
    } catch (error) {
        console.error('\nShared Activity Shell Foundation unit tests failed:');
        console.error(error.message);
        process.exit(1);
    }
}

main();

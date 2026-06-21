#!/usr/bin/env node

import { runAllTests } from './router.test.js';

function main() {
    try {
        runAllTests();
        console.log('\nAll router tests passed.');
        process.exit(0);
    } catch (error) {
        console.error('\nRouter tests failed:');
        console.error(error.message);
        process.exit(1);
    }
}

main();

#!/usr/bin/env node

import { runAllTests } from './activitySuccessIndicator.test.js';

async function main() {
    try {
        await runAllTests();
        console.log('\nAll activity success indicator contract tests passed.');
        process.exit(0);
    } catch (error) {
        console.error('\nActivity success indicator contract tests failed:');
        console.error(error.message);
        process.exit(1);
    }
}

main();

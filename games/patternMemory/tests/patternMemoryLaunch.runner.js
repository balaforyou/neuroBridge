#!/usr/bin/env node

import { runAllTests } from './patternMemoryLaunch.test.js';

async function main() {
    try {
        await runAllTests();
        console.log('\nAll pattern memory launch tests passed.');
        process.exit(0);
    } catch (error) {
        console.error('\nPattern memory launch tests failed:');
        console.error(error.message);
        process.exit(1);
    }
}

main();

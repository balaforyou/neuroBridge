#!/usr/bin/env node

import { runAllTests } from './domainRegistry.test.js';

function main() {
    try {
        runAllTests();
        console.log('\nAll domain registry tests passed.');
        process.exit(0);
    } catch (error) {
        console.error('\nDomain registry tests failed:');
        console.error(error.message);
        process.exit(1);
    }
}

main();

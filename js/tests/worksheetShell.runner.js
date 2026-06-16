#!/usr/bin/env node

import { runAllTests } from './worksheetShell.test.js';

function main() {
    try {
        runAllTests();
        console.log('\nAll worksheet shell tests passed.');
        process.exit(0);
    } catch (error) {
        console.error('\nWorksheet shell tests failed:');
        console.error(error.message);
        process.exit(1);
    }
}

main();

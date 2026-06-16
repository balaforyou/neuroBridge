#!/usr/bin/env node

import { runAllTests } from './worksheetTemplate.test.js';

function main() {
    try {
        runAllTests();
        console.log('\nAll worksheet template tests passed.');
        process.exit(0);
    } catch (error) {
        console.error('\nWorksheet template tests failed:');
        console.error(error.message);
        process.exit(1);
    }
}

main();

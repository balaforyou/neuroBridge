#!/usr/bin/env node

import { runAllTests } from './stage1LinearNumbers.test.js';

function main() {
    try {
        runAllTests();
        console.log('\n✅ All Stage 1 tests passed.');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Stage 1 tests failed:');
        console.error(error.message);
        process.exit(1);
    }
}

main();
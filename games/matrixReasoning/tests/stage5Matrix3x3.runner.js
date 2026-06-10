#!/usr/bin/env node

import { runAllTests } from './stage5Matrix3x3.test.js';

function main() {
    try {
        runAllTests();
        console.log('\n✅ All Stage 5 tests passed.');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Stage 5 tests failed:');
        console.error(error.message);
        process.exit(1);
    }
}

main();
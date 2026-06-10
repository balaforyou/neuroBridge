#!/usr/bin/env node

import { runAllTests } from './stage3ShapePattern.test.js';

function main() {
    try {
        runAllTests();
        console.log('\n✅ All Stage 3 tests passed.');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Stage 3 tests failed:');
        console.error(error.message);
        process.exit(1);
    }
}

main();
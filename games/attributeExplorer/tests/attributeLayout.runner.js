#!/usr/bin/env node

import { runAllTests } from './attributeLayout.test.js';

function main() {
    try {
        runAllTests();
        console.log('\nAll Attribute Explorer layout contract tests passed.');
        process.exit(0);
    } catch (error) {
        console.error('\nAttribute Explorer layout contract tests failed:');
        console.error(error.message);
        process.exit(1);
    }
}

main();

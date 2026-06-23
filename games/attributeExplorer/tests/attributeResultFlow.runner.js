#!/usr/bin/env node

import { runAllTests } from './attributeResultFlow.test.js';

function main() {
    try {
        runAllTests();
        console.log('\nAll Attribute Explorer result flow tests passed.');
        process.exit(0);
    } catch (error) {
        console.error('\nAttribute Explorer result flow tests failed:');
        console.error(error.message);
        process.exit(1);
    }
}

main();

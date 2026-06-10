#!/usr/bin/env node

import { runAllTests } from './attributeSameDifferent.test.js';

function main() {
    try {
        runAllTests();
        console.log('\nAll Attribute Explorer Same / Different tests passed.');
        process.exit(0);
    } catch (error) {
        console.error('\nAttribute Explorer Same / Different tests failed:');
        console.error(error.message);
        process.exit(1);
    }
}

main();

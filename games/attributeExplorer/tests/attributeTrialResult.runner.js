#!/usr/bin/env node

import { runAllTests } from './attributeTrialResult.test.js';

function main() {
    try {
        runAllTests();
        console.log('\nAll Attribute Explorer trial result tests passed.');
        process.exit(0);
    } catch (error) {
        console.error('\nAttribute Explorer trial result tests failed:');
        console.error(error.message);
        process.exit(1);
    }
}

main();

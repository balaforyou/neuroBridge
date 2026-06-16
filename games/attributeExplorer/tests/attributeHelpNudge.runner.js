#!/usr/bin/env node

import { runAllTests } from './attributeHelpNudge.test.js';

function main() {
    try {
        runAllTests();
        console.log('\nAll Attribute Explorer help nudge tests passed.');
        process.exit(0);
    } catch (error) {
        console.error('\nAttribute Explorer help nudge tests failed:');
        console.error(error.message);
        process.exit(1);
    }
}

main();

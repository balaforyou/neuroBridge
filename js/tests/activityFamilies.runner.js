#!/usr/bin/env node

import { runAllTests } from './activityFamilies.test.js';

function main() {
    try {
        runAllTests();
        setTimeout(() => {
            console.log('\nAll Activity Family API unit tests passed.');
            process.exit(0);
        }, 120);
    } catch (error) {
        console.error('\nActivity Family API unit tests failed:');
        console.error(error.message);
        process.exit(1);
    }
}

main();

#!/usr/bin/env node

import { runAllTests } from './attributeMatchingWorksheetLaunch.test.js';

function main() {
    runAllTests()
        .then(() => {
            console.log('\nAll attribute matching worksheet launch tests passed.');
            process.exit(0);
        })
        .catch(error => {
            console.error('\nAttribute matching worksheet launch tests failed:');
            console.error(error.message);
            process.exit(1);
        });
}

main();

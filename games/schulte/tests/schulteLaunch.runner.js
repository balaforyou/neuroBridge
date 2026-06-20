#!/usr/bin/env node

import { runAllTests } from './schulteLaunch.test.js';

function main() {
    runAllTests()
        .then(() => {
            console.log('\nAll Schulte launch tests passed.');
            process.exit(0);
        })
        .catch(error => {
            console.error('\nSchulte launch tests failed:');
            console.error(error.message);
            process.exit(1);
        });
}

main();

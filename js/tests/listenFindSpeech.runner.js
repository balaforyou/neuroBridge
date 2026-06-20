#!/usr/bin/env node

import { runAllTests } from './listenFindSpeech.test.js';

function main() {
    try {
        runAllTests();
        console.log('\nAll Listen & Find speech tests passed.');
        process.exit(0);
    } catch (error) {
        console.error('\nListen & Find speech tests failed:');
        console.error(error.message);
        process.exit(1);
    }
}

main();

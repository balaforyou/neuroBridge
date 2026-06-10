#!/usr/bin/env node

import { runAllTests } from './stageInfrastructure.test.js';

function main() {
    try {
        runAllTests();
        console.log('\nAll stage infrastructure tests passed.');
        process.exit(0);
    } catch (error) {
        console.error('\nStage infrastructure tests failed:');
        console.error(error.message);
        process.exit(1);
    }
}

main();

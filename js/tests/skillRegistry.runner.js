#!/usr/bin/env node

import { runAllTests } from './skillRegistry.test.js';

function main() {
    try {
        runAllTests();
        console.log('\nAll skill registry tests passed.');
        process.exit(0);
    } catch (error) {
        console.error('\nSkill registry tests failed:');
        console.error(error.message);
        process.exit(1);
    }
}

main();

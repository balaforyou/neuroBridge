#!/usr/bin/env node

import { runAllTests } from './forcedStageOverride.test.js';

function main() {
    try {
        runAllTests();
        console.log('\n✅ All forced stage override tests passed.');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Forced stage override tests failed:');
        console.error(error.message);
        process.exit(1);
    }
}

main();
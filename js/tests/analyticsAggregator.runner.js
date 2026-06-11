#!/usr/bin/env node

import { runAllTests } from './analyticsAggregator.test.js';

function main() {
    try {
        runAllTests();
        console.log('\nAll analytics aggregator tests passed.');
        process.exit(0);
    } catch (error) {
        console.error('\nAnalytics aggregator tests failed:');
        console.error(error.message);
        process.exit(1);
    }
}

main();

#!/usr/bin/env node

import { runAllTests } from './cognitiveOntology.test.js';

function main() {
    try {
        runAllTests();
        console.log('\nAll cognitive ontology tests passed.');
        process.exit(0);
    } catch (error) {
        console.error('\nCognitive ontology tests failed:');
        console.error(error.message);
        process.exit(1);
    }
}

main();

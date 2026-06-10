#!/usr/bin/env node

/**
 * Command-line test runner for Stage 2 Non-Linear Numbers
 * 
 * Usage:
 *   node stage2NonLinearNumbers.runner.js
 *   node stage2NonLinearNumbers.runner.js --verbose
 *   node stage2NonLinearNumbers.runner.js --iterations 500
 */

import { generateStage2 } from '../stages/stage2NonLinearNumbers.js';

// Parse CLI arguments
const args = process.argv.slice(2);
const verbose = args.includes('--verbose') || args.includes('-v');
const iterArg = args.find(arg => arg.startsWith('--iterations'));
const customIterations = iterArg ? parseInt(iterArg.split('=')[1]) : null;

// Mock generateNumericOptions
function mockGenerateNumericOptions(correct) {
    const choices = new Set([correct]);
    let addValue = 1;

    while (choices.size < 4) {
        choices.add(correct + addValue);
        addValue += 1;
    }

    return Array.from(choices)
        .sort((a, b) => a - b)
        .map(val => ({ type: 'number', value: val }));
}

class TestRunner {
    constructor() {
        this.passed = 0;
        this.failed = 0;
        this.tests = [];
    }

    assert(condition, message) {
        if (condition) {
            this.passed++;
            if (verbose) {
                console.log(`  ✓ ${message}`);
            }
        } else {
            this.failed++;
            console.error(`  ✗ ${message}`);
            this.tests.push({ status: 'FAIL', message });
        }
    }

    printSummary() {
        const total = this.passed + this.failed;
        const percent = total > 0 ? ((this.passed / total) * 100).toFixed(1) : 0;
        
        console.log('\n' + '='.repeat(60));
        console.log(`Test Results: ${this.passed}/${total} passed (${percent}%)`);
        console.log('='.repeat(60));
        
        if (this.failed > 0) {
            console.log(`\n❌ ${this.failed} tests failed\n`);
            return 1;
        } else {
            console.log('\n✅ All tests passed!\n');
            return 0;
        }
    }
}

const runner = new TestRunner();

console.log('🧪 Stage 2 Non-Linear Numbers Unit Tests\n');
console.log('='.repeat(60));

// ===== Skip Pattern Tests =====
console.log('\n📋 Skip Pattern Tests');
console.log('-'.repeat(60));

{
    let skipPatternFound = false;
    let validSkipPatterns = 0;
    
    for (let i = 0; i < 100; i++) {
        const problem = generateStage2(mockGenerateNumericOptions);
        
        if (problem.rule?.pattern === 'skip') {
            skipPatternFound = true;
            const { cells, correctAnswer, rule } = problem;
            
            if (cells.length === 4 && cells[3] === '?') {
                const step = rule.step;
                const start = cells[0];
                
                const expectedCells = [start, start + step, start + (step * 2), '?'];
                
                let cellsMatch = true;
                for (let j = 0; j < 3; j++) {
                    if (cells[j] !== expectedCells[j]) {
                        cellsMatch = false;
                        break;
                    }
                }
                
                const expectedAnswer = start + (step * 3);
                
                if (cellsMatch && correctAnswer === expectedAnswer) {
                    validSkipPatterns++;
                }
            }
        }
    }
    
    runner.assert(skipPatternFound, 'Skip pattern generated');
    runner.assert(validSkipPatterns > 40, `Valid skip patterns (${validSkipPatterns}/100)`);
}

{
    const validSteps = new Set();
    
    for (let i = 0; i < 200; i++) {
        const problem = generateStage2(mockGenerateNumericOptions);
        if (problem.rule?.pattern === 'skip') {
            validSteps.add(problem.rule.step);
        }
    }
    
    runner.assert(validSteps.has(2), 'Step value 2 used');
    runner.assert(validSteps.has(5), 'Step value 5 used');
    runner.assert(validSteps.size === 2, 'Only steps 2 and 5 used');
}

{
    const startValues = new Set();
    
    for (let i = 0; i < 200; i++) {
        const problem = generateStage2(mockGenerateNumericOptions);
        if (problem.rule?.pattern === 'skip') {
            startValues.add(problem.cells[0]);
        }
    }
    
    for (const val of startValues) {
        runner.assert(val >= 1 && val <= 5, `Start value ${val} in range 1-5`);
    }
}

{
    let allCorrect = true;
    for (let i = 0; i < 100; i++) {
        const problem = generateStage2(mockGenerateNumericOptions);
        if (problem.rule?.pattern === 'skip') {
            const { cells, correctAnswer, rule } = problem;
            const start = cells[0];
            const step = rule.step;
            const expected = start + (step * 3);
            
            if (correctAnswer !== expected) {
                allCorrect = false;
                console.error(`  Skip pattern error: ${start}, ${start + step}, ${start + (step * 2)}, ? should be ${expected}, got ${correctAnswer}`);
                break;
            }
        }
    }
    runner.assert(allCorrect, 'Correct answers calculated properly');
}

// ===== Identity Pattern Tests =====
console.log('\n📋 Identity Pattern Tests');
console.log('-'.repeat(60));

{
    let identityPatternFound = false;
    let validIdentityPatterns = 0;
    
    for (let i = 0; i < 100; i++) {
        const problem = generateStage2(mockGenerateNumericOptions);
        
        if (problem.rule?.pattern === 'identity') {
            identityPatternFound = true;
            const { cells, correctAnswer } = problem;
            
            if (cells.length === 4 && cells[3] === '?' && cells[0] === cells[1] && cells[2] === correctAnswer) {
                validIdentityPatterns++;
            }
        }
    }
    
    runner.assert(identityPatternFound, 'Identity pattern generated');
    runner.assert(validIdentityPatterns > 40, `Valid identity patterns (${validIdentityPatterns}/100)`);
}

{
    const numberRanges = new Set();
    
    for (let i = 0; i < 200; i++) {
        const problem = generateStage2(mockGenerateNumericOptions);
        if (problem.rule?.pattern === 'identity') {
            numberRanges.add(problem.cells[0]);
            numberRanges.add(problem.cells[2]);
        }
    }
    
    for (const val of numberRanges) {
        runner.assert(val >= 1 && val <= 9, `Identity value ${val} in range 1-9`);
    }
}

{
    let allCorrect = true;
    for (let i = 0; i < 100; i++) {
        const problem = generateStage2(mockGenerateNumericOptions);
        if (problem.rule?.pattern === 'identity') {
            const { cells, correctAnswer } = problem;
            if (correctAnswer !== cells[2]) {
                allCorrect = false;
                console.error(`  Identity pattern error: correct answer should be ${cells[2]}, got ${correctAnswer}`);
                break;
            }
        }
    }
    runner.assert(allCorrect, 'Correct answers calculated properly');
}

// ===== Option Generation Tests =====
console.log('\n📋 Option Generation Tests');
console.log('-'.repeat(60));

{
    let allInclude = true;
    for (let i = 0; i < 100; i++) {
        const problem = generateStage2(mockGenerateNumericOptions);
        const optionValues = problem.options.map(opt => opt.value);
        if (!optionValues.includes(problem.correctAnswer)) {
            allInclude = false;
            break;
        }
    }
    runner.assert(allInclude, 'Correct answer included in options');
}

{
    let allCorrectCount = true;
    for (let i = 0; i < 100; i++) {
        const problem = generateStage2(mockGenerateNumericOptions);
        if (problem.options.length !== 4) {
            allCorrectCount = false;
            break;
        }
    }
    runner.assert(allCorrectCount, '4 options generated');
}

{
    let allFormatCorrect = true;
    for (let i = 0; i < 100; i++) {
        const problem = generateStage2(mockGenerateNumericOptions);
        for (const opt of problem.options) {
            if (opt.type !== 'number' || typeof opt.value !== 'number' || opt.value <= 0) {
                allFormatCorrect = false;
                break;
            }
        }
        if (!allFormatCorrect) break;
    }
    runner.assert(allFormatCorrect, 'Option format correct');
}

{
    let allSorted = true;
    for (let i = 0; i < 100; i++) {
        const problem = generateStage2(mockGenerateNumericOptions);
        const values = problem.options.map(opt => opt.value);
        for (let j = 1; j < values.length; j++) {
            if (values[j] < values[j - 1]) {
                allSorted = false;
                break;
            }
        }
        if (!allSorted) break;
    }
    runner.assert(allSorted, 'Options sorted in ascending order');
}

{
    let allUnique = true;
    for (let i = 0; i < 100; i++) {
        const problem = generateStage2(mockGenerateNumericOptions);
        const values = problem.options.map(opt => opt.value);
        const unique = new Set(values);
        if (values.length !== unique.size) {
            allUnique = false;
            break;
        }
    }
    runner.assert(allUnique, 'All options unique');
}

// ===== Integration Tests =====
console.log('\n📋 Integration Tests');
console.log('-'.repeat(60));

{
    let allValid = true;
    for (let i = 0; i < 50; i++) {
        const problem = generateStage2(mockGenerateNumericOptions);
        if (!problem.cells || !problem.correctAnswer || !problem.options || !problem.rule ||
            !Array.isArray(problem.cells) || !Array.isArray(problem.options) || typeof problem.rule !== 'object') {
            allValid = false;
            break;
        }
    }
    runner.assert(allValid, 'Problem structure valid');
}

{
    let skipCount = 0;
    let identityCount = 0;
    const iterations = customIterations || 1000;
    
    for (let i = 0; i < iterations; i++) {
        const problem = generateStage2(mockGenerateNumericOptions);
        if (problem.rule?.pattern === 'skip') skipCount++;
        if (problem.rule?.pattern === 'identity') identityCount++;
    }
    
    const skipRatio = skipCount / iterations;
    const identityRatio = identityCount / iterations;
    
    runner.assert(skipRatio > 0.4 && skipRatio < 0.6, 
        `Skip pattern ~50% (${(skipRatio * 100).toFixed(1)}%)`);
    runner.assert(identityRatio > 0.4 && identityRatio < 0.6, 
        `Identity pattern ~50% (${(identityRatio * 100).toFixed(1)}%)`);
    runner.assert(skipCount + identityCount === iterations, 
        'All patterns accounted for');
}

// Print summary and exit
const exitCode = runner.printSummary();
process.exit(exitCode);

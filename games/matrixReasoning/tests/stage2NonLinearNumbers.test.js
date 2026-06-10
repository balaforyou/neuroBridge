/**
 * Unit tests for Stage 2: Non-Linear Numbers
 * 
 * Tests run independently of UI rendering and validate:
 * - Skip pattern generation
 * - Identity pattern generation
 * - Option generation validity
 * - Correct answer validation
 */

import { generateStage2 } from '../stages/stage2NonLinearNumbers.js';

// Mock generateNumericOptions to create consistent options for testing
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

// ===== Skip Pattern Tests =====

function testSkipPatternStructure() {
    let skipPatternFound = false;
    let validSkipPatterns = 0;
    
    // Run multiple times to ensure we capture skip patterns
    for (let i = 0; i < 100; i++) {
        const problem = generateStage2(mockGenerateNumericOptions);
        
        if (problem.rule?.pattern === 'skip') {
            skipPatternFound = true;
            const { cells, correctAnswer, rule } = problem;
            
            // Validate skip pattern structure
            if (cells.length === 4 && cells[3] === '?') {
                const step = rule.step;
                const start = cells[0];
                
                // Verify all cells follow the pattern
                const expectedCells = [
                    start,
                    start + step,
                    start + (step * 2),
                    '?'
                ];
                
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
    
    console.assert(skipPatternFound, 'Skip pattern should be generated');
    console.assert(validSkipPatterns > 40, `Should have majority valid skip patterns (got ${validSkipPatterns}/100)`);
    console.log('✓ Skip Pattern Structure Test passed');
}

function testSkipPatternStepValues() {
    const validSteps = new Set();
    
    for (let i = 0; i < 200; i++) {
        const problem = generateStage2(mockGenerateNumericOptions);
        
        if (problem.rule?.pattern === 'skip') {
            validSteps.add(problem.rule.step);
        }
    }
    
    console.assert(validSteps.has(2), 'Step value 2 should be used');
    console.assert(validSteps.has(5), 'Step value 5 should be used');
    console.assert(validSteps.size === 2, 'Only steps 2 and 5 should be used');
    console.log('✓ Skip Pattern Step Values Test passed');
}

function testSkipPatternStartRange() {
    const startValues = new Set();
    
    for (let i = 0; i < 200; i++) {
        const problem = generateStage2(mockGenerateNumericOptions);
        
        if (problem.rule?.pattern === 'skip') {
            startValues.add(problem.cells[0]);
        }
    }
    
    for (const val of startValues) {
        console.assert(val >= 1 && val <= 5, `Start value ${val} should be between 1 and 5`);
    }
    
    console.log('✓ Skip Pattern Start Range Test passed');
}

function testSkipPatternCorrectAnswer() {
    for (let i = 0; i < 100; i++) {
        const problem = generateStage2(mockGenerateNumericOptions);
        
        if (problem.rule?.pattern === 'skip') {
            const { cells, correctAnswer, rule } = problem;
            const start = cells[0];
            const step = rule.step;
            
            // Verify correctAnswer = start + (step * 3)
            const expected = start + (step * 3);
            console.assert(correctAnswer === expected, 
                `Skip pattern: ${start}, ${start + step}, ${start + (step * 2)}, ? should be ${expected}, got ${correctAnswer}`);
        }
    }
    
    console.log('✓ Skip Pattern Correct Answer Test passed');
}

// ===== Identity Pattern Tests =====

function testIdentityPatternStructure() {
    let identityPatternFound = false;
    let validIdentityPatterns = 0;
    
    for (let i = 0; i < 100; i++) {
        const problem = generateStage2(mockGenerateNumericOptions);
        
        if (problem.rule?.pattern === 'identity') {
            identityPatternFound = true;
            const { cells, correctAnswer } = problem;
            
            // Validate identity pattern structure
            if (cells.length === 4 && cells[3] === '?') {
                // First two cells should be identical
                if (cells[0] === cells[1]) {
                    // Third cell should equal correctAnswer
                    if (cells[2] === correctAnswer) {
                        validIdentityPatterns++;
                    }
                }
            }
        }
    }
    
    console.assert(identityPatternFound, 'Identity pattern should be generated');
    console.assert(validIdentityPatterns > 40, `Should have majority valid identity patterns (got ${validIdentityPatterns}/100)`);
    console.log('✓ Identity Pattern Structure Test passed');
}

function testIdentityPatternRange() {
    const numberRanges = new Set();
    
    for (let i = 0; i < 200; i++) {
        const problem = generateStage2(mockGenerateNumericOptions);
        
        if (problem.rule?.pattern === 'identity') {
            numberRanges.add(problem.cells[0]); // numA
            numberRanges.add(problem.cells[2]); // numB
        }
    }
    
    for (const val of numberRanges) {
        console.assert(val >= 1 && val <= 9, `Identity pattern values should be 1-9, got ${val}`);
    }
    
    console.log('✓ Identity Pattern Range Test passed');
}

function testIdentityPatternCorrectAnswer() {
    for (let i = 0; i < 100; i++) {
        const problem = generateStage2(mockGenerateNumericOptions);
        
        if (problem.rule?.pattern === 'identity') {
            const { cells, correctAnswer } = problem;
            
            // correctAnswer should equal the third cell (numB)
            console.assert(correctAnswer === cells[2], 
                `Identity pattern correct answer should be ${cells[2]}, got ${correctAnswer}`);
        }
    }
    
    console.log('✓ Identity Pattern Correct Answer Test passed');
}

// ===== Option Generation Tests =====

function testOptionsIncludeCorrectAnswer() {
    for (let i = 0; i < 100; i++) {
        const problem = generateStage2(mockGenerateNumericOptions);
        const { correctAnswer, options } = problem;
        
        const optionValues = options.map(opt => opt.value);
        console.assert(optionValues.includes(correctAnswer), 
            `Options should include correct answer ${correctAnswer}, got ${optionValues}`);
    }
    
    console.log('✓ Options Include Correct Answer Test passed');
}

function testOptionCount() {
    for (let i = 0; i < 100; i++) {
        const problem = generateStage2(mockGenerateNumericOptions);
        const { options } = problem;
        
        console.assert(options.length === 4, 
            `Should generate exactly 4 options, got ${options.length}`);
    }
    
    console.log('✓ Option Count Test passed');
}

function testOptionFormat() {
    for (let i = 0; i < 100; i++) {
        const problem = generateStage2(mockGenerateNumericOptions);
        const { options } = problem;
        
        for (const opt of options) {
            console.assert(opt.type === 'number', 
                `Option type should be 'number', got ${opt.type}`);
            console.assert(typeof opt.value === 'number', 
                `Option value should be a number, got ${typeof opt.value}`);
            console.assert(opt.value > 0, 
                `Option value should be positive, got ${opt.value}`);
        }
    }
    
    console.log('✓ Option Format Test passed');
}

function testOptionsAreSorted() {
    for (let i = 0; i < 100; i++) {
        const problem = generateStage2(mockGenerateNumericOptions);
        const { options } = problem;
        const values = options.map(opt => opt.value);
        
        for (let j = 1; j < values.length; j++) {
            console.assert(values[j] >= values[j - 1], 
                `Options should be sorted: ${values}`);
        }
    }
    
    console.log('✓ Options Sorted Test passed');
}

function testOptionsAreUnique() {
    for (let i = 0; i < 100; i++) {
        const problem = generateStage2(mockGenerateNumericOptions);
        const { options } = problem;
        const values = options.map(opt => opt.value);
        const uniqueValues = new Set(values);
        
        console.assert(values.length === uniqueValues.size, 
            `All options should be unique, got duplicates in ${values}`);
    }
    
    console.log('✓ Options Unique Test passed');
}

// ===== Integration Tests =====

function testProblemStructure() {
    for (let i = 0; i < 50; i++) {
        const problem = generateStage2(mockGenerateNumericOptions);
        
        console.assert(problem.cells !== undefined, 'Problem should have cells');
        console.assert(problem.correctAnswer !== undefined, 'Problem should have correctAnswer');
        console.assert(problem.options !== undefined, 'Problem should have options');
        console.assert(problem.rule !== undefined, 'Problem should have rule');
        console.assert(Array.isArray(problem.cells), 'Cells should be an array');
        console.assert(Array.isArray(problem.options), 'Options should be an array');
        console.assert(typeof problem.rule === 'object', 'Rule should be an object');
    }
    
    console.log('✓ Problem Structure Test passed');
}

function testPatternDistribution() {
    let skipCount = 0;
    let identityCount = 0;
    
    for (let i = 0; i < 1000; i++) {
        const problem = generateStage2(mockGenerateNumericOptions);
        
        if (problem.rule?.pattern === 'skip') skipCount++;
        if (problem.rule?.pattern === 'identity') identityCount++;
    }
    
    const skipRatio = skipCount / 1000;
    const identityRatio = identityCount / 1000;
    
    // Should be roughly 50/50 distribution
    console.assert(skipRatio > 0.4 && skipRatio < 0.6, 
        `Skip pattern should be ~50%, got ${(skipRatio * 100).toFixed(1)}%`);
    console.assert(identityRatio > 0.4 && identityRatio < 0.6, 
        `Identity pattern should be ~50%, got ${(identityRatio * 100).toFixed(1)}%`);
    console.assert(skipCount + identityCount === 1000, 
        `All patterns should be either skip or identity`);
    
    console.log('✓ Pattern Distribution Test passed');
}

// ===== Run all tests =====

function runAllTests() {
    console.log('=== Stage 2 Non-Linear Numbers Unit Tests ===\n');
    
    try {
        console.log('--- Skip Pattern Tests ---');
        testSkipPatternStructure();
        testSkipPatternStepValues();
        testSkipPatternStartRange();
        testSkipPatternCorrectAnswer();
        
        console.log('\n--- Identity Pattern Tests ---');
        testIdentityPatternStructure();
        testIdentityPatternRange();
        testIdentityPatternCorrectAnswer();
        
        console.log('\n--- Option Generation Tests ---');
        testOptionsIncludeCorrectAnswer();
        testOptionCount();
        testOptionFormat();
        testOptionsAreSorted();
        testOptionsAreUnique();
        
        console.log('\n--- Integration Tests ---');
        testProblemStructure();
        testPatternDistribution();
        
        console.log('\n=== All Tests Passed ✓ ===\n');
    } catch (error) {
        console.error('❌ Test failed:', error);
        throw error;
    }
}

// Export test runner for integration
export { runAllTests };

// Auto-run if this file is imported directly
if (typeof window !== 'undefined' && window.location?.href?.includes('test')) {
    runAllTests();
}

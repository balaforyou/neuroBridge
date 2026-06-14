/**
 * Unit tests for the NeuroBridge cognitive ontology registry.
 */

import {
    COGNITIVE_ONTOLOGY,
    getAllCognitiveTargets,
    getCognitiveTargetsForSkill,
    getSkillsForCognitiveTarget,
    isValidCognitiveTarget,
    validateOntology
} from '../cognitiveOntology.js';
import { isValidSkill } from '../skillRegistry.js';

const EXPECTED_MAPPINGS = {
    'pattern-recognition': ['visual-inhibition', 'axis-scanning'],
    'rule-discovery': ['relational-mapping', 'working-memory-updating'],
    'visual-reasoning': ['mental-transformation'],
    'same-different': ['feature-discrimination'],
    'attribute-comparison': ['comparative-analysis'],
    'visual-attention': ['sustained-attention'],
    'visual-search': ['selective-attention', 'distractor-suppression'],
    sequencing: ['temporal-ordering'],
    'working-memory': ['short-term-retention'],
    'item-recall': ['retrieval'],
    'distractor-filtering': ['inhibition'],
    'direction-following': ['rule-maintenance'],
    'left-right': ['spatial-orientation'],
    'number-bonds': ['quantity-relations'],
    'arithmetic-fluency': ['rapid-retrieval']
};

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function arraysMatch(actual, expected) {
    return actual.length === expected.length && expected.every(item => actual.includes(item));
}

function testSkillMappingsExist() {
    for (const [skillId, expectedTargets] of Object.entries(EXPECTED_MAPPINGS)) {
        const targets = getCognitiveTargetsForSkill(skillId);

        assert(arraysMatch(targets, expectedTargets), `Skill ${skillId} should map to expected cognitive targets`);
    }

    assert(COGNITIVE_ONTOLOGY.length === Object.keys(EXPECTED_MAPPINGS).length, 'Ontology should contain all initial skill mappings');

    console.log('Skill mappings exist test passed');
}

function testReverseLookupWorks() {
    const visualSearchSkills = getSkillsForCognitiveTarget('selective-attention');
    const patternSkills = getSkillsForCognitiveTarget('axis-scanning');

    assert(visualSearchSkills.includes('visual-search'), 'selective-attention should map back to visual-search');
    assert(patternSkills.includes('pattern-recognition'), 'axis-scanning should map back to pattern-recognition');
    assert(getSkillsForCognitiveTarget('missing-target').length === 0, 'Unknown target should return no skills');

    console.log('Reverse lookup test passed');
}

function testInvalidLookupHandling() {
    assert(getCognitiveTargetsForSkill('missing-skill').length === 0, 'Unknown skill should return no targets');
    assert(isValidCognitiveTarget('feature-discrimination') === true, 'Known cognitive target should be valid');
    assert(isValidCognitiveTarget('') === false, 'Empty target should be invalid');
    assert(isValidCognitiveTarget(null) === false, 'Null target should be invalid');
    assert(isValidCognitiveTarget('missing-target') === false, 'Unknown target should be invalid');

    console.log('Invalid lookup handling test passed');
}

function testValidationCatchesBadSkills() {
    for (const mapping of COGNITIVE_ONTOLOGY) {
        assert(isValidSkill(mapping.skillId), `Ontology skill ${mapping.skillId} should exist in Skill Registry`);
    }

    assert(validateOntology() === true, 'validateOntology should pass for initial ontology');

    const badSkillOntology = [
        {
            skillId: 'missing-skill',
            cognitiveTargets: ['some-target']
        }
    ];

    assert(validateOntology(badSkillOntology) === false, 'validateOntology should fail unknown skills');

    console.log('Bad skill validation test passed');
}

function testTargetUniqueness() {
    const targets = getAllCognitiveTargets();

    assert(Array.isArray(targets), 'getAllCognitiveTargets should return an array');
    assert(targets.includes('visual-inhibition'), 'All targets should include visual-inhibition');
    assert(targets.includes('rapid-retrieval'), 'All targets should include rapid-retrieval');
    assert(new Set(targets).size === targets.length, 'getAllCognitiveTargets should return unique targets');

    const duplicateTargetOntology = [
        {
            skillId: 'pattern-recognition',
            cognitiveTargets: ['axis-scanning', 'axis-scanning']
        }
    ];

    assert(validateOntology(duplicateTargetOntology) === false, 'validateOntology should fail duplicate targets within a skill');

    console.log('Target uniqueness test passed');
}

function testDuplicateSkillValidation() {
    const duplicateSkillOntology = [
        COGNITIVE_ONTOLOGY[0],
        { ...COGNITIVE_ONTOLOGY[0], cognitiveTargets: ['another-target'] }
    ];

    assert(validateOntology(duplicateSkillOntology) === false, 'validateOntology should fail duplicate skill mappings');

    console.log('Duplicate skill validation test passed');
}

function runAllTests() {
    console.log('=== Cognitive Ontology Unit Tests ===');
    testSkillMappingsExist();
    testReverseLookupWorks();
    testInvalidLookupHandling();
    testValidationCatchesBadSkills();
    testTargetUniqueness();
    testDuplicateSkillValidation();
    console.log('=== All Cognitive Ontology Tests Passed ===');
}

export { runAllTests };

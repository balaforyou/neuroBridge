/**
 * Unit tests for the NeuroBridge skill registry.
 */

import {
    SKILLS,
    getAllSkills,
    getSkillById,
    getSkillsByDomain,
    isValidSkill,
    validateSkillRegistry
} from '../skillRegistry.js';
import { isValidDomain } from '../domainRegistry.js';

const INITIAL_SKILL_IDS = [
    'pattern-recognition',
    'rule-discovery',
    'visual-reasoning',
    'same-different',
    'attribute-comparison',
    'visual-attention',
    'visual-search',
    'sequencing',
    'working-memory',
    'item-recall',
    'visual-encoding',
    'spatial-memory',
    'pattern-reproduction',
    'distractor-filtering',
    'direction-following',
    'left-right',
    'number-bonds',
    'arithmetic-fluency'
];

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function testAllInitialSkillsExist() {
    for (const skillId of INITIAL_SKILL_IDS) {
        const skill = getSkillById(skillId);

        assert(skill, `Skill ${skillId} should exist`);
        assert(skill.skillId === skillId, `Skill ${skillId} should keep its id`);
        assert(typeof skill.name === 'string' && skill.name.length > 0, `Skill ${skillId} should have a name`);
        assert(typeof skill.description === 'string' && skill.description.length > 0, `Skill ${skillId} should have a description`);
    }

    assert(SKILLS.length === INITIAL_SKILL_IDS.length, 'Registry should contain exactly the initial skills');

    console.log('All initial skills exist test passed');
}

function testGetSkillByIdWorks() {
    const skill = getSkillById('same-different');

    assert(skill.skillId === 'same-different', 'getSkillById should return matching skill');
    assert(skill.name === 'Same / Different', 'getSkillById should return skill metadata');
    assert(getSkillById('unknown-skill') === null, 'getSkillById should return null for unknown skills');

    console.log('getSkillById test passed');
}

function testGetSkillsByDomainWorks() {
    const reasoningSkills = getSkillsByDomain('reasoning');
    const attentionSkills = getSkillsByDomain('attention');

    assert(reasoningSkills.some(skill => skill.skillId === 'pattern-recognition'), 'Reasoning should include pattern recognition');
    assert(reasoningSkills.some(skill => skill.skillId === 'rule-discovery'), 'Reasoning should include rule discovery');
    assert(attentionSkills.some(skill => skill.skillId === 'visual-attention'), 'Attention should include visual attention');
    assert(attentionSkills.some(skill => skill.skillId === 'distractor-filtering'), 'Attention should include distractor filtering');
    assert(getSkillsByDomain('unknown-domain').length === 0, 'Unknown domain should return an empty array');

    console.log('getSkillsByDomain test passed');
}

function testGetAllSkillsReturnsArray() {
    const skills = getAllSkills();

    assert(Array.isArray(skills), 'getAllSkills should return an array');
    assert(skills.length === INITIAL_SKILL_IDS.length, 'getAllSkills should return all skills');
    assert(skills.every(skill => INITIAL_SKILL_IDS.includes(skill.skillId)), 'getAllSkills should return initial skill ids');

    console.log('getAllSkills array test passed');
}

function testInvalidSkillReturnsFalse() {
    assert(isValidSkill('same-different') === true, 'isValidSkill should return true for valid skills');
    assert(isValidSkill('') === false, 'isValidSkill should return false for empty string');
    assert(isValidSkill(null) === false, 'isValidSkill should return false for null');
    assert(isValidSkill('unknown-skill') === false, 'isValidSkill should return false for unknown skills');

    console.log('Invalid skill handling test passed');
}

function testDomainMappingIsValid() {
    for (const skill of SKILLS) {
        assert(isValidDomain(skill.domain), `Skill ${skill.skillId} should map to a valid domain`);
    }

    assert(validateSkillRegistry() === true, 'validateSkillRegistry should pass for initial registry');

    const invalidDomainRegistry = [
        {
            skillId: 'invalid-domain-skill',
            name: 'Invalid Domain Skill',
            domain: 'missing-domain',
            description: 'Used only for validation testing.'
        }
    ];

    assert(validateSkillRegistry(invalidDomainRegistry) === false, 'validateSkillRegistry should fail invalid domains');

    console.log('Skill domain mapping test passed');
}

function testUniquenessValidation() {
    const ids = SKILLS.map(skill => skill.skillId);
    assert(new Set(ids).size === ids.length, 'Skill ids should be unique');

    const duplicateRegistry = [
        SKILLS[0],
        { ...SKILLS[0] }
    ];

    assert(validateSkillRegistry(duplicateRegistry) === false, 'validateSkillRegistry should fail duplicate ids');

    console.log('Skill id uniqueness test passed');
}

function runAllTests() {
    console.log('=== Skill Registry Unit Tests ===');
    testAllInitialSkillsExist();
    testGetSkillByIdWorks();
    testGetSkillsByDomainWorks();
    testGetAllSkillsReturnsArray();
    testInvalidSkillReturnsFalse();
    testDomainMappingIsValid();
    testUniquenessValidation();
    console.log('=== All Skill Registry Tests Passed ===');
}

export { runAllTests };

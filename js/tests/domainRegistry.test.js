/**
 * Unit tests for the NeuroBridge domain registry.
 */

import { DOMAINS, getAllDomains, getDomainById, isValidDomain } from '../domainRegistry.js';

const INITIAL_DOMAIN_IDS = [
    'attention',
    'memory',
    'sequencing',
    'visual-search',
    'reasoning',
    'concept-formation',
    'numeracy',
    'language',
    'daily-living'
];

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function testAllInitialDomainsExist() {
    for (const domainId of INITIAL_DOMAIN_IDS) {
        const domain = getDomainById(domainId);

        assert(domain, `Domain ${domainId} should exist`);
        assert(domain.id === domainId, `Domain ${domainId} should keep its id`);
        assert(typeof domain.name === 'string' && domain.name.length > 0, `Domain ${domainId} should have a name`);
        assert(typeof domain.description === 'string' && domain.description.length > 0, `Domain ${domainId} should have a description`);
    }

    assert(DOMAINS.length === INITIAL_DOMAIN_IDS.length, 'Registry should contain exactly the initial domains');

    console.log('All initial domains exist test passed');
}

function testGetDomainByIdWorks() {
    const domain = getDomainById('concept-formation');

    assert(domain.id === 'concept-formation', 'getDomainById should return matching domain');
    assert(domain.name === 'Concept Formation', 'getDomainById should return domain metadata');
    assert(getDomainById('unknown-domain') === null, 'getDomainById should return null for unknown domains');

    console.log('getDomainById test passed');
}

function testGetAllDomainsReturnsArray() {
    const domains = getAllDomains();

    assert(Array.isArray(domains), 'getAllDomains should return an array');
    assert(domains.length === INITIAL_DOMAIN_IDS.length, 'getAllDomains should return all domains');
    assert(domains.every(domain => INITIAL_DOMAIN_IDS.includes(domain.id)), 'getAllDomains should return initial domain ids');

    console.log('getAllDomains array test passed');
}

function testIsValidDomainTrueForValidDomains() {
    for (const domainId of INITIAL_DOMAIN_IDS) {
        assert(isValidDomain(domainId) === true, `isValidDomain should return true for ${domainId}`);
    }

    console.log('isValidDomain valid domains test passed');
}

function testIsValidDomainFalseForInvalidDomains() {
    assert(isValidDomain('') === false, 'isValidDomain should return false for empty string');
    assert(isValidDomain(null) === false, 'isValidDomain should return false for null');
    assert(isValidDomain('motor-planning') === false, 'isValidDomain should return false for unknown domains');

    console.log('isValidDomain invalid domains test passed');
}

function runAllTests() {
    console.log('=== Domain Registry Unit Tests ===');
    testAllInitialDomainsExist();
    testGetDomainByIdWorks();
    testGetAllDomainsReturnsArray();
    testIsValidDomainTrueForValidDomains();
    testIsValidDomainFalseForInvalidDomains();
    console.log('=== All Domain Registry Tests Passed ===');
}

export { runAllTests };

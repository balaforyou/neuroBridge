export const DOMAINS = [
    {
        id: 'attention',
        name: 'Attention',
        description: 'Sustained focus, selective attention, shifting attention, and inhibition.'
    },
    {
        id: 'memory',
        name: 'Memory',
        description: 'Working memory, recall, recognition, and memory for sequences or locations.'
    },
    {
        id: 'sequencing',
        name: 'Sequencing',
        description: 'Ordering events, steps, actions, stories, and temporal patterns.'
    },
    {
        id: 'visual-search',
        name: 'Visual Search',
        description: 'Scanning, locating targets, filtering distractors, and visual discrimination.'
    },
    {
        id: 'reasoning',
        name: 'Reasoning',
        description: 'Pattern reasoning, inference, problem solving, and rule discovery.'
    },
    {
        id: 'concept-formation',
        name: 'Concept Formation',
        description: 'Learning categories, attributes, same/different relations, and flexible grouping.'
    },
    {
        id: 'numeracy',
        name: 'Numeracy',
        description: 'Number sense, quantity comparison, counting, operations, and mathematical patterns.'
    },
    {
        id: 'language',
        name: 'Language',
        description: 'Vocabulary, comprehension, expressive language, and semantic relationships.'
    },
    {
        id: 'daily-living',
        name: 'Daily Living',
        description: 'Functional routines, self-care sequences, safety concepts, and everyday decision making.'
    }
];

export function getDomainById(domainId) {
    return DOMAINS.find(domain => domain.id === domainId) || null;
}

export function getAllDomains() {
    return DOMAINS.map(domain => ({ ...domain }));
}

export function isValidDomain(domainId) {
    return Boolean(getDomainById(domainId));
}

import { isValidSkill } from './skillRegistry.js';

export const COGNITIVE_ONTOLOGY = [
    {
        skillId: 'pattern-recognition',
        cognitiveTargets: [
            'visual-inhibition',
            'axis-scanning'
        ]
    },
    {
        skillId: 'rule-discovery',
        cognitiveTargets: [
            'relational-mapping',
            'working-memory-updating'
        ]
    },
    {
        skillId: 'visual-reasoning',
        cognitiveTargets: [
            'mental-transformation'
        ]
    },
    {
        skillId: 'same-different',
        cognitiveTargets: [
            'feature-discrimination'
        ]
    },
    {
        skillId: 'attribute-comparison',
        cognitiveTargets: [
            'comparative-analysis'
        ]
    },
    {
        skillId: 'visual-attention',
        cognitiveTargets: [
            'sustained-attention'
        ]
    },
    {
        skillId: 'visual-search',
        cognitiveTargets: [
            'selective-attention',
            'distractor-suppression'
        ]
    },
    {
        skillId: 'sequencing',
        cognitiveTargets: [
            'temporal-ordering'
        ]
    },
    {
        skillId: 'working-memory',
        cognitiveTargets: [
            'short-term-retention'
        ]
    },
    {
        skillId: 'item-recall',
        cognitiveTargets: [
            'retrieval'
        ]
    },
    {
        skillId: 'distractor-filtering',
        cognitiveTargets: [
            'inhibition'
        ]
    },
    {
        skillId: 'direction-following',
        cognitiveTargets: [
            'rule-maintenance'
        ]
    },
    {
        skillId: 'left-right',
        cognitiveTargets: [
            'spatial-orientation'
        ]
    },
    {
        skillId: 'number-bonds',
        cognitiveTargets: [
            'quantity-relations'
        ]
    },
    {
        skillId: 'arithmetic-fluency',
        cognitiveTargets: [
            'rapid-retrieval'
        ]
    }
];

export function getCognitiveTargetsForSkill(skillId) {
    const mapping = COGNITIVE_ONTOLOGY.find(item => item.skillId === skillId);
    return mapping ? [...mapping.cognitiveTargets] : [];
}

export function getSkillsForCognitiveTarget(targetId) {
    return COGNITIVE_ONTOLOGY
        .filter(item => item.cognitiveTargets.includes(targetId))
        .map(item => item.skillId);
}

export function getAllCognitiveTargets() {
    return Array.from(
        new Set(COGNITIVE_ONTOLOGY.flatMap(item => item.cognitiveTargets))
    );
}

export function isValidCognitiveTarget(targetId) {
    return getAllCognitiveTargets().includes(targetId);
}

export function validateOntology(ontology = COGNITIVE_ONTOLOGY) {
    const skillIds = new Set();

    for (const mapping of ontology) {
        if (!isValidSkill(mapping.skillId) || skillIds.has(mapping.skillId)) {
            return false;
        }

        skillIds.add(mapping.skillId);

        if (!Array.isArray(mapping.cognitiveTargets) || !mapping.cognitiveTargets.length) {
            return false;
        }

        const targets = new Set(mapping.cognitiveTargets);
        if (targets.size !== mapping.cognitiveTargets.length) {
            return false;
        }
    }

    return true;
}

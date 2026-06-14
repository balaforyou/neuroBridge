import { isValidDomain } from './domainRegistry.js';

export const SKILLS = [
    {
        skillId: 'pattern-recognition',
        name: 'Pattern Recognition',
        domain: 'reasoning',
        description: 'Identifying repeated, changing, or meaningful patterns across items.'
    },
    {
        skillId: 'rule-discovery',
        name: 'Rule Discovery',
        domain: 'reasoning',
        description: 'Inferring the rule that explains a sequence, matrix, or relationship.'
    },
    {
        skillId: 'visual-reasoning',
        name: 'Visual Reasoning',
        domain: 'reasoning',
        description: 'Solving problems using visual relationships, shapes, positions, or patterns.'
    },
    {
        skillId: 'same-different',
        name: 'Same / Different',
        domain: 'concept-formation',
        description: 'Comparing items to decide whether a target attribute matches or differs.'
    },
    {
        skillId: 'attribute-comparison',
        name: 'Attribute Comparison',
        domain: 'concept-formation',
        description: 'Comparing color, shape, size, or other attributes across objects.'
    },
    {
        skillId: 'visual-attention',
        name: 'Visual Attention',
        domain: 'attention',
        description: 'Focusing on relevant visual information while completing a task.'
    },
    {
        skillId: 'visual-search',
        name: 'Visual Search',
        domain: 'visual-search',
        description: 'Scanning a field to locate a target item or feature.'
    },
    {
        skillId: 'sequencing',
        name: 'Sequencing',
        domain: 'sequencing',
        description: 'Ordering items, steps, events, or actions in a meaningful sequence.'
    },
    {
        skillId: 'working-memory',
        name: 'Working Memory',
        domain: 'memory',
        description: 'Holding and using information briefly while completing a task.'
    },
    {
        skillId: 'item-recall',
        name: 'Item Recall',
        domain: 'memory',
        description: 'Remembering and retrieving previously shown items or details.'
    },
    {
        skillId: 'distractor-filtering',
        name: 'Distractor Filtering',
        domain: 'attention',
        description: 'Ignoring irrelevant information while selecting or comparing target information.'
    },
    {
        skillId: 'direction-following',
        name: 'Direction Following',
        domain: 'attention',
        description: 'Attending to and acting on task instructions accurately.'
    },
    {
        skillId: 'left-right',
        name: 'Left / Right',
        domain: 'attention',
        description: 'Recognizing and responding to left and right spatial directions.'
    },
    {
        skillId: 'number-bonds',
        name: 'Number Bonds',
        domain: 'numeracy',
        description: 'Understanding part-whole number relationships and combinations.'
    },
    {
        skillId: 'arithmetic-fluency',
        name: 'Arithmetic Fluency',
        domain: 'numeracy',
        description: 'Answering arithmetic facts and operations with increasing accuracy and speed.'
    }
];

export function getSkillById(skillId) {
    return SKILLS.find(skill => skill.skillId === skillId) || null;
}

export function getSkillsByDomain(domainId) {
    return SKILLS.filter(skill => skill.domain === domainId);
}

export function getAllSkills() {
    return SKILLS.map(skill => ({ ...skill }));
}

export function isValidSkill(skillId) {
    return Boolean(getSkillById(skillId));
}

export function validateSkillRegistry(registry = SKILLS) {
    const skillIds = new Set();

    for (const skill of registry) {
        if (skillIds.has(skill.skillId)) {
            return false;
        }

        skillIds.add(skill.skillId);

        if (!isValidDomain(skill.domain)) {
            return false;
        }
    }

    return true;
}

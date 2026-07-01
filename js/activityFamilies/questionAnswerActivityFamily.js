import { createBaseActivityFamily } from './baseActivityFamily.js';

/**
 * Factory function creating a Question-Answer Activity Family controller.
 * Question-Answer activities focus on reasoning, calculation, recall, or language (e.g. Number Bridges, Kumon Quiz).
 *
 * @param {Object} config - Configuration object
 * @returns {Object} The Question-Answer Activity Family controller instance
 */
export function createQuestionAnswerActivityFamily(config = {}) {
    // 1. Establish Q&A layout default config
    // Learning support panel concept: optional and reserved. Only exists/renders when supplied.
    const qaConfig = {
        ...config,
        help: config.help || { enabled: false }
    };

    // 2. Instantiate base family
    const family = createBaseActivityFamily(qaConfig);

    // 3. Customize layout classes on mount
    const originalMount = family.mount;
    family.mount = () => {
        originalMount();
        
        const activityZone = family.shell.querySelector('.worksheet-shell__activity');
        if (activityZone) {
            activityZone.classList.add('flex', 'flex-col', 'justify-center', 'items-center', 'w-full');
            
            const firstChild = activityZone.firstElementChild;
            if (firstChild) {
                // Constrain calculation elements to readable width
                firstChild.classList.add('max-w-lg', 'w-full', 'mx-auto');
            }
        }
    };

    return {
        ...family,
        familyType: 'question-answer'
    };
}

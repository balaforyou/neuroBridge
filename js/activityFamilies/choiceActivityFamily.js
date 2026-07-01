import { createBaseActivityFamily } from './baseActivityFamily.js';

/**
 * Factory function creating a Choice Activity Family controller.
 * Choice activities let the learner select among visible options (e.g. Directions, Attribute Explorer).
 *
 * @param {Object} config - Configuration object
 * @returns {Object} The Choice Activity Family controller instance
 */
export function createChoiceActivityFamily(config = {}) {
    // 1. Force Choice layout settings
    const choiceConfig = {
        ...config,
        help: { enabled: false } // Scaffolds are activity-owned and embedded inside choices
    };

    // 2. Instantiate base family
    const family = createBaseActivityFamily(choiceConfig);

    // 3. Customize layout classes on mount
    const originalMount = family.mount;
    family.mount = () => {
        originalMount();
        
        // Ensure compact centered workspace constraints (max-w-md)
        const mainZone = family.shell.querySelector('.worksheet-shell__main');
        if (mainZone) {
            mainZone.className = 'worksheet-shell__main grid min-h-0 flex-1 grid-cols-1 gap-3';
        }
        
        const activityZone = family.shell.querySelector('.worksheet-shell__activity');
        if (activityZone) {
            // Apply choice-friendly centering classes
            activityZone.classList.add('flex', 'flex-col', 'justify-center', 'items-center', 'w-full');
            
            // Constrain width of children if a task container is present
            const firstChild = activityZone.firstElementChild;
            if (firstChild) {
                firstChild.classList.add('max-w-md', 'w-full', 'mx-auto');
            }
        }
    };

    const baseHandleSuccess = family.handleSuccess;
    const baseHandleMistake = family.handleMistake;

    return {
        ...family,
        familyType: 'choice',
        handleSuccess(options = {}) {
            return baseHandleSuccess({ mode: 'surface', ...options });
        },
        handleMistake(options = {}) {
            return baseHandleMistake({ mode: 'immediate', ...options });
        }
    };
}

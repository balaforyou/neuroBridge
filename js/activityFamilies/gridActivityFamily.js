import { createBaseActivityFamily } from './baseActivityFamily.js';

/**
 * Factory function creating a Grid Activity Family controller.
 * Grid activities involve visual search, pattern memory, or actions inside a grid (e.g. Schulte Table).
 *
 * @param {Object} config - Configuration object
 * @returns {Object} The Grid Activity Family controller instance
 */
export function createGridActivityFamily(config = {}) {
    // 1. Force Grid layout settings
    const gridConfig = {
        ...config,
        help: { enabled: false } // Scaffolds are activity-owned and embedded inside grid behavior
    };

    // 2. Instantiate base family
    const family = createBaseActivityFamily(gridConfig);

    // 3. Customize layout classes on mount
    const originalMount = family.mount;
    family.mount = () => {
        originalMount();
        
        // Ensure grid workspace uses single column and expands
        const mainZone = family.shell.querySelector('.worksheet-shell__main');
        if (mainZone) {
            mainZone.className = 'worksheet-shell__main grid min-h-0 flex-1 grid-cols-1 gap-3';
        }
        
        const activityZone = family.shell.querySelector('.worksheet-shell__activity');
        if (activityZone) {
            // Grid activities demand a larger visual workspace centered
            activityZone.classList.add('flex', 'flex-col', 'justify-center', 'items-center', 'w-full');
            
            const firstChild = activityZone.firstElementChild;
            if (firstChild) {
                // Larger max-width for Schulte grid than choices
                firstChild.classList.add('max-w-xl', 'w-full', 'mx-auto');
            }
        }
    };

    const baseHandleSuccess = family.handleSuccess;
    const baseHandleMistake = family.handleMistake;

    return {
        ...family,
        familyType: 'grid',
        handleSuccess(options = {}) {
            return baseHandleSuccess({ mode: 'surface', ...options });
        },
        handleMistake(options = {}) {
            return baseHandleMistake({ mode: 'immediate', ...options });
        }
    };
}

export const ACTIVITY_TILE_GROUPS = [
    {
        category: 'Recommended',
        title: 'Start here',
        description: 'Choose an activity to explore today.',
        labelClass: 'text-emerald-300',
        tiles: [
            {
                activityId: 'matchingWorksheet',
                parentName: 'Matching Worksheet',
                learnerName: 'Matching Worksheet',
                icon: '&#129513;',
                description: 'Match the same pictures.',
                status: 'available',
                identityClass: 'from-emerald-100 via-lime-50 to-sky-50 border-emerald-300',
                iconClass: 'from-emerald-300 via-lime-200 to-sky-200',
                actionClass: 'bg-emerald-600 group-hover:bg-emerald-500',
                domain: 'executive-function',
                skills: ['visual-discrimination', 'matching', 'categorization']
            },
            {
                activityId: 'attributeMatchingWorksheet',
                parentName: 'Attribute Matching Worksheet',
                learnerName: 'Attribute Matching',
                icon: '&#127912;',
                description: 'Find items that share a property.',
                status: 'available',
                identityClass: 'from-rose-100 via-amber-50 to-emerald-50 border-rose-300',
                iconClass: 'from-rose-300 via-amber-200 to-emerald-200',
                actionClass: 'bg-rose-600 group-hover:bg-rose-500',
                domain: 'executive-function',
                skills: ['attribute-matching', 'visual-discrimination', 'early-abstraction']
            }
        ]
    },
    {
        category: 'Thinking',
        title: 'Reasoning',
        description: 'Patterns and clues.',
        labelClass: 'text-indigo-300',
        tiles: [
            {
                activityId: 'matrixReasoning',
                parentName: 'Matrix Reasoning',
                learnerName: 'Pattern Detective',
                icon: '🧩',
                description: 'Find patterns and solve visual puzzles.',
                status: 'available',
                identityClass: 'from-indigo-100 via-sky-50 to-emerald-50 border-indigo-300',
                iconClass: 'from-indigo-300 via-sky-200 to-emerald-200',
                actionClass: 'bg-indigo-600 group-hover:bg-indigo-500',
                domain: 'reasoning',
                skills: ['pattern-recognition', 'rule-discovery', 'visual-reasoning']
            }
        ]
    },
    {
        category: 'Attention',
        title: 'Look and notice',
        description: 'Compare and search.',
        labelClass: 'text-cyan-300',
        tiles: [
            {
                activityId: 'attributeExplorer',
                parentName: 'Attribute Explorer',
                learnerName: 'Look Closely',
                icon: '👀',
                description: 'Compare colors, shapes and sizes.',
                status: 'available',
                identityClass: 'from-cyan-100 via-emerald-50 to-lime-50 border-cyan-300',
                iconClass: 'from-cyan-300 via-emerald-200 to-lime-200',
                actionClass: 'bg-cyan-600 group-hover:bg-cyan-500',
                domain: 'concept-formation',
                skills: ['same-different', 'attribute-comparison', 'visual-attention']
            },
            {
                activityId: 'schulte',
                parentName: 'Schulte Table',
                learnerName: 'Grid Vision',
                subtitle: 'Schulte Table',
                icon: '🎯',
                description: 'Train your eyes to find things faster.',
                status: 'available',
                identityClass: 'from-sky-100 via-cyan-50 to-emerald-50 border-cyan-300',
                iconClass: 'from-sky-300 via-cyan-200 to-emerald-200',
                actionClass: 'bg-cyan-600 group-hover:bg-cyan-500',
                domain: 'visual-search',
                skills: ['visual-search', 'visual-attention']
            }
        ]
    },
    {
        category: 'Numbers',
        title: 'Number confidence',
        description: 'Numbers and steps.',
        labelClass: 'text-amber-300',
        tiles: [
            {
                activityId: 'kumonQuiz',
                parentName: 'Kumon Quiz',
                learnerName: 'Number Bridges',
                icon: '🔢',
                description: 'Build number confidence one step at a time.',
                status: 'available',
                identityClass: 'from-amber-100 via-yellow-50 to-emerald-50 border-amber-300',
                iconClass: 'from-amber-300 via-yellow-200 to-emerald-200',
                actionClass: 'bg-amber-600 group-hover:bg-amber-500',
                domain: 'numeracy',
                skills: ['number-bonds', 'arithmetic-fluency']
            }
        ]
    },
    {
        category: 'Language',
        title: 'Words and stories',
        description: 'Language activities will grow here.',
        labelClass: 'text-pink-300',
        tiles: []
    },
    {
        category: 'Life Skills',
        title: 'People and situations',
        description: 'Practice everyday understanding.',
        labelClass: 'text-emerald-300',
        tiles: [
            {
                activityId: 'socialDetective',
                parentName: 'Social Stories',
                learnerName: 'Social Detective',
                icon: '🤝',
                description: 'Practice understanding people and situations.',
                status: 'coming-soon',
                identityClass: 'from-emerald-50 via-teal-50 to-cyan-50 border-emerald-200',
                iconClass: 'from-emerald-200 via-teal-100 to-cyan-100',
                domain: 'daily-living',
                skills: ['direction-following']
            }
        ]
    }
];

export function initActivityTiles() {
    renderActivityTiles();
}

export function renderActivityTiles(learnerName = 'Learner') {
    const container = document.getElementById('game-selection-list');
    const messageEl = document.getElementById('activity-hub-message');

    if (messageEl) {
        messageEl.innerText = `${learnerName || 'Learner'}, let's learn together 🌱`;
    }

    if (!container) return;

    container.innerHTML = ACTIVITY_TILE_GROUPS
        .map(renderTileGroup)
        .join('');
}

function renderTileGroup(group, index) {
    const columnClass = index === 0 ? 'xl:col-span-3' : '';
    const tileGridClass = index === 0
        ? 'grid grid-cols-1 md:grid-cols-2 gap-3 w-full'
        : 'grid grid-cols-1 gap-3 w-full';

    return `
        <section class="${columnClass} rounded-lg border border-slate-800/70 bg-slate-900/55 p-2.5 sm:p-3 text-slate-100">
            <div class="flex flex-col gap-2.5">
                <div class="flex items-end justify-between gap-3 px-1">
                    <div>
                        <p class="text-[11px] font-black uppercase tracking-[0.16em] ${group.labelClass}">${group.category}</p>
                        <h3 class="mt-0.5 text-base sm:text-lg font-black text-slate-100">${group.title}</h3>
                    </div>
                    <p class="hidden sm:block text-xs font-semibold text-slate-400">${group.description}</p>
                </div>
                ${group.tiles.length
                    ? `<div class="${tileGridClass}">${group.tiles.map(renderActivityTile).join('')}</div>`
                    : renderReservedPanel(group)}
            </div>
        </section>
    `;
}

function renderReservedPanel(group) {
    const message = group.category === 'Recommended'
        ? 'Start with any activity today. SIRAASH will guide your path soon.'
        : 'More activities will grow here.';

    return `
        <div class="rounded-lg border border-dashed border-emerald-500/60 bg-emerald-950/45 px-4 py-3 text-sm font-bold text-emerald-100">
            ${message}
        </div>
    `;
}

export function renderActivityTile(tile) {
    return tile.status === 'available'
        ? renderAvailableTile(tile)
        : renderComingSoonTile(tile);
}

function renderAvailableTile(tile) {
    return `
        <button
            type="button"
            data-game="${tile.activityId}"
            data-testid="${getActivityTileTestId(tile)}"
            aria-label="${getActivityTileAriaLabel(tile)}"
            class="btn-launch-game group min-h-[148px] w-full rounded-lg border-2 ${tile.identityClass} bg-gradient-to-br px-4 py-3.5 text-left shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 focus:outline-none focus:ring-4 focus:ring-emerald-300/80">
            <span class="flex h-full flex-col">
                <span class="flex items-start gap-4">
                    <span class="inline-flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${tile.iconClass} text-6xl shadow-inner ring-2 ring-white/70" aria-hidden="true">${tile.icon}</span>
                    <span class="min-w-0 pt-1">
                        <span class="block text-2xl sm:text-3xl font-black leading-tight text-slate-950">${tile.learnerName}</span>
                        ${tile.subtitle ? `<span class="mt-1 block text-sm sm:text-base font-black leading-tight text-cyan-900">${tile.subtitle}</span>` : ''}
                        <span class="mt-2 block text-sm sm:text-base font-bold leading-snug text-slate-700">${tile.description}</span>
                    </span>
                </span>
                <span class="mt-3 inline-flex min-h-[46px] w-full items-center justify-center rounded-lg ${tile.actionClass} px-4 py-2 text-base sm:text-lg font-black text-white shadow-sm transition">
                    Start Activity
                </span>
            </span>
        </button>
    `;
}

function getActivityTileAriaLabel(tile) {
    return tile.subtitle
        ? `Start ${tile.learnerName}: ${tile.subtitle}`
        : `Start ${tile.learnerName}`;
}

function renderComingSoonTile(tile) {
    return `
        <div
            role="group"
            data-testid="${getActivityTileTestId(tile)}"
            aria-label="${tile.learnerName} coming soon"
            class="min-h-[148px] w-full rounded-lg border-2 ${tile.identityClass} bg-gradient-to-br px-4 py-3.5 text-left shadow-sm opacity-90">
            <span class="flex h-full flex-col">
                <span class="flex items-start gap-4">
                    <span class="inline-flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${tile.iconClass} text-6xl shadow-inner ring-2 ring-white/60" aria-hidden="true">${tile.icon}</span>
                    <span class="min-w-0 pt-1">
                        <span class="block text-2xl sm:text-3xl font-black leading-tight text-slate-700">${tile.learnerName}</span>
                        <span class="mt-2 block text-sm sm:text-base font-bold leading-snug text-slate-600">${tile.description}</span>
                    </span>
                </span>
                <span class="mt-3 inline-flex min-h-[46px] w-full items-center justify-center rounded-lg border-2 border-slate-300 bg-white/70 px-4 py-2 text-base sm:text-lg font-black text-slate-500">
                    Coming Soon
                </span>
            </span>
        </div>
    `;
}

export function getActivityTileTestId(tile) {
    const explicitIds = {
        matrixReasoning: 'activity-tile-pattern-detective',
        attributeExplorer: 'activity-tile-look-closely',
        matchingWorksheet: 'activity-tile-matching-worksheet',
        attributeMatchingWorksheet: 'activity-tile-attribute-matching',
        kumonQuiz: 'activity-tile-number-bridges',
        schulte: 'activity-tile-grid-vision'
    };

    return explicitIds[tile.activityId] || `activity-tile-${tile.activityId}`;
}

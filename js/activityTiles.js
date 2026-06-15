const ACTIVITY_TILE_GROUPS = [
    {
        category: 'Recommended',
        title: 'Start here',
        description: 'SIRAASH will suggest a gentle path here later.',
        accentClass: 'from-emerald-100 via-cyan-50 to-sky-100 border-emerald-300',
        labelClass: 'text-emerald-800',
        tiles: []
    },
    {
        category: 'Thinking',
        title: 'Reasoning',
        description: 'Patterns, rules, and visual thinking.',
        accentClass: 'from-indigo-100 via-sky-50 to-emerald-50 border-indigo-300',
        labelClass: 'text-indigo-800',
        tiles: [
            {
                activityId: 'matrixReasoning',
                parentName: 'Matrix Reasoning',
                learnerName: 'Pattern Detective',
                icon: '🧩',
                description: 'Find patterns and solve visual puzzles.',
                status: 'available',
                domain: 'reasoning',
                skills: ['pattern-recognition', 'rule-discovery', 'visual-reasoning']
            }
        ]
    },
    {
        category: 'Attention',
        title: 'Look and notice',
        description: 'Visual attention and careful comparison.',
        accentClass: 'from-cyan-100 via-emerald-50 to-lime-50 border-cyan-300',
        labelClass: 'text-cyan-800',
        tiles: [
            {
                activityId: 'attributeExplorer',
                parentName: 'Attribute Explorer',
                learnerName: 'Look Closely',
                icon: '👀',
                description: 'Compare colors, shapes and sizes.',
                status: 'available',
                domain: 'concept-formation',
                skills: ['same-different', 'attribute-comparison', 'visual-attention']
            },
            {
                activityId: 'gridVision',
                parentName: 'Schulte Table',
                learnerName: 'Grid Vision',
                icon: '🎯',
                description: 'Train your eyes to find things faster.',
                status: 'coming-soon',
                domain: 'visual-search',
                skills: ['visual-search', 'visual-attention']
            }
        ]
    },
    {
        category: 'Numbers',
        title: 'Number confidence',
        description: 'Gentle number activities for later.',
        accentClass: 'from-amber-100 via-yellow-50 to-emerald-50 border-amber-300',
        labelClass: 'text-amber-800',
        tiles: [
            {
                activityId: 'numberBridges',
                parentName: 'Number Bonds',
                learnerName: 'Number Bridges',
                icon: '🔢',
                description: 'Build number confidence one step at a time.',
                status: 'coming-soon',
                domain: 'numeracy',
                skills: ['number-bonds']
            }
        ]
    },
    {
        category: 'Language',
        title: 'Words and stories',
        description: 'Language activities will grow here.',
        accentClass: 'from-pink-100 via-rose-50 to-sky-50 border-pink-300',
        labelClass: 'text-pink-800',
        tiles: []
    },
    {
        category: 'Life Skills',
        title: 'People and situations',
        description: 'Practice everyday understanding.',
        accentClass: 'from-emerald-100 via-teal-50 to-cyan-50 border-emerald-300',
        labelClass: 'text-emerald-800',
        tiles: [
            {
                activityId: 'socialDetective',
                parentName: 'Social Stories',
                learnerName: 'Social Detective',
                icon: '🤝',
                description: 'Practice understanding people and situations.',
                status: 'coming-soon',
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
        ? 'grid grid-cols-1 md:grid-cols-2 gap-4 w-full'
        : 'grid grid-cols-1 gap-4 w-full';

    return `
        <section class="${columnClass} rounded-lg bg-gradient-to-br ${group.accentClass} border-2 p-3 sm:p-4 text-slate-950 shadow-sm">
            <div class="flex flex-col gap-3">
                <div>
                    <p class="text-xs font-black uppercase tracking-[0.16em] ${group.labelClass}">${group.category}</p>
                    <h3 class="mt-1 text-xl sm:text-2xl font-black text-slate-950">${group.title}</h3>
                    <p class="mt-1 text-sm font-semibold text-slate-700">${group.description}</p>
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
        <div class="rounded-lg border-2 border-dashed border-emerald-300 bg-white/60 px-4 py-4 text-sm font-bold text-emerald-900">
            ${message}
        </div>
    `;
}

function renderActivityTile(tile) {
    return tile.status === 'available'
        ? renderAvailableTile(tile)
        : renderComingSoonTile(tile);
}

function renderAvailableTile(tile) {
    return `
        <button
            type="button"
            data-game="${tile.activityId}"
            aria-label="Start ${tile.learnerName}"
            class="btn-launch-game group min-h-[150px] w-full rounded-lg border-2 border-white/80 bg-white/90 px-4 py-4 text-left shadow-md transition hover:-translate-y-0.5 hover:bg-white hover:shadow-lg active:translate-y-0 focus:outline-none focus:ring-4 focus:ring-emerald-300/80">
            <span class="flex h-full flex-col items-start">
                <span class="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-200 via-emerald-100 to-sky-200 text-5xl shadow-inner" aria-hidden="true">${tile.icon}</span>
                <span class="text-xl sm:text-2xl font-black leading-tight text-slate-950">${tile.learnerName}</span>
                <span class="mt-2 min-h-[36px] text-sm sm:text-base font-bold leading-snug text-slate-700">${tile.description}</span>
                <span class="mt-3 inline-flex min-h-[48px] w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-base sm:text-lg font-black text-white shadow-sm transition group-hover:bg-emerald-500">
                    Start Activity
                </span>
            </span>
        </button>
    `;
}

function renderComingSoonTile(tile) {
    return `
        <div
            role="group"
            aria-label="${tile.learnerName} coming soon"
            class="min-h-[150px] w-full rounded-lg border-2 border-slate-200 bg-white/70 px-4 py-4 text-left shadow-sm">
            <span class="flex h-full flex-col items-start">
                <span class="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-slate-100 via-sky-100 to-emerald-100 text-5xl opacity-90 shadow-inner" aria-hidden="true">${tile.icon}</span>
                <span class="text-xl sm:text-2xl font-black leading-tight text-slate-700">${tile.learnerName}</span>
                <span class="mt-2 min-h-[36px] text-sm sm:text-base font-bold leading-snug text-slate-600">${tile.description}</span>
                <span class="mt-3 inline-flex min-h-[48px] w-full items-center justify-center rounded-lg border-2 border-slate-300 bg-slate-100 px-4 py-2 text-base sm:text-lg font-black text-slate-500">
                    Coming Soon
                </span>
            </span>
        </div>
    `;
}

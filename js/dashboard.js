// js/dashboard.js

import {
    getGameConfiguration,
    saveGameConfiguration,
    getScoreLogs,
    clearAllScores,
    clearGameScores
} from './database.js';

import { getRegisteredGames } from './gameRegistry.js';

export function initDashboard() {
    console.log('Dashboard UI Controller Hooks Injected.');

    renderParentProgressReport();
    renderDeveloperTools();
}

export async function renderParentControls() {
    const container = document.getElementById('parent-controls-form');
    if (!container) return;

    const gamesList = getRegisteredGames();
    container.innerHTML = '';

    for (const game of gamesList) {
        const config = await getGameConfiguration(game.id);
        const forcedStageOptions = Array.from(
            { length: game.maxLevel || 10 },
            (_, index) => index + 1
        ).map(level => `
                        <option value="${level}" ${config.forcedStageOverride === level ? 'selected' : ''}>${level}</option>
        `).join('');

        const controlCard = document.createElement('div');
        controlCard.className = 'p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-4';

        controlCard.innerHTML = `
            <div class="flex justify-between items-center border-b border-slate-800 pb-2">
                <h4 class="text-md font-bold text-indigo-400">${game.title}</h4>

                <button 
                    data-game="${game.id}" 
                    class="btn-launch-game bg-emerald-600 hover:bg-emerald-500 text-xs px-2.5 py-1 rounded font-semibold text-white transition shadow">
                    Test Game
                </button>
            </div>

            <div class="space-y-3">
                <div>
                    <label class="block text-xs text-slate-400 mb-1">Max Level Ceiling</label>
                    <input 
                        type="number"
                        data-game="${game.id}"
                        data-setting="maxDifficultyCeiling"
                        value="${config.maxDifficultyCeiling}"
                        min="1"
                        max="${game.maxLevel || 10}"
                        class="setting-input w-full p-2 bg-slate-900 border border-slate-700 rounded text-sm">
                </div>

                <div>
                    <label class="block text-xs text-slate-400 mb-1">Session Duration (Seconds)</label>
                    <input 
                        type="number"
                        data-game="${game.id}"
                        data-setting="timeLimitSeconds"
                        value="${config.timeLimitSeconds}"
                        min="10"
                        max="300"
                        step="5"
                        class="setting-input w-full p-2 bg-slate-900 border border-slate-700 rounded text-sm">
                </div>

                <div>
                    <label class="block text-xs text-slate-400 mb-1">Trials Per Block</label>
                    <input 
                        type="number"
                        data-game="${game.id}"
                        data-setting="trialsPerBlock"
                        value="${config.trialsPerBlock || 5}"
                        min="5"
                        max="20"
                        step="1"
                        class="setting-input w-full p-2 bg-slate-900 border border-slate-700 rounded text-sm">
                </div>

                <div>
                    <label class="block text-xs text-slate-400 mb-1">Forced Stage Override</label>
                    <select
                        data-game="${game.id}"
                        data-setting="forcedStageOverride"
                        class="setting-input w-full p-2 bg-slate-900 border border-slate-700 rounded text-sm">
                        <option value="0" ${config.forcedStageOverride === 0 ? 'selected' : ''}>Auto</option>
                        ${forcedStageOptions}
                    </select>
                </div>

                <p 
                    data-status="${game.id}" 
                    class="text-[11px] text-slate-500 min-h-[16px]">
                </p>
            </div>
        `;

        container.appendChild(controlCard);
    }

    container.querySelectorAll('.setting-input').forEach(input => {
        input.addEventListener('change', handleSettingModification);
    });
}

export async function renderStudentMetrics() {
    const container = document.getElementById('student-metrics-chart');
    if (!container) return;

    const logs = await getScoreLogs(null, 20);

    if (!logs.length) {
        container.innerHTML = `
            <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-400">
                No student game records yet.
            </div>
        `;
        return;
    }

    const rows = logs.map(log => `
        <tr class="hover:bg-slate-900/60">
            <td class="p-3 font-semibold text-slate-200">${formatGameName(log.gameId)}</td>
            <td class="p-3 text-emerald-400">${log.score}</td>
            <td class="p-3">${log.accuracy ? Math.round(log.accuracy * 100) : 0}%</td>
            <td class="p-3">${log.averageReactionTimeMs || '--'} ms</td>
            <td class="p-3">${log.highestLevelReached || '--'}</td>
            <td class="p-3">${formatDate(log.timestamp)}</td>
        </tr>
    `).join('');

    container.innerHTML = `
        <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-slate-400">
                <thead class="bg-slate-950 text-slate-300 text-xs uppercase tracking-wider">
                    <tr>
                        <th class="p-3">Game Task</th>
                        <th class="p-3">Score</th>
                        <th class="p-3">Accuracy</th>
                        <th class="p-3">Reaction Time</th>
                        <th class="p-3">Peak Level</th>
                        <th class="p-3">Date</th>
                    </tr>
                </thead>

                <tbody class="divide-y divide-slate-800">
                    ${rows}
                </tbody>
            </table>
        </div>
    `;
}

async function handleSettingModification(event) {
    const input = event.target;
    const gameId = input.getAttribute('data-game');
    const settingKey = input.getAttribute('data-setting');
    const targetValue = parseInt(input.value, 10);

    if (!gameId || !settingKey || Number.isNaN(targetValue)) return;

    const statusEl = document.querySelector(`[data-status="${gameId}"]`);

    try {
        await saveGameConfiguration(gameId, {
            [settingKey]: targetValue
        });

        if (statusEl) {
            statusEl.innerText = 'Saved';
            statusEl.className = 'text-[11px] text-emerald-400 min-h-[16px]';
        }

        setTimeout(() => {
            if (statusEl) statusEl.innerText = '';
        }, 1500);

        console.log(`Parent setting saved -> Game: ${gameId}, ${settingKey}: ${targetValue}`);
    } catch (error) {
        console.error('Failed to save setting:', error);

        if (statusEl) {
            statusEl.innerText = 'Save failed';
            statusEl.className = 'text-[11px] text-rose-400 min-h-[16px]';
        }
    }
}

function formatGameName(gameId) {
    if (!gameId) return 'Unknown Game';

    return gameId
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, char => char.toUpperCase());
}

function formatDate(timestamp) {
    if (!timestamp) return '--';

    return new Date(timestamp).toLocaleString();
}

export async function renderParentProgressReport() {
    const container = document.getElementById('parent-report-view');
    if (!container) return;

    const logs = await getScoreLogs(null, 50);

    if (!logs.length) {
        container.innerHTML = `
            <div class="text-slate-400 text-sm">
                No student performance records yet.
            </div>
        `;
        return;
    }

    const totalSessions = logs.length;

    const avgAccuracy =
        logs.reduce((sum, log) => sum + Number(log.accuracy || 0), 0) / totalSessions;

    const avgReactionTime =
        logs.reduce((sum, log) => sum + Number(log.averageReactionTimeMs || 0), 0) / totalSessions;

    const highestLevel = Math.max(
        ...logs.map(log => Number(log.highestLevelReached || 1))
    );

    const bestScore = Math.max(
        ...logs.map(log => Number(log.score || 0))
    );

    const recentRows = logs.slice(0, 5).map(log => {

    const trialRows = (log.trials || []).map((trial, idx) => `
        <tr class="border-t border-slate-800">
            <td class="p-2">${idx + 1}</td>
            <td class="p-2">${trial.stage || '--'}</td>
            <td class="p-2 ${(trial.correct === true || trial.isCorrect === true) ? 'text-emerald-400' : 'text-amber-400'}">
                ${(trial.correct === true || trial.isCorrect === true) ? '✓' : '✗'}
            </td>
            <td class="p-2">${trial.reactionTimeMs || '--'} ms</td>
        </tr>
    `).join('');

    return `
        <details class="bg-slate-950 border border-slate-800 rounded-xl p-3">
            <summary class="cursor-pointer text-slate-200 font-semibold">
                ${formatGameName(log.gameId)}
                • Score ${log.score}
                • ${Math.round((log.accuracy || 0) * 100)}%
            </summary>

            <div class="mt-2 text-xs text-slate-500">
                ${formatDate(log.timestamp)}
            </div>

            <table class="mt-3 w-full text-xs">
                <thead>
                    <tr class="text-slate-400 border-b border-slate-800">
                        <th class="p-2 text-left">Trial</th>
                        <th class="p-2 text-left">Level</th>
                        <th class="p-2 text-left">Result</th>
                        <th class="p-2 text-left">Time</th>
                    </tr>
                </thead>
                <tbody>
                    ${trialRows}
                </tbody>
            </table>
        </details>
    `;
}).join('');

container.innerHTML = `
    <div class="grid grid-cols-2 gap-3">
        <div class="p-3 bg-slate-950 border border-slate-800 rounded-xl">
            <div class="text-[11px] text-slate-500 uppercase tracking-wide">Sessions</div>
            <div class="text-xl font-black text-slate-100">${totalSessions}</div>
        </div>

        <div class="p-3 bg-slate-950 border border-slate-800 rounded-xl">
            <div class="text-[11px] text-slate-500 uppercase tracking-wide">Avg Accuracy</div>
            <div class="text-xl font-black text-emerald-400">${Math.round(avgAccuracy * 100)}%</div>
        </div>

        <div class="p-3 bg-slate-950 border border-slate-800 rounded-xl">
            <div class="text-[11px] text-slate-500 uppercase tracking-wide">Avg Speed</div>
            <div class="text-xl font-black text-indigo-400">${Math.round(avgReactionTime)} ms</div>
        </div>

        <div class="p-3 bg-slate-950 border border-slate-800 rounded-xl">
            <div class="text-[11px] text-slate-500 uppercase tracking-wide">Peak Level</div>
            <div class="text-xl font-black text-amber-400">${highestLevel}</div>
        </div>
    </div>

    <div class="mt-4 p-3 bg-slate-950 border border-slate-800 rounded-xl">
        <div class="text-xs text-slate-500 uppercase tracking-wide">Best Score</div>
        <div class="text-lg font-bold text-emerald-400">${bestScore}</div>
    </div>

    <div class="mt-5">
        <h4 class="text-sm font-bold text-slate-300 mb-3">
            Session Trial Breakdown
        </h4>

        <div class="space-y-3">
            ${recentRows}
        </div>
    </div>
`;
}

export function renderDeveloperTools() {

    const container =
        document.getElementById('developer-tools-panel');

    if (!container) return;

    container.innerHTML = `
        <button id="dev-reset-matrix"
            class="w-full bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg text-sm">
            Reset Matrix Scores
        </button>

        <button id="dev-reset-all"
            class="w-full bg-rose-900 hover:bg-rose-800 px-3 py-2 rounded-lg text-sm">
            Reset All Scores
        </button>

        <button id="dev-show-db"
            class="w-full bg-indigo-900 hover:bg-indigo-800 px-3 py-2 rounded-lg text-sm">
            Show Database
        </button>
    `;

    document
        .getElementById('dev-reset-matrix')
        ?.addEventListener('click', async () => {

            if (!confirm('Delete Matrix scores?')) return;

            await clearGameScores('matrixReasoning');

            await renderParentProgressReport();
            await renderStudentMetrics();

            alert('Matrix scores removed.');
        });

    document
        .getElementById('dev-reset-all')
        ?.addEventListener('click', async () => {

            if (!confirm('Delete ALL scores?')) return;

            await clearAllScores();

            await renderParentProgressReport();
            await renderStudentMetrics();

            alert('All scores removed.');
        });

    document
        .getElementById('dev-show-db')
        ?.addEventListener('click', async () => {

            const logs = await getScoreLogs();

            console.table(logs);

            alert(`Database contains ${logs.length} score records.`);
        });
}

// js/dashboard.js

import {
    getGameConfiguration,
    saveGameConfiguration,
    getScoreLogs,
    clearAllScores,
    clearGameScores
} from './database.js';

import { GAME_IDS } from './constants.js';
import {
    DASHBOARD_VIEW_TYPES,
    getGameById,
    getRegisteredGames
} from './gameRegistry.js';

const PARENT_WORKSPACE_TABS = ['dashboard', 'administration', 'testing'];
const DEFAULT_PARENT_WORKSPACE_TAB = 'dashboard';
const NUMBER_BRIDGE_MAX_LEVEL = 9;
export const NUMBER_BRIDGE_LEVEL_OPTIONS = Array.from({ length: NUMBER_BRIDGE_MAX_LEVEL }, (_, index) => index + 1);
const NUMBER_BRIDGE_TABLE_LEVEL_OPTIONS = [1, 2, 3, 4, 5];
const NUMBER_BRIDGE_MASTER_OPERATIONS = ['+', '-'];
const NUMBER_BRIDGE_MASTER_RANGE_MIN = 1;
const NUMBER_BRIDGE_MASTER_RANGE_MAX = 9;
const NUMBER_BRIDGE_QUESTION_COUNT_OPTIONS = [5, 10, 20];
const NUMBER_BRIDGE_QUESTIONS_PER_SCREEN_OPTIONS = [1, 3, 5];
const NUMBER_BRIDGE_OPERATION_OPTIONS = [
    { value: '+', label: 'Addition', factors: NUMBER_BRIDGE_LEVEL_OPTIONS, skillLabelFor: factor => `+${factor} Bridges` },
    { value: '-', label: 'Subtraction', factors: NUMBER_BRIDGE_LEVEL_OPTIONS, skillLabelFor: factor => `-${factor} Bridges` },
    { value: '×', label: 'Multiplication', factors: [2, 3, 4, 5, 6, 7, 8, 9, 10], levels: NUMBER_BRIDGE_LEVEL_OPTIONS, skillLabelFor: factor => `×${factor} Tables` },
    { value: '÷', label: 'Division', factors: [2, 3, 4, 5, 10], levels: NUMBER_BRIDGE_TABLE_LEVEL_OPTIONS, skillLabelFor: factor => `÷${factor} Facts` }
];
let settingsSaveQueue = Promise.resolve();

export function initDashboard() {
    console.log('Dashboard UI Controller Hooks Injected.');

    initParentWorkspaceTabs();
    renderParentProgressReport();
    renderDeveloperTools();
}

function initParentWorkspaceTabs() {
    document.querySelectorAll('[data-parent-tab]').forEach(tab => {
        tab.addEventListener('click', () => {
            activateParentWorkspaceTab(tab.getAttribute('data-parent-tab'));
        });
    });

    activateParentWorkspaceTab(DEFAULT_PARENT_WORKSPACE_TAB);
}

export function activateParentWorkspaceTab(tabId = DEFAULT_PARENT_WORKSPACE_TAB) {
    const activeTab = PARENT_WORKSPACE_TABS.includes(tabId)
        ? tabId
        : DEFAULT_PARENT_WORKSPACE_TAB;

    document.querySelectorAll('[data-parent-tab]').forEach(tab => {
        const isActive = tab.getAttribute('data-parent-tab') === activeTab;
        tab.setAttribute('aria-selected', String(isActive));
        tab.classList.toggle('bg-emerald-600', isActive);
        tab.classList.toggle('text-white', isActive);
        tab.classList.toggle('shadow', isActive);
        tab.classList.toggle('bg-slate-950', !isActive);
        tab.classList.toggle('text-slate-300', !isActive);
        tab.classList.toggle('hover:bg-slate-800', !isActive);
    });

    document.querySelectorAll('[data-parent-panel]').forEach(panel => {
        const isActive = panel.getAttribute('data-parent-panel') === activeTab;
        panel.classList.toggle('hidden', !isActive);
        panel.setAttribute('aria-hidden', String(!isActive));
    });
}

export async function renderParentControls() {
    activateParentWorkspaceTab(DEFAULT_PARENT_WORKSPACE_TAB);

    const container = document.getElementById('parent-controls-form');
    if (!container) return;

    const gamesList = getRegisteredGames();
    container.innerHTML = '';

    for (const game of gamesList) {
        const config = await getGameConfiguration(game.id);

        if (game.id === GAME_IDS.KUMON_QUIZ) {
            container.appendChild(createNumberBridgeControlCard(game, config));
            continue;
        }

        const forcedStageOptions = Array.from(
            { length: game.maxLevel || 10 },
            (_, index) => index + 1
        ).map(level => `
                        <option value="${level}" ${config.forcedStageOverride === level ? 'selected' : ''}>${level}</option>
        `).join('');

        const controlCard = document.createElement('div');
        controlCard.className = 'p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-4';

        controlCard.innerHTML = `
            <div class="border-b border-slate-800 pb-2">
                <h4 class="text-md font-bold text-indigo-400">${game.title}</h4>
                <p class="text-xs text-slate-500 mt-1">${game.description || 'Activity settings'}</p>
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

function createNumberBridgeControlCard(game, config) {
    const controlCard = document.createElement('div');
    controlCard.className = 'p-4 bg-slate-950 border border-emerald-900 rounded-xl space-y-4';
    controlCard.setAttribute('data-testid', 'number-bridges-config-panel');
    const normalizedMode = getNumberBridgeArithmeticMode(config);
    const controlVisibility = getNumberBridgeControlVisibility(config);

    controlCard.innerHTML = `
        <div class="border-b border-slate-800 pb-2">
            <h4 class="text-md font-bold text-emerald-300">${game.title}</h4>
            <p class="text-xs text-slate-500 mt-1">Parent configuration for arithmetic Number Bridges.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            ${renderSelectSetting({
                label: 'Operation',
                gameId: game.id,
                setting: 'operation',
                testId: 'number-bridges-config-operation',
                value: config.operation || '+',
                options: NUMBER_BRIDGE_OPERATION_OPTIONS.map(operation => ({
                    value: operation.value,
                    label: operation.label
                }))
            })}
            ${renderSelectSetting({
                label: 'Mode',
                gameId: game.id,
                setting: 'arithmeticMode',
                testId: 'number-bridges-config-mode',
                value: normalizedMode,
                options: getNumberBridgeArithmeticModeOptionsForOperation(config.operation)
            })}
            ${renderSelectSetting({
                label: 'Level',
                gameId: game.id,
                setting: 'level',
                type: 'number',
                testId: 'number-bridges-config-level',
                wrapperTestId: 'number-bridges-config-level-control',
                hidden: !controlVisibility.showLevel,
                value: Number(config.level || 1),
                options: getNumberBridgeLevelOptionsForOperation(config.operation).map(level => ({
                    value: level,
                    label: formatNumberBridgeLevelDisplay({ ...config, level })
                }))
            })}
            ${renderNumberInputSetting({
                label: 'A Min',
                gameId: game.id,
                setting: 'aMin',
                testId: 'number-bridges-config-a-min',
                wrapperTestId: 'number-bridges-config-a-min-control',
                hidden: !controlVisibility.showRanges,
                value: normalizeNumberBridgeDashboardMasterRanges(config).aMin
            })}
            ${renderNumberInputSetting({
                label: 'A Max',
                gameId: game.id,
                setting: 'aMax',
                testId: 'number-bridges-config-a-max',
                wrapperTestId: 'number-bridges-config-a-max-control',
                hidden: !controlVisibility.showRanges,
                value: normalizeNumberBridgeDashboardMasterRanges(config).aMax
            })}
            ${renderNumberInputSetting({
                label: 'B Min',
                gameId: game.id,
                setting: 'bMin',
                testId: 'number-bridges-config-b-min',
                wrapperTestId: 'number-bridges-config-b-min-control',
                hidden: !controlVisibility.showRanges,
                value: normalizeNumberBridgeDashboardMasterRanges(config).bMin
            })}
            ${renderNumberInputSetting({
                label: 'B Max',
                gameId: game.id,
                setting: 'bMax',
                testId: 'number-bridges-config-b-max',
                wrapperTestId: 'number-bridges-config-b-max-control',
                hidden: !controlVisibility.showRanges,
                value: normalizeNumberBridgeDashboardMasterRanges(config).bMax
            })}
            ${renderSelectSetting({
                label: 'Questions',
                gameId: game.id,
                setting: 'questionCount',
                type: 'number',
                testId: 'number-bridges-config-question-count',
                value: Number(config.questionCount || 10),
                options: NUMBER_BRIDGE_QUESTION_COUNT_OPTIONS.map(count => ({
                    value: count,
                    label: String(count)
                }))
            })}
            ${renderSelectSetting({
                label: 'Questions Per Screen',
                gameId: game.id,
                setting: 'questionsPerScreen',
                type: 'number',
                testId: 'number-bridges-config-questions-per-screen',
                value: Number(config.questionsPerScreen || 5),
                options: NUMBER_BRIDGE_QUESTIONS_PER_SCREEN_OPTIONS.map(count => ({
                    value: count,
                    label: String(count)
                }))
            })}
            ${renderSelectSetting({
                label: 'Hints',
                gameId: game.id,
                setting: 'hintsEnabled',
                type: 'boolean',
                testId: 'number-bridges-config-hints',
                value: config.hintsEnabled !== false,
                options: [
                    { value: true, label: 'On' },
                    { value: false, label: 'Off' }
                ]
            })}
            ${renderSelectSetting({
                label: 'Auto Progression',
                gameId: game.id,
                setting: 'autoProgression',
                type: 'boolean',
                testId: 'number-bridges-config-auto-progression',
                value: config.autoProgression === true,
                options: [
                    { value: true, label: 'On' },
                    { value: false, label: 'Off' }
                ]
            })}
            ${renderSelectSetting({
                label: 'Question Order',
                gameId: game.id,
                setting: 'questionOrder',
                testId: 'number-bridges-config-question-order',
                value: config.questionOrder === 'random' ? 'random' : 'sequential',
                options: [
                    { value: 'sequential', label: 'Sequential' },
                    { value: 'random', label: 'Random' }
                ]
            })}
        </div>

        <div data-testid="number-bridges-config-summary" class="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-bold text-slate-300">
            ${formatNumberBridgeConfigurationSummary(config)}
        </div>

        <p data-status="${game.id}" class="text-[11px] text-slate-500 min-h-[16px]"></p>
    `;

    return controlCard;
}

function renderSelectSetting({
    label,
    gameId,
    setting,
    testId,
    value,
    options,
    type = 'string',
    wrapperTestId,
    hidden = false
}) {
    const normalizedValue = String(value);

    return `
        <label ${wrapperTestId ? `data-testid="${wrapperTestId}"` : ''} class="block ${hidden ? 'hidden' : ''}">
            <span class="block text-xs text-slate-400 mb-1">${label}</span>
            <select
                data-game="${gameId}"
                data-setting="${setting}"
                data-setting-type="${type}"
                data-testid="${testId}"
                class="setting-input w-full p-2 bg-slate-900 border border-slate-700 rounded text-sm">
                ${options.map(option => `
                    <option value="${option.value}" ${String(option.value) === normalizedValue ? 'selected' : ''}>${option.label}</option>
                `).join('')}
            </select>
        </label>
    `;
}

function renderNumberInputSetting({
    label,
    gameId,
    setting,
    testId,
    value,
    wrapperTestId,
    hidden = false
}) {
    return `
        <label ${wrapperTestId ? `data-testid="${wrapperTestId}"` : ''} class="block ${hidden ? 'hidden' : ''}">
            <span class="block text-xs text-slate-400 mb-1">${label}</span>
            <input
                type="number"
                min="${NUMBER_BRIDGE_MASTER_RANGE_MIN}"
                max="${NUMBER_BRIDGE_MASTER_RANGE_MAX}"
                step="1"
                data-game="${gameId}"
                data-setting="${setting}"
                data-setting-type="number"
                data-testid="${testId}"
                value="${value}"
                class="setting-input w-full p-2 bg-slate-900 border border-slate-700 rounded text-sm">
        </label>
    `;
}

export async function renderStudentMetrics() {
    const container = document.getElementById('student-metrics-chart');
    if (!container) return;

    const logs = await getScoreLogs(null, 20);

    if (!logs.length) {
        container.innerHTML = `
            <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-400">
                No student activity records yet.
            </div>
        `;
        return;
    }

    const rows = logs.map(log => `
        <tr class="hover:bg-slate-900/60">
            <td class="p-3 font-semibold text-slate-200">${formatGameName(log.gameId)}</td>
            <td class="p-3 text-emerald-400">${formatScore(log)}</td>
            <td class="p-3">${formatAccuracy(log)}</td>
            <td class="p-3">${formatTime(log)}</td>
            <td class="p-3">${log.highestLevelReached || '--'}</td>
            <td class="p-3">${formatDate(log.timestamp)}</td>
        </tr>
    `).join('');

    container.innerHTML = `
        <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-slate-400">
                <thead class="bg-slate-950 text-slate-300 text-xs uppercase tracking-wider">
                    <tr>
                        <th class="p-3">Activity</th>
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

function handleSettingModification(event) {
    const input = event.target;
    settingsSaveQueue = settingsSaveQueue.then(() => persistSettingModification(input));
}

async function persistSettingModification(input) {
    const gameId = input.getAttribute('data-game');
    const settingKey = input.getAttribute('data-setting');
    const targetValue = parseSettingValue(input);

    if (!gameId || !settingKey || targetValue === null) return;

    const statusEl = document.querySelector(`[data-status="${gameId}"]`);
    const updates = createSettingUpdate(gameId, settingKey, targetValue);

    try {
        const savedConfig = await saveGameConfiguration(gameId, updates);

        if (statusEl) {
            statusEl.innerText = 'Saved';
            statusEl.className = 'text-[11px] text-emerald-400 min-h-[16px]';
        }

        updateNumberBridgeConfigurationSummary(gameId, savedConfig);
        updateNumberBridgeModeOptions(gameId, savedConfig);
        updateNumberBridgeLevelOptions(gameId, savedConfig);
        updateNumberBridgeRangeControls(gameId, savedConfig);
        await renderParentProgressReport();

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

function parseSettingValue(input) {
    const settingType = input.getAttribute('data-setting-type') || 'number';

    if (settingType === 'boolean') {
        return input.value === 'true';
    }

    if (settingType === 'string') {
        return input.value;
    }

    const numericValue = parseInt(input.value, 10);
    return Number.isNaN(numericValue) ? null : numericValue;
}

function createSettingUpdate(gameId, settingKey, targetValue) {
    const updates = { [settingKey]: targetValue };

    if (gameId === GAME_IDS.KUMON_QUIZ && settingKey === 'arithmeticMode') {
        const operation = getCurrentNumberBridgeOperation();
        updates.arithmeticMode = targetValue === 'master' && NUMBER_BRIDGE_MASTER_OPERATIONS.includes(operation)
            ? 'master'
            : 'bridge';
        Object.assign(updates, normalizeNumberBridgeDashboardMasterRanges(getCurrentNumberBridgeRangeValues()));
    }

    if (gameId === GAME_IDS.KUMON_QUIZ && settingKey === 'level') {
        updates.secondNumberMode = 'fixed';
        updates.secondNumberFixedValue = getNumberBridgeFactorForLevel(getCurrentNumberBridgeOperation(), targetValue);
    }

    if (gameId === GAME_IDS.KUMON_QUIZ && settingKey === 'operation') {
        Object.assign(updates, createNumberBridgeOperationUpdate(targetValue, getCurrentNumberBridgeLevel(), getCurrentNumberBridgeArithmeticMode()));
        if (!NUMBER_BRIDGE_MASTER_OPERATIONS.includes(targetValue) && getCurrentNumberBridgeArithmeticMode() === 'master') {
            updates.arithmeticMode = 'bridge';
        }
    }

    if (gameId === GAME_IDS.KUMON_QUIZ && ['aMin', 'aMax', 'bMin', 'bMax'].includes(settingKey)) {
        Object.assign(updates, normalizeNumberBridgeDashboardMasterRanges({
            ...getCurrentNumberBridgeRangeValues(),
            [settingKey]: targetValue
        }, getCurrentNumberBridgeOperation()));
    }

    return updates;
}

function updateNumberBridgeConfigurationSummary(gameId, config) {
    if (gameId !== GAME_IDS.KUMON_QUIZ) return;

    const summaryEl = document.querySelector('[data-testid="number-bridges-config-summary"]');
    if (summaryEl) {
        summaryEl.textContent = formatNumberBridgeConfigurationSummary(config);
    }
}

function updateNumberBridgeLevelOptions(gameId, config) {
    if (gameId !== GAME_IDS.KUMON_QUIZ) return;

    const levelSelect = document.querySelector('[data-testid="number-bridges-config-level"]');
    if (!levelSelect) return;

    const levelOptions = getNumberBridgeLevelOptionsForOperation(config.operation);
    const selectedLevel = clampInteger(config.level, 1, getNumberBridgeMaxLevelForOperation(config.operation), 1);
    levelSelect.innerHTML = levelOptions.map(level => `
        <option value="${level}" ${level === selectedLevel ? 'selected' : ''}>${formatNumberBridgeLevelDisplay({ ...config, level })}</option>
    `).join('');
}

function updateNumberBridgeModeOptions(gameId, config) {
    if (gameId !== GAME_IDS.KUMON_QUIZ) return;

    const modeSelect = document.querySelector('[data-testid="number-bridges-config-mode"]');
    if (!modeSelect) return;

    const arithmeticMode = getNumberBridgeArithmeticMode(config);
    modeSelect.innerHTML = getNumberBridgeArithmeticModeOptionsForOperation(config.operation).map(option => `
        <option value="${option.value}" ${option.value === arithmeticMode ? 'selected' : ''}>${option.label}</option>
    `).join('');
}

function updateNumberBridgeRangeControls(gameId, config) {
    if (gameId !== GAME_IDS.KUMON_QUIZ) return;

    const visibility = getNumberBridgeControlVisibility(config);
    toggleNumberBridgeControl('number-bridges-config-level-control', !visibility.showLevel);
    toggleNumberBridgeControl('number-bridges-config-a-min-control', !visibility.showRanges);
    toggleNumberBridgeControl('number-bridges-config-a-max-control', !visibility.showRanges);
    toggleNumberBridgeControl('number-bridges-config-b-min-control', !visibility.showRanges);
    toggleNumberBridgeControl('number-bridges-config-b-max-control', !visibility.showRanges);

    const ranges = normalizeNumberBridgeDashboardMasterRanges(config, config.operation);
    setNumberBridgeInputValue('number-bridges-config-a-min', ranges.aMin);
    setNumberBridgeInputValue('number-bridges-config-a-max', ranges.aMax);
    setNumberBridgeInputValue('number-bridges-config-b-min', ranges.bMin);
    setNumberBridgeInputValue('number-bridges-config-b-max', ranges.bMax);
}

function toggleNumberBridgeControl(testId, hidden) {
    document.querySelector(`[data-testid="${testId}"]`)?.classList.toggle('hidden', hidden);
}

function setNumberBridgeInputValue(testId, value) {
    const input = document.querySelector(`[data-testid="${testId}"]`);
    if (input) {
        input.value = String(value);
    }
}

function formatGameName(gameId) {
    if (!gameId) return 'Unknown Game';

    const game = getGameById(gameId);
    if (game?.name && game?.title && game.name !== game.title) {
        return `${game.name} / ${game.title}`;
    }

    if (game?.title) return game.title;

    return gameId
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, char => char.toUpperCase());
}

function formatNumberBridgeLevelDisplay(config = {}) {
    const operationPack = getNumberBridgeDashboardOperationPack(config.operation);
    const level = clampInteger(config.level, 1, getNumberBridgeMaxLevelForOperation(operationPack.value), 1);
    const factor = operationPack.factors[level - 1] || operationPack.factors[0];
    return `${operationPack.label} L${level} (${operationPack.skillLabelFor(factor)})`;
}

export function getNumberBridgeLevelOptionsForOperation(operation = '+') {
    const operationPack = getNumberBridgeDashboardOperationPack(operation);
    return operationPack.levels || operationPack.factors.map((_, index) => index + 1);
}

export function getNumberBridgeArithmeticModeOptionsForOperation(operation = '+') {
    const options = [{ value: 'bridge', label: 'Bridge Level' }];
    if (NUMBER_BRIDGE_MASTER_OPERATIONS.includes(getNumberBridgeDashboardOperationPack(operation).value)) {
        options.push({ value: 'master', label: 'Master' });
    }

    return options;
}

function getNumberBridgeArithmeticMode(config = {}) {
    return config.arithmeticMode === 'master' &&
        NUMBER_BRIDGE_MASTER_OPERATIONS.includes(getNumberBridgeDashboardOperationPack(config.operation).value)
        ? 'master'
        : 'bridge';
}

export function getNumberBridgeControlVisibility(config = {}) {
    const showRanges = getNumberBridgeArithmeticMode(config) === 'master';
    return {
        showLevel: !showRanges,
        showRanges
    };
}

export function normalizeNumberBridgeDashboardMasterRanges(config = {}, operation = '+') {
    const aMin = clampInteger(config.aMin, NUMBER_BRIDGE_MASTER_RANGE_MIN, NUMBER_BRIDGE_MASTER_RANGE_MAX, 1);
    const aMax = Math.max(aMin, clampInteger(config.aMax, NUMBER_BRIDGE_MASTER_RANGE_MIN, NUMBER_BRIDGE_MASTER_RANGE_MAX, 2));
    let bMin = clampInteger(config.bMin, NUMBER_BRIDGE_MASTER_RANGE_MIN, NUMBER_BRIDGE_MASTER_RANGE_MAX, 1);
    let bMax = Math.max(bMin, clampInteger(config.bMax, NUMBER_BRIDGE_MASTER_RANGE_MIN, NUMBER_BRIDGE_MASTER_RANGE_MAX, 2));

    if (getNumberBridgeDashboardOperationPack(operation).value === '-' && bMin > aMax) {
        bMin = aMax;
        bMax = aMax;
    }

    return { aMin, aMax, bMin, bMax };
}

export function createNumberBridgeOperationUpdate(operation = '+', currentLevel = 1, currentArithmeticMode = 'bridge') {
    const clampedLevel = clampInteger(currentLevel, 1, getNumberBridgeMaxLevelForOperation(operation), 1);
    return {
        operation,
        arithmeticMode: NUMBER_BRIDGE_MASTER_OPERATIONS.includes(getNumberBridgeDashboardOperationPack(operation).value)
            ? (currentArithmeticMode === 'master' ? 'master' : 'bridge')
            : 'bridge',
        level: clampedLevel,
        secondNumberMode: 'fixed',
        secondNumberFixedValue: getNumberBridgeFactorForLevel(operation, clampedLevel)
    };
}

function getNumberBridgeMaxLevelForOperation(operation = '+') {
    const options = getNumberBridgeLevelOptionsForOperation(operation);
    return options[options.length - 1] || 1;
}

function getNumberBridgeFactorForLevel(operation = '+', level = 1) {
    const operationPack = getNumberBridgeDashboardOperationPack(operation);
    const clampedLevel = clampInteger(level, 1, getNumberBridgeMaxLevelForOperation(operation), 1);
    return operationPack.factors[clampedLevel - 1] || operationPack.factors[0];
}

function getCurrentNumberBridgeOperation() {
    return document.querySelector('[data-testid="number-bridges-config-operation"]')?.value || '+';
}

function getCurrentNumberBridgeArithmeticMode() {
    return document.querySelector('[data-testid="number-bridges-config-mode"]')?.value === 'master'
        ? 'master'
        : 'bridge';
}

function getCurrentNumberBridgeLevel() {
    const levelValue = document.querySelector('[data-testid="number-bridges-config-level"]')?.value;
    return clampInteger(levelValue, 1, NUMBER_BRIDGE_MAX_LEVEL, 1);
}

function getCurrentNumberBridgeRangeValues() {
    return {
        aMin: document.querySelector('[data-testid="number-bridges-config-a-min"]')?.value,
        aMax: document.querySelector('[data-testid="number-bridges-config-a-max"]')?.value,
        bMin: document.querySelector('[data-testid="number-bridges-config-b-min"]')?.value,
        bMax: document.querySelector('[data-testid="number-bridges-config-b-max"]')?.value
    };
}

function getNumberBridgeDashboardOperationPack(operation = '+') {
    if (operation === 'x' || operation === 'X' || operation === '*') {
        return NUMBER_BRIDGE_OPERATION_OPTIONS.find(option => option.value === '×');
    }

    if (operation === '/') {
        return NUMBER_BRIDGE_OPERATION_OPTIONS.find(option => option.value === '÷');
    }

    return NUMBER_BRIDGE_OPERATION_OPTIONS.find(option => option.value === operation) || NUMBER_BRIDGE_OPERATION_OPTIONS[0];
}

function formatNumberBridgeQuestionOrder(config = {}) {
    return (config.questionOrder || config.questionOrderMode) === 'random' ? 'Random' : 'Sequential';
}

export function formatNumberBridgeConfigurationSummary(config = {}) {
    const questionCount = [5, 10, 20].includes(Number(config.questionCount))
        ? Number(config.questionCount)
        : 10;
    const questionsPerScreen = [1, 3, 5].includes(Number(config.questionsPerScreen))
        ? Number(config.questionsPerScreen)
        : 5;
    const hintsLabel = config.hintsEnabled === false ? 'Hints Off' : 'Hints On';

    return [
        formatNumberBridgePrimaryLabel(config),
        `${questionCount} Questions`,
        `${questionsPerScreen} Per Screen`,
        hintsLabel,
        `Question Order: ${formatNumberBridgeQuestionOrder(config)}`
    ].join(' | ');
}

function formatNumberBridgePrimaryLabel(config = {}) {
    if (getNumberBridgeArithmeticMode(config) === 'master') {
        const operationPack = getNumberBridgeDashboardOperationPack(config.operation);
        const ranges = normalizeNumberBridgeDashboardMasterRanges(config, operationPack.value);
        return `${operationPack.label} Master A${ranges.aMin}-${ranges.aMax} B${ranges.bMin}-${ranges.bMax}`;
    }

    return formatNumberBridgeLevelDisplay(config);
}

function renderNumberBridgeActiveConfiguration(config = {}) {
    return `
        <section data-testid="number-bridges-active-config" class="mb-4 rounded-xl border border-emerald-900 bg-slate-950 p-3">
            <div class="text-[11px] uppercase tracking-wide text-emerald-300 font-black">Number Bridges Active Configuration</div>
            <div class="mt-1 text-sm font-bold text-slate-100">${formatNumberBridgeConfigurationSummary(config)}</div>
        </section>
    `;
}

function formatScore(log) {
    if (Number(log.totalQuestions || 0) > 0) {
        return `${Number(log.correctCount ?? log.score ?? 0)} / ${Number(log.totalQuestions)}`;
    }

    return String(Number(log.score || 0));
}

function getAccuracyRatio(log) {
    if (Number.isFinite(Number(log.accuracyPercent))) {
        return clampRatio(Number(log.accuracyPercent) / 100);
    }

    const rawAccuracy = Number(log.accuracy || 0);
    return clampRatio(rawAccuracy > 1 ? rawAccuracy / 100 : rawAccuracy);
}

function formatAccuracy(log) {
    return `${Math.round(getAccuracyRatio(log) * 100)}%`;
}

function formatTime(log) {
    if (Number(log.sessionLengthSeconds || 0) > 0) {
        return `${Math.round(Number(log.sessionLengthSeconds))} sec`;
    }

    return log.averageReactionTimeMs ? `${Math.round(Number(log.averageReactionTimeMs))} ms avg` : '--';
}

function formatSessionDuration(log) {
    return Number(log.sessionLengthSeconds || 0) > 0
        ? `${Math.round(Number(log.sessionLengthSeconds))} sec`
        : '--';
}

function formatAverageTimePerQuestion(log) {
    const averageTime = Number(log.averageTimePerQuestion || 0);
    if (averageTime > 0) {
        return `${averageTime} sec/question`;
    }

    const averageReactionTimeMs = Number(log.averageReactionTimeMs || 0);
    return averageReactionTimeMs > 0
        ? `${Math.round(averageReactionTimeMs / 100) / 10} sec/question`
        : '--';
}

function formatHints(log) {
    return `Hints: ${Number(log.hintUsageCount || 0)}`;
}

function formatMistakes(log) {
    return `Corrections: ${Number(log.mistakeCount || 0)}`;
}

function formatSessionLevel(log) {
    const level = Number(log.highestLevelReached);
    return Number.isFinite(level) && level > 0 ? String(level) : '--';
}

function formatSessionLevelContext(log) {
    if (getDashboardViewType(log) === DASHBOARD_VIEW_TYPES.SUMMARY_WITH_CORRECTIONS) {
        const levelDisplayLabel = String(log.levelDisplayLabel || '').trim();
        const levelLabel = String(log.levelLabel || '').trim();
        const skillLabel = String(log.skillLabel || '').trim();

        if (levelDisplayLabel) return levelDisplayLabel;

        if (levelLabel && skillLabel) {
            return `${levelLabel} (${skillLabel})`;
        }

        if (levelLabel) return levelLabel;
    }

    const level = formatSessionLevel(log);
    return level === '--' ? '--' : `Level ${level}`;
}

export function getDashboardViewType(log = {}) {
    const game = getGameById(log.gameId);
    return game?.dashboardViewType || DASHBOARD_VIEW_TYPES.TRIAL_BREAKDOWN;
}

export function renderNumberBridgeCorrectionReview(log = {}) {
    const correctionRows = (log.trials || [])
        .filter(trial => trial.isCorrect === false || trial.correct === false)
        .map(trial => {
            const question = Number.isFinite(Number(trial.operandA)) && Number.isFinite(Number(trial.operandB))
                ? `${trial.operandA} ${trial.operation || '+'} ${trial.operandB}`
                : (trial.question || trial.prompt || 'Question');

            return `
                <li class="rounded-xl border border-amber-800 bg-slate-900 px-3 py-2">
                    <div class="font-black text-slate-100">${question}</div>
                    <div class="text-amber-300">Attempted: ${trial.learnerAnswer ?? trial.selectedAnswer ?? '--'}</div>
                    <div class="text-emerald-300">Correct: ${trial.expectedAnswer ?? trial.correctAnswer ?? '--'}</div>
                </li>
            `;
        })
        .join('');

    if (!correctionRows) {
        return `
            <div data-testid="parent-number-bridges-corrections" class="mt-3 rounded-xl border border-emerald-900 bg-slate-900 px-3 py-2 text-sm font-bold text-emerald-300">
                No corrections needed.
            </div>
        `;
    }

    return `
        <div data-testid="parent-number-bridges-corrections" class="mt-3">
            <h5 class="text-xs font-black uppercase tracking-wide text-amber-300">Review Corrections</h5>
            <ul class="mt-2 space-y-2 text-xs text-slate-300">
                ${correctionRows}
            </ul>
        </div>
    `;
}

export function renderParentSessionDetails(log = {}) {
    const usesSummaryWithCorrections =
        getDashboardViewType(log) === DASHBOARD_VIEW_TYPES.SUMMARY_WITH_CORRECTIONS;

    if (usesSummaryWithCorrections) {
        return `
            <div data-testid="parent-number-bridges-summary" class="mt-3 rounded-xl border border-slate-800 bg-slate-900 p-3 text-xs text-slate-400">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    <span><span class="text-slate-500">Average Time:</span> ${formatAverageTimePerQuestion(log)}</span>
                    <span><span class="text-slate-500">Question Order:</span> ${formatNumberBridgeQuestionOrder(log)}</span>
                    <span><span class="text-slate-500">${formatHints(log)}</span></span>
                    <span><span class="text-slate-500">${formatMistakes(log)}</span></span>
                </div>
                ${renderNumberBridgeCorrectionReview(log)}
            </div>
        `;
    }

    const trialRows = (log.trials || []).map((trial, idx) => `
        <tr class="border-t border-slate-800">
            <td class="p-2">${idx + 1}</td>
            <td class="p-2">${trial.stage || '--'}</td>
            <td class="p-2 ${(trial.correct === true || trial.isCorrect === true) ? 'text-emerald-400' : 'text-amber-400'}">
                ${(trial.correct === true || trial.isCorrect === true) ? 'âœ“' : 'âœ—'}
            </td>
            <td class="p-2">${trial.reactionTimeMs || '--'} ms</td>
        </tr>
    `).join('');

    return `
        <div class="mt-3 text-xs text-slate-500">
            Trial-level details remain available for troubleshooting and progress review.
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
    `;
}

export function renderParentSessionRow(log = {}) {
    const usesSummaryWithCorrections =
        getDashboardViewType(log) === DASHBOARD_VIEW_TYPES.SUMMARY_WITH_CORRECTIONS;

    return `
        <details class="bg-slate-950 border border-slate-800 rounded-xl p-3" data-testid="parent-session-row" ${usesSummaryWithCorrections ? 'open' : ''}>
            <summary class="cursor-pointer text-slate-200 font-semibold">
                <span class="block text-sm text-slate-100">${formatGameName(log.gameId)}</span>
                <span class="mt-1 block text-xs font-black text-emerald-300">${formatSessionLevelContext(log)}</span>
                <span class="mt-2 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2 text-xs font-medium text-slate-400">
                    <span><span class="text-slate-500">When:</span> ${formatDate(log.timestamp)}</span>
                    <span><span class="text-slate-500">Level:</span> ${formatSessionLevelContext(log)}</span>
                    <span><span class="text-slate-500">Score:</span> ${formatScore(log)}</span>
                    <span><span class="text-slate-500">Accuracy:</span> ${formatAccuracy(log)}</span>
                    <span><span class="text-slate-500">Duration:</span> ${formatSessionDuration(log)}</span>
                    <span><span class="text-slate-500">${formatHints(log)}</span> / <span class="text-slate-500">${formatMistakes(log)}</span></span>
                </span>
            </summary>

            ${renderParentSessionDetails(log)}
        </details>
    `;
}

function clampRatio(value) {
    if (!Number.isFinite(value)) return 0;
    return Math.min(1, Math.max(0, value));
}

function clampInteger(value, min, max, fallback) {
    const numericValue = parseInt(value, 10);
    if (!Number.isFinite(numericValue)) return fallback;
    return Math.min(max, Math.max(min, numericValue));
}

function formatDate(timestamp) {
    if (!timestamp) return '--';

    return new Date(timestamp).toLocaleString();
}

export async function renderParentProgressReport() {
    const container = document.getElementById('parent-report-view');
    if (!container) return;

    const numberBridgeConfig = await getGameConfiguration(GAME_IDS.KUMON_QUIZ);
    const activeConfiguration = renderNumberBridgeActiveConfiguration(numberBridgeConfig);
    const logs = await getScoreLogs(null, 50);

    if (!logs.length) {
        container.innerHTML = `
            ${activeConfiguration}
            <div class="text-slate-400 text-sm">No student performance records yet.</div>
            ${renderFutureDashboardPlaceholders()}
        `;
        return;
    }

    const totalSessions = logs.length;

    const avgAccuracy =
        logs.reduce((sum, log) => sum + getAccuracyRatio(log), 0) / totalSessions;

    const avgReactionTime =
        logs.reduce((sum, log) => sum + Number(log.averageReactionTimeMs || 0), 0) / totalSessions;

    const highestLevel = Math.max(
        ...logs.map(log => Number(log.highestLevelReached || 1))
    );

    const bestScore = Math.max(
        ...logs.map(log => Number(log.score || 0))
    );

    const recentRows = logs.slice(0, 5).map(renderParentSessionRow).join('');

    container.innerHTML = `
    ${activeConfiguration}
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
            Recent Learning Sessions
        </h4>

        <div class="space-y-3">
            ${recentRows}
        </div>
    </div>

    ${renderFutureDashboardPlaceholders()}
`;
}

function renderFutureDashboardPlaceholders() {
    return `
        <div class="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div class="p-3 bg-slate-950 border border-dashed border-slate-700 rounded-xl">
                <div class="text-xs text-slate-500 uppercase tracking-wide">Future: Cognitive Snapshot</div>
                <div class="mt-1 text-sm text-slate-400">Reserved for NB-PARENT-001.1.</div>
            </div>

            <div class="p-3 bg-slate-950 border border-dashed border-slate-700 rounded-xl">
                <div class="text-xs text-slate-500 uppercase tracking-wide">Future: Learning Signals</div>
                <div class="mt-1 text-sm text-slate-400">Reserved for NB-PARENT-001.2.</div>
            </div>
        </div>
    `;
}

export function renderDeveloperTools() {

    const container =
        document.getElementById('developer-tools-panel');

    if (!container) return;

    const launchButtons = getRegisteredGames().map(game => `
        <button
            data-game="${game.id}"
            class="btn-launch-game w-full bg-emerald-700 hover:bg-emerald-600 px-3 py-2 rounded-lg text-sm font-semibold text-white">
            Test ${game.title}
        </button>
    `).join('');

    container.innerHTML = `
        <div class="space-y-2">
            ${launchButtons}
        </div>

        <hr class="border-slate-800 my-4">

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

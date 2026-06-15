// games/matrixReasoning/games.js
import { GameSession } from '../../js/gameSession.js';
import { calculateMetrics } from '../../js/analytics.js';
import { evaluateNextLevel } from '../../js/adaptiveEngine.js';
import { GAME_EVENTS } from '../../js/constants.js';
import { generateStageProblem } from './stages/stageFactory.js';
import { getStageMetadata } from './stages/stageMetadata.js';
import { resolveForcedStageOverride } from './stages/forcedStageOverride.js';
import { getOptionButtonClassList } from './stages/visualOptionStyles.js';

const ACTIVITY_HOME_EVENT = 'SIRAASH_ACTIVITY_HOME';

// 1. Engine Core State Tracking
let gameState = {
    currentStage: 1,
    trialBlock: [],
    currentTrialIndex: 0,
    currentProblem: null,
    trialStartTime: 0,

    parentCeiling: 5,
    parentTimeLimit: 45,
    //For testing purposes, we can set this lower, but the default should be 10 as per the constants file
    trialsPerBlock: 5,
    forcedStageOverride: 0,
    isTestSession: false,

    session: null
};

let audioContext = null;
function getAudioContext() {
    if (audioContext) return audioContext;
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    return audioContext;
}

function playTone(frequency, type = 'triangle', duration = 0.35, delay = 0) {
    const ctx = getAudioContext();
    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.12, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.05);
}

function playWinSound() {
    const root = 330;
    const majorThird = root * 1.26;
    const perfectFifth = root * 1.5;

    playTone(root, 'triangle', 0.35, 0);
    playTone(majorThird, 'triangle', 0.35, 0.05);
    playTone(perfectFifth, 'triangle', 0.35, 0.1);
}

function playErrorTone() {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.04);
    gain.gain.linearRampToValueAtTime(0.005, now + 0.3);

    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.35);
}

function navigateHome() {
    window.parent.postMessage({
        type: ACTIVITY_HOME_EVENT,
        payload: { gameId: 'matrixReasoning' }
    }, '*');
}

const SHAPE_TEMPLATES = {
    circle: `<svg viewBox="0 0 100 100" class="w-12 h-12 inline-block"><circle cx="50" cy="50" r="40" stroke="currentColor" stroke-width="8" fill="none"/></svg>`,
    square: `<svg viewBox="0 0 100 100" class="w-12 h-12 inline-block"><rect x="15" y="15" width="70" height="70" stroke="currentColor" stroke-width="8" fill="none"/></svg>`,
    triangle: `<svg viewBox="0 0 100 100" class="w-12 h-12 inline-block"><polygon points="50,15 85,85 15,85" stroke="currentColor" stroke-width="8" fill="none"/></svg>`,
    star: `<svg viewBox="0 0 100 100" class="w-12 h-12 inline-block"><polygon points="50,5 64,36 98,36 70,57 81,91 50,70 19,91 30,57 2,36 36,36" stroke="currentColor" stroke-width="8" fill="none"/></svg>`
};

const COLOR_MAP = {
    red: 'text-red-600', blue: 'text-blue-600', green: 'text-emerald-600', yellow: 'text-amber-500', black: 'text-black'
};

window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'INITIALIZE_GAME_RULES') {
        const rules = event.data.payload || {};
        gameState.parentCeiling = rules.maxDifficultyCeiling || 5;
        gameState.parentTimeLimit = rules.timeLimitSeconds || 45;
        gameState.trialsPerBlock = rules.trialsPerBlock || 10;
        gameState.forcedStageOverride = resolveForcedStageOverride(rules, event.data.isTestSession);
        gameState.isTestSession = Boolean(event.data.isTestSession);
        gameState.currentStage = gameState.forcedStageOverride || 1;

        gameState.session = new GameSession({
            gameId: 'matrixReasoning',
            startingLevel: gameState.currentStage,
            maxLevel: Math.max(gameState.parentCeiling, gameState.currentStage)
        });

        resetBlock();
        generateProblem();
    }
});

function resetBlock() {
    gameState.trialBlock = [];
    gameState.currentTrialIndex = 0;
}

function generateProblem() {
    const stage = gameState.currentStage;

const panel = document.getElementById('decoder-panel');
if (panel) {
    panel.innerHTML = '';
    panel.className =
        "w-full lg:w-96 lg:shrink-0 bg-slate-950 border border-slate-800 rounded-2xl p-3 sm:p-4 flex flex-col hidden min-h-0 max-h-full overflow-y-auto";
}

    const problem = generateStageProblem(stage, { generateNumericOptions });
    if (!problem) {
        console.warn(`Unable to generate Matrix Reasoning problem for stage ${stage}`);
        return;
    }

    gameState.currentProblem = problem;
    renderMatrixUI();
    gameState.trialStartTime = Date.now();
}

function generateNumericOptions(correct) {
    let choices = new Set([correct]);
    while (choices.size < 4) {
        let variance = (Math.floor(Math.random() * 5) + 1) * (Math.random() > 0.5 ? 1 : -1);
        if (correct + variance >= 0) choices.add(correct + variance);
    }
    return Array.from(choices).sort((a, b) => a - b).map(val => ({ type: 'number', value: val }));
}

function renderMatrixUI() {
    const gridEl = document.getElementById('matrix-grid');
    const dockEl = document.getElementById('options-dock');
    const problem = gameState.currentProblem;

    if (!problem) return;

    const stageMetadata = getStageMetadata(gameState.currentStage);
    const gridColumns = stageMetadata?.gridColumns || 2;
    const cellSizeClass = stageMetadata?.cellSizeClass || 'w-20 h-20';

    gridEl.className = `grid grid-cols-${gridColumns} gap-0 bg-white p-3 rounded-xl border-4 border-black shadow-2xl shrink-0 transition-transform duration-200`;

    gridEl.innerHTML = '';
    problem.cells.forEach(cell => {
         const cellBox = document.createElement('div');

cellBox.className = `${cellSizeClass} border-2 border-black flex items-center justify-center text-xl font-black bg-white select-none`;
        
        if (cell === '?') {
            cellBox.innerHTML = `<span class="text-indigo-600 font-extrabold text-2xl animate-pulse">?</span>`;
            cellBox.className += " bg-slate-50";
        } else if (typeof cell === 'object') { 
            cellBox.innerHTML = getShapeSvg(cell.shape);
            cellBox.className += ` ${COLOR_MAP[cell.color]}`;
        } else if (SHAPE_TEMPLATES[cell]) { 
            cellBox.innerHTML = getShapeSvg(cell);
            cellBox.className += ` text-black`;
        } else { 
            cellBox.innerText = cell;
            cellBox.className += ` text-black`;
        }
        gridEl.appendChild(cellBox);
    });

    dockEl.innerHTML = '';
    const isVisualStage = Boolean(stageMetadata?.isVisual);

    problem.options.forEach(opt => {
        const button = document.createElement('button');
        button.className = getOptionButtonClassList(isVisualStage);

        if (opt.type === 'shape') {
            button.innerHTML = getShapeSvg(opt.value);
            button.className += ` ${COLOR_MAP[opt.color]}`;
        } else {
            button.innerText = opt.value;
        }

        button.addEventListener('click', () => {
            if (isVisualStage) {
                button.classList.add('ring-2', 'ring-indigo-500', 'bg-slate-200');
            } else {
                button.classList.add('ring-2', 'ring-indigo-500');
            }
            processUserSelection(opt);
        });

        dockEl.appendChild(button);
    });

    document.getElementById('ui-stage').innerText = gameState.currentStage;
    document.getElementById('ui-stage-name').innerText = stageMetadata?.displayName || '';
    document.getElementById('ui-trial').innerText = `${gameState.currentTrialIndex + 1}/${gameState.trialsPerBlock}`;
    document.getElementById('ui-streak').innerText = gameState.trialBlock.filter(t => t.correct).length;
}

function showLinearDecoder(isCorrect, completedProblem) {
    const panel = document.getElementById('decoder-panel');
    if (!panel || !completedProblem) return;

    const { rule, cells, correctAnswer } = completedProblem;

    const tone = isCorrect ? {
        emoji: '🌟',
        title: 'Great Thinking!',
        subtitle: 'You found the pattern.',
        badgeClass: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30',
        cardClass: 'bg-emerald-950/20 border-emerald-500/25'
    } : {
        emoji: '🧩',
        title: 'Good Try!',
        subtitle: 'Let’s learn the clue together.',
        badgeClass: 'bg-amber-500/10 text-amber-300 border border-amber-500/30',
        cardClass: 'bg-amber-950/20 border-amber-500/25'
    };

    panel.className =
    "w-full lg:w-96 lg:shrink-0 bg-slate-950 border border-slate-800 rounded-2xl p-3 sm:p-4 flex flex-col min-h-0 max-h-full overflow-y-auto animate-fadeIn";
    let explanationHTML = `
        <div class="flex flex-col text-center space-y-2">

            <div class="text-3xl">${tone.emoji}</div>
            <div>
                <div class="inline-flex px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wide ${tone.badgeClass}">
                    ${tone.title}
                </div>

                <p class="mt-2 text-xs text-slate-300 font-semibold leading-relaxed">
                    ${tone.subtitle}
                </p>
            </div>
    `;

    if (rule.type === 'linear') {
        const stepLabel = rule.step >= 0 ? `+${rule.step}` : `${rule.step}`;
        const changeText = rule.step >= 0 ? `Add ${rule.step}` : `Minus ${Math.abs(rule.step)}`;

        if (rule.orientation === 'horizontal') {
    explanationHTML += `
        <div class="rounded-2xl border ${tone.cardClass} p-3 space-y-2">

            <div class="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-bold">
                Pattern Detective
            </div>

            <div class="text-xs text-slate-400 font-semibold">
                Look across the rows
            </div>

            <div class="flex items-center justify-center gap-3">
                <div class="flex items-center gap-2">
                    ${miniNumberBox(cells[0])}
                    ${arrowRight()}
                    ${miniNumberBox(cells[1])}
                </div>

                <div class="text-slate-600 font-bold">|</div>

                <div class="flex items-center gap-2">
                    ${miniNumberBox(cells[2])}
                    ${arrowRight()}
                    ${miniAnswerBox(correctAnswer)}
                </div>
            </div>

            <div class="inline-flex px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs text-indigo-300 font-bold">
                Same clue: ${changeText}
            </div>
        </div>
    `;
} else {
     explanationHTML += `
    <div class="rounded-2xl border ${tone.cardClass} p-3 space-y-2">

        <div class="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-bold">
            Pattern Detective
        </div>

        <div class="text-xs text-slate-400 font-semibold">
            Look down the columns
        </div>

        <div class="flex items-center justify-center gap-3">
            <div class="flex items-center gap-2">
                ${miniNumberBox(cells[0])}
                ${arrowDown()}
                ${miniNumberBox(cells[2])}
            </div>

            <div class="text-slate-600 font-bold">|</div>

            <div class="flex items-center gap-2">
                ${miniNumberBox(cells[1])}
                ${arrowDown()}
                ${miniAnswerBox(correctAnswer)}
            </div>
        </div>

        <div class="inline-flex px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs text-indigo-300 font-bold">
            Same clue: ${changeText}
        </div>
    </div>
`;
        }
    } else if (rule.type === 'nonlinear') {
        if (rule.pattern === 'skip') {
            explanationHTML += `
                <div class="rounded-2xl border ${tone.cardClass} p-3 space-y-2">
                    <div class="text-[11px] uppercase tracking-[0.2em] text-slate-400 font-bold">
                        Number Jump
                    </div>

                    <div class="flex items-center justify-center gap-2">
                        ${miniNumberBox(cells[0])}
                        ${arrowRight()}
                        ${miniNumberBox(cells[1])}
                        ${arrowRight()}
                        ${miniNumberBox(cells[2])}
                        ${arrowRight()}
                        ${miniAnswerBox(correctAnswer)}
                    </div>

                    <div class="text-sm text-slate-300 leading-relaxed">
                        Each number jumps by 
                        <span class="text-indigo-300 font-extrabold">+${rule.step}</span>.
                    </div>
                </div>
            `;
        } else {
            explanationHTML += `
                <div class="rounded-2xl border ${tone.cardClass} p-3 space-y-2">
                    <div class="text-[11px] uppercase tracking-[0.2em] text-slate-400 font-bold">
                        Copy Match
                    </div>

                    <div class="space-y-3">
                        <div class="flex items-center justify-center gap-2">
                            ${miniNumberBox(cells[0])}
                            <span class="text-slate-500 font-black">=</span>
                            ${miniNumberBox(cells[1])}
                        </div>

                        <div class="text-xs text-slate-400">So the bottom row copies too.</div>

                        <div class="flex items-center justify-center gap-2">
                            ${miniNumberBox(cells[2])}
                            ${arrowRight()}
                            ${miniAnswerBox(correctAnswer)}
                        </div>
                    </div>
                </div>
            `;
        }
    } else {
        explanationHTML += `
            <div class="rounded-2xl border ${tone.cardClass} p-3 space-y-2">
                <div class="text-[11px] uppercase tracking-[0.2em] text-slate-400 font-bold">
                    Pattern Clue
                </div>

                <div class="text-sm text-slate-300 leading-relaxed">
                    ${rule.description || 'Look carefully. The same pattern is repeated.'}
                </div>
            </div>
        `;
    }

    explanationHTML += `
        </div>

        <button 
            id="next-trial-btn" 
            class="mt-3 min-h-[44px] w-full py-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-xl text-xs font-extrabold transition shadow-lg shrink-0 tracking-wide">
            Next Puzzle ➔
        </button>
    `;

    panel.innerHTML = explanationHTML;

    const nextButton = document.getElementById('next-trial-btn');
    if (nextButton) {
        nextButton.addEventListener('click', advanceNextTrial);
    }
}

function miniNumberBox(value) {
    return `
        <span class="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 inline-flex items-center justify-center text-white text-sm font-black shadow-sm">
            ${value}
        </span>
    `;
}

function miniAnswerBox(value) {
    return `
        <span class="w-8 h-8 rounded-lg bg-indigo-600/20 border-2 border-dashed border-indigo-400 inline-flex items-center justify-center text-indigo-200 text-sm font-black shadow-sm">
            ${value}
        </span>
    `;
}

function arrowRight() {
    return `<span class="text-indigo-300 text-lg font-black">→</span>`;
}

function arrowDown() {
    return `<span class="text-indigo-300 text-lg font-black leading-none">↓</span>`;
}

function advanceNextTrial() {
    if (gameState.currentTrialIndex < gameState.trialsPerBlock) {
        generateProblem();
    } else {
        evaluateAdaptiveBlockTransition();
    }
}

function processUserSelection(selectedOption) {
    const panel = document.getElementById('decoder-panel');
    if (panel && !panel.classList.contains('hidden')) return;

    const latency = (Date.now() - gameState.trialStartTime) / 1000; 
    const activeProblem = gameState.currentProblem; 
    const target = activeProblem.correctAnswer;
    
    let isCorrect = false;
    if (typeof target === 'object') {
        isCorrect = (selectedOption.value === target.shape && selectedOption.color === target.color);
    } else {
        isCorrect = (selectedOption.value === target);
    }

    const buttons = document.querySelectorAll('#options-dock button');
    buttons.forEach(btn => btn.disabled = true);

 const gridEl = document.getElementById('matrix-grid');
const questionCell = gridEl.lastElementChild;

if (questionCell) {
    if (isCorrect) {
        renderAnswerIntoCell(questionCell, selectedOption);
        questionCell.className += " ring-4 ring-emerald-500 bg-emerald-50/10";
    } else {
        questionCell.innerHTML = `<span class="text-indigo-600 font-extrabold text-2xl animate-pulse">?</span>`;
        questionCell.className += " ring-4 ring-amber-400 bg-amber-50/10";

        setTimeout(() => {
            renderCorrectAnswerIntoCell(questionCell, activeProblem.correctAnswer);
            questionCell.className += " ring-4 ring-emerald-500 bg-emerald-50/10";
        }, 1800);
    }
}

    if (isCorrect) {
        playWinSound();
    } else {
        playErrorTone();
    }

    gameState.trialBlock.push({ correct: isCorrect, time: latency });
    if (gameState.session) {
    gameState.session.recordTrial({
        correct: isCorrect,
        reactionTimeMs: Math.round(latency * 1000),
        stage: gameState.currentStage
    });
}
    gameState.currentTrialIndex++;

   if (isCorrect) {
    showLinearDecoder(isCorrect, activeProblem);
} else {
    setTimeout(() => {
        showLinearDecoder(isCorrect, activeProblem);
    }, 1900);
}
}

function renderAnswerIntoCell(cellEl, option) {
    cellEl.innerHTML = '';

    if (option.type === 'shape') {
        cellEl.innerHTML = SHAPE_TEMPLATES[option.value];
        cellEl.className = cleanColorClasses(cellEl.className);
        cellEl.className += ` ${COLOR_MAP[option.color]}`;
    } else {
        cellEl.innerText = option.value;
    }
}

function renderCorrectAnswerIntoCell(cellEl, correctAnswer) {
    cellEl.innerHTML = '';

    if (typeof correctAnswer === 'object') {
        cellEl.innerHTML = SHAPE_TEMPLATES[correctAnswer.shape];
        cellEl.className = cleanColorClasses(cellEl.className);
        cellEl.className += ` ${COLOR_MAP[correctAnswer.color]}`;
    } else {
        cellEl.innerText = correctAnswer;
    }
}

function cleanColorClasses(className) {
    return className
        .replace(/text-red-600/g, '')
        .replace(/text-blue-600/g, '')
        .replace(/text-emerald-600/g, '')
        .replace(/text-amber-500/g, '')
        .replace(/text-black/g, '');
}

function evaluateAdaptiveBlockTransition() {
    const metrics = calculateMetrics(
        gameState.trialBlock.map(t => ({
            correct: t.correct,
            reactionTimeMs: Math.round((t.time || 0) * 1000)
        }))
    );

    if (gameState.isTestSession && gameState.forcedStageOverride) {
        if (gameState.session) {
            gameState.session.updateLevel(gameState.currentStage);
        }

        const sessionData = gameState.session
            ? gameState.session.end()
            : {
                highestLevelReached: gameState.currentStage,
                sessionLengthSeconds: 0
            };

        window.parent.postMessage({
            type: GAME_EVENTS.COMPLETE,
            payload: {
                gameId: 'matrixReasoning',
                trials: sessionData.trials,
                highestLevelReached: sessionData.highestLevelReached,
                sessionLengthSeconds: sessionData.sessionLengthSeconds
            }
        }, '*');

        return;
    }

    const transition = evaluateNextLevel({
        currentLevel: gameState.currentStage,
        maxLevel: gameState.parentCeiling,
        accuracy: metrics.accuracy,
        averageReactionTimeMs: metrics.averageReactionTimeMs
    });

    if (gameState.session) {
        gameState.session.updateLevel(transition.nextLevel);
    }

    const sessionData = gameState.session
        ? gameState.session.end()
        : {
            highestLevelReached: Math.max(gameState.currentStage, transition.nextLevel),
            sessionLengthSeconds: 0
        };
console.log('SESSION DATA', sessionData);
console.log('SESSION TRIALS', sessionData.trials);
console.log('PAYLOAD SENT', {
    gameId: 'matrixReasoning',
    trials: sessionData.trials
});
    window.parent.postMessage({
        type: GAME_EVENTS.COMPLETE,
        payload: {
            gameId: 'matrixReasoning',
            score: metrics.correctCount * 200,
            accuracy: metrics.accuracy,
            averageReactionTimeMs: metrics.averageReactionTimeMs,
            highestLevelReached: sessionData.highestLevelReached,
            sessionLengthSeconds: sessionData.sessionLengthSeconds,
            trials: sessionData.trials || []
        }
    }, '*');
    

    gameState.currentStage = transition.nextLevel;
    resetBlock();
    generateProblem();
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('home-button')?.addEventListener('click', navigateHome);

    const gridEl = document.getElementById('matrix-grid');
    if (gridEl && !gameState.currentProblem) {
        gridEl.innerHTML = `<div class="text-slate-400 text-xs p-4 animate-pulse">Waiting for Master Module Configuration...</div>`;
    }
});

function getShapeSvg(shape) {
    const sizeClass = getStageMetadata(gameState.currentStage)?.gridColumns === 3 ? "w-10 h-10" : "w-12 h-12";
    return SHAPE_TEMPLATES[shape].replace("w-12 h-12", sizeClass);
}

window.testMatrixStage = (stage) => {
    if (stage < 1 || stage > 5) {
        console.warn('Stage must be between 1 and 5');
        return;
    }

    gameState.currentStage = stage;
    resetBlock();
    generateProblem();

    console.log(
        `Loaded Matrix Reasoning Stage ${stage}`,
        gameState.currentProblem
    );
};

window.testGenerate = () => {
    generateProblem();
    console.log(gameState.currentProblem);
};

window.getMatrixState = () => gameState;

//const gf = document.getElementById('game-frame').contentWindow;
//gf.testMatrixStage(4);

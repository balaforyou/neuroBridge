import { calculateMetrics } from '../../js/analytics.js';
import { GAME_EVENTS } from '../../js/constants.js';
import { GameSession } from '../../js/gameSession.js';
import {
    ATTRIBUTE_EXPLORER_GAME_ID,
    COLOR_CLASS_MAP,
    DEFAULT_UI_SUPPORT_LEVEL,
    SIZE_CLASS_MAP,
    shouldShowScaffoldLabels
} from './config.js';
import { generateAttributeQuestion } from './questionGenerator.js';
import {
    createDefaultScaffold,
    createSessionId,
    createTrialId,
    createTrialResult
} from '../../js/trialResult.js';
import {
    HELP_NUDGE_ACTIVE_CLASS,
    HELP_NUDGE_DELAY_MS,
    createHelpNudgeController,
    getDelayedHelpPrompt,
    getInitialHelpPrompt
} from './helpNudge.js';

const ACTIVITY_HOME_EVENT = 'SIRAASH_ACTIVITY_HOME';

const SHAPE_TEMPLATES = {
    circle: `<svg viewBox="0 0 100 100" class="attribute-shape"><circle cx="50" cy="50" r="38" stroke="currentColor" stroke-width="10" fill="currentColor" fill-opacity="0.18"/></svg>`,
    square: `<svg viewBox="0 0 100 100" class="attribute-shape"><rect x="16" y="16" width="68" height="68" rx="8" stroke="currentColor" stroke-width="10" fill="currentColor" fill-opacity="0.18"/></svg>`,
    triangle: `<svg viewBox="0 0 100 100" class="attribute-shape"><polygon points="50,12 88,84 12,84" stroke="currentColor" stroke-width="10" fill="currentColor" fill-opacity="0.18" stroke-linejoin="round"/></svg>`,
    star: `<svg viewBox="0 0 100 100" class="attribute-shape"><polygon points="50,8 62,36 92,36 68,55 78,86 50,68 22,86 32,55 8,36 38,36" stroke="currentColor" stroke-width="8" fill="currentColor" fill-opacity="0.18" stroke-linejoin="round"/></svg>`
};

let audioContext = null;
const helpNudgeController = createHelpNudgeController({
    delayMs: HELP_NUDGE_DELAY_MS,
    onActivate: activateHelpNudge
});

const gameState = {
    sessionId: createSessionId(ATTRIBUTE_EXPLORER_GAME_ID),
    currentProblem: null,
    currentTrialId: null,
    currentScaffold: createDefaultScaffold(),
    currentAttempts: 0,
    currentTrialIndex: 0,
    trialsPerBlock: 5,
    trialBlock: [],
    trialResults: [],
    trialStartTime: 0,
    uiSupportLevel: DEFAULT_UI_SUPPORT_LEVEL,
    isTestSession: false,
    learnerName: 'Learner',
    session: null,
    hasAnsweredCurrentTrial: false
};

window.addEventListener('message', event => {
    if (event.data?.type !== GAME_EVENTS.INIT) return;

    const rules = event.data.payload || {};
    gameState.trialsPerBlock = rules.trialsPerBlock || 5;
    gameState.uiSupportLevel = normalizeSupportLevel(rules.uiSupportLevel);
    gameState.isTestSession = Boolean(event.data.isTestSession);
    gameState.learnerName = normalizeLearnerName(event.data.learnerName);
    gameState.sessionId = createSessionId(ATTRIBUTE_EXPLORER_GAME_ID);
    gameState.currentTrialIndex = 0;
    gameState.trialBlock = [];
    gameState.trialResults = [];
    gameState.session = new GameSession({
        gameId: ATTRIBUTE_EXPLORER_GAME_ID,
        startingLevel: 1,
        maxLevel: 1
    });

    generateProblem();
});

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.answer-button').forEach(button => {
        button.addEventListener('click', () => processSelection(button.dataset.choice));
    });

    document.getElementById('hint-button')?.addEventListener('click', giveHint);
    document.getElementById('clue-control')?.addEventListener('click', giveHint);
    document.getElementById('home-button')?.addEventListener('click', navigateHome);

    if (!gameState.currentProblem) {
        generateProblem();
    }
});

function navigateHome() {
    window.parent.postMessage({
        type: ACTIVITY_HOME_EVENT,
        payload: {
            gameId: ATTRIBUTE_EXPLORER_GAME_ID
        }
    }, '*');
}

function generateProblem() {
    gameState.currentProblem = generateAttributeQuestion();
    gameState.currentTrialId = createTrialId(ATTRIBUTE_EXPLORER_GAME_ID);
    gameState.currentScaffold = createDefaultScaffold();
    gameState.currentAttempts = 0;
    renderProblem();
    gameState.trialStartTime = Date.now();
}

function renderProblem() {
    const problem = gameState.currentProblem;
    if (!problem) return;

    gameState.hasAnsweredCurrentTrial = false;
    stopHelpNudge();

    const promptEl = document.getElementById('attribute-prompt');
    const feedbackEl = document.getElementById('feedback-text');
    const celebrationEl = document.getElementById('celebration-burst');
    const itemA = document.getElementById('item-a');
    const itemB = document.getElementById('item-b');

    if (promptEl) {
        promptEl.innerText = getAttributePrompt(problem.rule.attribute);
        promptEl.className = getAttributePromptClass(problem.rule.attribute);
    }

    if (feedbackEl) {
        feedbackEl.innerText = '';
        feedbackEl.className = 'feedback-area text-center text-base sm:text-lg font-black text-amber-700 min-h-[24px]';
    }

    if (celebrationEl) {
        celebrationEl.classList.remove('celebrate-pop', 'text-emerald-600');
        celebrationEl.classList.add('opacity-0');
    }

    const hintButton = document.getElementById('hint-button');
    if (hintButton) {
        hintButton.disabled = false;
        hintButton.classList.remove('opacity-60');
    }

    const companionHelpEl = document.getElementById('clue-control');
    if (companionHelpEl) {
        companionHelpEl.innerText = getInitialHelpPrompt(getLearnerName());
        companionHelpEl.disabled = false;
        companionHelpEl.classList.remove('opacity-60');
    }

    renderItem(itemA, problem.cells[0], problem.rule.attribute);
    renderItem(itemB, problem.cells[1], problem.rule.attribute);

    document.querySelectorAll('.answer-button').forEach(button => {
        button.disabled = false;
        button.classList.remove('ring-8', 'ring-white', 'scale-95', 'opacity-70', 'brightness-110');
    });

    updateHeader();
    startHelpNudgeTimer();
}

function renderItem(container, item, targetAttribute) {
    if (!container || !item) return;

    container.innerHTML = SHAPE_TEMPLATES[item.shape];
    container.className = 'comparison-card relative rounded-2xl bg-white border-4 border-sky-300 shadow-sm flex items-center justify-center';

    const svg = container.querySelector('.attribute-shape');
    if (svg) {
        if (item.sizePx) {
            svg.style.setProperty('--attribute-shape-size', `${item.sizePx}px`);
            svg.classList.add('attribute-sized-shape');
        } else {
            svg.classList.add(...SIZE_CLASS_MAP[item.size].split(' '));
        }
        svg.classList.add(COLOR_CLASS_MAP[item.color]);
    }

    if (shouldShowCardLabels(targetAttribute)) {
        const label = document.createElement('span');
        label.className = 'absolute top-2 left-3 text-[11px] font-black text-sky-700 uppercase tracking-wide';
        label.innerText = item[targetAttribute];
        container.appendChild(label);
    }
}

function processSelection(choice) {
    const problem = gameState.currentProblem;
    if (!problem) return;

    gameState.hasAnsweredCurrentTrial = true;
    stopHelpNudge();

    const latency = Date.now() - gameState.trialStartTime;
    const isCorrect = choice === problem.correctAnswer;
    gameState.currentAttempts++;
    const selectedButton = document.querySelector(`[data-choice="${choice}"]`);
    const feedbackEl = document.getElementById('feedback-text');
    const celebrationEl = document.getElementById('celebration-burst');

    document.querySelectorAll('.answer-button').forEach(button => {
        button.disabled = true;
        if (button !== selectedButton) {
            button.classList.add('opacity-70');
        }
    });

    selectedButton?.classList.add('ring-8', 'ring-white', 'scale-95', 'brightness-110');
    const hintButton = document.getElementById('hint-button');
    if (hintButton) {
        hintButton.disabled = true;
        hintButton.classList.add('opacity-60');
    }

    const companionHelpEl = document.getElementById('clue-control');
    if (companionHelpEl) {
        companionHelpEl.innerText = getInitialHelpPrompt(getLearnerName());
        companionHelpEl.disabled = true;
        companionHelpEl.classList.add('opacity-60');
    }

    if (feedbackEl) {
        feedbackEl.innerText = isCorrect
            ? `Nice work, ${getLearnerName()} 😊`
            : `Let's look again together, ${getLearnerName()} 🌱`;
        feedbackEl.className = isCorrect
            ? 'feedback-area text-center text-xl sm:text-2xl font-black text-emerald-700 min-h-[24px]'
            : 'feedback-area text-center text-base sm:text-lg font-black text-amber-700 min-h-[24px]';
    }

    if (isCorrect && celebrationEl) {
        celebrationEl.classList.remove('opacity-0');
        celebrationEl.classList.add('text-emerald-600', 'celebrate-pop');
    }

    if (isCorrect) {
        playWinSound();
    } else {
        playErrorTone();
    }

    const trialResult = createTrialResult({
        gameId: ATTRIBUTE_EXPLORER_GAME_ID,
        learnerId: null,
        sessionId: gameState.sessionId,
        trialId: gameState.currentTrialId,
        taskType: 'same-different',
        stage: 1,
        difficultyLevel: 1,
        prompt: `Look at ${problem.rule.attribute}`,
        correctAnswer: problem.correctAnswer,
        selectedAnswer: choice,
        isCorrect,
        attempts: gameState.currentAttempts,
        reactionTimeMs: latency,
        scaffold: gameState.currentScaffold,
        attributes: {
            targetAttribute: problem.rule.attribute,
            relation: problem.rule.relation
        },
        metadata: {
            questionId: gameState.currentTrialId,
            ruleType: problem.rule.type,
            isTestSession: gameState.isTestSession,
            sizeDifficultyLevel: problem.metadata?.sizeDifficultyLevel ?? null
        }
    });

    gameState.trialBlock.push(trialResult);
    gameState.trialResults.push(trialResult);

    gameState.currentTrialIndex++;
    updateHeader();

    setTimeout(() => {
        if (gameState.currentTrialIndex >= gameState.trialsPerBlock) {
            completeGame();
        } else {
            generateProblem();
        }
    }, isCorrect ? 850 : 1400);
}

function giveHint() {
    const problem = gameState.currentProblem;
    if (!problem) return;

    stopHelpNudge();

    gameState.currentScaffold = {
        used: true,
        level: 1,
        type: 'attention-cue',
        trigger: 'parent'
    };

    const feedbackEl = document.getElementById('feedback-text');
    if (feedbackEl) {
        feedbackEl.innerText = `SIRAASH has a clue for you, ${getLearnerName()} 🌱 Look only at ${problem.rule.attribute}.`;
        feedbackEl.className = 'feedback-area text-center text-base sm:text-lg font-black text-amber-700 min-h-[24px]';
    }

    const companionHelpEl = document.getElementById('clue-control');
    if (companionHelpEl) {
        companionHelpEl.innerText = `SIRAASH has a clue for you, ${getLearnerName()} 🌱`;
        companionHelpEl.disabled = true;
        companionHelpEl.classList.add('opacity-60');
    }

    renderCurrentItems();

    const hintButton = document.getElementById('hint-button');
    if (hintButton) {
        hintButton.disabled = true;
        hintButton.classList.add('opacity-60');
    }
}

function startHelpNudgeTimer() {
    stopHelpNudge();

    helpNudgeController.start(() => {
        const companionHelpEl = document.getElementById('clue-control');
        return Boolean(
            companionHelpEl &&
            !companionHelpEl.disabled &&
            !gameState.hasAnsweredCurrentTrial &&
            !gameState.currentScaffold.used
        );
    });
}

function activateHelpNudge() {
    const companionHelpEl = document.getElementById('clue-control');
    if (!companionHelpEl || companionHelpEl.disabled) return;

    companionHelpEl.innerText = getDelayedHelpPrompt(getLearnerName());
    companionHelpEl.classList.add(HELP_NUDGE_ACTIVE_CLASS);
}

function stopHelpNudge() {
    helpNudgeController.stop();

    const companionHelpEl = document.getElementById('clue-control');
    companionHelpEl?.classList.remove(HELP_NUDGE_ACTIVE_CLASS);
}

function updateHeader() {
    const trialEl = document.getElementById('ui-trial');
    const streakEl = document.getElementById('ui-streak');

    if (trialEl) {
        const visibleTrial = Math.min(gameState.currentTrialIndex + 1, gameState.trialsPerBlock);
        trialEl.innerText = `${visibleTrial}/${gameState.trialsPerBlock}`;
    }

    if (streakEl) {
        streakEl.innerText = gameState.trialBlock.filter(trial => trial.isCorrect).length;
    }
}

function completeGame() {
    const metrics = calculateMetrics(gameState.trialBlock);
    const sessionData = gameState.session
        ? gameState.session.end()
        : {
            highestLevelReached: 1,
            sessionLengthSeconds: 0,
            trials: []
        };

    window.parent.postMessage({
        type: GAME_EVENTS.COMPLETE,
        payload: {
            gameId: ATTRIBUTE_EXPLORER_GAME_ID,
            score: metrics.correctCount * 100,
            accuracy: metrics.accuracy,
            averageReactionTimeMs: metrics.averageReactionTimeMs,
            highestLevelReached: sessionData.highestLevelReached,
            sessionLengthSeconds: sessionData.sessionLengthSeconds,
            trials: gameState.trialResults
        }
    }, '*');
}

function getAudioContext() {
    if (audioContext) return audioContext;
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    return audioContext;
}

function playTone(frequency, type = 'triangle', duration = 0.25, delay = 0) {
    try {
        const ctx = getAudioContext();
        const now = ctx.currentTime + delay;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(frequency, now);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.1, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(gain).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + duration + 0.05);
    } catch (error) {
        // Audio can be blocked before user interaction; the game still works.
    }
}

function playWinSound() {
    playTone(392, 'triangle', 0.25, 0);
    playTone(523, 'triangle', 0.25, 0.06);
}

function playErrorTone() {
    playTone(220, 'sine', 0.3, 0);
}

function getAttributePrompt(attribute) {
    if (attribute === 'color') return '🎨 LOOK AT COLOR';
    if (attribute === 'shape') return '🔺 LOOK AT SHAPE';
    return '📏 LOOK AT SIZE';
}

function getAttributePromptClass(attribute) {
    const base = 'inline-flex items-center justify-center rounded-xl px-6 py-2.5 text-2xl sm:text-3xl font-black text-slate-950 shadow-sm border-4';

    if (attribute === 'color') {
        return `${base} bg-yellow-300 border-yellow-500`;
    }

    if (attribute === 'shape') {
        return `${base} bg-emerald-300 border-emerald-500`;
    }

    return `${base} bg-cyan-300 border-cyan-500`;
}

function normalizeSupportLevel(uiSupportLevel) {
    const level = Number(uiSupportLevel || DEFAULT_UI_SUPPORT_LEVEL);
    return level >= 1 && level <= 5 ? level : DEFAULT_UI_SUPPORT_LEVEL;
}

function normalizeLearnerName(learnerName) {
    const normalized = String(learnerName || '').trim();
    return normalized || 'Learner';
}

function getLearnerName() {
    return gameState.learnerName || 'Learner';
}

function shouldShowCardLabels(targetAttribute) {
    return Boolean(targetAttribute) && shouldShowScaffoldLabels(gameState.currentScaffold);
}

function renderCurrentItems() {
    const problem = gameState.currentProblem;
    if (!problem) return;

    renderItem(document.getElementById('item-a'), problem.cells[0], problem.rule.attribute);
    renderItem(document.getElementById('item-b'), problem.cells[1], problem.rule.attribute);
}

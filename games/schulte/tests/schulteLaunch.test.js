import { chromium } from 'playwright';
import { spawn } from 'node:child_process';

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

async function ensureStaticServer() {
    if (await isServerReady()) {
        return null;
    }

    const server = spawn(process.execPath, ['scripts/serve-static.cjs', '5501'], {
        cwd: process.cwd(),
        stdio: 'ignore',
        windowsHide: true
    });

    for (let attempt = 0; attempt < 20; attempt += 1) {
        if (await isServerReady()) {
            return server;
        }
        await new Promise(resolve => setTimeout(resolve, 250));
    }

    server.kill();
    throw new Error('Static server did not start for Schulte launch test');
}

async function isServerReady() {
    try {
        const response = await fetch('http://127.0.0.1:5501/games/schulte/index.html');
        return response.ok;
    } catch {
        return false;
    }
}

async function testAutomaticAscendingToDescendingFlow() {
    const server = await ensureStaticServer();
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1000, height: 800 } });
    await page.addInitScript(() => {
        window.__schulteListenFindSpeechRequests = [];
        window.__schulteAnalyticsPayloads = [];
        window.__schulteHomeMessages = [];
        const originalPostMessage = window.postMessage.bind(window);
        window.postMessage = (message, targetOrigin, transfer) => {
            if (message?.type === 'SIRAASH_ACTIVITY_HOME') {
                window.__schulteHomeMessages.push(message);
            }
            return originalPostMessage(message, targetOrigin, transfer);
        };
        class MockSpeechSynthesisUtterance {
            constructor(text) {
                this.text = text;
            }
        }
        window.addEventListener('message', event => {
            if (event.data?.type === 'GAME_OVER_SUBMIT_SCORE') {
                window.__schulteAnalyticsPayloads.push(event.data.payload);
            }
        });
        Object.defineProperty(window, 'SpeechSynthesisUtterance', {
            configurable: true,
            value: MockSpeechSynthesisUtterance
        });
        Object.defineProperty(window, 'speechSynthesis', {
            configurable: true,
            value: {
                cancel: () => {},
                speak: utterance => window.__schulteListenFindSpeechRequests.push(utterance.text)
            }
        });
    });

    try {
        await page.goto('http://127.0.0.1:5501/games/schulte/index.html');
        await page.getByTestId('schulte-activity').waitFor();

        assert(await page.title() === 'Schulte Table', 'Schulte page title should use learner-facing Schulte Table name');
        assert((await page.locator('h1').innerText()) === 'Schulte Table', 'Schulte shell header should show Schulte Table');
        assert((await page.getByTestId('schulte-activity').innerText()).includes('Schulte Table'), 'Activity header should show Schulte Table');
        assert(await page.getByTestId('schulte-mode-controls').count() === 0, 'Learner path should not show manual mode selector');
        assert(await page.getByTestId('schulte-mode-label').innerText() === 'Mode: Ascending', 'Flow should start in Ascending mode');
        assert(await page.getByTestId('schulte-board-counter').innerText() === 'Board 1 / 2', 'Header should show board context');
        assert(!(await page.getByTestId('schulte-activity').innerText()).includes('Find the numbers'), 'Header should not include a second Find instruction');
        await assertSingleFindPrompt(page, 'Find 1');
        assert((await getListenFindSpeechRequests(page)).length === 0, 'Ascending prompt should not trigger Listen & Find speech');

        const oneCell = page.locator('[data-schulte-number="1"]');
        const twoCell = page.locator('[data-schulte-number="2"]');
        await oneCell.click();
        await assertSingleFindPrompt(page, 'Find 2');
        assert(await oneCell.getAttribute('data-schulte-memory-mode') === 'true', 'Learner path should run memory mode');
        assert(await oneCell.isDisabled() === false, 'Memory mode selected cell should remain interactable-looking');
        assert(await oneCell.getAttribute('class') === await twoCell.getAttribute('class'), 'Memory mode selected cell should look identical to unselected cell');
        await oneCell.click();
        await assertSingleFindPrompt(page, 'Find 2');
        await twoCell.click();
        await assertSingleFindPrompt(page, 'Find 3');

        for (let board = 0; board < 2; board += 1) {
            const startValue = board === 0 ? 3 : 1;
            for (let value = startValue; value <= 9; value += 1) {
                await page.locator(`[data-schulte-number="${value}"]`).click();
            }

            if (board === 0) {
                assert(await page.getByTestId('schulte-board-counter').innerText() === 'Board 2 / 2', 'Board completion should advance header context');
                await assertSingleFindPrompt(page, 'Find 1');
                assert(await page.getByText('Next board').count() === 0, 'Board transition should not show generic Next board copy');
            }
        }

        assert(await page.getByTestId('schulte-completion').count() === 0, 'Final completion should not show after ascending only');
        await page.getByTestId('schulte-descending-transition').waitFor();
        assert(await page.getByTestId('schulte-target').count() === 0, 'Transition should not show a stale Find prompt');
        assert(
            (await page.getByTestId('schulte-descending-transition').innerText()).includes('Great work! Now let\'s try descending.'),
            'Transition should praise before descending'
        );
        assert(
            (await page.getByTestId('schulte-descending-transition').innerText()).includes('Start from 9 and go backwards.'),
            'Transition should explain descending start'
        );
        assert(await page.getByTestId('schulte-mode-label').innerText() === 'Mode: Ascending', 'Transition should appear before descending starts');

        await page.getByTestId('schulte-start-next-mode').click();
        assert(await page.getByTestId('schulte-mode-label').innerText() === 'Mode: Descending', 'Continue should move to Descending mode');
        assert(await page.getByTestId('schulte-board-counter').innerText() === 'Board 1 / 2', 'Descending should restart board context');
        await assertSingleFindPrompt(page, 'Find 9');
        assert((await getListenFindSpeechRequests(page)).length === 0, 'Descending prompt should not trigger Listen & Find speech');

        await page.locator('[data-schulte-number="8"]').click();
        await assertSingleFindPrompt(page, 'Find 9');

        await page.locator('[data-schulte-number="9"]').click();
        await assertSingleFindPrompt(page, 'Find 8');

        for (let board = 0; board < 2; board += 1) {
            const startValue = board === 0 ? 8 : 9;
            for (let value = startValue; value >= 1; value -= 1) {
                await page.locator(`[data-schulte-number="${value}"]`).click();
            }
        }

        assert(await page.getByTestId('schulte-completion').count() === 0, 'Final completion should not show after descending when Listen & Find remains');
        await page.getByTestId('schulte-descending-transition').waitFor();
        assert(await page.getByTestId('schulte-target').count() === 0, 'Listen & Find transition should not show a stale Find prompt');
        assert(
            (await page.getByTestId('schulte-descending-transition').innerText()).includes('Great work! Now let\'s listen and find.'),
            'Transition should introduce Listen & Find after memory progression'
        );
        assert(
            (await page.getByTestId('schulte-descending-transition').innerText()).includes('Follow the ordered prompts from 1 to 9.'),
            'Transition should explain ordered Listen & Find prompts'
        );

        assert((await getListenFindSpeechRequests(page)).length === 0, 'Listen & Find speech should wait until Listen & Find mode starts');
        await page.getByTestId('schulte-start-next-mode').click();
        assert(await page.getByTestId('schulte-mode-label').innerText() === 'Mode: Listen & Find', 'Continue should move to Listen & Find mode');
        assert(await page.getByTestId('schulte-board-counter').innerText() === 'Board 1 / 2', 'Listen & Find should restart board context');
        assert(await page.getByTestId('schulte-completion').count() === 0, 'Listen & Find should not show completion when it starts');
        assert(await page.getByTestId('schulte-grid').count() === 1, 'Listen & Find should render a playable grid');
        await assertSingleFindPrompt(page, 'Find 1');
        assertSpeechRequests(await getListenFindSpeechRequests(page), ['Find 1'], 'Listen & Find should speak the first target when mode starts');

        await page.locator('[data-schulte-number="2"]').click();
        await assertSingleFindPrompt(page, 'Find 1');
        assertSpeechRequests(await getListenFindSpeechRequests(page), ['Find 1'], 'Wrong Listen & Find selection should not repeat the same target speech');

        await page.locator('[data-schulte-number="1"]').click();
        await assertSingleFindPrompt(page, 'Find 2');
        assert(await page.getByTestId('schulte-completion').count() === 0, 'Listen & Find should stay active after its first correct selection');
        assertSpeechRequests(await getListenFindSpeechRequests(page), ['Find 1', 'Find 2'], 'Correct Listen & Find selection should speak the next target');

        for (let board = 0; board < 2; board += 1) {
            const startValue = 2;
            for (let value = startValue; value <= 9; value += 1) {
                await page.locator(`[data-schulte-number="${value}"]`).click();
            }

            if (board === 0) {
                assert(await page.getByTestId('schulte-mode-label').innerText() === 'Mode: Listen & Find', 'Listen & Find should stay in mode after first board');
                assert(await page.getByTestId('schulte-board-counter').innerText() === 'Board 2 / 2', 'Listen & Find should advance to second board');
                assert(await page.getByTestId('schulte-completion').count() === 0, 'Listen & Find should not complete after Board 1');
                assert(await page.getByTestId('schulte-grid').count() === 1, 'Listen & Find Board 2 should render a fresh playable grid');
                await assertSingleFindPrompt(page, 'Find 1');
                assertSpeechRequests(
                    await getListenFindSpeechRequests(page),
                    [...createExpectedListenFindSpeechRequests(1), 'Find 1'],
                    'Listen & Find Board 2 should restart spoken prompts at Find 1'
                );
                const boardTwoOneCell = page.locator('[data-schulte-number="1"]');
                assert(await boardTwoOneCell.isDisabled() === false, 'Listen & Find Board 2 first target should be playable');
                await boardTwoOneCell.click();
                await assertSingleFindPrompt(page, 'Find 2');
                assert(await page.getByTestId('schulte-completion').count() === 0, 'Listen & Find should not complete after Board 2 first selection');
            }
        }

        await page.getByTestId('schulte-completion').waitFor();
        assert(await page.getByTestId('schulte-mode-label').count() === 0, 'Completion summary should hide mode badge');
        assert(await page.getByTestId('schulte-board-counter').count() === 0, 'Completion summary should hide board badge');
        assert(await page.getByTestId('schulte-target').count() === 0, 'Completion summary should hide active prompt');
        assert(await page.getByTestId('schulte-grid').count() === 0, 'Completion summary should hide active grid');
        assertSpeechRequests(
            await getListenFindSpeechRequests(page),
            createExpectedListenFindSpeechRequests(2),
            'Listen & Find should speak Find 1 through Find 9 on both boards'
        );
        const analyticsPayloads = await getSchulteAnalyticsPayloads(page);
        assert(analyticsPayloads.length === 1, 'Schulte should submit one analytics record on final completion');
        assertSchulteAnalyticsPayload(analyticsPayloads[0]);
        await assertSchulteCompletionSummary(page);
        assert(
            (await page.getByTestId('schulte-completion').innerText()).includes('Great Work!'),
            'Final completion should show learner-friendly Great Work summary after all phases complete'
        );
        await page.waitForTimeout(250);
        assert(await page.getByTestId('schulte-completion').count() === 1, 'Completion summary should remain visible until learner action');
        assert(await page.getByTestId('schulte-grid').count() === 0, 'Completion summary should not auto-reset to the grid');
        assert((await getSchulteHomeMessages(page)).length === 0, 'Completion summary should not auto-return home');

        await page.getByTestId('schulte-return-home').click();
        assert((await getSchulteHomeMessages(page)).length === 1, 'Return Home should post the activity home event');

        await page.getByTestId('schulte-play-again').click();
        assert(await page.getByTestId('schulte-completion').count() === 0, 'Play Again should hide completion summary');
        assert(await page.getByTestId('schulte-mode-label').innerText() === 'Mode: Ascending', 'Play Again should restart Ascending mode');
        assert(await page.getByTestId('schulte-board-counter').innerText() === 'Board 1 / 2', 'Play Again should restart at Board 1');
        await assertSingleFindPrompt(page, 'Find 1');
        assert(await page.getByTestId('schulte-grid').count() === 1, 'Play Again should render a fresh playable grid');
    } finally {
        await browser.close();
        if (server) {
            server.kill();
        }
    }

    console.log('Schulte automatic ascending-to-descending flow test passed');
}

async function assertSingleFindPrompt(page, expectedText) {
    const prompt = page.getByTestId('schulte-target');
    assert(await prompt.count() === 1, 'Only one active Find prompt should be rendered');
    assert(await prompt.innerText() === expectedText, `Expected center prompt to show ${expectedText}`);
    const visibleFindPromptCount = await page.locator('body *').evaluateAll(elements => elements.filter(element => {
        const isVisible = !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
        return isVisible && /^Find \d+$/.test(element.textContent.trim());
    }).length);
    assert(visibleFindPromptCount === 1, 'Only one visible Find instruction should appear');
}

async function getListenFindSpeechRequests(page) {
    return page.evaluate(() => window.__schulteListenFindSpeechRequests.slice());
}

async function getSchulteAnalyticsPayloads(page) {
    return page.evaluate(() => window.__schulteAnalyticsPayloads.slice());
}

async function getSchulteHomeMessages(page) {
    return page.evaluate(() => window.__schulteHomeMessages.slice());
}

async function assertSchulteCompletionSummary(page) {
    const completionText = await page.getByTestId('schulte-completion').innerText();

    assert(completionText.includes('96% Accuracy'), 'Completion summary should show accuracy prominently');
    assert(completionText.includes('54 Correct'), 'Completion summary should show correct selections');
    assert(completionText.includes('2 Incorrect'), 'Completion summary should show incorrect selections');
    assert(/\d+ Seconds/.test(completionText), 'Completion summary should show duration in seconds');
    assert(completionText.includes('6 / 6 Boards Completed'), 'Completion summary should show boards completed');
    assert(await page.getByTestId('schulte-play-again').count() === 1, 'Completion summary should show Play Again button');
    assert(await page.getByTestId('schulte-return-home').count() === 1, 'Completion summary should show Return Home button');
}

function assertSchulteAnalyticsPayload(payload) {
    assert(payload.gameId === 'schulte', 'Analytics payload should use Schulte route game id');
    assert(payload.activityId === 'schulte-v1', 'Analytics payload should include Schulte activity id');
    assert(payload.activityName === 'Schulte Table', 'Analytics payload should include activity name');
    assert(typeof payload.sessionTimestamp === 'string' && payload.sessionTimestamp.length > 0, 'Analytics payload should include session timestamp');
    assert(payload.mode === 'learner-flow', 'Analytics payload should capture learner flow mode');
    assert(payload.boardsCompleted === 6, 'Analytics payload should capture six completed boards');
    assert(payload.correctSelections === 54, 'Analytics payload should capture all correct selections');
    assert(payload.incorrectSelections === 2, 'Analytics payload should capture incorrect selections across play');
    assert(payload.totalQuestions === 56, 'Analytics payload should capture total selection attempts');
    assert(payload.accuracyPercent === 96, 'Analytics payload should capture rounded accuracy percentage');
    assert(Number.isFinite(payload.durationSeconds), 'Analytics payload should capture duration seconds');
    assert(payload.completionStatus === 'completed', 'Analytics payload should capture completion status');
}

function createExpectedListenFindSpeechRequests(boardCount) {
    const requests = [];
    for (let board = 0; board < boardCount; board += 1) {
        for (let target = 1; target <= 9; target += 1) {
            requests.push(`Find ${target}`);
        }
    }
    return requests;
}

function assertSpeechRequests(actual, expected, message) {
    assert(
        actual.join('|') === expected.join('|'),
        `${message}. Expected ${expected.join(', ')} but received ${actual.join(', ')}`
    );
}

async function runAllTests() {
    console.log('=== Schulte Launch Tests ===');
    await testAutomaticAscendingToDescendingFlow();
    console.log('=== All Schulte Launch Tests Passed ===');
}

export { runAllTests };

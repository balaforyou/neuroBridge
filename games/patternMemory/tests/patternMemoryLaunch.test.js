import { chromium } from 'playwright';
import { spawn } from 'node:child_process';

const ACTIVITY_URL = 'http://127.0.0.1:5501/games/patternMemory/index.html';
const APP_URL = 'http://127.0.0.1:5501/index.html';

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
    throw new Error('Static server did not start for Pattern Memory launch test');
}

async function isServerReady() {
    try {
        const response = await fetch(ACTIVITY_URL);
        return response.ok;
    } catch {
        return false;
    }
}

async function testPatternMemoryCopyModeLearnerFlow() {
    const server = await ensureStaticServer();
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1000, height: 780 } });
    const consoleErrors = [];

    try {
        await context.addInitScript(() => {
            window.__patternMemoryCompletionPayloads = [];
            window.addEventListener('message', event => {
                if (event.data?.type === 'GAME_OVER_SUBMIT_SCORE') {
                    window.__patternMemoryCompletionPayloads.push(event.data.payload);
                }
            });
        });
        const page = await context.newPage();
        page.on('console', message => {
            if (message.type() === 'error') {
                consoleErrors.push(message.text());
            }
        });
        page.on('pageerror', error => {
            consoleErrors.push(error.message);
        });

        await page.goto(ACTIVITY_URL);
        await page.getByTestId('pattern-memory-copy-mode').waitFor();

        assert(await page.title() === 'Pattern Memory', 'Page title should show Pattern Memory');
        assert((await page.locator('h1').innerText()) === 'Pattern Memory', 'Activity header should show Pattern Memory');
        assert((await page.getByText('Copy the blue pattern into your grid.').count()) >= 1, 'Activity should show one clear Copy Mode instruction');
        assert(await page.locator('#ui-question').innerText() === '1', 'Global header should show current question');
        assert(await page.locator('#ui-level').innerText() === 'C1', 'Global header should show current level');
        assert(await page.getByTestId('pattern-memory-reference-grid').count() === 1, 'Reference grid should be visible');
        assert(await page.getByTestId('pattern-memory-target-grid').count() === 1, 'Target grid should be visible');
        await assertInternalQuestionStripRemoved(page);
        await assertRenderedCellsAreAccessible(page);
        await assertCopyModeLayoutAligned(page);
        await assertFeedbackVisible(page, 'Tap on the grid to fill or clear a cell.');

        await createIntentionalCorrection(page);

        await copyCurrentReferencePattern(page);
        await page.getByTestId('pattern-memory-success-check').waitFor();
        assert((await page.getByTestId('pattern-memory-feedback').innerText()).includes('Great work!'), 'Correct completion should show success confirmation');
        await assertFeedbackVisible(page, 'Great work!');
        await page.waitForTimeout(1000);
        assert(await page.locator('#ui-question').innerText() === '1', 'Success confirmation should dwell before advancing');
        await page.waitForFunction(
            expectedQuestion => document.querySelector('#ui-question')?.textContent === expectedQuestion,
            '2'
        );

        for (let questionIndex = 1; questionIndex < 10; questionIndex += 1) {
            await copyCurrentReferencePattern(page);
            if (questionIndex < 9) {
                await page.waitForFunction(
                    expectedQuestion => document.querySelector('#ui-question')?.textContent === expectedQuestion,
                    String(questionIndex + 2)
                );
            }
        }

        await page.getByTestId('pattern-memory-results').waitFor();
        const completionText = await page.getByTestId('pattern-memory-results').innerText();
        assert(completionText.includes('Great work, Adarsh!'), 'Result screen should show learner success message');
        assert(completionText.includes('Questions: 10'), 'Result screen should show questions');
        assert(completionText.includes('Correct / Total: 10 / 10'), 'Result screen should show correct total');
        assert(completionText.includes('Accuracy: 100%'), 'Result screen should show accuracy');
        assert(completionText.includes('Time Taken:'), 'Result screen should show time taken');
        assert(completionText.includes('Average Time:'), 'Result screen should show average time');
        assert(completionText.includes('Mistakes Corrected:'), 'Result screen should show mistakes corrected');
        assert(await page.getByTestId('pattern-memory-next-round-button').innerText() === 'Try Again', 'Try Again should be visible');
        assert(await page.getByTestId('pattern-memory-home-button').innerText() === 'Home', 'Home should be visible');
        assert(await page.getByTestId('pattern-memory-question').isVisible() === false, 'Completion should hide active question');

        const payloads = await page.evaluate(() => window.__patternMemoryCompletionPayloads);
        assert(payloads.length === 1, 'Pattern Memory should submit one completion payload');
        assertPatternMemoryPayload(payloads[0]);
        assert(consoleErrors.length === 0, `Pattern Memory should not emit console errors: ${consoleErrors.join('; ')}`);
    } finally {
        await browser.close();
        if (server) {
            server.kill();
        }
    }

    console.log('Pattern Memory Copy Mode learner flow launch test passed');
}

async function testPatternMemoryActivityHubLaunchFlow() {
    const server = await ensureStaticServer();
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1100, height: 820 } });

    try {
        const page = await context.newPage();
        await page.goto(APP_URL);
        await page.waitForSelector('#game-selection-list', { state: 'attached' });
        await page.evaluate(async () => {
            const app = await import('./js/app.js');
            const tiles = await import('./js/activityTiles.js');
            const router = await import('./js/router.js');
            app.AppState.user = 'student';
            app.AppState.studentName = 'Adarsh';
            tiles.renderActivityTiles('Adarsh');
            router.switchView('student');
        });

        const tile = page.getByTestId('activity-tile-pattern-memory');
        await tile.waitFor();
        assert(await tile.isVisible(), 'Pattern Memory tile should appear in learner activity hub');
        assert((await tile.innerText()).includes('Copy and remember patterns using visual memory.'), 'Pattern Memory tile should show integration description');

        await tile.click();
        await page.waitForFunction(() => {
            const frame = document.getElementById('game-frame');
            return frame?.getAttribute('src') === './games/patternMemory/index.html';
        });

        const frame = page.frameLocator('#game-frame');
        await frame.getByTestId('pattern-memory-copy-mode').waitFor();
        assert(await page.locator('#game-nav-row').isVisible() === false, 'Pattern Memory should use shell-managed navigation');
        assert((await frame.locator('h1').innerText()) === 'Pattern Memory', 'Launched activity should show Pattern Memory header');
        assert(await frame.getByTestId('worksheet-shell').getAttribute('data-template-type') === 'pattern-builder', 'Pattern Memory should run inside worksheet shell');
        assert(await frame.getByTestId('pattern-memory-reference-grid').count() === 1, 'Tile launch should open Copy Mode reference grid');
        assert(await frame.getByTestId('pattern-memory-target-grid').count() === 1, 'Tile launch should open Copy Mode target grid');
    } finally {
        await browser.close();
        if (server) {
            server.kill();
        }
    }

    console.log('Pattern Memory activity hub launch flow test passed');
}

async function createIntentionalCorrection(page) {
    const blueIndexes = await getReferenceBlueCellIndexes(page);
    const targetCount = await page.locator('[data-testid^="pattern-memory-target-cell-"]').count();
    const wrongIndex = Array.from({ length: targetCount }, (_, index) => index)
        .find(index => !blueIndexes.includes(index));

    await page.getByTestId(`pattern-memory-target-cell-${wrongIndex}`).click();
    assert(
        (await page.getByTestId('pattern-memory-feedback').innerText()).includes('Try that spot again.'),
        'Incorrect target cell should show gentle correction'
    );
    await assertFeedbackVisible(page, 'Try that spot again.');
    await page.getByTestId(`pattern-memory-target-cell-${wrongIndex}`).click();
    assert(
        (await page.getByTestId('pattern-memory-feedback').innerText()).includes('Tap on the grid to fill or clear a cell.'),
        'Removing incorrect cell should restore helper feedback'
    );
}

async function copyCurrentReferencePattern(page) {
    const blueIndexes = await getReferenceBlueCellIndexes(page);

    for (const index of blueIndexes) {
        const targetCell = page.getByTestId(`pattern-memory-target-cell-${index}`);
        if (await targetCell.getAttribute('aria-pressed') !== 'true') {
            await targetCell.click();
        }
    }
}

async function getReferenceBlueCellIndexes(page) {
    return page.evaluate(() => {
        return Array.from(document.querySelectorAll('[data-testid^="pattern-memory-reference-cell-"]'))
            .filter(cell => cell.textContent.includes('Blue'))
            .map(cell => Number(cell.getAttribute('data-testid').replace('pattern-memory-reference-cell-', '')));
    });
}

async function assertRenderedCellsAreAccessible(page) {
    const targetCells = page.locator('[data-testid^="pattern-memory-target-cell-"]');
    const firstCell = targetCells.first();

    assert(await targetCells.count() === 4, 'C1 target grid should start with four cells');
    assert(await firstCell.evaluate(element => element.tagName.toLowerCase()) === 'button', 'Target grid cells should be keyboard-accessible buttons');
    assert((await firstCell.getAttribute('aria-label')).includes('Your Pattern row 1 column 1'), 'Target cells should have accessible names');
    assert(await firstCell.getAttribute('aria-pressed') === 'false', 'Target cells should expose pressed state');

    const minSize = await firstCell.evaluate(element => {
        const rect = element.getBoundingClientRect();
        return Math.min(rect.width, rect.height);
    });
    assert(minSize >= 44, 'Target cells should be large enough for touch');
}

async function assertInternalQuestionStripRemoved(page) {
    assert(await page.getByTestId('pattern-memory-question-strip').count() === 0, 'Pattern Memory should not render an internal question or level strip');

    const activeQuestionText = await page.getByTestId('pattern-memory-question').innerText();
    assert(!activeQuestionText.includes('Question 1 of 10'), 'Activity body should not duplicate global question progress');
    assert(!activeQuestionText.includes('Copy Mode C1'), 'Activity body should not duplicate global level text');
}

async function assertCopyModeLayoutAligned(page) {
    const layout = await page.evaluate(() => {
        const copyMode = document.querySelector('[data-testid="pattern-memory-copy-mode"]');
        const shellHeader = document.querySelector('body > main > header');
        const instruction = document.querySelector('[data-testid="worksheet-instruction"]');
        const activity = document.querySelector('[data-testid="worksheet-activity"]');
        const stage = document.querySelector('[data-testid="pattern-memory-stage"]');
        const gridWorkspace = document.querySelector('[data-testid="pattern-memory-grid-workspace"]');
        const feedback = document.querySelector('[data-testid="pattern-memory-feedback"]');
        const referencePanel = document.querySelector('[data-testid="pattern-memory-reference-panel"]');
        const targetPanel = document.querySelector('[data-testid="pattern-memory-target-panel"]');
        const referenceGrid = document.querySelector('[data-testid="pattern-memory-reference-grid"]');
        const targetGrid = document.querySelector('[data-testid="pattern-memory-target-grid"]');
        const referenceHeading = referencePanel.querySelector('h3');
        const targetHeading = targetPanel.querySelector('h3');

        const copyModeRect = copyMode.getBoundingClientRect();
        const shellHeaderRect = shellHeader.getBoundingClientRect();
        const instructionRect = instruction.getBoundingClientRect();
        const activityRect = activity.getBoundingClientRect();
        const stageRect = stage.getBoundingClientRect();
        const gridWorkspaceRect = gridWorkspace.getBoundingClientRect();
        const feedbackRect = feedback.getBoundingClientRect();
        const referenceRect = referencePanel.getBoundingClientRect();
        const targetRect = targetPanel.getBoundingClientRect();
        const referenceGridRect = referenceGrid.getBoundingClientRect();
        const targetGridRect = targetGrid.getBoundingClientRect();
        const referenceHeadingRect = referenceHeading.getBoundingClientRect();
        const targetHeadingRect = targetHeading.getBoundingClientRect();
        const copyModeStyle = window.getComputedStyle(copyMode);
        const gridWorkspaceStyle = window.getComputedStyle(gridWorkspace);

        function isInside(outer, inner) {
            return inner.top >= outer.top - 1
                && inner.left >= outer.left - 1
                && inner.right <= outer.right + 1
                && inner.bottom <= outer.bottom + 1;
        }

        return {
            viewportHeight: window.innerHeight,
            copyModeOverflowY: copyModeStyle.overflowY,
            gridWorkspaceOverflowY: gridWorkspaceStyle.overflowY,
            copyModeScrollHeight: copyMode.scrollHeight,
            copyModeClientHeight: copyMode.clientHeight,
            copyModeBottom: copyModeRect.bottom,
            shellHeaderBottom: shellHeaderRect.bottom,
            instructionBottom: instructionRect.bottom,
            gridWorkspaceTop: gridWorkspaceRect.top,
            gridWorkspaceBottom: gridWorkspaceRect.bottom,
            feedbackTop: feedbackRect.top,
            feedbackBottom: feedbackRect.bottom,
            activityCenter: activityRect.left + (activityRect.width / 2),
            stageCenter: stageRect.left + (stageRect.width / 2),
            referenceTop: referenceRect.top,
            referenceBottom: referenceRect.bottom,
            targetTop: targetRect.top,
            targetBottom: targetRect.bottom,
            referenceWidth: referenceRect.width,
            targetWidth: targetRect.width,
            referenceGridWidth: referenceGridRect.width,
            targetGridWidth: targetGridRect.width,
            referenceHeadingVisible: referenceHeadingRect.height > 0 && isInside(referenceRect, referenceHeadingRect),
            targetHeadingVisible: targetHeadingRect.height > 0 && isInside(targetRect, targetHeadingRect),
            referenceGridVisible: referenceGridRect.height > 0 && isInside(referenceRect, referenceGridRect),
            targetGridVisible: targetGridRect.height > 0 && isInside(targetRect, targetGridRect),
            bodyOverflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth
        };
    });

    assert(!['auto', 'scroll'].includes(layout.copyModeOverflowY), 'Copy Mode content should not create an internal vertical scroll container');
    assert(!['auto', 'scroll'].includes(layout.gridWorkspaceOverflowY), 'Grid workspace should not create an internal vertical scroll container');
    assert(layout.copyModeScrollHeight <= layout.copyModeClientHeight + 1, 'Copy Mode content should fit without internal scrolling');
    assert(Math.abs(layout.stageCenter - layout.activityCenter) < 5, 'Pattern Memory stage should be centered in activity panel');
    assert(layout.gridWorkspaceTop >= layout.instructionBottom + 16, 'Grid workspace should start at least 16px below instruction block');
    assert(layout.referenceTop >= layout.instructionBottom + 16, 'Reference panel should not overlap worksheet instruction area');
    assert(layout.targetTop >= layout.instructionBottom + 16, 'Target panel should not overlap worksheet instruction area');
    assert(layout.referenceTop > layout.shellHeaderBottom, 'Reference panel should not overlap activity shell header');
    assert(layout.targetTop > layout.shellHeaderBottom, 'Target panel should not overlap activity shell header');
    assert(Math.abs(layout.referenceTop - layout.targetTop) < 5, 'Reference and target panels should align vertically on desktop');
    assert(Math.abs(layout.referenceWidth - layout.targetWidth) < 5, 'Reference and target panels should have consistent width');
    assert(Math.abs(layout.referenceGridWidth - layout.targetGridWidth) < 5, 'Reference and target grids should have consistent width');
    assert(layout.feedbackTop >= layout.gridWorkspaceBottom + 12, 'Feedback/help area should sit below the grid workspace');
    assert(layout.feedbackBottom <= layout.viewportHeight, 'Feedback/help area should be visible without scrolling');
    assert(layout.referenceHeadingVisible, 'Reference Pattern heading should be fully visible inside its panel');
    assert(layout.targetHeadingVisible, 'Your Pattern heading should be fully visible inside its panel');
    assert(layout.referenceGridVisible, 'Reference Pattern grid should be fully visible inside its panel');
    assert(layout.targetGridVisible, 'Your Pattern grid should be fully visible inside its panel');
    assert(layout.referenceBottom <= layout.viewportHeight, 'Reference panel should not be clipped below the viewport');
    assert(layout.targetBottom <= layout.viewportHeight, 'Target panel should not be clipped below the viewport');
    assert(layout.gridWorkspaceBottom <= layout.viewportHeight, 'Grid workspace should fit inside the desktop viewport');
    assert(layout.bodyOverflowX === false, 'Pattern Memory layout should avoid horizontal scrolling');
}

async function assertFeedbackVisible(page, expectedText) {
    const feedback = await page.getByTestId('pattern-memory-feedback').evaluate((element, text) => {
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);

        return {
            text: element.textContent,
            visible: rect.width > 0
                && rect.height > 0
                && rect.top >= 0
                && rect.left >= 0
                && rect.bottom <= window.innerHeight
                && rect.right <= window.innerWidth
                && style.visibility !== 'hidden'
                && style.display !== 'none',
            overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth
        };
    }, expectedText);

    assert(feedback.text.includes(expectedText), 'Gentle correction feedback should include expected learner copy');
    assert(feedback.visible, 'Gentle correction feedback should be visible in the viewport');
    assert(feedback.overflowX === false, 'Feedback state should not create horizontal overflow');
}

function assertPatternMemoryPayload(payload) {
    assert(payload.gameId === 'patternMemory', 'Completion payload should use Pattern Memory game id');
    assert(payload.activityId === 'pm-001-copy-mode', 'Completion payload should preserve activity id');
    assert(payload.activityName === 'Pattern Memory', 'Completion payload should use activity name');
    assert(payload.mode === 'copy', 'Completion payload should use Copy Mode');
    assert(payload.correctCount === 10, 'Completion payload should include correct answers');
    assert(payload.totalQuestions === 10, 'Completion payload should include total questions');
    assert(payload.accuracyPercent === 100, 'Completion payload should include accuracy');
    assert(payload.mistakeCount >= 1, 'Completion payload should include corrected mistakes');
    assert(payload.trials.length === 10, 'Completion payload should include ten trials');
    assert(payload.trials.every(trial => trial.activity === 'pm-001-copy-mode'), 'Trials should include activity');
    assert(payload.trials.every(trial => trial.mode === 'copy'), 'Trials should include Copy Mode');
    assert(payload.trials.every(trial => trial.correct === true), 'Trials should record correct completion');
}

async function runAllTests() {
    console.log('=== Pattern Memory Launch Tests ===');
    await testPatternMemoryCopyModeLearnerFlow();
    await testPatternMemoryActivityHubLaunchFlow();
    console.log('=== All Pattern Memory Launch Tests Passed ===');
}

export { runAllTests };

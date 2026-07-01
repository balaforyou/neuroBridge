const { test, expect } = require('@playwright/test');

const DESKTOP = { name: 'desktop 1366x768', width: 1366, height: 768 };
const TABLET_LANDSCAPE = { name: 'tablet landscape 1024x768', width: 1024, height: 768 };
const MOBILE = { name: 'mobile 390x844', width: 390, height: 844 };
const TEST_VIEWPORTS = [DESKTOP, TABLET_LANDSCAPE];
const LEARNER_NAME = 'Adarsh';

async function expectNoPageScrollbar(page, { vertical = false } = {}) {
    const overflow = await page.evaluate(() => {
        const root = document.scrollingElement || document.documentElement;
        return {
            horizontal: root.scrollWidth > root.clientWidth + 1,
            vertical: root.scrollHeight > root.clientHeight + 1,
            scrollWidth: root.scrollWidth,
            clientWidth: root.clientWidth,
            scrollHeight: root.scrollHeight,
            clientHeight: root.clientHeight
        };
    });

    expect(overflow.horizontal, JSON.stringify(overflow)).toBe(false);
    if (!vertical) {
        expect(overflow.vertical, JSON.stringify(overflow)).toBe(false);
    }
}

async function expectElementFullyInViewport(page, testId) {
    const box = await page.getByTestId(testId).boundingBox();
    expect(box, `${testId} should have a bounding box`).not.toBeNull();
    expect(box.x, `${testId} left edge`).toBeGreaterThanOrEqual(0);
    expect(box.y, `${testId} top edge`).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width, `${testId} right edge`).toBeLessThanOrEqual(page.viewportSize().width);
    expect(box.y + box.height, `${testId} bottom edge`).toBeLessThanOrEqual(page.viewportSize().height);
}

async function expectResultPanelDoesNotScroll(page) {
    const overflow = await page.getByTestId('number-bridges-results').evaluate((element) => ({
        scrollHeight: element.scrollHeight,
        clientHeight: element.clientHeight,
        overflowY: getComputedStyle(element).overflowY
    }));

    expect(overflow.overflowY, JSON.stringify(overflow)).toBe('hidden');
    expect(overflow.scrollHeight, JSON.stringify(overflow)).toBeLessThanOrEqual(overflow.clientHeight + 1);
}

async function expectNumberBridgeResultColumns(page) {
    const summary = await page.getByTestId('number-bridges-result-summary').boundingBox();
    const review = await page.getByTestId('number-bridges-review').boundingBox();
    const actions = await page.getByTestId('number-bridges-actions').boundingBox();

    expect(summary, 'result summary should have a bounding box').not.toBeNull();
    expect(review, 'result review should have a bounding box').not.toBeNull();
    expect(actions, 'result actions should have a bounding box').not.toBeNull();
    expect(summary.x, 'summary should be in the left column').toBeLessThan(review.x);
    expect(summary.x + summary.width, 'summary should not overlap review column').toBeLessThanOrEqual(review.x);
    expect(actions.y + actions.height, 'actions should stay visible').toBeLessThanOrEqual(page.viewportSize().height);
}

async function expectNumberBridgeResultStacks(page) {
    const summary = await page.getByTestId('number-bridges-result-summary').boundingBox();
    const review = await page.getByTestId('number-bridges-review').boundingBox();
    const actions = await page.getByTestId('number-bridges-actions').boundingBox();

    expect(summary, 'result summary should have a bounding box').not.toBeNull();
    expect(review, 'result review should have a bounding box').not.toBeNull();
    expect(actions, 'result actions should have a bounding box').not.toBeNull();
    expect(review.y, 'review should stack below summary on mobile').toBeGreaterThan(summary.y + summary.height - 1);
    expect(Math.abs(review.x - summary.x), 'stacked panels should align horizontally').toBeLessThanOrEqual(2);
    expect(actions.y + actions.height, 'actions should stay visible on mobile').toBeLessThanOrEqual(page.viewportSize().height);
}

async function initializeActivity(page) {
    await page.evaluate((learnerName) => {
        window.postMessage({
            type: 'INITIALIZE_GAME_RULES',
            payload: {
                maxDifficultyCeiling: 5,
                timeLimitSeconds: 45,
                trialsPerBlock: 5,
                forcedStageOverride: 0,
                uiSupportLevel: 1
            },
            learnerName,
            isTestSession: true
        }, '*');
    }, LEARNER_NAME);
}

async function initializeKumonQuiz(page, overrides = {}) {
    await page.evaluate(({ learnerName, overrides }) => {
        window.postMessage({
            type: 'INITIALIZE_GAME_RULES',
            payload: {
                operation: '+',
                firstNumberMin: 1,
                firstNumberMax: 5,
                secondNumberMode: 'fixed',
                secondNumberFixedValue: 1,
                questionCount: 5,
                hintsEnabled: true,
                mode: 'practice',
                ...overrides
            },
            learnerName,
            isTestSession: true
        }, '*');
    }, { learnerName: LEARNER_NAME, overrides });
}

async function answerNumberBridgeRow(page, rowIndex, answer) {
    const testId = rowIndex === 0
        ? 'number-bridges-answer-input'
        : `number-bridges-answer-input-${rowIndex}`;

    await page.getByTestId(testId).fill(String(answer));
    await page.getByTestId(testId).press('Enter');
}

async function getAttributeExplorerCorrectChoice(page) {
    return page.evaluate(() => {
        const prompt = document.getElementById('attribute-prompt')?.textContent || '';
        const itemA = document.getElementById('item-a');
        const itemB = document.getElementById('item-b');

        function getShape(item) {
            if (item.querySelector('circle')) return 'circle';
            if (item.querySelector('rect')) return 'square';
            if (item.querySelector('polygon')?.getAttribute('points')?.startsWith('50,12')) return 'triangle';
            return 'star';
        }

        function getColor(item) {
            const className = item.querySelector('.attribute-shape')?.className?.baseVal || '';
            if (className.includes('text-red-500')) return 'red';
            if (className.includes('text-blue-500')) return 'blue';
            if (className.includes('text-emerald-500')) return 'green';
            return 'yellow';
        }

        function getSize(item) {
            const svg = item.querySelector('.attribute-shape');
            return svg?.style?.getPropertyValue('--attribute-shape-size') || svg?.className?.baseVal || '';
        }

        let first;
        let second;
        if (prompt.includes('COLOR')) {
            first = getColor(itemA);
            second = getColor(itemB);
        } else if (prompt.includes('SHAPE')) {
            first = getShape(itemA);
            second = getShape(itemB);
        } else {
            first = getSize(itemA);
            second = getSize(itemB);
        }

        return first === second ? 'same' : 'different';
    });
}

async function answerAttributeExplorerCorrectly(page) {
    const choice = await getAttributeExplorerCorrectChoice(page);
    await page.getByTestId(`${choice}-button`).click();
    return choice;
}

test.describe('SIRAASH Activity Hub', () => {
    test.use({ viewport: DESKTOP });

    test('shows learner activity tiles without horizontal overflow', async ({ page }) => {
        await page.goto('/');

        await page.evaluate(async (learnerName) => {
            const db = await import('/js/database.js');
            await db.seedCustomPins('4321', '2580', learnerName);
        }, LEARNER_NAME);

        await page.getByRole('button', { name: 'Learner Login' }).click();
        await page.getByPlaceholder('Enter PIN').fill('2580');
        await page.getByRole('button', { name: 'Enter' }).click();
        await expect(page.getByText(new RegExp(`Good Morning, ${LEARNER_NAME}|Welcome Back, ${LEARNER_NAME}`))).toBeVisible();

        await page.getByRole('button', { name: "Let's Begin" }).click();

        await expect(page.getByTestId('activity-hub')).toBeVisible();
        await expect(page.getByText('SIRAASH Activity Hub')).toBeVisible();
        await expect(page.getByText(`${LEARNER_NAME}, let's learn together`)).toBeVisible();
        await expect(page.getByTestId('activity-tile-matching-worksheet')).toBeVisible();
        await expect(page.getByTestId('activity-tile-matching-worksheet')).toContainText('Matching Worksheet');
        await expect(page.getByTestId('activity-tile-attribute-matching')).toBeVisible();
        await expect(page.getByTestId('activity-tile-attribute-matching')).toContainText('Attribute Matching V1');
        await expect(page.getByTestId('activity-tile-pattern-detective')).toBeVisible();
        await expect(page.getByTestId('activity-tile-look-closely')).toBeVisible();
        await expect(page.getByTestId('activity-tile-number-bridges')).toBeVisible();
        await expect(page.getByTestId('activity-tile-number-bridges')).toContainText('Number Bridges');
        await expect(page.getByText('Coming Soon').first()).toBeVisible();
        await expect(page.getByText('Coming Soon')).toHaveCount(1);
        await expectNoPageScrollbar(page, { vertical: true });
    });
});

test.describe('Matching Worksheet viewport smoke', () => {
    for (const viewport of TEST_VIEWPORTS) {
        test(`keeps worksheet zones and cards visible at ${viewport.name}`, async ({ page }) => {
            await page.setViewportSize({ width: viewport.width, height: viewport.height });
            await page.goto('/games/matchingWorksheet/');
            await initializeActivity(page);

            await expect(page.getByRole('button', { name: /Home/ })).toBeVisible();
            await expect(page.getByLabel('SIRAASH')).toBeVisible();
            await expect(page.getByText('Activity')).toBeVisible();
            await expect(page.getByRole('heading', { name: 'Matching Worksheet' })).toBeVisible();
            await expect(page.getByTestId('matching-worksheet')).toBeVisible();
            await expect(page.getByTestId('worksheet-instruction')).toBeVisible();
            await expect(page.getByTestId('worksheet-activity')).toBeVisible();
            await expect(page.getByTestId('worksheet-help')).toBeVisible();
            await expect(page.getByTestId('worksheet-feedback')).toBeVisible();
            await expect(page.getByTestId('worksheet-celebration')).toHaveAttribute('data-enabled', 'false');
            await expect(page.getByTestId('matching-card-apple-a')).toBeVisible();
            await expect(page.getByTestId('worksheet-hint-button')).toBeVisible();
            await expect(page.getByText('Back to Dashboard')).toBeHidden();
            await expect(page.getByText('Activity: Matching Worksheet')).toBeHidden();
            await expectNoPageScrollbar(page);
        });
    }

    test.use({ viewport: DESKTOP });

    test('launches from the hub without legacy parent navigation labels', async ({ page }) => {
        await page.goto('/');

        await page.evaluate(async (learnerName) => {
            const db = await import('/js/database.js');
            await db.seedCustomPins('4321', '2580', learnerName);
        }, LEARNER_NAME);

        await page.getByRole('button', { name: 'Learner Login' }).click();
        await page.getByPlaceholder('Enter PIN').fill('2580');
        await page.getByRole('button', { name: 'Enter' }).click();
        await page.getByRole('button', { name: "Let's Begin" }).click();
        await page.getByTestId('activity-tile-matching-worksheet').click();

        await expect(page.locator('#game-nav-row')).toBeHidden();
        await expect(page.getByText('Back to Dashboard')).toBeHidden();
        await expect(page.getByText('Activity: Matching Worksheet')).toBeHidden();

        const frame = page.frameLocator('#game-frame');
        await expect(frame.getByRole('button', { name: /Home/ })).toBeVisible();
        await expect(frame.getByLabel('SIRAASH')).toBeVisible();
        await expect(frame.getByRole('heading', { name: 'Matching Worksheet' })).toBeVisible();
    });

    test('uses local pair feedback and a next round completion flow', async ({ page }) => {
        await page.goto('/games/matchingWorksheet/');
        await initializeActivity(page);

        await page.getByTestId('matching-card-apple-a').click();
        await page.getByTestId('matching-card-apple-b').click();
        await expect(page.getByTestId('matching-card-apple-a-check')).toBeVisible();
        await expect(page.getByTestId('matching-card-apple-b-check')).toBeVisible();
        await expect(page.getByTestId('worksheet-feedback')).toBeEmpty();

        await page.getByTestId('matching-card-ball-a').click();
        await page.getByTestId('matching-card-cat-a').click();
        await expect(page.getByTestId('matching-card-ball-a-cross')).toBeVisible();
        await expect(page.getByTestId('matching-card-cat-a-cross')).toBeVisible();
        await expect(page.getByTestId('matching-card-ball-a')).toHaveClass(/matching-card-nudge/);
        await expect(page.getByTestId('worksheet-feedback')).toContainText('You got close.');
        await expect(page.getByTestId('worksheet-feedback')).toContainText('SIRAASH will guide you.');
        await expect(page.getByTestId('matching-card-ball-a-cross')).toBeHidden({ timeout: 1500 });

        await page.getByTestId('matching-card-ball-a').click();
        await page.getByTestId('matching-card-ball-b').click();
        await page.getByTestId('matching-card-cat-a').click();
        await page.getByTestId('matching-card-cat-b').click();
        await expect(page.getByTestId('matching-completion')).toBeVisible();
        await expect(page.getByTestId('matching-card-grid')).toBeHidden();
        await expect(page.getByTestId('worksheet-instruction')).toBeHidden();
        await expect(page.getByTestId('worksheet-help')).toBeHidden();
        await expect(page.getByTestId('worksheet-feedback')).toBeHidden();
        await expect(page.getByTestId('matching-results')).toBeVisible();
        await expect(page.getByTestId('matching-results')).toHaveCount(1);
        await expect(page.getByTestId('siraash-completion-title')).toContainText(`Great work, ${LEARNER_NAME}!`);
        await expect(page.getByTestId('siraash-completion-message')).toHaveText('You matched all the pictures.');
        await expect(page.getByTestId('matching-review')).toContainText('No corrections needed.');
        await expect(page.getByTestId('matching-next-round-button')).toBeVisible();
        await expect(page.getByTestId('matching-home-button')).toBeVisible();
        await expect(page.getByTestId('worksheet-feedback')).toBeEmpty();
        await expect(page.getByText('You found the answer.')).toBeHidden();

        await page.getByTestId('matching-next-round-button').click();
        await expect(page.getByTestId('matching-card-apple-a-check')).toBeHidden();
        await expect(page.getByTestId('matching-completion')).toBeHidden();
        await expect(page.getByTestId('matching-card-grid')).toBeVisible();
        await expect(page.getByTestId('worksheet-feedback')).toBeEmpty();
    });
});

test.describe('Attribute Matching Worksheet viewport smoke', () => {
    for (const viewport of TEST_VIEWPORTS) {
        test(`keeps prompt and choices visible at ${viewport.name}`, async ({ page }) => {
            await page.setViewportSize({ width: viewport.width, height: viewport.height });
            await page.goto('/games/attributeMatchingWorksheet/');
            await initializeActivity(page);

            await expect(page.getByRole('button', { name: /Home/ })).toBeVisible();
            await expect(page.getByLabel('SIRAASH')).toBeVisible();
            await expect(page.getByText('Activity')).toBeVisible();
            await expect(page.getByRole('heading', { name: 'Matching Worksheets' })).toBeVisible();
            await expect(page.getByTestId('attribute-matching-worksheet')).toBeVisible();
            await expect(page.getByTestId('worksheet-instruction')).toBeVisible();
            await expect(page.getByTestId('worksheet-activity')).toBeVisible();
            await expect(page.getByTestId('worksheet-help')).toBeHidden();
            await expect(page.getByRole('heading', { name: 'Attribute Matching V1' })).toBeVisible();
            await expect(page.getByTestId('attribute-matching-prompt-label')).toHaveText('Red Apple');
            await expect(page.getByTestId('attribute-choice-red')).toBeVisible();
            await expect(page.getByTestId('attribute-choice-blue')).toBeVisible();
            await expect(page.getByTestId('attribute-choice-green')).toBeVisible();
            await expect(page.getByTestId('worksheet-celebration')).toHaveAttribute('data-enabled', 'false');
            await expect(page.getByText('Back to Dashboard')).toBeHidden();
            await expect(page.getByText('Activity: Attribute Matching Worksheet')).toBeHidden();
            await expectNoPageScrollbar(page);
        });
    }

    test.use({ viewport: DESKTOP });

    test('launches from the hub without legacy parent navigation labels', async ({ page }) => {
        await page.goto('/');

        await page.evaluate(async (learnerName) => {
            const db = await import('/js/database.js');
            await db.seedCustomPins('4321', '2580', learnerName);
        }, LEARNER_NAME);

        await page.getByRole('button', { name: 'Learner Login' }).click();
        await page.getByPlaceholder('Enter PIN').fill('2580');
        await page.getByRole('button', { name: 'Enter' }).click();
        await page.getByRole('button', { name: "Let's Begin" }).click();
        await page.getByTestId('activity-tile-attribute-matching').click();

        await expect(page.locator('#game-nav-row')).toBeHidden();
        await expect(page.getByText('Back to Dashboard')).toBeHidden();
        await expect(page.getByText('Activity: Attribute Matching Worksheet')).toBeHidden();

        const frame = page.frameLocator('#game-frame');
        await expect(frame.getByRole('button', { name: /Home/ })).toBeVisible();
        await expect(frame.getByLabel('SIRAASH')).toBeVisible();
        await expect(frame.getByRole('heading', { name: 'Matching Worksheets' })).toBeVisible();
    });

    test('shows completion summary after finishing the color set', async ({ page }) => {
        await page.goto('/games/attributeMatchingWorksheet/');
        await initializeActivity(page);

        const colorQuestions = [
            ['red', 'Red Apple'],
            ['blue', 'Blue Ball'],
            ['green', 'Green Leaf'],
            ['yellow', 'Yellow Banana'],
            ['orange', 'Orange Carrot'],
            ['purple', 'Purple Grapes'],
            ['brown', 'Brown Coconut'],
            ['black', 'Black Circle'],
            ['white', 'White Circle'],
            ['pink', 'Pink Flower']
        ];

        for (let index = 0; index < colorQuestions.length; index += 1) {
            const [answer] = colorQuestions[index];
            await page.getByTestId(`attribute-choice-${answer}`).click();
            if (index < colorQuestions.length - 1) {
                await expect(page.getByTestId('attribute-matching-prompt-label')).toHaveText(colorQuestions[index + 1][1]);
            }
        }

        await expect(page.getByTestId('attribute-matching-question')).toBeHidden();
        await expect(page.getByTestId('attribute-matching-completion')).toBeVisible();
        await expect(page.getByTestId('worksheet-instruction')).toBeHidden();
        await expect(page.getByTestId('worksheet-help')).toBeHidden();
        await expect(page.getByTestId('worksheet-feedback')).toBeHidden();
        await expect(page.getByText('Look at the picture. Choose its color.')).toBeHidden();
        await expect(page.getByTestId('attribute-matching-results')).toBeVisible();
        await expect(page.getByTestId('attribute-matching-results')).toHaveCount(1);
        await expect(page.getByTestId('attribute-matching-completion')).toContainText(`Great work, ${LEARNER_NAME}!`);
        await expect(page.getByTestId('attribute-matching-result-header-accuracy')).toHaveText('100% Accuracy');
        await expect(page.getByTestId('attribute-matching-total')).toHaveText('Questions: 10');
        await expect(page.getByTestId('attribute-matching-correct-total')).toHaveText('Correct / Total: 10 / 10');
        await expect(page.getByTestId('attribute-matching-review')).toContainText('No corrections needed.');
        await expect(page.getByTestId('attribute-matching-next-round-button')).toBeVisible();
        await expect(page.getByTestId('attribute-matching-home-button')).toBeVisible();
        await expect(page.getByTestId('worksheet-feedback')).toBeEmpty();
        await expect(page.getByText('You found the answer.')).toBeHidden();
        await expectNoPageScrollbar(page);
    });
});

test.describe('Number Bridges viewport smoke', () => {
    for (const viewport of TEST_VIEWPORTS) {
        test(`keeps question, answer, and support visible at ${viewport.name}`, async ({ page }) => {
            await page.setViewportSize({ width: viewport.width, height: viewport.height });
            await page.goto('/games/kumonQuiz/');
            await initializeKumonQuiz(page);

            await expect(page.getByRole('button', { name: /Home/ })).toBeVisible();
            await expect(page.getByLabel('SIRAASH')).toBeVisible();
            await expect(page.getByRole('heading', { name: 'Number Bridges' })).toBeVisible();
            await expect(page.getByTestId('number-bridges-header-level')).toHaveText('Addition L1');
            await expect(page.getByTestId('kumon-quiz')).toBeVisible();
            await expect(page.getByTestId('number-bridges-main-task')).toBeVisible();
            await expect(page.getByTestId('number-bridges-row-list')).toBeVisible();
            await expect(page.locator('[data-testid^="number-bridges-row-"]:not([data-testid="number-bridges-row-list"])')).toHaveCount(5);
            await expect(page.locator('[data-testid="number-bridges-row-0"]')).toBeVisible();
            await expect(page.locator('[data-testid="number-bridges-row-4"]')).toBeVisible();
            await expect(page.getByText('Number Bridge', { exact: true })).toBeHidden();
            await expect(page.getByTestId('number-bridges-question')).toHaveText('1 + 1 =');
            await expect(page.getByTestId('number-bridges-answer-input')).toBeVisible();
            await expect(page.getByTestId('number-bridges-check-button')).toBeHidden();
            await expect(page.getByTestId('number-bridges-support-panel')).toBeVisible();
            await expect(page.getByTestId('number-bridges-local-tick')).toBeHidden();
            await expectElementFullyInViewport(page, 'number-bridges-row-4');
            await expectElementFullyInViewport(page, 'number-bridges-support-panel');

            const rowAlignment = await page.evaluate(() => {
                const row = document.querySelector('[data-testid="number-bridges-row-0"]');
                const question = document.querySelector('[data-testid="number-bridges-question"]');
                const input = document.querySelector('[data-testid="number-bridges-answer-input"]');
                const tick = document.querySelector('[data-testid="number-bridges-local-tick"]');
                const rowBox = row.getBoundingClientRect();
                const questionBox = question.getBoundingClientRect();
                const inputBox = input.getBoundingClientRect();
                const tickBox = tick.getBoundingClientRect();

                return {
                    questionInsideRow: questionBox.top >= rowBox.top && questionBox.bottom <= rowBox.bottom,
                    inputInsideRow: inputBox.top >= rowBox.top && inputBox.bottom <= rowBox.bottom,
                    tickInsideRow: tickBox.top >= rowBox.top && tickBox.bottom <= rowBox.bottom,
                    inputGap: Math.round(inputBox.left - questionBox.right)
                };
            });
            expect(rowAlignment.questionInsideRow).toBe(true);
            expect(rowAlignment.inputInsideRow).toBe(true);
            expect(rowAlignment.tickInsideRow).toBe(true);
            expect(rowAlignment.inputGap).toBeLessThanOrEqual(16);
            await expect(page.getByText('Back to Dashboard')).toBeHidden();
            await expect(page.getByText('Activity: Kumon Quiz')).toBeHidden();
            await expectNoPageScrollbar(page);
        });
    }

    test.use({ viewport: DESKTOP });

    test('launches from the hub without legacy parent navigation labels', async ({ page }) => {
        await page.goto('/');

        await page.evaluate(async (learnerName) => {
            const db = await import('/js/database.js');
            await db.seedCustomPins('4321', '2580', learnerName);
        }, LEARNER_NAME);

        await page.getByRole('button', { name: 'Learner Login' }).click();
        await page.getByPlaceholder('Enter PIN').fill('2580');
        await page.getByRole('button', { name: 'Enter' }).click();
        await page.getByRole('button', { name: "Let's Begin" }).click();
        await page.getByTestId('activity-tile-number-bridges').click();

        await expect(page.locator('#game-nav-row')).toBeHidden();
        await expect(page.getByText('Back to Dashboard')).toBeHidden();
        await expect(page.getByText('Activity: Kumon Quiz')).toBeHidden();

        const frame = page.frameLocator('#game-frame');
        await expect(frame.getByRole('heading', { name: 'Number Bridges' })).toBeVisible();
        await expect(frame.getByTestId('number-bridges-question')).toBeVisible();
    });

    test('locks correct rows and scaffolds wrong rows without Check', async ({ page }) => {
        await page.goto('/games/kumonQuiz/');
        await initializeKumonQuiz(page, { firstNumberMax: 10, questionCount: 10 });

        await answerNumberBridgeRow(page, 0, 2);
        await expect(page.getByTestId('number-bridges-local-tick')).toBeVisible();
        await expect(page.getByTestId('number-bridges-answer-input')).toHaveValue('2');
        await expect(page.getByTestId('number-bridges-answer-input')).toBeDisabled();
        await expect(page.getByText(`Great work, ${LEARNER_NAME}!`)).toHaveCount(0);
        await expect(page.getByTestId('number-bridges-question')).toHaveText('1 + 1 =');

        await page.getByTestId('number-bridges-answer-input-1').fill('9');
        await page.keyboard.press('Tab');
        await expect(page.getByTestId('number-bridges-question-1')).toHaveText('2 + 1 =');
        await expect(page.getByTestId('number-bridges-answer-input-1')).toBeEditable();
        await expect(page.getByTestId('number-bridges-answer-input-1')).toHaveClass(/border-amber-400/);
        await expect(page.getByTestId('number-bridges-answer-input-1')).toHaveClass(/shadow-\[/);
        await expect(page.getByTestId('number-bridges-feedback')).toBeEmpty();
        await expect(page.getByTestId('number-bridges-support-text')).toContainText(`You got close, ${LEARNER_NAME}.`);
        await expect(page.getByTestId('number-bridges-support-text')).toContainText('Start with 2. Count one more.');
        await expect(page.getByTestId('number-bridges-support-text')).toContainText('2 → 3');
        await expect(page.getByTestId('number-bridges-support-text')).not.toContainText('+ 0');

        for (const [rowIndex, answer] of [[1, 3], [2, 4], [3, 5], [4, 6]]) {
            await answerNumberBridgeRow(page, rowIndex, answer);
        }

        await expect(page.getByTestId('number-bridges-layout')).toHaveClass(/number-bridges-page-turn/);
        await expect(page.getByTestId('number-bridges-question')).toHaveText('6 + 1 =', { timeout: 1600 });
        await expect(page.getByText('1 + 1 =')).toHaveCount(0);
        await expect(page.getByTestId('number-bridges-answer-input')).toBeFocused();
        await expectNoPageScrollbar(page);
    });

    test('shows completion score and wrong answer list', async ({ page }) => {
        await page.goto('/games/kumonQuiz/');
        await initializeKumonQuiz(page);

        await page.getByTestId('number-bridges-answer-input').fill('3');
        await page.getByTestId('number-bridges-answer-input').press('Enter');
        await expect(page.getByTestId('number-bridges-support-text')).toContainText('Start with 1. Count one more.');
        await expect(page.getByTestId('number-bridges-support-text')).toContainText('1 → 2');

        for (const [rowIndex, answer] of [[0, 2], [1, 3], [2, 4], [3, 5], [4, 6]]) {
            await answerNumberBridgeRow(page, rowIndex, answer);
        }

        await expect(page.getByTestId('number-bridges-results')).toBeVisible();
        await expect(page.getByTestId('siraash-completion-title')).toContainText(`Great work, ${LEARNER_NAME}!`);
        await expect(page.getByTestId('number-bridges-result-level')).toHaveText('Addition L1 (+1 Bridges)');
        await expect(page.getByTestId('number-bridges-total')).toHaveText('Questions: 5');
        await expect(page.getByTestId('number-bridges-correct-total')).toHaveText('Correct / Total: 5 / 5');
        await expect(page.getByTestId('number-bridges-score')).toHaveCount(0);
        await expect(page.getByTestId('number-bridges-accuracy')).toHaveText('Accuracy: 100%');
        await expect(page.getByTestId('number-bridges-time-taken')).toContainText(/Time Taken: \d+ sec/);
        await expect(page.getByTestId('number-bridges-average-time')).toContainText(/Average Time: [\d.]+ sec\/question/);
        await expect(page.getByTestId('number-bridges-hints-used')).toHaveText('Hints Used: 1');
        await expect(page.getByTestId('number-bridges-mistakes-corrected')).toHaveText('Mistakes Corrected: 1');
        await expect(page.getByTestId('number-bridges-review')).toBeVisible();
        await expect(page.getByTestId('number-bridges-wrong-list')).toContainText('1 + 1');
        await expect(page.getByTestId('number-bridges-wrong-list')).toContainText('Attempted: 3');
        await expect(page.getByTestId('number-bridges-wrong-list')).toContainText('Correct: 2');
        await expect(page.getByTestId('number-bridges-wrong-list')).not.toContainText('1 + 1 = 3');
        await expect(page.getByTestId('number-bridges-actions')).toBeVisible();
        await expect(page.getByTestId('number-bridges-next-round-button')).toBeVisible();
        await expect(page.getByTestId('number-bridges-next-round-button')).toHaveText('Try Again');
        await expect(page.getByTestId('number-bridges-home-button')).toBeVisible();
        await expectResultPanelDoesNotScroll(page);
        await expectNoPageScrollbar(page);

        await page.getByTestId('number-bridges-next-round-button').click();
        await expect(page.getByTestId('number-bridges-header-level')).toHaveText('Addition L1');
        await expect(page.getByTestId('number-bridges-question')).toHaveText('1 + 1 =');
    });

    test('advances from Addition L1 to L2 when auto progression is enabled', async ({ page }) => {
        await page.goto('/games/kumonQuiz/');
        await initializeKumonQuiz(page, { autoProgression: true });

        await expect(page.getByTestId('number-bridges-header-level')).toHaveText('Addition L1');

        for (const [rowIndex, answer] of [[0, 2], [1, 3], [2, 4], [3, 5], [4, 6]]) {
            await answerNumberBridgeRow(page, rowIndex, answer);
        }

        await expect(page.getByTestId('number-bridges-results')).toBeVisible();
        await expect(page.getByTestId('number-bridges-result-level')).toHaveText('Addition L1 (+1 Bridges)');

        await page.getByTestId('number-bridges-next-round-button').click();
        await expect(page.getByTestId('number-bridges-header-level')).toHaveText('Addition L2');
        await expect(page.getByTestId('number-bridges-question')).toHaveText('1 + 2 =');
        await expectNoPageScrollbar(page);
    });

    for (const viewport of TEST_VIEWPORTS) {
        test(`keeps result review layout fit at ${viewport.name}`, async ({ page }) => {
            await page.setViewportSize({ width: viewport.width, height: viewport.height });
            await page.goto('/games/kumonQuiz/');
            await initializeKumonQuiz(page, { firstNumberMax: 10, questionCount: 10 });

            await page.getByTestId('number-bridges-answer-input').fill('3');
            await page.getByTestId('number-bridges-answer-input').press('Enter');
            for (const [rowIndex, answer] of [[0, 2], [1, 3], [2, 4], [3, 5], [4, 6]]) {
                await answerNumberBridgeRow(page, rowIndex, answer);
            }
            await expect(page.getByTestId('number-bridges-question')).toHaveText('6 + 1 =', { timeout: 1600 });

            for (const [rowIndex, answer] of [[0, 7], [1, 8], [2, 9], [3, 10], [4, 11]]) {
                await answerNumberBridgeRow(page, rowIndex, answer);
            }

            await expect(page.getByTestId('number-bridges-results')).toBeVisible();
            await expect(page.getByTestId('number-bridges-results')).toHaveCount(1);
            await expect(page.getByTestId('siraash-completion-feedback')).toBeVisible();
            await expect(page.getByTestId('siraash-completion-title')).toContainText(`Great work, ${LEARNER_NAME}!`);
            await expect(page.getByTestId('siraash-completion-message')).toHaveText('You finished your Number Bridges.');
            await expect(page.getByTestId('number-bridges-result-level')).toHaveText('Addition L1 (+1 Bridges)');
            await expect(page.getByTestId('number-bridges-clap-visual')).toContainText('Strong work!');
            await expect(page.getByTestId('number-bridges-metrics')).toBeVisible();
            await expect(page.getByTestId('number-bridges-total')).toHaveText('Questions: 10');
            await expect(page.getByTestId('number-bridges-correct-total')).toHaveText('Correct / Total: 10 / 10');
            await expect(page.getByTestId('number-bridges-score')).toHaveCount(0);
            await expect(page.getByTestId('number-bridges-accuracy')).toHaveText('Accuracy: 100%');
            await expect(page.getByTestId('number-bridges-time-taken')).toContainText(/Time Taken: \d+ sec/);
            await expect(page.getByTestId('number-bridges-average-time')).toContainText(/Average Time: [\d.]+ sec\/question/);
            await expect(page.getByTestId('number-bridges-hints-used')).toHaveText('Hints Used: 1');
            await expect(page.getByTestId('number-bridges-mistakes-corrected')).toHaveText('Mistakes Corrected: 1');
            await expect(page.getByTestId('number-bridges-review')).toBeVisible();
            await expect(page.getByTestId('number-bridges-review-item')).toContainText('1 + 1');
            await expect(page.getByTestId('number-bridges-review-item')).toContainText('Attempted: 3');
            await expect(page.getByTestId('number-bridges-review-item')).toContainText('Correct: 2');
            await expect(page.getByTestId('number-bridges-review-item')).not.toContainText('1 + 1 = 3');
            await expect(page.getByTestId('number-bridges-next-round-button')).toBeVisible();
            await expect(page.getByTestId('number-bridges-home-button')).toBeVisible();
            await expectNumberBridgeResultColumns(page);
            await expectResultPanelDoesNotScroll(page);
            await expectNoPageScrollbar(page);
        });
    }

    test('stacks result summary and review on mobile', async ({ page }) => {
        await page.setViewportSize({ width: MOBILE.width, height: MOBILE.height });
        await page.goto('/games/kumonQuiz/');
        await initializeKumonQuiz(page);

        await page.getByTestId('number-bridges-answer-input').fill('3');
        await page.getByTestId('number-bridges-answer-input').press('Enter');

        for (const [rowIndex, answer] of [[0, 2], [1, 3], [2, 4], [3, 5], [4, 6]]) {
            await answerNumberBridgeRow(page, rowIndex, answer);
        }

        await expect(page.getByTestId('number-bridges-results')).toBeVisible();
        await expect(page.getByTestId('siraash-completion-title')).toContainText(`Great work, ${LEARNER_NAME}!`);
        await expect(page.getByTestId('number-bridges-metrics')).toBeVisible();
        await expect(page.getByTestId('number-bridges-review')).toBeVisible();
        await expect(page.getByTestId('number-bridges-next-round-button')).toBeVisible();
        await expect(page.getByTestId('number-bridges-home-button')).toBeVisible();
        await expectNumberBridgeResultStacks(page);
        await expectResultPanelDoesNotScroll(page);
        await expectNoPageScrollbar(page);
    });

    for (const viewport of TEST_VIEWPORTS) {
        test(`shows count-forward +1 scaffold at ${viewport.name}`, async ({ page }) => {
            await page.setViewportSize({ width: viewport.width, height: viewport.height });
            await page.goto('/games/kumonQuiz/');
            await initializeKumonQuiz(page);

            await page.getByTestId('number-bridges-answer-input-2').fill('5');
            await page.getByTestId('number-bridges-answer-input-2').press('Enter');

            await expect(page.getByTestId('number-bridges-question-2')).toHaveText('3 + 1 =');
            await expect(page.getByTestId('number-bridges-answer-input-2')).toBeEditable();
            await expect(page.getByTestId('number-bridges-answer-input-2')).toBeFocused();
            await expect(page.getByTestId('number-bridges-answer-input-2')).toHaveClass(/border-amber-400/);
            await expect(page.getByTestId('number-bridges-support-text')).toContainText(`You got close, ${LEARNER_NAME}.`);
            await expect(page.getByTestId('number-bridges-support-text')).toContainText('Count one more.');
            await expect(page.getByTestId('number-bridges-support-text')).toContainText('3 → 4');
            await expect(page.getByTestId('number-bridges-support-text')).not.toContainText('+ 0');
            await expectNoPageScrollbar(page);
        });
    }

    test('keeps result page visible and records sane parent dashboard analytics', async ({ page }) => {
        await page.goto('/');

        await page.evaluate(async (learnerName) => {
            const db = await import('/js/database.js');
            await db.clearAllScores();
            await db.seedCustomPins('4321', '2580', learnerName);
        }, LEARNER_NAME);

        await page.getByRole('button', { name: 'Learner Login' }).click();
        await page.getByPlaceholder('Enter PIN').fill('2580');
        await page.getByRole('button', { name: 'Enter' }).click();
        await page.getByRole('button', { name: "Let's Begin" }).click();
        await page.getByTestId('activity-tile-number-bridges').click();

        const frame = page.frameLocator('#game-frame');
        for (const [rowIndex, answer] of [[0, 2], [1, 3], [2, 4], [3, 5], [4, 6]]) {
            await answerNumberBridgeRow(frame, rowIndex, answer);
        }
        await expect(frame.getByTestId('number-bridges-question')).toHaveText('6 + 1 =', { timeout: 1600 });

        for (const [rowIndex, answer] of [[0, 7], [1, 8], [2, 9], [3, 10], [4, 11]]) {
            await answerNumberBridgeRow(frame, rowIndex, answer);
        }

        await expect(frame.getByTestId('number-bridges-results')).toBeVisible();
        await expect(frame.getByTestId('number-bridges-correct-total')).toHaveText('Correct / Total: 10 / 10');
        await expect(frame.getByTestId('number-bridges-all-correct')).toHaveText('All answers correct!');
        await expect(frame.getByTestId('number-bridges-accuracy')).toHaveText('Accuracy: 100%');
        await expect(frame.getByTestId('number-bridges-time-taken')).toContainText(/Time Taken: \d+ sec/);
        await expect(frame.getByTestId('number-bridges-next-round-button')).toBeVisible();
        await expect(frame.getByTestId('number-bridges-home-button')).toBeVisible();
        await expect(page.getByTestId('activity-hub')).toBeHidden();
        await expect(page.locator('#view-game')).toBeVisible();

        await frame.getByTestId('number-bridges-home-button').click();
        await expect(page.getByTestId('activity-hub')).toBeVisible();
        await page.getByRole('button', { name: 'Parent Area' }).click();
        await page.locator('#btn-login-parent').click();
        await page.getByPlaceholder('Enter PIN').fill('4321');
        await page.getByRole('button', { name: 'Enter' }).click();

        const parentReport = page.locator('#parent-report-view');
        await expect(page.getByTestId('parent-tab-dashboard')).toBeVisible();
        await expect(page.getByTestId('parent-tab-administration')).toBeVisible();
        await expect(page.getByTestId('parent-tab-testing')).toBeVisible();
        await expect(page.getByTestId('parent-tab-dashboard')).toHaveAttribute('aria-selected', 'true');
        await expect(page.getByTestId('parent-tab-administration')).toHaveAttribute('aria-selected', 'false');
        await expect(page.getByTestId('parent-tab-testing')).toHaveAttribute('aria-selected', 'false');
        await expect(page.getByTestId('parent-panel-dashboard')).toBeVisible();
        await expect(page.getByTestId('parent-panel-administration')).toBeHidden();
        await expect(page.getByTestId('parent-panel-testing')).toBeHidden();
        await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
        await expect(parentReport).toContainText('Recent Learning Sessions');
        await expect(parentReport).not.toContainText('Session Trial Breakdown');
        await expect(parentReport).toContainText('Kumon Quiz / Number Bridges');
        await expect(parentReport).toContainText('When:');
        await expect(parentReport).toContainText('Addition L1 (+1 Bridges)');
        await expect(parentReport).toContainText('Level: Addition L1 (+1 Bridges)');
        await expect(parentReport).toContainText('Score: 10 / 10');
        await expect(parentReport).toContainText('100%');
        await expect(parentReport).toContainText('Duration:');
        await expect(parentReport).toContainText('Average Time:');
        await expect(parentReport).toContainText('Question Order: Sequential');
        await expect(parentReport).toContainText('Hints: 0');
        await expect(parentReport).toContainText('Corrections: 0');
        await expect(parentReport).toContainText('No corrections needed.');
        await expect(parentReport).toContainText('Future: Cognitive Snapshot');
        await expect(parentReport).toContainText('Future: Learning Signals');
        await expect(parentReport).not.toContainText('10000%');
        await expect(parentReport).not.toContainText('Level: --');
        await expect(parentReport).not.toContainText('Trial-level details remain available');
        await expect(parentReport.locator('table')).toHaveCount(0);
        await expect(page.getByRole('button', { name: 'Test Number Bridges' })).toBeHidden();

        await page.getByTestId('parent-tab-administration').click();
        await expect(page.getByTestId('parent-tab-administration')).toHaveAttribute('aria-selected', 'true');
        await expect(page.getByTestId('parent-panel-dashboard')).toBeHidden();
        await expect(page.getByTestId('parent-panel-administration')).toBeVisible();
        await expect(page.getByTestId('parent-panel-testing')).toBeHidden();
        await expect(page.getByRole('heading', { name: 'Administration' })).toBeVisible();
        await expect(page.locator('#parent-controls-form')).toContainText('Max Level Ceiling');
        await expect(page.getByTestId('number-bridges-config-panel')).toBeVisible();
        await expect(page.getByTestId('number-bridges-config-operation')).toBeVisible();
        await expect(page.getByTestId('number-bridges-config-level')).toBeVisible();
        await expect(page.getByTestId('number-bridges-config-audio-mode')).toHaveValue('false');

        await page.getByTestId('parent-tab-testing').click();
        await expect(page.getByTestId('parent-tab-testing')).toHaveAttribute('aria-selected', 'true');
        await expect(page.getByTestId('parent-panel-dashboard')).toBeHidden();
        await expect(page.getByTestId('parent-panel-administration')).toBeHidden();
        await expect(page.getByTestId('parent-panel-testing')).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Testing' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Test Number Bridges' })).toBeVisible();
        await expectNoPageScrollbar(page, { vertical: true });
    });

    test('persists Number Bridges parent configuration and launches with saved settings', async ({ page }) => {
        await page.setViewportSize({ width: DESKTOP.width, height: DESKTOP.height });
        await page.goto('/');

        await page.evaluate(async (learnerName) => {
            const db = await import('/js/database.js');
            await db.clearAllScores();
            await db.seedCustomPins('4321', '2580', learnerName);
            await db.saveGameConfiguration('kumonQuiz', {
                operation: '+',
                level: 1,
                questionCount: 10,
                questionsPerScreen: 5,
                hintsEnabled: true,
                autoProgression: false,
                questionOrder: 'sequential'
            });
        }, LEARNER_NAME);

        await page.locator('#btn-login-parent').click();
        await page.getByPlaceholder('Enter PIN').fill('4321');
        await page.getByRole('button', { name: 'Enter' }).click();

        await expect(page.getByTestId('number-bridges-active-config')).toContainText('Addition L1 (+1 Bridges)');
        await expect(page.getByTestId('number-bridges-active-config')).toContainText('10 Questions');
        await expect(page.getByTestId('number-bridges-active-config')).toContainText('5 Per Screen');
        await expect(page.getByTestId('number-bridges-active-config')).toContainText('Hints On');
        await expect(page.getByTestId('number-bridges-active-config')).toContainText('Question Order: Sequential');

        await page.getByTestId('parent-tab-administration').click();
        await page.getByTestId('number-bridges-config-operation').selectOption('×');
        await page.getByTestId('number-bridges-config-level').selectOption('2');
        await page.getByTestId('number-bridges-config-question-count').selectOption('20');
        await page.getByTestId('number-bridges-config-questions-per-screen').selectOption('1');
        await page.getByTestId('number-bridges-config-hints').selectOption('false');
        await page.getByTestId('number-bridges-config-audio-mode').selectOption('true');
        await page.getByTestId('number-bridges-config-auto-progression').selectOption('true');
        await page.getByTestId('number-bridges-config-question-order').selectOption('random');

        await expect(page.getByTestId('number-bridges-config-summary')).toContainText('Multiplication L2 (×3 Tables)');
        await expect(page.getByTestId('number-bridges-config-summary')).toContainText('20 Questions');
        await expect(page.getByTestId('number-bridges-config-summary')).toContainText('1 Per Screen');
        await expect(page.getByTestId('number-bridges-config-summary')).toContainText('Hints Off');
        await expect(page.getByTestId('number-bridges-config-summary')).toContainText('Question Order: Random');

        await page.reload();
        await page.locator('#btn-login-parent').click();
        await page.getByPlaceholder('Enter PIN').fill('4321');
        await page.getByRole('button', { name: 'Enter' }).click();

        await expect(page.getByTestId('number-bridges-active-config')).toContainText('Multiplication L2 (×3 Tables)');
        await expect(page.getByTestId('number-bridges-active-config')).toContainText('20 Questions');
        await expect(page.getByTestId('number-bridges-active-config')).toContainText('1 Per Screen');
        await expect(page.getByTestId('number-bridges-active-config')).toContainText('Hints Off');
        await expect(page.getByTestId('number-bridges-active-config')).toContainText('Question Order: Random');

        await page.getByTestId('parent-tab-administration').click();
        await expect(page.getByTestId('number-bridges-config-operation')).toHaveValue('×');
        await expect(page.getByTestId('number-bridges-config-level')).toHaveValue('2');
        await expect(page.getByTestId('number-bridges-config-question-count')).toHaveValue('20');
        await expect(page.getByTestId('number-bridges-config-questions-per-screen')).toHaveValue('1');
        await expect(page.getByTestId('number-bridges-config-hints')).toHaveValue('false');
        await expect(page.getByTestId('number-bridges-config-audio-mode')).toHaveValue('true');
        await expect(page.getByTestId('number-bridges-config-auto-progression')).toHaveValue('true');
        await expect(page.getByTestId('number-bridges-config-question-order')).toHaveValue('random');

        await page.getByTestId('parent-tab-testing').click();
        await page.getByRole('button', { name: 'Test Number Bridges' }).click();

        const frame = page.frameLocator('#game-frame');
        await expect(frame.getByTestId('number-bridges-header-level')).toHaveText('Multiplication L2');
        await expect(frame.locator('#ui-question')).toHaveText('1/20');
        await expect(frame.getByTestId('number-bridges-question')).toContainText('× 3');
        await expect(frame.locator('[data-testid^="number-bridges-answer-input"]')).toHaveCount(1);
    });
});

test.describe('Attribute Explorer viewport smoke', () => {
    for (const viewport of TEST_VIEWPORTS) {
        test(`keeps primary controls visible at ${viewport.name}`, async ({ page }) => {
            await page.setViewportSize({ width: viewport.width, height: viewport.height });
            await page.goto('/games/attributeExplorer/');
            await initializeActivity(page);

            await expect(page.getByLabel('SIRAASH')).toBeVisible();
            await expect(page.getByRole('heading', { name: 'Attribute Explorer' })).toBeVisible();
            await expect(page.getByTestId('same-button')).toBeVisible();
            await expect(page.getByTestId('different-button')).toBeVisible();

            const clueControl = page.getByTestId('clue-control');
            await expect(clueControl).toBeVisible();
            await expect(clueControl).toHaveText(`Need a clue, ${LEARNER_NAME}? 🌱`);
            await expect(clueControl).not.toHaveClass(/help-nudge-active/);
            await expect(page.locator('#feedback-text')).toHaveText('');
            await expectNoPageScrollbar(page);
        });
    }

    test.use({ viewport: DESKTOP });

    test('delays the help nudge without revealing a hint', async ({ page }) => {
        await page.goto('/games/attributeExplorer/');
        await initializeActivity(page);

        const clueControl = page.getByTestId('clue-control');
        await expect(clueControl).toHaveText(`Need a clue, ${LEARNER_NAME}? 🌱`);
        await expect(clueControl).not.toHaveClass(/help-nudge-active/);
        await expect(page.locator('#feedback-text')).toHaveText('');

        await page.waitForTimeout(4700);

        await expect(clueControl).toHaveText(`${LEARNER_NAME}, SIRAASH can help you 🌱`);
        await expect(clueControl).toHaveClass(/help-nudge-active/);
        await expect(page.locator('#feedback-text')).toHaveText('');
    });

    test('shows one success indication before the worksheet result screen', async ({ page }) => {
        await page.goto('/games/attributeExplorer/');
        await initializeActivity(page);

        await answerAttributeExplorerCorrectly(page);
        await expect(page.locator('#feedback-text')).toContainText('Great work!');
        await expect(page.locator('#celebration-burst')).toHaveCount(0);
        await expect(page.getByTestId('attribute-explorer-results')).toHaveCount(0);
        await page.waitForTimeout(1000);
        await expect(page.locator('#feedback-text')).toContainText('Great work!');
        await page.waitForTimeout(500);

        for (let trial = 1; trial < 5; trial++) {
            await answerAttributeExplorerCorrectly(page);
            if (trial < 4) {
                await page.waitForTimeout(1500);
            }
        }

        await expect(page.getByTestId('attribute-explorer-results')).toBeVisible();
        await expect(page.getByTestId('siraash-completion-title')).toContainText(`Great work, ${LEARNER_NAME}!`);
        await expect(page.locator('#attribute-prompt')).toHaveCount(0);
        await expect(page.getByText('LOOK AT COLOR')).toHaveCount(0);
        await expect(page.locator('#item-stage')).toHaveCount(0);
        await expect(page.locator('#clue-control')).toHaveCount(0);
        await expect(page.getByTestId('attribute-explorer-total')).toHaveText('Questions: 5');
        await expect(page.getByTestId('attribute-explorer-correct-total')).toHaveText('Correct / Total: 5 / 5');
        await expect(page.getByTestId('attribute-explorer-accuracy')).toHaveText('Accuracy: 100%');
        await expect(page.getByTestId('attribute-explorer-time-taken')).toContainText(/Time Taken: \d+ sec/);
        await expect(page.getByTestId('attribute-explorer-average-time')).toContainText(/Average Time: [\d.]+ sec\/question/);
        await expect(page.getByTestId('attribute-explorer-hints-used')).toHaveText('Hints Used: 0');
        await expect(page.getByTestId('attribute-explorer-mistakes-corrected')).toHaveText('Mistakes Corrected: 0');
        await expect(page.getByTestId('attribute-explorer-next-round-button')).toHaveText('Try Again');
        await expect(page.getByTestId('attribute-explorer-home-button')).toHaveText('Home');
    });
});

test.describe('Matrix Reasoning viewport smoke', () => {
    for (const viewport of TEST_VIEWPORTS) {
        test(`keeps puzzle and next action visible at ${viewport.name}`, async ({ page }) => {
            await page.setViewportSize({ width: viewport.width, height: viewport.height });
            await page.goto('/games/matrixReasoning/');
            await initializeActivity(page);

            await expect(page.getByLabel('SIRAASH')).toBeVisible();
            await expect(page.getByRole('heading', { name: 'Matrix Reasoning' })).toBeVisible();
            await expect(page.locator('#matrix-grid')).toBeVisible();
            await expect(page.locator('#options-dock button')).toHaveCount(4);
            await expect(page.locator('#options-dock button').first()).toBeVisible();

            const correctOptionIndex = await page.evaluate(() => {
                const { currentProblem } = window.getMatrixState();
                return currentProblem.options.findIndex(option => {
                    if (typeof currentProblem.correctAnswer === 'object') {
                        return option.value === currentProblem.correctAnswer.shape &&
                            option.color === currentProblem.correctAnswer.color;
                    }

                    return option.value === currentProblem.correctAnswer;
                });
            });

            expect(correctOptionIndex).toBeGreaterThanOrEqual(0);
            await page.locator('#options-dock button').nth(correctOptionIndex).click();
            await expect(page.getByTestId('siraash-feedback')).toContainText('Great work!');
            await expect(page.getByTestId('siraash-feedback')).toContainText('You found the answer.');
            await expect(page.getByTestId('matrix-next-button')).toBeVisible();
            await expectNoPageScrollbar(page);
        });
    }
});

test.describe('Directions viewport smoke', () => {
    for (const viewport of TEST_VIEWPORTS) {
        test(`keeps layout visible at ${viewport.name}`, async ({ page }) => {
            await page.setViewportSize({ width: viewport.width, height: viewport.height });
            await page.goto('/games/directions/');
            await initializeActivity(page);

            await expect(page.getByLabel('SIRAASH')).toBeVisible();
            await expect(page.locator('header h1')).toHaveText('Directions');
            await expect(page.getByTestId('directions-card-grid')).toBeVisible();
            await expect(page.locator('[data-choice]')).toHaveCount(4);
            await expectNoPageScrollbar(page);
        });
    }

    test.use({ viewport: DESKTOP });

    test('clicking a direction choice records a validation result without breaking layout', async ({ page }) => {
        await page.goto('/games/directions/');
        await initializeActivity(page);

        // Read which direction the game is asking for from the instruction text
        const instructionText = await page.locator('[data-testid="worksheet-instruction"]').textContent();
        const directionMap = { Up: 'up', Down: 'down', Left: 'left', Right: 'right' };
        const match = Object.keys(directionMap).find(label => instructionText.includes(label));
        const targetDir = directionMap[match] || 'up';

        // Click the correct choice button
        await page.locator(`[data-choice="${targetDir}"]`).click();

        // Grid should now carry data-result=correct
        await expect(page.getByTestId('directions-card-grid')).toHaveAttribute('data-result', 'correct');
        await expect(page.getByTestId('directions-card-grid')).toHaveAttribute('data-selected', targetDir);

        // Layout must remain intact after click
        await expect(page.locator('[data-choice]')).toHaveCount(4);
        await expectNoPageScrollbar(page);
    });

    test('correct selection shows success feedback banner', async ({ page }) => {
        await page.goto('/games/directions/');
        await initializeActivity(page);

        const instructionText = await page.locator('[data-testid="worksheet-instruction"]').textContent();
        const directionMap = { Up: 'up', Down: 'down', Left: 'left', Right: 'right' };
        const match = Object.keys(directionMap).find(label => instructionText.includes(label));
        const targetDir = directionMap[match] || 'up';

        await page.locator(`[data-choice="${targetDir}"]`).click();

        // SIRAASH success feedback banner should appear
        await expect(page.getByTestId('siraash-feedback')).toBeVisible();
        await expect(page.getByTestId('siraash-feedback')).toHaveClass(/siraash-feedback--success/);
        await expect(page.getByTestId('siraash-feedback')).toContainText('Great work!');

        // No duplicate feedback elements
        await expect(page.getByTestId('siraash-feedback')).toHaveCount(1);
        await expectNoPageScrollbar(page);
    });

    test('wrong selection shows gentle mistake feedback without red or harsh error', async ({ page }) => {
        await page.goto('/games/directions/');
        await initializeActivity(page);

        const instructionText = await page.locator('[data-testid="worksheet-instruction"]').textContent();
        const directionMap = { Up: 'up', Down: 'down', Left: 'left', Right: 'right' };
        const match = Object.keys(directionMap).find(label => instructionText.includes(label));
        const targetDir = directionMap[match] || 'up';

        // Pick a wrong direction (different from target)
        const allDirs = ['up', 'down', 'left', 'right'];
        const wrongDir = allDirs.find(d => d !== targetDir);

        await page.locator(`[data-choice="${wrongDir}"]`).click();

        // Grid carries data-result=incorrect
        await expect(page.getByTestId('directions-card-grid')).toHaveAttribute('data-result', 'incorrect');

        // SIRAASH mistake feedback banner should appear (amber/gentle — not red)
        await expect(page.getByTestId('siraash-feedback')).toBeVisible();
        await expect(page.getByTestId('siraash-feedback')).toHaveClass(/siraash-feedback--mistake/);

        // No duplicate feedback elements
        await expect(page.getByTestId('siraash-feedback')).toHaveCount(1);
        await expectNoPageScrollbar(page);
    });
});

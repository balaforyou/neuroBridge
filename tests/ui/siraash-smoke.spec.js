const { test, expect } = require('@playwright/test');

const DESKTOP = { name: 'desktop 1366x768', width: 1366, height: 768 };
const TABLET_LANDSCAPE = { name: 'tablet landscape 1024x768', width: 1024, height: 768 };
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
        await expect(page.getByText('Matching Worksheet')).toBeVisible();
        await expect(page.getByTestId('activity-tile-pattern-detective')).toBeVisible();
        await expect(page.getByTestId('activity-tile-look-closely')).toBeVisible();
        await expect(page.getByText('Coming Soon').first()).toBeVisible();
        await expect(page.getByText('Coming Soon')).toHaveCount(3);
        await expectNoPageScrollbar(page, { vertical: true });
    });
});

test.describe('Matching Worksheet viewport smoke', () => {
    for (const viewport of TEST_VIEWPORTS) {
        test(`keeps worksheet zones and cards visible at ${viewport.name}`, async ({ page }) => {
            await page.setViewportSize({ width: viewport.width, height: viewport.height });
            await page.goto('/games/matchingWorksheet/');

            await expect(page.getByTestId('matching-worksheet')).toBeVisible();
            await expect(page.getByTestId('worksheet-instruction')).toBeVisible();
            await expect(page.getByTestId('worksheet-activity')).toBeVisible();
            await expect(page.getByTestId('worksheet-help')).toBeVisible();
            await expect(page.getByTestId('worksheet-feedback')).toBeVisible();
            await expect(page.getByTestId('worksheet-celebration')).toHaveAttribute('data-enabled', 'false');
            await expect(page.getByTestId('matching-card-apple-a')).toBeVisible();
            await expect(page.getByTestId('worksheet-hint-button')).toBeVisible();
            await expectNoPageScrollbar(page);
        });
    }
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

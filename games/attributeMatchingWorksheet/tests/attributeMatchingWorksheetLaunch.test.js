import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { COLOR_ATTRIBUTE_QUESTIONS } from '../game.js';

const ACTIVITY_URL = 'http://127.0.0.1:5501/games/attributeMatchingWorksheet/index.html';

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
    throw new Error('Static server did not start for Attribute Matching launch test');
}

async function isServerReady() {
    try {
        const response = await fetch(ACTIVITY_URL);
        return response.ok;
    } catch {
        return false;
    }
}

async function testAttributeMatchingLearnerFlow() {
    const server = await ensureStaticServer();
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 900, height: 760 } });

    try {
        await page.goto(ACTIVITY_URL);
        await page.getByTestId('attribute-matching-worksheet').waitFor();

        assert(await page.title() === 'Matching Worksheets', 'Page title should show Matching Worksheets');
        assert((await page.locator('h1').innerText()) === 'Matching Worksheets', 'Activity launcher header should show Matching Worksheets');
        assert((await page.getByText('Attribute Matching V1').count()) >= 1, 'Activity shell should launch Attribute Matching V1');
        assert(await page.getByTestId('attribute-matching-question').isVisible(), 'Question screen should render');
        assert(await page.getByTestId('attribute-matching-prompt-label').innerText() === 'Red Apple', 'First prompt should render');
        assert(await page.getByTestId('attribute-matching-progress').innerText() === 'Question 1 of 10', 'Progress should show question count');
        assert(await page.locator('[data-answer]').count() === 3, 'Question should render three answer choices');
        await assertCenteredWorksheetStage(page);

        await page.getByTestId('attribute-choice-blue').click();
        assert(await page.getByTestId('attribute-matching-feedback').innerText() === 'Let\'s look again.', 'First incorrect answer should show retry feedback');

        await page.getByTestId('attribute-choice-blue').click();
        assert(await page.getByTestId('attribute-matching-feedback').innerText() === 'What color do you see?', 'Second incorrect answer should show contextual hint');

        await page.getByTestId('attribute-choice-blue').click();
        assert((await page.getByTestId('attribute-matching-feedback').innerText()).includes('Look at the color'), 'Third incorrect answer should show visual hint copy');

        await page.getByTestId('attribute-choice-blue').click();
        assert(await page.getByTestId('attribute-matching-feedback').innerText() === 'The answer is Red.', 'Fourth incorrect answer should reveal correct answer');

        const answers = COLOR_ATTRIBUTE_QUESTIONS.map(question => question.correctAnswer);
        for (let index = 0; index < answers.length - 1; index += 1) {
            await answerQuestion(page, answers[index], `Question ${index + 2} of ${answers.length}`);
        }
        await answerFinalQuestion(page, answers[answers.length - 1]);

        await page.getByTestId('attribute-matching-completion').waitFor();
        const completionText = await page.getByTestId('attribute-matching-completion').innerText();
        assert(completionText.includes('Great work, Adarsh!'), 'Completion should show learner success message');
        assert(completionText.includes('100% Accuracy'), 'Completion should show accuracy percentage');
        assert(completionText.includes('10 Questions Answered'), 'Completion should show questions answered');
        assert(completionText.includes('10 Correct Answers'), 'Completion should show correct answers');
        assert(await page.getByTestId('attribute-matching-question').isVisible() === false, 'Completion should hide active question screen');
    } finally {
        await browser.close();
        if (server) {
            server.kill();
        }
    }

    console.log('Attribute Matching learner flow launch test passed');
}

async function assertCenteredWorksheetStage(page) {
    assert(await page.getByTestId('attribute-matching-stage').count() === 1, 'Worksheet stage should render once');

    const layout = await page.evaluate(() => {
        const activity = document.querySelector('[data-testid="worksheet-activity"]');
        const stage = document.querySelector('[data-testid="attribute-matching-stage"]');
        const promptCard = document.querySelector('[data-testid="attribute-matching-prompt-card"]');
        const choices = document.querySelector('[data-testid="attribute-matching-choices"]');

        const activityRect = activity.getBoundingClientRect();
        const stageRect = stage.getBoundingClientRect();
        const promptRect = promptCard.getBoundingClientRect();
        const choicesRect = choices.getBoundingClientRect();

        return {
            activityCenter: activityRect.left + (activityRect.width / 2),
            stageCenter: stageRect.left + (stageRect.width / 2),
            stageWidth: stageRect.width,
            promptInsideStage: promptCard.parentElement === stage,
            choicesInsideStage: choices.parentElement === stage,
            promptWidthMatchesStage: Math.abs(promptRect.width - stageRect.width) < 2,
            choicesWidthMatchesStage: Math.abs(choicesRect.width - stageRect.width) < 2
        };
    });

    assert(Math.abs(layout.stageCenter - layout.activityCenter) < 4, 'Worksheet stage should be centered in activity panel');
    assert(layout.stageWidth <= 960, 'Worksheet stage should keep a constrained learner-task width');
    assert(layout.promptInsideStage, 'Prompt card should render inside centered stage');
    assert(layout.choicesInsideStage, 'Answer choices should render inside centered stage');
    assert(layout.promptWidthMatchesStage, 'Prompt card should align to stage width');
    assert(layout.choicesWidthMatchesStage, 'Answer choices should align to stage width');
}

async function answerQuestion(page, answer, expectedProgress) {
    await page.getByTestId(`attribute-choice-${answer.toLowerCase()}`).click();
    await page.getByTestId('attribute-matching-progress').waitFor({
        state: 'visible'
    });
    await page.waitForFunction(
        expected => document.querySelector('[data-testid="attribute-matching-progress"]')?.textContent === expected,
        expectedProgress
    );
}

async function answerFinalQuestion(page, answer) {
    await page.getByTestId(`attribute-choice-${answer.toLowerCase()}`).click();
    await page.getByTestId('attribute-matching-completion').waitFor();
}

async function runAllTests() {
    console.log('=== Attribute Matching Worksheet Launch Tests ===');
    await testAttributeMatchingLearnerFlow();
    console.log('=== All Attribute Matching Worksheet Launch Tests Passed ===');
}

export { runAllTests };

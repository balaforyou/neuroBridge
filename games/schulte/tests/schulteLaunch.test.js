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

        await page.getByTestId('schulte-start-next-mode').click();
        assert(await page.getByTestId('schulte-mode-label').innerText() === 'Mode: Listen & Find', 'Continue should move to Listen & Find mode');
        assert(await page.getByTestId('schulte-board-counter').innerText() === 'Board 1 / 2', 'Listen & Find should restart board context');
        await assertSingleFindPrompt(page, 'Find 1');

        await page.locator('[data-schulte-number="2"]').click();
        await assertSingleFindPrompt(page, 'Find 1');

        await page.locator('[data-schulte-number="1"]').click();
        await assertSingleFindPrompt(page, 'Find 2');

        for (let board = 0; board < 2; board += 1) {
            const startValue = board === 0 ? 2 : 1;
            for (let value = startValue; value <= 9; value += 1) {
                await page.locator(`[data-schulte-number="${value}"]`).click();
            }

            if (board === 0) {
                assert(await page.getByTestId('schulte-mode-label').innerText() === 'Mode: Listen & Find', 'Listen & Find should stay in mode after first board');
                assert(await page.getByTestId('schulte-board-counter').innerText() === 'Board 2 / 2', 'Listen & Find should advance to second board');
                await assertSingleFindPrompt(page, 'Find 1');
            }
        }

        await page.getByTestId('schulte-completion').waitFor();
        assert(
            (await page.getByTestId('schulte-completion').innerText()).includes('Great work! You finished Schulte Table.'),
            'Final completion should show Schulte Table after ascending, descending, and Listen & Find sessions complete'
        );
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

async function runAllTests() {
    console.log('=== Schulte Launch Tests ===');
    await testAutomaticAscendingToDescendingFlow();
    console.log('=== All Schulte Launch Tests Passed ===');
}

export { runAllTests };

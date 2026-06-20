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

        assert(await page.getByTestId('schulte-mode-controls').count() === 0, 'Learner path should not show manual mode selector');
        assert(await page.getByTestId('schulte-mode-label').innerText() === 'Mode: Ascending', 'Flow should start in Ascending mode');
        assert(await page.getByTestId('schulte-target').innerText() === 'Find 1', 'Ascending mode should start at 1');

        for (let board = 0; board < 2; board += 1) {
            for (let value = 1; value <= 9; value += 1) {
                await page.locator(`[data-schulte-number="${value}"]`).click();
            }
        }

        assert(await page.getByTestId('schulte-completion').count() === 0, 'Final completion should not show after ascending only');
        await page.getByTestId('schulte-descending-transition').waitFor();
        assert(
            (await page.getByTestId('schulte-descending-transition').innerText()).includes('Great work! Now let\'s try descending.'),
            'Transition should praise before descending'
        );
        assert(
            (await page.getByTestId('schulte-descending-transition').innerText()).includes('Start from 9 and go backwards.'),
            'Transition should explain descending start'
        );
        assert(await page.getByTestId('schulte-mode-label').innerText() === 'Mode: Ascending', 'Transition should appear before descending starts');

        await page.getByTestId('schulte-start-descending').click();
        assert(await page.getByTestId('schulte-mode-label').innerText() === 'Mode: Descending', 'Continue should move to Descending mode');
        assert(await page.getByTestId('schulte-target').innerText() === 'Find 9', 'Descending mode should start at 9');

        await page.locator('[data-schulte-number="8"]').click();
        assert(await page.getByTestId('schulte-target').innerText() === 'Find 9', 'Wrong descending selection should not advance target');

        for (let board = 0; board < 2; board += 1) {
            for (let value = 9; value >= 1; value -= 1) {
                await page.locator(`[data-schulte-number="${value}"]`).click();
            }
        }

        await page.getByTestId('schulte-completion').waitFor();
        assert(
            (await page.getByTestId('schulte-completion').innerText()).includes('Great work!'),
            'Final completion should show after ascending and descending sessions complete'
        );
    } finally {
        await browser.close();
        if (server) {
            server.kill();
        }
    }

    console.log('Schulte automatic ascending-to-descending flow test passed');
}

async function runAllTests() {
    console.log('=== Schulte Launch Tests ===');
    await testAutomaticAscendingToDescendingFlow();
    console.log('=== All Schulte Launch Tests Passed ===');
}

export { runAllTests };

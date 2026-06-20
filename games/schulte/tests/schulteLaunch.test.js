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

async function testDescendingModeCanBeSelectedAndPlayed() {
    const server = await ensureStaticServer();
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1000, height: 800 } });

    try {
        await page.goto('http://127.0.0.1:5501/games/schulte/index.html');
        await page.getByTestId('schulte-activity').waitFor();

        await page.getByTestId('schulte-mode-descending').click();
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
            'Descending mode should complete two-board session'
        );
    } finally {
        await browser.close();
        if (server) {
            server.kill();
        }
    }

    console.log('Schulte descending launch mode test passed');
}

async function runAllTests() {
    console.log('=== Schulte Launch Tests ===');
    await testDescendingModeCanBeSelectedAndPlayed();
    console.log('=== All Schulte Launch Tests Passed ===');
}

export { runAllTests };

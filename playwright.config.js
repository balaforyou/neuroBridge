const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
    testDir: './tests/ui',
    fullyParallel: false,
    reporter: [['list']],
    timeout: 30000,
    use: {
        baseURL: 'http://127.0.0.1:5501',
        trace: 'retain-on-failure'
    },
    webServer: {
        command: 'npm run serve',
        url: 'http://127.0.0.1:5501',
        reuseExistingServer: true,
        timeout: 120000
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] }
        }
    ]
});

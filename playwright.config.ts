import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,

    reporter: [
        ['list'],
        ['html'],
        [
            'playwright-qase-reporter',
            {
                testops: {
                    api: {
                        token: process.env.QASE_API_TOKEN, // Add your Qase API token here or in env
                    },
                    project: process.env.QASE_PROJECT_CODE || 'CART', // replace CART with your Qase project code
                    run: {
                        complete: true,
                    },
                    uploadAttachments: true,
                },
                debug: false,
            },
        ],
    ],

    use: {
        baseURL: 'http://localhost:5173',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
    },

    projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
        { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
        { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    ],

    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:5173',
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000,
    },
});

import { defineConfig } from '@playwright/test';

export default defineConfig({
  webServer: {
    command: 'npx serve . --listen 3000',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:3000',
    browserName: 'chromium',
  },
  projects: [
    { name: 'unit', testMatch: 'tests/unit/**/*.spec.js' },
    { name: 'integration', testMatch: 'tests/integration/**/*.spec.js' },
    { name: 'edge-cases', testMatch: 'tests/edge-cases/**/*.spec.js' },
    {
      name: 'visual',
      testMatch: 'tests/visual/**/*.spec.js',
      expect: { toHaveScreenshot: { maxDiffPixels: 10 } },
    },
  ],
  reporter: [['html', { outputFolder: 'playwright-report' }]],
});

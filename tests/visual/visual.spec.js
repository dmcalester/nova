import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const EDGE_CASES_DIR = path.join(process.cwd(), 'tests', 'edge-cases');

const edgeCaseFiles = fs.readdirSync(EDGE_CASES_DIR)
  .filter(f => f.endsWith('.html'))
  .sort();

for (const file of edgeCaseFiles) {
  test(`visual: ${file}`, async ({ page }) => {
    await page.goto(`/tests/edge-cases/${file}`);
    // Wait for all nova-* elements to be defined
    await page.waitForFunction(() => {
      const elements = document.querySelectorAll('nova-ordinal-date, nova-duration, nova-datetime, nova-temporal-group, nova-clock');
      return [...elements].every(el => el.shadowRoot !== null);
    });
    await page.waitForTimeout(100); // allow any reactive updates
    await expect(page).toHaveScreenshot(`${file}.png`, {
      fullPage: true,
      maxDiffPixels: 10,
    });
  });
}

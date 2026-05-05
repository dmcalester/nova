import { test, expect } from '../helpers/coverage.js';

test.beforeEach(async ({ page }) => {
  await page.goto('/tests/fixtures/nova-clock.html');
  await page.waitForFunction(() => customElements.get('nova-clock') !== undefined);
  await page.waitForTimeout(100);
});

test('stopped clock does not change display over time', async ({ page }) => {
  const text1 = await page.evaluate(() => document.querySelector('#el-stopped').shadowRoot?.textContent?.trim() ?? '');
  await page.waitForTimeout(1200);
  const text2 = await page.evaluate(() => document.querySelector('#el-stopped').shadowRoot?.textContent?.trim() ?? '');
  expect(text1).toBe(text2);
  expect(text1.length).toBeGreaterThan(0);
});

test('show-date prepends ordinal date pattern', async ({ page }) => {
  const text = await page.evaluate(() => document.querySelector('#el-with-date').shadowRoot?.textContent?.trim() ?? '');
  // Format: YYYY-DDD (no T separator) followed by time
  expect(text).toMatch(/^\d{4}-\d{3}/);
  expect(text).toMatch(/\d{2}:\d{2}:\d{2}/);
});

test('live clock display is non-empty', async ({ page }) => {
  const text = await page.evaluate(() => document.querySelector('#el-live').shadowRoot?.textContent?.trim() ?? '');
  expect(text.length).toBeGreaterThan(0);
  expect(text).toMatch(/\d{2}:\d{2}:\d{2}/);
});

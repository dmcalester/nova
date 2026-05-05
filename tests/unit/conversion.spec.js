import { test, expect } from '../helpers/coverage.js';

test.beforeEach(async ({ page }) => {
  await page.goto('/tests/fixtures/nova-temporal-utils.html');
  await page.waitForFunction(() => window.__temporalReady === true);
});

test('clampDay: Jan 31 → Feb clamps to 28 in non-leap year', async ({ page }) => {
  const r = await page.evaluate(() => window.clampDay(2025, 2, 31));
  expect(r).toBe(28);
});

test('clampDay: Jan 31 → Feb clamps to 29 in leap year', async ({ page }) => {
  const r = await page.evaluate(() => window.clampDay(2024, 2, 31));
  expect(r).toBe(29);
});

test('clampDay: valid day is unchanged', async ({ page }) => {
  const r = await page.evaluate(() => window.clampDay(2026, 4, 15));
  expect(r).toBe(15);
});

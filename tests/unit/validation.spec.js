import { test, expect } from '../helpers/coverage.js';

test.beforeEach(async ({ page }) => {
  await page.goto('/tests/fixtures/nova-temporal-utils.html');
  await page.waitForFunction(() => window.__temporalReady === true);
});

const call = (page, fn, ...args) => page.evaluate(([f, a]) => window[f](...a), [fn, args]);

test('daysInMonth: January has 31 days', async ({ page }) => {
  expect(await call(page, 'daysInMonth', 2026, 1)).toBe(31);
});
test('daysInMonth: April has 30 days', async ({ page }) => {
  expect(await call(page, 'daysInMonth', 2026, 4)).toBe(30);
});
test('daysInMonth: Feb has 28 days in non-leap year', async ({ page }) => {
  expect(await call(page, 'daysInMonth', 2025, 2)).toBe(28);
});
test('daysInMonth: Feb has 29 days in leap year', async ({ page }) => {
  expect(await call(page, 'daysInMonth', 2024, 2)).toBe(29);
});

test('daysInYear: non-leap year has 365', async ({ page }) => {
  expect(await call(page, 'daysInYear', 2025)).toBe(365);
});
test('daysInYear: leap year has 366', async ({ page }) => {
  expect(await call(page, 'daysInYear', 2024)).toBe(366);
});

import { test, expect } from '../helpers/coverage.js';

test.beforeEach(async ({ page }) => {
  await page.goto('/tests/fixtures/form-association.html');
  await page.waitForFunction(() => customElements.get('nova-datetime') !== undefined);
});

test('form submits correct FormData entries', async ({ page }) => {
  const data = await page.evaluate(() => Object.fromEntries(new FormData(document.querySelector('form'))));
  expect(data.obs_date).toBe('2026-099'); // 2026-04-09 in ordinal form
  expect(data.obs_datetime).toBe('2026-04-09T14:30:00Z');
  expect(data.obs_duration).toBeTruthy();
});

test('form.checkValidity() fails when required component is empty', async ({ page }) => {
  await page.evaluate(() => { document.querySelector('[name="obs_date"]').value = ''; });
  const valid = await page.evaluate(() => document.querySelector('form').checkValidity());
  expect(valid).toBe(false);
});

test('formResetCallback clears value', async ({ page }) => {
  await page.evaluate(() => { document.querySelector('[name="obs_date"]').value = '2030-01-01'; });
  await page.evaluate(() => document.querySelector('form').reset());
  await page.waitForTimeout(50);
  const val = await page.evaluate(() => document.querySelector('[name="obs_date"]').value);
  // After reset, value should return to initial value or empty
  expect(val === '2026-099' || val === '').toBe(true);
});

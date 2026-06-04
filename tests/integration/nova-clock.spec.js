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

test('nova-clock: zone="-05:00" displays UTC minus five hours', async ({ page }) => {
  await page.goto('/tests/fixtures/nova-clock.html');
  const result = await page.evaluate(() => {
    document.body.innerHTML = '<nova-clock zone="-05:00" smallest-unit="second"></nova-clock>';
    const el = document.querySelector('nova-clock');
    const utcHour = Temporal.Now.instant().toZonedDateTimeISO('UTC').hour;
    const displayedTime = el.shadowRoot.querySelector('.time').textContent;
    return { utcHour, displayedTime };
  });
  // Displayed hour should be (utcHour - 5 + 24) % 24
  const expectedHour = (result.utcHour - 5 + 24) % 24;
  expect(result.displayedTime.startsWith(String(expectedHour).padStart(2, '0'))).toBe(true);
});

test('nova-clock: zone="+09:30" shows half-hour offset in time', async ({ page }) => {
  await page.goto('/tests/fixtures/nova-clock.html');
  const result = await page.evaluate(() => {
    document.body.innerHTML = '<nova-clock zone="+09:30" smallest-unit="minute"></nova-clock>';
    const el = document.querySelector('nova-clock');
    const utcMin = Temporal.Now.instant().toZonedDateTimeISO('UTC').minute;
    const displayedTime = el.shadowRoot.querySelector('.time').textContent;
    return { utcMin, displayedTime };
  });
  const m = parseInt(result.displayedTime.split(':')[1], 10);
  expect(m).toBe((result.utcMin + 30) % 60);
});

test('nova-clock: IANA zone reports invalid-zone', async ({ page }) => {
  await page.goto('/tests/fixtures/nova-clock.html');
  const code = await page.evaluate(async () => {
    return new Promise((resolve) => {
      document.addEventListener('nova-error', (e) => resolve(e.detail.code), { once: true });
      document.body.innerHTML = '<nova-clock zone="America/Denver"></nova-clock>';
    });
  });
  expect(code).toBe('invalid-zone');
});

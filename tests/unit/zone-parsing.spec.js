import { test, expect } from '../helpers/coverage.js';

test.beforeEach(async ({ page }) => {
  await page.goto('/tests/fixtures/nova-temporal-utils.html');
  await page.waitForFunction(() => window.__temporalReady === true);
});

const call = (page, fn, ...args) => page.evaluate(
  ([f, a]) => window[f](...a), [fn, args]
);

test('parseZone: "Z" returns "UTC"', async ({ page }) => {
  expect(await call(page, 'parseZone', 'Z')).toBe('UTC');
});

test('parseZone: lowercase "z" returns "UTC"', async ({ page }) => {
  expect(await call(page, 'parseZone', 'z')).toBe('UTC');
});

test('parseZone: military letter "A" returns "+01:00"', async ({ page }) => {
  expect(await call(page, 'parseZone', 'A')).toBe('+01:00');
});

test('parseZone: military letter "N" returns "-01:00"', async ({ page }) => {
  expect(await call(page, 'parseZone', 'N')).toBe('-01:00');
});

test('parseZone: military letter "M" returns "+12:00"', async ({ page }) => {
  expect(await call(page, 'parseZone', 'M')).toBe('+12:00');
});

test('parseZone: military letter "J" is excluded', async ({ page }) => {
  expect(await call(page, 'parseZone', 'J')).toBe(null);
});

test('parseZone: numeric offset "+05:00" passes through', async ({ page }) => {
  expect(await call(page, 'parseZone', '+05:00')).toBe('+05:00');
});

test('parseZone: numeric offset "-09:30" passes through', async ({ page }) => {
  expect(await call(page, 'parseZone', '-09:30')).toBe('-09:30');
});

test('parseZone: IANA name returns null', async ({ page }) => {
  expect(await call(page, 'parseZone', 'America/Denver')).toBe(null);
});

test('parseZone: empty string returns null', async ({ page }) => {
  expect(await call(page, 'parseZone', '')).toBe(null);
});

test('parseZone: garbage returns null', async ({ page }) => {
  expect(await call(page, 'parseZone', 'XYZ')).toBe(null);
});

test('parseZone: bad numeric "+25:00" returns null', async ({ page }) => {
  expect(await call(page, 'parseZone', '+25:00')).toBe(null);
});

test('parseZone: result is accepted by Temporal.Instant.toZonedDateTimeISO', async ({ page }) => {
  const ok = await page.evaluate(() => {
    const zone = window.parseZone('+05:00');
    try {
      Temporal.Instant.from('2026-02-09T14:30:00Z').toZonedDateTimeISO(zone);
      return true;
    } catch { return false; }
  });
  expect(ok).toBe(true);
});

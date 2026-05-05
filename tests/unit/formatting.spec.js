import { test, expect } from '../helpers/coverage.js';

test.beforeEach(async ({ page }) => {
  await page.goto('/tests/fixtures/nova-temporal-utils.html');
  await page.waitForFunction(() => window.__temporalReady === true);
});

const call = (page, fn, ...args) => page.evaluate(
  ([f, a]) => window[f](...a), [fn, args]
);

test('formatTime: minute smallest-unit omits seconds', async ({ page }) => {
  const r = await call(page, 'formatTime', { hour: 14, minute: 30, second: 45 }, 'minute');
  expect(r).toBe('14:30');
});

test('formatTime: second smallest-unit omits sub-seconds', async ({ page }) => {
  const r = await call(page, 'formatTime', { hour: 14, minute: 30, second: 45, millisecond: 123 }, 'second');
  expect(r).toBe('14:30:45');
});

test('formatTime: millisecond smallest-unit formats 3 fractional digits', async ({ page }) => {
  const r = await call(page, 'formatTime', { hour: 14, minute: 30, second: 45, millisecond: 123 }, 'millisecond');
  expect(r).toBe('14:30:45.123');
});

test('formatTime: nanosecond smallest-unit formats 9 fractional digits', async ({ page }) => {
  const r = await call(page, 'formatTime', { hour: 14, minute: 30, second: 45, millisecond: 123, microsecond: 456, nanosecond: 789 }, 'nanosecond');
  expect(r).toBe('14:30:45.123456789');
});

test('formatTime: nanosecond has no floating-point drift', async ({ page }) => {
  const r = await call(page, 'formatTime', { hour: 0, minute: 0, second: 0, millisecond: 100, microsecond: 100, nanosecond: 100 }, 'nanosecond');
  expect(r).toBe('00:00:00.100100100');
});

test('formatCalendarDate round-trip', async ({ page }) => {
  const r = await page.evaluate(() => {
    const parsed = window.parseCalendarDate('2026-04-09');
    return window.formatCalendarDate(parsed);
  });
  expect(r).toBe('2026-04-09');
});

test('formatOrdinalDate round-trip', async ({ page }) => {
  const r = await page.evaluate(() => {
    const parsed = window.parseOrdinalDate('2026-099');
    return window.formatOrdinalDate(parsed);
  });
  expect(r).toBe('2026-099');
});

test('formatDuration: second smallest-unit', async ({ page }) => {
  const r = await call(page, 'formatDuration', { days: 0, hours: 1, minutes: 30, seconds: 45 }, 'second');
  expect(r).toBe('PT1H30M45S');
});

test('formatDuration: nanosecond smallest-unit preserves 9 digits', async ({ page }) => {
  const r = await call(page, 'formatDuration', { days: 0, hours: 0, minutes: 0, seconds: 4, milliseconds: 567, microseconds: 891, nanoseconds: 234 }, 'nanosecond');
  expect(r).toBe('PT4.567891234S');
});

test('formatDurationHuman: formats human-readable string', async ({ page }) => {
  const r = await call(page, 'formatDurationHuman', { days: 1, hours: 2, minutes: 30, seconds: 0 });
  expect(r).toBe('1d 2h 30m');
});

test('formatDurationHuman: zero duration returns "0s"', async ({ page }) => {
  const r = await call(page, 'formatDurationHuman', { days: 0, hours: 0, minutes: 0, seconds: 0 });
  expect(r).toBe('0s');
});

// ── formatCalendarDate: strict validation ───────────────────────────────────

test('formatCalendarDate: throws on invalid month', async ({ page }) => {
  const threw = await page.evaluate(() => {
    try {
      window.formatCalendarDate({ year: 2026, month: 13, day: 1 });
      return false;
    } catch {
      return true;
    }
  });
  expect(threw).toBe(true);
});

test('formatCalendarDate: throws on invalid day for month', async ({ page }) => {
  const threw = await page.evaluate(() => {
    try {
      window.formatCalendarDate({ year: 2026, month: 2, day: 31 });
      return false;
    } catch {
      return true;
    }
  });
  expect(threw).toBe(true);
});

test('formatCalendarDate: still accepts valid records', async ({ page }) => {
  const s = await page.evaluate(() =>
    window.formatCalendarDate({ year: 2026, month: 2, day: 9 }),
  );
  expect(s).toBe('2026-02-09');
});

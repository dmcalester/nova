import { test, expect } from '../helpers/coverage.js';

test.beforeEach(async ({ page }) => {
  await page.goto('/tests/fixtures/nova-temporal-utils.html');
  await page.waitForFunction(() => window.__temporalReady === true);
});

const call = (page, fn, ...args) => page.evaluate(
  ([f, a]) => window[f](...a), [fn, args]
);

test('parseTime: accepts HH:MM:SS', async ({ page }) => {
  const r = await call(page, 'parseTime', '14:30:45');
  expect(r).toMatchObject({ hour: 14, minute: 30, second: 45 });
});

test('parseTime: accepts HH:MM:SS.fffffffff', async ({ page }) => {
  const r = await call(page, 'parseTime', '23:59:59.123456789');
  expect(r).toMatchObject({ hour: 23, minute: 59, second: 59, millisecond: 123, microsecond: 456, nanosecond: 789 });
});

test('parseTime: strips leading T and trailing Z', async ({ page }) => {
  const r = await call(page, 'parseTime', 'T14:30:00Z');
  expect(r).toMatchObject({ hour: 14, minute: 30, second: 0 });
});

test('parseTime: midnight is valid', async ({ page }) => {
  const r = await call(page, 'parseTime', '00:00:00Z');
  expect(r).toMatchObject({ hour: 0, minute: 0, second: 0 });
});

test('parseTime: end of day is valid', async ({ page }) => {
  const r = await call(page, 'parseTime', '23:59:59.999999999Z');
  expect(r).toMatchObject({ hour: 23, minute: 59, second: 59, nanosecond: 999 });
});

test('parseTime: returns null for garbage', async ({ page }) => {
  const r = await call(page, 'parseTime', 'not-a-time');
  expect(r).toBeNull();
});

test('parseTime: returns null for empty string', async ({ page }) => {
  const r = await call(page, 'parseTime', '');
  expect(r).toBeNull();
});

test('parseCalendarDate: parses YYYY-MM-DD', async ({ page }) => {
  const r = await call(page, 'parseCalendarDate', '2026-04-09');
  expect(r).toMatchObject({ year: 2026, month: 4, day: 9 });
});

test('parseCalendarDate: returns null for ordinal format', async ({ page }) => {
  const r = await call(page, 'parseCalendarDate', '2026-099');
  expect(r).toBeNull();
});

test('parseCalendarDate: returns null for garbage', async ({ page }) => {
  expect(await call(page, 'parseCalendarDate', 'yesterday')).toBeNull();
});

test('parseOrdinalDate: parses YYYY-DDD', async ({ page }) => {
  const r = await call(page, 'parseOrdinalDate', '2026-099');
  expect(r).toMatchObject({ year: 2026, dayOfYear: 99 });
});

test('parseOrdinalDate: day 366 valid in leap year 2024', async ({ page }) => {
  const r = await call(page, 'parseOrdinalDate', '2024-366');
  expect(r).toMatchObject({ year: 2024, dayOfYear: 366 });
});

test('parseOrdinalDate: day 366 invalid in non-leap year 2025', async ({ page }) => {
  const r = await call(page, 'parseOrdinalDate', '2025-366');
  expect(r).toBeNull();
});

test('parseOrdinalDate: day 365 valid in non-leap year', async ({ page }) => {
  const r = await call(page, 'parseOrdinalDate', '2025-365');
  expect(r).toMatchObject({ year: 2025, dayOfYear: 365 });
});

test('parseDuration: parses PT30S', async ({ page }) => {
  const r = await call(page, 'parseDuration', 'PT30S');
  expect(r).toMatchObject({ seconds: 30, minutes: 0, hours: 0 });
});

test('parseDuration: parses P1D', async ({ page }) => {
  const r = await call(page, 'parseDuration', 'P1D');
  expect(r).toMatchObject({ days: 1, hours: 0 });
});

test('parseDuration: parses PT0S (zero duration)', async ({ page }) => {
  const r = await call(page, 'parseDuration', 'PT0S');
  expect(r).toMatchObject({ days: 0, hours: 0, minutes: 0, seconds: 0 });
});

test('parseDuration: parses full nanosecond precision', async ({ page }) => {
  const r = await call(page, 'parseDuration', 'P1DT2H3M4.567891234S');
  expect(r).toMatchObject({ days: 1, hours: 2, minutes: 3, seconds: 4 });
});

test('parseDuration: returns null for garbage', async ({ page }) => {
  expect(await call(page, 'parseDuration', 'not-a-duration')).toBeNull();
});

test('parseAnyDate: accepts calendar format', async ({ page }) => {
  const r = await page.evaluate(() => {
    const pd = window.parseAnyDate('2026-04-09');
    return pd ? pd.toString() : null;
  });
  expect(r).toBe('2026-04-09');
});

test('parseAnyDate: accepts ordinal format', async ({ page }) => {
  const r = await page.evaluate(() => {
    const pd = window.parseAnyDate('2026-099');
    return pd ? pd.toString() : null;
  });
  expect(r).toBe('2026-04-09');
});

// ── parseAnyDatetime returns Temporal.Instant ────────────────────────────

test('parseAnyDatetime: Z form returns Instant', async ({ page }) => {
  const ok = await page.evaluate(() => {
    const a = window.parseAnyDatetime('2026-02-09T14:30:00Z');
    const b = Temporal.Instant.from('2026-02-09T14:30:00Z');
    return a != null && a.equals(b);
  });
  expect(ok).toBe(true);
});

test('parseAnyDatetime: negative offset normalizes', async ({ page }) => {
  const ok = await page.evaluate(() => {
    const a = window.parseAnyDatetime('2026-02-09T14:30:00-05:00');
    const b = Temporal.Instant.from('2026-02-09T19:30:00Z');
    return a.equals(b);
  });
  expect(ok).toBe(true);
});

test('parseAnyDatetime: bracketed [UTC] form accepted', async ({ page }) => {
  const ok = await page.evaluate(() => {
    const a = window.parseAnyDatetime('2026-02-09T14:30:00+00:00[UTC]');
    const b = Temporal.Instant.from('2026-02-09T14:30:00Z');
    return a.equals(b);
  });
  expect(ok).toBe(true);
});

test('parseAnyDatetime: ordinal-with-Z accepted via fallback', async ({ page }) => {
  const ok = await page.evaluate(() => {
    const a = window.parseAnyDatetime('2026-040T14:30:00Z');
    const b = Temporal.Instant.from('2026-02-09T14:30:00Z');
    return a.equals(b);
  });
  expect(ok).toBe(true);
});

test('parseAnyDatetime: ordinal-with-offset accepted via fallback', async ({ page }) => {
  const ok = await page.evaluate(() => {
    const a = window.parseAnyDatetime('2026-040T14:30:00-05:00');
    const b = Temporal.Instant.from('2026-02-09T19:30:00Z');
    return a.equals(b);
  });
  expect(ok).toBe(true);
});

test('parseAnyDatetime: unzoned string returns null', async ({ page }) => {
  const r = await page.evaluate(() => window.parseAnyDatetime('2026-02-09T14:30:00'));
  expect(r).toBe(null);
});

test('parseAnyDatetime: garbage returns null', async ({ page }) => {
  const r = await page.evaluate(() => window.parseAnyDatetime('not a datetime'));
  expect(r).toBe(null);
});

test('parseAnyDatetime: missing T returns null', async ({ page }) => {
  const r = await page.evaluate(() => window.parseAnyDatetime('2026-02-09'));
  expect(r).toBe(null);
});

test('parseAnyDatetime: no longer fires datetime-parse-error', async ({ page }) => {
  const events = await page.evaluate(() => {
    const seen = [];
    const handler = (e) => seen.push(e.detail.code);
    document.addEventListener('nova-error', handler);
    window.parseAnyDatetime('definitely not iso');
    document.removeEventListener('nova-error', handler);
    return seen;
  });
  expect(events).not.toContain('datetime-parse-error');
});

test('parseTimeFlexible: extracts time from datetime string', async ({ page }) => {
  const r = await call(page, 'parseTimeFlexible', '2026-04-09T14:30:00Z');
  expect(r).toMatchObject({ hour: 14, minute: 30 });
});

// ── parseDuration: full Temporal.Duration support ───────────────────────────

test('parseDuration: accepts months ("P1M")', async ({ page }) => {
  const r = await page.evaluate(() => window.parseDuration('P1M'));
  expect(r).toEqual(expect.objectContaining({ months: 1 }));
});

test('parseDuration: rejects weeks-only ("P1W")', async ({ page }) => {
  const r = await page.evaluate(() => window.parseDuration('P1W'));
  expect(r).toBeNull();
});

test('parseDuration: rejects mixed week form ("P1W2D")', async ({ page }) => {
  const r = await page.evaluate(() => window.parseDuration('P1W2D'));
  expect(r).toBeNull();
});

test('parseDuration: rejects negative week form ("-P2W")', async ({ page }) => {
  const r = await page.evaluate(() => window.parseDuration('-P2W'));
  expect(r).toBeNull();
});

test('parseDuration: accepts years ("P1Y")', async ({ page }) => {
  const r = await page.evaluate(() => window.parseDuration('P1Y'));
  expect(r).toEqual(expect.objectContaining({ years: 1 }));
});

test('parseDuration: accepts mixed calendar + clock ("P1MT1H")', async ({ page }) => {
  const r = await page.evaluate(() => window.parseDuration('P1MT1H'));
  expect(r).toEqual(expect.objectContaining({ months: 1, hours: 1 }));
});

test('parseDuration: still accepts days+clock ("P1DT2H")', async ({ page }) => {
  const r = await page.evaluate(() => window.parseDuration('P1DT2H'));
  expect(r).toEqual(expect.objectContaining({ days: 1, hours: 2 }));
});

test('parseDuration: still accepts pure clock ("PT1H30M")', async ({ page }) => {
  const r = await page.evaluate(() => window.parseDuration('PT1H30M'));
  expect(r).toEqual(expect.objectContaining({ hours: 1, minutes: 30 }));
});


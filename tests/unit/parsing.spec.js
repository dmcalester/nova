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

test('parseAnyDatetime: parses calendar datetime', async ({ page }) => {
  const r = await page.evaluate(() => {
    const result = window.parseAnyDatetime('2026-04-09T14:30:00Z');
    return result ? { dateStr: result.date.toString(), time: result.time } : null;
  });
  expect(r.dateStr).toBe('2026-04-09');
  expect(r.time).toMatchObject({ hour: 14, minute: 30 });
});

test('parseAnyDatetime: parses ordinal datetime', async ({ page }) => {
  const r = await page.evaluate(() => {
    const result = window.parseAnyDatetime('2026-099T14:30:00Z');
    return result ? result.date.toString() : null;
  });
  expect(r).toBe('2026-04-09');
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

// ── parseAnyDatetime: Instant-first normalization ───────────────────────────

test('parseAnyDatetime: Z form preserves UTC value', async ({ page }) => {
  const r = await page.evaluate(() => {
    const p = window.parseAnyDatetime('2026-02-09T14:30:00Z');
    return { hour: p.time.hour, minute: p.time.minute, day: p.date.day };
  });
  expect(r).toEqual({ hour: 14, minute: 30, day: 9 });
});

test('parseAnyDatetime: negative offset normalizes to UTC', async ({ page }) => {
  const r = await page.evaluate(() => {
    const p = window.parseAnyDatetime('2026-02-09T14:30:00-05:00');
    return { hour: p.time.hour, minute: p.time.minute, day: p.date.day };
  });
  // 14:30 in -05:00 → 19:30 UTC, same calendar day
  expect(r).toEqual({ hour: 19, minute: 30, day: 9 });
});

test('parseAnyDatetime: positive offset normalizes (rolls back a day at midnight)', async ({ page }) => {
  const r = await page.evaluate(() => {
    const p = window.parseAnyDatetime('2026-02-09T02:30:00+05:00');
    return { hour: p.time.hour, minute: p.time.minute, day: p.date.day, month: p.date.month };
  });
  // 02:30 in +05:00 → 21:30 UTC the previous day
  expect(r).toEqual({ hour: 21, minute: 30, day: 8, month: 2 });
});

test('parseAnyDatetime: [UTC] annotation strips and stays at given time', async ({ page }) => {
  const r = await page.evaluate(() => {
    const p = window.parseAnyDatetime('2026-02-09T14:30:00+00:00[UTC]');
    return { hour: p.time.hour, minute: p.time.minute };
  });
  expect(r).toEqual({ hour: 14, minute: 30 });
});

test('parseAnyDatetime: unzoned datetime treated as UTC by convention', async ({ page }) => {
  const r = await page.evaluate(() => {
    const p = window.parseAnyDatetime('2026-02-09T14:30:00');
    return { hour: p.time.hour, minute: p.time.minute, day: p.date.day };
  });
  expect(r).toEqual({ hour: 14, minute: 30, day: 9 });
});

test('parseAnyDatetime: ordinal date form still works', async ({ page }) => {
  const r = await page.evaluate(() => {
    const p = window.parseAnyDatetime('2026-040T14:30:00Z');
    return { hour: p.time.hour, day: p.date.day, month: p.date.month };
  });
  // 2026-040 is Feb 9
  expect(r).toEqual({ hour: 14, day: 9, month: 2 });
});

test('parseAnyDatetime: garbage returns null', async ({ page }) => {
  const r = await page.evaluate(() => window.parseAnyDatetime('not a datetime'));
  expect(r).toBeNull();
});

test('parseAnyDatetime: missing T separator returns null', async ({ page }) => {
  const r = await page.evaluate(() => window.parseAnyDatetime('2026-02-09'));
  expect(r).toBeNull();
});

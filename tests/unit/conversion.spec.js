import { test, expect } from '../helpers/coverage.js';

test.beforeEach(async ({ page }) => {
  await page.goto('/tests/fixtures/nova-temporal-utils.html');
  await page.waitForFunction(() => window.__temporalReady === true);
});

test('instantToZonedRecord: UTC produces wall-clock matching the instant', async ({ page }) => {
  const r = await page.evaluate(() => {
    const inst = Temporal.Instant.from('2026-02-09T14:30:45.123456789Z');
    const result = window.instantToZonedRecord(inst, 'UTC');
    if (!(result.date instanceof Temporal.PlainDate)) {
      throw new Error('Expected result.date to be Temporal.PlainDate');
    }
    return {
      date: {
        year: result.date.year,
        month: result.date.month,
        day: result.date.day,
        dayOfYear: result.date.dayOfYear,
      },
      time: result.time,
    };
  });
  expect(r.date).toMatchObject({ year: 2026, month: 2, day: 9 });
  expect(r.time).toMatchObject({
    hour: 14, minute: 30, second: 45,
    millisecond: 123, microsecond: 456, nanosecond: 789,
  });
});

test('instantToZonedRecord: -05:00 shifts wall-clock back five hours', async ({ page }) => {
  const r = await page.evaluate(() => {
    const inst = Temporal.Instant.from('2026-02-09T14:30:00Z');
    const result = window.instantToZonedRecord(inst, '-05:00');
    if (!(result.date instanceof Temporal.PlainDate)) {
      throw new Error('Expected result.date to be Temporal.PlainDate');
    }
    return {
      date: {
        year: result.date.year,
        month: result.date.month,
        day: result.date.day,
        dayOfYear: result.date.dayOfYear,
      },
      time: result.time,
    };
  });
  expect(r.date).toMatchObject({ year: 2026, month: 2, day: 9 });
  expect(r.time).toMatchObject({ hour: 9, minute: 30, second: 0 });
});

test('instantToZonedRecord: +05:30 across date boundary', async ({ page }) => {
  const r = await page.evaluate(() => {
    const inst = Temporal.Instant.from('2026-02-09T23:00:00Z');
    const result = window.instantToZonedRecord(inst, '+05:30');
    if (!(result.date instanceof Temporal.PlainDate)) {
      throw new Error('Expected result.date to be Temporal.PlainDate');
    }
    return {
      date: {
        year: result.date.year,
        month: result.date.month,
        day: result.date.day,
        dayOfYear: result.date.dayOfYear,
      },
      time: result.time,
    };
  });
  expect(r.date).toMatchObject({ year: 2026, month: 2, day: 10 });
  expect(r.time).toMatchObject({ hour: 4, minute: 30, second: 0 });
});

test('instantToZonedRecord: date.dayOfYear available for ordinal rendering', async ({ page }) => {
  const doy = await page.evaluate(() => {
    const inst = Temporal.Instant.from('2026-02-09T00:00:00Z');
    const result = window.instantToZonedRecord(inst, 'UTC');
    if (!(result.date instanceof Temporal.PlainDate)) {
      throw new Error('Expected result.date to be Temporal.PlainDate');
    }
    return result.date.dayOfYear;
  });
  expect(doy).toBe(40);
});

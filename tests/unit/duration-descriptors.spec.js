import { test, expect } from '../helpers/coverage.js';

test.beforeEach(async ({ page }) => {
  await page.goto('/tests/fixtures/nova-temporal-utils.html');
  await page.waitForFunction(() => window.__temporalReady === true);
});

const build = (page, ...args) =>
  page.evaluate((a) => {
    const { descriptors, largest, smallest } = window.buildDurationDescriptors(...a);
    return { descriptors: descriptors.map((d) => ({ name: d.name, pad: d.pad, max: d.max })), largest, smallest };
  }, args);

const buildExpectError = (page, ...args) =>
  page.evaluate((a) => {
    try {
      window.buildDurationDescriptors(...a);
      return { threw: false };
    } catch (e) {
      return { threw: true, name: e.constructor.name, message: e.message };
    }
  }, args);

test('default window: days pad=3 max=999; hours/minutes/seconds pad=2 max=99', async ({ page }) => {
  const { descriptors } = await build(page, 'day', 'second');
  expect(descriptors).toEqual([
    { name: 'days', pad: 3, max: 999 },
    { name: 'hours', pad: 2, max: 99 },
    { name: 'minutes', pad: 2, max: 99 },
    { name: 'seconds', pad: 2, max: 99 },
  ]);
});

test('year window: years/months pad=2 (weeks omitted); days pad=3', async ({ page }) => {
  const { descriptors } = await build(page, 'year', 'second');
  expect(descriptors.slice(0, 3)).toEqual([
    { name: 'years', pad: 2, max: 99 },
    { name: 'months', pad: 2, max: 99 },
    { name: 'days', pad: 3, max: 999 },
  ]);
});

test('week is rejected as a unit name', async ({ page }) => {
  const r = await buildExpectError(page, 'week', 'second');
  expect(r.threw).toBe(true);
  expect(r.message).toContain('Invalid duration unit');
});

test('sub-second descriptors keep pad=3 max=999', async ({ page }) => {
  const { descriptors } = await build(page, 'hour', 'nanosecond');
  const sub = descriptors.filter((d) => ['ms', 'us', 'ns'].includes(d.name));
  expect(sub).toEqual([
    { name: 'ms', pad: 3, max: 999 },
    { name: 'us', pad: 3, max: 999 },
    { name: 'ns', pad: 3, max: 999 },
  ]);
});

test('largestUnitDigits widens days to 4', async ({ page }) => {
  const { descriptors } = await build(page, 'day', 'second', { largestUnitDigits: 4 });
  expect(descriptors[0]).toEqual({ name: 'days', pad: 4, max: 9999 });
  expect(descriptors[1]).toEqual({ name: 'hours', pad: 2, max: 99 });
});

test('largestUnitDigits widens minutes to 4 when largest-unit=minute', async ({ page }) => {
  const { descriptors } = await build(page, 'minute', 'second', { largestUnitDigits: 4 });
  expect(descriptors[0]).toEqual({ name: 'minutes', pad: 4, max: 9999 });
  expect(descriptors[1]).toEqual({ name: 'seconds', pad: 2, max: 99 });
});

test('largestUnitDigits equal to natural pad is allowed (no-op widening)', async ({ page }) => {
  const { descriptors } = await build(page, 'day', 'second', { largestUnitDigits: 3 });
  expect(descriptors[0]).toEqual({ name: 'days', pad: 3, max: 999 });
});

test('largestUnitDigits narrower than natural pad throws', async ({ page }) => {
  const r = await buildExpectError(page, 'day', 'second', { largestUnitDigits: 2 });
  expect(r.threw).toBe(true);
  expect(r.message).toContain('narrower than the natural width');
});

test('largestUnitDigits=0 throws', async ({ page }) => {
  const r = await buildExpectError(page, 'day', 'second', { largestUnitDigits: 0 });
  expect(r.threw).toBe(true);
  expect(r.message).toContain('between 1 and 9');
});

test('largestUnitDigits=10 throws', async ({ page }) => {
  const r = await buildExpectError(page, 'day', 'second', { largestUnitDigits: 10 });
  expect(r.threw).toBe(true);
  expect(r.message).toContain('between 1 and 9');
});

test('largestUnitDigits non-integer throws', async ({ page }) => {
  const r = await buildExpectError(page, 'day', 'second', { largestUnitDigits: 'abc' });
  expect(r.threw).toBe(true);
  expect(r.message).toContain('between 1 and 9');
});

test('largestUnitDigits null/empty leaves natural pad untouched', async ({ page }) => {
  const a = await build(page, 'day', 'second', { largestUnitDigits: null });
  const b = await build(page, 'day', 'second', { largestUnitDigits: '' });
  const c = await build(page, 'day', 'second');
  expect(a.descriptors[0]).toEqual({ name: 'days', pad: 3, max: 999 });
  expect(b.descriptors[0]).toEqual({ name: 'days', pad: 3, max: 999 });
  expect(c.descriptors[0]).toEqual({ name: 'days', pad: 3, max: 999 });
});

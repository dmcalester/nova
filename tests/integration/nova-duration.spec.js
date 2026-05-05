import { test, expect } from '../helpers/coverage.js';
const getVal = (page, sel = '#el') => page.evaluate((s) => document.querySelector(s).value, sel);

test.beforeEach(async ({ page }) => {
  await page.goto('/tests/fixtures/nova-duration.html');
  await page.waitForFunction(() => customElements.get('nova-duration') !== undefined);
});

test('initial value round-trips', async ({ page }) => {
  const val = await getVal(page);
  expect(val).toBe('PT1H30M');
});

test('programmatic value set and read', async ({ page }) => {
  await page.evaluate(() => { document.querySelector('#el').value = 'PT2H'; });
  const val = await getVal(page);
  expect(val).toMatch(/^PT2H/);
});

test('checkValidity() returns true for valid value', async ({ page }) => {
  const valid = await page.evaluate(() => document.querySelector('#el').checkValidity());
  expect(valid).toBe(true);
});

test('value outside max sets rangeOverflow', async ({ page }) => {
  await page.evaluate(() => { document.querySelector('#el-min-max').value = 'PT25M'; });
  const v = await page.evaluate(() => ({
    rangeOverflow: document.querySelector('#el-min-max').validity.rangeOverflow
  }));
  expect(v.rangeOverflow).toBe(true);
});

test('value below min sets rangeUnderflow', async ({ page }) => {
  await page.evaluate(() => { document.querySelector('#el-min-max').value = 'PT1M'; });
  const v = await page.evaluate(() => ({
    rangeUnderflow: document.querySelector('#el-min-max').validity.rangeUnderflow
  }));
  expect(v.rangeUnderflow).toBe(true);
});

test('required + empty sets valueMissing', async ({ page }) => {
  const v = await page.evaluate(() => ({
    valueMissing: document.querySelector('#el-required').validity.valueMissing
  }));
  expect(v.valueMissing).toBe(true);
});

test('smallest-unit="nanosecond" value has 9 fractional digits', async ({ page }) => {
  const val = await getVal(page, '#el-ns');
  expect(val).toMatch(/\.\d{9}S$/);
});

test('full duration with years months and weeks round-trips', async ({ page }) => {
  const r = await page.evaluate(() => {
    const el = document.querySelector('#el');
    el.setAttribute('largest-unit', 'year');
    el.value = 'P1Y2M3W4DT5H';
    return {
      value: el.value,
      temporal: el.temporal.toString(),
      years: el.getSegmentValueByName('years'),
      months: el.getSegmentValueByName('months'),
      weeks: el.getSegmentValueByName('weeks'),
    };
  });
  expect(r).toEqual({
    value: 'P1Y2M3W4DT5H',
    temporal: 'P1Y2M3W4DT5H',
    years: 1,
    months: 2,
    weeks: 3,
  });
});

test('largest-unit="hour" smallest-unit="second" exposes h/m/s only', async ({ page }) => {
  const r = await page.evaluate(() => {
    const el = document.createElement('nova-duration');
    el.setAttribute('largest-unit', 'hour');
    el.setAttribute('smallest-unit', 'second');
    el.setAttribute('value', 'PT4H33M12S');
    document.body.append(el);
    return {
      value: el.value,
      names: el.activeDescriptors.map((d) => d.name),
      hours: el.getSegmentValueByName('hours'),
      minutes: el.getSegmentValueByName('minutes'),
      seconds: el.getSegmentValueByName('seconds'),
    };
  });
  expect(r).toEqual({
    value: 'PT4H33M12S',
    names: ['hours', 'minutes', 'seconds'],
    hours: 4,
    minutes: 33,
    seconds: 12,
  });
});

test('largest-unit="day" smallest-unit="hour" exposes d/h only', async ({ page }) => {
  const r = await page.evaluate(() => {
    const el = document.createElement('nova-duration');
    el.setAttribute('largest-unit', 'day');
    el.setAttribute('smallest-unit', 'hour');
    el.setAttribute('value', 'P2DT4H');
    document.body.append(el);
    return {
      value: el.value,
      names: el.activeDescriptors.map((d) => d.name),
      days: el.getSegmentValueByName('days'),
      hours: el.getSegmentValueByName('hours'),
    };
  });
  expect(r).toEqual({
    value: 'P2DT4H',
    names: ['days', 'hours'],
    days: 2,
    hours: 4,
  });
});

test('nonzero units outside the visible duration window are rejected', async ({ page }) => {
  const r = await page.evaluate(() => {
    const el = document.createElement('nova-duration');
    el.setAttribute('largest-unit', 'hour');
    el.setAttribute('smallest-unit', 'second');
    document.body.append(el);
    try {
      el.value = 'P1DT2H';
      return { threw: false };
    } catch (e) {
      return { threw: true, name: e.constructor.name, message: e.message };
    }
  });
  expect(r.threw).toBe(true);
  expect(r.name).toMatch(/Error$/);
  expect(r.message).toContain('outside largest-unit="hour"');
});

test('invalid duration unit window throws', async ({ page }) => {
  const r = await page.evaluate(() => {
    const el = document.createElement('nova-duration');
    document.body.append(el);
    el.setAttribute('largest-unit', 'second');
    el.setAttribute('smallest-unit', 'day');
    try {
      el.value = 'PT1S';
      return { threw: false };
    } catch (e) {
      return { threw: true, name: e.constructor.name, message: e.message };
    }
  });
  expect(r.threw).toBe(true);
  expect(r.name).toMatch(/Error$/);
  expect(r.message).toContain('largest-unit="second"');
});

test('default descriptors: days pad=3, hours/minutes/seconds pad=2', async ({ page }) => {
  const r = await page.evaluate(() => {
    const el = document.createElement('nova-duration');
    el.setAttribute('largest-unit', 'day');
    el.setAttribute('smallest-unit', 'second');
    document.body.append(el);
    return el.activeDescriptors.map((d) => ({ name: d.name, pad: d.pad, max: d.max }));
  });
  expect(r).toEqual([
    { name: 'days', pad: 3, max: 999 },
    { name: 'hours', pad: 2, max: 99 },
    { name: 'minutes', pad: 2, max: 99 },
    { name: 'seconds', pad: 2, max: 99 },
  ]);
});

test('largest-unit-digits="4" widens day field to 4 digits and accepts 1234D', async ({ page }) => {
  const r = await page.evaluate(() => {
    const el = document.createElement('nova-duration');
    el.setAttribute('largest-unit', 'day');
    el.setAttribute('smallest-unit', 'second');
    el.setAttribute('largest-unit-digits', '4');
    el.setAttribute('value', 'P1234DT5H6M7S');
    document.body.append(el);
    const head = el.activeDescriptors[0];
    return {
      pad: head.pad,
      max: head.max,
      value: el.value,
      days: el.getSegmentValueByName('days'),
    };
  });
  expect(r).toEqual({ pad: 4, max: 9999, value: 'P1234DT5H6M7S', days: 1234 });
});

test('setting largest-unit-digits after connect rebuilds descriptors', async ({ page }) => {
  const r = await page.evaluate(() => {
    const el = document.createElement('nova-duration');
    el.setAttribute('largest-unit', 'day');
    document.body.append(el);
    const before = el.activeDescriptors[0].pad;
    el.setAttribute('largest-unit-digits', '5');
    const after = el.activeDescriptors[0].pad;
    return { before, after };
  });
  expect(r).toEqual({ before: 3, after: 5 });
});

test('largest-unit-digits narrower than natural width is reported as an error', async ({ page }) => {
  const r = await page.evaluate(() => {
    return new Promise((resolve) => {
      const seen = [];
      const handler = (event) => {
        seen.push(event.error?.message ?? event.message);
        event.preventDefault();
      };
      window.addEventListener('error', handler);
      const el = document.createElement('nova-duration');
      el.setAttribute('largest-unit', 'day');
      el.setAttribute('largest-unit-digits', '2');
      document.body.append(el);
      setTimeout(() => {
        window.removeEventListener('error', handler);
        resolve(seen.join('\n'));
      }, 50);
    });
  });
  expect(r).toContain('narrower than the natural width');
});

test('calendar-unit duration min/max uses Temporal comparison with relativeTo policy', async ({ page }) => {
  const r = await page.evaluate(() => {
    const el = document.createElement('nova-duration');
    el.setAttribute('largest-unit', 'month');
    el.setAttribute('min', 'P1M');
    el.setAttribute('max', 'P3M');
    el.setAttribute('value', 'P2M');
    document.body.append(el);
    const initial = { valid: el.validity.valid };
    el.value = 'P4M';
    return {
      initial,
      after: {
        valid: el.validity.valid,
        rangeOverflow: el.validity.rangeOverflow,
      },
    };
  });
  expect(r.initial.valid).toBe(true);
  expect(r.after).toEqual({ valid: false, rangeOverflow: true });
});

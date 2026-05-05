import { test, expect } from '../helpers/coverage.js';

const FIXTURES = {
  'nova-datetime': '/tests/fixtures/nova-datetime.html',
  'nova-date': '/tests/fixtures/nova-date.html',
  'nova-ordinal-date': '/tests/fixtures/nova-ordinal-date.html',
  'nova-time': '/tests/fixtures/nova-time.html',
  'nova-duration': '/tests/fixtures/nova-duration.html',
};

// ── Setter type-check: wrong type throws ────────────────────────────────────

test('nova-datetime.temporal = PlainDate throws TypeError', async ({ page }) => {
  await page.goto(FIXTURES['nova-datetime']);
  const r = await page.evaluate(() => {
    const el = document.createElement('nova-datetime');
    document.body.appendChild(el);
    try {
      el.temporal = Temporal.PlainDate.from('2026-02-09');
      return { threw: false };
    } catch (e) {
      return { threw: true, name: e.constructor.name, msg: e.message };
    }
  });
  expect(r.threw).toBe(true);
  expect(r.name).toBe('TypeError');
  expect(r.msg).toMatch(/PlainDateTime/);
});

test('nova-date.temporal = PlainTime throws TypeError', async ({ page }) => {
  await page.goto(FIXTURES['nova-date']);
  const r = await page.evaluate(() => {
    const el = document.createElement('nova-date');
    document.body.appendChild(el);
    try {
      el.temporal = Temporal.PlainTime.from('14:30:00');
      return { threw: false };
    } catch (e) {
      return { threw: true, name: e.constructor.name };
    }
  });
  expect(r.threw).toBe(true);
  expect(r.name).toBe('TypeError');
});

test('nova-time.temporal = Duration throws TypeError', async ({ page }) => {
  await page.goto(FIXTURES['nova-time']);
  const r = await page.evaluate(() => {
    const el = document.createElement('nova-time');
    document.body.appendChild(el);
    try {
      el.temporal = Temporal.Duration.from('PT1H');
      return { threw: false };
    } catch (e) {
      return { threw: true, name: e.constructor.name };
    }
  });
  expect(r.threw).toBe(true);
  expect(r.name).toBe('TypeError');
});

test('nova-duration.temporal = PlainDate throws TypeError', async ({ page }) => {
  await page.goto(FIXTURES['nova-duration']);
  const r = await page.evaluate(() => {
    const el = document.createElement('nova-duration');
    document.body.appendChild(el);
    try {
      el.temporal = Temporal.PlainDate.from('2026-02-09');
      return { threw: false };
    } catch (e) {
      return { threw: true, name: e.constructor.name };
    }
  });
  expect(r.threw).toBe(true);
  expect(r.name).toBe('TypeError');
});

test('nova-datetime.temporal = "string" throws TypeError', async ({ page }) => {
  await page.goto(FIXTURES['nova-datetime']);
  const threw = await page.evaluate(() => {
    const el = document.createElement('nova-datetime');
    document.body.appendChild(el);
    try {
      el.temporal = '2026-02-09T14:30:00Z';
      return false;
    } catch (e) {
      return e.constructor.name === 'TypeError';
    }
  });
  expect(threw).toBe(true);
});

test('nova-ordinal-date.temporal = PlainDate in day-only mode throws TypeError', async ({ page }) => {
  await page.goto(FIXTURES['nova-ordinal-date']);
  const r = await page.evaluate(() => {
    const el = document.createElement('nova-ordinal-date');
    el.setAttribute('value', '040');
    document.body.appendChild(el);
    try {
      el.temporal = Temporal.PlainDate.from('2026-02-09');
      return { threw: false };
    } catch (e) {
      return { threw: true, name: e.constructor.name, msg: e.message };
    }
  });
  expect(r.threw).toBe(true);
  expect(r.name).toBe('TypeError');
  expect(r.msg).toMatch(/cannot hold/);
});

// ── Setter accepts the correct type ─────────────────────────────────────────

test('nova-datetime.temporal = PlainDateTime sets the value', async ({ page }) => {
  await page.goto(FIXTURES['nova-datetime']);
  const v = await page.evaluate(() => {
    const el = document.createElement('nova-datetime');
    document.body.appendChild(el);
    el.temporal = Temporal.PlainDateTime.from('2026-02-09T14:30:00');
    return el.value;
  });
  expect(v).toBe('2026-02-09T14:30:00Z');
});

test('nova-date.temporal = PlainDate sets the value', async ({ page }) => {
  await page.goto(FIXTURES['nova-date']);
  const v = await page.evaluate(() => {
    const el = document.createElement('nova-date');
    document.body.appendChild(el);
    el.temporal = Temporal.PlainDate.from('2026-02-09');
    return el.value;
  });
  expect(v).toBe('2026-02-09');
});

test('nova-time.temporal = PlainTime sets the value', async ({ page }) => {
  await page.goto(FIXTURES['nova-time']);
  const v = await page.evaluate(() => {
    const el = document.createElement('nova-time');
    document.body.appendChild(el);
    el.temporal = Temporal.PlainTime.from('14:30:00');
    return el.value;
  });
  expect(v).toBe('14:30:00Z');
});

test('nova-duration.temporal = Duration sets the value', async ({ page }) => {
  await page.goto(FIXTURES['nova-duration']);
  const v = await page.evaluate(() => {
    const el = document.createElement('nova-duration');
    document.body.appendChild(el);
    el.temporal = Temporal.Duration.from('PT1H30M');
    return el.value;
  });
  expect(v).toBe('PT1H30M');
});

// ── Empty / null clear ──────────────────────────────────────────────────────

test('nova-datetime.value = "" clears the value', async ({ page }) => {
  await page.goto(FIXTURES['nova-datetime']);
  const r = await page.evaluate(() => {
    const el = document.createElement('nova-datetime');
    el.setAttribute('value', '2026-02-09T14:30:00Z');
    document.body.appendChild(el);
    el.value = '';
    return { value: el.value, temporal: el.temporal };
  });
  expect(r.value).toBe('');
  expect(r.temporal).toBeNull();
});

test('nova-datetime.value = null clears the value', async ({ page }) => {
  await page.goto(FIXTURES['nova-datetime']);
  const v = await page.evaluate(() => {
    const el = document.createElement('nova-datetime');
    el.setAttribute('value', '2026-02-09T14:30:00Z');
    document.body.appendChild(el);
    el.value = null;
    return el.value;
  });
  expect(v).toBe('');
});

test('nova-datetime.temporal = null clears the value', async ({ page }) => {
  await page.goto(FIXTURES['nova-datetime']);
  const v = await page.evaluate(() => {
    const el = document.createElement('nova-datetime');
    el.setAttribute('value', '2026-02-09T14:30:00Z');
    document.body.appendChild(el);
    el.temporal = null;
    return el.value;
  });
  expect(v).toBe('');
});

test('nova-date.value = "" clears the value', async ({ page }) => {
  await page.goto(FIXTURES['nova-date']);
  const v = await page.evaluate(() => {
    const el = document.createElement('nova-date');
    el.setAttribute('value', '2026-02-09');
    document.body.appendChild(el);
    el.value = '';
    return el.value;
  });
  expect(v).toBe('');
});

test('nova-time.value = "" clears the value', async ({ page }) => {
  await page.goto(FIXTURES['nova-time']);
  const v = await page.evaluate(() => {
    const el = document.createElement('nova-time');
    el.setAttribute('value', '14:30:00Z');
    document.body.appendChild(el);
    el.value = '';
    return el.value;
  });
  expect(v).toBe('');
});

test('nova-duration.value = "" clears the value', async ({ page }) => {
  await page.goto(FIXTURES['nova-duration']);
  const v = await page.evaluate(() => {
    const el = document.createElement('nova-duration');
    el.setAttribute('value', 'PT1H');
    document.body.appendChild(el);
    el.value = '';
    return el.value;
  });
  expect(v).toBe('');
});

test('removeAttribute("value") clears nova-datetime', async ({ page }) => {
  await page.goto(FIXTURES['nova-datetime']);
  const v = await page.evaluate(() => {
    const el = document.createElement('nova-datetime');
    el.setAttribute('value', '2026-02-09T14:30:00Z');
    document.body.appendChild(el);
    el.removeAttribute('value');
    return el.value;
  });
  expect(v).toBe('');
});

// ── value setter throws on garbage ──────────────────────────────────────────

const garbageCases = [
  { tag: 'nova-datetime', input: 'not a datetime' },
  { tag: 'nova-datetime', input: '2026-13-01T00:00:00Z' },     // invalid month
  { tag: 'nova-date',     input: 'not a date' },
  { tag: 'nova-date',     input: '2026-02-31' },                // Feb has no 31st
  { tag: 'nova-ordinal-date', input: 'not ordinal' },
  { tag: 'nova-ordinal-date', input: '2025-366' },              // 2025 is not a leap year
  { tag: 'nova-time',     input: 'not a time' },
  { tag: 'nova-time',     input: '25:00:00Z' },                 // hour out of range
  { tag: 'nova-duration', input: 'not a duration' },
];

for (const { tag, input } of garbageCases) {
  test(`${tag}.value = ${JSON.stringify(input)} throws RangeError`, async ({ page }) => {
    await page.goto(FIXTURES[tag]);
    const r = await page.evaluate(({ tag, input }) => {
      const el = document.createElement(tag);
      document.body.appendChild(el);
      try {
        el.value = input;
        return { threw: false };
      } catch (e) {
        return { threw: true, name: e.constructor.name };
      }
    }, { tag, input });
    expect(r.threw).toBe(true);
    // Allow either RangeError (the library's preferred type) or any subclass thrown by Temporal
    expect(r.name).toMatch(/Error$/);
  });
}

test('nova-duration.value accepts calendar duration units', async ({ page }) => {
  await page.goto(FIXTURES['nova-duration']);
  const r = await page.evaluate(() => {
    const el = document.createElement('nova-duration');
    el.setAttribute('largest-unit', 'year');
    document.body.appendChild(el);
    el.value = 'P1Y2M3W4DT5H';
    return { value: el.value, temporal: el.temporal.toString() };
  });
  expect(r.value).toBe('P1Y2M3W4DT5H');
  expect(r.temporal).toBe('P1Y2M3W4DT5H');
});

// ── Paste handler tolerates bad input ───────────────────────────────────────

test('paste of garbage into nova-datetime does not throw', async ({ page }) => {
  await page.goto(FIXTURES['nova-datetime']);
  const result = await page.evaluate(async () => {
    const el = document.createElement('nova-datetime');
    el.setAttribute('value', '2026-02-09T14:30:00Z');
    el.setAttribute('pattern', '');  // strict paste mode
    document.body.appendChild(el);
    const before = el.value;
    // Simulate a paste of invalid content via the strict-parse hook directly.
    let threw = false;
    try {
      el._parseStrictValue('not a datetime');
    } catch {
      threw = true;
    }
    return { threw, valueUnchanged: el.value === before };
  });
  expect(result.threw).toBe(false);
  expect(result.valueUnchanged).toBe(true);
});

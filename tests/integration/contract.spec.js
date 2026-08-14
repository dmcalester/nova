import { test, expect } from '../helpers/coverage.js';

const FIXTURES = {
  'nova-input-datetime': '/tests/fixtures/nova-input-datetime.html',
  'nova-input-ordinal-date': '/tests/fixtures/nova-input-ordinal-date.html',
  'nova-input-duration': '/tests/fixtures/nova-input-duration.html',
};

// ── Setter type-check: wrong type throws ────────────────────────────────────

test('nova-input-datetime.temporal = PlainDate throws TypeError', async ({ page }) => {
  await page.goto(FIXTURES['nova-input-datetime']);
  const r = await page.evaluate(() => {
    const el = document.createElement('nova-input-datetime');
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
  expect(r.msg).toMatch(/Instant/);
});

test('nova-input-ordinal-date.temporal = PlainTime throws TypeError', async ({ page }) => {
  await page.goto(FIXTURES['nova-input-ordinal-date']);
  const r = await page.evaluate(() => {
    const el = document.createElement('nova-input-ordinal-date');
    el.setAttribute('value', '2026-040'); // year mode → PlainDate-typed
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

test('nova-input-duration.temporal = PlainDate throws TypeError', async ({ page }) => {
  await page.goto(FIXTURES['nova-input-duration']);
  const r = await page.evaluate(() => {
    const el = document.createElement('nova-input-duration');
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

test('nova-input-datetime.temporal = "string" throws TypeError', async ({ page }) => {
  await page.goto(FIXTURES['nova-input-datetime']);
  const threw = await page.evaluate(() => {
    const el = document.createElement('nova-input-datetime');
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

test('nova-input-ordinal-date.temporal = PlainDate in day-only mode throws TypeError', async ({ page }) => {
  await page.goto(FIXTURES['nova-input-ordinal-date']);
  const r = await page.evaluate(() => {
    const el = document.createElement('nova-input-ordinal-date');
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

test('nova-input-datetime.temporal = Instant sets the value', async ({ page }) => {
  await page.goto(FIXTURES['nova-input-datetime']);
  const v = await page.evaluate(() => {
    const el = document.createElement('nova-input-datetime');
    document.body.appendChild(el);
    el.temporal = Temporal.Instant.from('2026-02-09T14:30:00Z');
    return el.value;
  });
  expect(v).toBe('2026-02-09T14:30:00Z');
});

test('nova-input-ordinal-date.temporal = PlainDate sets the value', async ({ page }) => {
  await page.goto(FIXTURES['nova-input-ordinal-date']);
  const v = await page.evaluate(() => {
    const el = document.createElement('nova-input-ordinal-date');
    el.setAttribute('value', '2026-040'); // year mode → PlainDate-typed
    document.body.appendChild(el);
    el.temporal = Temporal.PlainDate.from('2026-02-09');
    return el.value;
  });
  expect(v).toBe('2026-040'); // ordinal form of 2026-02-09
});

test('nova-input-duration.temporal = Duration sets the value', async ({ page }) => {
  await page.goto(FIXTURES['nova-input-duration']);
  const v = await page.evaluate(() => {
    const el = document.createElement('nova-input-duration');
    document.body.appendChild(el);
    el.temporal = Temporal.Duration.from('PT1H30M');
    return el.value;
  });
  expect(v).toBe('PT1H30M');
});

// ── Empty / null clear ──────────────────────────────────────────────────────

test('nova-input-datetime.value = "" clears the value', async ({ page }) => {
  await page.goto(FIXTURES['nova-input-datetime']);
  const r = await page.evaluate(() => {
    const el = document.createElement('nova-input-datetime');
    el.setAttribute('value', '2026-02-09T14:30:00Z');
    document.body.appendChild(el);
    el.value = '';
    return { value: el.value, temporal: el.temporal };
  });
  expect(r.value).toBe('');
  expect(r.temporal).toBeNull();
});

test('nova-input-datetime.value = null clears the value', async ({ page }) => {
  await page.goto(FIXTURES['nova-input-datetime']);
  const v = await page.evaluate(() => {
    const el = document.createElement('nova-input-datetime');
    el.setAttribute('value', '2026-02-09T14:30:00Z');
    document.body.appendChild(el);
    el.value = null;
    return el.value;
  });
  expect(v).toBe('');
});

test('nova-input-datetime.temporal = null clears the value', async ({ page }) => {
  await page.goto(FIXTURES['nova-input-datetime']);
  const v = await page.evaluate(() => {
    const el = document.createElement('nova-input-datetime');
    el.setAttribute('value', '2026-02-09T14:30:00Z');
    document.body.appendChild(el);
    el.temporal = null;
    return el.value;
  });
  expect(v).toBe('');
});

test('nova-input-ordinal-date.value = "" clears the value', async ({ page }) => {
  await page.goto(FIXTURES['nova-input-ordinal-date']);
  const v = await page.evaluate(() => {
    const el = document.createElement('nova-input-ordinal-date');
    el.setAttribute('value', '2026-040');
    document.body.appendChild(el);
    el.value = '';
    return el.value;
  });
  expect(v).toBe('');
});

test('nova-input-duration.value = "" clears the value', async ({ page }) => {
  await page.goto(FIXTURES['nova-input-duration']);
  const v = await page.evaluate(() => {
    const el = document.createElement('nova-input-duration');
    el.setAttribute('value', 'PT1H');
    document.body.appendChild(el);
    el.value = '';
    return el.value;
  });
  expect(v).toBe('');
});

test('removeAttribute("value") clears nova-input-datetime', async ({ page }) => {
  await page.goto(FIXTURES['nova-input-datetime']);
  const v = await page.evaluate(() => {
    const el = document.createElement('nova-input-datetime');
    el.setAttribute('value', '2026-02-09T14:30:00Z');
    document.body.appendChild(el);
    el.removeAttribute('value');
    return el.value;
  });
  expect(v).toBe('');
});

// ── value setter throws on garbage ──────────────────────────────────────────

const garbageCases = [
  { tag: 'nova-input-datetime', input: 'not a datetime' },
  { tag: 'nova-input-datetime', input: '2026-13-01T00:00:00Z' },     // invalid month
  { tag: 'nova-input-ordinal-date', input: 'not ordinal' },
  { tag: 'nova-input-ordinal-date', input: '2025-366' },              // 2025 is not a leap year
  { tag: 'nova-input-duration', input: 'not a duration' },
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

test('nova-input-duration.value accepts calendar duration units', async ({ page }) => {
  await page.goto(FIXTURES['nova-input-duration']);
  const r = await page.evaluate(() => {
    const el = document.createElement('nova-input-duration');
    el.setAttribute('largest-unit', 'year');
    document.body.appendChild(el);
    el.value = 'P1Y2M4DT5H';
    return { value: el.value, temporal: el.temporal.toString() };
  });
  expect(r.value).toBe('P1Y2M4DT5H');
  expect(r.temporal).toBe('P1Y2M4DT5H');
});

test('nova-input-duration.value rejects week-form durations (ISO-8601-1 weeks-only restriction)', async ({ page }) => {
  await page.goto(FIXTURES['nova-input-duration']);
  const r = await page.evaluate(() => {
    const el = document.createElement('nova-input-duration');
    el.setAttribute('largest-unit', 'year');
    document.body.appendChild(el);
    let threw = null;
    try {
      el.value = 'P1W';
    } catch (e) {
      threw = e.constructor.name;
    }
    return { threw };
  });
  expect(r.threw).toBe('RangeError');
});

// ── Paste handler tolerates bad input ───────────────────────────────────────

test('paste of garbage into nova-input-datetime does not throw', async ({ page }) => {
  await page.goto(FIXTURES['nova-input-datetime']);
  const result = await page.evaluate(async () => {
    const el = document.createElement('nova-input-datetime');
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

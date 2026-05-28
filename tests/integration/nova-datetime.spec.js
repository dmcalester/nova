import { test, expect } from '../helpers/coverage.js';
const getVal = (page, sel = '#el') => page.evaluate((s) => document.querySelector(s).value, sel);

test.beforeEach(async ({ page }) => {
  await page.goto('/tests/fixtures/nova-datetime.html');
  await page.waitForFunction(() => customElements.get('nova-datetime') !== undefined);
});

test('initial value round-trips in calendar format', async ({ page }) => {
  expect(await getVal(page)).toBe('2026-04-09T14:30:00Z');
});

test('format=ordinal produces YYYY-DDD format', async ({ page }) => {
  const val = await page.evaluate(() => document.querySelector('#el-ordinal').value);
  expect(val).toMatch(/^\d{4}-\d{3}T\d{2}:\d{2}:\d{2}Z$/);
});

test('paste of ordinal datetime into calendar format converts correctly', async ({ page }) => {
  await page.evaluate(() => {
    const el = document.querySelector('#el');
    const dt = new DataTransfer();
    dt.setData('text/plain', '2026-099T14:30:00Z');
    el.shadowRoot.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true }));
  });
  expect(await getVal(page)).toBe('2026-04-09T14:30:00Z');
});

test('excess precision drops to smallest-unit and emits precision-truncated', async ({ page }) => {
  const result = await page.evaluate(() => {
    const el = document.querySelector('#el'); // smallest-unit defaults to second
    let detail = null;
    el.addEventListener('precision-truncated', (e) => { detail = e.detail; });
    el.value = '2026-04-09T14:30:45.789Z';
    return { value: el.value, detail };
  });
  expect(result.value).toBe('2026-04-09T14:30:45Z');
  expect(result.detail).not.toBeNull();
  expect(result.detail.smallestUnit).toBe('second');
  expect(result.detail.parsedRecord.millisecond).toBe(789);
});

test('paste with excess precision drops and emits event', async ({ page }) => {
  const result = await page.evaluate(() => {
    const el = document.querySelector('#el');
    let detail = null;
    el.addEventListener('precision-truncated', (e) => { detail = e.detail; });
    const dt = new DataTransfer();
    dt.setData('text/plain', '2026-04-09T12:34:56.123456789Z');
    el.shadowRoot.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true }));
    return { value: el.value, detail };
  });
  expect(result.value).toBe('2026-04-09T12:34:56Z');
  expect(result.detail).not.toBeNull();
});

test('matching precision does not emit precision-truncated', async ({ page }) => {
  const fired = await page.evaluate(() => {
    const el = document.querySelector('#el-nanos'); // smallest-unit=nanosecond
    let count = 0;
    el.addEventListener('precision-truncated', () => { count++; });
    el.value = '2026-04-09T12:34:56.123456789Z';
    return count;
  });
  expect(fired).toBe(0);
});

test('smallest-unit=minute value has no seconds', async ({ page }) => {
  const val = await page.evaluate(() => document.querySelector('#el-minutes').value);
  expect(val).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}Z$/);
});

test('smallest-unit=nanosecond value has 9 fractional digits', async ({ page }) => {
  const val = await page.evaluate(() => document.querySelector('#el-nanos').value);
  expect(val).toMatch(/T\d{2}:\d{2}:\d{2}\.\d{9}Z$/);
});

test('programmatic value set updates .value', async ({ page }) => {
  await page.evaluate(() => { document.querySelector('#el').value = '2024-02-29T12:00:00Z'; });
  const val = await getVal(page);
  expect(val).toBe('2024-02-29T12:00:00Z');
});

test('datetime edit clamps day by default (constrain)', async ({ page }) => {
  const r = await page.evaluate(() => {
    const el = document.querySelector('#el');
    el.value = '2026-01-31T14:30:00Z';
    el.setSegmentValueByName('month', 2);
    return {
      value: el.value,
      month: el.getSegmentValueByName('month'),
      day: el.getSegmentValueByName('day'),
      valid: el.validity.valid,
    };
  });
  expect(r).toEqual({ value: '2026-02-28T14:30:00Z', month: 2, day: 28, valid: true });
});

test('overflow="reject" preserves invalid date fields and marks invalid', async ({ page }) => {
  const r = await page.evaluate(() => {
    const el = document.createElement('nova-datetime');
    el.setAttribute('overflow', 'reject');
    el.setAttribute('value', '2026-01-31T14:30:00Z');
    document.body.append(el);
    el.setSegmentValueByName('month', 2);
    return {
      value: el.value,
      temporal: el.temporal,
      month: el.getSegmentValueByName('month'),
      day: el.getSegmentValueByName('day'),
      valid: el.validity.valid,
      customError: el.validity.customError,
    };
  });
  expect(r).toEqual(expect.objectContaining({
    value: '',
    temporal: null,
    month: 2,
    day: 31,
    valid: false,
    customError: true,
  }));
});

test('required + empty sets valueMissing', async ({ page }) => {
  const v = await page.evaluate(() => ({
    valueMissing: document.querySelector('#el-required').validity.valueMissing
  }));
  expect(v.valueMissing).toBe(true);
});

test('value below min sets rangeUnderflow', async ({ page }) => {
  await page.evaluate(() => { document.querySelector('#el-min-max').value = '2026-01-01T00:00:00Z'; });
  const v = await page.evaluate(() => ({
    rangeUnderflow: document.querySelector('#el-min-max').validity.rangeUnderflow
  }));
  expect(v.rangeUnderflow).toBe(true);
});

test('nova-datetime: temporal getter returns Temporal.Instant', async ({ page }) => {
  await page.goto('/tests/fixtures/nova-datetime.html');
  const isInstant = await page.evaluate(() => {
    document.body.innerHTML = '<nova-datetime value="2026-02-09T14:30:00Z"></nova-datetime>';
    const el = document.querySelector('nova-datetime');
    return el.temporal instanceof Temporal.Instant;
  });
  expect(isInstant).toBe(true);
});

test('nova-datetime: temporal setter accepts Temporal.Instant', async ({ page }) => {
  await page.goto('/tests/fixtures/nova-datetime.html');
  const value = await page.evaluate(() => {
    document.body.innerHTML = '<nova-datetime></nova-datetime>';
    const el = document.querySelector('nova-datetime');
    el.temporal = Temporal.Instant.from('2026-02-09T14:30:00Z');
    return el.value;
  });
  expect(value).toBe('2026-02-09T14:30:00Z');
});

test('nova-datetime: temporalType is "Instant"', async ({ page }) => {
  await page.goto('/tests/fixtures/nova-datetime.html');
  const type = await page.evaluate(() => {
    document.body.innerHTML = '<nova-datetime value="2026-02-09T14:30:00Z"></nova-datetime>';
    return document.querySelector('nova-datetime').temporalType;
  });
  expect(type).toBe('Instant');
});

test('nova-datetime: temporal setter rejects PlainDateTime with TypeError', async ({ page }) => {
  await page.goto('/tests/fixtures/nova-datetime.html');
  const msg = await page.evaluate(() => {
    document.body.innerHTML = '<nova-datetime></nova-datetime>';
    const el = document.querySelector('nova-datetime');
    try {
      el.temporal = Temporal.PlainDateTime.from('2026-02-09T14:30:00');
      return null;
    } catch (e) {
      return e.message;
    }
  });
  expect(msg).toMatch(/Instant/);
});

test('nova-datetime: setting value with unzoned string throws', async ({ page }) => {
  await page.goto('/tests/fixtures/nova-datetime.html');
  const threw = await page.evaluate(() => {
    document.body.innerHTML = '<nova-datetime></nova-datetime>';
    const el = document.querySelector('nova-datetime');
    try {
      el.value = '2026-02-09T14:30:00';
      return false;
    } catch (e) {
      return e instanceof RangeError;
    }
  });
  expect(threw).toBe(true);
});

test('nova-datetime: zone="-05:00" preserves canonical instant', async ({ page }) => {
  await page.goto('/tests/fixtures/nova-datetime.html');
  const temporalISO = await page.evaluate(() => {
    document.body.innerHTML =
      '<nova-datetime zone="-05:00" value="2026-02-09T14:30:00Z"></nova-datetime>';
    const el = document.querySelector('nova-datetime');
    return el.temporal.toString();
  });
  expect(temporalISO).toBe('2026-02-09T14:30:00Z');
});

test('nova-datetime: zone="-05:00" shifts displayed segments back five hours', async ({ page }) => {
  await page.goto('/tests/fixtures/nova-datetime.html');
  const hour = await page.evaluate(() => {
    document.body.innerHTML =
      '<nova-datetime zone="-05:00" value="2026-02-09T14:30:00Z"></nova-datetime>';
    const el = document.querySelector('nova-datetime');
    return el.getSegmentValueByName('hour');
  });
  expect(hour).toBe(9);
});

test('nova-datetime: zone change preserves canonical instant', async ({ page }) => {
  await page.goto('/tests/fixtures/nova-datetime.html');
  const result = await page.evaluate(() => {
    document.body.innerHTML =
      '<nova-datetime value="2026-02-09T14:30:00Z"></nova-datetime>';
    const el = document.querySelector('nova-datetime');
    const before = el.temporal.epochNanoseconds.toString();
    el.setAttribute('zone', '-05:00');
    const after = el.temporal.epochNanoseconds.toString();
    return { before, after };
  });
  expect(result.before).toBe(result.after);
});

test('nova-datetime: IANA zone reports invalid-zone', async ({ page }) => {
  await page.goto('/tests/fixtures/nova-datetime.html');
  const code = await page.evaluate(async () => {
    return new Promise((resolve) => {
      document.addEventListener('nova-error', (e) => {
        if (e.detail.code === 'invalid-zone') resolve(e.detail.code);
      }, { once: true });
      document.body.innerHTML =
        '<nova-datetime zone="America/Denver" value="2026-02-09T14:30:00Z"></nova-datetime>';
    });
  });
  expect(code).toBe('invalid-zone');
});

test('nova-datetime: editing a segment in non-UTC zone recomposes correct instant', async ({ page }) => {
  await page.goto('/tests/fixtures/nova-datetime.html');
  const iso = await page.evaluate(() => {
    document.body.innerHTML =
      '<nova-datetime zone="-05:00" value="2026-02-09T14:30:00Z"></nova-datetime>';
    const el = document.querySelector('nova-datetime');
    // Display reads 09:30 in -05:00. Nudge minute from 30 to 31 (display 09:31 = 14:31Z).
    el.setSegmentValueByName('minute', 31, true);
    return el.temporal.toString();
  });
  expect(iso).toBe('2026-02-09T14:31:00Z');
});

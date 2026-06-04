import { test, expect } from '../helpers/coverage.js';

test.beforeEach(async ({ page }) => {
  await page.goto('/tests/fixtures/nova-datetime.html');
});

const cases = [
  { input: '2026-02-09T14:30:00Z',                 expected: '2026-02-09T14:30:00Z', label: 'Z form' },
  { input: '2026-02-09T14:30:00-05:00',            expected: '2026-02-09T19:30:00Z', label: 'negative offset' },
  { input: '2026-02-09T14:30:00+00:00[UTC]',       expected: '2026-02-09T14:30:00Z', label: '[UTC] annotation' },
];

for (const { input, expected, label } of cases) {
  test(`nova-datetime input contract: ${label}`, async ({ page }) => {
    const v = await page.evaluate((iso) => {
      const el = document.createElement('nova-datetime');
      document.body.appendChild(el);
      el.value = iso;
      return el.value;
    }, input);
    expect(v).toBe(expected);
  });
}

test('nova-datetime input contract: unzoned string throws RangeError', async ({ page }) => {
  const threw = await page.evaluate(() => {
    const el = document.createElement('nova-datetime');
    document.body.appendChild(el);
    try {
      el.value = '2026-02-09T14:30:00';
      return false;
    } catch (e) {
      return e instanceof RangeError;
    }
  });
  expect(threw).toBe(true);
});

test('nova-datetime: pasting an unzoned full datetime is rejected, not silently degraded to date-only', async ({ page }) => {
  // Regression: `Temporal.PlainDate.from("2026-02-09T14:30:00")` leniently
  // extracts the date, so an unzoned datetime used to slip through the
  // flexible paste path and silently overwrite the date while dropping time.
  const result = await page.evaluate(() => {
    const el = document.createElement('nova-datetime');
    el.setAttribute('value', '2026-04-09T14:30:00Z');
    document.body.appendChild(el);
    const before = el.value;
    const dt = new DataTransfer();
    dt.setData('text/plain', '2026-02-09T14:30:00'); // no Z, no offset
    el.shadowRoot.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true }));
    return { before, after: el.value };
  });
  // Value must be untouched — the unzoned datetime is rejected.
  expect(result.after).toBe(result.before);
});

test('nova-datetime strict (pattern) path: pasting an unzoned datetime is rejected', async ({ page }) => {
  const result = await page.evaluate(() => {
    const el = document.createElement('nova-datetime');
    el.setAttribute('pattern', 'x'); // routes paste through the strict parser
    el.setAttribute('value', '2026-04-09T14:30:00Z');
    document.body.appendChild(el);
    const before = el.value;
    const dt = new DataTransfer();
    dt.setData('text/plain', '2026-02-09T09:15:00'); // no Z, no offset
    el.shadowRoot.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true }));
    return { before, after: el.value };
  });
  expect(result.after).toBe(result.before);
});

test('nova-datetime strict (pattern) path: pasted offset datetime is Instant-converted, not stored as wall-clock', async ({ page }) => {
  const value = await page.evaluate(() => {
    const el = document.createElement('nova-datetime');
    el.setAttribute('pattern', 'x');
    document.body.appendChild(el);
    const dt = new DataTransfer();
    dt.setData('text/plain', '2026-02-09T14:30:00-05:00');
    el.shadowRoot.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true }));
    return el.value;
  });
  // -05:00 14:30 == 19:30Z
  expect(value).toBe('2026-02-09T19:30:00Z');
});

test('nova-datetime ordinal: input ordinal form preserved (calendar-mode component)', async ({ page }) => {
  const v = await page.evaluate(() => {
    const el = document.createElement('nova-datetime');
    document.body.appendChild(el);
    el.value = '2026-040T14:30:00Z';
    return el.value;
  });
  // nova-datetime defaults to calendar format; 2026-040 normalizes to 2026-02-09
  expect(v).toBe('2026-02-09T14:30:00Z');
});

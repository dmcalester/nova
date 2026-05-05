import { test, expect } from '../helpers/coverage.js';
const getVal = (page, sel = '#el') => page.evaluate((s) => document.querySelector(s).value, sel);

test.beforeEach(async ({ page }) => {
  await page.goto('/tests/fixtures/nova-time.html');
  await page.waitForFunction(() => customElements.get('nova-time') !== undefined);
});

test('initial value round-trips', async ({ page }) => {
  expect(await getVal(page)).toBe('14:30:00Z');
});

test('programmatic value set and read', async ({ page }) => {
  await page.evaluate(() => { document.querySelector('#el').value = '23:59:59Z'; });
  expect(await getVal(page)).toBe('23:59:59Z');
});

test('required + empty sets valueMissing', async ({ page }) => {
  const v = await page.evaluate(() => {
    const el = document.querySelector('#el-required');
    return { valueMissing: el.validity.valueMissing };
  });
  expect(v.valueMissing).toBe(true);
});

test('value below min sets rangeUnderflow', async ({ page }) => {
  await page.evaluate(() => { document.querySelector('#el-min-max').value = '07:00:00Z'; });
  const v = await page.evaluate(() => ({ rangeUnderflow: document.querySelector('#el-min-max').validity.rangeUnderflow }));
  expect(v.rangeUnderflow).toBe(true);
});

test('value above max sets rangeOverflow', async ({ page }) => {
  await page.evaluate(() => { document.querySelector('#el-min-max').value = '19:00:00Z'; });
  const v = await page.evaluate(() => ({ rangeOverflow: document.querySelector('#el-min-max').validity.rangeOverflow }));
  expect(v.rangeOverflow).toBe(true);
});

test('millisecond smallest-unit value includes 3 fractional digits', async ({ page }) => {
  const val = await getVal(page, '#el-ms');
  expect(val).toMatch(/^\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
});

test('nanosecond smallest-unit value includes 9 fractional digits', async ({ page }) => {
  const val = await getVal(page, '#el-ns');
  expect(val).toMatch(/^\d{2}:\d{2}:\d{2}\.\d{9}Z$/);
});

test('paste of datetime string extracts time', async ({ page }) => {
  await page.evaluate(() => {
    const el = document.querySelector('#el');
    const dt = new DataTransfer();
    dt.setData('text/plain', '2026-04-09T14:30:45Z');
    el.shadowRoot.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true }));
  });
  expect(await getVal(page)).toBe('14:30:45Z');
});

test('excess precision drops to smallest-unit and emits precision-truncated', async ({ page }) => {
  const result = await page.evaluate(() => {
    const el = document.querySelector('#el'); // smallest-unit defaults to second
    let detail = null;
    el.addEventListener('precision-truncated', (e) => { detail = e.detail; });
    el.value = '14:30:45.789Z';
    return { value: el.value, detail };
  });
  expect(result.value).toBe('14:30:45Z');
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
    dt.setData('text/plain', '12:34:56.123456789Z');
    el.shadowRoot.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true }));
    return { value: el.value, detail };
  });
  expect(result.value).toBe('12:34:56Z');
  expect(result.detail).not.toBeNull();
  expect(result.detail.smallestUnit).toBe('second');
});

test('matching precision does not emit precision-truncated', async ({ page }) => {
  const fired = await page.evaluate(() => {
    const el = document.querySelector('#el-ms'); // smallest-unit=millisecond
    let count = 0;
    el.addEventListener('precision-truncated', () => { count++; });
    el.value = '12:34:56.789Z';
    return count;
  });
  expect(fired).toBe(0);
});

test('disabled blocks keyboard input', async ({ page }) => {
  // Disabled element has pointer-events:none; verify value is unchanged via direct check
  // and that the element cannot be focused
  const isFocusable = await page.evaluate(() => {
    const el = document.querySelector('#el-disabled');
    el.focus();
    return document.activeElement === el;
  });
  expect(isFocusable).toBe(false);
  expect(await getVal(page, '#el-disabled')).toBe('14:30:00Z');
});

import { test, expect } from '../helpers/coverage.js';
const getVal = (page, sel = '#el') => page.evaluate((s) => document.querySelector(s).value, sel);

test.beforeEach(async ({ page }) => {
  await page.goto('/tests/fixtures/nova-input-ordinal-date.html');
  await page.waitForFunction(() => customElements.get('nova-input-ordinal-date') !== undefined);
});

test('initial value round-trips', async ({ page }) => {
  expect(await getVal(page)).toBe('2026-099');
});

test('programmatic value set and read', async ({ page }) => {
  await page.evaluate(() => { document.querySelector('#el').value = '2026-100'; });
  expect(await getVal(page)).toBe('2026-100');
});

test('day 366 in non-leap year throws and leaves prior value intact', async ({ page }) => {
  const initialVal = await getVal(page);
  const r = await page.evaluate(() => {
    const el = document.querySelector('#el');
    try {
      el.value = '2025-366';
      return { threw: false, value: el.value };
    } catch (e) {
      return { threw: true, name: e.constructor.name, value: el.value };
    }
  });
  expect(r.threw).toBe(true);
  expect(r.name).toMatch(/Error$/);
  expect(r.value).toBe(initialVal);
  expect(r.value).not.toBe('2025-366');
});

test('required + empty sets valueMissing', async ({ page }) => {
  const v = await page.evaluate(() => ({
    valueMissing: document.querySelector('#el-required').validity.valueMissing
  }));
  expect(v.valueMissing).toBe(true);
});

test('paste of calendar date converts to ordinal', async ({ page }) => {
  await page.evaluate(() => {
    const el = document.querySelector('#el');
    const dt = new DataTransfer();
    dt.setData('text/plain', '2026-04-09');
    el.shadowRoot.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true }));
  });
  expect(await getVal(page)).toBe('2026-099');
});

test('paste of datetime extracts ordinal date', async ({ page }) => {
  await page.evaluate(() => {
    const el = document.querySelector('#el');
    const dt = new DataTransfer();
    dt.setData('text/plain', '2026-04-09T14:30:00Z');
    el.shadowRoot.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true }));
  });
  expect(await getVal(page)).toBe('2026-099');
});

test('temporalType: returns "PlainDate" in with-year mode', async ({ page }) => {
  await page.goto('/tests/fixtures/nova-input-ordinal-date.html');
  const t = await page.evaluate(() => {
    const el = document.createElement('nova-input-ordinal-date');
    el.setAttribute('value', '2026-040');
    document.body.appendChild(el);
    return el.temporalType;
  });
  expect(t).toBe('PlainDate');
});

test('temporalType: returns null in day-only mode', async ({ page }) => {
  await page.goto('/tests/fixtures/nova-input-ordinal-date.html');
  const t = await page.evaluate(() => {
    const el = document.createElement('nova-input-ordinal-date');
    el.setAttribute('value', '040');
    document.body.appendChild(el);
    return el.temporalType;
  });
  expect(t).toBeNull();
});

test('temporalType: temporal returns null when temporalType is null', async ({ page }) => {
  await page.goto('/tests/fixtures/nova-input-ordinal-date.html');
  const r = await page.evaluate(() => {
    const el = document.createElement('nova-input-ordinal-date');
    el.setAttribute('value', '040');
    document.body.appendChild(el);
    return { type: el.temporalType, temporal: el.temporal };
  });
  expect(r.type).toBeNull();
  expect(r.temporal).toBeNull();
});

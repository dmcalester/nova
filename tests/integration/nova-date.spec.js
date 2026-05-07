import { test, expect } from '../helpers/coverage.js';

const getVal = (page, sel = '#el') =>
  page.evaluate((s) => document.querySelector(s).value, sel);
const getTemporal = (page, sel = '#el') =>
  page.evaluate((s) => document.querySelector(s).temporal?.toString() ?? null, sel);
const getValidity = (page, sel = '#el') =>
  page.evaluate((s) => {
    const el = document.querySelector(s);
    const v = el.validity;
    return { valueMissing: v.valueMissing, rangeUnderflow: v.rangeUnderflow, rangeOverflow: v.rangeOverflow, valid: v.valid };
  }, sel);

test.beforeEach(async ({ page }) => {
  await page.goto('/tests/fixtures/nova-date.html');
  await page.waitForFunction(() => customElements.get('nova-date') !== undefined);
});

test('initial value round-trips through .value', async ({ page }) => {
  expect(await getVal(page)).toBe('2026-04-09');
});

test('initial value round-trips through .temporal', async ({ page }) => {
  expect(await getTemporal(page)).toBe('2026-04-09');
});

test('programmatic value set and read', async ({ page }) => {
  await page.evaluate(() => { document.querySelector('#el').value = '2024-02-29'; });
  expect(await getVal(page)).toBe('2024-02-29');
});

test('invalid date assignment throws and leaves prior value intact', async ({ page }) => {
  // The value setter rejects fully invalid dates via parseAndSet's RangeError.
  // Clamping is a segment-level concern and is exercised separately.
  await page.evaluate(() => { document.querySelector('#el').value = '2025-01-31'; });
  const r = await page.evaluate(() => {
    const el = document.querySelector('#el');
    try {
      el.value = '2025-02-31';
      return { threw: false, value: el.value };
    } catch (e) {
      return { threw: true, name: e.constructor.name, value: el.value };
    }
  });
  expect(r.threw).toBe(true);
  expect(r.name).toMatch(/Error$/);
  expect(r.value).toBe('2025-01-31');
});

test('month edit clamps day by default (constrain)', async ({ page }) => {
  const r = await page.evaluate(() => {
    const el = document.querySelector('#el');
    el.value = '2026-01-31';
    el.setSegmentValueByName('month', 2);
    return {
      value: el.value,
      month: el.getSegmentValueByName('month'),
      day: el.getSegmentValueByName('day'),
      valid: el.validity.valid,
    };
  });
  expect(r).toEqual({ value: '2026-02-28', month: 2, day: 28, valid: true });
});

test('overflow="reject" leaves invalid day visible and marks invalid', async ({ page }) => {
  const r = await page.evaluate(() => {
    const el = document.createElement('nova-date');
    el.setAttribute('overflow', 'reject');
    el.setAttribute('value', '2026-01-31');
    document.body.append(el);
    el.setSegmentValueByName('month', 2);
    return {
      value: el.value,
      month: el.getSegmentValueByName('month'),
      day: el.getSegmentValueByName('day'),
      valid: el.validity.valid,
      customError: el.validity.customError,
    };
  });
  expect(r).toEqual({ value: '', month: 2, day: 31, valid: false, customError: true });
});

test('required + empty sets valueMissing', async ({ page }) => {
  const v = await getValidity(page, '#el-required');
  expect(v.valueMissing).toBe(true);
  expect(v.valid).toBe(false);
});

test('required + empty does not show user-invalid before interaction', async ({ page }) => {
  const r = await page.evaluate(() => {
    const el = document.querySelector('#el-required');
    return {
      invalid: el.matches(':state(invalid)'),
      userInvalid: el.matches(':state(user-invalid)'),
    };
  });
  expect(r.invalid).toBe(true);
  expect(r.userInvalid).toBe(false);
});

test('failed form submission flips required + empty into user-invalid', async ({ page }) => {
  // Inject a fresh required nova-date inside a real form so submit-validation runs.
  const r = await page.evaluate(async () => {
    const form = document.createElement('form');
    const el = document.createElement('nova-date');
    el.id = 'submit-test';
    el.setAttribute('required', '');
    el.setAttribute('name', 'd');
    form.appendChild(el);
    document.body.appendChild(form);
    await new Promise((r) => requestAnimationFrame(r));
    const before = el.matches(':state(user-invalid)');
    form.requestSubmit?.() ?? form.dispatchEvent(new Event('submit', { cancelable: true }));
    // Browser fires `invalid` synchronously during submit-validation
    return { before, after: el.matches(':state(user-invalid)') };
  });
  expect(r.before).toBe(false);
  expect(r.after).toBe(true);
});

test('unparseable value attribute renders placeholders, leaves value empty', async ({ page }) => {
  const r = await page.evaluate(async () => {
    const el = document.createElement('nova-date');
    el.setAttribute('value', 'not-a-date');
    document.body.append(el);
    await new Promise((r) => requestAnimationFrame(r));
    const segments = [...el.shadowRoot.querySelectorAll('.segment')].map(
      (s) => s.textContent,
    );
    return { segments, value: el.value };
  });
  expect(r.value).toBe('');
  // Date has 3 segments — year (4-pad), month (2-pad), day (2-pad)
  expect(r.segments).toEqual(['––––', '––', '––']);
});

test('value attribute later changed to garbage falls back to placeholders', async ({ page }) => {
  const r = await page.evaluate(async () => {
    const el = document.querySelector('#el'); // starts as 2026-04-09
    el.setAttribute('value', 'garbage');
    await new Promise((r) => requestAnimationFrame(r));
    const segments = [...el.shadowRoot.querySelectorAll('.segment')].map(
      (s) => s.textContent,
    );
    return { segments, value: el.value };
  });
  expect(r.value).toBe('');
  expect(r.segments).toEqual(['––––', '––', '––']);
});

test('property setter still throws on bad value (Temporal-strict)', async ({ page }) => {
  const r = await page.evaluate(() => {
    const el = document.querySelector('#el');
    try {
      el.value = 'garbage';
      return { threw: false };
    } catch (e) {
      return { threw: true, name: e.constructor.name };
    }
  });
  expect(r.threw).toBe(true);
  expect(r.name).toMatch(/Error$/);
});

test('initial value out of min/max bounds starts in user-invalid state', async ({ page }) => {
  const r = await page.evaluate(async () => {
    const el = document.createElement('nova-date');
    el.setAttribute('value', '2026-03-31');
    el.setAttribute('min', '2026-04-01');
    el.setAttribute('max', '2026-04-30');
    document.body.append(el);
    await new Promise((r) => requestAnimationFrame(r));
    return {
      userInvalid: el.matches(':state(user-invalid)'),
      rangeUnderflow: el.validity.rangeUnderflow,
    };
  });
  expect(r.rangeUnderflow).toBe(true);
  expect(r.userInvalid).toBe(true);
});

test('initial empty + required does NOT start in user-invalid state', async ({ page }) => {
  const r = await page.evaluate(() => {
    const el = document.querySelector('#el-required'); // required + empty
    return {
      userInvalid: el.matches(':state(user-invalid)'),
      valueMissing: el.validity.valueMissing,
    };
  });
  expect(r.valueMissing).toBe(true);
  expect(r.userInvalid).toBe(false);
});

test('value below min sets rangeUnderflow', async ({ page }) => {
  await page.evaluate(() => { document.querySelector('#el-min-max').value = '2026-03-31'; });
  const v = await getValidity(page, '#el-min-max');
  expect(v.rangeUnderflow).toBe(true);
});

test('value above max sets rangeOverflow', async ({ page }) => {
  await page.evaluate(() => { document.querySelector('#el-min-max').value = '2026-05-01'; });
  const v = await getValidity(page, '#el-min-max');
  expect(v.rangeOverflow).toBe(true);
});

test('value within min/max is valid', async ({ page }) => {
  const v = await getValidity(page, '#el-min-max');
  expect(v.valid).toBe(true);
});

test('disabled element excluded from FormData', async ({ page }) => {
  const data = await page.evaluate(() => {
    const form = document.querySelector('#form');
    return Object.fromEntries(new FormData(form));
  });
  expect(data).not.toHaveProperty('disabled_field');
  expect(data).toHaveProperty('obs_date');
});

test('readonly: value cannot be changed via keyboard', async ({ page }) => {
  await page.locator('#el-readonly').click();
  await page.keyboard.type('20200101');
  expect(await getVal(page, '#el-readonly')).toBe('2026-04-09');
});

test('paste of datetime extracts date part', async ({ page }) => {
  await page.evaluate(() => {
    const el = document.querySelector('#el');
    // Paste listener is on shadowRoot — dispatch there
    const target = el.shadowRoot;
    const dt = new DataTransfer();
    dt.setData('text/plain', '2026-06-15T14:30:00Z');
    target.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true }));
  });
  expect(await getVal(page)).toBe('2026-06-15');
});

test('paste of ordinal date converts to calendar', async ({ page }) => {
  await page.evaluate(() => {
    const el = document.querySelector('#el');
    const target = el.shadowRoot;
    const dt = new DataTransfer();
    dt.setData('text/plain', '2026-099');
    target.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true }));
  });
  expect(await getVal(page)).toBe('2026-04-09');
});

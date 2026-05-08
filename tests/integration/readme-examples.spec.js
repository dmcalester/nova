import { test, expect } from '../helpers/coverage.js';

test.beforeEach(async ({ page }) => {
  await page.goto('/tests/fixtures/readme-examples.html');
  await page.waitForFunction(() => window.__readmeExamplesReady === true);
});

// ── Quick Start ─────────────────────────────────────────────────────────────

test('Quick Start: nova-datetime renders and value matches attribute', async ({ page }) => {
  await page.setContent(`
    <link rel="stylesheet" href="/css/nova-tokens.css">
    <link rel="stylesheet" href="/css/nova-colors.css">
    <link rel="stylesheet" href="/css/nova-form-controls.css">
    <script type="module" src="/js/nova-temporal/index.js"></script>
    <nova-datetime
      name="observation_time"
      smallest-unit="second"
      value="2026-02-09T14:30:00Z"
    ></nova-datetime>
  `);
  await page.waitForFunction(() => customElements.get('nova-datetime') !== undefined);
  const value = await page.evaluate(() => document.querySelector('nova-datetime').value);
  expect(value).toBe('2026-02-09T14:30:00Z');
});

// ── Interface Contract example ──────────────────────────────────────────────

test('Interface Contract: .value and .temporal accessors', async ({ page }) => {
  const r = await page.evaluate(async () => {
    const el = document.createElement('nova-datetime');
    el.setAttribute('value', '2026-02-09T14:30:00Z');
    document.body.appendChild(el);
    // Wait for upgrade — read .value until it's defined
    let attempts = 0;
    while (el.value === undefined && attempts < 50) {
      await new Promise((r) => setTimeout(r, 10));
      attempts++;
    }

    const initialValue = el.value;
    const initialIsPDT = el.temporal instanceof Temporal.PlainDateTime;

    el.temporal = Temporal.PlainDateTime.from('2026-02-09T16:00:00');
    const afterSetValue = el.value;

    return { initialValue, initialIsPDT, afterSetValue };
  });
  expect(r.initialValue).toBe('2026-02-09T14:30:00Z');
  expect(r.initialIsPDT).toBe(true);
  expect(r.afterSetValue).toBe('2026-02-09T16:00:00Z');
});

// ── Helpers section examples ────────────────────────────────────────────────

test('Helper: formatDurationHuman renders PT1H30M', async ({ page }) => {
  const s = await page.evaluate(() => {
    return window.formatDurationHuman(Temporal.Duration.from('PT1H30M'));
  });
  expect(s).toBe('PT1H30M');
});

test('Helper: formatDurationHuman renders P3DT4H', async ({ page }) => {
  const s = await page.evaluate(() => {
    return window.formatDurationHuman(Temporal.Duration.from('P3DT4H'));
  });
  expect(s).toBe('P3DT4H');
});

test('Helper: ordinalDateToPlainDate converts ordinal form', async ({ page }) => {
  const iso = await page.evaluate(() => window.ordinalDateToPlainDate(2026, 40).toString());
  expect(iso).toBe('2026-02-09');
});

test('Helper: parseOrdinalDate returns null for garbage', async ({ page }) => {
  const r = await page.evaluate(() => window.parseOrdinalDate('not a date'));
  expect(r).toBeNull();
});

// ── Form Integration example ────────────────────────────────────────────────

test('Form Integration: FormData captures ISO value strings', async ({ page }) => {
  const r = await page.evaluate(async () => {
    const form = document.createElement('form');
    form.id = 'obs-form';
    form.innerHTML = `
      <nova-date name="obs_date" value="2026-02-09" required></nova-date>
      <nova-time name="obs_time" smallest-unit="second" value="14:30:00Z"></nova-time>
    `;
    document.body.appendChild(form);
    // Wait for both children to upgrade
    let attempts = 0;
    while (
      (form.querySelector('nova-date').value === undefined ||
       form.querySelector('nova-time').value === undefined) &&
      attempts < 50
    ) {
      await new Promise((r) => setTimeout(r, 10));
      attempts++;
    }
    return Object.fromEntries(new FormData(form));
  });
  expect(r).toEqual({ obs_date: '2026-02-09', obs_time: '14:30:00Z' });
});

// ── Mode-specific group examples ────────────────────────────────────────────

test('Group range mode: AOS/LOS computes PT1H15M duration in output', async ({ page }) => {
  await page.setContent(`
    <link rel="stylesheet" href="/css/nova-tokens.css">
    <link rel="stylesheet" href="/css/nova-colors.css">
    <link rel="stylesheet" href="/css/nova-form-controls.css">
    <script type="module" src="/js/nova-temporal/index.js"></script>
    <nova-temporal-group name="contact-window">
      <nova-datetime slot="t0" value="2026-02-09T14:30:00Z"></nova-datetime>
      <nova-datetime slot="t1" value="2026-02-09T15:45:00Z"></nova-datetime>
      <output slot="output">
        <span class="output-value"></span>
      </output>
    </nova-temporal-group>
  `);
  await page.waitForFunction(() => customElements.get('nova-temporal-group') !== undefined);
  await page.waitForFunction(() => {
    const el = document.querySelector('.output-value');
    return el && el.textContent && el.textContent.length > 0;
  });
  const text = await page.evaluate(() => document.querySelector('.output-value').textContent.trim());
  expect(text).toBe('PT1H15M');
});

test('Group compute mode: launch + 2h window computes cutoff', async ({ page }) => {
  await page.setContent(`
    <link rel="stylesheet" href="/css/nova-tokens.css">
    <link rel="stylesheet" href="/css/nova-colors.css">
    <link rel="stylesheet" href="/css/nova-form-controls.css">
    <script type="module" src="/js/nova-temporal/index.js"></script>
    <nova-temporal-group name="mission-window">
      <nova-datetime slot="t0" value="2026-02-09T14:30:00Z"></nova-datetime>
      <nova-duration slot="d0" value="PT2H"></nova-duration>
      <output slot="output">
        <span class="output-value"></span>
      </output>
    </nova-temporal-group>
  `);
  await page.waitForFunction(() => customElements.get('nova-temporal-group') !== undefined);
  await page.waitForFunction(() => {
    const el = document.querySelector('.output-value');
    return el && el.textContent && el.textContent.length > 0;
  });
  const text = await page.evaluate(() => document.querySelector('.output-value').textContent.trim());
  expect(text).toBe('2026-02-09T16:30:00Z');
});

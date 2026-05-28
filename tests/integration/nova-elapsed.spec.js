import { test, expect } from '../helpers/coverage.js';

test.beforeEach(async ({ page }) => {
  await page.goto('/tests/fixtures/nova-elapsed.html');
  await page.waitForFunction(() => customElements.get('nova-elapsed') !== undefined);
  await page.waitForTimeout(100);
});

const shadowText = (page, id) =>
  page.evaluate(
    (sel) => document.querySelector(sel).shadowRoot?.textContent?.trim() ?? '',
    `#${id}`,
  );

test('threshold-behavior="continue" counts up from a past epoch', async ({ page }) => {
  const text = await shadowText(page, 'el-met');
  expect(text).toContain('T+');
  expect(text).toMatch(/\d{3}\/\d{2}:\d{2}:\d{2}/);
  // Past epoch + "continue" → it runs through T-0, it does not freeze at zero.
  expect(text).not.toMatch(/000\/00:00:00/);
});

test('threshold-behavior="freeze" already past the threshold freezes on load', async ({ page }) => {
  // The reload case: epoch is in the past, no crossing was witnessed, yet the
  // count must still be frozen at the threshold rather than running up.
  const text = await shadowText(page, 'el-frozen');
  expect(text).toBe('T+000/00:00:00');
});

test('epoch in the future counts down with a - sign', async ({ page }) => {
  const text = await shadowText(page, 'el-countdown');
  expect(text).toContain('T-');
});

test('stopped counter does not change over time', async ({ page }) => {
  const text1 = await shadowText(page, 'el-met');
  await page.waitForTimeout(1200);
  const text2 = await shadowText(page, 'el-met');
  expect(text1).toBe(text2);
});

test('live counter advances over time', async ({ page }) => {
  const text1 = await shadowText(page, 'el-live');
  await page.waitForTimeout(400);
  const text2 = await shadowText(page, 'el-live');
  expect(text1).not.toBe(text2);
  expect(text2).toMatch(/\d{2}:\d{2}:\d{2}\.\d{3}/);
});

test('unparseable epoch renders a placeholder and dispatches nova-error', async ({ page }) => {
  const errorCode = await page.evaluate(() => {
    return new Promise((resolve) => {
      const el = document.querySelector('#el-invalid');
      el.addEventListener('nova-error', (e) => resolve(e.detail.code), { once: true });
      // Re-trigger a tick by reasserting the bad epoch.
      el.setAttribute('epoch', 'still-not-a-date');
      setTimeout(() => resolve(null), 500);
    });
  });
  expect(errorCode).toBe('invalid-epoch');
  const text = await shadowText(page, 'el-invalid');
  expect(text).toContain('T?');
  expect(text).toMatch(/DDD\/HH:MM:SS/);
});

test('threshold-behavior="warn": crossing fires threshold-crossed and sets out-of-range', async ({ page }) => {
  const result = await page.evaluate(() => {
    return new Promise((resolve) => {
      const el = document.querySelector('#el-crossing');
      el.addEventListener('threshold-crossed', () => {
        resolve({
          fired: true,
          outOfRange: el.matches(':state(out-of-range)'),
        });
      }, { once: true });
      // epoch ~0.8s in the future: elapsed starts negative, crosses PT0S soon.
      el.epoch = new Date(Date.now() + 800).toISOString();
      setTimeout(() => resolve({ fired: false, outOfRange: false }), 4000);
    });
  });
  expect(result.fired).toBe(true);
  expect(result.outOfRange).toBe(true);
});

test('threshold-behavior="freeze": crossing fires elapsed-stopped and freezes', async ({ page }) => {
  const fired = await page.evaluate(() => {
    return new Promise((resolve) => {
      const el = document.querySelector('#el-crossing');
      el.thresholdBehavior = 'freeze';
      el.addEventListener('elapsed-stopped', () => resolve(true), { once: true });
      el.epoch = new Date(Date.now() + 800).toISOString();
      setTimeout(() => resolve(false), 4000);
    });
  });
  expect(fired).toBe(true);
});

test('nova-elapsed: unzoned epoch reports invalid-epoch and renders placeholder', async ({ page }) => {
  await page.goto('/tests/fixtures/nova-elapsed.html');
  const errorCode = await page.evaluate(() => {
    return new Promise((resolve) => {
      document.addEventListener('nova-error', (e) => {
        if (e.detail.code === 'invalid-epoch') {
          resolve(e.detail.code);
        }
      }, { once: true });
      document.body.innerHTML = '<nova-elapsed epoch="2026-02-09T14:30:00"></nova-elapsed>';
      setTimeout(() => resolve(null), 500);
    });
  });
  expect(errorCode).toBe('invalid-epoch');
  const text = await page.evaluate(() => document.querySelector('nova-elapsed').shadowRoot.textContent.trim());
  expect(text.length).toBeGreaterThan(0); // placeholder rendered
});

test('nova-elapsed: epoch with offset (e.g. -05:00) accepted', async ({ page }) => {
  await page.goto('/tests/fixtures/nova-elapsed.html');
  const rendered = await page.evaluate(() => {
    document.body.innerHTML = '<nova-elapsed epoch="2020-01-01T00:00:00-05:00" threshold-behavior="continue"></nova-elapsed>';
    const el = document.querySelector('nova-elapsed');
    return el.shadowRoot.textContent.trim();
  });
  expect(rendered).not.toContain('?');
  expect(rendered).not.toMatch(/^-+$/);
});

test('nova-elapsed: ordinal epoch with Z accepted', async ({ page }) => {
  await page.goto('/tests/fixtures/nova-elapsed.html');
  const rendered = await page.evaluate(() => {
    document.body.innerHTML = '<nova-elapsed epoch="2020-001T00:00:00Z" threshold-behavior="continue"></nova-elapsed>';
    const el = document.querySelector('nova-elapsed');
    return el.shadowRoot.textContent.trim();
  });
  expect(rendered).not.toContain('?');
});

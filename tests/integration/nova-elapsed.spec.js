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

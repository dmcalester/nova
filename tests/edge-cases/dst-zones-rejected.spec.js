import { test, expect } from '../helpers/coverage.js';

const IANA_ZONES = [
  'America/Denver',
  'Europe/London',
  'Asia/Tokyo',
  'Australia/Sydney',
  'Pacific/Auckland',
];

const call = (page, fn, ...args) => page.evaluate(
  ([f, a]) => window[f](...a), [fn, args]
);

test.describe('DST-bearing zones are structurally rejected', () => {
  test.describe('parseZone helper', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/tests/fixtures/nova-temporal-utils.html');
      await page.waitForFunction(() => window.__temporalReady === true);
    });

    for (const iana of IANA_ZONES) {
      test(`parseZone("${iana}") returns null`, async ({ page }) => {
        const r = await call(page, 'parseZone', iana);
        expect(r).toBe(null);
      });
    }
  });

  test('nova-clock with IANA zone reports invalid-zone', async ({ page }) => {
    await page.goto('/tests/fixtures/nova-clock.html');
    const code = await page.evaluate(async () => {
      return new Promise((resolve) => {
        document.addEventListener('nova-error', (e) => {
          if (e.detail.code === 'invalid-zone') resolve(e.detail.code);
        }, { once: true });
        document.body.innerHTML = '<nova-clock zone="Europe/London"></nova-clock>';
      });
    });
    expect(code).toBe('invalid-zone');
  });

  test('nova-input-datetime with IANA zone reports invalid-zone', async ({ page }) => {
    await page.goto('/tests/fixtures/nova-input-datetime.html');
    const code = await page.evaluate(async () => {
      return new Promise((resolve) => {
        document.addEventListener('nova-error', (e) => {
          if (e.detail.code === 'invalid-zone') resolve(e.detail.code);
        }, { once: true });
        document.body.innerHTML =
          '<nova-input-datetime zone="America/Denver" value="2026-02-09T14:30:00Z"></nova-input-datetime>';
      });
    });
    expect(code).toBe('invalid-zone');
  });
});

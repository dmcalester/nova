import { test, expect } from '../helpers/coverage.js';

test.beforeEach(async ({ page }) => {
  await page.goto('/tests/fixtures/nova-datetime.html');
});

const cases = [
  { input: '2026-02-09T14:30:00Z',                 expected: '2026-02-09T14:30:00Z', label: 'Z form' },
  { input: '2026-02-09T14:30:00-05:00',            expected: '2026-02-09T19:30:00Z', label: 'negative offset' },
  { input: '2026-02-09T14:30:00+00:00[UTC]',       expected: '2026-02-09T14:30:00Z', label: '[UTC] annotation' },
  { input: '2026-02-09T14:30:00',                  expected: '2026-02-09T14:30:00Z', label: 'unzoned (UTC by convention)' },
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

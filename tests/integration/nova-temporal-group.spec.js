import { test, expect } from '../helpers/coverage.js';

test.beforeEach(async ({ page }) => {
  await page.goto('/tests/fixtures/nova-temporal-group-range.html');
  await page.waitForFunction(() => customElements.get('nova-temporal-group') !== undefined);
});

test('range mode: outputValue is populated after load', async ({ page }) => {
  await page.waitForTimeout(100);
  const out = await page.evaluate(() => document.querySelector('nova-temporal-group').outputValue);
  expect(out).toBeTruthy();
});

test('range mode: t1 < t0 is valid and produces a negative duration', async ({ page }) => {
  await page.evaluate(() => {
    const t0 = document.querySelector('[slot="t0"]');
    const t1 = document.querySelector('[slot="t1"]');
    t0.value = '2026-04-09T15:00:00Z';
    t0.dispatchEvent(new Event('input', { bubbles: true }));
    t1.value = '2026-04-09T14:00:00Z';
    t1.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await page.waitForTimeout(100);
  const { valid, output, hasInvalidAttr } = await page.evaluate(() => {
    const group = document.querySelector('nova-temporal-group');
    return {
      valid: group.checkValidity(),
      output: group.outputValue,
      hasInvalidAttr: group.hasAttribute('invalid'),
    };
  });
  expect(valid).toBe(true);
  expect(hasInvalidAttr).toBe(false);
  expect(output).toMatch(/-/);
});

test('range mode: single temporal slot is invalid configuration', async ({ page }) => {
  const result = await page.evaluate(() => {
    return new Promise((resolve) => {
      const group = document.createElement('nova-temporal-group');
      const t0 = document.createElement('nova-datetime');
      t0.slot = 't0';
      group.append(t0);
      document.body.append(group);

      requestAnimationFrame(() => {
        resolve({
          valid: group.checkValidity(),
          message: group.validationMessage,
        });
      });
    });
  });

  expect(result.valid).toBe(false);
  expect(result.message).toContain('at least two temporal/duration slots');
});

test('compute mode: outputValue reflects t0 + d0 result', async ({ page }) => {
  await page.goto('/tests/fixtures/nova-temporal-group-compute.html');
  await page.waitForFunction(() => customElements.get('nova-temporal-group') !== undefined);
  await page.waitForTimeout(200);
  // outputValue is computed fresh from t0.temporal + d0.temporal
  const out = await page.evaluate(() => document.querySelector('nova-temporal-group').outputValue);
  expect(out).toBe('2026-04-09T16:00:00Z');
});

test('compute mode: output updates when duration changes', async ({ page }) => {
  await page.goto('/tests/fixtures/nova-temporal-group-compute.html');
  await page.waitForFunction(() => customElements.get('nova-temporal-group') !== undefined);
  await page.waitForTimeout(200);
  await page.evaluate(() => {
    const d0 = document.querySelector('[slot="d0"]');
    d0.value = 'PT3H';
    d0.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await page.waitForTimeout(100);
  const out = await page.evaluate(() => document.querySelector('nova-temporal-group').outputValue);
  expect(out).toBe('2026-04-09T17:00:00Z');
});

test('compute mode: missing t0 is invalid configuration', async ({ page }) => {
  await page.goto('/tests/fixtures/nova-temporal-group-compute.html');
  await page.waitForFunction(() => customElements.get('nova-temporal-group') !== undefined);

  const result = await page.evaluate(() => {
    return new Promise((resolve) => {
      const group = document.createElement('nova-temporal-group');

      const d0 = document.createElement('nova-duration');
      d0.slot = 'd0';
      d0.value = 'PT1H';

      const d1 = document.createElement('nova-duration');
      d1.slot = 'd1';
      d1.value = 'PT30M';

      group.append(d0, d1);
      document.body.append(group);

      requestAnimationFrame(() => {
        resolve({
          valid: group.checkValidity(),
          message: group.validationMessage,
        });
      });
    });
  });

  expect(result.valid).toBe(false);
  expect(result.message).toContain('expected slot t0 and at least one duration slot');
});

test('disabled propagates to group children', async ({ page }) => {
  await page.evaluate(() => {
    document.querySelector('#group').setAttribute('disabled', '');
  });
  await page.waitForTimeout(50);
  const allDisabled = await page.evaluate(() => {
    // Query children of the specific group
    const group = document.querySelector('#group');
    const children = [...group.children].filter(el => el.tagName.toLowerCase().startsWith('nova-'));
    return {
      count: children.length,
      allDisabled: children.every(c => c.hasAttribute('disabled')),
    };
  });
  expect(allDisabled.count).toBeGreaterThan(0);
  expect(allDisabled.allDisabled).toBe(true);
});

test('temporal-change event fires when child changes', async ({ page }) => {
  const fired = await page.evaluate(() => {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => resolve(false), 2000);
      document.querySelector('nova-temporal-group').addEventListener('temporal-change', () => {
        clearTimeout(timeout);
        resolve(true);
      }, { once: true });
      // Trigger a change by setting value and dispatching input event
      const t0 = document.querySelector('[slot="t0"]');
      t0.value = '2026-04-09T13:00:00Z';
      t0.dispatchEvent(new Event('input', { bubbles: true }));
    });
  });
  expect(fired).toBe(true);
});

test('range mode: child-invalid message uses slotted label text when present', async ({ page }) => {
  await page.evaluate(() => {
    const t0 = document.querySelector('[slot="t0"]');
    t0.setAttribute('min', '2026-04-09T16:00:00Z');
    t0.value = '2026-04-09T14:00:00Z';
    t0.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await page.waitForTimeout(100);
  const message = await page.evaluate(() => {
    const group = document.querySelector('nova-temporal-group');
    group.checkValidity();
    return group.validationMessage;
  });
  expect(message).toContain('Start');
  expect(message).not.toMatch(/\bt0\b/);
});

test('range mode: child-invalid message falls back to slot name when no label is slotted', async ({ page }) => {
  const message = await page.evaluate(() => {
    return new Promise((resolve) => {
      const group = document.createElement('nova-temporal-group');
      const t0 = document.createElement('nova-datetime');
      t0.slot = 't0';
      t0.setAttribute('min', '2026-04-09T16:00:00Z');
      t0.setAttribute('value', '2026-04-09T14:00:00Z');
      const t1 = document.createElement('nova-datetime');
      t1.slot = 't1';
      t1.setAttribute('value', '2026-04-09T18:00:00Z');
      group.append(t0, t1);
      document.body.append(group);
      requestAnimationFrame(() => {
        group.checkValidity();
        resolve(group.validationMessage);
      });
    });
  });
  expect(message).toContain('t0');
});

test('output slot: warns when slotted element is not <output>', async ({ page }) => {
  const warnings = [];
  page.on('console', (msg) => {
    if (msg.type() === 'warning') warnings.push(msg.text());
  });

  await page.evaluate(() => {
    return new Promise((resolve) => {
      const group = document.createElement('nova-temporal-group');
      const t0 = document.createElement('nova-datetime');
      t0.slot = 't0';
      t0.setAttribute('value', '2026-04-09T14:00:00Z');
      const t1 = document.createElement('nova-datetime');
      t1.slot = 't1';
      t1.setAttribute('value', '2026-04-09T15:00:00Z');
      const out = document.createElement('div');
      out.slot = 'output';
      const val = document.createElement('span');
      val.className = 'output-value';
      out.append(val);
      group.append(t0, t1, out);
      document.body.append(group);
      requestAnimationFrame(resolve);
    });
  });
  await page.waitForTimeout(50);

  const matching = warnings.filter(w => w.includes('[nova-temporal-group]') && w.includes('should be an <output>'));
  expect(matching.length).toBe(1);
});

test('output slot: warns when <output> is missing .output-value descendant', async ({ page }) => {
  const warnings = [];
  page.on('console', (msg) => {
    if (msg.type() === 'warning') warnings.push(msg.text());
  });

  await page.evaluate(() => {
    return new Promise((resolve) => {
      const group = document.createElement('nova-temporal-group');
      const t0 = document.createElement('nova-datetime');
      t0.slot = 't0';
      t0.setAttribute('value', '2026-04-09T14:00:00Z');
      const t1 = document.createElement('nova-datetime');
      t1.slot = 't1';
      t1.setAttribute('value', '2026-04-09T15:00:00Z');
      const out = document.createElement('output');
      out.slot = 'output';
      const lbl = document.createElement('span');
      lbl.className = 'output-label';
      lbl.textContent = 'Duration';
      out.append(lbl);
      group.append(t0, t1, out);
      document.body.append(group);
      requestAnimationFrame(resolve);
    });
  });
  await page.waitForTimeout(50);

  const matching = warnings.filter(w => w.includes('[nova-temporal-group]') && w.includes('is missing a .output-value'));
  expect(matching.length).toBe(1);
});

test('output slot: well-formed slot does not warn', async ({ page }) => {
  const warnings = [];
  page.on('console', (msg) => {
    if (msg.type() === 'warning') warnings.push(msg.text());
  });

  await page.goto('/tests/fixtures/nova-temporal-group-range.html');
  await page.waitForFunction(() => customElements.get('nova-temporal-group') !== undefined);
  await page.waitForTimeout(100);

  const matching = warnings.filter(w => w.includes('[nova-temporal-group]') && (w.includes('<output>') || w.includes('.output-value')));
  expect(matching.length).toBe(0);
});

test('output slot: absent slot does not warn (headless configuration)', async ({ page }) => {
  const warnings = [];
  page.on('console', (msg) => {
    if (msg.type() === 'warning') warnings.push(msg.text());
  });

  await page.evaluate(() => {
    return new Promise((resolve) => {
      const group = document.createElement('nova-temporal-group');
      const t0 = document.createElement('nova-datetime');
      t0.slot = 't0';
      t0.setAttribute('value', '2026-04-09T14:00:00Z');
      const t1 = document.createElement('nova-datetime');
      t1.slot = 't1';
      t1.setAttribute('value', '2026-04-09T15:00:00Z');
      group.append(t0, t1);
      document.body.append(group);
      requestAnimationFrame(resolve);
    });
  });
  await page.waitForTimeout(50);

  const matching = warnings.filter(w => w.includes('[nova-temporal-group]') && (w.includes('<output>') || w.includes('.output-value')));
  expect(matching.length).toBe(0);
});

test('output slot: warn fires at most once per assigned element across re-attaches', async ({ page }) => {
  const warnings = [];
  page.on('console', (msg) => {
    if (msg.type() === 'warning') warnings.push(msg.text());
  });

  await page.evaluate(() => {
    return new Promise((resolve) => {
      const group = document.createElement('nova-temporal-group');
      const t0 = document.createElement('nova-datetime');
      t0.slot = 't0';
      t0.setAttribute('value', '2026-04-09T14:00:00Z');
      const t1 = document.createElement('nova-datetime');
      t1.slot = 't1';
      t1.setAttribute('value', '2026-04-09T15:00:00Z');
      const out = document.createElement('output');
      out.slot = 'output';
      // intentionally no .output-value descendant
      group.append(t0, t1, out);
      document.body.append(group);
      // After the initial slotchange has fired, remove and re-attach the SAME output element.
      // Two slotchange events, identical element reference — guard should suppress the second warning.
      requestAnimationFrame(() => {
        out.remove();
        requestAnimationFrame(() => {
          group.append(out);
          requestAnimationFrame(resolve);
        });
      });
    });
  });
  await page.waitForTimeout(50);

  const matching = warnings.filter(w => w.includes('[nova-temporal-group]') && w.includes('is missing a .output-value'));
  expect(matching.length).toBe(1);
});

test('output slot: warn fires again when a different element is assigned', async ({ page }) => {
  const warnings = [];
  page.on('console', (msg) => {
    if (msg.type() === 'warning') warnings.push(msg.text());
  });

  await page.evaluate(() => {
    return new Promise((resolve) => {
      const group = document.createElement('nova-temporal-group');
      const t0 = document.createElement('nova-datetime');
      t0.slot = 't0';
      t0.setAttribute('value', '2026-04-09T14:00:00Z');
      const t1 = document.createElement('nova-datetime');
      t1.slot = 't1';
      t1.setAttribute('value', '2026-04-09T15:00:00Z');
      const out1 = document.createElement('output');
      out1.slot = 'output';
      group.append(t0, t1, out1);
      document.body.append(group);
      // After initial slotchange, swap to a second, distinct malformed <output>
      requestAnimationFrame(() => {
        out1.remove();
        const out2 = document.createElement('output');
        out2.slot = 'output';
        group.append(out2);
        requestAnimationFrame(resolve);
      });
    });
  });
  await page.waitForTimeout(50);

  const matching = warnings.filter(w => w.includes('[nova-temporal-group]') && w.includes('is missing a .output-value'));
  expect(matching.length).toBe(2);
});

async function buildComputeGroup(page, anchorTag, anchorValue, durationValue, durationAttrs = {}) {
  await page.goto('/tests/fixtures/nova-temporal-group-compute.html');
  await page.waitForFunction(() => customElements.get('nova-temporal-group') !== undefined);
  await page.evaluate(async ({ anchorTag, anchorValue, durationValue, durationAttrs }) => {
    if (!customElements.get(anchorTag)) {
      await import(`/js/nova-temporal/${anchorTag}.js`);
      await customElements.whenDefined(anchorTag);
    }
    const group = document.createElement('nova-temporal-group');
    group.id = 'fixture-group';
    const t0 = document.createElement(anchorTag);
    t0.slot = 't0';
    t0.setAttribute('value', anchorValue);
    const d0 = document.createElement('nova-duration');
    d0.slot = 'd0';
    for (const [name, value] of Object.entries(durationAttrs)) {
      d0.setAttribute(name, value);
    }
    d0.setAttribute('value', durationValue);
    const out = document.createElement('output');
    out.slot = 'output';
    out.innerHTML = '<span class="output-value"></span>';
    group.append(t0, d0, out);
    document.body.append(group);
  }, { anchorTag, anchorValue, durationValue, durationAttrs });
  await page.waitForTimeout(200);
  return page.evaluate(() => {
    const group = document.querySelector('#fixture-group');
    return {
      valid: group.checkValidity(),
      message: group.validationMessage,
      output: group.outputValue,
    };
  });
}

test('compute mode: PlainTime anchor + day-bearing duration is invalid (F2)', async ({ page }) => {
  const result = await buildComputeGroup(page, 'nova-time', '14:30:00', 'P1DT2H');
  expect(result.valid).toBe(false);
  expect(result.message).toContain('time anchor');
  expect(result.output).toBe('');
});

test('compute mode: PlainDate anchor + sub-day duration is invalid (F7)', async ({ page }) => {
  const result = await buildComputeGroup(page, 'nova-date', '2026-02-09', 'PT25H');
  expect(result.valid).toBe(false);
  expect(result.message).toContain('date anchor');
  expect(result.output).toBe('');
});

test('compute mode: PlainTime anchor + sub-day duration stays valid (F2 negative)', async ({ page }) => {
  const result = await buildComputeGroup(page, 'nova-time', '14:30:00', 'PT2H');
  expect(result.valid).toBe(true);
  expect(result.output).toBe('16:30:00Z');
});

test('compute mode: PlainDate anchor + day-only duration stays valid (F7 negative)', async ({ page }) => {
  const result = await buildComputeGroup(page, 'nova-date', '2026-02-09', 'P3D');
  expect(result.valid).toBe(true);
  expect(result.output).toBe('2026-02-12');
});

test('compute mode: PlainDate anchor accepts calendar-unit duration where Temporal permits', async ({ page }) => {
  const result = await buildComputeGroup(page, 'nova-date', '2026-02-09', 'P1M', {
    'largest-unit': 'month',
  });
  expect(result.valid).toBe(true);
  expect(result.output).toBe('2026-03-09');
});

async function buildPlainTimeRange(page, t0Value, t1Value) {
  await page.goto('/tests/fixtures/nova-temporal-group-range.html');
  await page.waitForFunction(() => customElements.get('nova-temporal-group') !== undefined);
  await page.evaluate(async ({ t0Value, t1Value }) => {
    if (!customElements.get('nova-time')) {
      await import('/js/nova-temporal/nova-time.js');
      await customElements.whenDefined('nova-time');
    }
    const group = document.createElement('nova-temporal-group');
    group.id = 'fixture-range-time';
    const t0 = document.createElement('nova-time');
    t0.slot = 't0';
    t0.setAttribute('value', t0Value);
    const t1 = document.createElement('nova-time');
    t1.slot = 't1';
    t1.setAttribute('value', t1Value);
    const out = document.createElement('output');
    out.slot = 'output';
    out.innerHTML = '<span class="output-value"></span>';
    group.append(t0, t1, out);
    document.body.append(group);
  }, { t0Value, t1Value });
  await page.waitForTimeout(200);
  return page.evaluate(() => document.querySelector('#fixture-range-time').outputValue);
}

test('range mode: PlainTime forward same-day computes positive duration (F6 baseline)', async ({ page }) => {
  const out = await buildPlainTimeRange(page, '14:30:00', '16:30:00');
  expect(out).toBe('2h');
});

test('range mode: PlainTime spanning midnight uses native signed duration (F6)', async ({ page }) => {
  // Time-only ranges do not infer dates or next-occurrence semantics in v1.
  const out = await buildPlainTimeRange(page, '23:00:00', '01:00:00');
  expect(out).toBe('-22h');
});

test('range mode: PlainTime equal endpoints computes zero duration (F6 edge)', async ({ page }) => {
  const out = await buildPlainTimeRange(page, '14:00:00', '14:00:00');
  expect(out).toBe('0s');
});

test('empty child makes group invalid (valueMissing) regardless of required attribute', async ({ page }) => {
  const r = await page.evaluate(async () => {
    const group = document.createElement('nova-temporal-group');
    const t0 = document.createElement('nova-datetime');
    t0.slot = 't0';
    const t1 = document.createElement('nova-datetime');
    t1.slot = 't1';
    const out = document.createElement('output');
    out.slot = 'output';
    out.innerHTML = '<span class="output-label">Duration</span><span class="output-value"></span>';
    group.append(t0, t1, out);
    document.body.append(group);
    await new Promise((r) => requestAnimationFrame(r));
    return {
      valid: group.checkValidity(),
      valueMissing: group.validity.valueMissing,
      outputText: out.querySelector('.output-value').textContent,
      outputHidden: out.hidden,
    };
  });
  expect(r.valid).toBe(false);
  expect(r.valueMissing).toBe(true);
  expect(r.outputText).toBe('Invalid');
  expect(r.outputHidden).toBe(false);
});

test('output stays visible and shows "Invalid" while incomplete, then resolves once filled', async ({ page }) => {
  const r = await page.evaluate(async () => {
    const group = document.createElement('nova-temporal-group');
    const t0 = document.createElement('nova-datetime');
    t0.slot = 't0';
    const t1 = document.createElement('nova-datetime');
    t1.slot = 't1';
    const out = document.createElement('output');
    out.slot = 'output';
    out.innerHTML = '<span class="output-label">Duration</span><span class="output-value"></span>';
    group.append(t0, t1, out);
    document.body.append(group);
    await new Promise((r) => requestAnimationFrame(r));

    const before = {
      text: out.querySelector('.output-value').textContent,
      hidden: out.hidden,
    };

    t0.value = '2026-04-09T14:00:00Z';
    t1.value = '2026-04-09T15:30:00Z';
    t0.dispatchEvent(new Event('input', { bubbles: true }));
    t1.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((r) => requestAnimationFrame(r));

    return {
      before,
      after: {
        text: out.querySelector('.output-value').textContent,
        hidden: out.hidden,
      },
    };
  });
  expect(r.before).toEqual({ text: 'Invalid', hidden: false });
  expect(r.after.hidden).toBe(false);
  expect(r.after.text).not.toBe('Invalid');
  expect(r.after.text.length).toBeGreaterThan(0);
});

test('group with initial output exceeding max starts as invalid (user-interacted at init)', async ({ page }) => {
  // Range mode with min/max on the group: t1 - t0 = 5h, but max="PT1H".
  const r = await page.evaluate(async () => {
    const group = document.createElement('nova-temporal-group');
    group.setAttribute('min', 'PT0S');
    group.setAttribute('max', 'PT1H');
    const t0 = document.createElement('nova-datetime');
    t0.slot = 't0';
    t0.setAttribute('value', '2026-04-09T10:00:00Z');
    const t1 = document.createElement('nova-datetime');
    t1.slot = 't1';
    t1.setAttribute('value', '2026-04-09T15:00:00Z');
    const out = document.createElement('output');
    out.slot = 'output';
    out.innerHTML = '<span class="output-value"></span>';
    group.append(t0, t1, out);
    document.body.append(group);
    await new Promise((r) => requestAnimationFrame(r));
    await new Promise((r) => requestAnimationFrame(r));
    return {
      rangeOverflow: group.validity.rangeOverflow,
      hostInvalid: group.hasAttribute('invalid'),
      userInvalid: group.matches(':state(user-invalid)'),
      ariaInvalid: group.getAttribute('aria-invalid'),
    };
  });
  expect(r.rangeOverflow).toBe(true);
  expect(r.hostInvalid).toBe(true);
  expect(r.userInvalid).toBe(true);
  expect(r.ariaInvalid).toBe('true');
});

test('group with empty children does NOT start in user-invalid state', async ({ page }) => {
  const r = await page.evaluate(async () => {
    const group = document.createElement('nova-temporal-group');
    const t0 = document.createElement('nova-datetime');
    t0.slot = 't0';
    const t1 = document.createElement('nova-datetime');
    t1.slot = 't1';
    const out = document.createElement('output');
    out.slot = 'output';
    out.innerHTML = '<span class="output-value"></span>';
    group.append(t0, t1, out);
    document.body.append(group);
    await new Promise((r) => requestAnimationFrame(r));
    await new Promise((r) => requestAnimationFrame(r));
    return {
      valueMissing: group.validity.valueMissing,
      hostInvalid: group.hasAttribute('invalid'),
      userInvalid: group.matches(':state(user-invalid)'),
    };
  });
  expect(r.valueMissing).toBe(true);
  expect(r.hostInvalid).toBe(false);
  expect(r.userInvalid).toBe(false);
});

test('row label gets [data-invalid] when its child is empty after user interaction', async ({ page }) => {
  const r = await page.evaluate(async () => {
    const group = document.createElement('nova-temporal-group');
    const labelT0 = document.createElement('label');
    labelT0.slot = 't0-label';
    labelT0.textContent = 'Start';
    const t0 = document.createElement('nova-datetime');
    t0.slot = 't0';
    t0.setAttribute('value', '2026-04-09T14:00:00Z');
    const labelT1 = document.createElement('label');
    labelT1.slot = 't1-label';
    labelT1.textContent = 'End';
    const t1 = document.createElement('nova-datetime');
    t1.slot = 't1';
    // t1 is intentionally empty
    const out = document.createElement('output');
    out.slot = 'output';
    out.innerHTML = '<span class="output-value"></span>';
    group.append(labelT0, t0, labelT1, t1, out);
    document.body.append(group);
    await new Promise((r) => requestAnimationFrame(r));

    const beforeInteraction = {
      t0: labelT0.hasAttribute('data-invalid'),
      t1: labelT1.hasAttribute('data-invalid'),
    };

    // Touch t0 to mark the group as user-interacted
    t0.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((r) => requestAnimationFrame(r));

    return {
      beforeInteraction,
      afterInteraction: {
        t0: labelT0.hasAttribute('data-invalid'),
        t1: labelT1.hasAttribute('data-invalid'),
      },
      hostInvalid: group.hasAttribute('invalid'),
    };
  });
  expect(r.beforeInteraction).toEqual({ t0: false, t1: false });
  expect(r.afterInteraction.t0).toBe(false);
  expect(r.afterInteraction.t1).toBe(true);
  expect(r.hostInvalid).toBe(true);
});

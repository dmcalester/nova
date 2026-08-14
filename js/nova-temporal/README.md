# Nova Temporal Components

Custom elements for date, time, duration, and datetime input — built on the [Temporal API](https://tc39.es/proposal-temporal/docs/) for nanosecond-precision UTC operations. ISO 8601 strings are the boundary format (HTML attributes, form submission, serialization); `Temporal.*` objects are the programmatic currency for in-memory work and helper composition.

Requires Temporal API support (Chrome 144+, Firefox 139+) or a polyfill.

## Audience

These components target operating environments where time is precise and consequential: aerospace and mission control, scientific instrumentation, broadcast and media production, financial back-office systems, logistics. The design defaults — UTC/Zulu, nanosecond fidelity, segment-level keyboard navigation, ISO at the boundary — reflect that audience.

They are not designed for casual booking flows or consumer-facing date pickers. Locale-aware presentation, calendar popovers, and time-zone selection are out of scope. If your application asks "what date works for you?", reach for a more general-purpose component.

>[!NOTE]
> Nova's instant-bearing temporal components (`<nova-input-datetime>`, `<nova-clock>`, `<nova-elapsed>`) use [Temporal.Instant](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/Instant) as their canonical type. Display happens via on-demand `instant.toZonedDateTimeISO(zoneId)`. The `zone` attribute accepts fixed-offset zones only — military single letters (`Z`, `A`–`Y` excluding `J`) and numeric offsets (`±HH:MM`). IANA names are rejected. DST is excluded by construction.

## Components

| Component | Tag | Description |
|-----------|-----|-------------|
| [nova-input-datetime](#nova-input-datetime) | `<nova-input-datetime>` | Combined date+time input (Zulu instant) |
| [nova-input-ordinal-date](#nova-input-ordinal-date) | `<nova-input-ordinal-date>` | Ordinal date (YYYY-DDD) |
| [nova-input-duration](#nova-input-duration) | `<nova-input-duration>` | ISO 8601 duration (PnYnMnWnDTnHnMnS) |
| [nova-input-temporal-group](#nova-input-temporal-group) | `<nova-input-temporal-group>` | Generic coordination wrapper for any temporal components |
| [nova-clock](#nova-clock) | `<nova-clock>` | Live UTC clock display |
| [nova-elapsed](#nova-elapsed) | `<nova-elapsed>` | Live count-up / count-down display (MET, T-minus) |

## Quick Start

```html
<script type="module" src="js/nova-temporal/nova-input-datetime.js"></script>

<nova-input-datetime
  name="observation_time"
  smallest-unit="second"
  value="2026-02-09T14:30:00Z"
></nova-input-datetime>
```

## Architecture

The five input components extend `NovaTemporalInputBase`, which extends the domain-neutral `NovaSegmentInputBase`. See [Files](#files) for the layering rationale.

`NovaSegmentInputBase` provides:

- Shadow DOM with constructable stylesheets
- Form association via `ElementInternals` (`name`, `value`, `FormData`, `checkValidity()`)
- Roving tabindex keyboard navigation between segments
- Digit entry with auto-advance
- ArrowUp/Down nudge with wrapping
- Backspace/Delete to clear segments
- Copy/paste (single-segment and full ISO parse)
- Min/max constraint validation
- Required validation
- Disabled/readonly states

`NovaTemporalInputBase` adds the typed-value contract: `temporal` getter/setter, `temporalType`, `formatTemporal()`, and the `_toTemporal` / `_formatTemporal` hooks the input widgets implement. Per-subclass `temporal` type: `Temporal.Instant` for `<nova-input-datetime>`; `Temporal.PlainDate` for `<nova-input-ordinal-date>`; `Temporal.Duration` for `<nova-input-duration>`.

Design tokens (`--input-*`, `--space-*`, `--font-*`, etc.) inherit from `:root` via CSS custom properties — no duplicate token declarations in shadow DOM.

### Interface Contract

All input components expose a standard interface for crossing the boundary (ISO strings) and for in-memory work (Temporal objects):

| Property | Type | Role |
|----------|------|------|
| `value` | string | ISO 8601 boundary value — what HTML attributes carry, what `FormData` returns, what wire protocols consume |
| `temporal` | Temporal.* \| null | `<nova-input-datetime>` exposes `Temporal.Instant`. `<nova-input-ordinal-date>` exposes `Temporal.PlainDate`. `<nova-input-duration>` exposes `Temporal.Duration`. |
| `temporalType` | string \| null | Type identifier: `'Instant'`, `'PlainDate'`, `'PlainTime'`, `'Duration'`, or `null` when the component is in a configuration that cannot produce a Temporal value (see `<nova-input-ordinal-date>` day-only mode) |
| `formatTemporal(t)` | string | Public formatter for converting a Temporal object to this component's ISO value string |

**Use `.value`** for HTML attributes, form submission, JSON serialization, anything that crosses out of the JavaScript runtime. This is what the components store on the DOM and what consumers read for serialization.

**Use `.temporal`** for in-memory composition. Pass it to the helpers in this library, chain `.add()` / `.until()` / `.compare()` against it, do arithmetic without parse/serialize churn between operations.

**Components in degenerate configurations may report `temporalType: null`.** `<nova-input-ordinal-date>` does this in day-only mode (`value="040"`) — it cannot produce a `Temporal.PlainDate` without year context. Consumers should check `el.temporalType !== null` before reading `el.temporal`.

```javascript
const input = document.querySelector('nova-input-datetime');

// Boundary — ISO string (always Z on read by default; configurable via value-format)
input.value;                                        // '2026-02-09T14:30:00Z'
input.value = '2026-02-09T15:00:00Z';
input.value = '2026-02-09T15:00:00-05:00';          // stored as '2026-02-09T20:00:00Z'
input.value = '';                                   // clears

// Programmatic — Temporal.Instant
input.temporal;                                     // Temporal.Instant
input.temporal = Temporal.Instant.from('2026-02-09T16:00:00Z');
input.temporal = null;                              // clears
input.temporal = Temporal.PlainDate.from('2026-02-09');  // throws TypeError
```

---

## nova-input-ordinal-date

DoD ordinal date input (YYYY-DDD).

### Attributes

| Attribute | Values | Default | Description |
|-----------|--------|---------|-------------|
| `value` | ordinal date string | — | e.g. `"2026-040"` |
| `name` | string | — | Form field name |
| `min` | ordinal date string | — | Minimum valid value |
| `max` | ordinal date string | — | Maximum valid value |
| `required` | boolean | — | Value must be provided |
| `disabled` | boolean | — | Disables input |
| `readonly` | boolean | — | Prevents editing |
| `hotkeys` | boolean | — | Enables `n` key (set to now) |
| `overflow` | `constrain` `reject` | `constrain` | `reject` keeps invalid year/day-of-year combinations visible and marks the component invalid; default `constrain` clamps to the nearest valid day |

### Value Format

`"YYYY-DDD"` — e.g. `"2026-040"` (February 9th)

By default, invalid year/day-of-year combinations are clamped to the nearest valid day. Set `overflow="reject"` to keep the typed value visible and mark the component invalid instead.

### Paste Behavior

- Ordinal dates accepted directly
- Calendar dates converted (`2026-02-09` → `2026-040`)
- Datetime strings: extracts date part

---

## nova-input-duration

ISO-8601-1 duration input with labeled segments.

### Attributes

| Attribute | Values | Default | Description |
|-----------|--------|---------|-------------|
| `value` | ISO-8601-1 duration string | — | e.g. `"P1Y2M3DT4H30M45S"` |
| `largest-unit` | `year` `month` `day` `hour` `minute` `second` `millisecond` `microsecond` `nanosecond` | `year` | Largest visible duration segment |
| `smallest-unit` | `year` `month` `day` `hour` `minute` `second` `millisecond` `microsecond` `nanosecond` | `second` | Smallest visible duration segment |
| `largest-unit-digits` | integer 1–9 | natural width | Widens the largest visible unit (e.g. 4-digit days). Must be ≥ that unit's natural width. |
| `name` | string | — | Form field name |
| `min` | ISO-8601-1 duration string | — | Minimum valid value |
| `max` | ISO-8601-1 duration string | — | Maximum valid value |
| `required` | boolean | — | Value must be provided |
| `disabled` | boolean | — | Disables input |
| `readonly` | boolean | — | Prevents editing |

### Value Format

ISO-8601-1 duration: `"P1Y2M3DT4H30M45S"`, `"PT2H0M30.500S"`, `"P3DT12H0M0S"`.

The week designator (`P{n}W`) is **not supported**. ISO-8601-1 only allows weeks in isolation — they cannot combine with other date or time components — so `nova-input-duration` rejects week-form inputs (`P1W`, `P1W2D`, etc.) outright rather than carry a partial implementation. `parseDuration()` returns `null` for any string containing a `W` designator.

Segments display as the inclusive unit window from `largest-unit` to `smallest-unit`. The default is `year` through `second` (all standard units visible). Sub-second fractional fields (ms/us/ns) keep 3 digits; all other units stay at their natural 2-digit width.

```html
<nova-input-duration largest-unit="hour" smallest-unit="second" value="PT4H33M12S"></nova-input-duration>
<nova-input-duration largest-unit="day" smallest-unit="hour" value="P2DT4H"></nova-input-duration>
<nova-input-duration largest-unit="year" smallest-unit="nanosecond" value="P1Y2M3DT4H30M45.123456789S"></nova-input-duration>
```

Values with nonzero units outside the visible window are rejected. For example, `largest-unit="hour" smallest-unit="second"` accepts `PT4H33M12S` and rejects `P1DT4H`.

#### Widening the largest visible unit

Only the largest visible unit overflows by convention. If a mission needs more capacity in that unit, use `largest-unit-digits`:

```html
<!-- Up to 9999 elapsed days -->
<nova-input-duration largest-unit="day" largest-unit-digits="4" value="P1234DT5H6M7S"></nova-input-duration>

<!-- Up to 9999 elapsed minutes when day/hour aren't shown -->
<nova-input-duration largest-unit="minute" smallest-unit="second" largest-unit-digits="4"></nova-input-duration>
```

The override applies only to the head (largest) descriptor in the active window. Values narrower than that descriptor's natural width are rejected so existing data is never silently truncated. Range is 1–9 digits.

### Paste Behavior

- ISO 8601 duration strings accepted directly: `PT1H30M`, `P1Y2M3W4DT5H`

---

## nova-input-datetime

Combined date+time input as a single component — all segments are in one flat array with unified keyboard navigation.

### Attributes

| Attribute | Values | Default | Description |
|-----------|--------|---------|-------------|
| `value` | ISO datetime string | — | e.g. `"2026-02-09T14:30:00Z"` |
| `format` | `date` `ordinal` | `date` | Date format (`YYYY-MM-DD` or `YYYY-DDD`) |
| `smallest-unit` | `minute` `second` `millisecond` `microsecond` `nanosecond` | `second` | Time segment granularity |
| `zone` | military letter or numeric offset | `Z` | Display zone (e.g. `Z`, `A`, `-05:00`, `+09:30`). IANA names rejected. |
| `value-format` | `z` `offset` | `z` | `.value` emission format. `z` is always UTC; `offset` reflects the configured zone. |
| `name` | string | — | Form field name |
| `min` | ISO datetime string | — | Minimum valid value |
| `max` | ISO datetime string | — | Maximum valid value |
| `required` | boolean | — | Value must be provided |
| `overflow` | `constrain` `reject` | `constrain` | `reject` keeps invalid date segment combinations visible and marks the component invalid; default `constrain` clamps to the nearest valid date |
| `disabled` | boolean | — | Disables input |
| `readonly` | boolean | — | Prevents editing |
| `hotkeys` | boolean | — | Enables `n` key (set to now) |

### Value Format

`"YYYY-MM-DDThh:mm:ssZ"` (calendar) or `"YYYY-DDDThh:mm:ssZ"` (ordinal)

### Zone & value-format

The `zone` attribute shifts the displayed wall-clock segments without changing the canonical instant. Setting `zone="-05:00"` on a component with value `2026-02-09T14:30:00Z` displays segments showing `2026-02-09T09:30:00`; `.temporal` still returns the same Instant.

`value-format="offset"` emits `.value` with the configured zone's offset suffix (e.g. `2026-02-09T09:30:00-05:00`), no `[zone]` bracket. `value-format="z"` (default) always emits the canonical Z form.

### Paste Behavior

- Full datetime strings accepted (both calendar and ordinal formats, with cross-format conversion)
- Date-only: sets date segments, preserves existing time
- Time-only: sets time segments, preserves existing date

### Example

```html
<nova-input-datetime
  format="ordinal"
  smallest-unit="minute"
  value="2026-040T14:30Z"
  name="aos"
  hotkeys
></nova-input-datetime>
```

---

## nova-input-temporal-group

Generic coordination wrapper for any combination of temporal components. Accepts `nova-input-datetime`, `nova-input-ordinal-date`, and `nova-input-duration` in flexible slot configurations. Provides group-level chrome, validation, and auto-computation.

### Slot Naming

| Slot pattern | Description |
|--------------|-------------|
| `t0`, `t1`, `t2`, ... | Temporal inputs (nova-input-datetime, nova-input-ordinal-date) |
| `d0`, `d1`, `d2`, ... | Duration inputs (nova-input-duration) |
| `t0-label`, `d0-label`, ... | Labels for corresponding inputs |
| `output` | Computed output display |

### Mode Inference

The group automatically infers its mode based on which slots are populated:

| Slots present | Inferred mode | Output |
|--------------|---------------|--------|
| Only `t[N]` slots | Range | Duration between first and last temporal |
| Has `d[N]` slots | Compute | Computed temporal value (t0 + all durations) |

### Derived Value Computation

Derived values update reactively as child inputs change:

- **Range mode** (2+ dates): Computes and displays the duration from the first temporal slot to the last. With 3+ temporals, consecutive pairs are validated for ordering.
- **Compute mode** (date + durations): Computes and displays the resulting datetime (t0 + d0 + d1 + ...) in the output slot.

### Attributes

| Attribute | Values | Default | Description |
|-----------|--------|---------|-------------|
| `expanded` | boolean | — | Vertical layout (stacks labels above inputs) |
| `disabled` | boolean | — | Propagates to all children |
| `readonly` | boolean | — | Propagates to all children |
| `required` | boolean | — | Group requires valid output |
| `name` | string | — | Form field name |
| `min` | string | — | Minimum constraint (see below) |
| `max` | string | — | Maximum constraint (see below) |
| `output-format` | `duration` `end` `interval` `start-duration` `duration-end` | mode-dependent | Output string format (see below) |
| `aria-label` | string | inferred | Accessible label |
| `aria-labelledby` | IDREF | — | Reference to external label |

### Min/Max Constraints

The `min` and `max` attributes constrain the group's computed output. The format depends on the mode:

**Range mode** (only temporal slots): min/max are ISO 8601 durations constraining the duration between t0 and t1.

```html
<!-- Duration must be between 30 minutes and 8 hours -->
<nova-input-temporal-group min="PT30M" max="PT8H">
  <nova-input-datetime slot="t0" value="2026-04-10T09:00:00Z"></nova-input-datetime>
  <nova-input-datetime slot="t1" value="2026-04-10T12:00:00Z"></nova-input-datetime>
</nova-input-temporal-group>
```

**Compute mode** (has duration slots): min/max are datetime strings constraining the computed result.

```html
<!-- Computed end time must not exceed 18:00 -->
<nova-input-temporal-group max="2026-04-10T18:00:00Z">
  <nova-input-datetime slot="t0" value="2026-04-10T14:00:00Z"></nova-input-datetime>
  <nova-input-duration slot="d0" value="PT2H"></nova-input-duration>
</nova-input-temporal-group>
```

Sets `rangeUnderflow` or `rangeOverflow` validity flags when constraints are violated.

### Output Format

By default the group writes an ISO duration in range mode and the computed temporal in compute mode. `output-format` switches the string written to the `<output>` slot — and submitted as the `[output]` FormData entry — to one of the ISO 8601 interval forms or a single-value form.

| Value | Range mode | Compute mode |
|-------|------------|--------------|
| `duration` | `P1DT2H` (default) | sum of duration slots |
| `end` | last temporal | computed temporal (default) |
| `interval` | `<t0>/<tLast>` | `<t0>/<computed>` |
| `start-duration` | `<t0>/<duration>` | `<t0>/<sumDurations>` |
| `duration-end` | `<duration>/<tLast>` | `<sumDurations>/<computed>` |

```html
<nova-input-temporal-group output-format="interval">
  <nova-input-ordinal-date slot="t0" value="2021-283"></nova-input-ordinal-date>
  <nova-input-ordinal-date slot="t1" value="2021-284"></nova-input-ordinal-date>
  <output slot="output"><span class="output-value"></span></output>
</nova-input-temporal-group>
<!-- output-value: 2021-283/2021-284 -->
```

Endpoints (t0/t1/d0/…) are always submitted as individual FormData entries regardless of `output-format`, so changing the format never loses data — it only changes the human/derived display string.

### Type Compatibility

Components are grouped into type families:

| Family | Components | Mixable |
|--------|-----------|---------|
| DateTime | `nova-input-datetime` | Only with itself. Canonical type is `Temporal.Instant`. |
| Date | `nova-input-ordinal-date` | Yes within the family (same underlying type) |
| Duration | `nova-input-duration` | N/A (separate role) |

Cross-family mixing (e.g., `nova-input-datetime` + `nova-input-ordinal-date`) produces a console warning and validation error.

### Events

| Event | Detail | Description |
|-------|--------|-------------|
| `temporal-change` | `{ mode, slots, invalid }` | Fires on any child input change |
| `nova-error` | `{ code, message, info }` | Bubbles when the group rejects bad input. See [Error Reporting](#error-reporting) |

Event-detail shape: flat keys when the schema is fixed; nested under a bag key (e.g. `slots`) when keys are dynamic.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `mode` | string | Inferred mode ('range' or 'compute') |
| `formattedValue` | string | Computed output value |
| `outputFormat` | string | Active output format (resolves to mode default when unset) |
| `min` | string | Minimum constraint |
| `max` | string | Maximum constraint |
| `validity` | ValidityState | Form validation state |
| `validationMessage` | string | Validation error message |

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `checkValidity()` | boolean | Returns true if valid |
| `reportValidity()` | boolean | Returns true if valid, shows validation UI |
| `getSlot(name)` | Element | Returns the element in the named slot |

### Examples

**Range mode** — compute duration between two datetimes:

```html
<nova-input-temporal-group name="contact-window">
  <label slot="t0-label">AOS</label>
  <nova-input-datetime slot="t0" value="2026-02-09T14:30:00Z"></nova-input-datetime>
  <label slot="t1-label">LOS</label>
  <nova-input-datetime slot="t1" value="2026-02-09T15:45:00Z"></nova-input-datetime>
  <output slot="output">
    <span class="output-label">Duration</span>
    <span class="output-value"></span>
  </output>
</nova-input-temporal-group>
```

**Compute mode** — start + duration = computed end in output:

```html
<nova-input-temporal-group name="mission-window">
  <label slot="t0-label">Launch</label>
  <nova-input-datetime slot="t0" value="2026-02-09T14:30:00Z"></nova-input-datetime>
  <label slot="d0-label">Window</label>
  <nova-input-duration slot="d0" value="PT2H"></nova-input-duration>
  <output slot="output">
    <span class="output-label">Cutoff</span>
    <span class="output-value"></span>
  </output>
</nova-input-temporal-group>
```

**Date range** — ordinal (day-of-year) endpoints:

```html
<nova-input-temporal-group name="ops-period">
  <label slot="t0-label">Start</label>
  <nova-input-ordinal-date slot="t0" value="2026-040"></nova-input-ordinal-date>
  <label slot="t1-label">End</label>
  <nova-input-ordinal-date slot="t1" value="2026-050"></nova-input-ordinal-date>
</nova-input-temporal-group>
```

### Form submission

`nova-input-temporal-group` behaves like a `<fieldset>`: every child input ships under a namespaced FormData key, plus an `[output]` entry for the computed value. Each child's own `name` attribute (when present) chooses the key; otherwise the slot name (`t0`, `t1`, `d0`, …) is used.

```html
<form>
  <nova-input-temporal-group name="window">
    <nova-input-datetime slot="t0" name="start" value="2026-02-09T14:30:00Z"></nova-input-datetime>
    <nova-input-datetime slot="t1" name="end" value="2026-02-09T15:45:00Z"></nova-input-datetime>
    <output slot="output"><span class="output-value"></span></output>
  </nova-input-temporal-group>
</form>
```

Submits:

```
window[start]  = 2026-02-09T14:30:00Z
window[end]    = 2026-02-09T15:45:00Z
window[output] = PT1H15M
```

Without a child `name`, keys fall back to slot positions (`window[t0]`, `window[t1]`). Without a group `name`, children submit under their plain key (`start`, `end`, `output`) — the same fallback the platform uses for unnamed fieldsets. A `disabled` group submits no entries at all.

### Custom States

| State | Condition |
|-------|-----------|
| `:state(required)` | Element has `required` attribute |
| `:state(optional)` | Element does not have `required` attribute |
| `:state(invalid)` | Group is invalid |
| `:state(valid)` | Group is valid |
| `:state(user-invalid)` | Invalid after user interaction |
| `:state(user-valid)` | Valid after user interaction |

### Label Styling

Labels receive `[data-invalid]` once the user has interacted with the group or a form submission has failed validation — same gating as `:state(user-invalid)`. Required-but-empty inputs do not flag their labels until then.

```css
[slot$="-label"][data-invalid] {
  color: var(--input-border-color--invalid);
}
```

The host's `[invalid]` attribute follows the same rule.

---

## nova-clock

Live UTC clock display for ops center use.

### Attributes

| Attribute | Values | Default | Description |
|-----------|--------|---------|-------------|
| `smallest-unit` | `minute` `second` `millisecond` | `second` | Display granularity |
| `show-date` | boolean | — | Prepend ordinal date (YYYY-DDD) |
| `zone` | military letter or numeric offset | `Z` (UTC) | Display zone (e.g. `Z`, `A`, `-05:00`, `+09:30`). |
| `stopped` | boolean | — | Pause the clock |

### Example

```html
<nova-clock show-date smallest-unit="second"></nova-clock>
```

### Timer Behavior

- **Seconds/minutes**: Boundary-synced ticks — calculates ms until next second/minute boundary. Multiple instances stay aligned.
- **Milliseconds**: 100ms `setTimeout` intervals.

---

## nova-elapsed

Live count-up / count-down display for mission elapsed time (MET), T-minus
countdowns, and similar ops displays. It shows the signed duration between a
fixed `epoch` and now, ticking live. Neither the epoch nor the threshold is
rendered — only the running count, laid out as `[prefix±][time]`.

### Attributes

| Attribute | Values | Default | Description |
|-----------|--------|---------|-------------|
| `epoch` | ISO-8601 datetime | — | Reference instant the count runs from. The epoch string must include `Z` or a numeric offset; unzoned input is rejected (`invalid-epoch`). |
| `prefix` | string | — | Sign-bearing token (e.g. `T`, `L`) rendered before `±` |
| `threshold` | ISO-8601 duration | `PT0S` | The freeze / crossing point |
| `threshold-behavior` | `freeze` `continue` `warn` | `freeze` | What the count does at the threshold (see below) |
| `largest-unit` | `day` `hour` `minute` `second` `millisecond` `microsecond` `nanosecond` | `day` | Top of the display window |
| `smallest-unit` | `day` `hour` `minute` `second` `millisecond` `microsecond` `nanosecond` | `second` | Bottom of the display window |
| `stopped` | boolean | — | Pause the live tick |

### Threshold Behavior

`elapsed = now − epoch` increases monotonically and crosses `threshold` exactly
once. `threshold-behavior` decides what the count does there:

| Value | Count behavior | `:state(out-of-range)` |
|-------|----------------|------------------------|
| `freeze` (default) | **Stops** at the threshold and holds | — |
| `continue` | **Runs through** the threshold, unremarked (e.g. `T-2s` becomes `T+2s`) | — |
| `warn` | Runs through the threshold, **flagged** | set while past the threshold |

The default `threshold` of `PT0S` puts the crossing at the epoch itself.

**Mission Elapsed Time is a `continue` counter.** It runs *through* T-0 and
counts up indefinitely — it has no stop, and the crossing is unremarkable. Use
`warn` for a count whose crossing is operationally significant; use `freeze`
(the default) for a count-down that should hold at T-0.

#### Freeze vs. events — the footgun

The **freeze** is a condition: it applies whenever `elapsed ≥ threshold`,
witnessed live or not.

The **events** (`threshold-crossed` / `elapsed-stopped`) are transitions: they
fire only on a live not-crossed → crossed edge. A count already past the
threshold at connect-time fires nothing — the first tick only establishes a
baseline. So after a page reload a `freeze` count re-freezes *silently*, and a
`continue`/`warn` count past its threshold emits no `threshold-crossed`. Treat
the events as live notifications, not as the source of truth for "is this past
its threshold" — read `:state(out-of-range)` (for `warn` counts) or the
displayed value for the current picture.

### Events

Both bubble and are composed, with a flat detail `{ epoch, threshold, elapsed }`
(all ISO-8601 strings).

| Event | When |
|-------|------|
| `threshold-crossed` | The count is witnessed crossing the threshold with `threshold-behavior` `continue` or `warn` |
| `elapsed-stopped` | The count is witnessed freezing at the threshold with `threshold-behavior="freeze"` |

### Custom States

| Selector | Meaning |
|----------|---------|
| `:state(out-of-range)` | `threshold-behavior="warn"` and the count has passed the threshold |

### Example

```html
<!-- MET counting up from launch — runs through T-0 unremarked -->
<nova-elapsed prefix="T" threshold-behavior="continue" epoch="2026-05-14T12:00:00Z"></nova-elapsed>

<!-- T-minus countdown that holds at T-0 — freeze is the default -->
<nova-elapsed prefix="T" epoch="2026-05-14T18:00:00Z"></nova-elapsed>

<!-- A crossing that matters — runs through, flagged via :state(out-of-range) -->
<nova-elapsed prefix="T" threshold-behavior="warn" epoch="2026-05-14T18:00:00Z"></nova-elapsed>
```

### Timer Behavior

Same boundary-synced strategy as `nova-clock`: second/minute/hour/day windows
resync to the next wall-clock boundary; sub-second windows fall back to ~10fps.

---

## Keyboard Navigation

All input components share the same keyboard behavior:

| Key | Action |
|-----|--------|
| Tab / Shift+Tab | Move between segments (or exit component at edges) |
| ArrowRight / ArrowLeft | Move between segments |
| ArrowUp / ArrowDown | Nudge value up/down (wraps at min/max) |
| 0-9 | Digit entry with auto-advance |
| Backspace / Delete | Clear focused segment to default |
| Ctrl+C / ⌘-C | Copy full ISO value (copies the raw segment string when the component is in an invalid state) |
| Ctrl+V | ⌘-V Paste (single-segment or full ISO) |
| `n` | Set to current UTC now (requires `hotkeys` attribute) |

---

## Form Integration

All input components and `nova-input-temporal-group` are form-associated custom elements (`nova-clock` is not):

```html
<form id="obs-form">
  <nova-input-ordinal-date name="obs_date" value="2026-040" required></nova-input-ordinal-date>
  <nova-input-datetime name="obs_datetime" smallest-unit="second" value="2026-02-09T14:30:00Z"></nova-input-datetime>
  <button type="submit">Submit</button>
</form>

<script>
  document.getElementById('obs-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    // { obs_date: "2026-040", obs_datetime: "2026-02-09T14:30:00Z" }
  });
</script>
```

### Validation

- `required` — sets `valueMissing` when empty
- `min` / `max` — sets `rangeUnderflow` / `rangeOverflow`. Unparseable bounds throw `RangeError` (validity-strict — author-supplied bounds must be valid).
- `checkValidity()` / `reportValidity()` work as expected
- `disabled` elements are excluded from validation and form submission

### Custom States

Since native pseudo-classes like `:required` and `:user-invalid` don't reliably work on custom elements, all input components and `nova-input-temporal-group` expose validation states via `ElementInternals.states` (CustomStateSet). These can be used in CSS with the `:state()` selector.

| State | Condition |
|-------|-----------|
| `:state(required)` | Element has `required` attribute |
| `:state(optional)` | Element does not have `required` attribute |
| `:state(invalid)` | Validity is not valid (immediate, before interaction) |
| `:state(valid)` | Validity is valid |
| `:state(user-invalid)` | Invalid and the user has interacted |
| `:state(user-valid)` | Valid and the user has interacted |
| `:state(out-of-range)` | Value is below `min` or above `max` |
| `:state(in-range)` | Value is within `min`/`max` bounds |
| `:state(child-invalid)` | (`nova-input-temporal-group` only) Any child input is invalid |

User interaction is tracked automatically — states like `user-invalid` only activate after the user has edited a segment. `formResetCallback()` clears the interaction flag.

#### Usage in CSS

```css
/* Required asterisk on associated label */
.nova-label:has(~ .nova-control:state(required))::after {
  content: "*";
}

/* Immediate invalid (before interaction) — subtle */
.nova-label:has(~ .nova-control:state(invalid):not(:state(user-invalid))) {
  color: var(--input-border-color--invalid);
}

/* User-invalid (after interaction) — prominent with icon */
.nova-label:has(~ .nova-control:state(user-invalid)) {
  color: var(--input-border-color--invalid);
  font-weight: var(--font-weight-600);
}

/* Valid states — explicitly reset to default */
.nova-label:has(~ .nova-control:state(valid)),
.nova-label:has(~ .nova-control:state(user-valid)) {
  color: var(--label-text-color);
  font-weight: var(--label-font-weight);
}

/* Group with any invalid child */
.nova-label:has(~ nova-input-temporal-group:state(child-invalid)) {
  color: var(--input-border-color--invalid);
}

/* Out-of-range styling */
.nova-control:state(out-of-range) {
  /* custom page-level styling */
}
```

These custom states work alongside the browser's built-in `ElementInternals` validity — `checkValidity()`, `reportValidity()`, and the `validity` property all function as expected.

---

## CSS Custom Properties

Components inherit all styling from page-level CSS custom properties. Key tokens:

| Property | Description |
|----------|-------------|
| `--input-font-family` | Font family |
| `--input-font-size` | Font size |
| `--input-line-height` | Line height |
| `--input-text-color` | Text color |
| `--input-background-color` | Background |
| `--input-border-width` | Border width |
| `--input-border-color` | Border color |
| `--input-border-radius` | Border radius |
| `--input-padding` | Internal padding |
| `--input-height` | Explicit height (default: `auto`) |
| `--input-border-color--hover` | Hover border color |
| `--input-background-color--selected` | Focused segment background |
| `--input-text-color--selected` | Focused segment text color |
| `--input-text-color--disabled` | Disabled text color |
| `--input-background-color--disabled` | Disabled background |
| `--input-border-color--disabled` | Disabled border color |
| `--color-focus-ring` | Focus outline color |
| `--transition-input-in` | Hover-in transition |
| `--transition-input-out` | Hover-out transition |
| `--temporal-output-text-color` | Output display text color (`nova-input-temporal-group`) |
| `--temporal-output-font-weight` | Output display font weight (`nova-input-temporal-group`) |
| `--temporal-output-font-size` | Output display font size (`nova-input-temporal-group`) |
| `--temporal-output-background-color--invalid` | Output display background when invalid (`nova-input-temporal-group`) |

---

## Helpers

The package index intentionally exports a small helper surface: ordinal-date helpers for Temporal's missing ordinal constructor/parser and an ISO-8601 duration formatter. For parsing, arithmetic, comparison, conversion, and `Temporal.Now.*`, use the native Temporal methods directly.

```javascript
import {
  formatDurationHuman,
  ordinalDateToPlainDate,
  parseOrdinalDate,
  formatOrdinalDate,
  parseZone,
} from './js/nova-temporal/index.js';
```

### Arithmetic

Use the native Temporal methods directly — the library does not wrap them.

```javascript
const start = document.querySelector('#start-time').temporal;

const end = start.add(Temporal.Duration.from('PT2H30M'));
// Temporal.Instant — start plus 2h30m

const beforeStart = start.subtract(Temporal.Duration.from('PT15M'));
// Temporal.Instant — start minus 15m

const dur = start.until(end);
// Temporal.Duration from start to end
```

If you want a specific largest unit in the result, pass it explicitly: `start.until(end, { largestUnit: 'day' })`.

### ISO-8601 duration formatter

```javascript
formatDurationHuman(Temporal.Duration.from('PT1H30M'));
// 'PT1H30M'

formatDurationHuman(Temporal.Duration.from('P3DT4H'));
// 'P3DT4H'
```

### Ordinal dates

```javascript
ordinalDateToPlainDate(2026, 40).toString();
// '2026-02-09'

parseOrdinalDate('2026-040');
// { year: 2026, dayOfYear: 40 }

formatOrdinalDate({ year: 2026, dayOfYear: 40 });
// '2026-040'
```

### Boundary parsing

To work with an ISO string from middleware or storage, parse at the boundary:

```javascript
const dur = Temporal.Instant.from(startISO).until(Temporal.Instant.from(endISO));
```

The library does not wrap `Temporal.*.from()` — it's the standard API and one line at the boundary keeps the call sites honest about where parsing happens.

### Zone parsing

```javascript
parseZone('Z');                   // 'UTC'
parseZone('A');                   // '+01:00'
parseZone('-05:00');              // '-05:00'
parseZone('America/Denver');      // null — IANA rejected
```

---

## Error Reporting

All non-throw error paths route through a single helper that dispatches a `nova-error` `CustomEvent` and writes a console message. The host app subscribes once and decides what to surface — toast, log, telemetry, modal, alert.

```javascript
import { setNovaEnv } from "./js/nova-temporal/nova-temporal-errors.js";

// Once at startup. Default is "development".
setNovaEnv("production");

document.addEventListener("nova-error", (e) => {
  // e.detail = { code, message, info }
  myTelemetry.report(e.detail);
});
```

`nova-error` events bubble and cross shadow boundaries (`composed: true`). They fire in both dev and production — only the console output differs.

### Environments

| Env | Console output | Event detail |
|-----|----------------|--------------|
| `development` (default) | Verbose `[<tag>] <message>`, optional context object | Full fidelity |
| `production` | Single canonical sentence: *"Error handling must be defined for operational environments and adhere to each environment's security posture."* | Full fidelity |

The production console message is intentionally generic: production deployments must wire their own error handling that meets their security posture (no leaked input, no stack traces, no PII). Detail still flows through the event so authorized listeners can route it.

### Codes

| Code | Source | When |
|------|--------|------|
| `value-parse-error` | `<nova-*>` segment input | The `value` attribute (or attribute-path `setAttribute("value", …)`) cannot be parsed; the component falls back to placeholders |
| `paste-parse-error` | `<nova-*>` segment input | A pasted string cannot be parsed |
| `paste-range` | `<nova-*>` segment input | Pasted value parses but is out of `min`/`max` |
| `constraint-parse-error` | `<nova-input-temporal-group>` | `min`/`max` attribute on the group is unparseable; the group is `customError`-invalid until corrected |
| `compute-error` | `<nova-input-temporal-group>` | A `Temporal.*` op throws while computing the group's output (e.g. `PlainDate.add({ months: 1 }, { overflow: "reject" })`); OR a calendar-unit duration (years/months/days) is applied to an Instant t0 (use `PT`-form durations instead). |
| `invalid-zone` | `<nova-input-datetime>`, `<nova-clock>` | The `zone` attribute is not a military letter, `Z`, or numeric offset. Components render placeholders until corrected. |
| `type-incompatibility` | `<nova-input-temporal-group>` | Sibling temporal slots mix incompatible families (e.g. PlainTime with PlainDate). Group surfaces this as `customError` |
| `output-slot-shape` | `<nova-input-temporal-group>` | The `slot="output"` element is not an `<output>` or is missing a `.output-value` descendant. Authoring hint, not a runtime failure |

Programmatic API misuse still throws synchronously (matches the standard DOM contract):

- `el.temporal = wrongType` → `TypeError`
- `el.value = "unparseable"` (property setter) → `RangeError` from the underlying `parseAndSet`
- `<nova-segment-input-base>` reading `min`/`max` that don't parse → `RangeError` during `#validateRange`

---

## Files

Class hierarchy:

- `NovaSegmentInputBase` (at `js/nova-segment-input-base.js`, one level up) — domain-neutral mechanics: shadow DOM, segments, keyboard, paste, form association, `value`/`min`/`max` plumbing. Reusable outside `nova-temporal/`.
- `NovaTemporalInputBase` (at `nova-temporal-input-base.js`) — extends the segment base; adds the typed-value contract (`temporal` getter/setter, `temporalType`, `_toTemporal`, `_formatTemporal`).
- The five concrete temporal widgets extend `NovaTemporalInputBase`.

Shared type definitions live at `js/nova-segment-types.js`.

| File | Purpose |
|------|---------|
| `nova-temporal.js` | Pure utility functions — parsing, formatting, arithmetic, comparison |
| `nova-temporal-errors.js` | `setNovaEnv`, `getNovaEnv`, `reportNovaError`. Dispatches `nova-error` events; gates console output by env |
| `nova-temporal-input-base.js` | Abstract base adding the Temporal-typed-value contract |
| `nova-temporal-segments.js` | Shared segment descriptor constants and builders |
| `nova-input-ordinal-date.js` | `<nova-input-ordinal-date>` component |
| `nova-input-duration.js` | `<nova-input-duration>` component |
| `nova-input-datetime.js` | `<nova-input-datetime>` component |
| `nova-input-temporal-group.js` | `<nova-input-temporal-group>` component |
| `nova-clock.js` | `<nova-clock>` component |

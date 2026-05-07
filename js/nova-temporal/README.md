# Nova Temporal Components

Custom elements for date, time, duration, and datetime input — built on the [Temporal API](https://tc39.es/proposal-temporal/docs/) for nanosecond-precision UTC operations. ISO 8601 strings are the boundary format (HTML attributes, form submission, serialization); `Temporal.*` objects are the programmatic currency for in-memory work and helper composition.

Requires Temporal API support (Chrome 144+, Firefox 139+) or a polyfill.

## Audience

These components target operating environments where time is precise and consequential: aerospace and mission control, scientific instrumentation, broadcast and media production, financial back-office systems, logistics. The design defaults — UTC/Zulu, nanosecond fidelity, segment-level keyboard navigation, ISO at the boundary — reflect that audience.

They are not designed for casual booking flows or consumer-facing date pickers. Locale-aware presentation, calendar popovers, and time-zone selection are out of scope. If your application asks "what date works for you?", reach for a more general-purpose component.

>[!NOTE]
> Nova’s Temporal implementation explicitly restricts its domain to UTC/Zulu implemented through Temporal’s [PlainDateTime](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/PlainDateTime) rather than [ZonedDateTime](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/ZonedDateTime) this was intentionally defensive by design. PlainDateTime is less complex. All datetimes in Nova are treated as UTC/Z.

## Components

| Component | Tag | Description |
|-----------|-----|-------------|
| [nova-time](#nova-time) | `<nova-time>` | UTC time input (HH:MM:SS.fffffffffZ) |
| [nova-date](#nova-date) | `<nova-date>` | Calendar date (YYYY-MM-DD) |
| [nova-ordinal-date](#nova-ordinal-date) | `<nova-ordinal-date>` | Ordinal date (YYYY-DDD) |
| [nova-duration](#nova-duration) | `<nova-duration>` | ISO 8601 duration (PnYnMnWnDTnHnMnS) |
| [nova-datetime](#nova-datetime) | `<nova-datetime>` | Combined date+time input |
| [nova-temporal-group](#nova-temporal-group) | `<nova-temporal-group>` | Generic coordination wrapper for any temporal components |
| [nova-clock](#nova-clock) | `<nova-clock>` | Live UTC clock display |

## Quick Start

```html
<script type="module" src="js/nova-temporal/nova-datetime.js"></script>

<nova-datetime
  name="observation_time"
  smallest-unit="second"
  value="2026-02-09T14:30:00Z"
></nova-datetime>
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

`NovaTemporalInputBase` adds the typed-value contract: `temporal` getter/setter, `temporalType`, `formatTemporal()`, and the `_toTemporal` / `_formatTemporal` hooks the five widgets implement.

Design tokens (`--input-*`, `--space-*`, `--font-*`, etc.) inherit from `:root` via CSS custom properties — no duplicate token declarations in shadow DOM.

### Interface Contract

All input components expose a standard interface for crossing the boundary (ISO strings) and for in-memory work (Temporal objects):

| Property | Type | Role |
|----------|------|------|
| `value` | string | ISO 8601 boundary value — what HTML attributes carry, what `FormData` returns, what wire protocols consume |
| `temporal` | Temporal.* \| null | Programmatic currency at full nanosecond precision. `<nova-datetime>` intentionally exposes `Temporal.PlainDateTime`: a UTC field view whose `.value` serializes with `Z`. Consumers should treat `.value` as the stable boundary format. |
| `temporalType` | string \| null | Type identifier: `'PlainDateTime'`, `'PlainDate'`, `'PlainTime'`, `'Duration'`, or `null` when the component is in a configuration that cannot produce a Temporal value (see `<nova-ordinal-date>` day-only mode) |
| `formatTemporal(t)` | string | Public formatter for converting a Temporal object to this component's ISO value string |

**Use `.value`** for HTML attributes, form submission, JSON serialization, anything that crosses out of the JavaScript runtime. This is what the components store on the DOM and what consumers read for serialization.

**Use `.temporal`** for in-memory composition. Pass it to the helpers in this library, chain `.add()` / `.until()` / `.compare()` against it, do arithmetic without parse/serialize churn between operations.

**Components in degenerate configurations may report `temporalType: null`.** `<nova-ordinal-date>` does this in day-only mode (`value="040"`) — it cannot produce a `Temporal.PlainDate` without year context. Consumers should check `el.temporalType !== null` before reading `el.temporal`.

**Avoid this footgun:** do not call `.toZonedDateTime(nonUTC)` on `.temporal`. Because `Temporal.PlainDateTime` carries no timezone, that method interprets the wall-clock fields *as if* they were already in the target zone — producing the wrong instant. If you need an instant in a specific zone, parse from `.value` instead:

```javascript
const instant = Temporal.Instant.from(el.value);
const localized = instant.toZonedDateTimeISO('America/Denver');
```

```javascript
const input = document.querySelector('nova-datetime');

// Boundary — ISO string (always Z on read; accepts any well-formed ISO 8601 on write)
input.value;                                        // '2026-02-09T14:30:00Z'
input.value = '2026-02-09T15:00:00Z';               // stored as '2026-02-09T15:00:00Z'
input.value = '2026-02-09T15:00:00-05:00';          // stored as '2026-02-09T20:00:00Z' (offset normalized)
input.value = '';                                   // clears

// Programmatic — Temporal.PlainDateTime (UTC wall-clock by convention)
input.temporal;                                     // Temporal.PlainDateTime instance
input.temporal = Temporal.PlainDateTime.from('2026-02-09T16:00:00');
input.temporal = null;                              // clears
input.temporal = Temporal.PlainDate.from('2026-02-09');  // throws TypeError

// Format a Temporal object back to this component's ISO value
input.formatTemporal(Temporal.PlainDateTime.from('2026-02-09T16:00:00'));
// '2026-02-09T16:00:00Z'
```

---

## nova-time

UTC/Zulu time input with configurable smallest unit.

### Attributes

| Attribute | Values | Default | Description |
|-----------|--------|---------|-------------|
| `value` | ISO time string | — | e.g. `"14:30:00Z"` |
| `smallest-unit` | `minute` `second` `millisecond` `microsecond` `nanosecond` | `second` | Segment granularity |
| `name` | string | — | Form field name |
| `min` | ISO time string | — | Minimum valid value |
| `max` | ISO time string | — | Maximum valid value |
| `required` | boolean | — | Value must be provided |
| `disabled` | boolean | — | Disables input |
| `readonly` | boolean | — | Prevents editing, allows navigation |
| `hotkeys` | boolean | — | Enables `n` key (set to now) |

### Value Format

Always UTC with Z suffix: `"14:30:00Z"`, `"14:30:00.123Z"`, `"14:30:00.123456789Z"`

### Example

```html
<nova-time smallest-unit="millisecond" value="14:30:00.000Z" name="obs_time"></nova-time>
```

### Paste Behavior

- Native time strings accepted directly
- Datetime strings: extracts time part (`2026-02-09T14:30:00Z` → `14:30:00Z`)

---

## nova-date

Calendar date input with leap year awareness.

### Attributes

| Attribute | Values | Default | Description |
|-----------|--------|---------|-------------|
| `value` | ISO date string | — | e.g. `"2026-02-09"` |
| `name` | string | — | Form field name |
| `min` | ISO date string | — | Minimum valid value |
| `max` | ISO date string | — | Maximum valid value |
| `required` | boolean | — | Value must be provided |
| `disabled` | boolean | — | Disables input |
| `readonly` | boolean | — | Prevents editing |
| `hotkeys` | boolean | — | Enables `n` key (set to now) |
| `overflow` | `constrain` `reject` | `constrain` | `reject` keeps invalid segment combinations visible and marks the component invalid; default `constrain` clamps to the nearest valid date (matching Temporal's own default) |

### Value Format

`"YYYY-MM-DD"` — e.g. `"2026-02-09"`

By default, invalid segment combinations are clamped to the nearest valid date — matching Temporal's own default. For example, changing `2026-01-31` to February clamps day `31` to `28`. Set `overflow="reject"` to keep the typed value visible and mark the component invalid instead.

### Paste Behavior

- Calendar dates accepted directly
- Ordinal dates converted (`2026-040` → `2026-02-09`)
- Datetime strings: extracts date part

---

## nova-ordinal-date

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

## nova-duration

ISO 8601 duration input with labeled segments.

### Attributes

| Attribute | Values | Default | Description |
|-----------|--------|---------|-------------|
| `value` | ISO duration string | — | e.g. `"P1Y2M3W4DT5H30M45S"` |
| `largest-unit` | `year` `month` `week` `day` `hour` `minute` `second` `millisecond` `microsecond` `nanosecond` | `year` | Largest visible duration segment |
| `smallest-unit` | `year` `month` `week` `day` `hour` `minute` `second` `millisecond` `microsecond` `nanosecond` | `second` | Smallest visible duration segment |
| `largest-unit-digits` | integer 1–9 | natural width | Widens the largest visible unit (e.g. 4-digit days). Must be ≥ that unit's natural width. |
| `name` | string | — | Form field name |
| `min` | ISO duration string | — | Minimum valid value |
| `max` | ISO duration string | — | Maximum valid value |
| `required` | boolean | — | Value must be provided |
| `disabled` | boolean | — | Disables input |
| `readonly` | boolean | — | Prevents editing |

### Value Format

ISO 8601 duration: `"P1Y2M3W4DT5H30M45S"`, `"PT2H0M30.500S"`, `"P3DT12H0M0S"`

Segments display as the inclusive unit window from `largest-unit` to `smallest-unit`. The default is `year` through `second` (all standard units visible). Sub-second fractional fields (ms/us/ns) keep 3 digits; all other units stay at their natural 2-digit width.

```html
<nova-duration largest-unit="hour" smallest-unit="second" value="PT4H33M12S"></nova-duration>
<nova-duration largest-unit="day" smallest-unit="hour" value="P2DT4H"></nova-duration>
<nova-duration largest-unit="year" smallest-unit="nanosecond" value="P1Y2M3W4DT5H30M45.123456789S"></nova-duration>
```

Values with nonzero units outside the visible window are rejected. For example, `largest-unit="hour" smallest-unit="second"` accepts `PT4H33M12S` and rejects `P1DT4H`.

#### Widening the largest visible unit

Only the largest visible unit overflows by convention. If a mission needs more capacity in that unit, use `largest-unit-digits`:

```html
<!-- Up to 9999 elapsed days -->
<nova-duration largest-unit="day" largest-unit-digits="4" value="P1234DT5H6M7S"></nova-duration>

<!-- Up to 9999 elapsed minutes when day/hour aren't shown -->
<nova-duration largest-unit="minute" smallest-unit="second" largest-unit-digits="4"></nova-duration>
```

The override applies only to the head (largest) descriptor in the active window. Values narrower than that descriptor's natural width are rejected so existing data is never silently truncated. Range is 1–9 digits.

### Paste Behavior

- ISO 8601 duration strings accepted directly: `PT1H30M`, `P1Y2M3W4DT5H`

---

## nova-datetime

Combined date+time input as a single component — all segments are in one flat array with unified keyboard navigation.

### Attributes

| Attribute | Values | Default | Description |
|-----------|--------|---------|-------------|
| `value` | ISO datetime string | — | e.g. `"2026-02-09T14:30:00Z"` |
| `format` | `date` `ordinal` | `date` | Date format (`YYYY-MM-DD` or `YYYY-DDD`) |
| `smallest-unit` | `minute` `second` `millisecond` `microsecond` `nanosecond` | `second` | Time segment granularity |
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

### Paste Behavior

- Full datetime strings accepted (both calendar and ordinal formats, with cross-format conversion)
- Date-only: sets date segments, preserves existing time
- Time-only: sets time segments, preserves existing date

### Example

```html
<nova-datetime
  format="ordinal"
  smallest-unit="minute"
  value="2026-040T14:30Z"
  name="aos"
  hotkeys
></nova-datetime>
```

---

## nova-temporal-group

Generic coordination wrapper for any combination of temporal components. Accepts `nova-datetime`, `nova-date`, `nova-ordinal-date`, `nova-time`, and `nova-duration` in flexible slot configurations. Provides group-level chrome, validation, and auto-computation.

### Slot Naming

| Slot pattern | Description |
|--------------|-------------|
| `t0`, `t1`, `t2`, ... | Temporal inputs (nova-datetime, nova-date, nova-ordinal-date, nova-time) |
| `d0`, `d1`, `d2`, ... | Duration inputs (nova-duration) |
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
| `aria-label` | string | inferred | Accessible label |
| `aria-labelledby` | IDREF | — | Reference to external label |

### Min/Max Constraints

The `min` and `max` attributes constrain the group's computed output. The format depends on the mode:

**Range mode** (only temporal slots): min/max are ISO 8601 durations constraining the duration between t0 and t1.

```html
<!-- Duration must be between 30 minutes and 8 hours -->
<nova-temporal-group min="PT30M" max="PT8H">
  <nova-datetime slot="t0" value="2026-04-10T09:00:00Z"></nova-datetime>
  <nova-datetime slot="t1" value="2026-04-10T12:00:00Z"></nova-datetime>
</nova-temporal-group>
```

**Compute mode** (has duration slots): min/max are datetime strings constraining the computed result.

```html
<!-- Computed end time must not exceed 18:00 -->
<nova-temporal-group max="2026-04-10T18:00:00Z">
  <nova-datetime slot="t0" value="2026-04-10T14:00:00Z"></nova-datetime>
  <nova-duration slot="d0" value="PT2H"></nova-duration>
</nova-temporal-group>
```

Sets `rangeUnderflow` or `rangeOverflow` validity flags when constraints are violated.

### Type Compatibility

Components are grouped into type families:

| Family | Components | Mixable |
|--------|-----------|---------|
| DateTime | `nova-datetime` | Only with itself |
| Date | `nova-date`, `nova-ordinal-date` | Yes (same underlying type) |
| Time | `nova-time` | Only with itself |
| Duration | `nova-duration` | N/A (separate role) |

Mixing within the Date family (e.g., `nova-date` + `nova-ordinal-date`) is allowed. Cross-family mixing (e.g., `nova-datetime` + `nova-date`) produces a console warning and validation error.

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
<nova-temporal-group name="contact-window">
  <label slot="t0-label">AOS</label>
  <nova-datetime slot="t0" value="2026-02-09T14:30:00Z"></nova-datetime>
  <label slot="t1-label">LOS</label>
  <nova-datetime slot="t1" value="2026-02-09T15:45:00Z"></nova-datetime>
  <output slot="output">
    <span class="output-label">Duration</span>
    <span class="output-value"></span>
  </output>
</nova-temporal-group>
```

**Compute mode** — start + duration = computed end in output:

```html
<nova-temporal-group name="mission-window">
  <label slot="t0-label">Launch</label>
  <nova-datetime slot="t0" value="2026-02-09T14:30:00Z"></nova-datetime>
  <label slot="d0-label">Window</label>
  <nova-duration slot="d0" value="PT2H"></nova-duration>
  <output slot="output">
    <span class="output-label">Cutoff</span>
    <span class="output-value"></span>
  </output>
</nova-temporal-group>
```

**Date range** — mixing date formats:

```html
<nova-temporal-group name="ops-period">
  <label slot="t0-label">Start</label>
  <nova-date slot="t0" value="2026-02-09"></nova-date>
  <label slot="t1-label">End</label>
  <nova-ordinal-date slot="t1" value="2026-050"></nova-ordinal-date>
</nova-temporal-group>
```

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
| `stopped` | boolean | — | Pause the clock |

### Example

```html
<nova-clock show-date smallest-unit="second"></nova-clock>
```

### Timer Behavior

- **Seconds/minutes**: Boundary-synced ticks — calculates ms until next second/minute boundary. Multiple instances stay aligned.
- **Milliseconds**: 100ms `setTimeout` intervals.

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

All input components and `nova-temporal-group` are form-associated custom elements (`nova-clock` is not):

```html
<form id="obs-form">
  <nova-date name="obs_date" value="2026-02-09" required></nova-date>
  <nova-time name="obs_time" smallest-unit="second" value="14:30:00Z"></nova-time>
  <button type="submit">Submit</button>
</form>

<script>
  document.getElementById('obs-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    // { obs_date: "2026-02-09", obs_time: "14:30:00Z" }
  });
</script>
```

### Validation

- `required` — sets `valueMissing` when empty
- `min` / `max` — sets `rangeUnderflow` / `rangeOverflow`. Unparseable bounds throw `RangeError` (validity-strict — author-supplied bounds must be valid).
- `checkValidity()` / `reportValidity()` work as expected
- `disabled` elements are excluded from validation and form submission

### Custom States

Since native pseudo-classes like `:required` and `:user-invalid` don't reliably work on custom elements, all input components and `nova-temporal-group` expose validation states via `ElementInternals.states` (CustomStateSet). These can be used in CSS with the `:state()` selector.

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
| `:state(child-invalid)` | (`nova-temporal-group` only) Any child input is invalid |

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
.nova-label:has(~ nova-temporal-group:state(child-invalid)) {
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
| `--temporal-output-text-color` | Output display text color (`nova-temporal-group`) |
| `--temporal-output-font-weight` | Output display font weight (`nova-temporal-group`) |
| `--temporal-output-font-size` | Output display font size (`nova-temporal-group`) |
| `--temporal-output-background-color--invalid` | Output display background when invalid (`nova-temporal-group`) |

---

## Helpers

The package index intentionally exports a small helper surface: ordinal-date helpers for Temporal's missing ordinal constructor/parser and a human-readable duration formatter. For parsing, arithmetic, comparison, conversion, and `Temporal.Now.*`, use the native Temporal methods directly.

```javascript
import {
  formatDurationHuman,
  ordinalDateToPlainDate,
  parseOrdinalDate,
  formatOrdinalDate,
} from './js/nova-temporal/index.js';
```

### Arithmetic

Use the native Temporal methods directly — the library does not wrap them.

```javascript
const start = document.querySelector('#start-time').temporal;

const end = start.add(Temporal.Duration.from('PT2H30M'));
// Temporal.PlainDateTime — start plus 2h30m

const beforeStart = start.subtract(Temporal.Duration.from('PT15M'));
// Temporal.PlainDateTime — start minus 15m

const dur = start.until(end);
// Temporal.Duration from start to end
```

If you want a specific largest unit in the result, pass it explicitly: `start.until(end, { largestUnit: 'day' })`.

### Human-readable duration

```javascript
formatDurationHuman(Temporal.Duration.from('PT1H30M'));
// '1h 30m'

formatDurationHuman(Temporal.Duration.from('P3DT4H'));
// '3d 4h'
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
const dur = Temporal.PlainDateTime.from(startISO).until(
  Temporal.PlainDateTime.from(endISO),
);
```

The library does not wrap `Temporal.*.from()` — it's the standard API and one line at the boundary keeps the call sites honest about where parsing happens.

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
| `datetime-parse-error` | `nova-temporal.js` | Offset-bearing datetime fails `Instant.from` |
| `constraint-parse-error` | `<nova-temporal-group>` | `min`/`max` attribute on the group is unparseable; the group is `customError`-invalid until corrected |
| `compute-error` | `<nova-temporal-group>` | A `Temporal.*` operation throws while computing the group's output (e.g. `PlainDate.add({ months: 1 }, { overflow: "reject" })` on Jan 31). The group is `customError`-invalid and the output reads `Invalid` |
| `type-incompatibility` | `<nova-temporal-group>` | Sibling temporal slots mix incompatible families (e.g. PlainTime with PlainDate). Group surfaces this as `customError` |
| `output-slot-shape` | `<nova-temporal-group>` | The `slot="output"` element is not an `<output>` or is missing a `.output-value` descendant. Authoring hint, not a runtime failure |

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
| `nova-time.js` | `<nova-time>` component |
| `nova-date.js` | `<nova-date>` component |
| `nova-ordinal-date.js` | `<nova-ordinal-date>` component |
| `nova-duration.js` | `<nova-duration>` component |
| `nova-datetime.js` | `<nova-datetime>` component |
| `nova-temporal-group.js` | `<nova-temporal-group>` component |
| `nova-clock.js` | `<nova-clock>` component |

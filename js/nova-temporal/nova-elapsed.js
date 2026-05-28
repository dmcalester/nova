/**
 * <nova-elapsed> — Live count-up / count-down display (MET, T-minus, …).
 *
 * Shows the signed duration between a fixed `epoch` and now, ticking live.
 * Neither the epoch nor the threshold is rendered — only the running count,
 * laid out as [prefix±][time], e.g. "T+ 005/12:30:00".
 *
 * Attributes:
 *   epoch              — ISO-8601 datetime with Z suffix or numeric offset
 *                        (e.g. "2026-02-09T14:30:00Z" or "...-05:00").
 *                        Unzoned input is rejected (invalid-epoch).
 *   prefix             — string; the sign-bearing token (e.g. "T", "L") shown before ±
 *   threshold          — ISO-8601 duration; the freeze / crossing point, default "PT0S"
 *   threshold-behavior — what the count does at the threshold:
 *                        "freeze" (default) stops it there; "continue" runs
 *                        through unremarked; "warn" runs through and sets
 *                        :state(out-of-range) while past the threshold
 *   largest-unit       — day | hour | minute | second | millisecond | microsecond | nanosecond (default "day")
 *   smallest-unit      — day | hour | minute | second | millisecond | microsecond | nanosecond (default "second")
 *   stopped            — when present, pauses the live tick
 *
 * Custom state:
 *   :state(out-of-range) — set while threshold-behavior="warn" and the count
 *                          has passed the threshold.
 *
 * Events (both bubbles + composed, flat detail { epoch, threshold, elapsed }):
 *   threshold-crossed — fired once when the count is witnessed crossing the
 *                       threshold with threshold-behavior "continue" or "warn".
 *   elapsed-stopped   — fired once when the count is witnessed freezing at the
 *                       threshold with threshold-behavior "freeze".
 *
 * CSS custom properties:
 *   Defaults inherit from the surrounding text — set any of these to opt in.
 *   Per-component `--elapsed-*` tokens win over the shared `--time-*` family;
 *   set `--time-*` once to style both <nova-clock> and <nova-elapsed>, or
 *   override per component. Use `nova-elapsed:state(out-of-range) { color: … }`
 *   to style the warn state.
 *
 *   --time-font-family,    --elapsed-font-family
 *   --time-font-size,      --elapsed-font-size
 *   --time-font-weight,    --elapsed-font-weight
 *   --time-line-height,    --elapsed-line-height
 *   --time-color,          --elapsed-color
 *   --time-background,     --elapsed-background
 *   --time-border,         --elapsed-border           (shorthand)
 *   --time-border-radius,  --elapsed-border-radius
 *   --time-padding,        --elapsed-padding
 *   --time-outline,        --elapsed-outline          (shorthand)
 *   --time-outline-offset, --elapsed-outline-offset
 *
 *   Component-only:
 *     --elapsed-prefix-spacing — margin-inline-end on the prefix+sign span (default 0)
 */

import { createNovaStyleSheets } from "../nova-stylesheets.js";
import { parseAnyDatetime, parseDuration } from "./nova-temporal.js";
import { reportNovaError } from "./nova-temporal-errors.js";

const elapsedSheet = new CSSStyleSheet();
elapsedSheet.replaceSync(`
  :host {
    display: inline-block;
    font-variant-numeric: tabular-nums slashed-zero;
    font-feature-settings: "case", "cv01", "cv02", "cv03", "cv04", "cv05", "cv06", "cv07", "cv08", "cv09", "cv11", "cv10";

    font-family: var(--elapsed-font-family, var(--time-font-family));
    font-size: var(--elapsed-font-size, var(--time-font-size));
    font-weight: var(--elapsed-font-weight, var(--time-font-weight));
    line-height: var(--elapsed-line-height, var(--time-line-height));
    color: var(--elapsed-color, var(--time-color));
    background: var(--elapsed-background, var(--time-background));
    border: var(--elapsed-border, var(--time-border));
    border-radius: var(--elapsed-border-radius, var(--time-border-radius));
    padding: var(--elapsed-padding, var(--time-padding));
    outline: var(--elapsed-outline, var(--time-outline));
    outline-offset: var(--elapsed-outline-offset, var(--time-outline-offset));
  }

  .prefix {
    margin-inline-end: var(--elapsed-prefix-spacing, 0);
  }
`);

// ── Unit window ──────────────────────────────────────────────────────────────
// Display window runs largest → smallest within this order. Calendar units
// (week/month/year) are intentionally excluded: an elapsed counter measures
// wall-clock duration, and balancing into months/years is anchor-dependent.
const UNIT_ORDER = [
   "day",
   "hour",
   "minute",
   "second",
   "millisecond",
   "microsecond",
   "nanosecond",
];
const SECOND_INDEX = UNIT_ORDER.indexOf("second");
const DURATION_FIELD = {
   day: "days",
   hour: "hours",
   minute: "minutes",
   second: "seconds",
};
const FRACTION_DIGITS = { millisecond: 3, microsecond: 6, nanosecond: 9 };
const PLACEHOLDER_GLYPH = {
   day: "DDD",
   hour: "HH",
   minute: "MM",
   second: "SS",
};
const FRACTION_GLYPH = { millisecond: "m", microsecond: "u", nanosecond: "n" };

export class NovaElapsed extends HTMLElement {
   static get observedAttributes() {
      return [
         "epoch",
         "prefix",
         "threshold",
         "threshold-behavior",
         "largest-unit",
         "smallest-unit",
         "stopped",
      ];
   }

   #internals;
   #timer = null;
   #display;
   #prefixSpan;
   #timeSpan;
   // null until the first tick establishes a baseline — keeps transition
   // events from firing for a crossing that predates the element. The freeze
   // does not depend on this: it is unconditional (see #tick).
   #thresholdCrossed = null;
   #lastReportedError = null;

   constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot.adoptedStyleSheets = createNovaStyleSheets(elapsedSheet);
      this.#internals = this.attachInternals();

      this.#display = document.createElement("time");
      this.#prefixSpan = document.createElement("span");
      this.#prefixSpan.className = "prefix";
      this.#timeSpan = document.createElement("span");
      this.#timeSpan.className = "time";

      this.#display.append(this.#prefixSpan, this.#timeSpan);
      this.shadowRoot.appendChild(this.#display);
   }

   connectedCallback() {
      this.#tick();
      this.#startTimer();
   }

   disconnectedCallback() {
      this.#stopTimer();
   }

   attributeChangedCallback(name) {
      if (name === "stopped") {
         if (this.hasAttribute("stopped")) {
            this.#stopTimer();
         } else {
            this.#tick();
            this.#startTimer();
         }
         return;
      }

      if (
         name === "epoch" ||
         name === "threshold" ||
         name === "threshold-behavior"
      ) {
         // The threshold relationship changed — drop the baseline and clear
         // the state so the next tick re-establishes from scratch.
         this.#thresholdCrossed = null;
         this.#internals.states.delete("out-of-range");
      }

      this.#tick();

      // The unit window drives the tick cadence, so resync the timer.
      if (name === "largest-unit" || name === "smallest-unit") {
         this.#startTimer();
      }
   }

   // ── Public API ─────────────────────────────────────────────────────────────

   /** @returns {string|null} ISO-8601 datetime the count runs from */
   get epoch() {
      return this.getAttribute("epoch");
   }

   /** @param {string} v */
   set epoch(v) {
      this.setAttribute("epoch", v);
   }

   /** @returns {string} sign-bearing token rendered before ± */
   get prefix() {
      return this.getAttribute("prefix") ?? "";
   }

   /** @param {string} v */
   set prefix(v) {
      this.setAttribute("prefix", v);
   }

   /** @returns {string} ISO-8601 duration; the freeze / crossing point (default "PT0S") */
   get threshold() {
      const raw = this.getAttribute("threshold");
      return raw == null || raw === "" ? "PT0S" : raw;
   }

   /** @param {string} v */
   set threshold(v) {
      this.setAttribute("threshold", v);
   }

   /**
    * @returns {"freeze"|"continue"|"warn"} what the count does at the
    *   threshold (default "freeze")
    */
   get thresholdBehavior() {
      const raw = this.getAttribute("threshold-behavior");
      return raw === "continue" || raw === "warn" ? raw : "freeze";
   }

   /** @param {"freeze"|"continue"|"warn"} v */
   set thresholdBehavior(v) {
      this.setAttribute("threshold-behavior", v);
   }

   /** @returns {string} top of the display window (default "day") */
   get largestUnit() {
      const raw = this.getAttribute("largest-unit");
      return UNIT_ORDER.includes(raw) ? raw : "day";
   }

   /** @param {string} v */
   set largestUnit(v) {
      this.setAttribute("largest-unit", v);
   }

   /** @returns {string} bottom of the display window (default "second") */
   get smallestUnit() {
      const raw = this.getAttribute("smallest-unit");
      return UNIT_ORDER.includes(raw) ? raw : "second";
   }

   /** @param {string} v */
   set smallestUnit(v) {
      this.setAttribute("smallest-unit", v);
   }

   /** @returns {boolean} */
   get stopped() {
      return this.hasAttribute("stopped");
   }

   /** @param {boolean} v */
   set stopped(v) {
      if (v) this.setAttribute("stopped", "");
      else this.removeAttribute("stopped");
   }

   // ── Compute ────────────────────────────────────────────────────────────────

   #tick() {
      const largestIndex = UNIT_ORDER.indexOf(this.largestUnit);
      const smallestIndex = UNIT_ORDER.indexOf(this.smallestUnit);
      if (largestIndex > smallestIndex) {
         this.#reportOnce(
            "invalid-unit-window",
            `largest-unit="${this.largestUnit}" must not be smaller than smallest-unit="${this.smallestUnit}"`,
         );
         this.#renderPlaceholder();
         return;
      }

      const epochRaw = this.epoch;
      const epochInstant = epochRaw == null ? null : parseAnyDatetime(epochRaw);
      if (!epochInstant) {
         this.#reportOnce(
            "invalid-epoch",
            `Cannot parse epoch "${epochRaw}" as ISO-8601 datetime`,
         );
         this.#renderPlaceholder();
         return;
      }

      const thresholdRaw = this.threshold;
      const thresholdRecord = parseDuration(thresholdRaw);
      if (!thresholdRecord) {
         this.#reportOnce(
            "invalid-threshold",
            `Cannot parse threshold "${thresholdRaw}" as ISO-8601 duration`,
         );
         this.#renderPlaceholder();
         return;
      }

      try {
         // Exact (nanosecond) elapsed drives the threshold comparison; the
         // displayed value is a separate, window-rounded copy. Comparing a
         // rounded value would make a sub-threshold count register as
         // "crossed" the moment it truncates down onto the threshold.
         // Use ZonedDateTime for the until() call because Instant.until()
         // does not support calendar units (e.g. "day"); UTC ZDT preserves
         // the same UTC-day semantics as the previous PlainDateTime approach.
         const epochZDT = epochInstant.toZonedDateTimeISO("UTC");
         const nowZDT = Temporal.Now.instant().toZonedDateTimeISO("UTC");
         const exact = epochZDT.until(nowZDT, {
            largestUnit: this.largestUnit,
         });
         const threshold = Temporal.Duration.from(thresholdRecord);
         const crossed = Temporal.Duration.compare(exact, threshold) >= 0;

         this.#syncThreshold(crossed, epochRaw, thresholdRaw, exact);

         const round = (d) =>
            d.round({
               largestUnit: this.largestUnit,
               smallestUnit: this.smallestUnit,
               roundingMode: "trunc",
            });
         // threshold-behavior="freeze" → the count freezes at the threshold
         // whenever it is reached, witnessed live or already past at
         // connect-time. The events stay witnessed-only (see #syncThreshold);
         // the freeze does not. MET runs "continue" — it passes through T-0.
         const displayValue =
            crossed && this.thresholdBehavior === "freeze"
               ? round(threshold)
               : round(exact);

         this.#render(displayValue);
         // datetime attribute matches the rendered precision: force the
         // sub-second digit count when the window goes below seconds, so
         // a zero fractional component is preserved (".000" not omitted).
         const subSecondDigits = FRACTION_DIGITS[this.smallestUnit];
         this.#display.setAttribute(
            "datetime",
            displayValue.toString(
               subSecondDigits != null
                  ? { fractionalSecondDigits: subSecondDigits }
                  : {},
            ),
         );
      } catch (e) {
         this.#reportOnce(
            "elapsed-compute-error",
            `Failed to compute elapsed time from epoch "${epochRaw}"`,
            { error: e },
         );
         this.#renderPlaceholder();
      }
   }

   /**
    * Track the threshold relationship: maintain the `out-of-range` state every
    * tick, and — on the not-crossed → crossed edge — fire the one-shot
    * transition event.
    *
    * The freeze (threshold-behavior="freeze") is handled in #tick, not here:
    * it is an unconditional condition, while the events are transitions that
    * fire only for a crossing this element was alive to witness.
    *
    * @param {boolean} crossed
    * @param {string} epoch
    * @param {string} threshold
    * @param {Temporal.Duration} elapsed - exact elapsed duration
    */
   #syncThreshold(crossed, epoch, threshold, elapsed) {
      const behavior = this.thresholdBehavior;

      // out-of-range reflects the live condition, not the transition.
      if (crossed && behavior === "warn") {
         this.#internals.states.add("out-of-range");
      } else {
         this.#internals.states.delete("out-of-range");
      }

      // First tick only establishes the baseline — a count already past the
      // threshold at connect-time fires no event.
      if (this.#thresholdCrossed === null) {
         this.#thresholdCrossed = crossed;
         return;
      }
      if (this.#thresholdCrossed || !crossed) return;

      // Witnessed the not-crossed → crossed edge.
      this.#thresholdCrossed = true;

      this.dispatchEvent(
         new CustomEvent(
            behavior === "freeze" ? "elapsed-stopped" : "threshold-crossed",
            {
               bubbles: true,
               composed: true,
               detail: { epoch, threshold, elapsed: elapsed.toString() },
            },
         ),
      );
   }

   // ── Rendering ──────────────────────────────────────────────────────────────

   /** @param {Temporal.Duration} displayValue */
   #render(displayValue) {
      const sign = displayValue.sign < 0 ? "-" : "+";
      this.#prefixSpan.textContent = `${this.prefix}${sign}`;
      this.#timeSpan.textContent = this.#formatWindow(displayValue.abs());
   }

   /**
    * Build the "DDD/HH:MM:SS.fff" string from a non-negative, window-balanced
    * duration. Only units inside [largest-unit, smallest-unit] are shown.
    *
    * @param {Temporal.Duration} dur - non-negative, balanced to the window
    * @returns {string}
    */
   #formatWindow(dur) {
      const largestIndex = UNIT_ORDER.indexOf(this.largestUnit);
      const smallestIndex = UNIT_ORDER.indexOf(this.smallestUnit);

      let out = "";
      const clock = [];
      for (let i = largestIndex; i <= smallestIndex && i <= SECOND_INDEX; i++) {
         const unit = UNIT_ORDER[i];
         const value = dur[DURATION_FIELD[unit]];
         if (unit === "day") {
            out += `${String(value).padStart(3, "0")}/`;
         } else {
            clock.push(String(value).padStart(2, "0"));
         }
      }
      out += clock.join(":");

      if (smallestIndex > SECOND_INDEX) {
         const digits = FRACTION_DIGITS[this.smallestUnit];
         const ns =
            dur.milliseconds * 1e6 + dur.microseconds * 1e3 + dur.nanoseconds;
         out += `.${String(ns).padStart(9, "0").slice(0, digits)}`;
      }

      return out;
   }

   #renderPlaceholder() {
      this.#prefixSpan.textContent = `${this.prefix}?`;
      this.#timeSpan.textContent = this.#placeholderWindow();
      this.#display.removeAttribute("datetime");
   }

   /** @returns {string} the window rendered with glyphs instead of digits */
   #placeholderWindow() {
      const largestIndex = UNIT_ORDER.indexOf(this.largestUnit);
      const smallestIndex = UNIT_ORDER.indexOf(this.smallestUnit);
      // A misconfigured window has no meaningful shape — fall back to a dash.
      if (largestIndex > smallestIndex) return "—";

      let out = "";
      const clock = [];
      for (let i = largestIndex; i <= smallestIndex && i <= SECOND_INDEX; i++) {
         const unit = UNIT_ORDER[i];
         if (unit === "day") out += `${PLACEHOLDER_GLYPH.day}/`;
         else clock.push(PLACEHOLDER_GLYPH[unit]);
      }
      out += clock.join(":");

      if (smallestIndex > SECOND_INDEX) {
         const digits = FRACTION_DIGITS[this.smallestUnit];
         out += `.${FRACTION_GLYPH[this.smallestUnit].repeat(digits)}`;
      }

      return out;
   }

   // ── Error reporting ────────────────────────────────────────────────────────

   /**
    * Report through the shared channel, but only once per distinct condition —
    * #tick() runs on every frame, and a steady bad attribute should not flood
    * the console or the host app's telemetry.
    *
    * @param {string} code
    * @param {string} message
    * @param {object} [info]
    */
   #reportOnce(code, message, info) {
      const key = `${code}:${message}`;
      if (this.#lastReportedError === key) return;
      this.#lastReportedError = key;
      reportNovaError(this, code, message, info);
   }

   // ── Timer ──────────────────────────────────────────────────────────────────
   // Boundary-synced like <nova-clock>: each tick resyncs to the next displayed
   // unit boundary, so multiple instances stay aligned. Sub-second windows fall
   // back to ~10fps.

   #startTimer() {
      if (this.hasAttribute("stopped")) return;
      this.#stopTimer();
      this.#lastReportedError = null;

      if (
         ["millisecond", "microsecond", "nanosecond"].includes(
            this.smallestUnit,
         )
      ) {
         const step = () => {
            this.#tick();
            this.#timer = setTimeout(step, 100);
         };
         step();
      } else {
         this.#scheduleNextTick();
      }
   }

   #scheduleNextTick() {
      const currentMs = Temporal.Now.instant().epochMilliseconds;
      const boundary = ["minute", "hour", "day"].includes(this.smallestUnit)
         ? 60000
         : 1000;
      const msUntilNext = boundary - (currentMs % boundary);

      this.#timer = setTimeout(() => {
         this.#tick();
         this.#scheduleNextTick();
      }, msUntilNext);
   }

   #stopTimer() {
      if (this.#timer == null) return;
      clearTimeout(this.#timer);
      this.#timer = null;
   }
}

customElements.define("nova-elapsed", NovaElapsed);

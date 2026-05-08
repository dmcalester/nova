/**
 * <nova-duration> — ISO 8601 duration input
 *
 * Displays a sliding unit window from largest-unit down to smallest-unit.
 * Defaults to year through second (all standard units visible). Use
 * largest-unit and smallest-unit to constrain the visible range, and
 * largest-unit-digits to widen the head unit's digit count.
 *
 * Attributes:
 *   value                — ISO-8601-1 duration: "P1Y2M3DT4H30M45S" or "PT1H30M".
 *                          The week designator (P{n}W) is rejected — see README.
 *   largest-unit         — year | month | day | hour | minute | second | millisecond | microsecond | nanosecond
 *   smallest-unit        — year | month | day | hour | minute | second | millisecond | microsecond | nanosecond
 *   largest-unit-digits  — integer 1–9; widens the largest visible unit. Must be ≥ that unit's natural width.
 *   name                 — form field name
 *   disabled             — disables input
 *   readonly             — prevents editing
 *
 * Wrap behavior: segments wrap within their own range (e.g. 59 → 0) without carrying to adjacent segments.
 */

import { NovaTemporalInputBase } from "./nova-temporal-input-base.js";
import {
   DURATION_COMPARE_ANCHOR,
   parseDuration,
   temporalToDurationRecord,
} from "./nova-temporal.js";
import {
   ALL_DURATION_DESCRIPTORS,
   buildDurationDescriptors,
   DURATION_FIELD_BY_UNIT,
   DURATION_UNIT_ORDER,
   normalizeDurationUnit,
} from "./nova-temporal-segments.js";

const FRACTIONAL_SECOND_DIGITS = {
   second: undefined,
   millisecond: 3,
   microsecond: 6,
   nanosecond: 9,
};

// Match designator labels (Y/M/D/H/M/S and the leading P) to the segment
// font-size. Other segment-input components keep the small 0.8em from the
// base sheet — duration's labels are part of the value, not annotations.
const durationLabelSheet = new CSSStyleSheet();
durationLabelSheet.replaceSync(`
   .label-text, .prefix-text {
      font-size: 1em;
   }
`);

export class NovaDuration extends NovaTemporalInputBase {
   #largestUnit = "year";
   #smallestUnit = "second";
   #largestUnitDigits = null;

   static get temporalType() {
      return "Duration";
   }

   constructor() {
      super();
      this.shadowRoot.adoptedStyleSheets = [
         ...this.shadowRoot.adoptedStyleSheets,
         durationLabelSheet,
      ];
   }

   static get observedAttributes() {
      return [
         ...super.observedAttributes,
         "largest-unit",
         "smallest-unit",
         "largest-unit-digits",
      ];
   }

   get largestUnit() {
      return this.#largestUnit;
   }

   set largestUnit(v) {
      this.setAttribute("largest-unit", v);
   }

   get smallestUnit() {
      return this.#smallestUnit;
   }

   set smallestUnit(v) {
      this.setAttribute("smallest-unit", v);
   }

   get largestUnitDigits() {
      return this.#largestUnitDigits;
   }

   set largestUnitDigits(v) {
      if (v == null || v === "") this.removeAttribute("largest-unit-digits");
      else this.setAttribute("largest-unit-digits", String(v));
   }

   #updateDescriptors() {
      const { descriptors, separators } = buildDurationDescriptors(
         this.#largestUnit,
         this.#smallestUnit,
         { largestUnitDigits: this.#largestUnitDigits },
      );
      this._instanceDescriptors = descriptors;
      this._instanceSeparators = separators;
   }

   connectedCallback() {
      this.#largestUnit = normalizeDurationUnit(
         this.getAttribute("largest-unit"),
         "year",
      );
      this.#smallestUnit = normalizeDurationUnit(
         this.getAttribute("smallest-unit"),
         "second",
      );
      this.#largestUnitDigits = this.getAttribute("largest-unit-digits");
      this.#updateDescriptors();
      super.connectedCallback();
   }

   attributeChangedCallback(name, oldVal, newVal) {
      if (
         oldVal !== newVal &&
         (name === "largest-unit" ||
            name === "smallest-unit" ||
            name === "largest-unit-digits")
      ) {
         if (name === "largest-unit") {
            this.#largestUnit = normalizeDurationUnit(newVal, "day");
         } else if (name === "smallest-unit") {
            this.#smallestUnit = normalizeDurationUnit(newVal, "second");
         } else {
            this.#largestUnitDigits = newVal;
         }
         this.#updateDescriptors();
         this._rebuild();
      }
      super.attributeChangedCallback(name, oldVal, newVal);
   }

   /** @returns {string} ISO 8601 duration string (e.g. "P1DT2H30M45S") */
   get formattedValue() {
      // Seed all duration fields to 0 so the formatter doesn't see undefined
      // for fields outside the active unit window (e.g. milliseconds when
      // smallest-unit is "second").
      const d = {};
      for (const desc of ALL_DURATION_DESCRIPTORS) d[desc.field] = 0;
      for (const desc of this.activeDescriptors) {
         d[desc.field] = this.getSegmentValueByName(desc.name) || 0;
      }
      return this.#formatDurationRecord(d);
   }

   #formatDurationRecord(d) {
      this.#assertValidUnitWindow();
      const fractionalSecondDigits =
         FRACTIONAL_SECOND_DIGITS[this.#smallestUnit];
      const duration = Temporal.Duration.from(d);
      return fractionalSecondDigits === undefined
         ? duration.toString()
         : duration.toString({ fractionalSecondDigits });
   }

   #hiddenFields(d) {
      this.#assertValidUnitWindow();
      const largestIndex = DURATION_UNIT_ORDER.indexOf(this.#largestUnit);
      const smallestIndex = DURATION_UNIT_ORDER.indexOf(this.#smallestUnit);
      return DURATION_UNIT_ORDER.filter((unit, index) => {
         if (index >= largestIndex && index <= smallestIndex) return false;
         return !!d[DURATION_FIELD_BY_UNIT[unit]];
      });
   }

   #assertValidUnitWindow() {
      const largestIndex = DURATION_UNIT_ORDER.indexOf(this.#largestUnit);
      const smallestIndex = DURATION_UNIT_ORDER.indexOf(this.#smallestUnit);
      if (largestIndex <= smallestIndex) return;
      throw new RangeError(
         `nova-duration: largest-unit="${this.#largestUnit}" must not be smaller than smallest-unit="${this.#smallestUnit}"`,
      );
   }

   #assertVisibleUnitWindow(d, inputLabel) {
      this.#assertValidUnitWindow();
      const hidden = this.#hiddenFields(d);
      if (hidden.length === 0) return;
      throw new RangeError(
         `nova-duration.value: ${inputLabel} contains nonzero units outside largest-unit="${this.#largestUnit}" and smallest-unit="${this.#smallestUnit}": ${hidden.join(", ")}`,
      );
   }

   /**
    * @param {string} str
    * @throws {RangeError} on parse failure
    */
   parseAndSet(str) {
      if (!str) return;
      const d = parseDuration(str);
      if (!d) {
         throw new RangeError(
            `nova-duration.value: cannot parse "${str}" as ISO 8601 duration`,
         );
      }
      this.#assertVisibleUnitWindow(d, `"${str}"`);
      const values = this.activeDescriptors.map((desc) => d[desc.field] ?? 0);
      this.setAllSegmentValues(values, true);
   }

   _compareValues(a, b) {
      const da = parseDuration(a);
      const db = parseDuration(b);
      if (!da || !db) return null;
      try {
         return Temporal.Duration.compare(da, db);
      } catch {
         try {
            return Temporal.Duration.compare(da, db, {
               relativeTo: DURATION_COMPARE_ANCHOR,
            });
         } catch {
            return null;
         }
      }
   }

   // ── Interface contract ─────────────────────────────────────────────────────

   /** @returns {Temporal.Duration|null} */
   _toTemporal() {
      const d = parseDuration(this.formattedValue);
      if (!d) return null;
      return Temporal.Duration.from(d);
   }

   /**
    * @param {Temporal.Duration} t
    * @returns {string}
    */
   _formatTemporal(t) {
      const d = temporalToDurationRecord(t);
      this.#assertVisibleUnitWindow(d, "Temporal.Duration");
      return this.#formatDurationRecord(d);
   }
}

customElements.define("nova-duration", NovaDuration);

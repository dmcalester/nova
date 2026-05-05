/**
 * <nova-time> — UTC/Zulu time input with configurable smallest unit
 *
 * Attributes:
 *   value      — ISO time string: "HH:MM:SS.fffffffffZ"
 *   smallest-unit — minute | second | millisecond | microsecond | nanosecond
 *   name       — form field name
 *   disabled   — disables input
 *   readonly   — prevents editing
 *
 * Value format: "14:30:00.000000000Z" (always UTC, always Z suffix)
 */

import { NovaTemporalInputBase } from "./nova-temporal-input-base.js";
import {
   parseTime,
   formatTime,
   nowUTC,
   parseTimeFlexible,
   temporalToTimeRecord,
   exceedsTimeSmallestUnit,
} from "./nova-temporal.js";
import {
   ALL_TIME_DESCRIPTORS,
   buildTimeDescriptors,
   buildTimeRecordFromSegments,
   timeToSegmentValues,
} from "./nova-temporal-segments.js";

export class NovaTime extends NovaTemporalInputBase {
   #smallestUnit = "second";

   static get temporalType() {
      return "PlainTime";
   }

   static get observedAttributes() {
      return [...super.observedAttributes, "smallest-unit"];
   }

   /** @returns {import("./nova-temporal.js").TimeSmallestUnit} */
   get smallestUnit() {
      return this.#smallestUnit;
   }

   /** @param {import("./nova-temporal.js").TimeSmallestUnit} v */
   set smallestUnit(v) {
      this.setAttribute("smallest-unit", v);
   }

   static get segmentDescriptors() {
      return ALL_TIME_DESCRIPTORS.slice(0, 3);
   }

   static get suffix() {
      return "Z";
   }

   #updateDescriptors() {
      const { descriptors, separators } = buildTimeDescriptors(
         this.#smallestUnit,
      );
      this._instanceDescriptors = descriptors;
      this._instanceSeparators = separators;
   }

   connectedCallback() {
      this.#smallestUnit = this.getAttribute("smallest-unit") || "second";
      this.#updateDescriptors();
      super.connectedCallback();
   }

   attributeChangedCallback(name, oldVal, newVal) {
      if (name === "smallest-unit" && oldVal !== newVal) {
         this.#smallestUnit = newVal || "second";
         this.#updateDescriptors();
         this._rebuild();
      }
      super.attributeChangedCallback(name, oldVal, newVal);
   }

   /** @returns {string} "HH:MM:SS[.fff…]Z" — always Z because the library is UTC-only */
   get formattedValue() {
      const t = buildTimeRecordFromSegments((n) =>
         this.getSegmentValueByName(n),
      );
      return formatTime(t, this.#smallestUnit) + "Z";
   }

   /**
    * @param {string} str
    * @param {boolean} [strict=false] - when true, only accept the native
    *   `HH:MM…` form and throw if the input has more precision than the
    *   current smallest unit. When false, broader ISO forms are accepted and
    *   excess precision is truncated with a `precision-truncated` event.
    * @throws {RangeError} on parse failure or strict-mode precision overflow
    */
   parseAndSet(str, strict = false) {
      if (!str) return;
      const t = strict ? parseTime(str) : parseTimeFlexible(str);
      if (!t) {
         throw new RangeError(
            `nova-time.value: cannot parse "${str}" as ISO 8601 time`,
         );
      }
      if (exceedsTimeSmallestUnit(t, this.#smallestUnit)) {
         if (strict) {
            throw new RangeError(
               `nova-time.value: input precision exceeds smallest-unit="${this.#smallestUnit}"`,
            );
         }
         this.#emitPrecisionTruncated(str, t);
      }
      this.setAllSegmentValues(timeToSegmentValues(t, this.#smallestUnit), true);
   }

   #emitPrecisionTruncated(input, parsedRecord) {
      this.dispatchEvent(
         new CustomEvent("precision-truncated", {
            detail: { smallestUnit: this.#smallestUnit, input, parsedRecord },
            bubbles: true,
         }),
      );
   }

   _parseStrictValue(str) {
      try {
         this.parseAndSet(str, true);
      } catch {
         // Paste failed — leave segments unchanged
      }
   }

   _parsePasteValue(str) {
      const t = parseTimeFlexible(str);
      if (!t) return;
      if (exceedsTimeSmallestUnit(t, this.#smallestUnit)) {
         this.#emitPrecisionTruncated(str, t);
      }
      this.setAllSegmentValues(timeToSegmentValues(t, this.#smallestUnit), true);
   }

   _setToNow() {
      const now = nowUTC();
      const time = temporalToTimeRecord(now);
      const values = this.activeDescriptors.map((d) => time[d.field] ?? 0);
      this.setAllSegmentValues(values);
   }

   _compareValues(a, b) {
      const ta = parseTime(a);
      const tb = parseTime(b);
      if (!ta || !tb) return null;
      return Temporal.PlainTime.compare(ta, tb);
   }

   // ── Interface contract ─────────────────────────────────────────────────────

   /** @returns {Temporal.PlainTime|null} */
   _toTemporal() {
      const t = parseTime(this.formattedValue);
      if (!t) return null;
      return Temporal.PlainTime.from(t);
   }

   /**
    * @param {Temporal.PlainTime} t
    * @returns {string}
    */
   _formatTemporal(t) {
      return formatTime(temporalToTimeRecord(t), this.#smallestUnit) + "Z";
   }
}

customElements.define("nova-time", NovaTime);

/**
 * <nova-date> — Calendar date input (YYYY-MM-DD)
 *
 * Attributes:
 *   value    — ISO date string: "2026-02-09"
 *   overflow — "constrain" (default) | "reject"
 *   name     — form field name
 *   disabled — disables input
 *   readonly — prevents editing
 */

import { NovaTemporalInputBase } from "./nova-temporal-input-base.js";
import {
   parseCalendarDate,
   formatCalendarDate,
   parseAnyDate,
} from "./nova-temporal.js";
import {
   CALENDAR_DATE_DESCRIPTORS,
   CALENDAR_DATE_SEPARATORS,
   clampCalendarDay,
} from "./nova-temporal-segments.js";

export class NovaDate extends NovaTemporalInputBase {
   static get temporalType() {
      return "PlainDate";
   }

   static get observedAttributes() {
      return [...super.observedAttributes, "overflow"];
   }

   static get segmentDescriptors() {
      return CALENDAR_DATE_DESCRIPTORS;
   }

   static get separators() {
      return CALENDAR_DATE_SEPARATORS;
   }

   /** @returns {string} "YYYY-MM-DD" */
   get formattedValue() {
      const year = this.getSegmentValueByName("year");
      const month = this.getSegmentValueByName("month");
      const day = this.getSegmentValueByName("day");
      return formatCalendarDate({ year, month, day });
   }

   _rawFormattedValue() {
      const y = String(this.getSegmentValueByName("year")).padStart(4, "0");
      const m = String(this.getSegmentValueByName("month")).padStart(2, "0");
      const d = String(this.getSegmentValueByName("day")).padStart(2, "0");
      return `${y}-${m}-${d}`;
   }

   /**
    * @param {string} str
    * @param {boolean} [strict=false] - when true, only accept "YYYY-MM-DD";
    *   otherwise accept ordinal (YYYY-DDD) too via parseAnyDate
    * @throws {RangeError} on parse failure (Temporal philosophy: validity-strict)
    */
   parseAndSet(str, strict = false) {
      if (!str) return;
      const d = strict ? parseCalendarDate(str) : parseAnyDate(str);
      if (!d) {
         throw new RangeError(
            `nova-date.value: cannot parse "${str}" as ${strict ? "calendar date" : "date"}`,
         );
      }
      this.setAllSegmentValues([d.year, d.month, d.day], true);
   }

   /**
    * @param {string} str
    * @throws {RangeError} when the pasted string cannot be parsed
    */
   _parsePasteValue(str) {
      // Try whole-string parse first (handles bare date forms), then fall
      // back to splitting on T so pasting a full datetime still extracts
      // the date part.
      const tIdx = str.indexOf("T");
      const candidate = tIdx > 0 ? str.slice(0, tIdx) : str;
      const pd = parseAnyDate(str) || parseAnyDate(candidate);
      if (!pd) throw new RangeError(`nova-date.value: cannot parse "${str}" as date`);
      this.setAllSegmentValues([pd.year, pd.month, pd.day], true);
   }

   _onSegmentValueChanged(_index, name) {
      if (this.getAttribute("overflow") === "reject") return;
      clampCalendarDay(
         (n) => this.getSegmentValueByName(n),
         (n, v, s) => this.setSegmentValueByName(n, v, s),
         name,
      );
   }

   _setToNow() {
      const now = Temporal.Now.plainDateISO("UTC");
      this.setAllSegmentValues([now.year, now.month, now.day]);
   }

   _compareValues(a, b) {
      return this._compareParsed(a, b, parseCalendarDate, Temporal.PlainDate.compare);
   }

   // ── Interface contract ─────────────────────────────────────────────────────

   /** @returns {Temporal.PlainDate|null} */
   _toTemporal() {
      const d = parseCalendarDate(this.formattedValue);
      if (!d) return null;
      return Temporal.PlainDate.from(d);
   }

   /**
    * @param {Temporal.PlainDate} t
    * @returns {string}
    */
   _formatTemporal(t) {
      return formatCalendarDate({
         year: t.year,
         month: t.month,
         day: t.day,
      });
   }
}

customElements.define("nova-date", NovaDate);

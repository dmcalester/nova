/**
 * <nova-datetime> — Combined date+time input (single component)
 *
 * Extends NovaSegmentInputBase to present date and time segments as a single
 * unified input field. All Tab/Shift+Tab/arrow/digit behavior is inherited
 * from the base class — no shadow DOM bridging needed.
 *
 * Attributes:
 *   value      — ISO datetime: "2026-02-09T14:30:00Z" or "2026-040T14:30:00Z"
 *   format     — "date" (YYYY-MM-DD, default) or "ordinal" (YYYY-DDD)
 *   smallest-unit — minute | second | millisecond | microsecond | nanosecond
 *   name       — form field name
 *   disabled   — disables input
 *   readonly   — prevents editing
 *
 * Value format: "2026-02-09T14:30:00Z" (calendar) or "2026-040T14:30:00Z" (ordinal)
 */

import { NovaTemporalInputBase } from "./nova-temporal-input-base.js";
import {
   parseCalendarDate,
   formatCalendarDate,
   parseOrdinalDate,
   formatOrdinalDate,
   parseTime,
   formatTime,
   nowUTC,
   parseAnyDate,
   parseAnyDatetime,
   temporalToTimeRecord,
   exceedsTimeSmallestUnit,
} from "./nova-temporal.js";
import {
   CALENDAR_DATE_DESCRIPTORS,
   CALENDAR_DATE_SEPARATORS,
   ORDINAL_DATE_DESCRIPTORS,
   buildTimeDescriptors,
   clampCalendarDay,
   clampOrdinalDay,
   buildTimeRecordFromSegments,
   timeToSegmentValues,
} from "./nova-temporal-segments.js";

// ── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Combine date + time descriptors into a single segment list with a `T`
 * separator between them. Date-side descriptors are cloned so a per-instance
 * mutation (e.g. extraClass) doesn't bleed into the shared module constants.
 *
 * @param {"date"|"ordinal"} format
 * @param {import("./nova-temporal.js").TimeSmallestUnit} smallestUnit
 * @returns {{
 *   descriptors: import("./nova-temporal-segments.js").SegmentDescriptor[],
 *   separators: import("./nova-temporal-segments.js").SegmentSeparator[],
 *   dateSegmentCount: number
 * }}
 */
function buildCombinedDescriptors(format, smallestUnit) {
   const dateDescs = (
      format === "ordinal"
         ? ORDINAL_DATE_DESCRIPTORS
         : CALENDAR_DATE_DESCRIPTORS
   ).map((d) => ({ ...d }));

   const { descriptors: timeDescs, separators: timeSeps } =
      buildTimeDescriptors(smallestUnit);

   const dateSeps =
      dateDescs.length === 3 ? [...CALENDAR_DATE_SEPARATORS] : ["-"];

   return {
      descriptors: [...dateDescs, ...timeDescs],
      separators: [
         ...dateSeps,
         { text: "T", className: "datetime-separator" },
         ...timeSeps,
      ],
      dateSegmentCount: dateDescs.length,
   };
}

export class NovaDatetime extends NovaTemporalInputBase {
   #format = "date";
   #smallestUnit = "second";
   #dateSegmentCount = 0;

   static get temporalType() {
      return "PlainDateTime";
   }

   static get observedAttributes() {
      return [
         ...super.observedAttributes,
         "format",
         "smallest-unit",
         "overflow",
      ];
   }

   static get suffix() {
      return "Z";
   }

   /** @returns {"date"|"ordinal"} */
   get format() {
      return this.#format;
   }

   get #isOrdinal() {
      return this.#format === "ordinal";
   }

   /** @returns {import("./nova-temporal.js").TimeSmallestUnit} */
   get smallestUnit() {
      return this.#smallestUnit;
   }

   /** @param {import("./nova-temporal.js").TimeSmallestUnit} v */
   set smallestUnit(v) {
      this.setAttribute("smallest-unit", v);
   }

   /**
    * Convert a PlainDate (or PlainDateTime) to segment values for the
    * current format.
    * @param {Temporal.PlainDate|Temporal.PlainDateTime} pd
    * @returns {number[]}
    */
   #dateValuesFrom(pd) {
      return this.#isOrdinal
         ? [pd.year, pd.dayOfYear]
         : [pd.year, pd.month, pd.day];
   }

   /**
    * Format a PlainDate (or PlainDateTime) date part for the current format.
    * @param {Temporal.PlainDate|Temporal.PlainDateTime} pd
    * @returns {string}
    */
   #formatDateFrom(pd) {
      return this.#isOrdinal
         ? formatOrdinalDate({ year: pd.year, dayOfYear: pd.dayOfYear })
         : formatCalendarDate({ year: pd.year, month: pd.month, day: pd.day });
   }

   #updateDescriptors() {
      const { descriptors, separators, dateSegmentCount } =
         buildCombinedDescriptors(this.#format, this.#smallestUnit);
      this.#dateSegmentCount = dateSegmentCount;
      this._instanceDescriptors = descriptors;
      this._instanceSeparators = separators;
   }

   connectedCallback() {
      this.#format = this.getAttribute("format") || "date";
      this.#smallestUnit = this.getAttribute("smallest-unit") || "second";
      this.#updateDescriptors();
      super.connectedCallback();
   }

   attributeChangedCallback(name, oldVal, newVal) {
      if (
         oldVal !== newVal &&
         (name === "format" || name === "smallest-unit")
      ) {
         if (name === "format") this.#format = newVal || "date";
         else this.#smallestUnit = newVal || "second";
         this.#updateDescriptors();
         this._rebuild();
      }
      super.attributeChangedCallback(name, oldVal, newVal);
   }

   // ── Formatted value ──────────────────────────────────────────────────────

   /** @returns {string} "YYYY-MM-DDTHH:MM:SS[.fff…]Z" or "YYYY-DDDT…Z" in ordinal mode */
   get formattedValue() {
      const datePart = this.#formatDate();
      const timePart = this.#formatTime();
      return `${datePart}T${timePart}Z`;
   }

   #formatDate() {
      const year = this.getSegmentValueByName("year");
      if (this.#isOrdinal) {
         return formatOrdinalDate({
            year,
            dayOfYear: this.getSegmentValueByName("dayOfYear"),
         });
      }
      return formatCalendarDate({
         year,
         month: this.getSegmentValueByName("month"),
         day: this.getSegmentValueByName("day"),
      });
   }

   #formatTime() {
      const t = buildTimeRecordFromSegments((n) =>
         this.getSegmentValueByName(n),
      );
      return formatTime(t, this.#smallestUnit);
   }

   // ── Parse and set ────────────────────────────────────────────────────────

   #applyParsedDatetime(parsed, originalInput) {
      if (exceedsTimeSmallestUnit(parsed.time, this.#smallestUnit)) {
         this.#emitPrecisionTruncated(originalInput, parsed.time);
      }
      const dateValues = this.#dateValuesFrom(parsed.date);
      const timeValues = timeToSegmentValues(parsed.time, this.#smallestUnit);
      this.setAllSegmentValues([...dateValues, ...timeValues], true);
   }

   /**
    * @param {string} str
    * @param {boolean} [strict=false] - when true, only the native value
    *   format is accepted (calendar or ordinal per `format` attribute) and
    *   excess time precision throws. When false, any well-formed ISO 8601
    *   datetime is accepted and offset/zone forms are normalized to UTC.
    * @throws {RangeError} on parse failure or strict-mode precision overflow
    */
   parseAndSet(str, strict = false) {
      if (!str) return;
      const s = str.trim();

      // Flexible path: try Instant-first parsing so offset and [zone] forms
      // normalize to UTC. Strict path keeps native-only parsing.
      if (!strict) {
         const parsed = parseAnyDatetime(s);
         if (parsed) {
            this.#applyParsedDatetime(parsed, s);
            return;
         }
      }

      const tIdx = s.indexOf("T");
      if (tIdx < 0) {
         throw new RangeError(
            `nova-datetime.value: cannot parse "${str}" — missing T separator`,
         );
      }

      const datePart = s.slice(0, tIdx);
      const timePart = s.slice(tIdx + 1);

      // Parse date
      let parsedDate;
      let dateLabel;
      if (strict) {
         parsedDate = this.#isOrdinal
            ? parseOrdinalDate(datePart)
            : parseCalendarDate(datePart);
         dateLabel = this.#isOrdinal ? "ordinal date" : "calendar date";
      } else {
         parsedDate = parseAnyDate(datePart);
         dateLabel = "date";
      }
      if (!parsedDate) {
         throw new RangeError(
            `nova-datetime.value: cannot parse "${datePart}" as ${dateLabel}`,
         );
      }
      const dateValues = this.#dateValuesFrom(parsedDate);

      const t = parseTime(timePart);
      if (!t) {
         throw new RangeError(
            `nova-datetime.value: cannot parse "${timePart}" as time`,
         );
      }
      if (exceedsTimeSmallestUnit(t, this.#smallestUnit)) {
         if (strict) {
            throw new RangeError(
               `nova-datetime.value: input precision exceeds smallest-unit="${this.#smallestUnit}"`,
            );
         }
         this.#emitPrecisionTruncated(str, t);
      }

      const timeValues = timeToSegmentValues(t, this.#smallestUnit);
      this.setAllSegmentValues([...dateValues, ...timeValues], true);
   }

   #emitPrecisionTruncated(input, parsedRecord) {
      this.dispatchEvent(
         new CustomEvent("precision-truncated", {
            detail: {
               smallestUnit: this.#smallestUnit,
               input,
               parsedRecord,
            },
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
      const s = str.trim();

      // Full datetime
      const parsed = parseAnyDatetime(s);
      if (parsed) {
         this.#applyParsedDatetime(parsed, s);
         return;
      }

      // Date-only — set date segments, keep existing time
      const pd = parseAnyDate(s);
      if (pd) {
         const dateValues = this.#dateValuesFrom(pd);
         const timeValues = [];
         for (
            let i = this.#dateSegmentCount;
            i < this.activeDescriptors.length;
            i++
         ) {
            timeValues.push(
               this.getSegmentValueByName(this.activeDescriptors[i].name) || 0,
            );
         }
         this.setAllSegmentValues([...dateValues, ...timeValues], true);
         return;
      }

      // Time-only — set time segments, keep existing date
      const t = parseTime(s);
      if (t) {
         if (exceedsTimeSmallestUnit(t, this.#smallestUnit)) {
            this.#emitPrecisionTruncated(s, t);
         }
         const dateValues = [];
         for (let i = 0; i < this.#dateSegmentCount; i++) {
            dateValues.push(
               this.getSegmentValueByName(this.activeDescriptors[i].name),
            );
         }
         const timeValues = timeToSegmentValues(t, this.#smallestUnit);
         this.setAllSegmentValues([...dateValues, ...timeValues], true);
      }
   }

   _compareValues(a, b) {
      const pa = parseAnyDatetime(a);
      const pb = parseAnyDatetime(b);
      if (!pa || !pb) return null;
      const dateCmp = Temporal.PlainDate.compare(pa.date, pb.date);
      if (dateCmp !== 0) return dateCmp;
      return Temporal.PlainTime.compare(pa.time, pb.time);
   }

   // ── Interface contract ─────────────────────────────────────────────────────

   /** @returns {Temporal.PlainDateTime|null} */
   _toTemporal() {
      const parsed = parseAnyDatetime(this.formattedValue);
      if (!parsed) return null;
      return parsed.date.toPlainDateTime(parsed.time);
   }

   /**
    * @param {Temporal.PlainDateTime} t
    * @returns {string}
    */
   _formatTemporal(t) {
      const datePart = this.#formatDateFrom(t);
      const timePart = formatTime(temporalToTimeRecord(t), this.#smallestUnit);
      return `${datePart}T${timePart}Z`;
   }

   _setToNow() {
      const now = nowUTC();
      const pd = now.toPlainDate();
      const dateValues = this.#dateValuesFrom(pd);
      const timeRecord = temporalToTimeRecord(now);
      const timeValues = timeToSegmentValues(timeRecord, this.#smallestUnit);
      this.setAllSegmentValues([...dateValues, ...timeValues]);
   }

   // ── Dependent value clamping ─────────────────────────────────────────────

   _onSegmentValueChanged(_index, name) {
      if (this.getAttribute("overflow") !== "constrain") return;
      const getVal = (n) => this.getSegmentValueByName(n);
      const setVal = (n, v, s) => this.setSegmentValueByName(n, v, s);
      if (!this.#isOrdinal) {
         clampCalendarDay(getVal, setVal, name);
      } else {
         clampOrdinalDay(getVal, setVal, name);
      }
   }

}

customElements.define("nova-datetime", NovaDatetime);

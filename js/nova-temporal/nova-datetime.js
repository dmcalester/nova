/**
 * <nova-datetime> — Combined date+time input (single component)
 *
 * Extends NovaSegmentInputBase to present date and time segments as a single
 * unified input field. All Tab/Shift+Tab/arrow/digit behavior is inherited
 * from the base class — no shadow DOM bridging needed.
 *
 * Attributes:
 *   value         — ISO datetime: "2026-02-09T14:30:00Z" or "2026-040T14:30:00Z"
 *   format        — "date" (YYYY-MM-DD, default) or "ordinal" (YYYY-DDD)
 *   smallest-unit — minute | second | millisecond | microsecond | nanosecond
 *   overflow      — "constrain" (default) | "reject"
 *   name          — form field name
 *   disabled      — disables input
 *   readonly      — prevents editing
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
   parseAnyDate,
   parseAnyDatetime,
   instantToZonedRecord,
   exceedsTimeSmallestUnit,
   parseZone,
   ordinalDateToPlainDate,
} from "./nova-temporal.js";
import { reportNovaError } from "./nova-temporal-errors.js";
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
   #lastReportedInvalidZone = null;

   static get temporalType() {
      return "Instant";
   }

   static get observedAttributes() {
      return [
         ...super.observedAttributes,
         "format",
         "smallest-unit",
         "overflow",
         "zone",
         "value-format",
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

   /** @returns {string} raw zone attribute value (default "Z") */
   get zone() {
      return this.getAttribute("zone") || "Z";
   }

   /** @returns {"z"|"offset"} */
   get valueFormat() {
      return this.getAttribute("value-format") === "offset" ? "offset" : "z";
   }

   #zoneId() {
      const raw = this.zone;
      const zid = parseZone(raw);
      if (zid == null) {
         if (this.#lastReportedInvalidZone !== raw) {
            this.#lastReportedInvalidZone = raw;
            reportNovaError(
               this,
               "invalid-zone",
               `Invalid zone "${raw}" — falling back to UTC`,
               { zone: raw },
            );
         }
         return "UTC";
      }
      this.#lastReportedInvalidZone = null;
      return zid;
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
    * Convert a PlainDate to segment values for the current format.
    * @param {Temporal.PlainDate} pd
    * @returns {number[]}
    */
   #dateValuesFrom(pd) {
      return this.#isOrdinal
         ? [pd.year, pd.dayOfYear]
         : [pd.year, pd.month, pd.day];
   }

   /**
    * Format a PlainDate date part for the current format.
    * @param {Temporal.PlainDate} pd
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
      if (name === "zone" && oldVal !== newVal) {
         // Preserve canonical instant: re-project segments from old zone into new zone.
         // Guard: skip if not yet connected — connectedCallback handles initial projection.
         if (this.isConnected && !this.isEmpty) {
            // Rebuild the instant using the OLD zone so the canonical UTC instant is
            // preserved across zone changes.  _toTemporal() already reads the current
            // zone attribute (which is now newVal), so we re-derive from oldVal here.
            const oldZid = parseZone(oldVal || "Z") ?? "UTC";
            let wall;
            if (this.#isOrdinal) {
               const pd = ordinalDateToPlainDate(
                  this.getSegmentValueByName("year"),
                  this.getSegmentValueByName("dayOfYear"),
               );
               wall = { year: pd.year, month: pd.month, day: pd.day };
            } else {
               wall = {
                  year: this.getSegmentValueByName("year"),
                  month: this.getSegmentValueByName("month"),
                  day: this.getSegmentValueByName("day"),
               };
            }
            const timeRecord = buildTimeRecordFromSegments(
               (n) => this.getSegmentValueByName(n),
            );
            try {
               const inst = Temporal.ZonedDateTime.from(
                  { ...wall, ...timeRecord, timeZone: oldZid },
                  { overflow: "constrain" },
               ).toInstant();
               const newZid = parseZone(newVal || "Z") ?? "UTC";
               const { date: pd, time: tr } = instantToZonedRecord(inst, newZid);
               const dateValues = this.#dateValuesFrom(pd);
               const timeValues = timeToSegmentValues(tr, this.#smallestUnit);
               this.setAllSegmentValues([...dateValues, ...timeValues], true);
            } catch {
               // Guard: if recomposition fails, leave segments unchanged
            }
            return;
         }
      }
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

   /**
    * @returns {string} formatted value string respecting `valueFormat`.
    * Delegates to `_formatTemporal` so Z-form always reflects the UTC instant
    * and offset-form emits with the configured zone's offset suffix.
    */
   get formattedValue() {
      const t = this._toTemporal();
      if (!t) {
         // Fallback to raw segment assembly (partial / invalid state)
         const datePart = this.#formatDate();
         const timePart = this.#formatTime();
         return `${datePart}T${timePart}Z`;
      }
      return this._formatTemporal(t);
   }

   _rawFormattedValue() {
      const year = String(this.getSegmentValueByName("year")).padStart(4, "0");
      let datePart;
      if (this.format === "ordinal") {
         const doy = String(this.getSegmentValueByName("dayOfYear")).padStart(3, "0");
         datePart = `${year}-${doy}`;
      } else {
         const month = String(this.getSegmentValueByName("month")).padStart(2, "0");
         const day = String(this.getSegmentValueByName("day")).padStart(2, "0");
         datePart = `${year}-${month}-${day}`;
      }
      const t = buildTimeRecordFromSegments((n) => this.getSegmentValueByName(n));
      return `${datePart}T${formatTime(t, this.smallestUnit)}Z`;
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

      // Flexible path: Instant-first parsing normalizes offset and [zone] forms
      // to UTC. Unzoned strings are rejected — nova-datetime is Instant-canonical
      // and requires an explicit UTC offset or Z suffix.
      // Strict path keeps native-only parsing.
      if (!strict) {
         const inst = parseAnyDatetime(s);
         if (inst) {
            this.#applyParsedDatetime(instantToZonedRecord(inst, this.#zoneId()), s);
            return;
         }
         throw new RangeError(
            `nova-datetime.value: cannot parse "${str}" — expected an ISO 8601 datetime with a UTC offset (e.g. "…Z" or "…+00:00")`,
         );
      }

      const tIdx = s.indexOf("T");
      if (tIdx < 0) {
         throw new RangeError(
            `nova-datetime.value: cannot parse "${str}" — missing T separator`,
         );
      }

      const datePart = s.slice(0, tIdx);
      const timePart = s.slice(tIdx + 1);

      // Strict path: native-only parsing for the current format.
      const parsedDate = this.#isOrdinal
         ? parseOrdinalDate(datePart)
         : parseCalendarDate(datePart);
      const dateLabel = this.#isOrdinal ? "ordinal date" : "calendar date";
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
         throw new RangeError(
            `nova-datetime.value: input precision exceeds smallest-unit="${this.#smallestUnit}"`,
         );
      }

      const timeValues = timeToSegmentValues(t, this.#smallestUnit);
      this.setAllSegmentValues([...dateValues, ...timeValues], true);
   }

   /**
    * Detail shape: `{ smallestUnit, input, parsedRecord }` — flat keys.
    * Convention: fixed-schema events use flat keys; events with dynamic keys
    * (e.g. per-slot data) nest them under a bag key like `slots`.
    */
   #emitPrecisionTruncated(input, parsedRecord) {
      this.dispatchEvent(
         new CustomEvent("precision-truncated", {
            detail: {
               smallestUnit: this.#smallestUnit,
               input,
               parsedRecord,
            },
            bubbles: true,
            composed: true,
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

   /**
    * @param {string} str
    * @throws {RangeError} when the pasted string cannot be parsed
    */
   _parsePasteValue(str) {
      const s = str.trim();

      // Full datetime
      const inst = parseAnyDatetime(s);
      if (inst) {
         this.#applyParsedDatetime(instantToZonedRecord(inst, this.#zoneId()), s);
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
         return;
      }
      throw new RangeError(`nova-datetime.value: cannot parse "${s}" as datetime, date, or time`);
   }

   _compareValues(a, b) {
      const ia = parseAnyDatetime(a);
      const ib = parseAnyDatetime(b);
      if (!ia || !ib) return null;
      return Temporal.Instant.compare(ia, ib);
   }

   // ── Interface contract ─────────────────────────────────────────────────────

   /** @returns {Temporal.Instant|null} */
   _toTemporal() {
      const zid = this.#zoneId();

      let wall;
      if (this.#isOrdinal) {
         const pd = ordinalDateToPlainDate(
            this.getSegmentValueByName("year"),
            this.getSegmentValueByName("dayOfYear"),
         );
         wall = { year: pd.year, month: pd.month, day: pd.day };
      } else {
         wall = {
            year: this.getSegmentValueByName("year"),
            month: this.getSegmentValueByName("month"),
            day: this.getSegmentValueByName("day"),
         };
      }

      const timeRecord = buildTimeRecordFromSegments(
         (n) => this.getSegmentValueByName(n),
      );

      try {
         const overflow = this.getAttribute("overflow") === "reject"
            ? "reject"
            : "constrain";
         return Temporal.ZonedDateTime.from(
            { ...wall, ...timeRecord, timeZone: zid },
            { overflow },
         ).toInstant();
      } catch {
         return null;
      }
   }

   /**
    * @param {Temporal.Instant} t
    * @returns {string}
    */
   _formatTemporal(t) {
      if (this.valueFormat === "offset") {
         const zid = this.#zoneId();
         const { date: pd, time: timeRecord } = instantToZonedRecord(t, zid);
         // parseZone returns "UTC" for Z/UTC input — treat as +00:00 offset suffix.
         const offsetSuffix = zid === "UTC" ? "+00:00" : zid;
         return `${this.#formatDateFrom(pd)}T${formatTime(timeRecord, this.#smallestUnit)}${offsetSuffix}`;
      }
      // Z form (default) — always derived from UTC projection regardless of display zone.
      const { date: pd, time: timeRecord } = instantToZonedRecord(t, "UTC");
      return `${this.#formatDateFrom(pd)}T${formatTime(timeRecord, this.#smallestUnit)}Z`;
   }

   _setToNow() {
      const inst = Temporal.Now.instant();
      const { date: pd, time: timeRecord } = instantToZonedRecord(inst, this.#zoneId());
      const dateValues = this.#dateValuesFrom(pd);
      const timeValues = timeToSegmentValues(timeRecord, this.#smallestUnit);
      this.setAllSegmentValues([...dateValues, ...timeValues]);
   }

   // ── Dependent value clamping ─────────────────────────────────────────────

   _onSegmentValueChanged(_index, name) {
      if (this.getAttribute("overflow") === "reject") return;
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

/**
 * <nova-input-ordinal-date> — Ordinal date input
 *
 * DoD "Julian Date" — day of year from 001–365/366.
 *
 * Defaults to day-only mode (DDD). Set value="YYYY-DDD" to
 * include the year segment; set value="DDD" for day-only.
 *
 * Attributes:
 *   value    — "042" (day-only) or "2026-042" (with year)
 *   overflow — "constrain" (default) | "reject"
 *   name     — form field name
 *   disabled — disables input
 *   readonly — prevents editing
 */

import { NovaTemporalInputBase } from "./nova-temporal-input-base.js";
import {
   parseOrdinalDate,
   formatOrdinalDate,
   parseAnyDate,
   ordinalDateToPlainDate,
} from "./nova-temporal.js";
import {
   YEAR_DESCRIPTOR,
   DAY_OF_YEAR_DESCRIPTOR,
   clampOrdinalDay,
} from "./nova-temporal-segments.js";

const FULL_RE = /^\d{4}-\d{1,3}$/;
const DAY_ONLY_RE = /^\d{1,3}$/;

/**
 * Parse a day-of-year-only string ("042", "365"). Used to detect whether
 * a value sets the component to day-only mode vs. year+day mode.
 *
 * @param {string} str
 * @returns {number|null} 1-366, or null if not a valid day-only string
 */
function parseDayOnly(str) {
   const trimmed = str.trim();
   if (!DAY_ONLY_RE.test(trimmed)) return null;
   const val = parseInt(trimmed, 10);
   return val >= 1 && val <= 366 ? val : null;
}

export class NovaInputOrdinalDate extends NovaTemporalInputBase {
   // Static = class-level type. Instance getter (below) narrows to null in day-only mode.
   static get temporalType() {
      return "PlainDate";
   }

   static get observedAttributes() {
      return [...super.observedAttributes, "overflow"];
   }

   // Day-only mode has no year, so this component can't produce a PlainDate.
   // Consumers must check temporalType !== null before reading .temporal.
   get temporalType() {
      return this.#hasYear ? "PlainDate" : null;
   }

   // Static defaults are for day-only (the default mode)
   static get segmentDescriptors() {
      return [DAY_OF_YEAR_DESCRIPTOR];
   }

   static get separators() {
      return [];
   }

   #hasYear = false;

   connectedCallback() {
      const val = this.getAttribute("value") || "";
      this.#hasYear = FULL_RE.test(val);

      if (this.#hasYear) {
         this._instanceDescriptors = [YEAR_DESCRIPTOR, DAY_OF_YEAR_DESCRIPTOR];
         this._instanceSeparators = ["-"];
      }

      super.connectedCallback();
   }

   /** @returns {string} "DDD" in day-only mode, "YYYY-DDD" otherwise */
   get formattedValue() {
      const dayOfYear = this.getSegmentValueByName("dayOfYear");
      if (!this.#hasYear) {
         return String(dayOfYear).padStart(3, "0");
      }
      const year = this.getSegmentValueByName("year");
      return formatOrdinalDate({ year, dayOfYear });
   }

   _rawFormattedValue() {
      const doy = String(this.getSegmentValueByName("dayOfYear")).padStart(3, "0");
      if (!this.#hasYear) return doy;
      const year = String(this.getSegmentValueByName("year")).padStart(4, "0");
      return `${year}-${doy}`;
   }

   /**
    * @param {string} str  - "DDD" toggles day-only mode; "YYYY-DDD" or any
    *   parseable date toggles year+day mode
    * @param {boolean} [strict=false] - when true, only accept "YYYY-DDD" or
    *   "DDD"; otherwise calendar dates are also accepted and converted
    * @throws {RangeError} on parse failure
    */
   parseAndSet(str, strict = false) {
      if (!str) return;

      const dayOnly = parseDayOnly(str);
      if (dayOnly !== null) {
         this.#ensureDayOnly();
         this.setAllSegmentValues([dayOnly], true);
         return;
      }

      const d = strict ? parseOrdinalDate(str) : parseAnyDate(str);
      if (!d) {
         throw new RangeError(
            `nova-input-ordinal-date.value: cannot parse "${str}" as ${strict ? "ordinal date" : "date"}`,
         );
      }
      this.#ensureHasYear();
      this.setAllSegmentValues([d.year, d.dayOfYear], true);
   }

   /** Switch into year+day mode (no-op if already there). Rebuilds the DOM. */
   #ensureHasYear() {
      if (!this.#hasYear) {
         this.#hasYear = true;
         this._instanceDescriptors = [YEAR_DESCRIPTOR, DAY_OF_YEAR_DESCRIPTOR];
         this._instanceSeparators = ["-"];
         this._rebuild();
      }
   }

   /** Switch into day-only mode (no-op if already there). Rebuilds the DOM. */
   #ensureDayOnly() {
      if (this.#hasYear) {
         this.#hasYear = false;
         this._instanceDescriptors = [DAY_OF_YEAR_DESCRIPTOR];
         this._instanceSeparators = [];
         this._rebuild();
      }
   }

   /**
    * @param {string} str
    * @throws {RangeError} when the pasted string cannot be parsed
    */
   _parsePasteValue(str) {
      const tIdx = str.indexOf("T");
      const candidate = tIdx > 0 ? str.slice(0, tIdx) : str;
      const pd = parseAnyDate(str) || parseAnyDate(candidate);
      if (pd) {
         this.#ensureHasYear();
         this.setAllSegmentValues([pd.year, pd.dayOfYear], true);
         return;
      }
      const dayOnly = parseDayOnly(str);
      if (dayOnly !== null) {
         this.#ensureDayOnly();
         this.setAllSegmentValues([dayOnly], true);
         return;
      }
      throw new RangeError(`nova-input-ordinal-date.value: cannot parse "${str}" as date`);
   }

   _compareValues(a, b) {
      if (this.#hasYear) {
         const da = parseOrdinalDate(a);
         const db = parseOrdinalDate(b);
         if (!da || !db) return null;
         return Temporal.PlainDate.compare(
            ordinalDateToPlainDate(da.year, da.dayOfYear),
            ordinalDateToPlainDate(db.year, db.dayOfYear),
         );
      }
      const na = parseInt(a, 10);
      const nb = parseInt(b, 10);
      if (isNaN(na) || isNaN(nb)) return null;
      return na < nb ? -1 : na > nb ? 1 : 0;
   }

   _setToNow() {
      const now = Temporal.Now.plainDateISO("UTC");
      if (this.#hasYear) {
         this.setAllSegmentValues([now.year, now.dayOfYear]);
      } else {
         this.setAllSegmentValues([now.dayOfYear]);
      }
   }

   _onSegmentValueChanged(_index, name) {
      if (this.#hasYear && this.getAttribute("overflow") !== "reject") {
         clampOrdinalDay(
            (n) => this.getSegmentValueByName(n),
            (n, v, s) => this.setSegmentValueByName(n, v, s),
            name,
         );
      }
   }

   // ── Interface contract ─────────────────────────────────────────────────────

   /**
    * @returns {Temporal.PlainDate|null} null in day-only mode (no year
    *   context to anchor a full date)
    */
   _toTemporal() {
      if (this.#hasYear) {
         const d = parseOrdinalDate(this.formattedValue);
         if (!d) return null;
         return ordinalDateToPlainDate(d.year, d.dayOfYear);
      }
      return null;
   }

   /**
    * @param {Temporal.PlainDate} t
    * @returns {string}
    */
   _formatTemporal(t) {
      return formatOrdinalDate({
         year: t.year,
         dayOfYear: t.dayOfYear,
      });
   }
}

customElements.define("nova-input-ordinal-date", NovaInputOrdinalDate);

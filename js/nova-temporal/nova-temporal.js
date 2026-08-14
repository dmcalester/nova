/**
 * nova-temporal.js — Temporal utility module for Nova datetime components
 *
 * Requires the Temporal API (Chrome 137+, Firefox 139+).
 * For older browsers, use a Temporal polyfill.
 *
 * Pure functions: parsing, formatting, validation, conversion.
 * Nanosecond precision throughout.
 */

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * @typedef {Object} CalendarDateRecord
 * @property {number} year
 * @property {number} month  - 1-12
 * @property {number} day    - 1-31
 */

/**
 * @typedef {Object} OrdinalDateRecord
 * @property {number} year
 * @property {number} dayOfYear  - 1-366
 */

/**
 * @typedef {Object} TimeRecord
 * @property {number} hour         - 0-23
 * @property {number} minute       - 0-59
 * @property {number} second       - 0-59
 * @property {number} millisecond  - 0-999
 * @property {number} microsecond  - 0-999
 * @property {number} nanosecond   - 0-999
 */

/**
 * @typedef {Object} DurationRecord
 * @property {number} [years]
 * @property {number} [months]
 * @property {number} [days]
 * @property {number} [hours]
 * @property {number} [minutes]
 * @property {number} [seconds]
 * @property {number} [milliseconds]
 * @property {number} [microseconds]
 * @property {number} [nanoseconds]
 */

/**
 * @typedef {"minute"|"second"|"millisecond"|"microsecond"|"nanosecond"|"minutes"|"seconds"|"milliseconds"|"microseconds"|"nanoseconds"} TimeSmallestUnit
 */

/**
 * @typedef {"second"|"millisecond"|"microsecond"|"nanosecond"|"seconds"|"milliseconds"|"microseconds"|"nanoseconds"} DurationSmallestUnit
 */

/**
 * @param {Temporal.PlainDate} pd
 * @returns {CalendarDateRecord}
 */
function dateToRecord(pd) {
   return { year: pd.year, month: pd.month, day: pd.day };
}

/**
 * Convert a Temporal.PlainTime to a plain time record.
 *
 * @param {Temporal.PlainTime} t
 * @returns {TimeRecord}
 */
export function temporalToTimeRecord(t) {
   return {
      hour: t.hour,
      minute: t.minute,
      second: t.second,
      millisecond: t.millisecond,
      microsecond: t.microsecond,
      nanosecond: t.nanosecond,
   };
}

/**
 * Convert a Temporal.Duration to a plain duration record.
 *
 * @param {Temporal.Duration} t
 * @returns {DurationRecord}
 */
export function temporalToDurationRecord(t) {
   return {
      years: t.years,
      months: t.months,
      days: t.days,
      hours: t.hours,
      minutes: t.minutes,
      seconds: t.seconds,
      milliseconds: t.milliseconds,
      microseconds: t.microseconds,
      nanoseconds: t.nanoseconds,
   };
}

// overflow: "reject" preserves the strict-validation behavior of the positional
// Temporal.PlainTime/PlainDate constructors that these helpers used to call.
// Default `Temporal.X.from(record)` clamps out-of-range values silently.
/** @param {TimeRecord} t @returns {Temporal.PlainTime} */
function recordToPlainTime(t) {
   return Temporal.PlainTime.from(t, { overflow: "reject" });
}

/** @param {CalendarDateRecord} d @returns {Temporal.PlainDate} */
function recordToPlainDate(d) {
   return Temporal.PlainDate.from(d, { overflow: "reject" });
}

// (year, dayOfYear) → PlainDate. Temporal exposes the inverse (.dayOfYear)
// but has no direct constructor from these two values. The `-1` offset is
// because day-of-year 1 is Jan 1 itself, not Jan 1 + 1 day.
/**
 * @param {number} year
 * @param {number} dayOfYear  - 1-365 (or 1-366 in leap years)
 * @returns {Temporal.PlainDate}
 * @throws {RangeError} if dayOfYear is outside the valid range for the year
 */
export function ordinalDateToPlainDate(year, dayOfYear) {
   const jan1 = new Temporal.PlainDate(year, 1, 1);
   if (dayOfYear < 1 || dayOfYear > jan1.daysInYear) {
      throw new RangeError(
         `ordinalDateToPlainDate: dayOfYear=${dayOfYear} invalid for year=${year} (${jan1.daysInYear} days)`,
      );
   }
   return jan1.add({ days: dayOfYear - 1 });
}

// ── Days in month / year ─────────────────────────────────────────────────────
/**
 * @param {number} year
 * @param {number} month  - 1-12
 * @returns {number} 28, 29, 30, or 31
 * @throws {RangeError} if year or month is not finite
 */
export function daysInMonth(year, month) {
   const y = Math.trunc(year);
   const m = Math.trunc(month);
   if (!Number.isFinite(y) || !Number.isFinite(m)) {
      throw new RangeError(`daysInMonth: invalid year=${year} month=${month}`);
   }
   return new Temporal.PlainDate(y, m, 1).daysInMonth;
}

/**
 * @param {number} year
 * @returns {number} 365 or 366
 * @throws {RangeError} if year is not finite
 */
export function daysInYear(year) {
   const y = Math.trunc(year);
   if (!Number.isFinite(y)) {
      throw new RangeError(`daysInYear: invalid year=${year}`);
   }
   return new Temporal.PlainDate(y, 1, 1).daysInYear;
}

// ── Time parsing / formatting ────────────────────────────────────────────────
// Accepts: HH:MM, HH:MM:SS, HH:MM:SS.fffffffff, HHMMSS
// Optional leading T and trailing Z are stripped before parsing.
/**
 * @param {string} str
 * @returns {TimeRecord|null} null on parse failure (does not throw)
 */
export function parseTime(str) {
   if (!str) return null;
   let s = str.trim();
   if (s.startsWith("T") || s.startsWith("t")) s = s.slice(1);
   if (s.endsWith("Z") || s.endsWith("z")) s = s.slice(0, -1);
   // Reject a date-bearing string: PlainTime.from would otherwise leniently
   // truncate a full datetime down to its time. A `YYYY-` run marks a date;
   // a bare `±HH:MM` offset (which we still tolerate) never contains one.
   if (/\d{4}-\d/.test(s)) return null;
   try {
      return temporalToTimeRecord(Temporal.PlainTime.from(s));
   } catch {
      return null;
   }
}

/**
 * @param {TimeRecord|null|undefined} t
 * @param {TimeSmallestUnit} [smallestUnit="nanosecond"]
 * @returns {string} ISO 8601 time without Z suffix, or "" if t is falsy
 */
export function formatTime(t, smallestUnit = "nanosecond") {
   if (!t) return "";
   const pt = recordToPlainTime(t);
   const unit = normalizeTimeSmallestUnit(smallestUnit);
   const opts = {
      minute: { smallestUnit: "minute" },
      second: { fractionalSecondDigits: 0 },
      millisecond: { fractionalSecondDigits: 3 },
      microsecond: { fractionalSecondDigits: 6 },
      nanosecond: { fractionalSecondDigits: 9 },
   };
   return pt.toString(opts[unit]);
}

const TIME_SMALLEST_UNITS = [
   "minute",
   "second",
   "millisecond",
   "microsecond",
   "nanosecond",
];

/**
 * @param {TimeSmallestUnit} unit
 * @returns {"minute"|"second"|"millisecond"|"microsecond"|"nanosecond"}
 */
export function normalizeTimeSmallestUnit(unit = "second") {
   const normalized = String(unit || "second").trim().toLowerCase();
   const singular = normalized.endsWith("s")
      ? normalized.slice(0, -1)
      : normalized;
   if (TIME_SMALLEST_UNITS.includes(singular)) return singular;
   throw new RangeError(`Invalid time smallest-unit "${unit}"`);
}

// Fields carried beyond each smallest unit. If any are non-zero in an input
// record, the input precision exceeds the configured unit window.
const SUB_SMALLEST_UNIT_FIELDS = {
   minute: ["second", "millisecond", "microsecond", "nanosecond"],
   second: ["millisecond", "microsecond", "nanosecond"],
   millisecond: ["microsecond", "nanosecond"],
   microsecond: ["nanosecond"],
   nanosecond: [],
};

/**
 * Detect whether a time record carries precision finer than the configured
 * smallest unit. Used to gate a "precision-truncated" event so callers can
 * surface silent rounding rather than letting it pass.
 *
 * @param {TimeRecord|null|undefined} timeRecord
 * @param {TimeSmallestUnit} smallestUnit
 * @returns {boolean}
 */
export function exceedsTimeSmallestUnit(timeRecord, smallestUnit) {
   if (!timeRecord) return false;
   const fields = SUB_SMALLEST_UNIT_FIELDS[normalizeTimeSmallestUnit(smallestUnit)];
   if (!fields) return false;
   return fields.some((f) => timeRecord[f]);
}

// ── Calendar date parsing / formatting ───────────────────────────────────────
// Accepts: YYYY-MM-DD
/**
 * @param {string} str
 * @returns {CalendarDateRecord|null} null on parse failure (does not throw)
 */
const CALENDAR_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export function parseCalendarDate(str) {
   if (!str) return null;
   const s = str.trim();
   // Anchor the shape: PlainDate.from would otherwise leniently truncate a
   // full datetime ("2026-02-09T14:30:00") down to its date.
   if (!CALENDAR_DATE_REGEX.test(s)) return null;
   try {
      return dateToRecord(Temporal.PlainDate.from(s));
   } catch {
      return null;
   }
}

/**
 * @param {CalendarDateRecord|null|undefined} d
 * @returns {string} "YYYY-MM-DD" or "" if d is falsy
 * @throws {RangeError} if the record contains out-of-range fields
 */
export function formatCalendarDate(d) {
   if (!d) return "";
   return recordToPlainDate(d).toString();
}

// ── Ordinal date parsing / formatting ────────────────────────────────────────
// Accepts: YYYY-DDD
/**
 * @param {string} str
 * @returns {OrdinalDateRecord|null} null on parse failure
 */
export function parseOrdinalDate(str) {
   if (!str) return null;
   const m = str.trim().match(/^(\d{4})-(\d{3})$/);
   if (!m) return null;
   const year = parseInt(m[1], 10);
   const dayOfYear = parseInt(m[2], 10);
   if (dayOfYear < 1 || dayOfYear > daysInYear(year)) return null;
   return { year, dayOfYear };
}

/**
 * @param {OrdinalDateRecord|null|undefined} d
 * @returns {string} "YYYY-DDD" (zero-padded) or "" if d is falsy
 * @throws {RangeError} if dayOfYear is invalid for the year
 */
export function formatOrdinalDate(d) {
   if (!d) return "";
   const max = daysInYear(d.year);
   if (d.dayOfYear < 1 || d.dayOfYear > max) {
      throw new RangeError(
         `formatOrdinalDate: dayOfYear=${d.dayOfYear} invalid for year=${d.year} (${max} days)`,
      );
   }
   const yyyy = String(d.year).padStart(4, "0");
   const ddd = String(d.dayOfYear).padStart(3, "0");
   return `${yyyy}-${ddd}`;
}

// ── Duration parsing / formatting ────────────────────────────────────────────
// Accepts ISO-8601-1 durations EXCLUDING the week designator: PnYnMnDTnHnMnS.
// "P{n}W" is rejected — ISO-8601-1 only permits weeks in isolation, never
// combined with other components, and the package treats that asymmetry as a
// non-feature rather than a partial implementation.

// Anchor for comparing durations that contain calendar units (years/months).
// Temporal.Duration.compare requires a relativeTo when calendar units are
// present because P1Y vs P365D, P1M vs P30D, etc. are anchor-dependent.
// 2000-01-01 is a non-leap-year, non-DST sentinel — picked so the choice is
// stable and explicit rather than implicit.
export const DURATION_COMPARE_ANCHOR = Temporal.PlainDateTime.from(
   "2000-01-01T00:00",
);

// Reject any week designator in the date portion (before the optional T). A
// trailing "W" inside the time portion is impossible per ISO-8601, so the
// pre-T scan is sufficient.
const WEEK_DESIGNATOR_REGEX = /^[+-]?P[^T]*\d+W/i;

/**
 * @param {string} str
 * @returns {DurationRecord|null} null on parse failure or unsupported "W" form
 */
export function parseDuration(str) {
   if (!str) return null;
   const trimmed = str.trim();
   if (WEEK_DESIGNATOR_REGEX.test(trimmed)) return null;
   try {
      const td = Temporal.Duration.from(trimmed);
      return temporalToDurationRecord(td);
   } catch {
      return null;
   }
}

/**
 * Render a duration as a canonical ISO-8601 string (e.g. "P1DT2H30M").
 * Used by the group's output slot and shared across the package as the single
 * formatted-duration boundary. An empty duration formats as "PT0S".
 *
 * @param {DurationRecord|Temporal.Duration|null|undefined} d
 * @returns {string}
 */
export function formatDurationHuman(d) {
   if (!d) return "";
   try {
      return Temporal.Duration.from(d).toString();
   } catch {
      return "";
   }
}


// ── Military (NATO single-letter) time zones ─────────────────────────────────
// Fixed UTC offsets only. J ("Juliet") is intentionally excluded — it denotes
// the observer's local time, not a fixed offset.
export const MILITARY_ZONES = Object.freeze({
   A: 1,  B: 2,  C: 3,  D: 4,  E: 5,  F: 6,  G: 7,  H: 8,  I: 9,
   K: 10, L: 11, M: 12,
   N: -1, O: -2, P: -3, Q: -4, R: -5, S: -6, T: -7, U: -8, V: -9,
   W: -10, X: -11, Y: -12,
   Z: 0,
});

/**
 * @param {string} letter A–Z (case-insensitive), excluding J.
 * @returns {number|null} offset hours, or null if not a valid military zone.
 */
export function militaryZoneOffset(letter) {
   if (typeof letter !== "string" || letter.length !== 1) return null;
   const key = letter.toUpperCase();
   return Object.prototype.hasOwnProperty.call(MILITARY_ZONES, key)
      ? MILITARY_ZONES[key]
      : null;
}

const NUMERIC_OFFSET_REGEX = /^([+-])(\d{2}):(\d{2})$/;

/**
 * Parse a zone identifier accepted by nova-input-datetime / nova-clock attributes.
 *
 * Accepted inputs:
 *   - Military single letter (Z, A–Y excluding J), case-insensitive
 *   - Numeric offset "+HH:MM" or "-HH:MM" (with valid HH 00–23, MM 00–59)
 *
 * IANA names ("America/Denver", "Europe/London") are rejected: the library
 * is fixed-offset only, which structurally excludes DST.
 *
 * @param {string} str
 * @returns {string|null} A Temporal-valid zone identifier ("UTC", "+05:00",
 *   "-09:00") or null if `str` is not an accepted zone.
 */
export function parseZone(str) {
   if (typeof str !== "string" || str.length === 0) return null;

   if (str.length === 1) {
      const offset = militaryZoneOffset(str);
      if (offset == null) return null;
      if (offset === 0) return "UTC";
      const sign = offset > 0 ? "+" : "-";
      return `${sign}${String(Math.abs(offset)).padStart(2, "0")}:00`;
   }

   const m = NUMERIC_OFFSET_REGEX.exec(str);
   if (!m) return null;
   const hh = parseInt(m[2], 10);
   const mm = parseInt(m[3], 10);
   if (hh > 23 || mm > 59) return null;
   return `${m[1]}${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

/**
 * Project an Instant into a fixed-offset zone and return its wall-clock
 * fields as a date + time record pair. Used by Instant-canonical components
 * (nova-input-datetime, nova-clock) for segment rendering.
 *
 * @param {Temporal.Instant} instant
 * @param {string} zoneId  Temporal-valid zone identifier (output of parseZone)
 * @returns {{date: Temporal.PlainDate, time: TimeRecord}}
 */
export function instantToZonedRecord(instant, zoneId) {
   const zdt = instant.toZonedDateTimeISO(zoneId);
   return {
      date: zdt.toPlainDate(),
      time: temporalToTimeRecord(zdt),
   };
}

// ── Flexible parsing helpers ──────────────────────────────────────────────────

/**
 * Parse a date string in either calendar (YYYY-MM-DD) or ordinal (YYYY-DDD) form.
 *
 * Ordinal is tried first because YYYY-DDD would otherwise be ambiguous if a
 * caller passed a 3-digit "month" segment.
 *
 * @param {string} str
 * @returns {Temporal.PlainDate|null} null on parse failure
 */
export function parseAnyDate(str) {
   const ord = parseOrdinalDate(str);
   if (ord) {
      return ordinalDateToPlainDate(ord.year, ord.dayOfYear);
   }
   const cal = parseCalendarDate(str);
   if (cal) {
      return Temporal.PlainDate.from(cal);
   }
   return null;
}

/**
 * Parse an ISO 8601 datetime string into a `Temporal.Instant`.
 *
 * Accepted forms:
 *   - Z form:              "2026-02-09T14:30:00Z"
 *   - Numeric offset:      "2026-02-09T14:30:00-05:00"
 *   - Bracketed offset:    "2026-02-09T14:30:00+00:00[UTC]"
 *   - Ordinal Z form:      "2026-040T14:30:00Z"
 *   - Ordinal w/ offset:   "2026-040T14:30:00-05:00"
 *
 * Unzoned input ("2026-02-09T14:30:00", no Z or offset) returns `null` —
 * the library is fixed-offset-only and does not infer a zone.
 *
 * @param {string} str
 * @returns {Temporal.Instant|null}
 */
export function parseAnyDatetime(str) {
   if (!str) return null;

   const isOrdinal = /^\d{4}-\d{3}T/.test(str);
   if (isOrdinal) {
      // Native Temporal.Instant.from doesn't understand YYYY-DDD; convert
      // the ordinal prefix to calendar form and splice back into the
      // original string, leaving the offset/zone suffix intact.
      const tIdx = str.indexOf("T");
      const prefix = str.slice(0, tIdx);
      const suffix = str.slice(tIdx);
      const pd = parseAnyDate(prefix);
      if (!pd) return null;
      try {
         return Temporal.Instant.from(`${pd.toString()}${suffix}`);
      } catch {
         return null;
      }
   }

   try {
      return Temporal.Instant.from(str);
   } catch {
      return null;
   }
}


/**
 * Parse a `min`/`max` constraint string into the Temporal type matching a
 * component's `temporalType`. Throws `RangeError` on parse failure — callers
 * that want to tolerate bad attribute input should catch and route through
 * `reportNovaError`.
 *
 * @param {string} str
 * @param {"Instant"|"PlainDate"|"PlainTime"|"Duration"} temporalType
 * @returns {Temporal.Instant|Temporal.PlainDate|Temporal.PlainTime|Temporal.Duration}
 * @throws {RangeError}
 */
export function parseConstraintByType(str, temporalType) {
   const fail = () => {
      throw new RangeError(
         `parseConstraintByType: cannot parse "${str}" as ${temporalType}`,
      );
   };
   switch (temporalType) {
      case "Instant": {
         const inst = parseAnyDatetime(str);
         if (!inst) fail();
         return inst;
      }
      case "PlainDate": {
         const pd = parseAnyDate(str);
         if (!pd) fail();
         return pd;
      }
      case "PlainTime": {
         const t = parseTime(str);
         if (!t) fail();
         return Temporal.PlainTime.from(t);
      }
      case "Duration": {
         const d = parseDuration(str);
         if (!d) fail();
         return Temporal.Duration.from(d);
      }
      default:
         throw new RangeError(
            `parseConstraintByType: unknown temporalType "${temporalType}"`,
         );
   }
}

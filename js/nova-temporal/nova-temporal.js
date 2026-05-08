/**
 * nova-temporal.js — Temporal utility module for Nova datetime components
 *
 * Requires the Temporal API (Chrome 137+, Firefox 139+).
 * For older browsers, use a Temporal polyfill.
 *
 * Pure functions: parsing, formatting, validation, conversion.
 * Nanosecond precision throughout.
 */

import { reportNovaError } from "./nova-temporal-errors.js";

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
 * Convert a Temporal.PlainTime or Temporal.PlainDateTime to a plain time record.
 *
 * @param {Temporal.PlainTime|Temporal.PlainDateTime} t
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

/** @param {DurationRecord} d @returns {Temporal.Duration} */
function recordToDuration(d) {
   return Temporal.Duration.from(d);
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
export function parseCalendarDate(str) {
   if (!str) return null;
   try {
      return dateToRecord(Temporal.PlainDate.from(str.trim()));
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

/**
 * @param {number} year
 * @param {number} month  - 1-12
 * @param {number} day    - clamped to [1, daysInMonth]
 * @returns {number}
 */
export function clampDay(year, month, day) {
   const max = daysInMonth(year, month);
   return Math.max(1, Math.min(day, max));
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
 * @param {DurationRecord|null|undefined} d
 * @param {DurationSmallestUnit} [smallestUnit="second"]
 * @returns {string} ISO 8601 duration ("PT…") or "" if d is falsy
 */
export function formatDuration(d, smallestUnit = "second") {
   if (!d) return "";
   const td = recordToDuration(d);
   const unit = String(smallestUnit || "second").replace(/s$/, "");
   const opts = {
      second: undefined,
      millisecond: { fractionalSecondDigits: 3 },
      microsecond: { fractionalSecondDigits: 6 },
      nanosecond: { fractionalSecondDigits: 9 },
   };
   return td.toString(opts[unit]);
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

// ── Now (UTC) ────────────────────────────────────────────────────────────────
/**
 * Current wall-clock time in UTC. The library is UTC-only by design — the
 * backend (Python/telemetry) is the source of truth and stores everything
 * as UTC, so widgets read and write UTC without offset conversion.
 *
 * @returns {Temporal.PlainDateTime}
 */
export function nowUTC() {
   return Temporal.Now.plainDateTimeISO("UTC");
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
 * Parse a datetime string in any well-formed ISO 8601 form and normalize to UTC.
 *
 * Accepts:
 *  - Zoned: `2026-02-09T14:30:00Z`, `2026-02-09T14:30:00-05:00`, `2026-02-09T14:30:00+00:00[UTC]`
 *  - Unzoned: `2026-02-09T14:30:00` (treated as UTC by convention)
 *  - Ordinal: `2026-040T14:30:00Z` and unzoned ordinal forms
 *
 * @param {string} str
 * @returns {{date: Temporal.PlainDate, time: TimeRecord}|null} null on parse failure
 */
export function parseAnyDatetime(str) {
   if (!str) return null;

   // Offset-bearing calendar-date strings (Z, ±HH:MM, [zone]) route through
   // Instant.from for native UTC normalization. Ordinal-date forms
   // (YYYY-DDDT…) are not understood by Instant.from and always go through
   // the T-split path. Non-offset strings go straight to T-split. Real
   // Instant errors on offset-bearing calendar input surface here rather
   // than silently routing through the fallback parser.
   const isOrdinal = /^\d{4}-\d{3}T/.test(str);
   const hasOffsetOrZone = /[Zz]$|[+-]\d\d:?\d\d(?:\b|\[)|\[[^\]]+\]$/.test(str);

   if (!isOrdinal && hasOffsetOrZone) {
      try {
         const inst = Temporal.Instant.from(str);
         const pdt = inst.toZonedDateTimeISO("UTC").toPlainDateTime();
         return {
            date: pdt.toPlainDate(),
            time: temporalToTimeRecord(pdt),
         };
      } catch (e) {
         reportNovaError(
            null,
            "datetime-parse-error",
            `Failed to parse offset-bearing datetime "${str}"`,
            { input: str, error: e },
         );
         return null;
      }
   }

   const tIdx = str.indexOf("T");
   if (tIdx < 0) return null;

   const datePart = str.slice(0, tIdx);
   const timePart = str.slice(tIdx + 1);

   const date = parseAnyDate(datePart);
   if (!date) return null;

   const time = parseTime(timePart);
   if (!time) return null;

   return { date, time };
}

/**
 * Extract a time record from either a bare time string or a full datetime
 * string (splitting on `T`).
 *
 * @param {string} str
 * @returns {TimeRecord|null} null on parse failure
 */
export function parseTimeFlexible(str) {
   const direct = parseTime(str);
   if (direct) return direct;
   const tIdx = str.indexOf("T");
   if (tIdx > 0) return parseTime(str.slice(tIdx + 1));
   return null;
}

/**
 * Parse a `min`/`max` constraint string into the Temporal type matching a
 * component's `temporalType`. Throws `RangeError` on parse failure — callers
 * that want to tolerate bad attribute input should catch and route through
 * `reportNovaError`.
 *
 * @param {string} str
 * @param {"PlainDateTime"|"PlainDate"|"PlainTime"|"Duration"} temporalType
 * @returns {Temporal.PlainDateTime|Temporal.PlainDate|Temporal.PlainTime|Temporal.Duration}
 * @throws {RangeError}
 */
export function parseConstraintByType(str, temporalType) {
   const fail = () => {
      throw new RangeError(
         `parseConstraintByType: cannot parse "${str}" as ${temporalType}`,
      );
   };
   switch (temporalType) {
      case "PlainDateTime": {
         const parsed = parseAnyDatetime(str);
         if (!parsed) fail();
         return parsed.date.toPlainDateTime(parsed.time);
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

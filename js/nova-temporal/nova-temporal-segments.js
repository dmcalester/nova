/**
 * nova-temporal-segments.js — Shared segment descriptors for temporal components
 *
 * Single source of truth for segment definitions used by nova-date, nova-time,
 * nova-ordinal-date, and nova-datetime.
 */

import {
   daysInMonth,
   daysInYear,
   normalizeTimeSmallestUnit,
} from "./nova-temporal.js";

/**
 * @typedef {import("../nova-segment-types.js").SegmentDescriptor} SegmentDescriptor
 * @typedef {import("../nova-segment-types.js").SegmentSeparator} SegmentSeparator
 */

// ── Calendar date descriptors (YYYY-MM-DD) ──────────────────────────────────

// Read on access so a long-running console picks up the new year after UTC
// midnight instead of staying frozen to the year at module load.
const currentYearUTC = () => Temporal.Now.plainDateISO("UTC").year;

export const CALENDAR_DATE_DESCRIPTORS = [
   {
      name: "year",
      label: "Year",
      min: 1,
      max: 9999,
      pad: 4,
      get default() {
         return currentYearUTC();
      },
   },
   { name: "month", label: "Month", min: 1, max: 12, pad: 2, wrap: true },
   { name: "day", label: "Day", min: 1, max: 31, pad: 2, wrap: true },
];

export const CALENDAR_DATE_SEPARATORS = ["-", "-"];

// ── Ordinal date descriptors (YYYY-DDD) ─────────────────────────────────────

export const YEAR_DESCRIPTOR = {
   name: "year",
   label: "Year",
   min: 1,
   max: 9999,
   pad: 4,
   get default() {
      return currentYearUTC();
   },
};
export const DAY_OF_YEAR_DESCRIPTOR = {
   name: "dayOfYear",
   label: "Day of Year",
   min: 1,
   max: 366,
   pad: 3,
   wrap: true,
};

export const ORDINAL_DATE_DESCRIPTORS = [
   YEAR_DESCRIPTOR,
   DAY_OF_YEAR_DESCRIPTOR,
];

// ── Time descriptors ────────────────────────────────────────────────────────

export const TIME_SMALLEST_UNIT_SEGMENTS = {
   minute: ["hour", "minute"],
   second: ["hour", "minute", "second"],
   millisecond: ["hour", "minute", "second", "ms"],
   microsecond: ["hour", "minute", "second", "ms", "us"],
   nanosecond: ["hour", "minute", "second", "ms", "us", "ns"],
};

export const ALL_TIME_DESCRIPTORS = [
   {
      name: "hour",
      field: "hour",
      label: "Hours",
      min: 0,
      max: 23,
      pad: 2,
      wrap: true,
   },
   {
      name: "minute",
      field: "minute",
      label: "Minutes",
      min: 0,
      max: 59,
      pad: 2,
      wrap: true,
   },
   {
      name: "second",
      field: "second",
      label: "Seconds",
      min: 0,
      max: 59,
      pad: 2,
      wrap: true,
   },
   {
      name: "ms",
      field: "millisecond",
      label: "Milliseconds",
      min: 0,
      max: 999,
      pad: 3,
      wrap: true,
   },
   {
      name: "us",
      field: "microsecond",
      label: "Microseconds",
      min: 0,
      max: 999,
      pad: 3,
      wrap: true,
   },
   {
      name: "ns",
      field: "nanosecond",
      label: "Nanoseconds",
      min: 0,
      max: 999,
      pad: 3,
      wrap: true,
   },
];

const TIME_FIELD_BY_NAME = Object.freeze(
   Object.fromEntries(ALL_TIME_DESCRIPTORS.map((d) => [d.name, d.field])),
);

// ── Duration descriptors ────────────────────────────────────────────────────

export const DURATION_UNIT_ORDER = [
   "year",
   "month",
   "week",
   "day",
   "hour",
   "minute",
   "second",
   "millisecond",
   "microsecond",
   "nanosecond",
];

const DURATION_DESCRIPTOR_NAME_BY_UNIT = Object.freeze({
   year: "years",
   month: "months",
   week: "weeks",
   day: "days",
   hour: "hours",
   minute: "minutes",
   second: "seconds",
   millisecond: "ms",
   microsecond: "us",
   nanosecond: "ns",
});

export const DURATION_FIELD_BY_UNIT = Object.freeze({
   year: "years",
   month: "months",
   week: "weeks",
   day: "days",
   hour: "hours",
   minute: "minutes",
   second: "seconds",
   millisecond: "milliseconds",
   microsecond: "microseconds",
   nanosecond: "nanoseconds",
});

export function normalizeDurationUnit(unit, fallback) {
   const raw = unit || fallback;
   const normalized = String(raw || "").trim().toLowerCase();
   const singular = normalized.endsWith("s")
      ? normalized.slice(0, -1)
      : normalized;
   if (DURATION_UNIT_ORDER.includes(singular)) return singular;
   throw new RangeError(`Invalid duration unit "${raw}"`);
}

// Default pad/max widths follow the satops elapsed-time convention (NASA
// MET/GET lineage): only the largest visible unit overflows. Days get 3
// digits (the DDD/HH:MM:SS pattern); year/month/week and hour/minute/second
// stay at their natural 2-digit width. Authors who need to widen the largest
// visible unit pass `largest-unit-digits` to <nova-duration>, which threads
// through to buildDurationDescriptors below.
export const ALL_DURATION_DESCRIPTORS = [
   {
      name: "years",
      field: "years",
      label: "Years",
      min: 0,
      max: 99,
      pad: 2,
      labelAfter: "y",
   },
   {
      name: "months",
      field: "months",
      label: "Months",
      min: 0,
      max: 99,
      pad: 2,
      labelAfter: "mo",
   },
   {
      name: "weeks",
      field: "weeks",
      label: "Weeks",
      min: 0,
      max: 99,
      pad: 2,
      labelAfter: "w",
   },
   {
      name: "days",
      field: "days",
      label: "Days",
      min: 0,
      max: 999,
      pad: 3,
      labelAfter: "d",
   },
   {
      name: "hours",
      field: "hours",
      label: "Hours",
      min: 0,
      max: 99,
      pad: 2,
      labelAfter: "h",
   },
   {
      name: "minutes",
      field: "minutes",
      label: "Minutes",
      min: 0,
      max: 99,
      pad: 2,
      labelAfter: "m",
   },
   {
      name: "seconds",
      field: "seconds",
      label: "Seconds",
      min: 0,
      max: 99,
      pad: 2,
      labelAfter: "s",
   },
   {
      name: "ms",
      field: "milliseconds",
      label: "Milliseconds",
      min: 0,
      max: 999,
      pad: 3,
      wrap: true,
      labelAfter: "ms",
   },
   {
      name: "us",
      field: "microseconds",
      label: "Microseconds",
      min: 0,
      max: 999,
      pad: 3,
      wrap: true,
      labelAfter: "us",
   },
   {
      name: "ns",
      field: "nanoseconds",
      label: "Nanoseconds",
      min: 0,
      max: 999,
      pad: 3,
      wrap: true,
      labelAfter: "ns",
   },
];

const MAX_LARGEST_UNIT_DIGITS = 9;

/**
 * Build duration descriptors and separators for a visible unit window.
 * Descriptors are cloned so subclasses can mutate per-instance fields
 * (e.g. extraClass) without polluting the shared module-level constants.
 *
 * `largestUnitDigits` widens the head (largest) descriptor's pad and max so
 * a single unit can carry overflow that would otherwise require a unit above
 * it (e.g. 4-digit days for missions that exceed 999 elapsed days). Narrower
 * than the natural pad is rejected to avoid silent truncation.
 *
 * @param {string} [largestUnit="day"]
 * @param {string} [smallestUnit="second"]
 * @param {{largestUnitDigits?: number|string|null}} [opts]
 * @returns {{descriptors: SegmentDescriptor[], separators: SegmentSeparator[], largest: string, smallest: string}}
 */
export function buildDurationDescriptors(
   largestUnit = "day",
   smallestUnit = "second",
   { largestUnitDigits } = {},
) {
   const largest = normalizeDurationUnit(largestUnit, "day");
   const smallest = normalizeDurationUnit(smallestUnit, "second");
   const largestIndex = DURATION_UNIT_ORDER.indexOf(largest);
   const smallestIndex = DURATION_UNIT_ORDER.indexOf(smallest);
   if (largestIndex > smallestIndex) {
      throw new RangeError(
         `largest-unit="${largest}" must not be smaller than smallest-unit="${smallest}"`,
      );
   }
   const names = DURATION_UNIT_ORDER.slice(largestIndex, smallestIndex + 1).map(
      (unit) => DURATION_DESCRIPTOR_NAME_BY_UNIT[unit],
   );
   const descriptors = ALL_DURATION_DESCRIPTORS.filter((d) =>
      names.includes(d.name),
   ).map((d) => ({ ...d }));

   if (largestUnitDigits != null && largestUnitDigits !== "") {
      const n = Number(largestUnitDigits);
      if (!Number.isInteger(n) || n < 1 || n > MAX_LARGEST_UNIT_DIGITS) {
         throw new RangeError(
            `largest-unit-digits must be an integer between 1 and ${MAX_LARGEST_UNIT_DIGITS} (got ${largestUnitDigits})`,
         );
      }
      const head = descriptors[0];
      if (n < head.pad) {
         throw new RangeError(
            `largest-unit-digits=${n} is narrower than the natural width (${head.pad}) of "${head.name}"; use a value ≥ ${head.pad}`,
         );
      }
      head.pad = n;
      head.max = 10 ** n - 1;
   }

   return { descriptors, separators: [], largest, smallest };
}

const SUB_SECOND = new Set(["ms", "us", "ns"]);

/**
 * Build time descriptors and separators for a given smallest unit.
 *
 * For time components, sub-second segments (ms, us) get a gap class
 * to add spacing after the digits (since there's no labelAfter).
 *
 * @param {import("./nova-temporal.js").TimeSmallestUnit} smallestUnit
 * @returns {{descriptors: SegmentDescriptor[], separators: SegmentSeparator[]}}
 */
export function buildTimeDescriptors(smallestUnit) {
   const unit = normalizeTimeSmallestUnit(smallestUnit || "second");
   const names = TIME_SMALLEST_UNIT_SEGMENTS[unit];
   const descriptors = ALL_TIME_DESCRIPTORS.filter((d) =>
      names.includes(d.name),
   ).map((d) => ({ ...d }));

   // Add gap after sub-second digits (except the last segment)
   for (let i = 0; i < descriptors.length - 1; i++) {
      if (SUB_SECOND.has(descriptors[i].name)) {
         descriptors[i].extraClass = "subsecond-gap";
      }
   }

   const separators = [];
   for (let i = 0; i < descriptors.length - 1; i++) {
      const curr = descriptors[i].name;
      if (curr === "hour" || curr === "minute") separators.push(":");
      else if (curr === "second") separators.push(".");
      else separators.push("");
   }

   return { descriptors, separators };
}

// ── Day clamping helpers ────────────────────────────────────────────────────

/**
 * Clamp calendar day when year or month changes.
 * Called as a hook after a segment value changes; no-ops for any segment
 * other than year or month.
 *
 * @param {(name: string) => number} getValueByName
 * @param {(name: string, value: number, skipRender?: boolean) => void} setValueByName
 * @param {string} changedSegment - name of the segment that just changed
 * @returns {void}
 */
export function clampCalendarDay(
   getValueByName,
   setValueByName,
   changedSegment,
) {
   if (changedSegment !== "year" && changedSegment !== "month") return;
   const year = getValueByName("year");
   const month = getValueByName("month");
   const day = getValueByName("day");
   const maxDay = daysInMonth(year, month);
   if (day > maxDay) {
      setValueByName("day", maxDay, true);
   }
}

/**
 * Clamp ordinal day-of-year when year changes (handles leap-year transitions).
 *
 * @param {(name: string) => number} getValueByName
 * @param {(name: string, value: number, skipRender?: boolean) => void} setValueByName
 * @param {string} changedSegment
 * @returns {void}
 */
export function clampOrdinalDay(
   getValueByName,
   setValueByName,
   changedSegment,
) {
   if (changedSegment !== "year") return;
   const year = getValueByName("year");
   const dayOfYear = getValueByName("dayOfYear");
   const maxDay = daysInYear(year);
   if (dayOfYear > maxDay) {
      setValueByName("dayOfYear", maxDay, true);
   }
}

/**
 * Get the effective maximum for `day` or `dayOfYear` segments based on the
 * current year/month. Falls back to `desc.max` for any other segment or when
 * the supporting fields are not yet usable (e.g. year is 0 during entry).
 *
 * @param {string} name
 * @param {SegmentDescriptor} desc
 * @param {(name: string) => number} getValueByName
 * @returns {number}
 */
export function getEffectiveDayMax(name, desc, getValueByName) {
   if (name === "day") {
      const year = getValueByName("year");
      const month = getValueByName("month");
      if (year >= 1 && month >= 1 && month <= 12) {
         return daysInMonth(year, month);
      }
   }
   if (name === "dayOfYear") {
      const year = getValueByName("year");
      if (year >= 1) {
         return daysInYear(year);
      }
   }
   return desc.max;
}

// ── Time segment helpers ────────────────────────────────────────────────────

/**
 * Build a full time record from segment values, filling fields the current
 * smallest unit doesn't expose (e.g. nanoseconds when smallest-unit is
 * "second") with zero. The downstream formatter trims whatever it doesn't
 * need, so the caller doesn't have to track which fields are active.
 *
 * @param {(name: string) => number} getValueByName
 * @returns {import("./nova-temporal.js").TimeRecord}
 */
export function buildTimeRecordFromSegments(getValueByName) {
   const t = {};
   for (const d of ALL_TIME_DESCRIPTORS) {
      t[d.field] = getValueByName(d.name) || 0;
   }
   return t;
}

/**
 * Extract segment values from a parsed time record in the order required
 * by the active smallest unit. Missing fields default to 0.
 *
 * @param {import("./nova-temporal.js").TimeRecord} parsedTime
 * @param {import("./nova-temporal.js").TimeSmallestUnit} smallestUnit
 * @returns {number[]} values in the order matching buildTimeDescriptors(smallestUnit)
 */
export function timeToSegmentValues(parsedTime, smallestUnit) {
   const unit = normalizeTimeSmallestUnit(smallestUnit || "second");
   const names = TIME_SMALLEST_UNIT_SEGMENTS[unit];
   return names.map((name) => parsedTime[TIME_FIELD_BY_NAME[name]] ?? 0);
}

/**
 * nova-temporal — Temporal input components
 *
 * This module exports all temporal components for use in applications.
 * Import this file to register all custom elements.
 */

// Core utilities
export {
   ordinalDateToPlainDate,
   parseOrdinalDate,
   formatOrdinalDate,
   formatDurationHuman,
} from "./nova-temporal.js";

// Segment descriptors
export {
   YEAR_DESCRIPTOR,
   DAY_OF_YEAR_DESCRIPTOR,
   CALENDAR_DATE_DESCRIPTORS,
   CALENDAR_DATE_SEPARATORS,
   ORDINAL_DATE_DESCRIPTORS,
   ALL_TIME_DESCRIPTORS,
   TIME_SMALLEST_UNIT_SEGMENTS,
   ALL_DURATION_DESCRIPTORS,
   DURATION_UNIT_ORDER,
   DURATION_FIELD_BY_UNIT,
   buildTimeDescriptors,
   buildDurationDescriptors,
   clampCalendarDay,
   clampOrdinalDay,
   getEffectiveDayMax,
   buildTimeRecordFromSegments,
   timeToSegmentValues,
} from "./nova-temporal-segments.js";

// Base classes
export { NovaSegmentInputBase } from "../nova-segment-input-base.js";
export { NovaTemporalInputBase } from "./nova-temporal-input-base.js";

// Components (importing registers the custom elements)
export { NovaDate } from "./nova-date.js";
export { NovaTime } from "./nova-time.js";
export { NovaOrdinalDate } from "./nova-ordinal-date.js";
export { NovaDuration } from "./nova-duration.js";
export { NovaDatetime } from "./nova-datetime.js";
export { NovaTemporalGroup } from "./nova-temporal-group.js";
export { NovaClock } from "./nova-clock.js";
export { NovaElapsed } from "./nova-elapsed.js";

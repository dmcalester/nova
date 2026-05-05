/**
 * NovaTemporalInputBase — adds the Temporal-typed-value contract on top of
 * NovaSegmentInputBase.
 *
 * Provides the public `temporal` getter/setter, `temporalType` (static and
 * instance), and the `_toTemporal` / `_formatTemporal` protected hooks that
 * concrete temporal widgets (nova-time, nova-date, nova-datetime,
 * nova-ordinal-date, nova-duration) implement.
 *
 * Generic segmented inputs (e.g. a future nova-tle) should extend
 * NovaSegmentInputBase directly and skip this layer.
 */

import { NovaSegmentInputBase } from "../nova-segment-input-base.js";

/**
 * @typedef {"PlainDateTime"|"PlainDate"|"PlainTime"|"Duration"|null} TemporalTypeName
 */

export class NovaTemporalInputBase extends NovaSegmentInputBase {
   /**
    * Temporal type identifier for interface contract.
    * Subclasses override with one of:
    *   'PlainDateTime' | 'PlainDate' | 'PlainTime' | 'Duration'
    *
    * @returns {TemporalTypeName}
    */
   static get temporalType() {
      return null;
   }

   /**
    * Get the current value as a Temporal object.
    *
    * For datetime components this is `Temporal.PlainDateTime` interpreted as
    * UTC wall-clock time *by convention* — the library enforces UTC at the
    * value boundary, but the type itself carries no timezone. Reading
    * wall-clock fields (`.year`, `.hour`, …) returns the UTC values as
    * expected.
    *
    * **Footgun:** do not call `.toZonedDateTime(nonUTC)` on the result. That
    * interprets the wall-clock fields *as if* they were already in the target
    * zone, producing the wrong instant. If you need an instant in a specific
    * zone, parse from `.value` instead:
    *   `Temporal.Instant.from(el.value).toZonedDateTimeISO('zone')`.
    *
    * Returns `null` if the value is empty or — for `<nova-ordinal-date>` in
    * day-only mode — if the component cannot produce a Temporal value at all.
    *
    * @returns {Temporal.PlainDateTime|Temporal.PlainDate|Temporal.PlainTime|Temporal.Duration|null}
    */
   get temporal() {
      if (this.isEmpty) return null;
      try {
         return this._toTemporal();
      } catch {
         return null;
      }
   }

   /**
    * Public formatter contract: format a Temporal object to this component's
    * external value string. Group wrappers should use this method instead of
    * private subclass internals.
    *
    * @param {Temporal.PlainDateTime|Temporal.PlainDate|Temporal.PlainTime|Temporal.Duration} t
    * @returns {string}
    */
   formatTemporal(t) {
      return this._formatTemporal(t);
   }

   /**
    * Set the value from a Temporal object. Accepts an instance of the
    * component's expected `temporalType`, or `null` to clear.
    *
    * @throws {TypeError} If `t` is not the expected Temporal type, or if the
    *   component is in a configuration that cannot hold a Temporal value
    *   (e.g. <nova-ordinal-date> in day-only mode).
    */
   set temporal(t) {
      if (t == null) {
         this.value = "";
         return;
      }
      const expected = this.temporalType;
      const tag = this.tagName.toLowerCase();
      if (expected == null) {
         throw new TypeError(
            `${tag}.temporal: this component cannot hold a Temporal value in its current configuration. Set .value (or change configuration) instead.`,
         );
      }
      const expectedCtor = Temporal[expected];
      if (!(t instanceof expectedCtor)) {
         const got = t?.constructor?.name ?? typeof t;
         throw new TypeError(
            `${tag}.temporal: expected Temporal.${expected} or null, got ${got}`,
         );
      }
      this.value = this.formatTemporal(t);
   }

   /**
    * Contract: convert the current segment values to a Temporal object.
    * Subclasses must override. Return `null` when the current configuration
    * cannot produce a Temporal value (e.g. day-only ordinal date).
    *
    * @returns {Temporal.PlainDateTime|Temporal.PlainDate|Temporal.PlainTime|Temporal.Duration|null}
    */
   _toTemporal() {
      return null;
   }

   /**
    * Contract: format a Temporal object to the component's external value
    * string (the same format `formattedValue` produces). Subclasses must
    * override.
    *
    * @param {Temporal.PlainDateTime|Temporal.PlainDate|Temporal.PlainTime|Temporal.Duration} _t
    * @returns {string}
    */
   _formatTemporal(_t) {
      return "";
   }

   /**
    * Instance-level temporal type. Subclasses may override to narrow the
    * static class-level type per instance (e.g. nova-ordinal-date returns
    * null in day-only mode).
    *
    * @returns {TemporalTypeName}
    */
   get temporalType() {
      return this.constructor.temporalType;
   }
}

/**
 * NovaTemporalInputBase — adds the Temporal-typed-value contract on top of
 * NovaSegmentInputBase.
 *
 * Provides the public `temporal` getter/setter, `temporalType` (static and
 * instance), and the `_toTemporal` / `_formatTemporal` protected hooks that
 * concrete temporal widgets (nova-datetime, nova-ordinal-date,
 * nova-duration) implement.
 *
 * Generic segmented inputs (e.g. a future nova-tle) should extend
 * NovaSegmentInputBase directly and skip this layer.
 */

import { NovaSegmentInputBase } from "../nova-segment-input-base.js";
import { reportNovaError } from "./nova-temporal-errors.js";

/**
 * @typedef {"Instant"|"PlainDate"|"PlainTime"|"Duration"|null} TemporalTypeName
 */

export class NovaTemporalInputBase extends NovaSegmentInputBase {
   /**
    * Temporal type identifier for interface contract.
    * Subclasses override with one of:
    *   'Instant' | 'PlainDate' | 'PlainTime' | 'Duration'
    *
    * @returns {TemporalTypeName}
    */
   static get temporalType() {
      return null;
   }

   /**
    * Get the current value as a Temporal object.
    *
    * Per-subclass type:
    *   <nova-datetime>     → Temporal.Instant
    *   <nova-ordinal-date> → Temporal.PlainDate
    *   <nova-duration>     → Temporal.Duration
    *
    * Returns `null` when empty, or — for <nova-ordinal-date> in day-only mode
    * — when the component cannot produce a Temporal value at all.
    *
    * @returns {Temporal.Instant|Temporal.PlainDate|Temporal.PlainTime|Temporal.Duration|null}
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
    * @param {Temporal.Instant|Temporal.PlainDate|Temporal.PlainTime|Temporal.Duration} t
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
    * @returns {Temporal.Instant|Temporal.PlainDate|Temporal.PlainTime|Temporal.Duration|null}
    */
   _toTemporal() {
      return null;
   }

   /**
    * Contract: format a Temporal object to the component's external value
    * string (the same format `formattedValue` produces). Subclasses must
    * override.
    *
    * @param {Temporal.Instant|Temporal.PlainDate|Temporal.PlainTime|Temporal.Duration} _t
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

   /**
    * Strict paste hook shared by every temporal input: parse in native-only
    * mode (`parseAndSet(str, true)`) and swallow failures, since a paste must
    * not throw. Overrides the no-op default in NovaSegmentInputBase.
    *
    * @param {string} str
    */
   _parseStrictValue(str) {
      try {
         this.parseAndSet(str, true);
      } catch {
         // Paste failed — leave segments unchanged
      }
   }

   /**
    * Compare two formatted values through a parser and a Temporal comparator,
    * returning `null` when either fails to parse. Centralizes the
    * parse → null-check → compare skeleton that the date/time/datetime inputs
    * share; the base's min/max validation treats `null` as "incomparable".
    *
    * @param {string} a
    * @param {string} b
    * @param {(s: string) => unknown} parse maps a value string to a Temporal-ish operand
    * @param {(x: unknown, y: unknown) => number} compare e.g. `Temporal.PlainDate.compare`
    * @returns {number|null}
    */
   _compareParsed(a, b, parse, compare) {
      const pa = parse(a);
      const pb = parse(b);
      if (!pa || !pb) return null;
      return compare(pa, pb);
   }

   /**
    * Dispatch the shared `precision-truncated` event. Detail uses flat keys
    * `{ smallestUnit, input, parsedRecord }`. Only inputs that expose a
    * `smallestUnit` getter (nova-datetime) emit this.
    *
    * @param {string} input the original string that carried excess precision
    * @param {object} parsedRecord the fully-parsed time record (pre-truncation)
    */
   _emitPrecisionTruncated(input, parsedRecord) {
      this.dispatchEvent(
         new CustomEvent("precision-truncated", {
            detail: { smallestUnit: this.smallestUnit, input, parsedRecord },
            bubbles: true,
            composed: true,
         }),
      );
   }

   /**
    * Dispatch a `nova-error` event so the host app can decide what to show
    * (toast, alert, log, telemetry). Hosts that want the v1 alert behavior
    * can listen and call `alert()` themselves.
    *
    * The message is type-specific: a `range` paste parsed successfully but
    * fell outside the field's min/max, so it must not be described as
    * malformed.
    *
    * @param {'parse-error'|'range'} type
    * @param {string} text
    */
   _onPasteError(type, text) {
      const message =
         type === "range"
            ? `Pasted value is out of range: "${text}"`
            : `Pasted text is malformed: "${text}"`;
      reportNovaError(this, `paste-${type}`, message, { text });
      // user-invalid validity already holds from the failed parse / range check
   }
}

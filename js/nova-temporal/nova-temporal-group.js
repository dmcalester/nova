/**
 * <nova-temporal-group> — Generic coordination wrapper for temporal components
 *
 * Form-associated custom element that coordinates multiple temporal inputs
 * (nova-datetime, nova-date, nova-ordinal-date, nova-time) and duration inputs (nova-duration).
 * Provides group-level validation and computed output.
 *
 * Slots:
 *   t0, t1, t2, ... — temporal inputs (any nova-datetime, nova-date, nova-ordinal-date, nova-time)
 *   d0, d1, d2, ... — duration inputs (nova-duration)
 *   output         — computed output display
 *   (label slots)  — t0-label, t1-label, d0-label, etc.
 *
 * Mode inference:
 *   - Only t[N] slots → range mode (output: duration between t0 and t1)
 *   - Has d[N] slots → compute mode (output: computed temporal)
 *
 * Type compatibility:
 *   - PlainDateTime family: nova-datetime
 *   - PlainDate family: nova-date, nova-ordinal-date
 *   - PlainTime family: nova-time
 *   - Duration: nova-duration
 *   - Mixing within PlainDate family is allowed
 *   - Cross-family mixing produces a warning
 *
 * Attributes:
 *   disabled       — propagates to all children
 *   readonly       — propagates to all children
 *   required       — group requires valid output
 *   name           — form field name
 *   min            — minimum constraint (duration in range mode, datetime in compute mode)
 *   max            — maximum constraint (duration in range mode, datetime in compute mode)
 *   output-format  — controls the string written to the output slot and submitted
 *                    as the `output` FormData entry. Endpoints are always
 *                    submitted individually (t0/t1/…, d0/…) regardless of format.
 *                      duration       — ISO duration between endpoints (range default)
 *                                       or sum of durations (compute mode)
 *                      end            — last temporal (range mode) or computed
 *                                       temporal (compute default)
 *                      interval       — ISO 8601 `<start>/<end>`
 *                      start-duration — ISO 8601 `<start>/<duration>`
 *                      duration-end   — ISO 8601 `<duration>/<end>`
 */

import { createNovaInputStyleSheets } from "../nova-stylesheets.js";
import {
   DURATION_COMPARE_ANCHOR,
   formatDurationHuman,
   parseConstraintByType,
   parseDuration,
} from "./nova-temporal.js";
import { reportNovaError } from "./nova-temporal-errors.js";

// ── Type compatibility ────────────────────────────────────────────────────────

/**
 * @typedef {"datetime"|"date"|"time"|"duration"} TemporalFamily
 */

/**
 * @typedef {"range"|"compute"|null} GroupMode
 */

/**
 * @typedef {"duration"|"end"|"interval"|"start-duration"|"duration-end"} OutputFormat
 */

const OUTPUT_FORMATS = new Set([
   "duration",
   "end",
   "interval",
   "start-duration",
   "duration-end",
]);

const DEFAULT_OUTPUT_FORMAT = {
   range: "duration",
   compute: "end",
};

/**
 * @typedef {Object} GroupValidationResult
 * @property {boolean} valid
 * @property {ValidityStateFlags} [flags]
 * @property {string} [message]
 */

const TYPE_FAMILY = {
   Instant: "datetime",
   PlainDateTime: "datetime",
   PlainDate: "date",
   PlainTime: "time",
   Duration: "duration",
};

/**
 * @param {string} temporalType
 * @returns {TemporalFamily|null}
 */
function getTypeFamily(temporalType) {
   return TYPE_FAMILY[temporalType] || null;
}

// ── Stylesheet ────────────────────────────────────────────────────────────────

// ── Component stylesheet ─────────────────────────────────────────────────────
//
// Host-level cursor/interaction states (disabled, readonly) are inherited from
// novaInputStatesSheet via createNovaInputStyleSheets(). This sheet handles
// only what is unique to this component: grid layout, slot styling, and visual
// chrome applied directly to :host (this component IS the visible input box,
// unlike nova-segment-input-base which uses an inner .segments-area wrapper).
//
const groupSheet = new CSSStyleSheet();
groupSheet.replaceSync(`
  :host {
    display: inline-grid;
    grid-template-columns: auto 1fr;
    font-size: var(--font-size);
    overflow: hidden;

    background-color: var(--group-border-color);
    border-style: solid;
    border-width: var(--group-border-width);
    border-color: var(--group-border-color);
    border-radius: var(--group-border-radius);
    padding: 0;

    transition: var(--transition-input-out);
  }


  /* mirrors .nova-input:not(:disabled):hover in nova-form-controls.css */
  :host(:not([disabled]):not([invalid]):hover) {
    border-color: var(--group-border-color--hover);
    transition: var(--transition-input-in);
  }

  /* mirrors .nova-input:focus-visible in nova-form-controls.css
   * Note: native uses :focus-visible (keyboard only); shadow DOM uses :focus-within
   * (any child focus). Applied to :host since this component is the visible input box. */
  :host(:focus-within) {
    outline-width: var(--border-width-100); /* global prop */
    outline-style: solid;
    outline-color: var(--color-focus-ring); /* global prop */
    outline-offset: 2px;
  }

  :host([invalid]) {
    border-color: var(--group-border-color--invalid);
  }

  /* mirrors .nova-input:disabled in nova-form-controls.css
   * Visual chrome on :host (this component is the visible input box).
   * cursor: not-allowed and pointer-events: none are provided by novaInputStatesSheet. */
  :host([disabled]) {

    background-color: var(--input-background-color--disabled);
    border-color: var(--group-border-color--disabled);
  }



  /* Disabled label styling */
  ::slotted([slot$="-label"][disabled]) {

  }

  /* Strip child input chrome */
  ::slotted([slot^="t"]:not([slot$="-label"])),
  ::slotted([slot^="d"]:not([slot$="-label"])) {
    --input-border-width: 0;
    --input-background-color: transparent;
    --input-background-color--disabled: transparent;
    --input-height: 100%;
    flex-shrink: 0;
  }



  /* Slotted labels */
  ::slotted([slot$="-label"]) {
    font-size: var(--group-label-font-size);
    color: var(--group-label-text-color);
    font-weight: var(--group-label-font-weight);
    width: var(--group-label-width);
    min-width: var(--group-label-min-width);
    max-width: var(--group-label-max-width);
    padding: var(--space-300);
  }


  /* Invalid label styling */
  ::slotted([slot$="-label"][data-invalid])::after {
    content: "•";
    color: var(--group-border-color--invalid);
    font-weight: var(--font-weight-600); /* global prop */
    margin-inline-start: var(--space-100); /* global prop */
  }

  ::slotted([slot$="-label"][disabled]) {
    color: var(--group-label-text-color--disabled);
  }


  /* Row layout — subgrid shares host column tracks */
  .group-row {
    display: grid;
    grid-column: 1 / -1;
    grid-template-columns: subgrid;
    align-items: center;
    background-color: var(--input-background-color);

    &:not(:last-of-type) {
      border-bottom: var(--group-border-width) solid var(--group-border-row-color);
    }

    &:first-of-type {
      border-top-left-radius: var(--input-border-radius);
      border-top-right-radius: var(--input-border-radius);
    }

    &:last-of-type {
      border-bottom-left-radius: var(--input-border-radius);
      border-bottom-right-radius: var(--input-border-radius);
    }
  }

  :host([disabled]) .group-row {
    background-color: var(--input-background-color--disabled);
    &:not(:last-of-type) {
      border-bottom: var(--group-border-width) solid var(--group-border-row-color--disabled);
    }
  }



  :host([invalid]) {

    .group-row:last-of-type {
      border-radius: 0;
    }
  }

  /* Output slot spans full width */
  .group-output {
    grid-column: 1 / -1;
  }

  ::slotted([slot="output"]) {
    grid-column: 1 / -1;
    margin: 0 !important;

    // background-color: var(--input-border-color) !important;
    padding: calc(var(--input-padding) / 1.5) var(--input-padding);
    color: var(--temporal-output-text-color);
    text-align: right;
    font-weight: var(--temporal-output-font-weight);
    font-size: var(--temporal-output-font-size);
    font-variant-numeric: tabular-nums;
  }

  :host([disabled]) ::slotted([slot="output"]) {
    color: var(--input-text-color--disabled);
    border-top: var(--group-border-width) solid var(--group-border-row-color--disabled);

  }

  /* Invalid output styling */
  :host([invalid]) ::slotted([slot="output"]) {
    // color: var(--label-text-color--invalid);
    // background-color: var(--temporal-output-background-color--invalid) !important;
  }

  :host(:focus-within:not([invalid])) ::slotted([slot="output"]) {
      // color: var(--group-label-text-color--focus);
  }
`);

export class NovaTemporalGroup extends HTMLElement {
   static formAssociated = true;

   #internals;
   #userInteracted = false;
   #slots = new Map(); // slot name → element
   #slotOrder = []; // ordered slot names for rendering
   #temporalSlots = []; // ordered temporal slot names (t0, t1, ...)
   #durationSlots = []; // ordered duration slot names (d0, d1, ...)
   #inferredMode = null; // 'range' | 'compute'
   #typeCompatibilityMessage = "";
   #warnedOutputElement = null;
   #warnedOutputFormat = null; // last unknown output-format value we warned about
   #lastComputeError = null; // Error from latest compute attempt; cleared each compute

   constructor() {
      super();
      this.#internals = this.attachInternals();
      this.attachShadow({ mode: "open" });
      this.shadowRoot.adoptedStyleSheets =
         createNovaInputStyleSheets(groupSheet);
   }

   static get observedAttributes() {
      return [
         "disabled",
         "readonly",
         "required",
         "name",
         "min",
         "max",
         "output-format",
         "aria-label",
         "aria-labelledby",
      ];
   }

   connectedCallback() {
      this.#discoverSlots();
      this.#buildSlots();
      this.#checkTypeCompatibility();

      this.addEventListener("input", this.#onChildInput);
      this.addEventListener("invalid", this.#onInvalid);
      this.shadowRoot.addEventListener("slotchange", this.#onSlotChange);

      this.#suppressChildFocusRings();
      this.#setupAria();
      if (this.hasAttribute("disabled")) this.#propagateState("disabled");
      if (this.hasAttribute("readonly")) this.#propagateState("readonly");

      // Defer initial computation to allow children to initialize first
      // Children's connectedCallback runs after parent's when appending a tree
      requestAnimationFrame(() => {
         this.#validateOutputSlotShape();
         const outputValue = this.#computeOutputValue();
         this.#updateOutput(outputValue);
         this.#syncFormValue(outputValue);

         // Initial computed output out of group min/max bounds: surface as
         // invalid immediately, not after user interaction. Incomplete
         // children stay neutral until interaction (the valueMissing case).
         const v = this.#internals.validity;
         if (v.rangeUnderflow || v.rangeOverflow) {
            this.#userInteracted = true;
            this.toggleAttribute("invalid", true);
            this.#syncStates();
            this.#syncLabelInvalidStates();
            this.#syncAriaInvalid();
         }
      });
   }

   disconnectedCallback() {
      this.removeEventListener("input", this.#onChildInput);
      this.removeEventListener("invalid", this.#onInvalid);
      this.shadowRoot.removeEventListener("slotchange", this.#onSlotChange);
   }

   attributeChangedCallback(name, oldVal, newVal) {
      if (name === "disabled") {
         this.#propagateState(name);
         this.#internals.ariaDisabled = this.hasAttribute("disabled")
            ? "true"
            : "false";
         this.#syncFormValue();
      }
      if (name === "readonly") {
         this.#propagateState(name);
         this.#internals.ariaReadOnly = this.hasAttribute("readonly")
            ? "true"
            : "false";
      }
      if (name === "required") {
         this.#internals.ariaRequired = this.hasAttribute("required")
            ? "true"
            : "false";
         this.#syncFormValue();
      }
      if (name === "aria-label" || name === "aria-labelledby") {
         if (newVal) {
            if (name === "aria-label") {
               this.#internals.ariaLabel = newVal;
            }
         } else {
            if (
               !this.hasAttribute("aria-label") &&
               !this.hasAttribute("aria-labelledby")
            ) {
               this.#internals.ariaLabel = this.#getDefaultAriaLabel();
            }
         }
      }
      if (name === "min" || name === "max") {
         this.#syncFormValue();
      }
      if (name === "output-format") {
         const outputValue = this.#computeOutputValue();
         this.#updateOutput(outputValue);
         this.#syncFormValue(outputValue);
      }
   }

   // ── Output format ──────────────────────────────────────────────────────────

   /**
    * Resolve the active output format. Falls back to mode default if the
    * attribute is missing or unrecognized; an unrecognized value is reported
    * once via reportNovaError.
    *
    * @returns {OutputFormat}
    */
   #getOutputFormat() {
      const attr = this.getAttribute("output-format");
      const fallback = DEFAULT_OUTPUT_FORMAT[this.#inferredMode] || "duration";
      if (!attr) return fallback;
      if (OUTPUT_FORMATS.has(attr)) return attr;
      if (this.#warnedOutputFormat !== attr) {
         this.#warnedOutputFormat = attr;
         reportNovaError(
            this,
            "output-format-unknown",
            `Unknown output-format "${attr}" — falling back to "${fallback}". Valid values: ${[...OUTPUT_FORMATS].join(", ")}.`,
            { provided: attr, fallback },
         );
      }
      return fallback;
   }

   // ── Slot discovery ─────────────────────────────────────────────────────────

   #discoverSlots() {
      this.#slots.clear();
      this.#slotOrder = [];
      this.#temporalSlots = [];
      this.#durationSlots = [];

      const tSlots = [];
      const dSlots = [];
      const domOrder = [];

      for (const child of this.children) {
         const slotName = child.getAttribute("slot");
         if (!slotName) continue;

         const tMatch = slotName.match(/^t(\d+)$/);
         const dMatch = slotName.match(/^d(\d+)$/);
         const match = tMatch || dMatch;

         if (match) {
            const entry = {
               name: slotName,
               index: parseInt(match[1], 10),
               el: child,
            };
            (tMatch ? tSlots : dSlots).push(entry);
            this.#slots.set(slotName, child);
            domOrder.push(slotName);
         } else if (slotName === "output") {
            this.#slots.set("output", child);
         }
         // Label slots (t0-label, d0-label, etc.) are handled in buildSlots
      }

      tSlots.sort((a, b) => a.index - b.index);
      dSlots.sort((a, b) => a.index - b.index);

      this.#inferredMode = dSlots.length > 0 ? "compute" : "range";
      // Compute mode mixes t and d slots in DOM order; range mode is t-only,
      // sorted by index.
      this.#slotOrder =
         this.#inferredMode === "compute"
            ? domOrder
            : tSlots.map((s) => s.name);

      this.#temporalSlots = tSlots.map((s) => s.name);
      this.#durationSlots = dSlots.map((s) => s.name);
   }

   #checkTypeCompatibility() {
      const tSlots = Array.from(this.#slots.entries()).filter(([name]) =>
         /^t\d+$/.test(name),
      );

      if (tSlots.length < 2) return;

      const types = tSlots.map(([name, el]) => ({
         name,
         type: el.temporalType,
         family: getTypeFamily(el.temporalType),
      }));

      const firstFamily = types[0].family;
      const incompatible = types.filter((t) => t.family !== firstFamily);

      if (incompatible.length > 0) {
         reportNovaError(
            this,
            "type-incompatibility",
            `Mixing ${types[0].type} (${types[0].name}) with ${incompatible.map((t) => `${t.type} (${t.name})`).join(", ")}. Operations may produce unexpected results.`,
            { primary: types[0], incompatible },
         );
         this.#typeCompatibilityMessage =
            "Incompatible temporal types in group";
         return;
      }

      this.#typeCompatibilityMessage = "";
   }

   // ── DOM construction ───────────────────────────────────────────────────────

   #buildSlots() {
      const frag = document.createDocumentFragment();

      for (const slotName of this.#slotOrder) {
         const div = document.createElement("div");
         div.className = "group-row";

         // Label slot (e.g., t0-label, d0-label)
         const labelSlotName = `${slotName}-label`;
         const labelSlot = document.createElement("slot");
         labelSlot.name = labelSlotName;
         div.appendChild(labelSlot);

         // Input slot
         const slot = document.createElement("slot");
         slot.name = slotName;
         div.appendChild(slot);

         frag.appendChild(div);
      }

      // Output slot
      const outputSlot = document.createElement("slot");
      outputSlot.name = "output";
      outputSlot.className = "group-output";
      frag.appendChild(outputSlot);

      this.shadowRoot.replaceChildren(frag);
   }

   #onSlotChange = () => {
      // Save old slot order to detect actual changes
      const oldOrder = [...this.#slotOrder];

      this.#discoverSlots();

      // Only rebuild DOM if slot structure actually changed
      const orderChanged =
         oldOrder.length !== this.#slotOrder.length ||
         oldOrder.some((name, i) => name !== this.#slotOrder[i]);

      if (orderChanged) {
         this.#buildSlots();
      }

      this.#suppressChildFocusRings();
      this.#checkTypeCompatibility();
      this.#validateOutputSlotShape();
      const outputValue = this.#computeOutputValue();
      this.#updateOutput(outputValue);
      this.#syncFormValue(outputValue);
   };

   #propagateState(attr) {
      const has = this.hasAttribute(attr);
      for (const child of this.children) {
         child.toggleAttribute(attr, has);
      }
   }

   #suppressChildFocusRings() {
      for (const child of this.children) {
         child.setAttribute("data-suppress-focus", "");
      }
   }

   // ── ARIA ───────────────────────────────────────────────────────────────────

   #setupAria() {
      this.#internals.role = "group";
      this.#internals.ariaDisabled = this.hasAttribute("disabled")
         ? "true"
         : "false";
      this.#internals.ariaReadOnly = this.hasAttribute("readonly")
         ? "true"
         : "false";
      this.#internals.ariaRequired = this.hasAttribute("required")
         ? "true"
         : "false";

      if (
         !this.hasAttribute("aria-label") &&
         !this.hasAttribute("aria-labelledby")
      ) {
         this.#internals.ariaLabel = this.#getDefaultAriaLabel();
      }
   }

   #getDefaultAriaLabel() {
      if (this.#inferredMode === "compute") {
         return "Temporal computation group";
      }
      return "Temporal range group";
   }

   #getSlotLabelText(slotName) {
      const labelSlotName = `${slotName}-label`;
      for (const child of this.children) {
         if (child.getAttribute("slot") === labelSlotName) {
            const text = child.textContent?.trim();
            if (text) return text;
         }
      }
      return null;
   }

   #syncAriaInvalid() {
      if (this.#userInteracted && !this.#internals.validity.valid) {
         this.setAttribute("aria-invalid", "true");
      } else {
         this.removeAttribute("aria-invalid");
      }
   }

   // ── Input handling ─────────────────────────────────────────────────────────

   #onChildInput = (e) => {
      this.#userInteracted = true;

      const outputValue = this.#computeOutputValue();
      this.#updateOutput(outputValue);
      this.#syncFormValue(outputValue);

      this.dispatchEvent(
         new CustomEvent("temporal-change", {
            bubbles: true,
            composed: true,
            detail: this.#buildEventDetail(),
         }),
      );
   };

   // Browser fires `invalid` during a failed form submission attempt (and on
   // checkValidity/reportValidity). Treat that as user interaction so visual
   // invalid styling can engage even before the user touches a segment.
   #onInvalid = () => {
      if (this.#userInteracted) return;
      this.#userInteracted = true;
      this.toggleAttribute("invalid", !this.#internals.validity.valid);
      this.#syncStates();
      this.#syncLabelInvalidStates();
      this.#syncAriaInvalid();
   };

   /**
    * Shape of the `temporal-change` CustomEvent detail. Slot entries mirror
    * the child elements' current value/temporal/validity.
    *
    * @returns {{
    *   mode: GroupMode,
    *   invalid: boolean,
    *   slots: Record<string, {
    *     value: string,
    *     temporal: Temporal.PlainDateTime|Temporal.PlainDate|Temporal.PlainTime|Temporal.Duration|null,
    *     valid: boolean
    *   }>
    * }}
    */
   #buildEventDetail() {
      const detail = {
         mode: this.#inferredMode,
         invalid: !this.#internals.validity.valid,
         slots: {},
      };

      for (const [name, el] of this.#slots) {
         if (name === "output") continue;
         detail.slots[name] = {
            value: el.value,
            temporal: el.temporal,
            valid: el.validity?.valid ?? true,
         };
      }

      return detail;
   }

   /**
    * Compute the group's output string. Dispatches on `output-format`:
    *
    *   range mode:
    *     duration       — ISO duration between t0 and the last t-slot (default)
    *     end            — last t-slot, formatted by its component
    *     interval       — `<t0>/<tLast>`
    *     start-duration — `<t0>/<duration>`
    *     duration-end   — `<duration>/<tLast>`
    *
    *   compute mode:
    *     end            — t0 + sum(durations), formatted by t0 (default)
    *     duration       — sum of all duration slots
    *     interval       — `<t0>/<computed>`
    *     start-duration — `<t0>/<sumDurations>`
    *     duration-end   — `<sumDurations>/<computed>`
    *
    * Returns "" when inputs are incomplete or computation fails.
    *
    * @returns {string}
    */
   #computeOutputValue() {
      this.#lastComputeError = null;
      const format = this.#getOutputFormat();
      return this.#inferredMode === "range"
         ? this.#computeRangeOutput(format)
         : this.#computeComputeOutput(format);
   }

   /**
    * @param {OutputFormat} format
    * @returns {string}
    */
   #computeRangeOutput(format) {
      if (this.#temporalSlots.length < 2) return "";

      const firstSlot = this.#slots.get(this.#temporalSlots[0]);
      const lastSlot = this.#slots.get(
         this.#temporalSlots[this.#temporalSlots.length - 1],
      );
      if (!firstSlot || !lastSlot) return "";

      const first = firstSlot.temporal;
      const last = lastSlot.temporal;
      if (!first || !last) return "";

      let duration;
      try {
         duration = this.#computeRangeDuration(first, last);
      } catch (e) {
         this.#lastComputeError = e;
         reportNovaError(this, "compute-error", "Duration computation error", {
            mode: "range",
            error: e,
         });
         return "";
      }

      const startStr = firstSlot.formatTemporal(first);
      const endStr = lastSlot.formatTemporal(last);
      const durationStr = formatDurationHuman(duration);

      switch (format) {
         case "end":
            return endStr;
         case "interval":
            return `${startStr}/${endStr}`;
         case "start-duration":
            return `${startStr}/${durationStr}`;
         case "duration-end":
            return `${durationStr}/${endStr}`;
         case "duration":
         default:
            return durationStr;
      }
   }

   /**
    * @param {OutputFormat} format
    * @returns {string}
    */
   #computeComputeOutput(format) {
      const t0 = this.#slots.get("t0");
      if (!t0) return "";

      const temporal0 = t0.temporal;
      if (!temporal0) return "";

      if (this.#durationSlots.length === 0) return "";
      if (!this.#durationsCompatibleWithAnchor(temporal0)) return "";

      const computed = this.#applyDurations(temporal0);
      if (!computed) return "";

      const startStr = t0.formatTemporal(temporal0);
      const endStr = t0.formatTemporal(computed);

      // duration / interval forms need the *sum* of duration slots. Sum it
      // anchor-free — components are added in order against a PT0S start so
      // calendar-unit balancing matches the order the user laid them out in.
      let durationStr = "";
      if (
         format === "duration" ||
         format === "start-duration" ||
         format === "duration-end"
      ) {
         const sum = this.#sumDurations();
         if (!sum) return "";
         durationStr = formatDurationHuman(sum);
      }

      switch (format) {
         case "duration":
            return durationStr;
         case "interval":
            return `${startStr}/${endStr}`;
         case "start-duration":
            return `${startStr}/${durationStr}`;
         case "duration-end":
            return `${durationStr}/${endStr}`;
         case "end":
         default:
            return endStr;
      }
   }

   /**
    * Sum every present duration slot into a single Temporal.Duration. Returns
    * null if any slot is empty or the addition throws. No anchor — calendar
    * units stay unbalanced, which is fine for display/serialization.
    *
    * @returns {Temporal.Duration|null}
    */
   #sumDurations() {
      try {
         let sum = Temporal.Duration.from("PT0S");
         for (const slotName of this.#durationSlots) {
            const dEl = this.#slots.get(slotName);
            if (!dEl) continue;
            const dur = dEl.temporal;
            if (!dur) return null;
            sum = sum.add(dur);
         }
         return sum;
      } catch (e) {
         this.#lastComputeError = e;
         reportNovaError(
            this,
            "compute-error",
            "Could not sum duration slots",
            { mode: "compute", error: e },
         );
         return null;
      }
   }

   /**
    * Returns true if every present duration slot can be added to `anchor`
    * without silent truncation. PlainTime anchors cannot absorb day-or-larger
    * components; PlainDate anchors cannot absorb sub-day components. Empty
    * slots are skipped (caller decides what to do with incomplete state).
    *
    * @param {Temporal.PlainDateTime|Temporal.PlainDate|Temporal.PlainTime|Temporal.Duration|null} anchor
    * @returns {boolean}
    */
   #durationsCompatibleWithAnchor(anchor) {
      if (!anchor) return true;
      const isPlainTime = anchor instanceof Temporal.PlainTime;
      const isPlainDate = anchor instanceof Temporal.PlainDate;
      if (!isPlainTime && !isPlainDate) return true;

      for (const slotName of this.#durationSlots) {
         const dEl = this.#slots.get(slotName);
         if (!dEl) continue;
         const dur = dEl.temporal;
         if (!dur) continue;

         if (isPlainTime && (dur.years || dur.months || dur.days)) {
            return false;
         }
         if (
            isPlainDate &&
            (dur.hours ||
               dur.minutes ||
               dur.seconds ||
               dur.milliseconds ||
               dur.microseconds ||
               dur.nanoseconds)
         ) {
            return false;
         }
      }
      return true;
   }

   /**
    * Compute the signed duration from `first` to `last` for range mode.
    * PlainTime endpoints use native PlainTime.until() directly. Time-only
    * ranges do not infer dates or overnight/next-occurrence semantics.
    *
    * @param {Temporal.PlainDateTime|Temporal.PlainDate|Temporal.PlainTime} first
    * @param {Temporal.PlainDateTime|Temporal.PlainDate|Temporal.PlainTime} last
    * @returns {Temporal.Duration}
    */
   #computeRangeDuration(first, last) {
      // largestUnit explicit: PlainTime and Instant can't balance into days;
      // everything else is balanced to days (calendar-unit balancing requires
      // relativeTo and is anchor-sensitive — keep it day-and-below).
      const largestUnit =
         first instanceof Temporal.PlainTime || first instanceof Temporal.Instant
            ? "hour"
            : "day";
      return first.until(last, { largestUnit });
   }

   /**
    * Apply all present duration slots to an anchor in order. Returns the
    * computed temporal, or null if any required slot is empty or a Temporal
    * API call throws. Caller is expected to gate truncation risk via
    * #durationsCompatibleWithAnchor first.
    *
    * @template {Temporal.PlainDateTime|Temporal.PlainDate|Temporal.PlainTime|Temporal.Duration} T
    * @param {T} anchor
    * @returns {T|null}
    */
   #applyDurations(anchor) {
      try {
         let result = anchor;
         // Duration.add and Instant.add don't accept overflow; PlainDate/Time/DateTime do.
         // Reject impossible additions (Jan 31 + P1M) instead of silently
         // clamping to Feb 28/29 — matches the package's strict-validity stance.
         const addOpts =
            anchor instanceof Temporal.Duration || anchor instanceof Temporal.Instant
               ? undefined
               : { overflow: "reject" };
         for (const slotName of this.#durationSlots) {
            const dEl = this.#slots.get(slotName);
            if (!dEl) continue;
            const dur = dEl.temporal;
            if (!dur) return null;
            result = addOpts ? result.add(dur, addOpts) : result.add(dur);
         }
         return result;
      } catch (e) {
         this.#lastComputeError = e;
         reportNovaError(
            this,
            "compute-error",
            "Compute error while applying durations",
            { mode: "compute", error: e },
         );
         return null;
      }
   }

   #updateOutput(value = this.#computeOutputValue()) {
      const out = this.#slots.get("output");
      if (!out) return;

      const target = out.querySelector(".output-value") || out;
      target.textContent = value || "Invalid";
      out.hidden = false;
   }

   #validateOutputSlotShape() {
      const out = this.#slots.get("output");
      if (!out) return;
      if (this.#warnedOutputElement === out) return;
      this.#warnedOutputElement = out;

      const id = this.id ? ` #${this.id}` : "";
      if (out.tagName !== "OUTPUT") {
         reportNovaError(
            this,
            "output-slot-shape",
            `${id ? id.trim() + ": " : ""}slot="output" should be an <output> element (got <${out.tagName.toLowerCase()}>) — native form semantics and assistive-tech announcement depend on it.`,
            { id: this.id || null, tagName: out.tagName.toLowerCase() },
         );
         return;
      }
      if (!out.querySelector(".output-value")) {
         reportNovaError(
            this,
            "output-slot-shape",
            `${id ? id.trim() + ": " : ""}slot="output" is missing a .output-value descendant; the computed value will overwrite sibling content. Add <span class="output-value"></span> inside the <output>.`,
            { id: this.id || null, missing: ".output-value" },
         );
      }
   }

   // ── Validation ─────────────────────────────────────────────────────────────

   /**
    * Build the FormData submitted by setFormValue. The group behaves like a
    * <fieldset>: each t/d slot ships under `${groupName}[${childName||slotName}]`
    * (PHP/Rails bracket form, the de-facto HTML idiom for grouped fields), plus
    * a `[output]` entry for the computed result. Without a group `name`,
    * children submit under their plain key — same fallback the platform uses
    * for unnamed fieldsets.
    *
    * Honors a child's own `name` attribute when present so authors can pick
    * server-friendly keys (e.g. `start`/`end`) instead of the slot positions
    * (`t0`/`t1`). Label slots and the output slot are excluded from iteration —
    * the output is appended explicitly under the `output` key.
    *
    * @param {string} outputValue
    * @returns {FormData}
    */
   #buildFormData(outputValue) {
      const data = new FormData();
      const groupName = this.name;
      const key = (childKey) =>
         groupName ? `${groupName}[${childKey}]` : childKey;

      for (const [slotName, el] of this.#slots) {
         if (slotName === "output") continue;
         if (!/^[td]\d+$/.test(slotName)) continue;
         const childName = el.getAttribute?.("name") || slotName;
         data.append(key(childName), el.value ?? "");
      }
      data.append(key("output"), outputValue ?? "");
      return data;
   }

   #syncFormValue(outputValue = this.#computeOutputValue()) {
      if (this.hasAttribute("disabled")) {
         this.#internals.setFormValue(null);
         this.#internals.setValidity({});
         this.removeAttribute("invalid");
         this.#syncStates();
         return;
      }

      this.#internals.setFormValue(this.#buildFormData(outputValue));

      // Constraint-parse throws (bad min/max attribute) bubble out of
      // #validateGroup. Match the child precedent (segment-input-base also
      // throws on bad min/max): surface as customError validity rather than
      // silently skipping the bound. The host learns via `nova-error`.
      let validationResult;
      try {
         validationResult = this.#validateGroup();
      } catch (e) {
         reportNovaError(
            this,
            "constraint-parse-error",
            e?.message || "Invalid min/max constraint on group",
            { error: e },
         );
         validationResult = {
            valid: false,
            flags: { customError: true },
            message: e?.message || "Invalid min/max constraint on group",
         };
      }

      if (!validationResult.valid) {
         this.#internals.setValidity(
            validationResult.flags,
            validationResult.message,
         );
      } else {
         this.#internals.setValidity({});
      }
      // Visual-invalid markers (host [invalid], aria-invalid, label
      // [data-invalid]) only engage after user interaction or a failed form
      // submit attempt — otherwise required-but-empty fields would scream
      // before the user has had a chance to fill them in.
      this.toggleAttribute(
         "invalid",
         this.#userInteracted && !validationResult.valid,
      );

      this.#syncStates();
      this.#syncLabelInvalidStates();
   }

   #validateGroup() {
      if (this.#typeCompatibilityMessage) {
         return {
            valid: false,
            flags: { customError: true },
            message: this.#typeCompatibilityMessage,
         };
      }

      const structureResult = this.#validateStructure();
      if (!structureResult.valid) return structureResult;

      // Check child validity
      for (const [name, el] of this.#slots) {
         if (name === "output") continue;
         if (el.validity && !el.validity.valid) {
            const labelText = this.#getSlotLabelText(name);
            return {
               valid: false,
               flags: { customError: true },
               message: `Invalid input in ${labelText || name}`,
            };
         }
      }

      // Check duration/anchor type compatibility (compute mode only)
      const durationCompatResult = this.#validateDurationCompatibility();
      if (!durationCompatResult.valid) return durationCompatResult;

      // Compute throws (Temporal API errors during apply/range) — recorded by
      // #computeOutputValue / #applyDurations. Surface as customError so the
      // group's validity matches the "Invalid" text shown in the output slot.
      if (this.#lastComputeError) {
         return {
            valid: false,
            flags: { customError: true },
            message: "Could not compute group output.",
         };
      }

      // Any unset child blocks output computation, so the group is invalid
      // whenever it isn't complete — regardless of the `required` attribute.
      // This is what drives the "Invalid" output text and the row's
      // user-invalid styling.
      if (!this.#hasCompleteValue()) {
         return {
            valid: false,
            flags: { valueMissing: true },
            message: "Please fill out all required fields.",
         };
      }

      // Check min/max constraints
      const minMaxResult = this.#validateMinMax();
      if (!minMaxResult.valid) return minMaxResult;

      return { valid: true };
   }

   #validateStructure() {
      const temporalCount = this.#temporalSlots.length;
      const durationCount = this.#durationSlots.length;
      const totalCount = temporalCount + durationCount;

      if (totalCount < 2) {
         return {
            valid: false,
            flags: { customError: true },
            message:
               "Invalid group configuration: expected at least two temporal/duration slots.",
         };
      }

      if (this.#inferredMode === "range") {
         if (durationCount > 0 || temporalCount < 2) {
            return {
               valid: false,
               flags: { customError: true },
               message:
                  "Invalid range configuration: expected at least two temporal slots and no duration slots.",
            };
         }
      } else {
         if (durationCount < 1 || !this.#slots.has("t0")) {
            return {
               valid: false,
               flags: { customError: true },
               message:
                  "Invalid compute configuration: expected slot t0 and at least one duration slot.",
            };
         }
      }

      return { valid: true };
   }

   /**
    * Compute mode: a duration with components the t0 anchor cannot absorb
    * (day-or-larger against PlainTime; sub-day against PlainDate) would
    * otherwise be silently truncated by Temporal. Surface as customError
    * instead of letting the user see a wrong-but-plausible computed value.
    */
   #validateDurationCompatibility() {
      if (this.#inferredMode === "range") return { valid: true };
      const t0 = this.#slots.get("t0");
      if (!t0 || !t0.temporal) return { valid: true };
      if (this.#durationsCompatibleWithAnchor(t0.temporal)) {
         return { valid: true };
      }
      const isPlainTime = t0.temporal instanceof Temporal.PlainTime;
      return {
         valid: false,
         flags: { customError: true },
         message: isPlainTime
            ? "Duration with day-or-larger components cannot be applied to a time anchor."
            : "Duration with sub-day components cannot be applied to a date anchor.",
      };
   }

   #validateMinMax() {
      const minAttr = this.getAttribute("min");
      const maxAttr = this.getAttribute("max");

      if (!minAttr && !maxAttr) return { valid: true };

      return this.#inferredMode === "range"
         ? this.#validateMinMaxDuration(minAttr, maxAttr)
         : this.#validateMinMaxTemporal(minAttr, maxAttr);
   }

   /**
    * Check `value` against optional min/max bounds. Returns a validation
    * result; `compare` returns -1/0/1 and may return null to skip a bound.
    *
    * @template T
    * @param {T} value
    * @param {string|null} minAttr
    * @param {string|null} maxAttr
    * @param {(s: string) => T|null} parse
    * @param {(a: T, b: T) => -1|0|1|null} compare
    * @param {string} label - prefix for the error message
    * @returns {GroupValidationResult}
    */
   #checkBounds(value, minAttr, maxAttr, parse, compare, label) {
      const checks = [
         { attr: minAttr, sign: -1, flag: "rangeUnderflow", word: "least" },
         { attr: maxAttr, sign: 1, flag: "rangeOverflow", word: "most" },
      ];
      for (const { attr, sign, flag, word } of checks) {
         if (!attr) continue;
         const bound = parse(attr);
         if (!bound) continue;
         const cmp = compare(value, bound);
         if (cmp === null) continue;
         if (Math.sign(cmp) === sign) {
            return {
               valid: false,
               flags: { [flag]: true },
               message: `${label} must be at ${word} ${attr}`,
            };
         }
      }
      return { valid: true };
   }

   /**
    * Range mode: min/max are durations constraining the duration between t0 and t1.
    *
    * Throws `RangeError` if `min` or `max` cannot be parsed as a Duration —
    * matches the individual-component contract at
    * `nova-segment-input-base.js:732-740`. Caller (`#syncFormValue`) catches
    * and surfaces as `customError` validity rather than silently skipping the
    * bound.
    */
   #validateMinMaxDuration(minAttr, maxAttr) {
      if (this.#temporalSlots.length < 2) return { valid: true };

      const firstSlot = this.#slots.get(this.#temporalSlots[0]);
      const lastSlot = this.#slots.get(
         this.#temporalSlots[this.#temporalSlots.length - 1],
      );

      if (!firstSlot || !lastSlot) return { valid: true };

      const temporal0 = firstSlot.temporal;
      const temporal1 = lastSlot.temporal;

      if (!temporal0 || !temporal1) return { valid: true };

      const duration = this.#computeRangeDuration(temporal0, temporal1);
      return this.#checkBounds(
         duration,
         minAttr,
         maxAttr,
         (s) => parseConstraintByType(s, "Duration"),
         (a, b) => this.#compareDuration(a, b),
         "Duration",
      );
   }

   /**
    * Compute mode: min/max are temporal values constraining the computed output.
    *
    * Throws `RangeError` if `min` or `max` cannot be parsed as the t0 anchor's
    * `temporalType`. See `#validateMinMaxDuration` for the contract.
    */
   #validateMinMaxTemporal(minAttr, maxAttr) {
      const t0 = this.#slots.get("t0");
      if (!t0 || !t0.temporal) return { valid: true };

      const computedTemporal = this.#applyDurations(t0.temporal);
      if (!computedTemporal) return { valid: true };

      const temporalType = t0.temporalType;

      return this.#checkBounds(
         computedTemporal,
         minAttr,
         maxAttr,
         (s) => parseConstraintByType(s, temporalType),
         (a, b) => this.#compareTemporal(a, b, temporalType),
         "Computed value",
      );
   }

   #compareDuration(a, b) {
      try {
         return Temporal.Duration.compare(a, b);
      } catch {
         try {
            return Temporal.Duration.compare(a, b, {
               relativeTo: DURATION_COMPARE_ANCHOR,
            });
         } catch (e) {
            reportNovaError(
               this,
               "compute-error",
               "Could not compare Duration values",
               { error: e },
            );
         }
      }
      return null;
   }

   /**
    * @param {Temporal.PlainDateTime|Temporal.PlainDate|Temporal.PlainTime|Temporal.Duration} a
    * @param {Temporal.PlainDateTime|Temporal.PlainDate|Temporal.PlainTime|Temporal.Duration} b
    * @param {string} temporalType  - "PlainDateTime" | "PlainDate" | "PlainTime" | "Duration"
    * @returns {-1|0|1|null}
    */
   #compareTemporal(a, b, temporalType) {
      // Duration must route through #compareDuration: parseDuration accepts
      // calendar units, and Temporal.Duration.compare throws without a
      // relativeTo when years/months are present. A thrown compare here would
      // return null and #checkBounds would skip the bound — silently passing
      // min/max violations.
      if (temporalType === "Duration") return this.#compareDuration(a, b);
      const compareFn = Temporal[temporalType]?.compare;
      if (!compareFn) return null;
      try {
         return compareFn(a, b);
      } catch (e) {
         reportNovaError(
            this,
            "compute-error",
            `Could not compare ${temporalType} values`,
            { error: e },
         );
      }
      return null;
   }

   #hasCompleteValue() {
      for (const [name, el] of this.#slots) {
         if (name === "output") continue;
         if (!el.value) return false;
      }
      return true;
   }

   #syncLabelInvalidStates() {
      for (const [name, el] of this.#slots) {
         if (name === "output") continue;
         const label = this.querySelector(`[slot="${name}-label"]`);
         if (!label) continue;
         const childInvalid = !!(el.validity && !el.validity.valid);
         const childEmpty = !el.value;
         const isInvalid = this.#userInteracted && (childInvalid || childEmpty);
         label.toggleAttribute("data-invalid", isInvalid);
      }
   }

   #syncStates() {
      const states = this.#internals.states;
      const isRequired = this.hasAttribute("required");
      const isValid = this.#internals.validity.valid;
      const isDisabled = this.hasAttribute("disabled");

      // required / optional
      states[isRequired ? "add" : "delete"]("required");
      states[isRequired ? "delete" : "add"]("optional");

      if (isDisabled) {
         states.delete("invalid");
         states.delete("valid");
         states.delete("user-invalid");
         states.delete("user-valid");
         this.removeAttribute("aria-invalid");
         return;
      }

      // invalid / valid
      states[isValid ? "delete" : "add"]("invalid");
      states[isValid ? "add" : "delete"]("valid");

      // user-invalid / user-valid
      if (this.#userInteracted) {
         states[isValid ? "delete" : "add"]("user-invalid");
         states[isValid ? "add" : "delete"]("user-valid");
      } else {
         states.delete("user-invalid");
         states.delete("user-valid");
      }

      this.#syncAriaInvalid();
   }

   // ── Public API ─────────────────────────────────────────────────────────────

   /**
    * Inferred operating mode based on the slots present at connect time.
    * @returns {GroupMode}
    */
   get mode() {
      return this.#inferredMode;
   }

   /**
    * Current computed output (range duration or compute-mode result).
    * @returns {string}
    */
   get formattedValue() {
      return this.#computeOutputValue();
   }

   /**
    * @param {string} name  - "t0", "t1", "d0", …, or "output"
    * @returns {HTMLElement|undefined}
    */
   getSlot(name) {
      return this.#slots.get(name);
   }

   /**
    * Minimum constraint:
    * - Range mode: minimum duration (e.g., "PT30M")
    * - Compute mode: minimum datetime (e.g., "2026-06-01T00:00:00Z")
    */
   get min() {
      return this.getAttribute("min");
   }
   set min(v) {
      if (v == null || v === "") this.removeAttribute("min");
      else this.setAttribute("min", v);
   }

   /**
    * Maximum constraint:
    * - Range mode: maximum duration (e.g., "PT8H")
    * - Compute mode: maximum datetime (e.g., "2026-12-31T23:59:59Z")
    */
   get max() {
      return this.getAttribute("max");
   }
   set max(v) {
      if (v == null || v === "") this.removeAttribute("max");
      else this.setAttribute("max", v);
   }

   /**
    * Active output format. Returns the resolved value (mode default when the
    * attribute is unset or unrecognized), so callers always get one of the
    * documented OutputFormat strings.
    * @returns {OutputFormat}
    */
   get outputFormat() {
      return this.#getOutputFormat();
   }
   set outputFormat(v) {
      if (v == null || v === "") this.removeAttribute("output-format");
      else this.setAttribute("output-format", v);
   }

   // ── Form Integration ───────────────────────────────────────────────────────

   get name() {
      return this.getAttribute("name") || "";
   }

   get form() {
      return this.#internals.form;
   }

   get validity() {
      return this.#internals.validity;
   }

   get validationMessage() {
      return this.#internals.validationMessage;
   }

   get willValidate() {
      return this.#internals.willValidate;
   }

   checkValidity() {
      return this.#internals.checkValidity();
   }

   reportValidity() {
      return this.#internals.reportValidity();
   }

   get required() {
      return this.hasAttribute("required");
   }

   set required(v) {
      if (v) this.setAttribute("required", "");
      else this.removeAttribute("required");
   }

   formResetCallback() {
      this.#userInteracted = false;
      for (const child of this.children) {
         if (typeof child.formResetCallback === "function") {
            child.formResetCallback();
         }
      }
      this.#syncFormValue();
   }

   formDisabledCallback(disabled) {
      if (disabled) this.setAttribute("disabled", "");
      else this.removeAttribute("disabled");
   }
}

customElements.define("nova-temporal-group", NovaTemporalGroup);

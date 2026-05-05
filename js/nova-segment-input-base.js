/**
 * NovaSegmentInputBase — Base class for segmented numeric inputs
 *
 * Provides: shadow DOM, form association, keyboard navigation (Tab between
 * segments, ArrowUp/Down to nudge, digit entry with auto-advance), click to
 * focus, paste, copy, disabled/readonly states.
 *
 * Subclasses must implement:
 *   static get segmentDescriptors() → [{ name, label, min, max, pad, wrap?, labelAfter?, labelBefore? }]
 *   static get separators()         → array of separator strings or { text, className } objects between segments
 *   static get suffix()             → optional trailing string (e.g. "Z")
 *   get formattedValue()            → ISO string for form submission
 *   parseAndSet(isoString)          → parse ISO into segment values
 */

import { createNovaInputStyleSheets } from "./nova-stylesheets.js";

const DIGIT_RE = /^\d$/;

// ── Component stylesheet ─────────────────────────────────────────────────────
//
// Host-level cursor/interaction states (disabled, readonly) are inherited from
// novaInputStatesSheet via createNovaInputStyleSheets(). This sheet handles
// only what is unique to this component: layout, segment internals, and visual
// chrome applied to .segments-area (the inner input box).
//
const baseSheet = new CSSStyleSheet();
baseSheet.replaceSync(`
  :host {
    display: inline-block;

    font-family: var(--input-font-family);
    font-size: var(--input-font-size);
    font-variant-numeric: tabular-nums;
    line-height: var(--input-line-height);
    height: var(--input-height);
    color: var(--input-text-color);


    user-select: none;
    cursor: default;
  }

  /* Fix for Chrome injecting a selection background color */
  :host::selection {
    background-color: unset;
    color: unset;
  }

  :host(:focus-within) {
    color: var(--input-text-color--focus);
    transition: color var(--input-transition-duration) ease-in-out;
  }

  /* cursor: not-allowed and pointer-events: none on :host([disabled]) are
   * provided by novaInputStatesSheet. Only .segment-specific overrides here. */

  /* readonly cursor on .segment — :host([readonly]) cursor is in novaInputStatesSheet */
  :host([readonly]) .segment {
    cursor: magnify-glass;
  }

  .input-wrapper {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
  }

  .segments-area {
    display: inline-flex;
    align-items: center;
    min-width: 0;
    overflow: hidden;

    background-color: var(--input-background-color);

    border-style: solid;
    border-width: var(--input-border-width);
    border-color: var(--input-border-color);
    border-radius: var(--input-border-radius);

    padding: var(--input-padding);
    height: var(--input-height, auto);

    transition: var(--transition-input-out);
  }

  /* mirrors .nova-input:not(:disabled):hover in nova-form-controls.css */
  :host(:not([disabled]):hover) .segments-area {
    border-color: var(--input-border-color--hover);
    transition: var(--transition-input-in);

  }

  :host(:state(user-invalid)) .segments-area {
    border-color: var(--input-border-color--invalid);
  }

  :host(:not([disabled]):hover:state(user-invalid)) .segments-area {
    border-color: var(--input-border-color--invalid);
  }

  /* mirrors .nova-input:focus-visible in nova-form-controls.css
   * Note: native uses :focus-visible (keyboard only); shadow DOM uses :focus-within
   * (any child focus). Applied to .segments-area since that is the visible input box. */
  :host(:not([disabled]):focus-within) .segments-area {
    outline-width: var(--border-width-100);
    outline-style: solid;
    outline-color: var(--color-focus-ring);
    outline-offset: 2px;
  }

  :host([data-suppress-focus]:focus-within) .segments-area {
    outline: none;
  }

  /* mirrors .nova-input:disabled in nova-form-controls.css
   * Visual chrome on the inner wrapper (.segments-area is the visible input box here) */
  :host([disabled]) .segments-area {
    color: var(--input-text-color--disabled);
    background-color: var(--input-background-color--disabled);
    border-color: var(--input-border-color--disabled);
    pointer-events: auto;
    cursor: not-allowed;
  }

  :host([disabled]) .segment {
    cursor: not-allowed;
  }

  :host([disabled]) .segment:focus {
    background-color: inherit;
    color: inherit;
  }


  .segment {
    display: inline-block;
    padding: 0;
    outline: none;
    caret-color: transparent;
    text-align: center;
    border-radius: 2px;
  }

  .segment:focus {
    background-color: var(--input-background-color--selected);
    color: var(--input-text-color--selected);
  }

  /* Gap after sub-second digits in time components (no labelAfter) */
  .segment.subsecond-gap {
    margin-inline-end: 0.25em;
  }

  .separator, .suffix, .label-text, .prefix-text {
    pointer-events: none;
    opacity: 0.6;
  }

  .label-text, .prefix-text {
    font-size: 0.8em;
  }

  .label-text {
    margin-inline-start: 1px;
    margin-inline-end: 4px;
  }

  .prefix-text {
    margin-inline-end: 1px;

  }

  .datetime-separator {
    margin-inline-start: 3px;
    margin-inline-end: 2px;
  }

  .suffix {
    margin-inline-start: 1px;
  }

`);

/**
 * @typedef {import("./nova-segment-types.js").SegmentDescriptor} SegmentDescriptor
 * @typedef {import("./nova-segment-types.js").SegmentSeparator} SegmentSeparator
 */

export class NovaSegmentInputBase extends HTMLElement {
   static formAssociated = true;

   // Subclasses override these
   /** @returns {SegmentDescriptor[]} */
   static get segmentDescriptors() {
      return [];
   }
   /** @returns {SegmentSeparator[]} */
   static get separators() {
      return [];
   }
   /** @returns {string} optional trailing suffix (e.g. "Z") rendered after the last segment */
   static get suffix() {
      return "";
   }

   #internals;
   #connected = false;
   #segments = [];
   #segmentNames = [];
   #segmentIndexByName = new Map();
   #segmentValues = [];
   #segmentEmpty = [];
   #digitBuffer = "";
   #digitTimer = null;
   #minRaw = null;
   #maxRaw = null;
   #originalValue = "";
   #userInteracted = false;

   constructor() {
      super();
      this.#internals = this.attachInternals();
      this.attachShadow({ mode: "open" });
      this.shadowRoot.adoptedStyleSheets =
         createNovaInputStyleSheets(baseSheet);
   }

   // ── Lifecycle ────────────────────────────────────────────────────────────
   connectedCallback() {
      this.#buildDOM();
      this.#addListeners();
      this.setAttribute("role", "group");

      this.#initDefaults();
      const val = this.getAttribute("value");
      if (val) {
         // Attribute is configuration, not a programmatic assignment: an
         // unparseable value falls back to placeholder rendering instead of
         // bubbling the parse error and leaving segments blank. The property
         // setter (el.value = …) still throws.
         try {
            this.parseAndSet(val);
         } catch (e) {
            console.warn(
               `[${this.tagName.toLowerCase()}] value="${val}" did not parse — rendering placeholders.`,
               e?.message,
            );
         }
      }
      this.#render();
      this.#syncFormValue();
      this.#connected = true;

      // Initial value out of min/max bounds: surface as invalid immediately,
      // not after user interaction. Empty / required-but-empty stays neutral
      // until the user touches it (handled by the userInteracted gate).
      const v = this.#internals.validity;
      if (v.rangeUnderflow || v.rangeOverflow) {
         this.#userInteracted = true;
         this.#syncStates();
      }

      // Apply initial disabled/readonly state after DOM is ready
      if (this.hasAttribute("disabled")) {
         this.#applyDisabledState(true);
      }
      if (this.hasAttribute("readonly")) {
         this.#internals.ariaReadOnly = "true";
      }
   }

   disconnectedCallback() {
      this.#removeListeners();
      this.#connected = false;
   }

   static get observedAttributes() {
      return [
         "value",
         "disabled",
         "readonly",
         "required",
         "name",
         "min",
         "max",
         "pattern",
      ];
   }

   attributeChangedCallback(name, oldVal, newVal) {
      switch (name) {
         case "value":
            if (!this.#connected) return;
            if (newVal === null || newVal === "") {
               this.#initDefaults();
               this.#render();
               this.#syncFormValue();
            } else if (newVal !== this.value) {
               // Attribute path: see connectedCallback — fall back to
               // placeholders on parse failure rather than throwing.
               try {
                  this.parseAndSet(newVal);
               } catch (e) {
                  console.warn(
                     `[${this.tagName.toLowerCase()}] value="${newVal}" did not parse — rendering placeholders.`,
                     e?.message,
                  );
                  this.#initDefaults();
               }
               this.#render();
               this.#syncFormValue();
            }
            return;
         case "disabled": {
            const isDisabled = this.hasAttribute("disabled");
            this.#internals.ariaDisabled = String(isDisabled);
            if (this.#connected) this.#applyDisabledState(isDisabled);
            return;
         }
         case "readonly":
            this.#internals.ariaReadOnly = String(this.hasAttribute("readonly"));
            return;
         case "required":
            this.#internals.ariaRequired = String(this.hasAttribute("required"));
            if (this.#connected) this.#syncFormValue();
            return;
         case "min":
            this.#minRaw = newVal;
            if (this.#connected) this.#validateRange();
            return;
         case "max":
            this.#maxRaw = newVal;
            if (this.#connected) this.#validateRange();
            return;
      }
   }

   // ── Public API ───────────────────────────────────────────────────────────
   /** Move focus to the first segment unless the component is disabled. */
   focusFirstSegment() {
      if (this.hasAttribute("disabled")) return;
      this.#focusSegment(0);
   }

   /** Move focus to the last segment unless the component is disabled. */
   focusLastSegment() {
      if (this.hasAttribute("disabled")) return;
      this.#focusSegment(this.#segments.length - 1);
   }

   /**
    * Current value as a formatted ISO string, or `""` if any segment is empty.
    * @returns {string}
    */
   get value() {
      if (this.#segmentEmpty.some((e) => e)) return "";
      try {
         return this.formattedValue;
      } catch {
         return "";
      }
   }
   /** @param {string|null|undefined} v */
   set value(v) {
      if (v === "" || v == null) {
         this.#initDefaults();
         this.#render();
         this.#syncFormValue();
         return;
      }
      this.parseAndSet(v);
      this.#render();
      this.#syncFormValue();
   }

   /** @returns {boolean} true when any segment has not been set */
   get isEmpty() {
      return this.#segmentEmpty.some((e) => e);
   }

   get required() {
      return this.hasAttribute("required");
   }
   set required(v) {
      if (v) this.setAttribute("required", "");
      else this.removeAttribute("required");
   }

   get min() {
      return this.getAttribute("min");
   }
   set min(v) {
      if (v == null || v === "") this.removeAttribute("min");
      else this.setAttribute("min", v);
   }

   get max() {
      return this.getAttribute("max");
   }
   set max(v) {
      if (v == null || v === "") this.removeAttribute("max");
      else this.setAttribute("max", v);
   }

   /**
    * When pattern is set, paste only accepts strings matching the native format.
    * When pattern is absent, paste accepts any valid ISO8601 string and converts.
    */
   get pattern() {
      return this.getAttribute("pattern");
   }
   set pattern(v) {
      if (v == null || v === "") this.removeAttribute("pattern");
      else this.setAttribute("pattern", v);
   }

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
   checkValidity() {
      return this.#internals.checkValidity();
   }
   reportValidity() {
      return this.#internals.reportValidity();
   }

   formResetCallback() {
      this.#userInteracted = false;
      const def = this.getAttribute("value");
      if (def) {
         this.parseAndSet(def);
      } else {
         this.#initDefaults();
      }
      this.#render();
      this.#syncFormValue();
   }

   formDisabledCallback(disabled) {
      if (disabled) this.setAttribute("disabled", "");
      else this.removeAttribute("disabled");
   }

   // ── Segment access for subclasses ────────────────────────────────────────
   /**
    * @param {number} index
    * @returns {number}
    */
   getSegmentValue(index) {
      return this.#segmentValues[index] ?? 0;
   }

   /**
    * Set a single segment by index. Clamps to the descriptor's effective max
    * and marks the segment as no longer empty.
    *
    * @param {number} index
    * @param {number} val
    * @param {boolean} [skipRender=false] - skip render+notify (caller will batch)
    */
   setSegmentValue(index, val, skipRender = false) {
      const desc = this.activeDescriptors[index];
      if (!desc) return;
      this.#segmentValues[index] = this.#clamp(val, desc.name, desc);
      this.#segmentEmpty[index] = false;
      this._onSegmentValueChanged(index, desc.name);
      if (!skipRender) {
         this.#render();
         this.#syncAndNotify();
      }
   }

   /**
    * @param {string} name
    * @returns {number|undefined}
    */
   getSegmentValueByName(name) {
      const idx = this.#segmentIndexByName.get(name);
      return idx !== undefined ? this.#segmentValues[idx] : undefined;
   }

   /**
    * @param {string} name
    * @param {number} val
    * @param {boolean} [skipRender=false]
    */
   setSegmentValueByName(name, val, skipRender = false) {
      const idx = this.#segmentIndexByName.get(name);
      if (idx !== undefined) this.setSegmentValue(idx, val, skipRender);
   }

   /**
    * Replace all segment values at once. Length must match
    * `activeDescriptors.length`; missing entries fall back to descriptor.min.
    *
    * @param {number[]} values
    * @param {boolean} [skipRender=false]
    */
   setAllSegmentValues(values, skipRender = false) {
      const descs = this.activeDescriptors;
      for (let i = 0; i < descs.length; i++) {
         this.#segmentValues[i] = this.#clamp(
            values[i] ?? descs[i].min,
            descs[i].name,
            descs[i],
         );
         this.#segmentEmpty[i] = false;
      }
      if (!skipRender) {
         this.#render();
         this.#syncAndNotify();
      }
   }

   // Subclasses must implement
   /**
    * Contract: return the canonical ISO string representation of the current
    * segment values. Called for `value`, form submission, `_compareValues`,
    * and the public `temporal` getter.
    *
    * @returns {string}
    */
   get formattedValue() {
      return "";
   }
   /**
    * Contract: parse `_isoString` and update segment values via
    * `setAllSegmentValues`. Subclasses should accept `(str, strict?)` and
    * throw `RangeError` on parse failure to match Temporal's design
    * philosophy (validity-strict).
    *
    * @param {string} _isoString
    */
   parseAndSet(_isoString) {
      /* override */
   }

   /**
    * Hook for paste — subclasses can override to accept broader ISO formats
    * than the native value format. Default just calls parseAndSet.
    *
    * @param {string} str
    */
   _parsePasteValue(str) {
      this.parseAndSet(str);
   }

   /**
    * Hook for strict parsing — only accept the native value format. Used
    * when the `pattern` attribute is set. Default no-ops; override and
    * silently swallow parse failures (paste should not throw).
    *
    * @param {string} _str
    */
   _parseStrictValue(_str) {
      // Subclasses should override to implement strict native-format-only parsing
   }

   /** Hook for "n" hotkey — subclasses override to set current UTC now. */
   _setToNow() {}

   // ── Descriptor selection (instance override > static) ──────────────────
   // Subclasses with dynamic descriptors (e.g. unit-window-dependent) can
   // set this._instanceDescriptors and this._instanceSeparators before
   // calling super.connectedCallback().
   /** @returns {SegmentDescriptor[]} */
   get activeDescriptors() {
      return this._instanceDescriptors || this.constructor.segmentDescriptors;
   }

   /** @returns {SegmentSeparator[]} */
   get activeSeparators() {
      return this._instanceSeparators || this.constructor.separators;
   }

   // ── DOM construction ─────────────────────────────────────────────────────
   #buildDOM() {
      const descs = this.activeDescriptors;
      const seps = this.activeSeparators;

      // Segments wrapper
      const area = document.createElement("div");
      area.className = "segments-area";

      this.#segments = [];
      this.#segmentNames = descs.map((d) => d.name);
      this.#segmentIndexByName = new Map(descs.map((d, i) => [d.name, i]));
      this.#segmentValues = new Array(descs.length).fill(0);
      this.#segmentEmpty = new Array(descs.length).fill(true);

      for (let i = 0; i < descs.length; i++) {
         const d = descs[i];

         if (d.labelBefore) {
            const lbl = document.createElement("span");
            lbl.className = "prefix-text";
            lbl.textContent = d.labelBefore;
            area.appendChild(lbl);
         }

         const span = document.createElement("span");
         span.className = d.extraClass ? `segment ${d.extraClass}` : "segment";
         span.setAttribute("role", "spinbutton");
         span.setAttribute("aria-label", d.label);
         span.setAttribute("aria-valuemin", d.min);
         span.setAttribute("aria-valuemax", d.max);
         span.contentEditable = "true";
         span.inputMode = "none";
         span.style.width = `${d.pad}ch`;
         // First and last segments are tab stops for entry into the component
         span.tabIndex = i === 0 || i === descs.length - 1 ? 0 : -1;
         span.dataset.index = i;
         area.appendChild(span);
         this.#segments.push(span);

         if (d.labelAfter) {
            const lbl = document.createElement("span");
            lbl.className = "label-text";
            lbl.textContent = d.labelAfter;
            area.appendChild(lbl);
         }

         const sep = seps[i];
         if (sep !== undefined && sep !== "" && i < descs.length - 1) {
            const sepSpan = document.createElement("span");
            // Separators can be strings or { text, className } objects
            const isObj = typeof sep === "object" && sep !== null;
            const text = isObj ? sep.text : sep;
            const extra = isObj && sep.className ? ` ${sep.className}` : "";
            sepSpan.className = `separator${extra}`;
            sepSpan.textContent = text;
            area.appendChild(sepSpan);
         }
      }

      const suffix = this.constructor.suffix;
      if (suffix) {
         const suf = document.createElement("span");
         suf.className = "suffix";
         suf.textContent = suffix;
         area.appendChild(suf);
      }

      const wrapper = document.createElement("div");
      wrapper.className = "input-wrapper";
      wrapper.append(area);
      this.shadowRoot.replaceChildren(wrapper);
   }

   #initDefaults() {
      const descs = this.activeDescriptors;
      for (let i = 0; i < descs.length; i++) {
         this.#segmentValues[i] = descs[i].default ?? descs[i].min;
         this.#segmentEmpty[i] = true;
      }
   }

   // ── Rendering ────────────────────────────────────────────────────────────
   #render() {
      const descs = this.activeDescriptors;
      for (let i = 0; i < this.#segments.length; i++) {
         const val = this.#segmentValues[i];
         const d = descs[i];
         if (this.#segmentEmpty[i]) {
            this.#segments[i].textContent = "–".repeat(d.pad);
            this.#segments[i].removeAttribute("aria-valuenow");
         } else {
            const text = String(val).padStart(d.pad, "0");
            this.#segments[i].textContent = text;
            this.#segments[i].setAttribute("aria-valuenow", val);
         }
      }
   }

   #syncFormValue() {
      if (this.hasAttribute("disabled")) {
         this.#internals.setFormValue(null);
         this.#internals.setValidity({});
         this.#syncStates();
         return;
      }
      if (this.#segmentEmpty.some((e) => e)) {
         this.#internals.setFormValue("");
         if (this.hasAttribute("required")) {
            this.#internals.setValidity(
               { valueMissing: true },
               "Please fill out this field.",
               this.#segments[0],
            );
         } else {
            this.#internals.setValidity({});
         }
         this.#syncStates();
         return;
      }
      let value;
      try {
         value = this.formattedValue;
      } catch (e) {
         this.#internals.setFormValue("");
         this.#internals.setValidity(
            { customError: true },
            e?.message || "Invalid temporal value.",
            this.#segments[0],
         );
         this.#syncStates();
         return;
      }
      this.#internals.setFormValue(value);
      this.#validateRange(value);
      this.#syncStates();
   }

   #validateRange(value = null) {
      // min/max attributes are validity-strict: if the author supplied an
      // unparseable string, throw rather than silently skipping the bound.
      if (this.#minRaw != null && this._compareValues(this.#minRaw, this.#minRaw) === null) {
         throw new RangeError(
            `${this.tagName.toLowerCase()}: min="${this.#minRaw}" is not a valid value for this component`,
         );
      }
      if (this.#maxRaw != null && this._compareValues(this.#maxRaw, this.#maxRaw) === null) {
         throw new RangeError(
            `${this.tagName.toLowerCase()}: max="${this.#maxRaw}" is not a valid value for this component`,
         );
      }
      if (value == null) {
         try {
            value = this.formattedValue;
         } catch (e) {
            this.#internals.setValidity(
               { customError: true },
               e?.message || "Invalid temporal value.",
               this.#segments[0],
            );
            return;
         }
      }
      const cmpMin = this.#minRaw != null ? this._compareValues(value, this.#minRaw) : null;
      const cmpMax = this.#maxRaw != null ? this._compareValues(value, this.#maxRaw) : null;
      const underflow = cmpMin !== null && cmpMin < 0;
      const overflow = cmpMax !== null && cmpMax > 0;

      if (underflow || overflow) {
         this.#internals.setValidity(
            { rangeUnderflow: underflow, rangeOverflow: overflow },
            underflow
               ? `Value must be ${this.#minRaw} or later.`
               : `Value must be ${this.#maxRaw} or earlier.`,
            this.#segments[0],
         );
      } else {
         this.#internals.setValidity({});
      }
   }

   /**
    * Contract: compare two formatted value strings. Used to evaluate the
    * `min` / `max` attributes for native-style range validation.
    *
    * Returning `null` means a parse failed. The caller decides what to do:
    * `#validateRange` treats a null comparison against the current value as
    * "no validation possible" (legitimate when the field is empty), but
    * treats an unparseable `min` / `max` attribute as a hard error and
    * throws — author-supplied bounds must be valid.
    *
    * @param {string} _a
    * @param {string} _b
    * @returns {-1|0|1|null} null when either string is unparseable
    */
   _compareValues(_a, _b) {
      return null;
   }

   // ── Custom states (mirrors native pseudo-classes) ────────────────────────
   #syncStates() {
      const states = this.#internals.states;
      const set = (name, on) => (on ? states.add(name) : states.delete(name));
      const isRequired = this.hasAttribute("required");
      const isValid = this.#internals.validity.valid;
      const isDisabled = this.hasAttribute("disabled");

      set("required", isRequired);
      set("optional", !isRequired);

      if (isDisabled) {
         for (const s of ["invalid", "valid", "user-invalid", "user-valid", "in-range", "out-of-range"]) {
            states.delete(s);
         }
         return;
      }

      set("invalid", !isValid);
      set("valid", isValid);

      const v = this.#internals.validity;
      const outOfRange = v.rangeUnderflow || v.rangeOverflow;
      set("out-of-range", outOfRange);
      set("in-range", !outOfRange);

      if (this.#userInteracted) {
         set("user-invalid", !isValid);
         set("user-valid", isValid);
      } else {
         states.delete("user-invalid");
         states.delete("user-valid");
      }
   }

   #syncAndNotify() {
      this.#userInteracted = true;
      this.#syncFormValue();
      this.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
   }

   /**
    * Hook: called after a single segment value changes. Use for
    * dependent-value clamping (e.g. clamp day when month changes).
    * Must NOT trigger render/sync — the caller handles that.
    *
    * @param {number} _index
    * @param {string} _name
    */
   _onSegmentValueChanged(_index, _name) {}

   /**
    * Hook: dynamic upper bound for a segment. Override to compute a max
    * that depends on other segments (e.g. days in month based on current
    * month/year).
    *
    * @param {string} name
    * @param {SegmentDescriptor} desc
    * @returns {number} effective max value
    */
   _getEffectiveMax(name, desc) {
      return desc.max;
   }

   /**
    * Rebuild DOM after descriptor/separator changes (e.g. unit-window
    * attribute toggled on a subclass). Subclasses must update
    * `_instanceDescriptors` and `_instanceSeparators` BEFORE calling this.
    * Segment values are preserved by name; segments dropped by the new
    * descriptor list are discarded.
    */
   _rebuild() {
      if (!this.#connected) return;
      const saved = new Map();
      for (let i = 0; i < this.#segmentNames.length; i++) {
         saved.set(this.#segmentNames[i], {
            value: this.#segmentValues[i],
            empty: this.#segmentEmpty[i],
         });
      }
      this.#buildDOM();
      const newDescs = this.activeDescriptors;
      for (let i = 0; i < newDescs.length; i++) {
         const desc = newDescs[i];
         const prev = saved.get(desc.name);
         if (prev) {
            this.#segmentValues[i] = this.#clamp(prev.value, desc.name, desc);
            this.#segmentEmpty[i] = prev.empty;
         } else {
            this.#segmentValues[i] = desc.default ?? desc.min;
            this.#segmentEmpty[i] = true;
         }
      }
      this.#render();
      this.#syncFormValue();
   }

   // ── Event handling ───────────────────────────────────────────────────────
   #onKeyDown = (e) => {
      if (this.hasAttribute("disabled")) return;
      const idx = this.#focusedIndex();
      if (idx < 0) return;

      const readonly = this.hasAttribute("readonly");
      const desc = this.activeDescriptors[idx];

      switch (e.key) {
         case "ArrowUp":
            e.preventDefault();
            if (!readonly) this.#nudge(idx, 1);
            break;
         case "ArrowDown":
            e.preventDefault();
            if (!readonly) this.#nudge(idx, -1);
            break;
         case "ArrowRight":
            if (idx < this.#segments.length - 1) {
               e.preventDefault();
               this.#focusSegment(idx + 1);
            }
            break;
         case "ArrowLeft":
            if (idx > 0) {
               e.preventDefault();
               this.#focusSegment(idx - 1);
            }
            break;
         case "Tab":
            if (e.shiftKey) {
               if (idx === 0) return; // let browser exit to previous element
               e.preventDefault();
               this.#focusSegment(idx - 1);
            } else {
               if (idx >= this.#segments.length - 1) return; // let browser exit to next element
               e.preventDefault();
               this.#focusSegment(idx + 1);
            }
            break;
         case "Backspace":
         case "Delete":
            e.preventDefault();
            if (!readonly) {
               this.#segmentValues[idx] = desc.default ?? desc.min;
               this.#segmentEmpty[idx] = true;
               this.#render();
               this.#syncAndNotify();
            }
            break;
         case "n":
            if (this.hasAttribute("hotkeys")) {
               e.preventDefault();
               if (!readonly) this._setToNow();
            }
            break;
         default:
            if (DIGIT_RE.test(e.key)) {
               e.preventDefault();
               if (!readonly) this.#handleDigit(idx, e.key);
            }
            break;
      }
   };

   #onFocus = (e) => {
      if (this.hasAttribute("disabled")) return;
      const seg = e.target.closest(".segment");
      if (seg) {
         this.#clearDigitBuffer();
      }
   };

   #onPointerDown = (e) => {
      if (this.hasAttribute("disabled")) {
         e.preventDefault();
         return;
      }
      const seg = e.target.closest(".segment");
      if (!seg) {
         if (e.target.closest(".separator")) return;
         e.preventDefault();
         this.focusFirstSegment();
         return;
      }
      const idx = parseInt(seg.dataset.index, 10);
      this.#focusSegment(idx);
      e.preventDefault();
   };

   #onBeforeInput = (e) => {
      e.preventDefault();
   };

   #onCopy = (e) => {
      e.preventDefault();
      if (this.hasAttribute("disabled")) return;
      if (this.#segmentEmpty.some((e) => e)) return;
      e.clipboardData.setData("text/plain", this.formattedValue);
   };

   #onPaste = (e) => {
      e.preventDefault();
      if (this.hasAttribute("disabled") || this.hasAttribute("readonly")) return;
      const text = e.clipboardData?.getData("text");
      if (text) this.#handlePasteText(text);
   };

   #handlePasteText(text) {
      const trimmed = text.trim();
      if (!trimmed) return;

      // Single-segment paste: all digits matching focused segment's pad length
      const idx = this.#focusedIndex();
      if (idx >= 0 && /^\d+$/.test(trimmed)) {
         const desc = this.activeDescriptors[idx];
         if (trimmed.length === desc.pad) {
            const num = parseInt(trimmed, 10);
            const max = this._getEffectiveMax(desc.name, desc);
            this.setSegmentValue(idx, Math.min(num, max));
            this.dispatchEvent(
               new Event("change", { bubbles: true, composed: true }),
            );
            return;
         }
      }

      // Full ISO parse
      // When pattern is set, use strict _parseStrictValue (native format only)
      // When pattern is absent, use flexible _parsePasteValue (any ISO8601)
      const before = this.formattedValue;
      if (this.hasAttribute("pattern")) {
         this._parseStrictValue(trimmed);
      } else {
         this._parsePasteValue(trimmed);
      }
      if (this.formattedValue !== before) {
         this.#render();
         this.#syncAndNotify();
         this.dispatchEvent(
            new Event("change", { bubbles: true, composed: true }),
         );
      }
   }

   #addListeners() {
      this.shadowRoot.addEventListener("keydown", this.#onKeyDown);
      this.shadowRoot.addEventListener("focusin", this.#onFocus);
      this.shadowRoot.addEventListener("pointerdown", this.#onPointerDown);
      this.shadowRoot.addEventListener("beforeinput", this.#onBeforeInput);
      this.shadowRoot.addEventListener("copy", this.#onCopy);
      this.shadowRoot.addEventListener("paste", this.#onPaste);
      this.addEventListener("invalid", this.#onInvalid);
   }

   #removeListeners() {
      this.shadowRoot.removeEventListener("keydown", this.#onKeyDown);
      this.shadowRoot.removeEventListener("focusin", this.#onFocus);
      this.shadowRoot.removeEventListener("pointerdown", this.#onPointerDown);
      this.shadowRoot.removeEventListener("beforeinput", this.#onBeforeInput);
      this.shadowRoot.removeEventListener("copy", this.#onCopy);
      this.shadowRoot.removeEventListener("paste", this.#onPaste);
      this.removeEventListener("invalid", this.#onInvalid);
   }

   // Browser fires `invalid` on form-associated elements during a failed
   // submission attempt (and on checkValidity/reportValidity). Treat that as
   // user interaction so styling switches from neutral to invalid.
   #onInvalid = () => {
      if (this.#userInteracted) return;
      this.#userInteracted = true;
      this.#syncStates();
   };

   // ── Disabled state ──────────────────────────────────────────────────────
   #applyDisabledState(isDisabled) {
      const last = this.#segments.length - 1;
      const tabIndex = isDisabled ? -1 : 0;
      if (this.#segments[0]) this.#segments[0].tabIndex = tabIndex;
      if (last > 0 && this.#segments[last]) this.#segments[last].tabIndex = tabIndex;
      if (isDisabled) {
         this.shadowRoot.activeElement?.blur();
      }
      this.#syncFormValue();
   }

   // ── Segment helpers ──────────────────────────────────────────────────────
   #focusedIndex() {
      const active = this.shadowRoot.activeElement;
      if (!active || !active.classList.contains("segment")) return -1;
      return parseInt(active.dataset.index, 10);
   }

   #focusSegment(idx) {
      if (idx >= 0 && idx < this.#segments.length) {
         const last = this.#segments.length - 1;
         this.#segments.forEach((s, i) => {
            s.tabIndex = i === idx || i === 0 || i === last ? 0 : -1;
         });
         this.#segments[idx].focus();
         this.#clearDigitBuffer();
      }
   }

   #nudge(idx, direction) {
      const desc = this.activeDescriptors[idx];
      const max = this._getEffectiveMax(desc.name, desc);
      // From empty state: wrapping segments → Up=min, Down=max;
      // non-wrapping segments with default → Up=default, Down=default-1
      if (this.#segmentEmpty[idx]) {
         let val;
         if (desc.default != null && !desc.wrap) {
            val = direction > 0 ? desc.default : desc.default - 1;
         } else {
            val = direction > 0 ? desc.min : max;
         }
         this.setSegmentValue(idx, Math.max(desc.min, Math.min(max, val)));
         return;
      }
      let val = this.#segmentValues[idx] + direction;
      if (desc.wrap) {
         if (val > max) val = desc.min;
         else if (val < desc.min) val = max;
      } else {
         val = Math.max(desc.min, Math.min(max, val));
      }
      this.setSegmentValue(idx, val);
   }

   #clamp(val, name, desc) {
      const max = this._getEffectiveMax(name, desc);
      return Math.max(desc.min, Math.min(max, val));
   }

   // ── Digit entry ──────────────────────────────────────────────────────────
   // Auto-advance when the buffered digits can't accept any more without
   // overflowing the segment's max. Prepending a 0 (nextMin = num * 10) is
   // the cheapest peek at "would another digit still fit?" — if it would
   // overflow, commit and advance now rather than waiting for the timeout.
   #handleDigit(idx, digit) {
      const desc = this.activeDescriptors[idx];
      this.#digitBuffer += digit;

      const maxDigits = String(desc.max).length; // Use static max for field width
      const effectiveMax = this._getEffectiveMax(desc.name, desc);
      const num = parseInt(this.#digitBuffer, 10);

      const couldGrow = this.#digitBuffer.length < maxDigits;
      const nextMin = num * 10;
      const willOverflow = nextMin > effectiveMax;

      if (!couldGrow || willOverflow) {
         this.setSegmentValue(idx, Math.min(num, effectiveMax));
         this.#clearDigitBuffer();
         if (idx < this.#segments.length - 1) {
            this.#focusSegment(idx + 1);
         }
      } else {
         this.setSegmentValue(idx, num);
         clearTimeout(this.#digitTimer);
         this.#digitTimer = setTimeout(() => {
            this.#clearDigitBuffer();
         }, 1000);
      }
   }

   #clearDigitBuffer() {
      this.#digitBuffer = "";
      clearTimeout(this.#digitTimer);
      this.#digitTimer = null;
   }
}

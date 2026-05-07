/**
 * <nova-clock> — Live UTC clock display for ops center use.
 *
 * Attributes:
 *   smallest-unit — minute | second | millisecond | microsecond | nanosecond
 *   show-date     — when present, prepends ordinal date (YYYY-DDD)
 *   stopped       — when present, pauses the clock
 */

import { createNovaStyleSheets } from "../nova-stylesheets.js";
import {
   nowUTC,
   formatTime,
   formatOrdinalDate,
   temporalToTimeRecord,
} from "./nova-temporal.js";

const clockSheet = new CSSStyleSheet();
clockSheet.replaceSync(`
  :host {
    display: inline-block;
    font-family: var(--input-font-family, var(--font-stack));
    font-size: 1.75rem;
    font-variant-numeric: tabular-nums slashed-zero;
    font-feature-settings: "cv01", "cv02", "cv03", "cv04", "cv05", "cv06", "cv07", "cv08", "cv09", "cv11", "cv10";
    line-height: var(--input-line-height, var(--line-height));
    color: var(--input-text-color);
  }

  .suffix {
    opacity: 0.6;
  }

  .date {
    margin-inline-end: 0.35em;
  }
`);

export class NovaClock extends HTMLElement {
   static get observedAttributes() {
      return ["smallest-unit", "show-date", "stopped"];
   }

   #timer = null;
   #display;
   #dateSpan;
   #timeSpan;
   #suffixSpan;

   constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot.adoptedStyleSheets = createNovaStyleSheets(clockSheet);

      this.#display = document.createElement("time");
      this.#dateSpan = document.createElement("span");
      this.#dateSpan.className = "date";
      this.#timeSpan = document.createElement("span");
      this.#timeSpan.className = "time";
      this.#suffixSpan = document.createElement("span");
      this.#suffixSpan.className = "suffix";
      this.#suffixSpan.textContent = "Z";

      this.#display.append(this.#dateSpan, this.#timeSpan, this.#suffixSpan);
      this.shadowRoot.appendChild(this.#display);
   }

   connectedCallback() {
      this.#syncDateVisibility();
      this.#tick();
      this.#startTimer();
   }

   disconnectedCallback() {
      this.#stopTimer();
   }

   attributeChangedCallback(name) {
      if (name === "stopped") {
         if (this.hasAttribute("stopped")) {
            this.#stopTimer();
         } else {
            this.#tick();
            this.#startTimer();
         }
      } else if (name === "show-date") {
         this.#syncDateVisibility();
         this.#tick();
      } else {
         this.#tick();
         this.#startTimer();
      }
   }

   /** @returns {"minute"|"second"|"millisecond"|"microsecond"|"nanosecond"} */
   get smallestUnit() {
      return this.getAttribute("smallest-unit") || "second";
   }

   /** @param {"minute"|"second"|"millisecond"|"microsecond"|"nanosecond"} v */
   set smallestUnit(v) {
      this.setAttribute("smallest-unit", v);
   }

   /** @returns {boolean} */
   get showDate() {
      return this.hasAttribute("show-date");
   }

   /** @param {boolean} v */
   set showDate(v) {
      if (v) this.setAttribute("show-date", "");
      else this.removeAttribute("show-date");
   }

   #syncDateVisibility() {
      this.#dateSpan.hidden = !this.showDate;
   }

   #tick() {
      const now = nowUTC();
      const unit = this.smallestUnit;

      this.#timeSpan.textContent = formatTime(temporalToTimeRecord(now), unit);

      if (this.showDate) {
         const pd = now.toPlainDate();
         this.#dateSpan.textContent = formatOrdinalDate({
            year: pd.year,
            dayOfYear: pd.dayOfYear,
         });
      }
   }

   #startTimer() {
      if (this.hasAttribute("stopped")) return;
      this.#stopTimer();

      if (["millisecond", "microsecond", "nanosecond"].includes(this.smallestUnit)) {
         // ~10fps for subsecond display — sufficient visual fidelity
         const step = () => {
            this.#tick();
            this.#timer = setTimeout(step, 100);
         };
         step();
      } else {
         // Boundary-synced: calculate time until next displayed unit boundary.
         // Each tick resyncs. Multiple instances stay aligned.
         this.#scheduleNextTick();
      }
   }

   #scheduleNextTick() {
      const now = Temporal.Now.instant();
      const currentMs = now.epochMilliseconds;
      const boundary = this.smallestUnit === "minute" ? 60000 : 1000;
      const msUntilNext = boundary - (currentMs % boundary);

      this.#timer = setTimeout(() => {
         this.#tick();
         this.#scheduleNextTick();
      }, msUntilNext);
   }

   #stopTimer() {
      if (this.#timer == null) return;
      clearTimeout(this.#timer);
      this.#timer = null;
   }
}

customElements.define("nova-clock", NovaClock);

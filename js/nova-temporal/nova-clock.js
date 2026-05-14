/**
 * <nova-clock> — Live UTC clock display for ops center use.
 *
 * Attributes:
 *   smallest-unit — minute | second | millisecond | microsecond | nanosecond
 *   hide-date     — when present, hides the ordinal date (shown by default)
 *   hide-year     — when present, shows only the day-of-year (DDD) without the year
 *   zone          — military (NATO single-letter) time zone, default "Z" (UTC)
 *   stopped       — when present, pauses the clock
 */

import { createNovaStyleSheets } from "../nova-stylesheets.js";
import {
   formatTime,
   formatOrdinalDate,
   temporalToTimeRecord,
   militaryZoneOffset,
} from "./nova-temporal.js";
import { reportNovaError } from "./nova-temporal-errors.js";

const clockSheet = new CSSStyleSheet();
clockSheet.replaceSync(`
  :host {
    display: inline-block;
    font-family: var(--font-stack--monospace);
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

/** @param {number} hours integer offset, -12..12 — converts to an ISO timezone string */
function offsetToTimeZone(hours) {
   if (hours === 0) return "UTC";
   const sign = hours > 0 ? "+" : "-";
   return `${sign}${String(Math.abs(hours)).padStart(2, "0")}:00`;
}

const TIME_PLACEHOLDERS = {
   minute: "HH:MM",
   second: "HH:MM:SS",
   millisecond: "HH:MM:SS.mmm",
   microsecond: "HH:MM:SS.uuuuuu",
   nanosecond: "HH:MM:SS.nnnnnnnnn",
};

export class NovaClock extends HTMLElement {
   static get observedAttributes() {
      return ["smallest-unit", "hide-date", "hide-year", "zone", "stopped"];
   }

   #timer = null;
   #display;
   #dateSpan;
   #timeSpan;
   #suffixSpan;
   #lastReportedInvalidZone = null;

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
      } else if (name === "hide-date") {
         this.#syncDateVisibility();
         this.#tick();
      } else if (name === "hide-year") {
         this.#tick();
      } else if (name === "zone") {
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
   get hideDate() {
      return this.hasAttribute("hide-date");
   }

   /** @param {boolean} v */
   set hideDate(v) {
      if (v) this.setAttribute("hide-date", "");
      else this.removeAttribute("hide-date");
   }

   /** @returns {boolean} */
   get hideYear() {
      return this.hasAttribute("hide-year");
   }

   /** @param {boolean} v */
   set hideYear(v) {
      if (v) this.setAttribute("hide-year", "");
      else this.removeAttribute("hide-year");
   }

   /** @returns {string} normalized single-letter military zone code (default "Z") */
   get zone() {
      const raw = this.getAttribute("zone");
      return raw == null || raw === "" ? "Z" : raw.toUpperCase();
   }

   /** @param {string} v */
   set zone(v) {
      this.setAttribute("zone", v);
   }

   #syncDateVisibility() {
      this.#dateSpan.hidden = this.hideDate;
   }

   #tick() {
      const rawZone = this.zone;
      const offset = militaryZoneOffset(rawZone);

      if (offset === null) {
         if (this.#lastReportedInvalidZone !== rawZone) {
            this.#lastReportedInvalidZone = rawZone;
            reportNovaError(
               this,
               "invalid-zone",
               `Invalid military zone "${rawZone}" — showing placeholders`,
               { zone: rawZone },
            );
         }
         this.#timeSpan.textContent =
            TIME_PLACEHOLDERS[this.smallestUnit] ?? TIME_PLACEHOLDERS.second;
         this.#suffixSpan.textContent = "?";
         this.#display.removeAttribute("datetime");
         if (!this.hideDate) {
            this.#dateSpan.textContent = this.hideYear ? "DDD" : "YYYY-DDD";
         } else {
            this.#dateSpan.textContent = "";
         }
         return;
      }

      this.#lastReportedInvalidZone = null;

      const zdt = Temporal.Now.zonedDateTimeISO(offsetToTimeZone(offset));
      const local = zdt.toPlainDateTime();
      const unit = this.smallestUnit;

      this.#timeSpan.textContent = formatTime(
         temporalToTimeRecord(local),
         unit,
      );
      this.#suffixSpan.textContent = rawZone;
      this.#display.setAttribute(
         "datetime",
         zdt.toString({ timeZoneName: "never" }),
      );

      if (!this.hideDate) {
         const pd = local.toPlainDate();
         const ordinal = formatOrdinalDate({
            year: pd.year,
            dayOfYear: pd.dayOfYear,
         });
         this.#dateSpan.textContent = this.hideYear
            ? ordinal.slice(ordinal.indexOf("-") + 1)
            : ordinal;
      }
   }

   #startTimer() {
      if (this.hasAttribute("stopped")) return;
      this.#stopTimer();

      if (
         ["millisecond", "microsecond", "nanosecond"].includes(
            this.smallestUnit,
         )
      ) {
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

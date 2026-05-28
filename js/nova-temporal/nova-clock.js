/**
 * <nova-clock> — Live UTC clock display for ops center use.
 *
 * Attributes:
 *   smallest-unit — minute | second | millisecond | microsecond | nanosecond
 *   format        — "ordinal" (YYYY-DDD, default) or "date" (YYYY-MM-DD)
 *   hide-date     — when present, hides the date (shown by default)
 *   hide-year     — when present, shows the date without the year (DDD or MM-DD)
 *   zone          — military (NATO single-letter) time zone, default "Z" (UTC)
 *   stopped       — when present, pauses the clock
 *
 * CSS custom properties:
 *   Defaults inherit from the surrounding text — set any of these to opt in.
 *   Per-component `--clock-*` tokens win over the shared `--time-*` family;
 *   set `--time-*` once to style both <nova-clock> and <nova-elapsed>, or
 *   override per component.
 *
 *   --time-font-family,    --clock-font-family
 *   --time-font-size,      --clock-font-size
 *   --time-font-weight,    --clock-font-weight
 *   --time-line-height,    --clock-line-height
 *   --time-color,          --clock-color
 *   --time-background,     --clock-background
 *   --time-border,         --clock-border           (shorthand)
 *   --time-border-radius,  --clock-border-radius
 *   --time-padding,        --clock-padding
 *   --time-outline,        --clock-outline          (shorthand)
 *   --time-outline-offset, --clock-outline-offset
 *
 *   Component-only:
 *     --clock-suffix-opacity  — opacity of the trailing zone letter (default 0.6)
 */

import { createNovaStyleSheets } from "../nova-stylesheets.js";
import {
   formatTime,
   formatCalendarDate,
   formatOrdinalDate,
   temporalToTimeRecord,
   militaryZoneOffset,
} from "./nova-temporal.js";
import { reportNovaError } from "./nova-temporal-errors.js";

const clockSheet = new CSSStyleSheet();
clockSheet.replaceSync(`
  :host {
    display: inline-block;
    font-variant-numeric: tabular-nums slashed-zero;
    font-feature-settings: "case", "cv01", "cv02", "cv03", "cv04", "cv05", "cv06", "cv07", "cv08", "cv09", "cv11", "cv10";

    font-family: var(--clock-font-family, var(--time-font-family));
    font-size: var(--clock-font-size, var(--time-font-size));
    font-weight: var(--clock-font-weight, var(--time-font-weight));
    line-height: var(--clock-line-height, var(--time-line-height));
    color: var(--clock-color, var(--time-color));
    background: var(--clock-background, var(--time-background));
    border: var(--clock-border, var(--time-border));
    border-radius: var(--clock-border-radius, var(--time-border-radius));
    padding: var(--clock-padding, var(--time-padding));
    outline: var(--clock-outline, var(--time-outline));
    outline-offset: var(--clock-outline-offset, var(--time-outline-offset));
  }

  .suffix {
    opacity: var(--clock-suffix-opacity, 0.6);
    margin-inline-start: 1px;
  }

  /* Mirrors .datetime-separator in nova-segment-input-base.js */
  .datetime-separator {
    opacity: var(--clock-suffix-opacity, 0.6);
    margin-inline-start: 3px;
    margin-inline-end: 2px;
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

const DATE_PLACEHOLDERS = {
   ordinal: { full: "YYYY-DDD", noYear: "DDD" },
   date: { full: "YYYY-MM-DD", noYear: "MM-DD" },
};

export class NovaClock extends HTMLElement {
   static get observedAttributes() {
      return [
         "smallest-unit",
         "format",
         "hide-date",
         "hide-year",
         "zone",
         "stopped",
      ];
   }

   #timer = null;
   #display;
   #dateSpan;
   #dateSeparator;
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
      this.#dateSeparator = document.createElement("span");
      this.#dateSeparator.className = "datetime-separator";
      this.#dateSeparator.textContent = "T";
      this.#timeSpan = document.createElement("span");
      this.#timeSpan.className = "time";
      this.#suffixSpan = document.createElement("span");
      this.#suffixSpan.className = "suffix";
      this.#suffixSpan.textContent = "Z";

      this.#display.append(
         this.#dateSpan,
         this.#dateSeparator,
         this.#timeSpan,
         this.#suffixSpan,
      );
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
      } else if (name === "hide-year" || name === "format") {
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

   /** @returns {"ordinal"|"date"} date rendering style (default "ordinal") */
   get format() {
      return this.getAttribute("format") === "date" ? "date" : "ordinal";
   }

   /** @param {"ordinal"|"date"} v */
   set format(v) {
      this.setAttribute("format", v);
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
      const hidden = this.hideDate;
      this.#dateSpan.hidden = hidden;
      this.#dateSeparator.hidden = hidden;
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
            const placeholders = DATE_PLACEHOLDERS[this.format];
            this.#dateSpan.textContent = this.hideYear
               ? placeholders.noYear
               : placeholders.full;
         } else {
            this.#dateSpan.textContent = "";
         }
         return;
      }

      this.#lastReportedInvalidZone = null;

      const zdt = Temporal.Now.zonedDateTimeISO(offsetToTimeZone(offset));
      const local = zdt.toPlainDateTime();
      const unit = this.smallestUnit;

      const timeText = formatTime(temporalToTimeRecord(local), unit);
      this.#timeSpan.textContent = timeText;
      this.#suffixSpan.textContent = rawZone;

      // datetime attribute mirrors what's rendered: the date in the active
      // format, time truncated to `smallest-unit`, and the military zone
      // letter ("Z" for UTC, single letter for the others). Full-precision
      // offset form would contradict the visible text.
      const pd = local.toPlainDate();
      const dateText =
         this.format === "date"
            ? formatCalendarDate({
                 year: pd.year,
                 month: pd.month,
                 day: pd.day,
              })
            : formatOrdinalDate({
                 year: pd.year,
                 dayOfYear: pd.dayOfYear,
              });

      if (!this.hideDate) {
         this.#dateSpan.textContent = this.hideYear
            ? dateText.slice(dateText.indexOf("-") + 1)
            : dateText;
      }

      this.#display.setAttribute(
         "datetime",
         this.hideDate
            ? `${timeText}${rawZone}`
            : `${dateText}T${timeText}${rawZone}`,
      );
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

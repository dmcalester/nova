/**
 * nova-temporal-errors.js — shared error reporting for the nova-temporal package.
 *
 * Two responsibilities:
 *   1. Dispatch a `nova-error` CustomEvent on the offending element so the host
 *      app can decide what to show (toast, log, telemetry, alert, …).
 *   2. Log to the console. Dev mode preserves the verbose pre-existing
 *      `console.warn(...)` shape; production mode emits a single canonical
 *      sentence with no detail leakage.
 *
 * The host app calls `setNovaEnv("production")` once at startup. Default is
 * `"development"`. The repo has no bundler, so detection cannot be build-time;
 * runtime config is the only option that doesn't pollute globals.
 *
 * Event shape matches existing nova-temporal events (`precision-truncated`,
 * `temporal-change`):
 *   bubbles: true, composed: true, detail with flat keys.
 */

const PROD_MESSAGE =
   "[nova-temporal] Error handling must be defined for operational environments and adhere to each environment's security posture.";

/** @typedef {"development"|"production"} NovaEnv */

/** @type {NovaEnv} */
let currentEnv = "development";

/**
 * @param {NovaEnv} env
 */
export function setNovaEnv(env) {
   if (env !== "development" && env !== "production") {
      throw new RangeError(
         `setNovaEnv: expected "development" or "production", got ${JSON.stringify(env)}`,
      );
   }
   currentEnv = env;
}

/** @returns {NovaEnv} */
export function getNovaEnv() {
   return currentEnv;
}

/**
 * Dispatch a `nova-error` event on `target` and log to the console.
 *
 * The event always fires (in both envs) so host-app telemetry works
 * uniformly. Only the console output differs by env.
 *
 * @param {EventTarget|null} target  - element to dispatch from; null = log only
 * @param {string} code              - discriminator, e.g. "paste-parse-error"
 * @param {string} message           - dev-mode human message
 * @param {object} [info]            - optional context (text, attr, error, …)
 */
export function reportNovaError(target, code, message, info) {
   if (target && typeof target.dispatchEvent === "function") {
      target.dispatchEvent(
         new CustomEvent("nova-error", {
            bubbles: true,
            composed: true,
            detail: { code, message, info },
         }),
      );
   }

   if (currentEnv === "production") {
      console.warn(PROD_MESSAGE);
      return;
   }

   const tag =
      target && /** @type {Element} */ (target).tagName
         ? `[${/** @type {Element} */ (target).tagName.toLowerCase()}]`
         : "[nova-temporal]";
   if (info !== undefined) {
      console.warn(`${tag} ${message}`, info);
   } else {
      console.warn(`${tag} ${message}`);
   }
}

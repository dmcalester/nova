/**
 * Nova Constructable Stylesheets
 *
 * Shared CSS for Nova web components.
 *
 * Design tokens (spacing, colors, typography, etc.) are defined on :root in
 * the page-level CSS files (nova-tokens.css, nova-colors.css, form-controls.css)
 * and inherit into shadow DOM naturally via CSS custom properties.
 *
 * This module provides:
 *   - A box-sizing/font-smoothing reset for shadow DOM  (novaResetSheet)
 *   - Shared host-level input states for form-associated components  (novaInputStatesSheet)
 *   - Helpers to compose component sheets with the above  (createNovaStyleSheets, createNovaInputStyleSheets)
 *
 * ── Shadow / Page CSS Duplication ─────────────────────────────────────────────
 *
 * Shadow DOM components cannot inherit structural CSS rules from the page —
 * only custom property values cross the boundary. Visual states that exist in
 * both places (nova-form-controls.css for native elements, this file and each
 * component's local sheet for shadow DOM) are duplicated by hand.
 *
 * Rules that mirror a page-level counterpart are marked with a plain inline
 * comment of the form: "mirrors <selector> in <file>".
 *
 * Drift prevention is deferred to post-v1. See
 * docs/superpowers/specs/2026-04-23-css-drift-prevention-deferred.md
 * for the design notes.
 *
 * What lives in novaInputStatesSheet:
 *   Host-level cursor and interaction states that are identical across all
 *   Nova input-like components.
 *
 * What lives in each component's local sheet:
 *   Visual chrome (border, background, color on disabled/hover/focus) —
 *   because some components style :host directly, others style an inner
 *   wrapper element.
 */

// ============================================================================
// Nova RESET STYLESHEET
// ============================================================================

/**
 * Base reset for shadow DOM components
 * Provides consistent box-sizing and font smoothing
 */
export const novaResetSheet = new CSSStyleSheet();

novaResetSheet.replaceSync(`
  :host {
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    -webkit-text-size-adjust: 100%;
    -moz-osx-font-smoothing: grayscale;
    font-optical-sizing: auto;
    text-rendering: optimizeLegibility;
    font-smooth: always;

    font-feature-settings:
       "cv01", /* open 6 */
       "cv02", /* open 4 */
       "cv03", /* letter? */
       "cv04", /* baseline shifted colon */
       "cv06",
       "cv07", /* single story a */
       "cv08", /* slashed zero */
       "cv09",
       "cv11",
       "cv10",
       "ss04",
       "zero" 1;

   font-family: var(--font-stack);
  }

  *, *::before, *::after {
    box-sizing: inherit;
  }
`);

// ============================================================================
// NOVA INPUT STATES STYLESHEET
// ============================================================================

/**
 * Shared host-level behavioral states for Nova form-associated shadow DOM
 * components. Applied via createNovaInputStyleSheets().
 *
 * Only host-level cursor and interaction states live here — rules that are
 * identical across all input-like components regardless of their internal DOM
 * structure. Visual chrome (disabled colors, focus ring placement) stays in
 * each component's local sheet because the target element differs.
 */
export const novaInputStatesSheet = new CSSStyleSheet();
novaInputStatesSheet.replaceSync(`
  /* mirrors .nova-input:disabled in nova-form-controls.css */
  :host([disabled]) {
    cursor: not-allowed;
    pointer-events: none;
  }

  /* mirrors .nova-input:read-only in nova-form-controls.css */
  :host([readonly]) {
    cursor: copy;
  }
`);

// ============================================================================
// CONVENIENCE EXPORTS
// ============================================================================

/**
 * Base stylesheets for Nova shadow DOM components (reset only).
 * Design tokens inherit from :root via CSS custom properties.
 */
export const novaBaseSheets = [novaResetSheet];

/**
 * Base stylesheets for Nova form-associated input components.
 * Includes the reset and shared host-level input states.
 */
export const novaInputBaseSheets = [novaResetSheet, novaInputStatesSheet];

/**
 * Helper to create a stylesheet array for general shadow DOM components.
 * Includes only the reset — use createNovaInputStyleSheets for form inputs.
 *
 * @param {CSSStyleSheet} componentSheet - The component-specific stylesheet
 * @returns {CSSStyleSheet[]} Array of stylesheets ready for adoptedStyleSheets
 */
export function createNovaStyleSheets(componentSheet) {
   return [...novaBaseSheets, componentSheet];
}

/**
 * Helper to create a stylesheet array for Nova form-associated input components.
 * Includes the reset and shared input states (disabled, readonly cursors).
 * Each component's local sheet handles its visual chrome, with inline "mirrors
 * … in nova-form-controls.css" comments pointing back to the page-level rule.
 *
 * @param {CSSStyleSheet} componentSheet - The component-specific stylesheet
 * @returns {CSSStyleSheet[]} Array of stylesheets ready for adoptedStyleSheets
 */
export function createNovaInputStyleSheets(componentSheet) {
   return [...novaInputBaseSheets, componentSheet];
}

// ============================================================================
// BROWSER COMPATIBILITY CHECK
// ============================================================================

/**
 * Check if Constructable Stylesheets are supported
 * @returns {boolean} Whether the browser supports CSSStyleSheet constructor
 */
export function supportsConstructableStylesheets() {
   try {
      new CSSStyleSheet();
      return true;
   } catch (e) {
      return false;
   }
}

/**
 * Log a warning if Constructable Stylesheets are not supported
 * Only runs once on first import
 */
if (!supportsConstructableStylesheets()) {
   console.warn(
      "Nova: Constructable Stylesheets are not supported in this browser. " +
         "Components may not render correctly. Consider using a polyfill or updating your browser.",
   );
}

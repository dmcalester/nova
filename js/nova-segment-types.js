/**
 * Type definitions for segmented numeric inputs.
 *
 * Generic shape consumed by NovaSegmentInputBase. Domain-specific descriptor
 * builders (e.g. nova-temporal-segments.js) produce values matching these
 * shapes.
 */

/**
 * @typedef {Object} SegmentDescriptor
 * @property {string} name           - stable key (e.g. "year", "hour", "ms")
 * @property {string} label          - aria-label
 * @property {number} min
 * @property {number} max
 * @property {number} pad            - display width in characters
 * @property {boolean} [wrap]        - wrap to min when stepping past max (and vice versa)
 * @property {number} [default]      - initial value before user interaction
 * @property {string} [field]        - record field name (for time/duration descriptors)
 * @property {string} [labelAfter]   - small suffix label rendered after the segment (e.g. "d")
 * @property {string} [labelBefore] - small prefix label rendered before the segment
 * @property {string} [extraClass]   - additional CSS class on the segment span
 */

/**
 * @typedef {string|{text: string, className?: string}} SegmentSeparator
 */

export {};

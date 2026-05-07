---
bundle: nova-temporal :: bundled reference
purpose: Topic → file:section navigation index for the satops-time agent.
how-to-use: |
  Read this file first when answering a normative timekeeping question. Use
  the topic entries to find the right file and section number, then jump
  there directly with `grep -n "^## N.M"` and `read offset/limit`. Never
  read a Tier 1 reference file in full.
maintained-by: Hand-curated. Section numbers verified against the bundled
  files at index time. If a CCSDS issue is updated, regenerate this index.
last-verified: 2026-04-28
---

# Bundled Reference Index

This file maps common timekeeping topics to specific sections in
`ai/references/`. It is hand-curated against the bundled markdown extracts
and is the agent's first stop for any normative question.

For each topic: **primary spec** is the authoritative section to quote;
**related coverage** lists supporting context elsewhere in the bundle.

## How to use this index

1. Match the user's question to a topic below.
2. Open the **primary spec** file. `grep -n "^## N.M"` to land on the heading.
3. `read` with `offset` (the grep line number) and `limit` (~20-50 lines) to
   pull just the section.
4. Quote verbatim, cite as `[<doc-id> §N.M]`.

If no topic matches, fall back to keyword grep across all files. Do not
guess section numbers from memory.

---

## Time scales

### UTC (Coordinated Universal Time) — definition and behavior

- **Primary spec:** `naif-spice-time.md` §"Coordinated Universal Time (UTC)" (around line 287)
- **Related:**
  - Leap-second mechanism: `naif-spice-time.md` §"Leapseconds" (line 356)
  - UTC tied to Earth rotation: `naif-spice-time.md` §"Tying UTC to the Earth's Rotation" (line 345)
  - UTC ↔ TAI naming: `naif-spice-time.md` §"Naming the seconds of TAI --- UTC" (line 309)
  - UTC as a TIME_SYSTEM keyword value (CCSDS messages):
    - `ccsds-502.0-b-3-orbit-data-messages.md` §3.2.3 (OPM metadata, line 813); annex B subsection B3
    - `ccsds-503.0-b-2-cor1-tracking-data-message.md` §3.3 TDM METADATA (line 725) and §3.4 (line 1426); ANNEX B (line 2737)

### TAI (International Atomic Time)

- **Primary spec:** `naif-spice-time.md` §"International Atomic Time (TAI)" (line 298)
- **Related:**
  - TAI/UTC offset history: `naif-spice-time.md` §"Naming the seconds of TAI --- UTC" (line 309)

### GPS time

- **Primary coverage:** `naif-spice-time.md` (covered in passing within the UTC discussion ~line 287). The standards bundle does NOT include IS-GPS-200, which is the authoritative GPS time spec. Treat any GPS-time normative claim that depends on IS-GPS-200 as `JUDGMENT` unless the user supplies the standard or you fetch via Tier 2.
- **Used as a TIME_SYSTEM keyword value:** see `ccsds-502.0-b-3` and `ccsds-503.0-b-2` annex B references above.

### TDB / ET (Barycentric Dynamical Time / Ephemeris Time)

- **Primary spec:** `naif-spice-time.md` §"Barycentric Dynamic Time (TDB)" (line 414) through §"In the Toolkit ET Means TDB" (line 497)
- **Related:**
  - TT vs. TDB: `naif-spice-time.md` §"Terrestrial Time (TT)" (line 451), §"The Relationship between TT and TDB" (line 462)
  - UTC ↔ TDB conversion: `naif-spice-time.md` §"Computing UTC from TDB" (line 552)
  - DeltaET formulation: `naif-spice-time.md` §"Problems With the Formulation of DeltaET" (line 647)

### TT (Terrestrial Time)

- **Primary spec:** `naif-spice-time.md` §"Terrestrial Time (TT)" (line 451)

### SCLK (Spacecraft Clock)

- **Primary spec:** `naif-spice-time.md` §"Spacecraft Clock (SCLK)" (line 703)
- **Related conversion functions:** `naif-spice-time.md` §"Function to convert a spacecraft clock time string to TDB (ET)" (line 840); §"Function to convert a TDB (ET) to Spacecraft Clock time string" (line 915)

### MET / MRT (Mission Elapsed / Relative Time)

- **Primary use:** `ccsds-502.0-b-3-orbit-data-messages.md` line ~910 (TIME_SYSTEM keyword discussion of MET/MRT)

---

## Leap seconds

- **Primary spec:** `naif-spice-time.md` §"Leapseconds" (line 356) and §"The Leapseconds Kernel (LSK)" (line 399)
- **In CCSDS time codes:** `ccsds-301.0-b-4-time-code-formats.md` — 18 hits across the document; check §3.3 (CCSDS Day Segmented Time Code) for how leap seconds appear in CDS encoding
- **Note:** The current TAI−UTC offset (37 s as of 2017) is not a normative claim found in the bundle — it is published by BIPM. Treat as `CONVENTION` with a pointer to BIPM Circular T unless quoting NAIF directly.

---

## Epochs

### J2000.0 epoch

- **Primary spec:** `naif-spice-time.md` §"The J2000 Epoch" (line 427)

### Julian Date

- **Primary spec:** `naif-spice-time.md` §"Julian Date" (line 730), §"The abbreviation JD" (line 753)

### CCSDS epoch (1958-01-01 TAI)

- **Primary spec:** `ccsds-301.0-b-4-time-code-formats.md` — referenced in §3.2 (CCSDS Unsegmented Time Code, line 421) and §3.3 (CCSDS Day Segmented Time Code, line 469); search for "1958" in 301.

### TLE epoch format (YYDDD.DDDDDDDD)

- **Not authoritatively specified in the bundle.** The TLE format is governed by NORAD/Space-Track external to CCSDS. CCSDS 502.0-B-3 has 45 mentions of TLE/two-line element but as a referenced format, not a specification of it. Treat TLE format claims as `CONVENTION` and direct users to the NORAD/Space-Track format documentation.

---

## CCSDS time code formats

All in `ccsds-301.0-b-4-time-code-formats.md`:

- §3.1 TIME CODE FIELDS (line 386), §3.1.1 P-Field (line 388), §3.1.2 T-Field (line 416)
- §3.2 CCSDS UNSEGMENTED TIME CODE (CUC) (line 421)
- §3.3 CCSDS DAY SEGMENTED TIME CODE (CDS) (line 469)
- §3.4 CCSDS CALENDAR SEGMENTED TIME CODE (CCS) (line 513)
- §3.5 CCSDS ASCII CALENDAR SEGMENTED TIME CODE (line 576)
- §3.6 AGENCY-DEFINED CODES (line 679)

### Sub-second resolution in CCSDS codes

- CDS encoding of submillisecond segment: `ccsds-301.0-b-4` line 489–510 (millisecond / microsecond / picosecond options)
- CUC extended microsecond precision: line 889
- 1 nanosecond resolution: line 1246

### Categorizing of CCSDS time codes

- `ccsds-301.0-b-4` §1.3 CATEGORIZING OF CCSDS TIME CODE FORMATS (line 257)

---

## CCSDS message keyword references

### TIME_SYSTEM keyword (allowed values: UTC, TAI, GPS, TT, TDB, MET, MRT, ...)

- **Defined values, OPM/OMM/OEM:** `ccsds-502.0-b-3-orbit-data-messages.md` §3.2.3 (line 813), specific keyword listing around lines 888–914; full value list in ANNEX B (line 6252)
- **Defined values, TDM:** `ccsds-503.0-b-2-cor1-tracking-data-message.md` §3.3 TDM METADATA (line 725); §3.4.8 (line 1475); ANNEX B "VALUES FOR TIME_SYSTEM AND REFERENCE_FRAME" (line 2737)

### CREATION_DATE keyword (UTC timestamp on message creation)

- **OPM:** `ccsds-502.0-b-3` §3.2.2 OPM HEADER (line 769); 38 occurrences across the document. Search via `grep -n CREATION_DATE` to find specific normative usage.
- **TDM:** `ccsds-503.0-b-2` §3.2 TDM HEADER (line 660); 30 occurrences.

### EPOCH field (per-message reference time)

- **OPM:** `ccsds-502.0-b-3` §3.2.4 OPM DATA (line 934)
- **OMM:** `ccsds-502.0-b-3` §4.2.4 OMM DATA (line 1285)
- **OEM:** `ccsds-502.0-b-3` §5.2.3 OEM METADATA (line 1575)
- **OCM:** `ccsds-502.0-b-3` §6.2.4 OCM METADATA (line 2016)
- **TDM:** `ccsds-503.0-b-2` §3.4 TDM DATA SECTION (line 1426)

### CLOCK_BIAS / CLOCK_DRIFT (TDM)

- `ccsds-503.0-b-2-cor1-tracking-data-message.md` §3.5.6 TIME RELATED KEYWORDS (line 1972)
  - §3.5.6.1 CLOCK_BIAS (~line 1974)
  - §3.5.6.2 CLOCK_DRIFT (~line 1996)

---

## Date and time format conventions

### Ordinal date (YYYY-DDD) / day-of-year format

- **Primary spec (ASCII calendar form):** `ccsds-301.0-b-4-time-code-formats.md` §3.5 CCSDS ASCII CALENDAR SEGMENTED TIME CODE (line 576) — defines both YYYY-MM-DD and YYYY-DDD forms with optional sub-second extensions
- **In NAIF/SPICE parser:** `naif-spice-time.md` §"ISO Formats" (line 2136), §"Other Calendar Formats" (line 2188)
- **In CCSDS messages:** `ccsds-502.0-b-3` and `ccsds-503.0-b-2` use the §7.5 / §4.3 ODM/TDM VALUES sections to constrain date formats (502 line 4148; 503 line 2150)

### ISO 8601 conventions

- **NAIF parser support:** `naif-spice-time.md` §"ISO Formats" (line 2136)
- **CCSDS:** §3.5 of 301.0-B-4 specifies ASCII calendar codes that align with ISO 8601 date forms; check directly there for exact compliance vs. divergence.

---

## Conversions and computations

### UTC ↔ TDB

- `naif-spice-time.md` §"Computing UTC from TDB" (line 552); §"Function to convert UTC to TDB (ET)" (line 819); §"Function to convert a TDB (ET) to UTC" (line 886)

### Time string parsing

- `naif-spice-time.md` §"Parsing Time Strings" (line 1286); Appendix C "Parsing Time Strings" (line 1823)

### Difference between TDB (ET) and UTC

- `naif-spice-time.md` §"Function to compute the difference between TDB (ET) and UTC" (line 1023)

---

## Operational practice (NOT in bundle — judgment territory)

These topics commonly come up but are **not** authoritatively specified in
the bundled standards. Tag answers as `CONVENTION` or `JUDGMENT` rather than
`SPECIFIED`. Do not invent section numbers for these.

- **AOS/LOS scheduling precision norms** — operational practice, not standardized; program ICDs govern
- **DST exclusion in operational systems** — universal convention in DoD/civil space, not formally mandated by CCSDS
- **1 ns ≈ 30 cm ranging error** — derivable from the speed of light; cite physical constant, not a standard
- **Zulu / NATO phonetic alphabet origin of "Z" suffix** — convention; not a CCSDS document
- **GMT/UT1/Solar/Sidereal time relationships** — astrodynamics territory; the bundle does not include the relevant IAU/IERS specs. NAIF SPICE references some related concepts incidentally.

---

## Document overviews (for "what's in this standard?" questions)

- **CCSDS 301.0-B-4** — Time Code Formats. Specifies CUC, CDS, CCS, ASCII calendar, agency-defined time codes. The authoritative reference for CCSDS time encoding.
- **CCSDS 502.0-B-3** — Orbit Data Messages. Specifies OPM, OMM, OEM, OCM message structures and KVN/XML syntax for orbit data interchange. Time content: TIME_SYSTEM keyword values, CREATION_DATE/EPOCH fields.
- **CCSDS 503.0-B-2 Cor. 1** — Tracking Data Message. Specifies TDM structure, metadata, and per-keyword definitions for tracking data exchange. Time content: TIME_SYSTEM, EPOCH, CLOCK_BIAS/DRIFT, time-related keyword section §3.5.6.
- **CCSDS 500.2-G-3** — Navigation Data Messages Overview (Green Book — informational, not normative). Cross-references and contextualizes 502, 503, and other navigation messages. Use when a question is about *which* document specifies *what*.
- **NAIF SPICE Time** — JPL's authoritative treatment of operational time systems for deep space, but with broad applicability to LEO/GEO ground operations as well. Best single source for UTC/TAI/TDB/TT/SCLK relationships.

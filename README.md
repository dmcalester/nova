# Nova

> Zero-dependency, precise, fast, safe, enterprise-grade web components for the space domain. Currently shipping `nova-temporal` — date, time, duration, and datetime inputs built on the TC39 Temporal API.

**Status:** Alpha — actively looking for feedback. Open a thread in [GitHub Discussions](https://github.com/dmcalester/nova/discussions).

## Core Principles

The Nova UI library was created as an outlet for my favorite questions “What if?”, in fact there’s a messier library I have called WIDS (What If? Design System) where these components started. So if you see any wids remnanents hanging around that’s why.


### Zero Run Time Dependencies
Copy-paste the JS and CSS and this library will run (in supported browsers). No frameworks, no libraries. No build required build steps†, no concatenation, obfuscation or minimization. No wrappers. 

### Use What You Have, Buy What You Can, Build What You Need
This was a mantra I heard over and over again working in the Space Force. Nova is *Build What You Need* — it extends the web platform rather than replacing it. Every line of JavaScript in Nova exists to provide functionality the platform doesn’t already offer. No wrappers around native elements, no JavaScript coats of paint, no replacements for components the platform already handles well — select menus, buttons, and basic inputs are not Nova’s job. Nova plays first with the platform and avoids unnecessary specificity to any single framework. A component that works in plain HTML works the same in React, Angular, or anything else.

### Fail Loudly, Never Silently
Bad input, invalid state, and contract violations fail loudly at the developer level by default — they throw or surface visible errors, never silent fallbacks. Lenient handling is opt-in, never the default. Silent failures are how off-by-a-leap-second telemetry ships; Nova refuses to be the source of that bug.

### Enterprise UX
Nova components are biased to enterprise users. Nova assumes use cases are for complex, information dense systems where users have a high degree of training. Nova biases to improving accuracy, precision and velocity over intuitive or consumer-level usability rules. In practice this means:
- Keyboard-first navigation.
- System consistency components have as close to a 1:1 behavior as the underlying system
- GOMS modeling for heuristic evaluation loops to minimize user interfactions

### Speed is UX
Nova components are fanatically tuned and optimized to be as fast as possible. From local caching, optimized rendering techniques, platform-first features, local fonts, modern web and service workers.

## Components

- [`js/nova-temporal/`](js/nova-temporal/README.md) — Date, time, duration, and datetime input components built on the Temporal API.

## Browser Support

Nova targets browsers that ship [TC39 Temporal](https://tc39.es/proposal-temporal/) natively. No polyfill is bundled and none is intended.

- Chrome 144+
- Edge 144+
- Firefox 139+
- Opera 128+

Safari is not yet supported — Temporal is still rolling out there.

## Quick Start

Nova is delivered as source. Copy the files you need into your project — no install, no build, no CDN.

```html
<link rel="stylesheet" href="css/nova-temporal.css">
<script type="module" src="js/nova-temporal/index.js"></script>

<nova-datetime value="2026-04-30T12:00:00Z"></nova-datetime>
```

See [`js/nova-temporal/README.md`](js/nova-temporal/README.md) for the full set of components, attributes, and events.

## Theming

Theming is driven by CSS custom properties. The token layers live under [`css/`](css/):

- [`nova-tokens.css`](css/nova-tokens.css) — primitive tokens (color ramps, sizes, type scale, motion).
- [`nova-tokens--semantic.css`](css/nova-tokens--semantic.css) — semantic tokens that map primitives to roles (surface, text, border, focus, etc.).

Override any token at `:root` or a scoped selector to retheme without touching component source.

### Color System (experimental)

The color layer ([`css/nova-colors.css`](css/nova-colors.css)) is built on **OKLCH** and the modern `color()` `from` syntax. Colors are procedurally generated with light- and dark-mode adaptations that automatically preserve contrast across the palette.

This is the active color path — it works and is in use, but expect refinements as browser support for the CSS Color 4/5 features matures. Build on the tokens and you should be insulated from churn; depend on the procedural internals at your own risk.

## Accessibility

A11y is a known gap and an active work area. The Enterprise UX principle (keyboard-first, system-consistent behavior) sets the direction, but Nova does not yet make a formal claim against WCAG. Issues, feedback, and PRs welcome.

## AI Agents

Nova ships with specialist agents under [`ai/agents/`](ai/agents/) that you can install into your local AI coding assistant. They are scoped narrowly so they trigger only on the kinds of questions where they actually help. Both of these agents were used during development.

- **`temporal-reviewer`** — Reviews JS/TS code through the lens of the Temporal API. Catches wrong type choices (`Instant` vs `ZonedDateTime`, `PlainDate` where calendar-aware arithmetic is coming), silent option-dropping in `with()`/`add()`/`since()`, lossy conversions to/from legacy `Date`, and helpers that re-implement built-in Temporal methods. Stays out of unrelated style/architecture review.
- **`satops-time`** — Satellite-ops timekeeping authority. Answers normative questions about CCSDS time codes, timescale relationships (UTC/TAI/GPS/TDB/SCLK), ordinal date conventions, and AOS/LOS precision practice. Cites standards and distinguishes specified vs. convention vs. judgment. Does not review code.
  - Bundled standards (extracts under [`ai/references/`](ai/references/); links go to authoritative sources):
    - [CCSDS 301.0-B-4 — Time Code Formats](https://ccsds.org/Pubs/301x0b4e1.pdf)
    - [CCSDS 502.0-B-3 — Orbit Data Messages](https://ccsds.org/Pubs/502x0b3e1.pdf)
    - [CCSDS 503.0-B-2 Cor. 1 — Tracking Data Message](https://ccsds.org/Pubs/503x0b2c1.pdf)
    - [CCSDS 500.2-G-3 — Navigation Data Messages Overview (Green Book)](https://ccsds.org/Pubs/500x2g3.pdf)
    - [NAIF SPICE — Time Systems Required Reading](https://naif.jpl.nasa.gov/pub/naif/toolkit_docs/C/req/time.html)

> [!CAUTION]
> AI agents can hallucinate. These agents support rapid prototyping and initial development. All questions regarding specific time implementations should be validated by human subject matter experts

### Why install them

Nova is built on the TC39 Temporal API spec to support accurate and precise time while minimizing the footguns present in JavaScripts Date Object. While the Temporal API is excellent at strict handling of datetime, adding to it can re-introduce problems and most timekeeping mistakes don't surface as obvious bugs — they surface as off-by-a-leap-second telemetry, DST-ambiguous schedules, or a precision mismatch with the backend. The agents exist to enforce Temporal’s strict datetime handling and catch those before they ship:

- If you're **extending Nova** (adding components, reviewing PRs against `nova-temporal`), `temporal-reviewer` is the second pair of eyes you want on every change to the Temporal layer.
- If you're **consuming Nova** in a ground system and have to make a call ("do we display milliseconds or microseconds here?", "is ordinal date required or just convention?"), `satops-time` gives you a cited answer instead of a guess.

Skip them if your work doesn't touch Temporal types or operational time semantics.

### Install

Run the installer from the repo root and answer the prompts:

```sh
./scripts/install-agents.sh
```

> [!NOTE]
> These are **project-level** agents. The script writes every destination relative to the repo root (`./.claude/agents/`, `./.codex/agents/`, `./.agents/`) — nothing is installed to your home directory or any global config, and nothing outside this repo is touched. The agents are scoped to this project and only available when your AI assistant is operating in this directory.

It asks once per target:

| Harness     | Destination          | Notes                                         |
|-------------|----------------------|-----------------------------------------------|
| Claude Code | `.claude/agents/`    | Standard subagent location.                   |
| Codex CLI   | `.codex/agents/`     | Standard subagent location.                   |
| `.agents/`  | `.agents/`           | Non-standard; works with some harnesses (e.g. Pi) that read agent definitions from a harness-agnostic directory. |

Re-running the script overwrites installed copies, so updates to `ai/agents/*.md` propagate on the next run. The source files under `ai/agents/` are the authoritative copy — edit those, not the installed copies.

The agents are **repo-bound**: `satops-time` reads its CCSDS / NAIF reference bundle from [`ai/references/`](ai/references/) using paths relative to the repo root, so the installed agent only works when invoked from inside this repo. The references are not copied anywhere — they stay in `ai/references/` and the agent reads them in place.

## Contributing & Feedback

Nova is in alpha and explicitly looking for feedback.

- **Questions, ideas, design discussion** → [GitHub Discussions](https://github.com/dmcalester/nova/discussions)
- **Bugs** → [GitHub Issues](https://github.com/dmcalester/nova/issues)
- **Pull requests** → Welcome. For non-trivial changes, open a discussion first so we don't end up working at cross purposes.

## License

[Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)](LICENSE.md). The non-commercial clause is intentional — Nova is free to use, study, and build on for non-commercial work, and a commercially licensed version may be made available if there's interest. See [NOTICE](NOTICE) for attribution of bundled standards extracts under [`ai/references/`](ai/references/).

## FAQs

### Will there be a full Nova UI library?
No, I’m not interested in creating a design system. Nova exists to solve problems that aren’t solved by the platform. That said, the tokens, APIs, and behaviors defined here could be used to build standard components on top.

### Why no npm package?
Nova is meant to be opinionatedly unopinionated. Copy-paste keeps the surface small, the dependency graph empty, and the integration shape entirely up to you.

### Why only the space domain?
That's the audience and use cases I know best. The components themselves aren't space-specific — any data-dense, precision-critical, keyboard-first interface can use them.

---

† An optional build step does include concatenation and minimization for the smallest possible package size.

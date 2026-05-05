#!/usr/bin/env bash
#
# update-references.sh — refresh nova-temporal's bundled satops-time references.
#
# This script is OPTIONAL. The library ships with ai/references/ already
# populated; consumers do not need to run it. Use it to refresh the bundle
# when CCSDS or NAIF publishes a new issue, or to re-extract from updated
# source documents.
#
# Sources:
#   - 4 CCSDS publications (PDF → markdown via pdftotext + post-processing)
#   - 1 NAIF SPICE Time reference (HTML → markdown via pandoc)
#
# Output: ai/references/*.md, each with a provenance header carrying source
# URL, document ID, fetch date, and source sha256. Idempotent: a source
# whose sha256 matches the existing bundled file is skipped.
#
# Requirements: curl, pdftotext (poppler), pandoc, shasum or sha256sum, perl.

set -euo pipefail

# --- locate repo root from script location ----------------------------------

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "${script_dir}/.." && pwd)"
out_dir="${repo_root}/ai/references"
mkdir -p "${out_dir}"

# --- dep checks --------------------------------------------------------------

require() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "error: required tool '$1' not found in PATH" >&2
    [[ -n "${2:-}" ]] && echo "       install hint: $2" >&2
    exit 1
  fi
}

require curl       "curl ships with macOS and most Linux distros"
require pdftotext  "macOS: brew install poppler  |  Debian/Ubuntu: apt-get install poppler-utils"
require pandoc     "macOS: brew install pandoc   |  Debian/Ubuntu: apt-get install pandoc"
require perl       "perl ships with macOS and most Linux distros"

if command -v shasum >/dev/null 2>&1; then
  sha_cmd="shasum -a 256"
elif command -v sha256sum >/dev/null 2>&1; then
  sha_cmd="sha256sum"
else
  echo "error: neither shasum nor sha256sum found" >&2
  exit 1
fi

pdftotext_version="$(pdftotext -v 2>&1 | head -1 | sed 's/^/  /')"
pandoc_version="$(pandoc --version | head -1 | sed 's/^/  /')"
fetched_date="$(date -u +%Y-%m-%d)"

# --- source manifest ---------------------------------------------------------
#
# Pipe-delimited fields:
#   1: kind          — "ccsds" | "naif"
#   2: doc-id        — citation key (e.g. CCSDS 301.0-B-4)
#   3: doc-title     — human title
#   4: source URL
#   5: output filename (under ai/references/)

manifest=(
  "ccsds|CCSDS 301.0-B-4|Time Code Formats|https://ccsds.org/Pubs/301x0b4e1.pdf|ccsds-301.0-b-4-time-code-formats.md"
  "ccsds|CCSDS 502.0-B-3|Orbit Data Messages|https://ccsds.org/Pubs/502x0b3e1.pdf|ccsds-502.0-b-3-orbit-data-messages.md"
  "ccsds|CCSDS 503.0-B-2 Cor. 1|Tracking Data Message (with Corrigendum 1)|https://ccsds.org/Pubs/503x0b2c1.pdf|ccsds-503.0-b-2-cor1-tracking-data-message.md"
  "ccsds|CCSDS 500.2-G-3|Navigation Data Messages Overview (Green Book)|https://ccsds.org/Pubs/500x2g3.pdf|ccsds-500.2-g-3-navigation-data-messages-overview.md"
  "naif|NAIF SPICE Time|Time Systems Required Reading|https://naif.jpl.nasa.gov/pub/naif/toolkit_docs/C/req/time.html|naif-spice-time.md"
)

# --- attribution boilerplates ------------------------------------------------

ccsds_attribution=$'attribution: Derived from a CCSDS publication. Per the CCSDS Reproduction\n  Permission Statement (https://ccsds.org/publications/): "In general,\n  reasonable reuse of materials published in CCSDS documents is permitted\n  with attribution." For organizations that require formal written\n  permission, contact secretariat@mailman.ccsds.org.'

naif_attribution=$'attribution: Derived from NAIF/JPL SPICE documentation. Per NAIF rules\n  (https://naif.jpl.nasa.gov/naif/rules.html), inclusion of SPICE\n  documentation in third-party tools is authorized.'

# --- helpers -----------------------------------------------------------------

existing_sha() {
  # Print the source-sha256 recorded in an existing output file's header,
  # or empty string if the file or header is absent.
  local path="$1"
  [[ -f "$path" ]] || { printf ''; return; }
  awk -F': ' '/^source-sha256: / { print $2; exit } NR > 30 { exit }' "$path"
}

write_header() {
  local out="$1" kind="$2" doc_id="$3" doc_title="$4" url="$5" sha="$6" bytes="$7" converter="$8"
  local attribution
  case "$kind" in
    ccsds) attribution="$ccsds_attribution" ;;
    naif)  attribution="$naif_attribution" ;;
    *)     echo "error: unknown kind '$kind'" >&2; exit 1 ;;
  esac

  {
    echo "---"
    echo "bundle: nova-temporal :: bundled reference"
    echo "document-id: ${doc_id}"
    echo "document-title: ${doc_title}"
    echo "source-url: ${url}"
    echo "fetched: ${fetched_date}"
    echo "source-sha256: ${sha}"
    echo "source-bytes: ${bytes}"
    echo "converter: ${converter}"
    echo "${attribution}"
    echo "notice: This file is a derivative work. The original document at the"
    echo "  source URL above is authoritative; the agent must use this extract"
    echo "  only as a verbatim quote source, never as a substitute for the"
    echo "  original."
    echo "---"
    echo
  } > "$out"
}

# --- CCSDS post-processing ---------------------------------------------------
#
# Cleans pdftotext -layout output and injects markdown structure:
#   1. Strip recurring page footers (CCSDS docid + Page N + Month YYYY)
#   2. Strip recurring page headers (RECOMMENDED STANDARD / REPORT FOR ...)
#   3. Strip the "Recommendation for Space Data System Standards" boilerplate
#   4. Collapse runs of 3+ blank lines to 2
#   5. Convert numbered section headings to markdown (# / ## / ### / ####)
#   6. Convert "ANNEX X" headings to markdown
clean_ccsds() {
  local in_path="$1" out_path="$2"
  perl -ne '
    # Drop CCSDS running footers/headers and front-matter boilerplate.
    # Match any line that begins with the docid and contains "Page", regardless
    # of whether pdftotext wrapped the trailing date onto a separate line.
    next if /^\s*CCSDS\s+[\w.\-]+(?:\s+Cor\.\s*\d+)?\s+Page\b/;
    next if /^\s*CCSDS\s+(RECOMMENDED\s+STANDARD|REPORT|INFORMATIONAL\s+REPORT|GREEN\s+BOOK|RECOMMENDATION)\s+(FOR|CONCERNING)\s+/i;
    next if /^\s*Recommendation for Space Data System Standards\s*$/i;
    next if /^\s*Report Concerning Space Data System Standards\s*$/i;
    # Drop cover/footer fragments that pdftotext sometimes emits as standalone lines.
    # The provenance frontmatter already records docid, date, and book color.
    next if /^\s*CCSDS\s+[\w.\-]+(?:\s+Cor\.\s*\d+)?\s*$/;
    next if /^\s*(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\s*$/;
    next if /^\s*(BLUE|GREEN|MAGENTA|RED|PINK|YELLOW|WHITE|ORANGE|SILVER)\s+BOOK\s*$/i;
    next if /^\s*(RECOMMENDED\s+STANDARD|INFORMATIONAL\s+REPORT|RECOMMENDATION)\s*$/i;
    print;
  ' "$in_path" \
  | perl -0777 -pe '
    # Collapse runs of 3+ blank lines to 2
    s/\n{3,}/\n\n/g;
  ' \
  | perl -pe '
    # Inject markdown headings for numbered section titles.
    # Matches lines like "1.2.3   TITLE TEXT" where TITLE TEXT contains
    # at least three uppercase letters in a row (avoids matching prose
    # that happens to start with a section number).
    if (/^([0-9]+(?:\.[0-9]+)*)\s{2,}([A-Z][A-Z][A-Z][A-Z0-9 \-\/(),.]*?)\s*$/) {
      my ($num, $title) = ($1, $2);
      my $depth = 1 + ($num =~ tr/.//);
      $depth = 6 if $depth > 6;
      my $hashes = "#" x $depth;
      $_ = "$hashes $num $title\n";
    }
    # Annex headings
    elsif (/^\s*ANNEX\s+([A-Z])\s*(\([A-Z]+\))?\s*$/) {
      $_ = "# ANNEX $1" . ($2 ? " $2" : "") . "\n";
    }
  ' > "$out_path"
}

# --- NAIF HTML→Markdown conversion ------------------------------------------
clean_naif() {
  local in_path="$1" out_path="$2"
  # Strip layout-only table wrappers and bare anchor tags. NAIF wraps the
  # entire document body in <table>/<tr>/<td> for visual layout; pandoc's
  # gfm output cannot represent that as markdown and would either preserve
  # the raw HTML or collapse the entire document into [TABLE].
  perl -0777 -pe '
    s{</?(?:table|tbody|thead|tr|td|th|colgroup|col)\b[^>]*>}{}gi;
    s{<a name="[^"]*">[^<]*</a>}{}gi;
  ' "$in_path" \
  | pandoc \
      --from=html \
      --to=gfm \
      --wrap=none \
      --markdown-headings=atx \
      --shift-heading-level-by=0 \
  | perl -0777 -pe '
    s/\n{3,}/\n\n/g;
  ' > "$out_path"
}

# --- per-source pipeline -----------------------------------------------------

process() {
  local entry="$1"
  IFS='|' read -r kind doc_id doc_title url out_name <<< "$entry"
  local out_path="${out_dir}/${out_name}"

  echo
  echo "==> ${doc_id}"
  echo "    source : ${url}"
  echo "    output : ai/references/${out_name}"

  local tmp body
  tmp="$(mktemp -t novatemporal-src.XXXXXX)"
  body="$(mktemp -t novatemporal-body.XXXXXX)"
  trap 'rm -f "$tmp" "$body"' RETURN

  if ! curl -sSL --fail --max-time 60 -o "$tmp" "$url"; then
    echo "    ! download failed — skipping"
    return 1
  fi

  local sha bytes
  sha="$($sha_cmd "$tmp" | awk '{print $1}')"
  bytes="$(wc -c < "$tmp" | tr -d ' ')"

  local prev_sha
  prev_sha="$(existing_sha "$out_path")"
  if [[ -n "$prev_sha" && "$prev_sha" == "$sha" ]]; then
    echo "    = unchanged (sha256 matches existing bundle) — skipped"
    return 0
  fi

  case "$kind" in
    ccsds)
      local raw
      raw="$(mktemp -t novatemporal-raw.XXXXXX)"
      if ! pdftotext -layout "$tmp" "$raw" 2>/dev/null; then
        echo "    ! pdftotext failed"
        rm -f "$raw"
        return 1
      fi
      if [[ ! -s "$raw" ]]; then
        echo "    ! pdftotext produced empty output"
        rm -f "$raw"
        return 1
      fi
      clean_ccsds "$raw" "$body"
      rm -f "$raw"
      write_header "$out_path" "$kind" "$doc_id" "$doc_title" "$url" "$sha" "$bytes" "pdftotext -layout (poppler) + markdown post-processing"
      cat "$body" >> "$out_path"
      ;;
    naif)
      clean_naif "$tmp" "$body"
      if [[ ! -s "$body" ]]; then
        echo "    ! pandoc produced empty output"
        return 1
      fi
      write_header "$out_path" "$kind" "$doc_id" "$doc_title" "$url" "$sha" "$bytes" "pandoc html→gfm"
      cat "$body" >> "$out_path"
      ;;
  esac

  local out_bytes
  out_bytes="$(wc -c < "$out_path" | tr -d ' ')"
  echo "    + wrote ${out_bytes} bytes"
}

# --- main --------------------------------------------------------------------

echo "nova-temporal :: update bundled references"
echo "  output dir : ${out_dir}"
echo "  fetched    : ${fetched_date}"
echo "  pdftotext  :"
echo "${pdftotext_version}"
echo "  pandoc     :"
echo "${pandoc_version}"

failures=0
for entry in "${manifest[@]}"; do
  if ! process "$entry"; then
    failures=$((failures + 1))
  fi
done

echo
if (( failures > 0 )); then
  echo "done with ${failures} failure(s)"
  exit 1
fi

echo "done — bundle is up to date"

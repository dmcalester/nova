#!/usr/bin/env bash
#
# install-agents.sh — install nova's bundled AI agents into this repo for
# one or more coding assistants.
#
# Source:  ai/agents/*.md  (Claude-style markdown with YAML frontmatter:
#          name, description, tools)
#
# Targets (project-local; all created relative to the repo root):
#   Claude Code  .claude/agents/<name>.md      — literal copy
#   Codex CLI    .codex/agents/<name>.md       — literal copy (same format)
#   .agents/     .agents/<name>.md             — literal copy
#
# Note: `.agents/` is NOT a standardized location. It is an emerging
# convention picked up by some harnesses (e.g. Pi) that read agent
# definitions from a shared, harness-agnostic directory. Install it if
# your tooling reads from there; otherwise stick to the harness-specific
# targets above.
#
# Re-running the script overwrites existing installed copies so updates to
# files under ai/agents/ propagate. Sources are not modified.

set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "${script_dir}/.." && pwd)"
src_dir="${repo_root}/ai/agents"

if [[ ! -d "$src_dir" ]]; then
  echo "error: source directory not found: $src_dir" >&2
  exit 1
fi

shopt -s nullglob
agent_files=("$src_dir"/*.md)
shopt -u nullglob

if (( ${#agent_files[@]} == 0 )); then
  echo "error: no agent files found in $src_dir" >&2
  exit 1
fi

echo "nova :: install bundled agents"
echo "  source : ai/agents/  (${#agent_files[@]} agent$( (( ${#agent_files[@]} == 1 )) || echo s ))"
for f in "${agent_files[@]}"; do
  echo "    - $(basename "$f")"
done
echo

# --- prompt helper -----------------------------------------------------------

prompt_yn() {
  # $1 = question  → echoes "y" or "n"
  local reply
  while true; do
    read -r -p "$1 [y/N] " reply || reply=""
    case "${reply:-n}" in
      y|Y|yes|YES) echo "y"; return ;;
      n|N|no|NO|"") echo "n"; return ;;
    esac
  done
}

# --- installers --------------------------------------------------------------

install_to() {
  # $1 = relative destination dir (e.g. ".claude/agents")
  local rel="$1"
  local dest="${repo_root}/${rel}"
  mkdir -p "$dest"
  for f in "${agent_files[@]}"; do
    cp "$f" "$dest/$(basename "$f")"
    echo "  + ${rel}/$(basename "$f")"
  done
}

# --- main --------------------------------------------------------------------

echo "Note: .agents/ is non-standard but works with some harnesses (e.g. Pi)."
echo

claude_choice="$(prompt_yn "Install for Claude Code (.claude/agents/)?")"
codex_choice="$(prompt_yn  "Install for Codex CLI   (.codex/agents/)?")"
agents_choice="$(prompt_yn "Install to .agents/      (non-standard; e.g. Pi)?")"

if [[ "$claude_choice" == "n" && "$codex_choice" == "n" && "$agents_choice" == "n" ]]; then
  echo "nothing selected — exiting"
  exit 0
fi

echo
echo "installing..."

[[ "$claude_choice" == "y" ]] && install_to ".claude/agents"
[[ "$codex_choice"  == "y" ]] && install_to ".codex/agents"
[[ "$agents_choice" == "y" ]] && install_to ".agents"

echo
echo "done"

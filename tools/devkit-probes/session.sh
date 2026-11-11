#!/bin/bash
# Prototype probe (#3882): one headless session, reporting what it loaded from the devkit submodule.
#
# usage: session.sh <name> <prompt> [extra claude args...]   (run from the checkout under test)
# Prints the shared skills in the session's init message, the instruction files loaded (through an
# InstructionsLoaded hook), subagent starts, and the result text. Raw output goes to $PROBE_OUT.
#
# PROBE_SETTINGS adds settings JSON members, e.g. '"worktree":{"baseRef":"head"}' so that
# `--worktree` and worktree-isolated subagents branch from the checked-out commit, not origin/main.
P="$(cd "$(dirname "$0")" && pwd)"; name="$1"; prompt="$2"; shift 2
OUT="${PROBE_OUT:-${TMPDIR:-/tmp}/devkit-probes}"; mkdir -p "$OUT"
export PROBE_LOG="$OUT/$name.log"; : > "$PROBE_LOG"
hook="{\"type\":\"command\",\"command\":\"$P/log-hook.sh\"}"
claude -p --model haiku --output-format stream-json --verbose \
  --settings "{\"hooks\":{\"InstructionsLoaded\":[{\"hooks\":[$hook]}],\"SubagentStart\":[{\"hooks\":[$hook]}],\"PostToolUse\":[{\"matcher\":\"EnterWorktree\",\"hooks\":[$hook]}]}${PROBE_SETTINGS:+,$PROBE_SETTINGS}}" \
  "$prompt" "$@" < /dev/null > "$OUT/$name.jsonl" 2> "$OUT/$name.err"
echo "exit=$?"
jq -c 'select(.type=="system" and .subtype=="init") | {cwd, shared_skills: (.skills | map(select(test("slack-file|check-github-cli|update-glossary"))))}' "$OUT/$name.jsonl"
jq -r '[.hook_event_name, (.load_reason // .agent_type // ""), (.file_path // .cwd // "")] | @tsv' "$PROBE_LOG" 2>/dev/null | grep -v '/Users/tom/.claude/CLAUDE.md'
jq -r 'select(.type=="result") | "RESULT: " + (.result // "" | .[0:600])' "$OUT/$name.jsonl"

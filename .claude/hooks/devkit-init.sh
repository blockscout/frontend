#!/usr/bin/env bash
# Initialise the devkit submodule in a checkout that lacks it.
#
# Shared skills and rules are symlinks into `devkit/`. Git's post-checkout hook initialises
# the submodule for worktrees made with `git worktree add`, but worktrees Claude Code makes
# itself (`claude --worktree`, the EnterWorktree tool, a subagent with `isolation: worktree`)
# skip that hook, so the submodule is empty there and every symlink dangles.
#
# Registered for SessionStart, SubagentStart and PostToolUse(EnterWorktree). Skill discovery
# runs before SessionStart hooks finish, hence `reloadSkills` on that event.

set -uo pipefail

payload="$(cat)"
field() { printf '%s' "$payload" | jq -r "$1" 2>/dev/null; }

event="$(field '.hook_event_name // empty')"
dir="$(field '.tool_response.worktreePath // .tool_response.worktree_path // .cwd // empty')"
[ -n "$dir" ] && [ -d "$dir" ] || dir="$PWD"

root="$(git -C "$dir" rev-parse --show-toplevel 2>/dev/null)" || exit 0
[ -f "$root/.gitmodules" ] || exit 0
[ -e "$root/devkit/.git" ] && exit 0

if ! git -C "$root" submodule update --init --quiet devkit >&2; then
  jq -n --arg event "$event" '{hookSpecificOutput: {hookEventName: $event, additionalContext: "The devkit submodule failed to initialise, so the shared skills and rules (symlinks into `devkit/`) are NOT available in this checkout. Run `git submodule update --init devkit`; a new session is needed for the skills to load."}}'
  exit 0
fi

[ "$event" = "SessionStart" ] && echo '{"hookSpecificOutput":{"hookEventName":"SessionStart","reloadSkills":true}}'
exit 0

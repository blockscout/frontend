#!/usr/bin/env bash
# Initialise the devkit submodule when a session starts in a checkout that lacks it.
#
# Shared skills and rules are symlinks into `devkit/`. A worktree made by `claude --worktree`
# does not run git's post-checkout hook, so the submodule is empty there and every symlink
# dangles. Skill discovery runs before SessionStart hooks finish, hence `reloadSkills`.

set -uo pipefail

payload="$(cat)"
dir="$(printf '%s' "$payload" | jq -r '.cwd // empty' 2>/dev/null)"
[ -n "$dir" ] && [ -d "$dir" ] || dir="$PWD"

root="$(git -C "$dir" rev-parse --show-toplevel 2>/dev/null)" || exit 0
[ -f "$root/.gitmodules" ] || exit 0
[ -e "$root/devkit/.git" ] && exit 0

if ! git -C "$root" submodule update --init --quiet devkit >&2; then
  jq -n '{hookSpecificOutput: {hookEventName: "SessionStart", additionalContext: "The devkit submodule failed to initialise, so the shared skills and rules (symlinks into `devkit/`) are NOT loaded in this session. Run `git submodule update --init devkit` and restart the session."}}'
  exit 0
fi

echo '{"hookSpecificOutput":{"hookEventName":"SessionStart","reloadSkills":true}}'

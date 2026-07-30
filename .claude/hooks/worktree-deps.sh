#!/usr/bin/env bash
# Install node_modules on demand inside linked git worktrees.
#
# A worktree is a bare `git checkout`: gitignored paths like node_modules are never
# carried over, so anything that shells out to the local toolchain fails there. Copying
# node_modules is not an option — pnpm's layout is mostly symlinks into .pnpm, and Claude
# Code's .worktreeinclude copier skips symlinks, so the result would be a broken tree. A
# real `pnpm install` is cheap instead: the global store is content-addressed and linked
# into place (cloned on APFS), so a second worktree shares blocks rather than duplicating
# them.
#
# Installing is deferred to the first command that actually needs deps, so read-only
# sessions (review, explore, research) never pay for it.
#
# Modes:
#   session-start  announce missing deps, install nothing
#   pre-bash       install before a command that needs deps, block if the install fails

set -uo pipefail

mode="${1:-}"
payload="$(cat)"

field() { printf '%s' "$payload" | jq -r "$1" 2>/dev/null; }

dir="$(field '.cwd // empty')"
[ -n "$dir" ] && [ -d "$dir" ] || dir="$PWD"

root="$(git -C "$dir" rev-parse --show-toplevel 2>/dev/null)" || exit 0
[ -n "$root" ] || exit 0

# Linked worktrees have their own gitdir under the shared common dir; the main checkout
# has the two paths identical. Detecting it this way rather than by matching
# .claude/worktrees/ also covers worktrees created by hand elsewhere.
gitdir="$(git -C "$root" rev-parse --absolute-git-dir 2>/dev/null)" || exit 0
common="$(git -C "$root" rev-parse --path-format=absolute --git-common-dir 2>/dev/null)" || exit 0
[ "$gitdir" != "$common" ] || exit 0

[ -f "$root/pnpm-lock.yaml" ] || exit 0
# .modules.yaml rather than the directory, so a half-written install still gets repaired.
[ -f "$root/node_modules/.modules.yaml" ] && exit 0

if [ "$mode" = "session-start" ]; then
  jq -n '{
    hookSpecificOutput: {
      hookEventName: "SessionStart",
      additionalContext: "This worktree has no node_modules. A PreToolUse hook runs `pnpm install --frozen-lockfile` automatically before the first Bash command that needs the local toolchain (pnpm/npx/eslint/tsc/vitest/playwright/next), so do not install by hand. Expect that one command to take an extra minute."
    }
  }'
  exit 0
fi

[ "$mode" = "pre-bash" ] || exit 0

cmd="$(field '.tool_input.command // empty')"
[ -n "$cmd" ] || exit 0

needs='(^|[;&|(]|&&|\|\|)[[:space:]]*(pnpm|npx|next|eslint|tsc|vitest|playwright)[[:space:]]|node_modules/\.bin/'
# Dependency-management subcommands run fine without node_modules, and skipping them
# keeps the hook from recursing into the install it is about to perform.
selfmanaged='pnpm[[:space:]]+(install|i|add|remove|rm|up|update|dlx|store|why|licenses|approve-builds|rebuild)([[:space:]]|$)'

printf '%s' "$cmd" | grep -Eq "$needs" || exit 0
printf '%s' "$cmd" | grep -Eq "$selfmanaged" && exit 0

pnpm_bin="$(command -v pnpm 2>/dev/null)"
if [ -z "$pnpm_bin" ]; then
  # Hooks do not always inherit a login shell's PATH, so try the usual install roots.
  for candidate in "$HOME/Library/pnpm/pnpm" "$HOME/.local/share/pnpm/pnpm" \
                   $(ls -t "$HOME"/.nvm/versions/node/*/bin/pnpm 2>/dev/null); do
    [ -x "$candidate" ] && pnpm_bin="$candidate" && break
  done
fi
if [ -z "$pnpm_bin" ]; then
  echo "Cannot install worktree deps: pnpm is not on PATH for hooks. Install manually in $root." >&2
  exit 2
fi

log="$(mktemp)"
if (cd "$root" && "$pnpm_bin" install --frozen-lockfile --prefer-offline >"$log" 2>&1); then
  rm -f "$log"
  jq -n --arg root "$root" '{ systemMessage: ("Installed node_modules in worktree " + $root) }'
  exit 0
fi

tail -20 "$log" >&2
rm -f "$log"
echo "pnpm install --frozen-lockfile failed in $root, so this command would fail on missing deps. Fix the install first." >&2
exit 2

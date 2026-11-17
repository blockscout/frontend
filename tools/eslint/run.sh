#!/bin/bash

# Usage: tools/eslint/run.sh [--changed[=<ref>]] [<eslint args>...] [<path>...]
#   (no path)            the whole repo
#   <path>...            only those files or directories
#   --changed[=<ref>]    files this branch changed vs <ref> (default origin/main), including
#                        uncommitted and untracked ones; exits 0 when nothing lintable changed

set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$DIR/../.." && pwd)"
BIN="$ROOT/node_modules/.bin/eslint"

cd "$ROOT"

BASE_REF=origin/main
CHANGED=0
ARGS=()
for arg in "$@"; do
  case "$arg" in
    --changed) CHANGED=1 ;;
    --changed=*) CHANGED=1; BASE_REF="${arg#--changed=}" ;;
    *) ARGS+=("$arg") ;;
  esac
done

if [ "$CHANGED" = 0 ]; then
  exec "$BIN" "${ARGS[@]}"
fi

# Diff against the merge-base so files that only moved on the base branch stay out, then add
# untracked files: a new file is the most lint-worthy thing in a change and `git diff` alone misses it.
BASE_COMMIT="$(git merge-base "$BASE_REF" HEAD)"
FILES=()
while IFS= read -r -d '' file; do
  case "$file" in
    *.js|*.jsx|*.mjs|*.cjs|*.ts|*.mts|*.tsx) [ -f "$file" ] && FILES+=("$file") ;;
  esac
done < <({ git diff --name-only -z "$BASE_COMMIT" --; git ls-files --others --exclude-standard -z; } | sort -zu)

if [ "${#FILES[@]}" = 0 ]; then
  echo "eslint: no changed files to lint (vs $BASE_REF)"
  exit 0
fi

# A changed file the config ignores is a warning when named explicitly; it is not a finding.
exec "$BIN" --no-warn-ignored "${ARGS[@]}" "${FILES[@]}"

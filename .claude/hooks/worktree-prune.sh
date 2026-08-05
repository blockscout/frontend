#!/usr/bin/env bash
# Retire agent worktrees and their branches once the work has landed.
#
# Claude Code only auto-removes a worktree it can prove is untouched: anything with a
# local commit, a changed file, or a lock it did not write is kept on purpose, so nothing
# is ever destroyed silently. That is the right default and also why worktrees accumulate
# — a branch that has since been merged still looks like unfinished work to it.
#
# This closes that gap from the other side, with two independent ways to prove the work
# has landed:
#
#   1. HEAD is an ancestor of the base branch — everything local is already in history.
#   2. A merged PR exists whose head SHA is exactly this branch's tip. Because PRs here are
#      squash-merged, the branch's own commits never become ancestors of the base, so (1)
#      can never fire and this is the test that actually retires things. Matching the tip
#      SHA is what makes it safe: a commit added after the merge moves the tip, the SHAs
#      stop matching, and the branch is kept.
#
# An open PR on the same head keeps the branch regardless — a branch can be merged once and
# then reopened for follow-up work. Anything unproven is reported for a human, never
# deleted, and every GitHub failure (no gh, offline, rate limit) resolves to "keep".
#
# The idle window exists because another session may be working in a clean worktree right
# now; a worktree untouched for days is not one somebody is sitting in. It does not apply
# to branches whose worktree is already gone — there is nobody to interrupt.
#
# Env:
#   CLAUDE_WORKTREE_IDLE_DAYS  how long a worktree must be untouched (default 3)
#   CLAUDE_WORKTREE_NO_GH      set to 1 to skip PR lookups entirely (offline / no network)
# Args:
#   --report                   list candidates without removing anything

set -uo pipefail

report_only=false
[ "${1:-}" = "--report" ] && report_only=true

idle_days="${CLAUDE_WORKTREE_IDLE_DAYS:-3}"
payload="$(cat 2>/dev/null || true)"

dir="$(printf '%s' "$payload" | jq -r '.cwd // empty' 2>/dev/null)"
[ -n "$dir" ] && [ -d "$dir" ] || dir="$PWD"

root="$(git -C "$dir" rev-parse --show-toplevel 2>/dev/null)" || exit 0
gitdir="$(git -C "$root" rev-parse --absolute-git-dir 2>/dev/null)" || exit 0
common="$(git -C "$root" rev-parse --path-format=absolute --git-common-dir 2>/dev/null)" || exit 0

# Only ever prune from the main checkout — a worktree must not delete the directory it is
# running in, or its siblings out from under a session that owns them.
[ "$gitdir" = "$common" ] || exit 0

base=""
for ref in refs/remotes/origin/HEAD refs/remotes/origin/main refs/heads/main refs/heads/master; do
  if git -C "$root" show-ref --verify --quiet "$ref"; then base="$ref"; break; fi
done
[ -n "$base" ] || exit 0

mtime() { stat -f %m "$1" 2>/dev/null || stat -c %Y "$1" 2>/dev/null; }
now="$(date +%s)"
idle_cutoff=$(( now - idle_days * 86400 ))

removed=()
kept=()
orphans=()

join() { local sep="$1"; shift; local out=""; for item in "$@"; do out="${out:+$out$sep}$item"; done; printf '%s' "$out"; }

# Resolved on first use, not up front: `gh auth status` hits the keyring and the network,
# and the common session has nothing to prune and no reason to pay for it.
gh_ready=""
gh_available() {
  if [ -z "$gh_ready" ]; then
    if [ "${CLAUDE_WORKTREE_NO_GH:-}" != "1" ] &&
       command -v gh >/dev/null 2>&1 &&
       gh auth status >/dev/null 2>&1; then
      gh_ready=true
    else
      gh_ready=false
    fi
  fi
  $gh_ready
}
gh_calls=0
gh_budget=10

# One bulk pair of queries covers every candidate, so the cost of the PR checks is flat
# instead of one round trip per branch. Fetched on first use, so a session with nothing to
# prune touches the network not at all.
gh_prefetched=false
open_heads=""
merged_prs=""
pr_prefetch() {
  $gh_prefetched && return 0
  gh_prefetched=true
  open_heads="$(cd "$root" && gh pr list --state open --limit 100 \
    --json headRefName --jq '.[].headRefName' 2>/dev/null || true)"
  merged_prs="$(cd "$root" && gh pr list --state merged --limit 100 \
    --json headRefName,headRefOid,url --jq '.[] | "\(.headRefOid) \(.headRefName) \(.url)"' 2>/dev/null || true)"
}

# Sets pr_state to merged|open|unproven, and pr_url on merged. Results go to globals rather
# than stdout because a command substitution would run this in a subshell and lose the
# prefetch and the call budget.
pr_state=""
pr_url=""
pr_check() {
  local branch="$1" tip="$2" prs
  pr_state="unproven"
  pr_url=""
  gh_available || return 0
  pr_prefetch

  if printf '%s\n' "$open_heads" | grep -Fqx "$branch"; then
    pr_state="open"
    return 0
  fi

  pr_url="$(printf '%s\n' "$merged_prs" |
    awk -v tip="$tip" -v branch="$branch" '$1 == tip && $2 == branch { print $3; exit }')"
  if [ -n "$pr_url" ]; then
    pr_state="merged"
    return 0
  fi

  # Older than the prefetch window — ask about this branch specifically. Budgeted, because
  # a repo with a long tail of dead branches would otherwise stall session startup.
  [ "$gh_calls" -ge "$gh_budget" ] && return 0
  gh_calls=$(( gh_calls + 1 ))

  prs="$(cd "$root" && gh pr list --head "$branch" --state all --limit 10 \
           --json state,headRefOid,url 2>/dev/null)" || return 0
  [ -n "$prs" ] || return 0

  if printf '%s' "$prs" | jq -e 'any(.[]; .state == "OPEN")' >/dev/null 2>&1; then
    pr_state="open"
    return 0
  fi

  pr_url="$(printf '%s' "$prs" | jq -r --arg tip "$tip" \
    'map(select(.state == "MERGED" and .headRefOid == $tip)) | first | .url // empty' 2>/dev/null)"
  [ -n "$pr_url" ] && pr_state="merged"
  return 0
}

# Worktree paths, plus whether git holds a lock on each (a live session's own lock).
locked_paths=""
while IFS= read -r line; do
  case "$line" in
    "worktree "*) current="${line#worktree }" ;;
    "locked"*) locked_paths="$locked_paths$current"$'\n' ;;
  esac
done < <(git -C "$root" worktree list --porcelain)

while IFS= read -r wt; do
  [ -n "$wt" ] || continue
  [ "$wt" = "$root" ] && continue

  name="$(basename "$wt")"
  branch="$(git -C "$wt" symbolic-ref --short -q HEAD 2>/dev/null || true)"
  head="$(git -C "$wt" rev-parse HEAD 2>/dev/null || true)"
  [ -n "$head" ] || continue

  if printf '%s' "$locked_paths" | grep -Fqx "$wt"; then
    kept+=("$name: locked by a live session")
    continue
  fi

  changed="$(git -C "$wt" status --porcelain 2>/dev/null | wc -l | tr -d ' ')"
  if [ "$changed" != "0" ]; then
    kept+=("$name: $changed uncommitted change(s)")
    continue
  fi

  landed=""
  if git -C "$root" merge-base --is-ancestor "$head" "$base" 2>/dev/null; then
    landed="in ${base#refs/}"
  elif [ -n "$branch" ]; then
    pr_check "$branch" "$head"
    case "$pr_state" in
      merged) landed="$pr_url" ;;
      open) kept+=("$name: open PR on $branch"); continue ;;
    esac
  fi
  if [ -z "$landed" ]; then
    ahead="$(git -C "$root" rev-list --count "$base..$head" 2>/dev/null || echo '?')"
    kept+=("$name: $ahead commit(s) not landed${branch:+ (branch $branch)}")
    continue
  fi

  # The private index is rewritten by any git read in the worktree, which is the closest
  # proxy available for "somebody was working here".
  last="$(mtime "$common/worktrees/$name/index")"
  [ -n "${last:-}" ] || last="$(mtime "$wt")"
  if [ -n "${last:-}" ] && [ "$last" -gt "$idle_cutoff" ]; then
    kept+=("$name: merged but active within ${idle_days}d")
    continue
  fi

  if $report_only; then
    kept+=("$name: prunable — clean, idle, landed ($landed)")
    continue
  fi

  if git -C "$root" worktree remove --force "$wt" 2>/dev/null; then
    removed+=("worktree $name")
    # $landed already proved this branch's tip is accounted for, so the ancestor test that
    # git branch -d would apply is the wrong gate under squash merges.
    if [ -n "$branch" ]; then
      git -C "$root" branch -D "$branch" >/dev/null 2>&1 && removed+=("branch $branch")
    fi
  else
    kept+=("$name: git refused to remove it")
  fi
done < <(git -C "$root" worktree list --porcelain | sed -n 's/^worktree //p')

# Branches outlive their worktree: removing a worktree never deletes the ref, so merged
# agent branches pile up long after their directory is gone.
while IFS= read -r branch; do
  [ -n "$branch" ] || continue
  git -C "$root" worktree list --porcelain | grep -Fqx "branch refs/heads/$branch" && continue

  landed=""
  if git -C "$root" merge-base --is-ancestor "$branch" "$base" 2>/dev/null; then
    landed="in ${base#refs/}"
  else
    pr_check "$branch" "$(git -C "$root" rev-parse "$branch")"
    case "$pr_state" in
      merged) landed="$pr_url" ;;
      open) kept+=("branch $branch: open PR, no worktree"); continue ;;
      *) orphans+=("$branch"); continue ;;
    esac
  fi

  if $report_only; then
    kept+=("branch $branch: prunable — landed ($landed), no worktree")
  else
    git -C "$root" branch -D "$branch" >/dev/null 2>&1 && removed+=("branch $branch")
  fi
done < <(git -C "$root" for-each-ref --format='%(refname:short)' 'refs/heads/claude/*')

git -C "$root" worktree prune 2>/dev/null || true

# Orphan branches are collapsed into one clause: they are the same list every session and
# only worth a nudge, not a per-branch verdict.
if [ ${#orphans[@]} -gt 0 ]; then
  kept+=("${#orphans[@]} claude/* branch(es) with no worktree and no landed PR: $(join ', ' "${orphans[@]}")")
fi

[ ${#removed[@]} -eq 0 ] && [ ${#kept[@]} -eq 0 ] && exit 0

summary=""
[ ${#removed[@]} -gt 0 ] && summary="removed $(join ', ' "${removed[@]}")"
[ ${#kept[@]} -gt 0 ] && summary="${summary:+$summary; }kept — $(join '; ' "${kept[@]}")"

jq -n --arg summary "$summary" --argjson notify "$([ ${#removed[@]} -gt 0 ] && echo true || echo false)" '
  {
    hookSpecificOutput: {
      hookEventName: "SessionStart",
      additionalContext: ("Agent worktree/branch cleanup: " + $summary)
    }
  } + (if $notify then { systemMessage: ("Worktree cleanup — " + $summary) } else {} end)
'

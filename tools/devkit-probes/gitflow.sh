#!/bin/bash
# Prototype probe (#3882): does the devkit pointer follow ordinary git flow?
#
# usage: gitflow.sh <scratch-worktree-path>   (run from the checkout under test)
# Needs the husky hooks of this branch to be the active ones: a fresh clone after `pnpm install`,
# or core.hooksPath pointed at this checkout's .husky. Creates and removes gf-* branches.
G="$1"; st() { echo "$1: pointer=$(git submodule status | cut -c1-9) status=[$(git status --short | tr '\n' ' ')]"; }
echo "== G1 git worktree add --detach"; git worktree add -q --detach "$G" HEAD 2>&1 | grep -v pathspec; cd "$G" || exit 1
[ -e devkit/.git ] || { echo "FAIL: devkit not initialised"; exit 1; }; st "after add"
echo "== G2 switch across a pointer bump"; git switch -q -c gf-base; git switch -q -c gf-bump
git -C "$G/devkit" fetch -q origin; git -C "$G/devkit" checkout -q origin/main; git add devkit; git commit -q --no-verify -m "bump devkit"; st "on bump"
git switch -q gf-base 2>&1 | grep -v pathspec; st "on base"; git switch -q gf-bump 2>&1 | grep -v pathspec; st "on bump"
echo "== G3 merge commit bringing the bump"; git switch -q gf-base 2>&1 | grep -v pathspec; git switch -q -c gf-merge; echo x > gf-merge.txt; git add gf-merge.txt; git commit -q --no-verify -m local
git merge -q --no-edit gf-bump 2>&1 | grep -v pathspec; st "after merge"
echo "== G3b fast-forward"; git switch -q gf-base 2>&1 | grep -v pathspec; git switch -q -c gf-ff; git merge -q --ff-only gf-bump 2>&1 | grep -v pathspec; st "after ff"
echo "== G4 rebase across the bump"; git switch -q gf-base 2>&1 | grep -v pathspec; git switch -q -c gf-rebase; echo y > gf-rebase.txt; git add gf-rebase.txt; git commit -q --no-verify -m local2
git rebase -q gf-bump 2>&1 | grep -v pathspec; st "after rebase"
echo "== G6 to a commit without devkit and back"; git switch -q --detach origin/main 2>&1 | grep -v pathspec; echo "on main: status=[$(git status --short | tr '\n' ' ')] devkit=[$(ls devkit 2>&1 | tr '\n' ' ')]"
git switch -q gf-bump 2>&1 | grep -v pathspec; st "back on bump"
echo "== G7 reset --hard to the older pointer"; git reset -q --hard gf-base; st "after reset"
echo "== G5 worktree remove (no --force)"; cd - >/dev/null; git worktree remove "$G" 2>&1 | tail -1; git worktree remove --force "$G" 2>/dev/null; git branch -D -q gf-base gf-bump gf-merge gf-ff gf-rebase

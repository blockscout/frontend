# 07 — `docs/RELEASING.md` and the mapping drift test

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 07 of #3747 |
| Blocked by | T06, T09 |

## What to build

A reader knows which command to run and why from one page. `docs/RELEASING.md` holds the decision table
("I need to… → run …"), one state diagram of a release (prepare cuts `release/vX.Y.Z` from `main` or the
previous final tag → alphas, each picking `backport` PRs → final), the label rules for PR authors, and the
section ↔ label table. A unit test fails when the table
drifts from `tools/release/categories.ts`. `docs/CONTRIBUTING.md` links to it.

## Acceptance criteria

- [ ] `docs/RELEASING.md` exists per `.agents/rules/docs.md`: decision table, one Mermaid state diagram,
      the category table, the `backport` / `release` / `pre-release` / `vX.Y.Z` label semantics, nothing the
      CLI `--help` already says.
- [ ] `tools/release/categories.spec.ts` parses the table from `docs/RELEASING.md` and asserts equality
      with the module.
- [ ] `docs/CONTRIBUTING.md` "Making a Pull Request" links the label rules; a "Releasing" line links the doc.
- [ ] `pnpm lint:doc-links` passes.

## Leaf worklist

- [x] 1 `[agent]` Write `docs/RELEASING.md` + the CONTRIBUTING links
- [x] 2 `[agent]` Drift spec

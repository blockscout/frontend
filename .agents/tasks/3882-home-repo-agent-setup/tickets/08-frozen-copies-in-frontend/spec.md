# 08 — Frozen copies and the local half of the unit-test rule

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 08 of #3882 |
| Target repo | `frontend` |
| Blocked by | T05, T06, T07 |

## What to build

Every skill and rule that moved to home stays in `frontend` as a frozen copy, marked as not to be edited
here and pointing at its home original. The local half of the unit-test rule moves to the `CONTEXT.md`
ticket 06 named. A session started inside `frontend` has every skill and rule it has today, by name and
behaviour, and the Honk playbooks run unchanged.

## Acceptance criteria

- [ ] `grilling`, `update-glossary`, `review-loop`, `review-changes`, `resolve-review` and the `adr` and
  `docs` rules each carry the frozen marker: edit in home, not here.
- [ ] The marker does not change a skill's name, description or behaviour, nor a rule's `paths` / `globs`.
- [ ] The instruction-set README (`.agents/README.md`) explains what a frozen copy is and where edits go.
- [ ] The local half of the unit-test rule lives in the `CONTEXT.md` named in ticket 06's `notes.md`;
  `frontend`'s unit-test rule keeps its name and frontmatter, holds the frozen general half, and points
  at that `CONTEXT.md` for the local setup.
- [ ] Nothing a `frontend` session could read in the unit-test rule before this ticket is unreachable
  after it.
- [ ] No skill with a `Run by Honk` section, and no skill those call, is changed.
- [ ] `pnpm lint:doc-links` passes.

## Details

- Each frozen copy's content matches its home original as moved in tickets 05–07, except where the home
  version gained the child parameter: the `frontend` copies of the review trio keep working without one.
- The `CONTEXT.md` follows `.agents/rules/docs.md`, and is added to the per-directory list in
  `.agents/AGENTS.md` if it is new.

## Leaf worklist

- [ ] 1 `[agent]` Frozen marker on the five skills and two rules; README note
- [ ] 2 `[agent]` Move the local half of the unit-test rule to its `CONTEXT.md` and freeze the general half

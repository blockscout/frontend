# 07 — Document the tool

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 07 of #3665 |
| Blocked by | T06 |

## What to build

The documentation a developer needs when this gate fails on their PR and they have never seen it before:
what a surviving mutant means, why it is not the same complaint as a coverage miss, what to do about it, and
when suppressing one is legitimate.

The complexity gate's docs are the model to follow — a `CONTEXT.md` that opens with "the gate failed, what
now" and a file map, plus a `docs/` for the detail. It is also the place to state what this tool deliberately
does not measure, so nobody rediscovers those boundaries by trying.

## Acceptance criteria

- [ ] `tools/mutation-testing/CONTEXT.md` exists, opens with how to reproduce a CI failure locally, explains
      what a surviving mutant means as distinct from a coverage miss, and carries a file map.
- [ ] The exclusions are stated with their reasons: Playwright tests, non-logic mutators, files without a
      co-located spec, `jsx` function bodies, and the absence of a whole-repo CI run.
- [ ] The suppression policy is documented — the disable-comment form that passes the ESLint rule, and what
      makes a suppression a legitimate claim.
- [ ] `.claude/CLAUDE.md`'s per-directory context list has an entry for `tools/mutation-testing/`.
- [ ] `.agents/rules/code-quality.md` mentions the gate beside the complexity and CRAP sections, with the
      commands to run it.
- [ ] Cross-references to `tools/code-complexity/` are accurate: the reuse of its selection and classification
      code is described where it matters, without restating what those files already document.
- [ ] `pnpm lint:cspell` passes on the new files.

## Details

Follow the model of `tools/code-complexity/CONTEXT.md`: a "where to look" table, the failure-triage section
first, the file map last, with per-file detail left in each file's own header comment rather than duplicated.

Reasoning that belongs in the docs rather than the spec: why the gating mutator set is the five logic classes
(sampling found roughly a third of all-mutator survivors unkillable by any vitest test, versus zero of the
logic-only ones), and that promoting or demoting a mutator class is a one-line config change.

## Leaf worklist

- [x] 1 `[agent]` Write `tools/mutation-testing/CONTEXT.md`
- [x] 2 `[agent]` Write the `docs/` detail pages
- [x] 3 `[agent]` Add the entries to `.claude/CLAUDE.md` and `.agents/rules/code-quality.md`

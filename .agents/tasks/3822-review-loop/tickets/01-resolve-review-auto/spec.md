# 01 — `resolve-review --auto`: autonomous gating with a `needs-human` stop

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 01 of #3822 |
| Blocked by | none |

## What to build

`resolve-review pr --auto` runs the existing adjudication procedure without its two confirmation gates: no
Gate 1 confirmation before fixing, no Gate 2 diff approval before pushing. The run fixes what it rules `fix`,
commits, pushes, and replies on the threads. The only stop is a `needs-human` finding — raised by the
reviewer or reached by the resolver itself — which halts the run **before any edit**: the run returns its
full verdict table and the open questions, and a resumed run (same agent, answers supplied) folds the
answers into its fix set and proceeds. This is the resolver the `review-loop` skill (T02) dispatches per
round, so its return shape on `needs-human` is the contract the loop reads.

## Acceptance criteria

- [ ] `resolve-review` takes `--auto` (documented in Inputs and the argument hint); `--auto` with `md` stops
  the run as a contradictory input.
- [ ] In auto mode Gate 1 and Gate 2 are skipped; the adjudication step (3), the fix step (5) and the
  close-out (7) are unchanged, and in `pr` mode the run itself commits and pushes the fixes.
- [ ] Nits in auto mode: fixed when the fix is at most 5 lines in one file with no new test and no new file,
  and always when the nit concerns comments, docs or tests; otherwise `deferred` and left as an open thread.
- [ ] Rejections in auto mode: the existing no-repeat rule, tightened — a second dispute from the reviewer on
  the same finding turns it `needs-human`; there is never a third rejection.
- [ ] Any `needs-human` finding stops the run before any edit; the run returns the complete verdict table
  (every finding, source, verdict, reasoning, proposed action) plus the questions, in one block the caller
  can present verbatim.
- [ ] Resumption is described harness-neutrally ("resume the same run with the answers") and points at the
  Claude Code mechanism (`SendMessage` to the subagent); a resumed run adds the answered items to its fix set
  and continues at step 5.
- [ ] `.agents/delegation.md` gains, under what agents may do: resolve agent-review findings and push the
  fixes within the loop's rules.
- [ ] `pnpm lint:doc-links` passes; the skill frontmatter stays valid.

## Details

- Keep one procedure: the interactive and auto paths share steps 1–3, 5 and 7; only the two gates switch on
  the flag. Do not fork a sibling skill (spec, Implementation decisions).
- The `needs-human` return is the loop's input; write it as a named section (e.g. "Returning on
  `needs-human`") so T02 can link it rather than restate it.

## Leaf worklist

- [ ] 1 `[agent]` Add `--auto` to `resolve-review`: Inputs row, argument hint, gate changes, nit and
  rejection rules, the `needs-human` return and resumption — skill: `writing-for-agents`
- [ ] 2 `[agent]` Extend `.agents/delegation.md` with the resolver line; run `pnpm lint:doc-links`

# 06 — The cut of the unit-test rule

The rule cut is `frontend`'s `.agents/rules/tests-unit.md` as of `c772c8282`. The general half is home's
`.agents/rules/tests-unit.md`. The local half goes to a new **`vitest/CONTEXT.md`** in `frontend`, in
ticket 08.

## The rule of thumb

Delete the repository from the sentence: its paths, scripts, helpers, file-name conventions, config and
env mechanism. If what is left still tells the reader what to test, what to mock or what a test must
leave behind, the sentence is **general** and goes to the home rule. If nothing is left, or it would
change when the test setup changes, it is **local** and goes to the `CONTEXT.md` of the directory that
owns the setup.

Three corollaries, for phase 2:

- **A mixed sentence is split, not assigned.** The principle goes to home in neutral words. The local
  half keeps the utility and what breaks without it, and does not restate the principle.
- **The runner's name is local.** Home says "unit test" and "a test that renders in a browser", never
  Vitest or Playwright, so the rule holds for a child on another runner.
- **The child keeps a rule of the same name and frontmatter.** It is what a path match loads in a session
  started inside the child, so it holds the frozen general half and a pointer to the `CONTEXT.md`. A
  `CONTEXT.md` does not load on a path match; without the pointer the local half is found only by
  someone who goes looking. The home rule points the other way without naming a path: the local setup is
  documented in the active child, and the child's rule says where.

## Section by section

| Section of the current rule | Goes to | Note |
| --- | --- | --- |
| Purpose | home | Reworded: "prefer a Vitest test over a Playwright one" became a unit test over a test that renders in a browser. The runner names stay local, in the frozen rule's pointer or the `CONTEXT.md` |
| What a good test is, Good Tests, Bad Tests | home | Verbatim. The heading is kept: `review-changes` cites the section by name |
| Mocking guidelines | home | Verbatim, plus one principle lifted from Isolation (below) |
| File naming and location | local | Naming, co-location, the `pnpm test:vitest` commands, what `--changed` sees |
| Isolation | local, two principles to home | See below |
| Isolation › What stays isolated, and why | local | The table of specs and reasons |
| Setup | local | |
| Rendering components | local | "A spec never mocks the framework router module" is the general "don't mock what you control" applied to one module. It stays local as a convention, since the principle is already in home |
| Utilities | local | |
| Mocking fetch responses | local | |
| Overriding environment variables | local | Same as Rendering: "instead of hand-mocking `src/config`" is an application of a principle home already has |
| Primed-requests drift tests | local | Already a pointer to `src/server/primedRequests/CONTEXT.md` |

**Isolation is the one section that was split.** Two principles in it are true anywhere and went to home
in neutral words:

- "A shared spec leaves nothing behind for the next file", with the random-order run that proves it →
  home's new **Independence** section: a test passes alone and in any file order, and restores what it
  changes outside itself.
- "A third-party SDK needs no module mock to be observed. Spy on a method of its real export" → one
  paragraph at the end of home's **Mocking guidelines**: at a boundary, replace as little as the test
  needs.

Everything else in Isolation is the mechanism of this suite (the two projects, the file name that
picks one, what `withEnvs` resets, what `vitest/setup.ts` undoes, the shuffle flag, the example specs)
and stays local, including the local form of both principles.

## Where the local half goes

No `CONTEXT.md` in `frontend` owns the unit-test setup: the eight under `tools/` each describe another
tool, and `vitest/` has none. The setup files (`setup.ts`, `global-setup.ts`, `lib.tsx`, `utils/`) are all
in `vitest/`, so the new file is `vitest/CONTEXT.md`, with a line in the per-directory list of
`.agents/AGENTS.md`, as the `docs` rule asks.

For ticket 08:

- **The move is whole.** Ticket 08 requires that nothing readable in the rule today becomes unreachable,
  so every local section lands in `vitest/CONTEXT.md` as it is. Several parts would not pass the `docs`
  rule's drop test in a fresh doc (the Utilities entries restate what the helpers' header comments can
  say; the commands are `package.json` scripts). Trimming them into header comments is a follow-up, not
  part of the move.
- **The frozen rule keeps its `description`, `paths` and `globs`.** Its body is home's rule, with the
  frozen marker, and a pointer to `vitest/CONTEXT.md` in place of home's opening paragraph.
- **Four files cite the rule and keep working unchanged**: `.agents/AGENTS.md`, `tests-visual.md`,
  `review-changes/axes.md` (the "What a good test is" section, still in the rule) and
  `triage-monitoring-event`. `diagnose-bug/loops.md` cites it for `render`, `fetchMock`, `withEnvs` and
  `mockSocket`, which move; repoint that one at `vitest/CONTEXT.md`.

## The load check

Probe of 2026-11-16, Claude Code 2.1.325: a headless session at the home root with a logging
`InstructionsLoaded` hook, reading `frontend/src/shared/pagination/useApiPaginatedQuery.spec.ts`.

| Loaded file | Reason |
| --- | --- |
| home `.agents/rules/tests-unit.md` | `path_glob_match` on the spec |
| `frontend/.agents/rules/tests-unit.md` | `path_glob_match` on the spec |

Both load, as the main spec accepts for phase 1. Until ticket 08 lands, the general half is read twice
in a home session; after it, once from home and once from the frozen copy.

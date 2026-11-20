# 02 — Duplicate-model guard

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 02 of #3904 |
| Blocked by | T01 |

## What to build

The shared code editor never fails on a repeated model key. When two files in its data carry the same key,
it creates the model once, skips the repeat and reports a warning to error monitoring through the existing
Rollbar hook: a repeat at that point is a defect in the frontend's own data step. The guard is independent
of the data step. With this ticket alone the example contract stops showing "Oops! Something went wrong!",
with one file of each differing pair still missing until ticket 03.

## Acceptance criteria

How to verify: `pnpm dev:preset robinhood`, open
`/address/0xd4EB21209C4D6093f80B5b84f5C45cc093EA14a3?tab=contract`

- [ ] Model creation skips a key that is already loaded or already seen in the same data array.
- [ ] Each skipped repeat is reported as a Rollbar warning, not an error, with the key in the payload.
- [ ] Data without repeats reports nothing.
- [ ] `(human)` The Contract tab of the example contract renders the editor instead of the error screen.

## Details

- The current filter in `handleEditorDidMount` compares new files with already loaded models only; two
  repeats inside the same `data` both reach `createModel`. The first file is created by `MonacoEditor`
  itself through its `path` prop, so it counts as seen.
- Put the "which files get a model" decision in a pure helper so a unit spec can cover it without Monaco.

## Leaf worklist

- [ ] 1 `[agent]` Add the guard and the Rollbar warning to the editor's model creation
- [ ] 2 `[agent]` Unit spec for the helper: no repeats, a repeat of the first file, a repeat among additional files

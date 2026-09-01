# 05 — Findings grouped by source line

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 05 of #3665 |
| Blocked by | T04 |

## What to build

The listing half of the output: after the per-file table, the mutants that nothing killed, named by mutator
and grouped by the source line they sit on. Grouping by line is what makes the report actionable — several
mutators surviving on one line is one weak assertion, not several findings.

No-coverage mutants are a different problem from survivors: they mean no test executed the line at all,
which the CRAP gate already owns. They are separated off the `status` field Stryker records per mutant and
summarised compactly rather than listed one by one. The HTML report's location is printed at the end for
anyone who wants to browse the whole thing.

## Acceptance criteria

How to verify: `pnpm test:mutation-testing <a file with known weak assertions>`

- [ ] Survivors are listed grouped by source line, each naming its mutator, under the file they belong to.
- [ ] No-coverage mutants never appear in the survivor listing; they are summarised compactly and separately.
- [ ] The split reads Stryker's per-mutant `status` field rather than inferring it.
- [ ] A run with no survivors and no no-coverage mutants says so in one line instead of printing empty
      sections.
- [ ] The HTML report path is printed, and the path resolves to a file that opens.
- [ ] A truncated run (T04) renders its partial findings the same way, still marked truncated.
- [ ] Formatting is unit-tested, including the multiple-mutators-on-one-line grouping.
- [ ] `(human)` The report is legible on a real diff: the table, the grouped findings and the no-coverage
      summary read as one thing a reviewer can act on, not three dumps.

## Details

**Precedent** for the rendering split is `tools/code-complexity/render/` — pure formatters, with the side
effects kept in `index.ts`. Follow it: a module that turns parsed report rows into text, tested directly.

**Why not Stryker's own reporter (FR8).** The clear-text reporter prints every mutant with its full diff and
is unusable at this scale; consuming the JSON is what makes the compact form possible.

## Leaf worklist

- [ ] 1 `[agent]` Split survivors from no-coverage mutants off the `status` field; specs
- [ ] 2 `[agent]` Render the grouped-by-line survivor listing and the compact no-coverage summary; specs
- [ ] 3 `[agent]` Print the HTML report location
- [ ] 4 `[human]` Read the output on a real diff and confirm it is actionable

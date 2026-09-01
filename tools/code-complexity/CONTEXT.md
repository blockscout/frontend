# Code complexity — context

A code-quality gate that flags code which is either hard to read *or* both complex and
under-tested. Two independent gates run:

- **Cognitive Complexity (CC)** — the readability gate. "Should a human decompose this?" Capped per
  function class.
- **Change Risk Anti-Patterns (CRAP)** — the under-testedness gate. "Complex and untested?" functions, fed by
  *cyclomatic* complexity joined with coverage.

## Where to look

| Question | Answer lives in |
| --- | --- |
| The gate failed. What do I change? | the next section |
| Why is this function's score *that* number? | `./docs/MODEL.md` |
| Which files and functions get gated at all? | `./docs/MODEL.md` |
| How do I run it? What feeds the coverage half? | `pnpm test:code-complexity --help` or `./docs/RUNNING.md` for more details |
| Can I move a cap? |  short answer: no; `./docs/CALIBRATION.md` |
| Why is the counting model like this? | `./adr/` |
| Which file implements what? | the file map at the bottom |

## The gate failed — what now

Reproduce it on just your file:

```bash
pnpm test:code-complexity path/to/your/file.ts
```

The `BROKE` column names which cap you crossed. In CI you also get an inline annotation on the diff:

```
classify: cognitive 21 > 20 [top: if +10 (L11), switch +5 (L6), if +2 (L4);
                             deepest nesting 3 at L11, flattening saves ~5]
```

**`COG` — decompose it.** The annotation is built to be actionable: it names the increment sites that
cost the most, the deepest nesting pocket, and what flattening that pocket by one level would save.
Above, a single `if` at depth 3 accounts for 10 of the 21 — extract it, invert it into an early
return, or lift the `switch` out from around it. Nesting is charged quadratically, so the deepest
level is where the points are and pulling it out is almost always the cheapest win.

**`CRAP` — add a test.** CRAP joins cyclomatic complexity with coverage, and coverage is the only
lever. Simplifying the function lowers its *cognitive* score, not its CRAP. A `behavior` function
with no co-located spec reads 0%, accurately — no unit test exercises it.

**Raising the cap is not the fix.**.

## File map

Four directories, one per pipeline stage, and files at the root that tie them together. Specs
sit next to what they test, and each file's header comment carries its own local detail.

Measuring and judging are separate jobs. `select/`, `measure/` and `coverage/` compute the numbers
and never see a cap; the caps enter once, at `./analyze.ts`, which stamps a verdict onto each row.
The table, the exit code and the GitHub annotations all read that verdict rather than re-deriving
it.

**Root** — the CLI, the caps, and the join.

- `./index.ts` — parse the flags, pick the selection, orchestrate, set the exit code
  (`./docs/RUNNING.md`)
- `./config.ts` — the three caps, so a local run and a CI run gate identically
  (`./docs/CALIBRATION.md`)
- `./analyze.ts` — complexity × coverage → one row per function, each stamped with its verdict
- `./run.sh` — compile-on-run wrapper; callable from any directory, but git reads the one you call
  it from (`./docs/RUNNING.md`)

**`select/`** — which files, and which lines inside them.

- `./select/scope.ts` — the in-scope rule, and why each excluded category is out
- `./select/diff.ts` — git plumbing: changed files, changed line ranges, merge-base
  (`./docs/RUNNING.md`)

**`measure/`** — one AST walk, no caps in sight.

- `./measure/complexity.ts` — cognitive, cyclomatic, the function class and the contributions
  (`./docs/MODEL.md`)
- `./measure/jsx.ts` — file-level JSX detection, which decides who needs coverage generated
  (`./docs/RUNNING.md`)
- `./measure/crap.ts` — the CRAP formula, six lines of it (`./docs/MODEL.md`)

**`coverage/`** — the CRAP half's input.

- `./coverage/generate.ts` — run vitest scoped to the selection, into a throwaway dir
  (`./docs/RUNNING.md`)
- `./coverage/read.ts` — parse `coverage-final.json`, derive per-function line coverage
  (`./docs/MODEL.md`)

**`render/`** — rows out.

- `./render/report.ts` — the score table, the sort order, the offender test (`./docs/RUNNING.md`)
- `./render/github.ts` — `::error` annotations and the step summary (`./docs/RUNNING.md`)

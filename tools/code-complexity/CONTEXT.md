# code-complexity — context

A CI gate that flags code which is either hard to read *or* both complex and under-tested, before it
merges. It is scoped to what a PR actually changes, so it never blocks on pre-existing debt. Two
independent gates run:

- **Cognitive Complexity (CC)** — the readability gate. "Should a human decompose this?" Capped per
  function class.
- **CRAP** — the under-testedness gate. "Complex and untested?" `behavior` functions only, fed by
  *cyclomatic* complexity joined with coverage.

Both key off one per-function property: **does the function directly contain JSX?**

Run `pnpm test:code-complexity --help` for the flags. Three siblings hold the detail this document
does not:

- **`./SCORING.md`** — how each score is computed, with a worked example, and where the model diverges
  from SonarSource and ESLint. Read it when a score surprises you, or before changing the counting.
- **`./CALIBRATION.md`** — the caps, the distribution they sit on, and how to re-derive them.
- **`./adr/`** — the decisions behind the counting model, local to this tool and numbered from `0001`.

## The gate failed — what now

Reproduce it on just your file. This needs no CI, no diff, and no coverage run:

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
level is where the points are and pulling it out is almost always the cheapest win. `./SCORING.md`
walks that exact function increment by increment.

**`CRAP` — add a test.** CRAP joins cyclomatic complexity with coverage, and coverage is the only
lever. Simplifying the function lowers its *cognitive* score, not its CRAP. A `behavior` function
with no co-located spec reads 0%, accurately — no unit test exercises it.

**Raising the cap is not the fix.** The three caps are calibrated against the counting model and
against each other; moving one in isolation stops the gate measuring what it was set up to measure.
`./CALIBRATION.md` has the procedure for the rare case where a cap genuinely needs re-deriving.

**Rows without a `BROKE` mark are context, not a demand.** Diff mode gates only functions a changed
line falls within; untouched functions in a file you edited are listed for orientation and never
flagged.

## Function classes and which gates apply

Every function is classified — independently of its file's extension — by whether **JSX appears
directly in its own body**, outside any nested function:

- **`jsx`** — a render body (a component, or an inline `items.map(x => <Row/>)` callback: the JSX is
  in the callback's own body). A component's handlers are separate units.
- **`behavior`** — everything else: event handlers, `useCallback`/`useMemo` bodies, hooks, and utils,
  *wherever they live* — including nested inside a component. A JSX-less `.tsx` hook is `behavior`;
  a handler defined inside a component is `behavior` even though the component around it is `jsx`.

Classification is read from the AST, not the extension — ~78 non-test `.tsx` files contain no JSX
(mostly `useX.tsx` hooks), so the extension is an unreliable component-vs-logic signal. The two
classes gate differently:

| class | cognitive cap | CRAP |
| --- | --- | --- |
| `jsx` | `--max-cognitive-jsx` (high backstop) | never scored |
| `behavior` | `--max-cognitive-behavior` (tighter) | scored |

**Why `jsx` carries no CRAP.** A component's rendering is covered by Playwright visual tests
(`*.pw.tsx`), which emit no vitest coverage — so a `jsx` function would read ~0% and flood the report.
Its cognitive cap is the backstop instead: hitting it means "decompose this render body." Every
`behavior` function *is* CRAP-scored, because that is where under-tested logic hides and where neither
Playwright nor (often) vitest reaches. So a spec'd component's render loses its noise CRAP score while
its handlers gain a real one.

### Which files trigger a vitest run (generation scope)

Separately from per-function scoring, a *file* needs vitest coverage generated for it when it is a
**JSX-less logic file** *or* a **JSX file with a co-located vitest spec** (`Component.spec.tsx` next
to `Component.tsx`; Playwright `*.pw.tsx` does not count). This only decides whether
`vitest related`/`--changed` pulls the file in. A `behavior` function in a JSX file outside that set
is absent from the report and scores 0% without triggering a run.

**Missing coverage = 0% vs "no data".** A `behavior` function absent from the coverage report scores
0% when absence means "no spec executed it" — generated coverage in any mode, and the CI
`--coverage-file` report. The one exception is a **user-supplied `--coverage-file` in focused mode**:
a hand-passed report may simply predate the file, so absence there reports `—` (no data).

## Running it

The interface has two independent axes, mirroring vitest — **selection** (which functions) and
**coverage source** (how the CRAP half is fed). Any selection combines with any source.

| Selection | Scores |
| --- | --- |
| *(no arguments)* | every in-scope function, repo-wide — this is what calibration runs |
| `<path...>` | every function in the given files, ignoring the diff |
| `--changed[=<ref>]` | only functions a changed line falls within — **the CI gate** |

| Coverage source | How the CRAP half is fed |
| --- | --- |
| *(default)* | the tool runs vitest itself, scoped to the selection, into a throwaway temp dir |
| `--coverage-file <path>` | consume a prebuilt report and skip vitest — **the CI path** |
| `--no-coverage` | cognitive gate only, which is always enforced either way |

Four things the flag list does not tell you:

- **Vitest is skipped when nothing needs coverage.** Only files in the generation scope above cause a
  run, so a focused run on a spec-less JSX component returns instantly — scoring its `behavior`
  functions 0%, exactly as it would have had the run happened. Skipping the run is not
  `--no-coverage`: generation scope never decides which functions are scored, so a function's score
  never depends on what else shared its selection. A diff with nothing in scope prints "No functions
  to check." and runs nothing.
- **All three generated scopes select through the module graph** (`vitest related <paths>`,
  `vitest run --changed <merge-base>`, or the whole suite), so a file's coverage is the same however
  it was reached. A selection with no matching specs passes; a failing suite warns and still reports
  whatever coverage landed.
- **Primed-request drift tests (`*.primed.spec.tsx`) are excluded** from generated runs. They mount
  whole page trees to check the primer registry rather than to exercise behavior, and import huge
  swaths of the app — so `related` would pull them in for almost any file, costing tens of seconds of
  page-mount time while contributing no meaningful coverage.
- **CI reuses the `vitest_tests` job's coverage artifact** instead of regenerating it, and carries no
  threshold numbers of its own, so a local run and a CI run gate identically.

`--verbose` streams vitest's output live and adds the cyclomatic (`CX`) column; otherwise vitest is
silent so the score table is what you see. `run.sh` compiles the tool with the repo-local TypeScript
into `dist/` (git-ignored) — the same compile-on-run pattern as `tools/dev-server/fetch.sh`, so no
global toolchain is needed.

## The report

The default table shows `KIND`, `COG`, `COV`, `CRAP` and `BROKE`, sorted by CRAP descending so the
worst offenders lead; `jsx` and no-coverage rows sort to the bottom, tie-broken by `COG`. The two
gates are independent: the cognitive cap trips on any in-scope function over its class's cap, the
CRAP cap only on `behavior` functions with coverage data.

Under `$GITHUB_ACTIONS` the tool also emits `::error file=,line=::` annotations for offenders and
writes the table to `$GITHUB_STEP_SUMMARY`.

## Scope

**Files:** an allowlist of two roots — the app (`src/`) and the repo's own tooling (`tools/`) — over
`.ts` `.tsx` `.mjs` `.js` `.cjs`, minus specs, declaration files, configuration and build output.
`./scope.ts` is the exact rule and records why each excluded category is out (`deploy/**` among them,
tracked in issue #3675).

**The gate scores its own implementation.** `tools/code-complexity/**` is in scope, so a change to the
increment model re-scores `complexity.ts` under the new model and carries whatever refactor its own
numbers then demand. Budget for that when touching the counting conventions.

**Functions (diff mode):** only functions a changed line falls within are gated. A changed line is any
new-side line of the diff between the working tree and the merge-base of the branch and the base ref,
which captures the branch's own commits plus uncommitted edits. Focused mode bypasses diff-scoping
entirely and scores every function in the given files.

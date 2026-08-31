# 08 — Extend the CC & CRAP gate to `tools/`

| | |
| --- | --- |
| Parent spec | `../../spec.md`, ticket 08 of #3663 |
| Blocked by | none |

## What to build

Widen the gate's file scope from `src/**` to `src/**` + `tools/**`, so the repo's own tooling is held
to the same readability and under-testedness standard as the app — and fix the two offenders the tool's
own code turns out to have. Ticket 01 scoped the gate to `src/` and let `tools/` and `deploy/` fall out
"for free" as a side effect of that prefix test; nothing about tooling code makes complexity or missing
tests cheaper there, and `tools/code-complexity` in particular is now gated by the very thing it
implements.

The scope rule becomes an **allowlist** — `src/` and `tools/`, extensions `.ts` `.tsx` `.mjs` `.js`
`.cjs` — rather than a prefix test plus exclusions. Three categories stay out, each for a stated
reason:

- **`deploy/**`** — ESLint ignores the directory outright and every `deploy/tools/*` package is excluded
  from the root TypeScript project. Making the complexity gate its first and only automated check is
  backwards; bringing it under ESLint and `tsc` first is #3675.
- **`playwright/**`, `vitest/**`, `*.config.ts`** — test support and configuration, excluded on the same
  grounds the gate already excludes specs.
- **Repo-root runtime files** (`proxy.ts`, `instrumentation*.ts`, `startup.node.ts`) — measured clean
  (worst: cyclomatic 7), and an allowlist keeps the rule to two directories.

Both gates apply in `tools/` under the existing `src/` rules — CC per function class, CRAP on `behavior`
functions, coverage absent means 0%. The caps are unchanged: the extension adds ~200 `behavior` functions
and no `jsx` functions to a 6,538-function distribution, well inside the calibrated tail, so re-tuning
here would re-open a calibration argued from the `src/` distribution on the strength of tooling code.

Two functions in the gate's own implementation fail once it scores itself, and this ticket fixes them.
The three `.mjs` scripts under `tools/` also fail; they are deliberately left to #3674 (rewrite to
TypeScript, decompose, add specs), because diff-scoping means they block nobody until touched and an
exemption list would be the committed baseline the parent spec rejected.

## Acceptance criteria

- [ ] `complexity.ts`'s `visit` passes the behavior CC cap. Its overage came entirely from the nested
  `if`/`else` pocket inside the `isIfStatement` arm (deepest nesting 3; top sites `if +5`, `if +2`,
  `if +2`) — extracting that arm into its own function resets nesting for it. The flat dispatch chain
  stays flat; the fix is behaviour-preserving and `complexity.spec.ts` still passes unchanged.
- [ ] `index.ts`'s `parseArgs` passes both caps: a new `index.spec.ts` exercises it (CRAP was 240 at 0%
  coverage), and its flag-reading loop is split from its validation so its CC has headroom for the next
  flag.
- [ ] `scope.ts` is an allowlist over `src/` and `tools/` with the extension set `.ts` `.tsx` `.mjs`
  `.js` `.cjs`; specs (`*.spec.*`, `*.pw.tsx`, `*.pwstory.tsx`), `*.d.ts`, `src/toolkit/package/**` and
  `tools/**/dist/` stay excluded. Comments state why `deploy/**` and test-support code are out, naming
  #3675 for the former.
- [ ] `getAllSourceFiles()` in `diff.ts` enumerates the whole repo via `git ls-files` and filters through
  `isInScope`, so full-repo mode follows the scope rule instead of restating it as a pathspec.
- [ ] `scope.spec.ts` covers the new rule: a `tools/**` `.ts` and `.mjs` in scope, a `deploy/tools/**`
  file out, a `playwright/**` and `vitest/**` file out, a `*.config.ts` out, `tools/**/dist/` out.
- [ ] `pnpm test:code-complexity --changed` passes on this branch, and `pnpm test:code-complexity`
  (full repo) reports `tools/**` functions with no offender other than the three `.mjs` ones tracked in
  #3674.
- [ ] `CONTEXT.md`'s `## Scope` describes the allowlist and carries both exclusion rationales plus the
  self-gating note: the gate now scores its own implementation, so a change to the increment model
  re-scores `complexity.ts` under the new model and carries whatever refactor its own numbers demand.
- [ ] `config.ts` records that the scope extension was measured against the existing caps and does not
  move the tail — the caps themselves are unchanged.
- [ ] The parent spec's FR7 is rewritten in place to state the new scope (it currently names `tools/` as
  excluded). No supersession note, per `.agents/tasks/concepts.md`.
- [ ] `pnpm test:vitest`, `pnpm lint:eslint` and `pnpm lint:tsc` pass; the CLI help text and the
  mode-summary comments in `index.ts` no longer say "every in-scope `src/**` function".

## Details

- **Read `tools/code-complexity/CONTEXT.md` first.** The scope rule, the two gates and the `jsx`/
  `behavior` classification are documented there; this ticket changes only the file-scope half.
- **Files touched:** `scope.ts` (+ `scope.spec.ts`), `diff.ts` (`getAllSourceFiles`), `complexity.ts`
  (`visit` decomposition), `index.ts` (`parseArgs` split, help text, mode comments) and a new
  `index.spec.ts`, `config.ts` (comment only), `CONTEXT.md`, `../../spec.md` (FR7).
- **Nothing else changes.** `analyze.ts`'s CRAP applicability, the `jsx`/`behavior` classification,
  `fileNeedsCoverage`, the report columns, the flag surface and the CI workflow step are all untouched —
  the CI step already runs `--changed --coverage-file coverage/coverage-final.json` and picks the new
  scope up for free.
- **The `.mjs` path needs no code beyond the extension list.** Verified: `scriptKind()` falls through to
  `ts.ScriptKind.TS`, which parses `.mjs` correctly; `vitest related <file>.mjs` exits cleanly with "No
  test files found"; the gate then reports 0% coverage and scores CRAP normally.
- **A `tools/` change usually has no related spec**, so CI's `vitest run --changed --coverage` will often
  match no test files. Verified safe: vitest still writes `coverage-final.json` (as `{}`) under
  `--passWithNoTests`, so the gate's `readCoverage` does not throw and those functions read 0%.
- **Order matters within the ticket.** Once `tools/**` is in scope, this branch's own diff gates
  `complexity.ts` and `index.ts` — so leaf 1 lands the fixes before leaf 2 widens the scope, keeping
  every intermediate commit green. Leaf 1 is verifiable on its own because focused mode
  (`pnpm test:code-complexity tools/code-complexity/complexity.ts`) bypasses `scope.ts` entirely.
- **This widens what CI gates for every PR**, not just this branch's. That is the point of the ticket,
  and the diff-scoping already in place is what keeps it from blocking on pre-existing debt.

## Leaf worklist

- [ ] 1 `[agent]` Fix the gate's own offenders — extract `visit`'s `isIfStatement` arm in
  `complexity.ts`; split `parseArgs`'s flag-reading loop from its validation in `index.ts`; add
  `index.spec.ts` covering `parseArgs`. Verify each with focused mode.
- [ ] 2 `[agent]` Rewrite the scope rule — `scope.ts` allowlist (`src/`, `tools/`; five extensions;
  `tools/**/dist/` and the existing exclusions; rationale comments naming #3675), `getAllSourceFiles()`
  in `diff.ts` to whole-repo `git ls-files` + `isInScope`, and the new `scope.spec.ts` cases.
- [ ] 3 `[agent]` Update the records — `CONTEXT.md` `## Scope` (allowlist, both exclusion rationales,
  self-gating note), the `config.ts` calibration note, the `index.ts` help text and mode comments, and
  the in-place FR7 rewrite in `../../spec.md`.

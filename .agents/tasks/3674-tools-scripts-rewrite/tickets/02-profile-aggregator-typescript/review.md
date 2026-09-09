# Review — tickets/02-profile-aggregator-typescript · uncommitted

## Rounds

- **1** — 2026-09-09, Cursor Grok 4.6. blocker 0 · major 1 · nit 2. Outcome: blocked.
- **2** — 2026-09-09, Cursor Grok 4.6. blocker 0 · major 0 · nit 0. Outcome: cleared.

## Findings

| id | severity | axis | location |
| --- | --- | --- | --- |
| F1 | major | standards | `tools/profiling/index.ts:8` |
| F2 | nit | standards | `tools/profiling/CONTEXT.md:12` |
| F3 | nit | standards | `tools/profiling/index.ts:38` |

### F1 · major · standards · `tools/profiling/index.ts:8`

**Claim.** The port adds comments that restate the next line. `index.ts` dumps Usage/Options (`--commit=N`, `--top=N`, `--min-ms=N`) that duplicate `USAGE` on line 23 and the CONTEXT.md workflow. `aggregate.ts:20` and `:49` are section banners (`// --- The DevTools export wire format ... ---`, `// --- What this module produces ---`). `aggregate.spec.ts:41` and `:46` restate the arrays `addRoot` / `addElement` return. code-quality.md Comments: "Do not write comments. Never." A comment is allowed only when it explains why the obvious reading is wrong. Ticket 01's entry file is a short header plus a `__dirname` why. It does not restate flags.

**Fix.** Delete the restating comments. Keep the ticket-01-shaped "everything worth a test lives in aggregate.ts" header, the replayAdd layout why, `i = 2; // [0]=rendererID, [1]=rootID`, and the spec whys on string-table length, skip-width, snapshot fallback, and string id 0.

**Status:** resolved — verified

> **resolve-review, round 1:** fix — deleted the Usage/Options block from `index.ts`, keeping the ticket-01-shaped header ("everything worth a test lives in ./aggregate.ts") and the CONTEXT.md pointer; `USAGE` is unchanged. Deleted both `aggregate.ts` section banners (`// --- The DevTools export wire format … ---`, `// --- What this module produces ---`) and the `addRoot` / `addElement` slot-layout comments in `aggregate.spec.ts`. Kept, as your Fix asked: the `replayAdd` record-layout comment, `i = 2; // [0]=rendererID, [1]=rootID`, the per-op case comments, and the spec whys on string-table length, skip-width, snapshot fallback and string id 0.
> **review, round 2:** verified

### F2 · nit · standards · `tools/profiling/CONTEXT.md:12`

**Claim.** The Files table grew from one row to four. The `aggregate.spec.ts` row restates tests-unit.md (co-located specs) and the ticket's fixture rationale ("No real export is committed — one would pin the fixtures to a single DevTools version"). The `run.sh` row restates `package.json` `profile:analyze` and `.gitignore`. docs.md: leave out "Anything one lookup gives: package.json scripts, the directory listing" and "Anything another doc states."

**Fix.** Keep a short table for the CLI-vs-importable split (`index.ts` vs `aggregate.ts`). Drop the spec and run.sh rows, and the algorithm restatement.

**Status:** resolved — verified

> **resolve-review, round 1:** fix — dropped the `aggregate.spec.ts` and `run.sh` rows from the Files table; it now carries only the `aggregate.ts` / `index.ts` rows, i.e. the importable-vs-CLI split. The no-real-export rationale keeps its single home in the `aggregate.spec.ts` header comment.
> **review, round 2:** verified

### F3 · nit · standards · `tools/profiling/index.ts:38`

**Claim.** `const top = getOption('top', 40)` and `const minMs = getOption('min-ms', 15)` leave the CLI defaults as bare literals. code-quality.md Magic numbers: "Extract magic numbers into named `UPPER_SNAKE_CASE` constants."

**Fix.** `const DEFAULT_TOP = 40;` `const DEFAULT_MIN_MS = 15;`

**Status:** resolved — verified

> **resolve-review, round 1:** fix — extracted `const DEFAULT_TOP = 40;` and `const DEFAULT_MIN_MS = 15;` above the call sites; `index.ts` now reads `getOption('top', DEFAULT_TOP)` / `getOption('min-ms', DEFAULT_MIN_MS)`. Scope held to the two CLI defaults — the `aggregate.ts` op codes and index strides are wire protocol and stay as they are.
> **review, round 2:** verified

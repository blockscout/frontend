# Notes — 05

## Calibration set

The ticket asked the developer for 2–3 merged PRs; none were named before the run, so the set was picked
from the last month of merged PRs that carry agent review comments (`— Reviewed by` footer), aiming for
one hit per kind of rubric rule plus two diffs with a task spec:

| Run | Commit screened | `--base` (merge-base) | Why it is in the set |
| --- | --- | --- | --- |
| `pr-3716` | `856e1d6` (PR head) | `ef8c2e698664` | 75 `src/` files, 6 findings; F5 is an `inline-empty-default` breach |
| `pr-3716-reviewed` | `4f12e56` (commit the review was posted on) | `ef8c2e698664` | same PR before the fixes landed — where the breaches still exist |
| `pr-3714` | `b837795` (PR head) | `7f50b5590c2e` | 1 file, 3 findings; F2 is a `magic-number` breach (repeated class string) |
| `pr-3714-reviewed` | `747bde3` (commit the review was posted on) | `7f50b5590c2e` | same PR before the hoisted constant |
| `pr-3730` | `8d8dda4` (PR head, also the reviewed commit) | `a2c56810cfb0` | 8 `.agents/**/*.md` files, 3 findings; the only diff the `rule-without-mechanism` glob matches |
| `pr-3723` | `870803f` (PR head) | `fb31309ba1b0` | 265 touched files, task spec with 6 FRs, **all implemented** (merged); 0 agent review comments |
| `issue-3720` | `17103a1` (this branch at T04) | `cabe2e125176` | task spec with 16 FRs, FR1–FR8 implemented by T01–T04, FR9–FR16 not yet touched |

Every run: `git worktree add --detach <scratch> <commit>`, then from that worktree
`node <this branch>/tools/review-screen/dist/review-screen/index.js --calibration --ticket <run> --base <merge-base> [--spec <path>]`
(the tool itself does not exist at those commits, so the compiled entry point of this branch was run
with the detached worktree as `cwd`). Sidecars: `/Users/tom/Dev/bs/.ai/jev/2026-09-28-detached-branch-<run>.json`,
each with `calibration: true`.

**Why the reviewed commit matters.** Both code PRs merged with their review fixes applied, so at the
head the known breaches are gone: `ContractDetailsDeployedByteCode.tsx` scores 0.16 at the head and 0.64
one commit before; `address-highlight.tsx` scores 0.79 at the head (the hoisted `HIGHLIGHTED_CLASS`
constant, a false positive) and 0.30 before the fix (the real breach, a miss). Recall has to be read from
the `-reviewed` runs, false positives from both.

## Known findings and their cells

Score = best window of the (rule, file) cell. A finding whose rule is not in the rubric has no cell to hit;
its file's cells are listed to show they stayed low (correctness findings are out of the rubric's scope by
design).

### `pr-3716-reviewed` / `pr-3716`

| Finding | Location | Rubric rule | Cell before fix | Cell at head |
| --- | --- | --- | --- | --- |
| F1 major | `CodeEditor.tsx:199` (stale closure) | — | max 0.19 (`inline-empty-default`) | max 0.17 |
| F2 major | `useLoadImageViaIpfs.ts:31` (revoke race) | — | max 0.26 (`inline-empty-default`) | max 0.26 |
| F3 major | `AppErrorTooManyRequests.tsx:102` (reload loop) | — | max 0.23 (`magic-number`) | 0.56 (`magic-number`, the `<= 1` / `- 1` countdown) |
| F4 nit | `useLoadImageViaIpfs.ts:28` (disable reason on the wrong line) | not covered (`explanatory-comment` asks about *what* comments) | 0.09 | 0.07 |
| **F5 nit** | `ContractDetailsDeployedByteCode.tsx:54` | **`inline-empty-default`** | **0.64** | 0.16 (fixed) |
| F6 nit | `useApprovalsQuery.ts:180` (missing `readonly`) | — | 0.53 (`inline-empty-default`, the diff *adds* `EMPTY_KEYS`) | 0.57 |

Top five cells with no known finding (head run; the reviewed run has the same files within ±0.03):

| Score | Rule | File | Reading |
| --- | --- | --- | --- |
| 0.71 (0.74 before fix) | `inline-empty-default` | `src/features/marketplace/hooks/useMarketplaceApps.ts` | **false positive** — the diff changes a `queryKey` and removes an effect; the `return []` is an unchanged context line inside a `queryFn` |
| 0.64 (0.65) | `compound-part-spacing` | `src/toolkit/chakra/input-group.tsx` | **false positive** — the diff is `x && (` → `Boolean(x) && (`; also a toolkit file the rule's `not_for` excludes |
| 0.57 (0.53) | `compound-part-spacing` | `src/toolkit/chakra/field.tsx` | false positive, same change |
| 0.49 (0.46) | `magic-number` | `src/sprite/pages/Sprite.tsx` | false positive — the diff removes a `useState` + effect |
| 0.34 | `derived-array-without-memo` | `src/shared/code-editor/CodeEditorSearch.tsx` | under every threshold considered |

### `pr-3714-reviewed` / `pr-3714`

| Finding | Location | Rubric rule | Cell before fix | Cell at head |
| --- | --- | --- | --- | --- |
| F1 nit | `address-highlight.tsx:34` (dead `hashRef`) | — | — | — |
| **F2 nit** | `address-highlight.tsx:43` (class string at three call sites, plus `100` ms) | **`magic-number`** | **0.30 — miss** | 0.79 — **false positive** (locates line 14, the new `HIGHLIGHTED_CLASS` constant, which the rule's `not_for` names) |
| F3 nit | `address-highlight.tsx:25` (duplicated clearTimeout) | — | — | — |

Single file, so every other cell is on the same file: all ≤ 0.09 in both runs. The model scored this file
the wrong way round — low with the breach, high with the fix. One file is one data point, but it is the
only `magic-number` breach in the set, so the rule's threshold gets no override in either direction.

### `pr-3730`

| Finding | Location | Rubric rule | Cell |
| --- | --- | --- | --- |
| F1 major | `grill-the-task/SKILL.md:97` (dropped the Russian-language rule; no pointer to `slack-message.md`) | partly `rule-without-mechanism` | 0.09 — miss |
| F2 major | `grill-the-task/SKILL.md:141` (two attribution rules disagree) | — | 0.09 |
| F3 major | `resolve-config-request/SKILL.md:76` (same as F1) | partly `rule-without-mechanism` | 0.11 — miss |

Top five cells with no known finding: `prepare-release/SKILL.md` 0.10, `slack-message.md` 0.09,
`README.md` 0.09, `slack-message-template.md` 0.08, `AGENTS.md` 0.07. The rule's max over all 22 md
files in the whole set is 0.25 (`3722-mobile-lists-to-tables/spec.md`, which its `not_for` excludes). No
threshold separates anything here; the findings are about a *removed* instruction and a contradiction,
which the question does not ask about. Recall gap in the rubric wording, not the threshold — left for the
pilot's `--report` to confirm or not.

### `pr-3723` (0 agent review comments)

The PR had no agent review, so its known findings are the top cells the developer confirmed as real
breaches after the run — findings the axes would have had to raise and did not. Every one is a changed or
new line, checked in the diff:

| Score | Rule | File:line | Reading |
| --- | --- | --- | --- |
| 0.76 | `magic-number` | `LatestArbitrumDeposits.tsx:21` `const itemsCount = 5;` | **confirmed by the developer** — product limit in a camelCase local |
| 0.74 | `raw-style-value` | `LatestCrossChainTxsTableItem.tsx:34` `lineHeight="24px" fontWeight={ 700 }` | **confirmed by the developer**, new file |
| 0.73 | `inline-empty-default` | `ZetaChainCCTxs.tsx:141` `txs={ items ?? [] }` | **confirmed by the developer** (line moved from the deleted list view) |
| 0.73 / 0.71 / 0.70 | `magic-number` | `LatestOptimisticDeposits.tsx:20`, `LatestCrossChainTxs.tsx:19`, `LatestTxs.tsx:25` — the same `= 5;` | as the first row; consistent scores across four files |
| 0.69 / 0.67 | `magic-number` | `LatestZetaChainCCTXs.tsx` `= 5;`, `LatestWatchlistTxs.tsx` `= 8;` | the same pattern as the first row, just under the threshold — the rule's boundary sits inside one repeated construct |
| 0.53 | `inline-empty-default` | `MultichainUserOps.tsx` | under the rule's 0.6 override |
| 0.44 | `raw-style-value` | `LatestZetaChainCCTXItem.tsx` (`fontWeight={ 600 }`, `w="36px"`) | the same pattern as the 0.74 row, scored lower |

The remaining 1 489 cells are ≤ 0.46. Six suspects from 265 files at the chosen thresholds.

### `issue-3720` (no standards findings known; the spec grid is the point of this run)

Top standards cells: `explanatory-comment` on the tool's own files — `origins/match.ts` 0.73,
`select/spec.ts` 0.67, `grid/shared.ts` 0.63, `grid/standards.ts` 0.62, `origins/parse.ts` 0.55. All are
module-header comments (“What both grids share: …”, “The match is mechanical: …”) that T01–T04 landed on
purpose. The developer does not count them as breaches, so the rule's `not_for` gained an entry for a
module's opening comment (`rubric.ts`); the cells above predate that entry.

## Spec grid

Best score per requirement over all files (the value the threshold compares):

| Run | Implemented requirements | Not implemented |
| --- | --- | --- |
| `pr-3723` (all 6 FRs done) | FR1 0.93, FR2 0.91, FR4 0.92, FR6 0.83, FR3 0.72, **FR5 0.67** | — |
| `issue-3720` (FR1–8 done) | FR1 0.95, FR2 0.96, FR3 0.93, FR4 0.96, FR5 0.95, FR6 0.95, FR7 0.93, FR8 0.95 | FR9 0.74, FR11 0.72, FR13 0.71, FR10 0.67, FR12 0.63, FR15 0.60, FR14 0.57, FR16 0.46 |

| `SPEC_THRESHOLD` | Gaps caught (of 8) | False positives on the complete PR (of 6) |
| --- | --- | --- |
| 0.3 (starting value) | 0 | 0 |
| 0.65 | 4 — FR12, FR14, FR15, FR16 | 0 |
| **0.7 (chosen)** | 5 — + FR10 | 1 — FR5 |
| 0.75 | 8 | 2 — FR5, FR3 |

FR5 of #3722 is “no experiment code remains” — a removal; the state carries new-side lines only, so a
removal requirement scores low by construction (recorded as a gotcha in `CONTEXT.md`). FR9/FR11/FR13 of
this task score 0.71–0.74 on `origins/match.ts` and `package.json` because the origins recording (T04) is
half of what those requirements describe. A cleaner cut needs more branches than two.

## Thresholds chosen

- **`DEFAULT_STANDARDS_THRESHOLD = 0.7`, unchanged.** Over 2 576 (rule, file) cells across the seven runs,
  p90 is ≤ 0.21 for every rule; 0.7 is where the labelled cells split — above it 6 confirmed breaches
  (#3723), 2 false positives (`useMarketplaceApps.ts` 0.71/0.74, `address-highlight.tsx` 0.79 at head) and
  1 debatable comment; between 0.6 and 0.7 there are 2 toolkit false positives, 3 debatable comments and
  one real breach (F5). Lowering the default to 0.6 would buy one hit for five extra suspects.
- **`STANDARDS_THRESHOLD_OVERRIDES['inline-empty-default'] = 0.6`.** The one known breach of the rule
  scores 0.64; the rule's nearest non-breaches sit at 0.57/0.53 (`useApprovalsQuery.ts`, where the diff
  *adds* the constant) and everything else ≤ 0.26. At 0.6 it catches F5 and adds nothing else in the set.
- **No override for `magic-number`.** The one breach scores 0.30 and the one fix scores 0.79; no threshold
  fixes an inverted signal. Its four #3723 hits are consistent (0.70–0.76), so 0.7 keeps them.
- **No override for `rule-without-mechanism`, `code-restating-doc`, `derived-array-without-memo`,
  `inline-date-format`, `route-string-concat`.** Max cells 0.25 / 0.41 / 0.34 / 0.17 / 0.24 — no breach
  and no false positive in the set, nothing to tune against.
- **`SPEC_THRESHOLD = 0.7`** (from 0.3, which caught nothing). Table above.
- **`MAX_SUSPECTS = 12`, unchanged.** The largest run (265 files) yields 6 standards + 1 spec suspects at
  the chosen values; this branch yields 1 + 5. The cap never bit.

## Hits / misses / false positives at the chosen values

| Run | Suspects sent | Hits (known finding) | Misses (known, under threshold) | False positives |
| --- | --- | --- | --- | --- |
| `pr-3716-reviewed` | 2 | 1 — F5 (0.64) | 0 rubric-covered | 1 — `useMarketplaceApps.ts` |
| `pr-3716` (head) | 1 | 0 (F5 fixed) | 0 | 1 — `useMarketplaceApps.ts` |
| `pr-3714-reviewed` | 0 | 0 | 1 — F2 (0.30) | 0 |
| `pr-3714` (head) | 1 | 0 | 0 | 1 — the hoisted constant |
| `pr-3730` | 0 | 0 | 2 partial — F1, F3 | 0 |
| `pr-3723` | 6 standards + 1 spec | 6 — all confirmed by the developer after the run | 2 — the same construct at 0.69 / 0.67 | 1 spec (FR5) |
| `issue-3720` | 1 standards + 5 spec | 5 spec gaps | 3 spec gaps (FR9, FR11, FR13) | 1 — the module-header comment |

## Cost and latency (from the sidecars' `calls`)

| Run | Calls | Input tokens | Sum of call time | Wall time |
| --- | --- | --- | --- | --- |
| `pr-3714` | 2 | 4.6k | 0.6 s | 0.9 s |
| `pr-3730` | 8 | 7.2k | 2.3 s | 1.2 s |
| `pr-3716` | 71 | 148k | 17.2 s | 6.1 s |
| `issue-3720` | 68 | 211k | 17.0 s | 5.6 s |
| `pr-3723` | 395 | 754k | 96.2 s | 28.5 s |

No call took over 0.5 s; wall time is the sum divided by the pool of 4, plus `tsc`. The largest PR in
the set costs about 3 cents.

## Developer's calls (after reading the above)

- The #3723 hits (`const itemsCount = 5;` ×4, `lineHeight="24px" fontWeight={ 700 }`, `items ?? []`) are
  findings the axes missed.
- Module-header comments are not breaches: `explanatory-comment.not_for` gained “a module's opening
  comment that states what the file is for and what it must keep true”.
- Thresholds accepted as set.

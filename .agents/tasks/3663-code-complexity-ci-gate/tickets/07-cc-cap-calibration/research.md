# CC cap calibration — findings handoff (from ticket 06)

Everything the ticket-06 calibration learned, so a fresh session can push the caps further without
re-deriving it. All figures come from a full-repo run with `?.` excluded (ADR 0004), on the tool as it
stands after ticket 06 (`switch` = `1 + nesting`, boolean sequences = +1 per run of like operators).

## How to reproduce the distribution

Fast path (cognitive only, no vitest):

```bash
./tools/code-complexity/run.sh --no-coverage --verbose      # full-repo table, incl. the CX column
```

For per-kind percentiles and cap-firing counts, walk the tool's own modules over the in-scope files —
`getAllSourceFiles()` (from `dist/diff.js`) filtered by `isInScope` (from `dist/scope.js`), then
`computeFunctionComplexities()` (from `dist/complexity.js`) per file, bucketing by
`fn.containsJsx ? 'jsx' : 'behavior'`. (Compile first: `tsc -p tools/code-complexity/tsconfig.json`.)
A throwaway script of exactly this shape produced the tables below.

## The distribution (full repo)

**behavior** (n = 4273): p50 0 · p90 3 · p95 5 · p97 7 · p99 10 · max 43

| cap | 10 | 12 | 14 | 15 | 16 | 18 | 20 | 25 | 30 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| functions over | 38 | 25 | 20 | 15 | 12 | 6 | 4 | 3 | 2 |

**jsx** (n = 2265): p50 1 · p90 8 · p95 11 · p97 14 · p99 20 · max 90

| cap | 10 | 12 | 14 | 15 | 16 | 18 | 20 | 22 | 25 | 30 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| functions over | 123 | 88 | 64 | 57 | 46 | 31 | 22 | 17 | 15 | 11 |

**Retired cyclomatic gate (for the "net-looser" comparison):** behavior `cx > 12` fired on **33**;
jsx `cx > 30` fired on **10**; total **43**.

## What ticket 06 chose, and why

- **behavior = 14** → 20 fire. **Pinned at 14**: the loosest cap that still trips `useEtherscanRedirects`
  (CC 15), the deep-nested example the parent spec named as a required trip. Any looser and it passes.
- **jsx = 25** → 15 fire. A monster-render-body backstop (CC ≥ 26).
- Combined **35 < 43** → net-looser overall, satisfying the acceptance criterion.

## The tensions to push on

1. **behavior is pinned, not optimised.** 14 is entirely determined by the CC-15 trip target, not by a
   natural break in the distribution. The distribution's own elbow is lower (p99 = 10). If the
   `useEtherscanRedirects` anchor is negotiable, behavior could go either way:
   - *Tighter* (e.g. 10–12): catches more of the branchy tail (25–38 fire) — but re-introduces the
     over-flagging the ticket set out to fix; check these are genuinely nested, not wide-shallow.
   - *Looser* (e.g. 16–18): 6–12 fire, only the clearly-nested handful — but `useEtherscanRedirects`
     passes at ≥16, so decide that's acceptable first.

2. **jsx is per-kind stricter than the retired cap** (15 vs 10). To be net-looser per-kind too, push to
   **30–32** (11 → ~8 fire). The tail has no sharp elbow; candidate monsters by CC:
   `TxDetails 90`, `SearchResultTableItem 88`, `SearchResultListItem 56`, `BlockDetails 55`,
   `NavigationPromoBannerContent 47`, `TxsStats 46`, `AddressDetails 43`, `AddressPageContent 36`,
   then a long ~32→26 shoulder. Note `NavigationPromoBannerContent` is CC 47 vs cyclomatic 24 — CC
   *higher* than cyclomatic, from nested conditional rendering; that is the kind of thing the jsx cap
   newly catches, and the question is whether that is wanted.

3. **High flat-breadth functions.** `useNavItems` main `useMemo` callback: CC 43 (oracle 32), cyclomatic
   48 — but essentially flat (max nesting 1). ~20 defaulting ternaries + ~20 boolean runs. It is not
   "wide-shallow that reads fine"; 40 independent decisions in one function is genuinely heavy. Still, if
   the intent is "penalise nesting, forgive breadth," the model has no breadth cap and this trips on
   breadth alone. Decide: accept (decompose the function), or add a separate flat-breadth policy.

## What the gate correctly rescued (evidence the thesis works)

High-cyclomatic / low-cognitive `behavior` functions that the retired cyclomatic cap flagged and CC now
clears — the wide-but-shallow win:

| function | cyclomatic | cognitive |
| --- | --- | --- |
| `search/utils/search-categories.ts` `getItemCategory` | 18 | 6 |
| `tx-interpretation/.../summary-to-plain-text.ts` `variableToPlainText` | 14 | 3 |
| `name-services/clusters/.../page-utils.ts` `transformAddressDataToDirectory` | 11 | 4 |

## Cross-checks worth keeping in mind

- **CRAP is untouched by CC** and still uses cyclomatic (`c²·(1−cov)³ + c`, cap 80). Re-calibrating the
  CC caps does not affect CRAP; if you also revisit CRAP, do it as its own axis.
- **Oracle deltas** (from ticket 06): after `switch` = `1 + nesting`, nesting-heavy code matches
  `eslint-plugin-sonarjs@4.2.0` exactly; the only residual deltas are boolean (that version scores pure
  `||`/`??` chains as 0 and collapses `&&`-containing expressions to +1, while we follow the written
  SonarSource per-run model). Keep this in mind if you validate any new distribution against the oracle.

---

## Session-2 decision (this ticket): quadratic nesting + `??` exclusion

The investigation above is resolved. Two model changes were chosen and the caps re-set on the resulting
distribution. These are the targets the recalibration leaf must reproduce.

### Why the linear model couldn't be fixed by moving the cap

The SonarSource white paper (v1.7) **counts breadth**: every `if`/ternary/loop/`catch` is `+1`, flat or
not, with no breadth discount. Nesting is an *additional* per-level increment. So "forgive breadth,
punish nesting" is not achievable under the linear model at any cap — the flat-breadth offenders
(`useMarketplaceApps` 18, `getFormDefaultValues` 18, `toTokenModel` 14) and the nested anchor
(`useEtherscanRedirects` 15) overlap in score. Two changes separate them.

### Change 1 — exclude `??`

The paper explicitly ignores null-coalescing operators as readable shorthand (same class as `?.`). The
tool counted `??`/`??=` in its boolean-sequence set — a conformance bug. Removing it clears pure-`??`
defaulting objects entirely (`toTokenModel` 14→0, `toTokenInstanceModel` 11→0) and drops 3 tail functions
below 14, but leaves the flat ternary/`||` offenders (they are correctly counted by the paper). On its
own it moves behavior-over-14 from 20 → 17. Not sufficient alone — hence change 2.

### Change 2 — quadratic nesting `1 + n²`

Structural increments change from `1 + n` to `1 + n²` (n = 0-based depth). Consecutive differences are the
odd numbers (1,3,5,7…): each new depth level costs 2 more than the last. It is identical to linear at
n = 0,1 and diverges only at n ≥ 2 (the third nesting level), so it is a **surgical surcharge on the deep
tail** — the bulk distribution and all flat/shallow code are unchanged. Ternary chains are **not**
flattened (an eslint rule already bans nested ternaries), so a nested ternary is penalised like any other
nesting.

Right-leaning ternary-chain flattening was considered and **rejected** for that reason.

### Behavior distribution (n=4273, `??` excluded)

Percentiles are unchanged linear→quad (p50 0 · p90 3 · p95 5 · p99 10 · max 43) — quadratic only touches
the deep tail.

| cap | 14 | 15 | 16 | 18 | 19 | 20 | 22 | 24 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| over, linear `1+n` | 17 | 13 | 11 | 6 | 6 | 4 | 4 | 3 |
| over, **quad `1+n²`** | 21 | 17 | 15 | 9 | 9 | **8** | 7 | 4 |

### Chosen cap: behavior = 20 (fires on 8), classified

**bold** = climbed under quadratic (genuinely nested); the rest are flat.

| quad | lin | function | |
| --- | --- | --- | --- |
| 43 | 43 | `useNavItems` useMemo | flat — 40 decisions, accepted as heavy |
| **42** | 36 | `useValidateField` | deep |
| **33** | 29 | `getFromTo` (noves) | deep |
| **28** | 24 | `getDefaultValues` (contract) | deep |
| **24** | 20 | `getFullPathOfImportedFile` | deep |
| **23** | 15 | `useEtherscanRedirects` (anchor) | deep — trips with margin |
| **23** | 17 | `SearchResults` handler | deep |
| **21** | 15 | `calculateHasNextPage` | deep |

Just under the cap (forgiven, flat/length-driven): `Address.tsx` 20, `getFormDefaultValues` 18,
`useMarketplaceApps` 18, `base` 17, `useCallMethodWalletClient` 17, `matchFilters` 15. Cap 18 would
re-catch the flat 18s (false positives); cap 22 would drop the nested `calculateHasNextPage` (21). 20 is
the natural gap.

### jsx distribution (n=2265, `??` excluded)

Barely moves: linear p99=19 max=89 → quad p99=20 max=92. Firing counts over cap 25: linear 14, quad 16.
Notable climbers: `SearchResultTableItem` 86→92, `SearchResultListItem` 56→68, `NavigationPromoBannerContent`
47→55, `Skeleton` 19→31 (nested conditional rendering). The jsx cap is re-confirmed against this run at its
natural backstop (~25); the model change does not reshape the jsx tail.

# code-complexity — the caps and how to re-tune them

The numbers in `./config.ts`, the distribution they were derived from, and the procedure for deriving
them again. Read this before changing a cap.

**Raising a cap is a recalibration, not a way to unblock a PR.** The three caps are coupled to each
other and to the counting model in `./SCORING.md` — the model's job is to separate wide-but-shallow
code from genuinely-nested code, and the caps are placed at where that separation actually falls in
this repo's distribution. Move one in isolation and the gate stops measuring what it was set up to
measure. If a function trips a cap, the fix is in the function.

## The current caps

| Constant | Value | Applies to |
| --- | --- | --- |
| `DEFAULT_MAX_COGNITIVE_BEHAVIOR` | 20 | CC on handlers, hooks, utils |
| `DEFAULT_MAX_COGNITIVE_JSX` | 25 | CC on render bodies |
| `DEFAULT_MAX_CRAP` | 80 | CRAP on `behavior` functions |

Calibrated from a full-repo CC run under the current model — `?.` and `??` not counted, nesting
charged `1 + n²` (`./adr/`). The distribution: `behavior` n=4273, p99=10, max 43; `jsx` n=2265,
p99=20, max 92.

### Why behavior 20

**The natural gap in the distribution.** The flat-breadth band tops out at 20 and the
genuinely-nested band starts at 21 — the cap sits in the gap rather than on a percentile. That gap
exists *because* nesting is quadratic; it does not survive a return to linear.

Fires on 8 functions, of which 7 climbed under the quadratic penalty (they carry a construct at
nesting depth ≥ 2). The deep-nested case the gate was built to catch trips at 23, with margin — the
linear model scored the same function 15, and could only have caught it by also catching the flat 18s.

Tightening to 18 re-catches those false positives. Loosening to 22 drops a genuinely-nested 21.

### Why jsx 25

High enough that hitting it unambiguously means "split this up" — the cap is a backstop, not a
standard (`./CONTEXT.md` covers why render bodies are gated that way).

Fires on the 16 most oversized render bodies (CC ≥ 26). Unlike the `behavior` tail, **the jsx tail
has no elbow** — this sits on a smooth shoulder, so it is a judgment call about where "decompose
this" starts, not a gap in the data. The quadratic change barely moved this tail (p99 19→20, max
89→92), which is why 25 carried over unchanged.

### Why CRAP 80

CRAP is `c²·(1 − cov)³ + c`. The 0%-coverage floor dominates the tail, where CRAP reduces to `c² + c`,
so 80 flags untested `behavior` code from cyclomatic **9** up. That catches branchy-and-untested logic
without tripping on the large population of ordinary untested low-complexity helpers.

## What the caps were checked against

**The retired cyclomatic gate.** The first-pass gate capped cyclomatic directly (`behavior` cx > 12
fired on 33, `jsx` cx > 30 on 10; 43 total). The two CC caps fire on 24 — net looser overall, though
`jsx` is per-kind stricter (16 vs 10). The wide-but-shallow logic the old count over-flagged now
clears: the three biggest rescues dropped from cyclomatic 18/14/15 to CC 6/2/0.

**The `tools/**` scope widening.** Measured against these caps; it does not move the tail, so they
stood unchanged. The extension adds 185 `behavior` functions and no `jsx` ones, and the 132 written in
TypeScript top out at exactly CC 20 with none over. Only two functions break, both in `.mjs` scripts:

| Function | Breaks | Score |
| --- | --- | --- |
| `checkFile` in `tools/scripts/check-doc-links.mjs` | CC | 58 |
| `replayOperations` in `tools/profiling/aggregate-react-profile.mjs` | CRAP | 182 (cx 13 at 0% coverage) |

Both are tracked in issue #3674 rather than exempted here. (`tools/dev-server/sync-preset-lists.mjs`
is clean.) So the `behavior` over-cap count across the repo is the calibrated 8 for `src/**` plus
`checkFile`.

Re-tuning off tooling code would re-open a calibration argued from the `src/**` distribution on the
strength of ~4% more functions — don't.

## Re-tuning

1. **Get the CC distribution.** `pnpm test:code-complexity --no-coverage --verbose` scores every
   in-scope function with no vitest run at all, so it returns in seconds.
2. **Split by `KIND`.** `jsx` and `behavior` have different shapes and are tuned independently; a
   figure pooled across both is meaningless.
3. **Look for the gap, not the percentile.** A cap is defensible when it sits in a break between two
   bands, and a judgment call when it sits on a smooth shoulder — say which one you found.
4. **Classify what each candidate cap fires on.** For every function over the line, check whether it
   is nesting-driven (an increment at depth ≥ 2 — the annotation names the deepest pocket) or
   flat-breadth. The cap is right when it catches the former and clears the latter. Record the
   one-step-tighter and one-step-looser outcomes, as above; a cap with no stated neighbours is a cap
   nobody can review.
5. **Confirm the anchors.** The functions the gate exists to catch must still trip, with margin.
6. **For CRAP,** generate whole-suite coverage once and iterate against it rather than regenerating
   per run:

   ```bash
   npx vitest run --coverage --coverage.provider=v8 --coverage.reporter=json \
     --coverage.reportsDirectory=/tmp/cc-cov
   pnpm test:code-complexity --coverage-file /tmp/cc-cov/coverage-final.json
   ```

7. **Record the new figures here**, and update `./config.ts`'s pointer if the shape of the argument
   changed. If you changed an *increment rule* rather than a cap, that is a decision for `./adr/` and
   it demands a fresh full-repo recalibration in the same PR.

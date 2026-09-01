# Code complexity — the caps and how to re-tune them

The numbers in `../config.ts` and the procedure for deriving them again. Read this before changing a cap.

**Raising a cap is a recalibration, not a way to unblock a PR.** The three caps are coupled to each
other and to the counting model in `./MODEL.md` — the model's job is to separate wide-but-shallow
code from genuinely-nested code, and the caps are placed at where that separation actually falls in
this repo's distribution. Move one in isolation and the gate stops measuring what it was set up to
measure. If a function trips a cap, the fix is in the function.

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
   one-step-tighter and one-step-looser outcomes; a cap with no stated neighbours is a cap
   nobody can review.
5. **Confirm the anchors.** The functions the gate exists to catch must still trip, with margin.
6. **For CRAP,** generate whole-suite coverage once and iterate against it rather than regenerating
   per run:

   ```bash
   npx vitest run --coverage --coverage.provider=v8 --coverage.reporter=json \
     --coverage.reportsDirectory=/tmp/cc-cov
   pnpm test:code-complexity --coverage-file /tmp/cc-cov/coverage-final.json
   ```

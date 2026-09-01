# Add diff-scoped mutation testing

| | |
| --- | --- |
| Issue | https://github.com/blockscout/frontend/issues/3665 |
| Feature branch | `issue-3665` |
| PM | — (frontend tooling task) |
| Designer | — |
| Backend | — |
| Minimum API version | — |
| Slack channel | — |

## Context & goal

Coverage answers "was this line executed?". It cannot answer "would a bug here be caught?" — a test can
execute a branch and assert nothing about it. Mutation testing answers the second question directly: change
the code, and see whether any test notices.

The goal is to measure **assertion strength of the vitest specs the repo already has**, and to stop new,
weakly-asserted logic from landing.

## Functional requirements

1. A CLI runs StrykerJS with the vitest test runner over a selected set of source files and reports which
   mutants survived — that is, which code changes no test detected.
2. **Only logic mutators are generated**: conditional expressions, equality operators, logical operators,
   arithmetic operators, and boolean literals. Every other mutator class is excluded at generation time, not
   filtered afterwards.
3. A file is **eligible** only when a co-located vitest spec exists beside it (`X.spec.ts` / `X.spec.tsx`
   next to `X.ts` / `X.tsx`). Ineligible files are
   never mutated, so a file with no unit test produces no findings rather than a run of unkillable mutants.
4. Mutants located inside a **`jsx` function body** are excluded, using the same AST function
   classification the complexity gate applies. `behavior` functions are mutated wherever they live.
5. The CLI has three **selection** modes, mirroring the complexity gate's flags:
   the **full eligible set** when invoked bare, **focused** on whole files when given explicit paths,
   and **diff-scoped** under `--changed[=<ref>]` (default `origin/main`, resolved through the merge-base so
   it captures the branch's own commits plus uncommitted edits, and never base-branch churn).
6. In diff-scoped mode, only the **changed lines** are mutated, expressed as Stryker mutation ranges. This
   restricts mutant *creation*, not merely reporting . Focused mode mutates whole files.
7. When the selection resolves to nothing, the CLI exits 0 **without invoking Stryker at all**, printing one line
   explaining why it found nothing to do.
8. Output is produced by consuming Stryker's JSON report rather than its clear-text reporter, which is
   unusable at this scale. It comprises a per-file table (score, mutants, killed, survived, no-coverage) and
   a listing of findings **grouped by source line**. Survivors and no-coverage mutants are separated, keyed off the
   `status` field Stryker records per mutant; no-coverage is summarised compactly, being a coverage finding
   the CRAP gate already owns.
9. An HTML report is written to a gitignored path and its location printed.
10. Results are **deterministic**: repeated runs over an unchanged tree produce identical counts. This
    requires static mutants to be ignored by default, a raised mutation timeout, and the exclusion in FR11.
11. The `*.primed.spec.tsx` drift tests are excluded from the vitest runs this tool triggers. They mount
    whole pages without exercising behaviour, so their kills are incidental to the question being asked, and
    they dominated runtime. This matches the complexity gate, which already excludes them from its coverage runs.
12. A **mutant cap** bounds any single run. When a selection exceeds it, the CLI reports the count and skips
    rather than grinding; the skip is always stated in the output and never silent.
13. Stryker's own configuration lives in a **committed config file**, so every setting is reviewable in a
    diff and schema-validated in an editor. The CLI contributes only what genuinely varies per run.
14. A **CI job** runs the tool diff-scoped on pull requests. It is its own job — it cannot reuse the unit-test
    job's artifacts, because Stryker must drive vitest itself — and it chains on the unit-test job, since a
    red suite makes Stryker abort during its dry run with an error that reads like a tooling failure.
15. **The CI job fails when any mutant on a changed line survives.** Findings are additionally emitted as
    inline annotations on the PR diff, naming the surviving mutator and the line, so they are visible during
    review rather than buried in a job log.
16. Suppressing a mutant requires Stryker's disable comment carrying **both the mutator name and a reason**;
    blanket file-level disables are not permitted. This makes each suppression a reviewable claim rather
    than a mute button.

## Data & API

None. This task adds no runtime code, no API resource, and no environment variable.

## UI inventory

None. This task ships no user-facing surface.

## Implementation decisions

- **Two pnpm integration blockers must be handled; both were reproduced and solved during grilling.**
  - Stryker fails to boot because the repo pins `brace-expansion` to a 1.x security override globally, while
    the `minimatch` version Stryker depends on needs a 5.x ESM build. The fix is a **scoped** override for
    that dependency path only, following the precedent already in the workspace file for `vite-plugin-dts`.
    The global security pin is not widened.
  - Stryker discovers plugins by globbing its own scope in `node_modules`, which pnpm's isolated layout
    defeats: the run fails with "no TestRunner plugins were loaded". The vitest runner must be named
    explicitly in the config's plugin list.
- Stryker copies the project into a sandbox per run, so its ignore patterns need tuning; left untuned it
  also fails outright on symlinks under agent worktree directories.
- **Diff resolution and file-scope logic are reused from the complexity gate**, not reimplemented — the
  merge-base resolution, the `--unified=0` hunk-range parsing, the scope allowlist, and the AST function
  classifier FR4 needs. Direct import across tool directories is the right coupling for now; extracting a
  shared location is warranted only if a third consumer appears.
- **StrykerJS has no `--since` flag.** The issue proposed one, but that option belongs to Stryker.NET; the
  JS CLI has no equivalent. Diff-scoping is therefore something this tool computes and expresses through
  mutation ranges, which is why FR5 and FR6 are stated the way they are.
- **No incremental mode and no committed report artifact.** The issue proposed committing
  `reports/stryker-incremental.json`; it is rejected.
- **Runtime is governed by import-graph centrality, not mutant count.** Five leaf utilities with 140 mutants
  ran in 10 seconds; one 28-mutant file imported across the app took 70 seconds, because Stryker's dry run
  executes everything related to it. This is why FR12 caps by mutant count and the CI job carries an
  explicit timeout, rather than assuming diff size predicts cost.
- The gating mutator set in FR2 was chosen from evidence, not taste. Sampling 22 survivors across all
  mutators found roughly a third unkillable by any vitest test — React dependency arrays, theme-variable
  objects, colour-token string literals, all of them visual or idiomatic rather than behavioural. Sampling
  18 survivors restricted to the logic mutators found **zero** such cases; all 18 were real gaps.
- Promoting or demoting a mutator class is a one-line config change, which is the intended ratchet if the
  excluded classes later prove to hide a real bug.

## Out of scope

- **The `review-changes` skill's "mutation-thinking" prompt.** The issue proposed adding an LLM reasoning
  step to that skill's correctness axis; it is dropped from this task entirely.
- **Playwright tests.** Stryker's vitest runner cannot execute them, and browser mode is explicitly
  unsupported. Nothing in the 228-file screenshot suite is measured.
- **Non-logic mutators** — string literals, array and object declarations, block statements, optional
  chaining, method and call expressions, arrow functions, regexes. Not generated, not reported.
- **A scheduled or whole-repo CI run.** The full eligible set took 17 min 29 s locally before FR2's mutator
  restriction; it is reproducible on demand via the CLI's bare invocation, but no workflow runs it.
- **A mutation-score percentage threshold.** The gate is "no survivor on a changed line" (FR15). A
  percentage is unstable at the small mutant counts a diff produces, where one survivor can swing the number
  by double digits.
- **Files without a co-located vitest spec**, including newly added untested files. Catching those is the
  CRAP gate's role.

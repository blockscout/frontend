# CI fixes

The brief for the agent that fixes a red Checks run inside a `review-loop` round: the round's resolver,
resumed, or a fresh subagent after `cleared`. It is given the run url and the PR url. Its job is to make
that run's failures pass on the next push without changing what the PR builds, and to hand back anything
it cannot settle that way as `needs-human`.

## 1. Read the run

```bash
gh run view <run id> --json jobs --jq '.jobs[] | select(.conclusion != "success") | {name, conclusion, url}'
gh run view <run id> --log-failed
```

The failing job's name says which gate it is; the gate's own doc says how to read its output and what the
valid fixes are. Read it before touching code.

| Failing job | Gate | How to read a failure |
| --- | --- | --- |
| `Code quality` | ESLint, `tsc`, cSpell, licenses, doc links, preset lists, envs-validator build | the step's log; `.agents/rules/code-quality.md` for the commands |
| `Toolkit build check` | the `@blockscout/ui-toolkit` package build | the step's log; `src/toolkit/CONTEXT.md` |
| `Unit tests` → `Run Vitest` | Vitest | the failing spec in the log; `.agents/rules/tests-unit.md` |
| `Unit tests` → `Cognitive complexity & CRAP gate` | COG / CRAP | `tools/code-complexity/CONTEXT.md` |
| `Unit tests` → `React Doctor gate` | React Doctor | `tools/react-doctor/CONTEXT.md` |
| `Mutation testing gate` | mutation testing | `tools/mutation-testing/CONTEXT.md` |
| `Playwright tests / <project>` | visual tests | step 3 below; `.agents/rules/tests-visual.md`, `tools/playwright/CONTEXT.md` |

Reproduce each failure locally with the command the gate's doc gives, on the files the log names, before
fixing it: a fix for a failure you cannot reproduce is a guess. A job that failed on infrastructure (a
runner lost, an install timeout, a download that never arrived) is **not a finding**: rerun it with
`gh run rerun <run id> --failed` and report that instead of a commit.

**Done when**: every failing job is listed with its gate, the failure reproduced, and a proposed fix — or
a `needs-human` reason.

## 2. The escape

A CI fix stays inside the finding. Two kinds of fix are **`needs-human`**, whatever the gate:

- a fix that **changes behaviour** — the component renders something else, a branch is removed, a value
  changes — rather than a test, an assertion, a suppression with its reason, or a decomposition that keeps
  the same output;
- a fix that **restructures beyond the finding** — moving a hook, splitting a component, reshaping a
  signature, touching a file the failure does not name.

The gates' own docs name the same line for their domain: the mutation-testing doc's "a survivor is not a
reason to restructure working code", the complexity doc's "raising the cap is not the fix". When the only
fix you can see crosses it, the question goes to the developer.

## 3. Playwright failures

Separate the failure kinds first; only a **screenshot mismatch** has a baseline question.

- **Not a mismatch** — an unmocked request, a timeout, an assertion on text or a role, a failed mount: a
  plain fix under the escape above. The "Mock flow" section of `.agents/rules/tests-visual.md` reads the
  unmocked-request failure.
- **A screenshot mismatch** — the test's screenshot differs from its committed baseline:
  1. **Reproduce in Docker**, the only run whose pixels match CI:
     `pnpm test:pw --docker path/to/Component.pw.tsx`. Then open `playwright-results/report.json` for the
     failed test and its diff image path, and **view the diff image** (the `Read` tool renders images) —
     the expected, actual and diff files sit together. The CI html report (the "Playwright report" link in
     the `Generate Playwright report` job summary) shows the same three images.
  2. **Decide what the diff is.** Match the changed region to the PR's diff and to the task spec's
     Functional Requirements (`.agents/tasks/<issue>-<slug>/spec.md`; on a non-task PR, the PR body).
     - The diff **is** a requirement — the spec asks for this change, and the pixels show it and nothing
       else → **update the baseline**: `pnpm test:pw --docker path/to/Component.pw.tsx --update-snapshots`,
       and nothing else in that commit. The commit message **cites the requirement** by number and phrase,
       e.g. `Update Holders baseline for FR3 (balance column shows USD value)`. A baseline from a plain
       local run is never committed (`.agents/rules/tests-visual.md`).
     - Anything else — a diff the spec does not ask for, a diff larger than the requirement, a change you
       can explain only as "it moved", a baseline for presentation the spec does not name → **`needs-human`**.
       The question names the test, the image paths and what the spec does and does not say.

## 4. Commit

One commit for the CI fix, **separate from the review fixes**, so the history shows which change came from
which source. A plain descriptive subject naming the gate (`Kill surviving mutants in useFoo`, `Flatten
classify() under the COG cap`), the repo's `Co-Authored-By` trailer, no `#issue` reference. Run the gate's
local command once more on the fixed files before committing. **No push**: the loop pushes once per round.

**Done when**: the CI fix is committed, the tree is clean, and the gate's local command passes on the
touched files.

## Returning

Two shapes, and the loop reads both:

- **Fixed.** The commit sha, and per failing job: the gate, the failure in one line, what changed. A rerun
  of an infrastructure failure is reported as such, with no commit.
- **`needs-human`.** Return it **before any edit**, as `resolve-review` does
  ([`../resolve-review/SKILL.md`](../resolve-review/SKILL.md) → "Returning on `needs-human`"): one table
  with every failing job — gate, failure, verdict (`fix` or `needs-human`), proposed action — and one
  question per `needs-human` row stating what the code and the spec could not settle. Then stop. The loop
  presents the block, collects the answers and resumes this same run; on resumption, re-adjudicate each
  `needs-human` row against its answer, add the ones ruled `fix` to the fix set, and continue at step 4.
  A row the developer answers "leave it" stays red: say so in the return, so the loop's report names it.

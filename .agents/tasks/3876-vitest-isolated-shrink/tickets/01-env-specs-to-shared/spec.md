# 01 — Env-override specs join the shared project

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 01 of #3876 |
| Blocked by | none |

## What to build

A spec that only overrides env variables through `withEnvs` stops needing the isolated name. After this
ticket a developer writes such a spec as a plain `*.spec.ts(x)`, ESLint accepts it, and it runs in the
`shared` project. The two specs that set `process.env` by hand use `withEnvs` instead and move with the
rest. The unit-test rules say what breaks in a shared worker and what does not.

The ticket also records the baseline the task's before/after report is measured against, and pins the one
unexplained failure the research left open (parent spec → "One unexplained failure to pin first").

## Acceptance criteria

- [ ] `notes.md` in this ticket folder holds the baseline, measured before any change: spec-file count per
      project, Vitest's reported duration for three shuffled full local runs, and the unit job's duration
      in three recent CI runs on `main`.
- [ ] ESLint accepts an import of the env-override helper in a spec not named as isolated, and still fails
      every other construct listed in parent FR2.
- [ ] Every spec whose only isolation-dependent construct was `withEnvs` is named `*.spec.ts(x)`. No spec
      still named `*.isolated.spec.ts(x)` passes the shared-spec lint rules.
- [ ] No spec assigns to or deletes from `process.env`. The two CSP specs that did use `withEnvs` and are
      named `*.spec.ts`.
- [ ] A config module's own spec is named `config.spec.ts`, and the app-config convention's exemption
      (ESLint element pattern, its message, the app-config context doc) names it so.
- [ ] `notes.md` states the outcome of pinning the unexplained failure: its cause with the failing output,
      or that it did not recur in 20 shuffled full runs. The `shared` project's test timeout is 10s if and
      only if the cause was a timeout.
- [ ] The unit-test rules no longer list `withEnvs` among the constructs that need an isolated spec, no
      longer call a `withEnvs` spec an isolated one, and state that a module mock and a hand-set
      `process.env` are what break in a shared worker.
- [ ] `pnpm lint:eslint`, `pnpm lint:tsc` and `pnpm lint:doc-links` pass.
- [ ] Five consecutive `pnpm test:vitest --sequence.shuffle.files` runs pass, each on a different seed.
- [ ] The CRAP gate and the mutation-testing gate still find the co-located spec of a source file whose
      spec was renamed.

## Details

- The renames are mechanical: relax the lint rule first, then rename every isolated spec the relaxed rule
  no longer flags. The rule is the test for membership, not a hand-kept list. At spec time that is 42
  specs, plus the two CSP specs once converted.
- A spec that combines `withEnvs` with a module mock keeps its isolated name here. Tickets 02–04 move those.
- `withEnvs`'s context-split caveat is unchanged; keep that paragraph of the unit-test rules, minus the
  isolated-spec wording.
- Pinning the failure: the three files it hit were the app error screen spec, the color-theme settings
  spec and the advanced-filter page spec. Capture full output on every run. A cause other than the
  timeout is a stop for the developer, not a reason to raise the timeout.
- The docs to update: the "Isolation" and "Overriding environment variables" sections of
  `.agents/rules/tests-unit.md`, and the exemption paragraph of `src/config/CONTEXT.md`. The table of what
  stays isolated is ticket 05's.

## Leaf worklist

- [ ] 1 `[agent]` Record the baseline in `notes.md`
- [ ] 2 `[agent]` Relax the shared-spec lint rule to accept the env-override helper
- [ ] 3 `[agent]` Convert the two hand-set `process.env` CSP specs to `withEnvs`
- [ ] 4 `[agent]` Rename every spec the relaxed rule no longer flags; move the config-spec exemption to the new name
- [ ] 5 `[agent]` Pin the unexplained failure; set the `shared` timeout only if it is the cause
- [ ] 6 `[agent]` Update the unit-test rules and the app-config context doc
- [ ] 7 `[agent]` Verify: lint, five shuffled full runs, CRAP and mutation gates on a renamed spec

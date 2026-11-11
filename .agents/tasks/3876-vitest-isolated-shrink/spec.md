# Shrink the isolated Vitest project by moving specs off module mocks and registry resets

| | |
| --- | --- |
| Issue | https://github.com/blockscout/frontend/issues/3876 |
| Feature branch | `issue-3876` |
| PM | tom (frontend tech task) |
| Demo | none |

<!-- Header is static identity — no status row: task status is derived from `progress.md` (see
`.agents/tasks/structure.md`). Rows with nothing to say are dropped; `Demo` is always present because it
drives an action. -->

## Context & goal

The Vitest unit suite runs as two projects (issue #3873): `shared`, where every spec file a worker runs
shares one module registry, and `isolated`, where each spec file gets a fresh one. Evaluating the app's
module graph once per spec file is the largest single cost of a run, and the isolated specs carry most of
it: 89 of 322 spec files (27.6%) are isolated, and they take longer on their own than the other 233
together.

A spec is isolated today when it mocks a module, resets the module registry (directly or through the
env-override helper), or sets `process.env` by hand before importing the code under test. Most of those
specs do not need a registry of their own; they are isolated because the rule that sorts them is wider
than the constraint behind it. This task narrows the rule to what actually breaks in a shared worker and
moves every spec that can move, so a developer's local run and the CI unit job spend less time
re-evaluating the same modules.

It also settles the open item #3873 left behind: with isolation disabled suite-wide, env overrides were
seen not to reach the app config, and the cause was unknown.

## Functional requirements

1. A spec whose only isolation-dependent construct is the env-override helper (`withEnvs`) runs in the
   `shared` project and is named `*.spec.ts(x)`. ESLint accepts the helper in a shared spec.
2. ESLint still fails, in a spec not named as isolated: a module mock or unmock, a direct module-registry
   reset, the socket mock helper, the primed-requests harness, and a hand-set `process.env`.
3. No spec sets `process.env` by hand before importing the code under test. The specs that did use
   `withEnvs` and run in the `shared` project.
4. The specs that mocked internal modules outside the wallet feature run in the `shared` project, asserting
   through the real collaborators (queued fetch responses, env overrides, the test router) instead of
   module mocks.
5. The specs that mocked `mixpanel-browser`, `posthog-js`, `react-scroll` or the app's analytics event
   logger run in the `shared` project, observing the boundary through a spy on the real export.
6. Every spec that remains isolated belongs to a category the unit-test rules name together with its
   reason. Any spec covered by requirements 4 or 5 that stays isolated is listed there individually, with
   the reason the rewrite was not viable.
7. The unit-test rules state what breaks in a shared worker and what does not: the env-override helper is
   safe there; a module mock and a hand-set `process.env` are not. They no longer describe the helper as
   requiring an isolated spec.
8. The app-config convention's exemption for a config module's own spec applies to the spec's new name,
   in the ESLint config and in the app-config context doc.
9. The full suite passes 20 consecutive local runs in shuffled file order, each on a different seed, and
   the CI unit job is green.
10. `--changed` runs, coverage collection, the CRAP gate and the mutation-testing gate keep working for
    specs of both projects.
11. No file under `src/` other than a spec changes.
12. The pull request reports the before and after share of isolated specs and the suite run time, local
    and CI.

## Data & API

None. No endpoint, no `service:name` resource, no env var, no feature flag, no analytics event.

## UI inventory

None. No user-visible surface; test tooling only.

## Implementation decisions

### What the research established

A throwaway config that moved the 42 `withEnvs`-only specs into the `shared` project passed 12 of 12
shuffled runs of that project. The helper resets the registry before and after its callback and restores
both env maps, so it leaves nothing behind. Two things did fail without isolation, and they are the
likely source of the symptom #3873 recorded:

- **A hand-set `process.env`.** Nothing resets the registry, so the override is ignored whenever an
  earlier spec in the worker already evaluated the app config, and the variable then leaks into every
  later spec.
- **A module mock leaking between files.** A later spec in the same worker receives another spec's mock
  of a module it imports for real.

A leaked mock of the app config was tried as a direct explanation and did not reproduce in a single
shared worker. The requirement is the documented distinction above, not a reproduction of the original
failure.

### One unexplained failure to pin first

One full-suite run with the env specs in `shared` failed five tests across three files: the app error
screen spec, the color-theme settings spec, and the advanced-filter page spec (which was already
shared). The output was not captured and the failure did not recur in eight later runs. The working
theory is the test timeout: `withEnvs` re-evaluates the app's module graph inside the test body, the
`shared` project has the 5s default and the `isolated` one has 15s.

Pin the cause before changing anything for it. If it is the timeout, raise the `shared` project's test
timeout to 10s; no per-test overrides. If it is something else, it is a finding for the developer, not a
reason to raise the timeout anyway.

### Moving specs

- A spec that combines `withEnvs` with a module mock moves only once the mock is gone.
- The context-split caveat of `withEnvs` is unchanged by the move: a tree rendered inside the callback
  needs its render helpers and router stand-in imported inside the callback too.
- A rewrite replaces a mocked internal collaborator with the real one and drives it from the boundary. It
  does not weaken what the spec asserts; a spec whose assertions only made sense against the mock is
  rewritten to assert the behaviour, per "What a good test is" in the unit-test rules.
- The spy approach for the third-party boundaries is unverified. These packages export an object whose
  methods the app calls, so a spy on the real export should observe the call without replacing the
  module. The two analytics provider specs replace the whole SDK object and are the likeliest to resist.
- **Fallback:** a rewrite or spy conversion that turns out heavy, or needs a source change, is dropped.
  The spec stays isolated and is listed with its reason (requirement 6).

### What stays isolated, and why

Recorded in the "Isolation" section of the unit-test rules:

| Boundary or category | Decision | Reason |
| --- | --- | --- |
| Wallet stack: `wagmi`, `viem`, Reown AppKit, and the wallet feature's own modules mocked beside them | isolated | Real collaborators mean a real wallet runtime in jsdom |
| `rollbar` | isolated | The SDK is a constructor the code under test instantiates, and the spec resets the registry around the module-level queue it feeds |
| `next/script` | isolated | A component rendered as JSX: there is no method call to spy on, and replacing it needs a source change |
| Specify publisher SDK | isolated | The SDK is a class instantiated inside the feature's client factory; observing it means replacing the constructor |
| `phoenix` (socket mock helper) | isolated | The transport is replaced as a module by design |
| `next/router`, `next/navigation` | isolated | The router adapter's own spec; the adapter is what wraps those modules |
| Module-singleton specs | isolated | Fresh module state is the behaviour under test |
| Primed-requests drift specs | isolated | The harness resets the registry and mocks the socket transport |

### Delivery

One pull request. The before and after numbers in requirement 12 use the same method as the #3880
description: spec-file counts per project, and Vitest's reported duration over several runs rather than
one.

Baseline at spec time: 322 spec files, 89 isolated (80 named isolated, 9 primed). A rough projection
after this task is about 25 isolated; it is an estimate, not a target, since it depends on how many
rewrites and spy conversions hold.

## Out of scope

- **Injecting dependencies** to remove a third-party module mock. Any change to source code under `src/`
  is out; a boundary that needs one stays isolated.
- **The wallet feature's specs.** They stay isolated as a group.
- **The primed-requests drift specs** and their harness.
- **The `isolated` project's own settings** — its timeout, its ordering after `shared`, worker counts.
- **Changing the file-name convention** that sorts specs into projects. Only the rule for which specs
  need the isolated name changes.

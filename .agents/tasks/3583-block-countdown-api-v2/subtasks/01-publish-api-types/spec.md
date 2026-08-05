# Unblock `@blockscout/api-types` publishing and pin a beta from `dev`

| | |
| --- | --- |
| Parent spec | [../../spec.md](../../spec.md) — step 1 of #3583 |
| Status | `done` |
| Sub-branch | `issue-3583-step-1` |
| Backend | Nikita P. |

## Context & goal

Subtask 2 needs the generated type for the countdown endpoint, and no published `@blockscout/api-types`
version has it. Getting one out requires a fix in `blockscout/blockscout` first, so this step is a
prerequisite for the rest of the task.

Three facts pin the approach down:

- The post-14612 countdown schema is on `master`, `dev` and the `v11.2.3` tag alike.
- The `paths` / `operations` / `schemas` type helpers that this repo imports in 469 files exist **only on
  `dev`** — added by [blockscout#14515](https://github.com/blockscout/blockscout/pull/14515) (merged to `dev`
  2026-07-02, not yet on `master`). A package built from `master` or the `v11.2.3` tag has no `paths` export
  and is unusable here.
- `dev`'s `types-package/package-lock.json` is internally inconsistent, so `npm ci` refuses to run and the
  publish workflow dies before building:

  ```
  Invalid: lock file's js-yaml@4.1.1 does not satisfy js-yaml@4.2.0
  ```

  `dev` carries `@redocly/openapi-core@1.34.16`, which declares `js-yaml: "4.2.0"`, while the nested
  `node_modules/@redocly/openapi-core/node_modules/js-yaml` entry resolves `4.1.1`. `master` is consistent
  because it still carries `1.34.15`, which declares `4.1.1`, so merging `master` into `dev` does not fix it
  — the inconsistent pair is dev-only. Verified by a real dispatch:
  [run 30566146869](https://github.com/blockscout/blockscout/actions/runs/30566146869) and reproduced
  locally.

Stable publishing is switched off separately: the `release: [published]` trigger in
`.github/workflows/publish-api-types-npm.yml` is commented out with
`# todo: re-enable once all fixes to OpenApi schemas will be made` — on **`master`**.
[#14515](https://github.com/blockscout/blockscout/pull/14515) already re-enabled it on `dev`, but GitHub
runs a `release` event against the *default* branch's workflow file, so auto-publishing on release stays off
until `master` gets the same change. That is the backend team's call and does not block this task, whose
publish path is the manual `workflow_dispatch` one.

## Requirements

1. `npm ci` succeeds in `types-package/` on `dev`.
2. `publish-api-types-npm-dev.yml` completes from `dev` and publishes a `0.0.1-beta.<sha>` version.
3. This repo pins that **exact** version — never the `beta` dist-tag, which in-progress branches share
   (rationale in [src/api/CONTEXT.md](../../../../../src/api/CONTEXT.md)).
4. `pnpm run lint:tsc` passes with the new pin.

## Steps

- [x] 1 `[agent]` Open a PR against `blockscout/blockscout` **`dev`** regenerating
  `types-package/package-lock.json`. Merging is the backend team's call — Nikita reviews.
  → [blockscout#14639](https://github.com/blockscout/blockscout/pull/14639), lock-only (nested `js-yaml`
  `4.1.1` → `4.2.0`); the `release` trigger needed no change on `dev` (see *Context & goal*).
- [x] 2 `[agent]` Once merged, publish — skill: `publish-beta-types`
  → `@blockscout/api-types@0.0.1-beta.bb45bf1` from
  [run 30609760755](https://github.com/blockscout/blockscout/actions/runs/30609760755).
  - inputs:
    - API service: `core` → package `@blockscout/api-types`
    - Source repo: `blockscout/blockscout`
    - Workflow: `.github/workflows/publish-api-types-npm-dev.yml` (no dispatch inputs; derives
      `v0.0.1-beta.${GITHUB_SHA::7}` itself)
    - Branch to publish from: **`dev`**
    - Note: the skill says never to publish from the default branch. `dev` is not the default branch
      (`master` is), and it is where the previous pinned beta came from, so this is the normal path here.
- [x] 3 `[agent]` Pin the exact published version in `package.json`, run `pnpm install`, then
  `pnpm run lint:tsc`. → `package.json` + `pnpm-lock.yaml`.
- [x] 4 `[agent]` If the typecheck surfaces breakage unrelated to the countdown endpoint, stop and report it
  rather than fixing it inside this task. `dev` carries roughly four weeks of schema changes beyond the
  previously pinned 2026-07-02 beta, so unrelated churn was plausible and would have needed its own scope.
  → none surfaced; `lint:tsc`, `lint:eslint` and `lint:cspell` are all clean on the new pin.
- [x] 5 `[agent]` Re-publish and re-pin once — the published `0.0.1-beta.50eadc8` was later dropped in favour
  of `main`'s `0.0.1-beta.8e1692a`, which carries the same countdown contract (see the parent spec's
  *Types package*).
  [blockscout#14646](https://github.com/blockscout/blockscout/pull/14646) is on `dev`. The
  `0.0.1-beta.bb45bf1` pin predates it and still types the three block numbers as `number`, so subtask 2
  cannot be written against it. Repeat steps 2–4; `dev` is still the only ref exporting `paths`, so the
  `v11.2.4` tag is not an option. Expect more unrelated churn than last time — `dev` now carries v12.0.0-era
  changes that no release includes, and step 4's stop-and-report rule applies to them.
  → `0.0.1-beta.50eadc8` from
  [run 31010579751](https://github.com/blockscout/blockscout/actions/runs/31010579751); all four countdown
  fields string-typed, and the v12-era churn broke nothing (`lint:tsc`, `lint:eslint`, `lint:cspell` clean).

## Out of scope

- Publishing a **stable** version (`11.2.3` on the `latest` dist-tag). It was attempted and cancelled during
  the grilling session: built from the `v11.2.3` tag it has no `paths` export, so it would be unusable here
  while permanently occupying `latest`. Whether to cut a stable release is the backend team's call once the
  `release` trigger is live again.
- Anything in the countdown migration itself — that is subtask 2.

# Unblock `@blockscout/api-types` publishing and pin a beta from `dev`

| | |
| --- | --- |
| Parent spec | [../../spec.md](../../spec.md) — step 1 of #3583 |
| Status | `ready` |
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

  `@redocly/openapi-core` declares `js-yaml: "4.2.0"` while `node_modules/@redocly/openapi-core/node_modules/js-yaml`
  still resolves `4.1.1`. Dependabot's fix ([#14623](https://github.com/blockscout/blockscout/pull/14623))
  landed on `master`, so `dev`'s lock was never regenerated. Verified by a real dispatch:
  [run 30566146869](https://github.com/blockscout/blockscout/actions/runs/30566146869).

Stable publishing is also switched off on purpose — the `release: [published]` trigger in
`.github/workflows/publish-api-types-npm.yml` is commented out with
`# todo: re-enable once all fixes to OpenApi schemas will be made`. Re-enabling it rides along with the lock
fix, since both are one-line changes to the same package's release path.

## Requirements

1. `npm ci` succeeds in `types-package/` on `dev`.
2. `publish-api-types-npm-dev.yml` completes from `dev` and publishes a `0.0.1-beta.<sha>` version.
3. This repo pins that **exact** version — never the `beta` dist-tag, which in-progress branches share
   (rationale in [src/api/CONTEXT.md](../../../../../src/api/CONTEXT.md)).
4. `pnpm run lint:tsc` passes with the new pin.

## Steps

- [ ] 1 `[agent]` Open a PR against `blockscout/blockscout` **`dev`** with two changes: regenerate
  `types-package/package-lock.json` (`npm install` in that directory), and uncomment the
  `release: [published]` trigger in `.github/workflows/publish-api-types-npm.yml`. Merging is the backend
  team's call — Nikita reviews.
- [ ] 2 `[agent]` Once merged, publish — skill: `publish-beta-types`
  - inputs:
    - API service: `core` → package `@blockscout/api-types`
    - Source repo: `blockscout/blockscout`
    - Workflow: `.github/workflows/publish-api-types-npm-dev.yml` (no dispatch inputs; derives
      `v0.0.1-beta.${GITHUB_SHA::7}` itself)
    - Branch to publish from: **`dev`**
    - Note: the skill says never to publish from the default branch. `dev` is not the default branch
      (`master` is), and it is where the previous pinned beta came from, so this is the normal path here.
- [ ] 3 `[agent]` Pin the exact published version in `package.json`, run `pnpm install`, then
  `pnpm run lint:tsc`.
- [ ] 4 `[agent]` If the typecheck surfaces breakage unrelated to the countdown endpoint, stop and report it
  rather than fixing it inside this task. `dev` carries roughly four weeks of schema changes beyond the
  currently pinned 2026-07-02 beta, so unrelated churn is plausible and would need its own scope.

## Out of scope

- Publishing a **stable** version (`11.2.3` on the `latest` dist-tag). It was attempted and cancelled during
  the grilling session: built from the `v11.2.3` tag it has no `paths` export, so it would be unusable here
  while permanently occupying `latest`. Whether to cut a stable release is the backend team's call once the
  `release` trigger is live again.
- Anything in the countdown migration itself — that is subtask 2.

# 06 — Refresh the lockfile within the declared ranges

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 06 of #3907 |
| Blocked by | T04 |

## What to build

The first refresh, done by hand on this branch: the lockfile is re-resolved within the ranges the
manifests already declare, which clears every alert whose patched version those ranges allow. No manifest
range, override or patch changes here.

The refresh is also the first pull request change that touches the lockfile, so it gives the dependency
checks their first real run: full unit suite, production build and smoke run against `staging`.

## Acceptance criteria

How to verify: push the branch, open the dependency checks run on the pull request; then
`pnpm prod:preset staging` and connect a real wallet

- [ ] `pnpm-lock.yaml` is re-resolved; no `package.json` range and no `overrides` entry changed.
- [ ] `minimumReleaseAge` was respected: no exemption was added for the refresh.
- [ ] `pnpm install --frozen-lockfile` succeeds and the `@lifi/widget-light` patch still applies.
- [ ] `pnpm lint:tsc`, `pnpm test:vitest`, `pnpm lint:license:check` and `pnpm test:smoke` pass locally.
- [ ] `notes.md` lists the high and critical runtime advisories `pnpm audit` still reports after the
      refresh, each with the parent that holds the vulnerable version. It is the input of ticket 07.
- [ ] `(human)` The dependency checks ran on the pull request and are green, and the smoke job reached
      `staging` from a GitHub runner. If it cannot, the preset is switched to `eth_sepolia`.
- [ ] `(human)` A real wallet connects on the refreshed build.
- [ ] `(human)` The regular checks, the component visual tests included, are green on the refreshed
      lockfile, or each visual diff is explained by a bumped package.

## Details

**Transitive wallet packages move here.** The direct wallet dependencies are exact pins and stay, but
what floats beneath them is re-resolved. That is what the smoke wallet probe and the real-wallet check are
for.

**A failing check is fixed in this ticket** when the fix is holding one package back; say which and why in
`notes.md`. Anything that needs a manifest change or an override belongs to ticket 07.

## Leaf worklist

- [x] 1 `[agent]` Re-resolve the lockfile within the declared ranges and run the local checks
- [x] 2 `[agent]` Record the remaining high and critical runtime advisories in `notes.md`
- [x] 3 `[human]` Push, confirm the first dependency checks run and the regular checks, and connect a real wallet

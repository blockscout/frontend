---
name: publish-beta-types
description: Publish a beta version of a `@blockscout/*-types` npm package and pin it here. Use when a needed response type isn't in any published package version yet.
---

# Publish a beta types package

The `@blockscout/*-types` packages are generated from each API's OpenAPI spec or Protobuf **in the API's
own source repo** and published to npm; this repo only pins versions in `package.json`.
Stable versions are published automatically on API releases — so when work here depends on a
**not-yet-released** API (e.g. one deployed only to staging), its types must be published as
a **beta** first, manually, and pinned by exact version.

**Background reading:** *Where a resource's response types come from* in `src/api/CONTEXT.md`
(provenance, stable vs. beta channels, why `@beta` must never be used).

**Rule of thumb: never guess.** Whenever information is missing or required to proceed,
**pause and ask the user, or confirm your findings**, before acting.

## Step 0 — Interview + prerequisites

1. **Which API service** the types are for — maps to a package/repo/workflow in the table
   below.
2. **Which branch of the API source repo to publish from** — the beta is built from that
   branch's HEAD, so this identifies the API version you'll get. It must come from the user
   or the task (typically the API feature branch deployed to staging); **never assume** a
   branch, and never publish from the default branch (that's what stable releases are for).
3. **`gh` access** — invoke the `check-github-cli` skill: authenticated, `workflow` token
   scope, access to the (possibly private) API repo.

## Step 1 — Find the workflow

| API service | npm package | Source repo | Publish workflow | Dispatch inputs (`-f …`) |
|---|---|---|---|---|
| `core` | `@blockscout/api-types` | `blockscout/blockscout` | publish-api-types-npm-dev.yml | - |
| `stats`| `@blockscout/stats-types` | `blockscout/blockscout-rs` | npm-publisher-dev.yml | service: stats |
| `bens` | `@blockscout/bens-types` | `blockscout/blockscout-rs` | npm-publisher-dev.yml | service: blockscout-ens |
| `multichainAggregator` | `@blockscout/multichain-aggregator-types` | `blockscout/blockscout-rs` | npm-publisher-dev.yml | service: multichain-aggregator |
| `multichainStats` | `@blockscout/stats-types` | `blockscout/blockscout-rs` | npm-publisher-dev.yml | service: stats |
| `interchainIndexer` | `@blockscout/interchain-indexer-types` | `blockscout/blockscout-rs` | npm-publisher-dev.yml | service: interchain-indexer |
| `tac` | `@blockscout/tac-operation-lifecycle-types` | `blockscout/blockscout-rs` | npm-publisher-dev.yml | service: tac-operation-lifecycle |
| `visualize` | `@blockscout/visualizer-types` | `blockscout/blockscout-rs` | npm-publisher-dev.yml | service: visualizer |
| `contractInfo` | `@blockscout/contracts-info-types` | `blockscout/blockscout-admin` | publish-types-dev.yml | service: contracts-info |
| `admin` | `@blockscout/admin-rs-types` | `blockscout/blockscout-admin` | publish-types-dev.yml | service: admin-rs |
| `rewards` | `@blockscout/points-types` | `blockscout/points` | npm-publisher-dev.yml | - |
| `zetachain` | `@blockscout/zetachain-cctx-types` | `blockscout/blockscout-rs` | manual / ad-hoc — not merged upstream, maintenance only | - |

If a cell is unknown or stale, discover it with `gh workflow list --repo <repo>` and
`gh workflow view <workflow> --repo <repo>` (shows the dispatch inputs); the authoritative
package→repo pointer is the `repository` field in
`node_modules/@blockscout/<pkg>/package.json`.

## Step 2 — Trigger the publish

```
gh workflow run <workflow> --repo <repo> --ref <branch> [-f <input>=<value>]
```

## Step 3 — Watch the run, copy the exact version

`gh run list --repo <repo> --workflow <workflow>` to find the run id, then
`gh run watch <id> --repo <repo>` and `gh run view <id> --repo <repo> --log` to read the
published version out of the logs (or check the package's versions on npm).

**Copy the exact published version string — don't construct it** (the `0.0.1-beta.<hash>`
template varies per workflow), and **never pin `@beta`** (in-progress API branches collide
on that dist-tag) — full rationale in the background reading.

## Step 4 — Pin and verify

Set the exact version in `package.json`, reinstall (`pnpm install`), and run
`pnpm run lint:tsc` — the typecheck surfaces what the new API version changed.

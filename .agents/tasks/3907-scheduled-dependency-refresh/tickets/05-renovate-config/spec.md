# 05 — Renovate config

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 05 of #3907 |
| Blocked by | Q01 |

## What to build

The config the hosted Renovate app reads once this branch is on `main`. Every Monday it opens a lockfile
maintenance pull request and one grouped pull request with the non-major updates of direct dependencies.
A major update appears only when someone asks for it. Every update of a direct wallet stack dependency
comes in its own pull request. Nothing merges by itself, and each pull request passes the template and
category check as opened.

If Q01 ends in a refusal, this ticket is rewritten to the scheduled-workflow fallback the spec names
before it starts.

## Acceptance criteria

- [ ] Lockfile maintenance is on, scheduled for Mondays.
- [ ] Non-major updates of direct dependencies are grouped into one weekly pull request.
- [ ] Major updates need an explicit request and are not opened otherwise.
- [ ] `wagmi`, `viem`, `@wagmi/*`, `@reown/*`, `@walletconnect/*` and `@lifi/widget-light` are excluded
      from the grouped pull request and get one pull request per update, patches and minors included.
- [ ] Automerge is off for every rule.
- [ ] Pull requests for vulnerability alerts outside the schedule are off.
- [ ] The minimum release age matches `minimumReleaseAge` in `pnpm-workspace.yaml` and covers every
      scheduled pull request; the packages in `minimumReleaseAgeExclude` stay exempt.
- [ ] Every pull request carries the `dependencies` label and no other category label.
- [ ] The pull request body holds every heading of `docs/PULL_REQUEST_TEMPLATE.md` and none of its
      placeholder lines. A unit test feeds a body in that shape to `checkPr` and expects no failures.
- [ ] The `frontend-home` pin is not touched by Renovate.
- [ ] `renovate-config-validator` accepts the config.

## Details

**Verify against the Renovate docs, not from memory:** the option names for approval-gated majors, for
turning off vulnerability pull requests, for the body template, and how Renovate's own release-age
setting interacts with pnpm's `minimumReleaseAge` during lockfile maintenance. FR15 needs both the direct
updates and the lockfile refresh to respect the age.

**Pull request check.** `tools/release/check-pr.ts` gets no exemption for a bot author. It wants each
template heading as a line of the body, no placeholder text, and exactly one category; `dependencies`
cannot share a pull request with another category label (`tools/release/categories.ts`).

**`frontend-home`.** The pin moves only through `pnpm home:bump`, which also rewrites the `allowBuilds`
key (`tools/home/CONTEXT.md`). Renovate must leave it alone.

**Why patches of the wallet group are separate.** `patches/@lifi__widget-light@4.3.2.patch` and the
`peerDependencyRules` in `pnpm-workspace.yaml` are written against exact `wagmi` and `viem` versions.

**What cannot be checked here.** Renovate acts only on `main`. The first Monday after the merge is the
real test; `docs/DEPENDENCIES.md` (ticket 09) tells the reviewer what a correct set of pull requests
looks like.

## Leaf worklist

- [ ] 1 `[agent]` Add the Renovate config with the schedule, grouping, wallet and major rules
- [ ] 2 `[agent]` Add the label and the body template, and the `checkPr` unit test for the body shape
- [ ] 3 `[agent]` Validate the config with `renovate-config-validator`

# 09 — Triage routine and the wallet pull request checklist

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 09 of #3907 |
| Blocked by | T05, T08 |

## What to build

`docs/DEPENDENCIES.md`: the routine a developer follows each week when the refresh pull requests arrive,
and the manual checklist for a wallet stack pull request. It is linked from `docs/CONTRIBUTING.md`.

## Acceptance criteria

- [ ] The doc says alerts are reviewed weekly, together with the refresh pull request.
- [ ] It says when to bump the parent, when to add a ranged override, and when to dismiss an alert with a
      reason.
- [ ] It says overrides are reviewed for removal on each refresh.
- [ ] It says a fix younger than the minimum release age waits, except a critical one, which gets a
      temporary exemption, and how that exemption is added and removed.
- [ ] It says what to do when the audit fails on a dependency pull request: fix it in the same pull
      request, or ignore the advisory with a reason.
- [ ] It says how a major update is requested.
- [ ] It holds the wallet stack checklist: connecting a real wallet.
- [ ] `docs/CONTRIBUTING.md` links to it.
- [ ] `pnpm lint:doc-links` and `pnpm lint:cspell` pass.

## Details

**Follow `.agents/rules/docs.md`.** The doc is procedure and policy. It points at the Renovate config, the
dependency checks workflow, the overrides and the audit ignore list by file, and does not restate what
they contain: package lists, schedules and flags have their home in those files.

**Written last** so that it describes the mechanisms as they landed in tickets 05 and 08.

## Leaf worklist

- [ ] 1 `[agent]` Write `docs/DEPENDENCIES.md` and link it from `docs/CONTRIBUTING.md`

# 03 — Smoke set: wallet probe and analytics

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 03 of #3907 |
| Blocked by | T02 |

## What to build

The half of the smoke set that exercises the packages a dependency bump is most likely to break. The
wallet modal opens and lists wallets. A fake wallet provider, injected into the page before the app
loads, shows up as an installed wallet, and connecting through it ends with the connected address in the
header. The analytics initialization request leaves the page.

## Acceptance criteria

How to verify: `pnpm test:smoke`, with outbound internet

- [ ] A test opens the wallet modal and sees a list of wallets.
- [ ] A test injects the fake provider, picks it in the modal, and sees its address in the header.
- [ ] The fake provider is injected before any app script runs, and no browser extension is loaded.
- [ ] A test sees the analytics initialization request being sent.
- [ ] The tests use the fixture from ticket 02, so its failure rules apply to them.
- [ ] Third-party exceptions these flows raise, if any, are added to the allowlist with their source.
- [ ] `pnpm lint:eslint`, `pnpm lint:tsc` and `pnpm lint:cspell` pass.

## Details

**How the app discovers a wallet.** Read `src/features/connect-wallet/CONTEXT.md` first: the wallet stack
loads lazily, and `src/features/connect-wallet/utils/install-eip6963-announce-guard.ts` sits between a
wallet's announcement and the app. The fake provider has to be discovered the way a real extension is,
through an EIP-6963 announcement, or the probe tests a path no user takes.

**The fake provider** answers the handful of requests the connect flow makes: accounts, chain id, and
whatever the flow asks next on the `staging` chain. It is test code in `tools/smoke/`, added with
`page.addInitScript`. Nothing under `src/` changes for it.

**Analytics.** Which provider is on is the instance's config; the two candidates are
`src/services/posthog/` and `src/services/mixpanel/`. Assert the initialization request of whichever the
`staging` config enables, by observing the outgoing request. Do not block or mock it.

## Leaf worklist

- [x] 1 `[agent]` Add the fake wallet provider and its injection helper
- [x] 2 `[agent]` Add the wallet modal and connection tests
- [x] 3 `[agent]` Add the analytics initialization test

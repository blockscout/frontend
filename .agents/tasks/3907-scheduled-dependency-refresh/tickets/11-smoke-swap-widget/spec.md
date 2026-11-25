# 11 — Smoke set: the swap widget

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 11 of #3907 |
| Blocked by | none |

## What to build

A smoke test opens the swap essential dapp on `staging` with the fake wallet injected, connects it through
the LI.FI widget's own connect button, and sees the widget name that wallet. The test covers both
directions of the bridge between the app and the LI.FI frame: the widget's connect request opens the app's
wallet modal, and the connected account reaches the widget through the patched handler of
`@lifi/widget-light`. A bump of `@lifi/widget-light`, or of the wagmi and viem versions its patch is
written against, then reaches a browser in the dependency checks.

## Acceptance criteria

- [ ] A new `tools/smoke/swap.smoke.ts` passes in `pnpm test:smoke` against `staging`, together with the
      rest of the set.
- [ ] The test fails with a message, not a skip, when the instance's config does not turn swap on, as the
      analytics test does for its provider.
- [ ] Before it opens the page, the test sets the `adblock_detected` cookie to `true`, with the cookie name
      taken from `src/shared/storage/cookies`. No other smoke test changes.
- [ ] It injects the fake wallet of ticket 03, opens `/essential-dapps/swap` and waits for the widget's
      frame to be visible.
- [ ] It connects by clicking the widget's connect button inside the frame and picking the fake wallet in
      the app's wallet modal.
- [ ] Inside the frame, the connect button is gone, and the widget's connected wallets view lists the fake
      wallet by name and by its address as the widget shortens it, built from `FAKE_WALLET.address`.
- [ ] The test stops there: it enters no amount and asks for no quote or transaction.
- [ ] Inside the frame, elements are found by role and accessible name, not by LI.FI's markup.
- [ ] The fixture's failure rules apply to the test unchanged.
- [ ] Nothing under `src/` changes, except an accessibility marker the test cannot do without. No test ids.
- [ ] `pnpm lint:eslint`, `pnpm lint:tsc` and `pnpm lint:cspell` pass.

## Details

Read [`notes.md`](notes.md) first: it holds the probe this ticket was scoped from, with the labels the
frame shows, the timings and the errors seen.

**Why the widget's button, not the header.** A connection from the header is followed by the sign-in. Its
dialog stays open over the frame and blocks clicks into it, and the invisible reCAPTCHA behind it raises
errors the allowlist does not match. The widget's button opens the wallet modal directly, with no sign-in.

**Connect on the swap page.** The fake wallet forgets its connection on every page load, so a connection
made on another page does not survive the navigation.

**The frame is LI.FI's hosted page.** It is deployed apart from the package version, so its labels can
change without a bump of ours. Role and name locators keep that surface small.

**Expected to need no change.** The probe found no wallet method the fake wallet lacks, no error that
trips the failure rules and no wait beyond the config's timeouts. A run that shows otherwise is a finding to
raise, not something to patch around with an allowlist entry or a longer timeout.

**Ads off.** `staging` renders an ad banner under the widget. With the cookie set before the first request,
`AdBanner` renders nothing and `useAdblockDetect` does not probe, so every ad slot on the page stays empty.
The other tests keep their ads.

**Fallback preset.** `eth_sepolia` does not turn swap on. If the smoke preset ever switches to it, this
test fails on its config check, by design.

**A LI.FI outage** fails the test like any other failure. The dependency checks are not required for merging,
and retries absorb a blip.

**`docs/DEPENDENCIES.md` stays as it is.** Its manual check of a wallet stack pull request opens the swap
widget with a real wallet, which the smoke set does not.

## Leaf worklist

- [x] 1 `[agent]` Add the swap widget smoke test

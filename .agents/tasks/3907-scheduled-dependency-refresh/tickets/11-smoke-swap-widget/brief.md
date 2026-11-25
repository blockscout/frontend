# 11 — Smoke set: the swap widget

## Goal

A smoke test opens the swap essential dapp with the injected test wallet connected and sees the LI.FI
widget take that wallet (FR7). Nothing in the smoke set opens the swap page today, so a bump of
`@lifi/widget-light`, or of the wagmi and viem versions its patch is written against, reaches no browser
before a person tries it.

## Known context

- The `staging` instance enables swap (`NEXT_PUBLIC_MARKETPLACE_ESSENTIAL_DAPPS_CONFIG`, on chains 1, 10,
  100 and 11155111), so the page is `/essential-dapps/swap` there.
- The widget is LI.FI's page in a cross-origin frame (`SwapWidgetIframe.tsx` under
  `src/features/marketplace/pages/essential-dapp/swap/`). The app shows it once the widget reports it has
  rendered, and shows "Unable to load the swap widget" after a timeout.
- The wallet bridge between the app and the frame is the patched handler of
  `patches/@lifi__widget-light@4.3.2.patch`. Its wiring against wagmi and viem is unit-tested in
  `useSwapWallet.spec.tsx`; what no test covers is the widget loading and receiving the wallet in a browser.
- The fake wallet and the failure rules are ticket 03's (`tools/smoke/fake_wallet.ts`,
  `tools/smoke/fixture.ts`).

## Blocking unknowns

All for the `to-tickets` run that scopes this ticket, from the code and one local smoke run:

- What inside the LI.FI frame proves the wallet reached it, and whether the test can read it there.
- Whether the frame loads reliably enough for CI with the smoke set's retries, since it is served from
  LI.FI's origin.
- Which errors the frame raises in a passing run, and whether any of them reach the failure rules and so
  belong in the allowlist.

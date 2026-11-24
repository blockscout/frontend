# 06 — Notes

## How the lockfile was re-resolved

`pnpm-lock.yaml` was deleted and rebuilt with `pnpm install --lockfile-only`, the full re-resolve that
Renovate's lockfile maintenance runs. With `node_modules` installed, pnpm rebuilds the deleted lockfile from
`node_modules/.pnpm/lock.yaml` and nothing moves, so that file was deleted as well.

`package.json`, `pnpm-workspace.yaml` and the `@lifi/widget-light` patch are unchanged, and so are the
lockfile's `overrides` and `patchedDependencies` sections. The patch applies on `pnpm install
--frozen-lockfile`.

## Minimum release age

No exemption was added. pnpm 12 resolves with `minimumReleaseAgeStrict`, which stops to write an exemption
to `minimumReleaseAgeExclude` when only a too-young version fits; the refresh asked for none. Of the 693
package versions new to the lockfile, the youngest was published on 2026-11-17 at 12:24 UTC, 7.0 days before
the refresh.

## Held back

Both holds are undone by the next lockfile maintenance, which re-resolves from scratch: until ticket 07
lands its manifest change, that pull request fails the same checks.

- **`d3` at 7.9.0**, where the refresh resolved 7.9.2. From 7.9.1, `d3` asks for `d3-selection` `^3.0.1`
  and `d3-transition` `^3.0.2`, while the root `package.json` pins `d3-selection` `3.0.0` and
  `d3-transition` `3.0.1` exactly. The refresh then installs two copies of each, and on the production
  build the home page throws `TypeError: ….transition is not a function` from a chart and shows the error
  page. `pnpm test:smoke` failed its home page and analytics tests on it. Held with `pnpm update -r
  d3@7.9.0 --lockfile-only`, which leaves one copy of each. The lasting fix moves the two exact pins, a
  manifest change for ticket 07.
- **`ws` at 8.21.0**, where the refresh resolved 8.23.0. The root `package.json` pins `ws` at exactly
  `8.21.0`, but the security override `ws: "^8.21.0"` turns that pin into a range, so a refresh moves the
  root's `ws` past it. `license-report` then finds no installed `ws` that satisfies `8.21.0`, reports its
  license as `n/a`, and `pnpm lint:license:check` fails on it. Held with `pnpm update ws@8.21.0
  --lockfile-only`, which leaves `package.json` as it is. 8.21.0 is the override's floor and has no
  advisory. The lasting fix changes the root's `ws` range or the override, so it belongs to ticket 07.

## Wallet stack packages that moved

The direct wallet dependencies are exact pins and did not move. Beneath them: `@coinbase/cdp-sdk` 1.50.0 →
1.62.0, the nested `viem` 2.51.2 → 2.58.0, `ox` 0.14.25 → 0.14.67, `@metamask/utils` 11.11.0 → 11.12.1.

## Real wallet check

OKX connects without an error. MetaMask connects too, but in the login flow its popup throws `TypeError:
Cannot read properties of undefined (reading 'origin')` right after the network switch is confirmed. Reopening
the extension clears it. Connecting from a contract's read/write tab asks for no switch and shows no error.

This is not the refresh. The login flow sends `wallet_switchEthereumChain` twice: once from the connect, and
again 12–29 ms after that switch resolves, from `useSignInWithWallet` before it asks for the signature. A
recording of the app's wallet calls, with a test wallet that poses as MetaMask, shows the same calls in the same
order with the same timing on the pre-refresh build (`095de5a90`) and on the refreshed one. The second switch
reaches MetaMask just as its switch prompt closes, which is where the popup fails.

## Runtime advisories left after the refresh

`pnpm audit --prod --audit-level high`: high 28 → 3 advisories, critical 0. For the record, moderate went
48 → 22 and low 4 → 0.

<!-- cspell:ignore cxfr mrhx fpjm -->

| Advisory | Vulnerable version | Patched | Parent that holds it | Reached from | Upstream |
| --- | --- | --- | --- | --- | --- |
| GHSA-45rx-2jwx-cxfr (high) | `@opentelemetry/propagator-jaeger` 2.7.1 | `>=2.12.1` | `@opentelemetry/sdk-node` 0.218.0 and 0.217.0 pin `2.7.1` | `@opentelemetry/sdk-node` (exact `0.218.0`); `@opentelemetry/auto-instrumentations-node` 0.75.0 asks for `^0.217.0` | `@opentelemetry/sdk-node` 0.301.2 no longer depends on it |
| GHSA-mrhx-c7xc-m3w5 (high) | `zod` 3.22.4 | `>=4.6.6` | `@reown/appkit-wallet` 1.7.20 and 1.7.8 pin `3.22.4` | `wagmi`, `@nouns/sdk` | `@reown/appkit-wallet` 2.0.0, the latest, still pins `3.22.4` |
| GHSA-mrhx-c7xc-m3w5 (high) | `zod` 3.25.76 | `>=4.6.6` | `@coinbase/cdp-sdk` 1.62.0 asks for `^3.25.76`; the `abitype` 1.0.6 it pins takes that `zod` as its peer | `wagmi`, `@nouns/sdk`, `@reown/appkit-adapter-wagmi`, `@lifi/widget-light`, `@multisender.app/multisender-react-widget` | 1.62.0 is the latest `@coinbase/cdp-sdk` |
| GHSA-qr28-fpjm-wq7f (high) | `decode-uri-component` 0.2.2 | `>=0.5.1` | `query-string` 7.1.3 asks for `^0.2.2`; `@walletconnect/utils` 2.21.0, 2.21.1 and 2.21.7 pin `query-string` 7.1.3 | `wagmi`, `@nouns/sdk`, `@multisender.app/multisender-react-widget` | `@walletconnect/utils` 2.26.0 no longer depends on `query-string` |

No 3.x release of `zod` is patched, so both `zod` rows are fixed only by a major of `zod`. Every row except
the first sits under the wallet stack.

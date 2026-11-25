# 11 — Notes

<!-- cspell:ignore adform bframe gstatic sevio -->

## The probe

A throwaway Playwright file run through the smoke fixture against the production build of the `staging`
preset, with retries off. It logged every request the fake wallet got, the `widget-light` messages between
the app and the frame, and every page error, failed request and console error.

## The frame

- The frame is `iframe[title="LI.FI Widget"]`, on `https://widget.li.fi`. Playwright reads, clicks and
  snapshots inside it.
- Before the connection, its buttons include "Connect wallet" and "Send to a different wallet".
- After the connection, "Connect wallet" is gone, and "25%", "50%", "75%", "MAX" and the "Exchange" button
  appear. The main view shows no address.
- The address is one view deeper. "Send to a different wallet", then the button whose name starts with
  "Connected wallets", shows a button named `Smoke Wallet Smoke Wallet 0x402D7...381A1`. The widget shortens
  an address to its first 7 and last 5 characters.
- The frame never talks to the injected wallet. It sends no EIP-6963 request and makes no call to the fake
  wallet. Its wallet state comes only through the app's bridge.
- Signals seen outside the frame's markup, and not used:
  - On load, the app sends `INIT` with no accounts. After the connection it sends the `accountsChanged`,
    `chainChanged` and `connect` events. This shows the app sent the wallet, not that the widget took it.
  - The frame's own RPC requests, `eth_getBalance` and `eth_getCode` for the address, to the chain's
    public RPC. Which endpoint and batching depend on LI.FI.
  - `CONNECT_WALLET_REQUEST` from the frame on the connect click.
  - The frame sent no `RPC_REQUEST` during load, the connection or an amount entry.

## The connection paths

- **The widget's button.** It opens `w3m-modal` directly, with no sign-in dialog. The fake wallet gets
  `wallet_requestPermissions`, `eth_accounts` and `eth_chainId` and nothing else: no unsupported method, no
  chain switch.
- **The header.** The connection works and the frame updates. The sign-in that follows adds a
  `wallet_switchEthereumChain` to `staging`'s chain, which the fake wallet accepts, and a `personal_sign`,
  which it rejects by design. The widget is not disturbed. The sign-in dialog stays open, reset to its first
  screen, and its backdrop blocks clicks into the frame: 10 of 10 runs timed out. Escape closes it.
- **A connection made on `/`** does not survive `page.goto` to the swap page. On the new page the fake
  wallet answers `eth_accounts` with no account, the header shows "Log in" and the frame shows
  "Connect wallet".

## Reliability

- The widget path passed 31 of 31 runs, retries off, 4 workers.
  - From navigation to a visible frame: 2.1 to 4.9 s, median about 3.5 s.
  - From picking the wallet to the frame's connected controls: 0.2 to 0.4 s. To the address on the
    connected wallets view: 0.3 to 1.1 s.
  - "Unable to load the swap widget" never appeared.
- The whole set, fully parallel and repeated: the first wave passed, the swap test included. Later waves
  failed in every file on `staging`'s rate limit: 429 from the API and the app's "Too many requests" page.
  The probe's own run volume caused it.

## Errors in a passing run

- On the widget path, no page error, and nothing trips the failure rules.
  - Seen without effect: `HEAD` requests to the app's swap route aborted (`ERR_ABORTED`, which the rule
    skips), aborted ad requests and an adform 403.
  - Console noise without effect: a WebSocket redirect, the Coinbase SDK's COOP warning, ad CSP violations.
  - Nothing came from the LI.FI frame.
- `pageerror` reports uncaught exceptions and rejections thrown inside the LI.FI frame, not only the app's
  page. The fixture already covers the frame.

## Ads and config

- `staging` is on chain 11155111, one of the swap chains, so the widget opens on it and asks for no switch.
- `staging` renders a Sevio banner under the widget. It is on by default for the essential dapps. Its noise
  never tripped the failure rules.
- `eth_sepolia` turns the marketplace on but has no essential dapps config, so it has no swap page.

## A risk for `wallet.smoke.ts`: reCAPTCHA errors after the header sign-in

The invisible reCAPTCHA of the sign-in dialog (`AuthModalScreenConnectWallet`) raises 2 uncaught errors that
the allowlist's reCAPTCHA entry does not match:

- About 1 to 2 s after the sign-in starts, in the `google.com/recaptcha/api2/bframe` frame, from
  `gstatic.com/recaptcha/…/recaptcha__en.js`: `SecurityError: Failed to read a named property … from
  'Window': Blocked a frame with origin "https://www.google.com" from accessing a frame with origin
  "http://localhost:3200" … Protocols must match.`
- About 15 to 19 s after the sign-in starts, from the same script: `Error: reCAPTCHA Timeout (g)`.

They tripped the fixture in 7 of 20 header-path runs that stayed on the page after the connection.
`wallet.smoke.ts` passed 10 of 10 runs on its own: its connection test ends as soon as the header shows the
address, before either error fires. A slower run of that test can catch the first one.

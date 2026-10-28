# 02 — Custom RPC URL cookie: transport resolution and CSP

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 02 of #2480 |
| Blocked by | none |

## What to build

With a custom RPC URL stored in a cookie and marked as in use, every browser-side JSON-RPC request for the explorer's own chain
goes to that URL only — the wagmi transports (contract read / write / simulate, revoke, L2 claims) and the
standalone public client (degraded-mode home, tx, block, address fallbacks) — and the configured URLs plus the
core-API `eth-rpc` fallback are not used. The CSP middleware adds that URL to `connect-src` for that user's
requests only. Verifiable before any UI exists: set the cookie in devtools, reload, watch the network tab on a
contract read. FR10, FR11.

## Acceptance criteria

How to verify (agent, via Playwright MCP): `pnpm dev:preset eth`; in the browser set the custom RPC cookie to
a reachable public mainnet `https://` RPC with `browser_evaluate` (`document.cookie = ...`) **before** loading
the page (both clients are built at module load); navigate to a verified contract's Read tab, run a no-arg
read; `browser_network_requests` must show the `eth_call` POST going only to the custom host, and
`browser_console_messages` must show no CSP `connect-src` violation. Clear the cookie, reload, repeat: the
request goes to the configured RPC.

- [x] Two new cookie names in `cookies.NAMES`: the custom RPC URL and an "in use" flag (FR8: disconnecting
      keeps the URL, drops the flag); neither is in `PRIVATE_MODE_DISALLOWED`.
- [x] One helper (in `src/features/connect-wallet/utils/`) returns the effective RPC URL list for the current
      chain: `[ customUrl ]` when the URL cookie holds a valid `https:` URL **and** the flag is on, otherwise the configured
      `config.chain.rpcUrls` (plus the core-API `eth-rpc` fallback where `wagmi-config.ts` adds it today).
- [x] `wagmi-config.ts` (own chain only, not multichain / essential-dapp / parent chains) and
      `public-client.ts` build their transports from the helper; `isPublicClientAvailable` honours it; the
      chain object's `rpcUrls` stays as configured (wallet "add chain" unchanged).
- [x] `csp.get()` appends the cookie's URL origin to `connect-src` per request when the cookie parses as an
      `https:` URL and the flag is on; anything else is ignored. Cached policies stay cached — the per-request append must not
      regenerate the policy.
- [x] Unit tests: helper (cookie set / unset / invalid / flag off), CSP append (valid / invalid / absent cookie / flag off),
      public-client transport selection.
- [x] Browser check per "How to verify" passes: with the cookie set, a contract read hits only the custom URL
      and is not blocked by CSP; with it cleared, the configured RPC is used.

## Details

- The server validates the cookie value itself (`new URL(value).protocol === 'https:'`) — never trust it raw.
- Both clients are built at module load; a cookie change takes effect on the next page load (the setting's
  save path reloads, T03).
- Read `src/features/connect-wallet/CONTEXT.md` first: the helper must not pull `viem` / `wagmi` into any
  statically imported path (`public-client.ts` already keeps viem behind a dynamic import).

## Skill inputs

None — no project scaffold skill runs in this ticket.

## Leaf worklist

- [x] 1 `[agent]` Cookie names + RPC-URL resolution helper with unit tests
- [x] 2 `[agent]` Wire `wagmi-config.ts` and `public-client.ts` to the helper, with unit tests
- [x] 3 `[agent]` Per-request `connect-src` append in `src/server/csp/index.ts`, with unit tests

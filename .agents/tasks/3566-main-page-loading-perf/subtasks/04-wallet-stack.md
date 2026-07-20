# Step 4 — Defer the wallet stack (lever 3)

| | |
| --- | --- |
| Parent spec | [`../spec.md`](../spec.md) — step 4 of issue [#3566](https://github.com/blockscout/frontend/issues/3566) |
| Status | `in progress` |
| Sub-branch | `issue-3566-step-4` (off `issue-3566`) |
| PM / Designer / Backend | — (inherited from parent: technical/perf task) |
| Slack channel | — |

Read together with [`04-wallet-stack-research.md`](./04-wallet-stack-research.md) (2026-07-16): the
research doc holds the *map* — gating mechanics, the full consumer audit, constraints; this spec holds
the *decisions and the breakdown*. Where they differ, this spec wins.

## Context & goal

The wallet stack (AppKit + wagmi + viem, ~150 KB gz) holds first paint hostage on **every** page through
two mechanisms: the root `Web3Provider` (`next/dynamic`, `ssr: false`, no fallback) renders the whole
tree as `null` until its chunk evaluates, and the top-level-await hook hubs
(`connect-wallet/hooks/useWallet.ts` / `useAccount.ts`) make the header's module graph await the
wagmi/appkit chunks. A chunk-load failure today blanks the page. Additionally viem leaks statically into
always-loaded chunks (nav promo banner, homepage/tx/block/address RPC-fallback clients).

Goal: first paint independent of all wallet chunks, **zero behavior changes** — reconnect, connect UX,
analytics events, contract read/write, L2 claims, revoke, marketplace dapp bridge, rewards login all work
exactly as today. Architecture: **hybrid** —

- **Bridge** — a tiny always-mounted external store (`useSyncExternalStore`) providing account state to
  boot-time consumers; initialized *optimistically* from wagmi's persisted `localStorage` state
  (`wagmi.store`), confirmed/corrected by `watchAccount` once the runtime loads.
- **Runtime** — a lazy singleton module owning `wagmi-config` + `createAppKit` (reown mode only) +
  `wagmi/actions`; every wallet action is `await getWeb3Runtime()` — resolves instantly when loaded,
  joins or starts the import otherwise.
- **`Web3Boundary` islands** — feature-local `WagmiProvider` wrappers so the five route features keep
  their existing wagmi-hook code untouched.

Scope: `reown` and fallback (wallet-disabled) connector modes. `dynamic` mode (2 instances, Dynamic-labs
auth) keeps today's root-gating behavior behind an explicit branch — redesign is a recorded follow-up.

## Functional requirements

- First paint on every page must not wait for any wallet/viem chunk (verify via trace: FCP before the
  wallet chunk's evaluation; M6 drops by the wallet-stack size).
- A wallet-chunk load failure degrades to "wallet actions unavailable" (actions reject like a failed
  fetch, existing error toasts); the page renders and browses normally — never a blank page.
- Auto-reconnect for returning users still happens on every page without interaction (runtime loads
  eagerly when `wagmi.store` holds a connection); until confirmed, the header button shows the persisted
  address in the existing pending/reconnecting style — no "Connect" flash, no layout shift. If
  reconnection fails, the button flips to the disconnected state (same outcome as today's failed
  reconnect). The ENS/domain lookup (`useAccountWithDomain`) may start from the optimistic address.
- A wallet control clicked before the runtime is ready triggers the import, shows the existing loading
  state, and opens the modal on readiness (parent-spec requirement). No click is silently dropped.
- Analytics parity: `WALLET_CONNECT` Started/Connected events (including the reconnect-vs-new-connection
  distinction of `useAccountEffect`) and `userProfile.setOnce({'With Connected Wallet': true})` fire
  exactly as today, through the deferred Mixpanel queue from step 2.
- Contract **read** tab keeps working in fallback mode (wallet feature disabled) — reads go through the
  runtime's wagmi public client with the multichain-aware transports, loaded on idle/interaction.
- Marketplace dapp pages get the wallet at page load (iframe bridge, `useAutoConnectWallet`,
  `?action=connect`) via route-eager loading.
- SSR philosophy unchanged: nothing renders on the server. `PageNextJs` already gates page content; a
  root hydration-only gate (existing `useIsMounted` pattern — one effect tick, no chunk wait) replaces
  `Web3Provider`'s `ssr: false` for the layout shell.
- `dynamic` connector mode behaves byte-for-byte as today (root `DynamicProvider`, render gating).
- No duplicate API/RPC requests introduced by the migration; socket behavior unchanged.

## Data & API

No API resources involved. **No new env vars** (decided: no kill switch — rollback is a revert; the
sliced landing keeps each change revertable). Existing config drives all branching:
`config.features.connectWallet` (`connectorType: 'reown' | 'dynamic'`, or disabled → fallback).

Implementation facts (verified against installed packages, see research doc):

- `wagmi.store` persists `{ state: { connections: Map-serialized, current, chainId }, version }`;
  optimistic read = parse, version-guard, `current` → connection → `accounts[0]`. Email/social login is
  disabled in this app's `createAppKit` config, so `wagmi.store` is the single optimistic source.
  **Verified (2026-07-20, @wagmi/core 2.22.1):** localStorage key `wagmi.store`; value is
  `{ state: { connections: { __type: 'Map', value: [ [uid, { accounts: [Address, …], chainId, connector }] … ] },
  chainId, current }, version: 2 }` (store `version` = the `@wagmi/core` major). The Bridge parses this by
  hand with `JSON.parse` (no wagmi import — stays off the critical path): version-guard `=== 2`, then
  `current` → matching connection → `accounts[0]`.
- `createConfig({ ssr: true })` sets `skipHydration` — the Runtime must explicitly hydrate the persisted
  state and trigger reconnect (what wagmi's React `<Hydrate>` does today). **Verified:** `<Hydrate>` calls
  `hydrate(config, { reconnectOnMount: true }).onMount()` (rehydrate persisted state → `reconnect`).
  `hydrate` lives only in `@wagmi/core` (not `wagmi`/`wagmi/actions`), so `@wagmi/core` is added as a
  direct dep pinned to `2.22.1` (wagmi 2.19.5's exact transitive pin → dedupes to one instance).
- `wagmi/actions` (= `@wagmi/core/actions`) ships every needed action; the AppKit instance returned by
  `createAppKit` exposes `open()`, `subscribeState()`, `setThemeMode()` — no React provider required for
  modal or theme. **Verified:** `createAppKit` (from `@reown/appkit/react`) returns an `AppKitBaseClient`
  with `open(options)`, `subscribeState(cb) → unsubscribe`, `setThemeMode(mode)`; wagmi's own
  `useAccountEffect` derives `isReconnected` as `prevData.status === 'reconnecting' || prevData.status ===
  undefined` (replicated in the Bridge for `WALLET_CONNECT` parity).

## UI inventory

No new UI. Reused states only: the header wallet button's existing pending/reconnecting treatment for
the optimistic phase and the existing loading state for connect-before-ready; island fallbacks reuse
each feature's existing loading/skeleton states. No Figma involvement; no `[human]` style steps.

## Out of scope

- Redesigning the `dynamic` connector mode (side-tree harvesting design) — follow-up; this step only
  branches around it.
- `get-checked-summed-address.ts` (viem `getAddress` in the address route chunk) — render-path util,
  bundle-weight only; candidate for the list-perf track.
- Enabling shell SSR (removing the hydration gate) — separate future experiment.
- Extending the primed fetch (lever 1) beyond the home page — tracked in parent spec, subtask 1.
- A lint rule forbidding direct `wagmi` imports outside runtime/islands — optional hardening, decide at
  review time.

## Task breakdown

- [x] 1 `[agent]` Quick static-leak fixes + measurement — done (2026-07-20); M6 −41 KB gz (see addendum).
  - inputs:
    - `NavigationPromoBanner.tsx`: lazy-import viem (`await import('viem')` inside the existing effect)
      for `keccak256`/`stringToBytes` — localStorage keys stay byte-identical, dismissals survive
      (decided against non-viem alternatives).
    - `connect-wallet/utils/public-client.ts`: stop constructing the viem client at module scope; expose
      a lazy async getter and update **all** consumers (home `rpc-data-context` + degraded widgets,
      `Transaction.tsx`/`TxDetailsRpc`, `useAddressQuery`/`useAddressCountersQuery`,
      `useBlockQuery`/`useBlockTxsQuery`, beacon `useBlockWithdrawalsQuery`) — all call sites are inside
      async query/watch functions already, so semantics don't change.
    - Measure M6 (median of 3) after this slice; record under Impact addendum below.
  - done (2026-07-20): `public-client.ts` now exports a synchronous `isPublicClientAvailable` flag
    (mirrors the old module-scope truthiness exactly — including the `currentChain === undefined` case
    where viem still built a client) plus a memoized single-flight `getPublicClient()` that
    `await import('viem')`s and constructs on first call (degrades to `undefined` on load/construct
    failure). All 11 consumers migrated: sync `Boolean(publicClient)`/`!publicClient`/`publicClient !==
    undefined` gates → `isPublicClientAvailable`; in-`queryFn`/watch usages → `const publicClient = await
    getPublicClient()`. `NavigationPromoBanner.tsx` moved the `keccak256`/`stringToBytes` calls behind
    `import('viem')` inside the mount effect (hash byte-identical). No static `viem` value import remains
    in any critical-path chunk (`import type` only). Unit tests: `public-client.spec.ts` (8 cases —
    availability mirror, lazy build, memoized single-flight, no-import-when-unavailable, degradation).
    `lint:tsc` clean, ESLint clean, vitest green.
  - M6 measured (2026-07-20): **−41 KB gz** vs the prior "After 2 (mixpanel)" trace — see the Impact
    addendum for the full row and A/B caveats.
- [x] 2 `[agent]` Bridge + Runtime modules with unit tests — done (2026-07-20).
  - inputs:
    - New modules under `src/features/connect-wallet/utils/` (`bridge.ts`, `runtime.ts`).
    - Bridge: module-level store + `useSyncExternalStore` hooks (`useWeb3Account()` with
      `{ address, status: 'disconnected' | 'optimistic' | 'connecting' | 'connected' | 'reconnecting' }`
      shape mapped to today's hub API); optimistic init from `wagmi.store` (resilient parse: bad JSON,
      missing keys, version mismatch → disconnected); connection-change event subscription for the
      `WALLET_CONNECT` analytics (new-connection vs. reconnect flag).
    - Runtime: single-flight promise; builds `wagmi-config` (reown → adapter + `createAppKit` with
      today's exact options incl. theme variables; fallback → plain `createConfig`, no appkit); explicit
      hydrate + `reconnect`; wires `watchAccount` → Bridge; exposes the needed `wagmi/actions` subset,
      `openModal`/`subscribeModalState`/`setThemeMode`, and the wagmi `config` for islands. Load
      triggers: `requestIdleCallback` after first paint (step-2 pattern), eager when `wagmi.store` has a
      connection, `ensureLoaded()` for route-eager and interaction paths. Failure: resolves to a
      disabled runtime — Bridge flips to disconnected, actions reject with a typed error.
    - Unit tests (standing policy): optimistic parse cases, single-flight/idempotent init, pre-ready
      action queue/join, load-failure degradation, watcher → store propagation.
  - done (2026-07-20): modules live in `utils/` (`utils/bridge.ts`, `utils/runtime.ts`, alongside
    `chains`/`wagmi-config`/`public-client`). `bridge.ts` — module-level external store + `useWeb3Account()`
    (`useSyncExternalStore`) with the `{ address, status }` shape; `readOptimisticAccount()` parses
    `wagmi.store` by hand (no wagmi import) with the resilient guards; `applyAccountChange(data, prev)` is
    the Runtime's feed (updates store + emits connect/disconnect events, `isReconnected` derived exactly
    as wagmi's `useAccountEffect`); `subscribeConnection` / `reset` / `hasPersistedConnection` round it
    out. `runtime.ts` — single-flight `getWeb3Runtime()` / `ensureLoaded()` that dynamic-imports
    `wagmi-config` + `@wagmi/core` (+ `@reown/appkit/react` in reown mode), builds AppKit with the exact
    `initReown` options (AppKit build kept non-fatal like the old try/catch), subscribes `watchAccount` →
    Bridge **before** `hydrate(config,{reconnectOnMount:true}).onMount()`, exposes
    `openModal`/`subscribeModalState`/`setThemeMode` + `disconnect`/`signMessage`/`switchChain` (bound to
    config) + `config`; load failure → `DISABLED_RUNTIME` (`isReady:false`, actions reject
    `Web3RuntimeUnavailableError`, Bridge reset). `startWeb3Runtime()` = eager on persisted connection,
    else `requestIdleCallback`. **Not wired into the app yet** (slice 3 consumes them). Added `@wagmi/core`
    `2.22.1` as a direct dep (only source of `hydrate`; = wagmi's exact transitive pin → single instance).
    Unit tests: `bridge.spec.ts` (18) + `runtime.spec.ts` (9). `lint:tsc` clean, ESLint clean, vitest green.
    NB for slice 3/4: the Runtime action surface is intentionally minimal — extend it (and backfill here)
    if a consumer needs another action.
  - ⚠️ watch (slice 3–5): `loadRuntime()` does `import('@wagmi/core')` (+ `wagmi-config`, which pulls
    wagmi/viem) unconditionally, before the reown branch — so calling `getWeb3Runtime()` in
    fallback/disabled mode still loads the wagmi chunks. That is intended for fallback **contract reads**
    (they need the wagmi config), but once the call sites exist we should confirm the runtime is never
    triggered in disabled mode when nothing consumes it (no wasted load). Not fixing now — no consumer
    wired yet, so the trigger conditions aren't final.
- [ ] 3 `[agent]` Boot-time consumers onto Bridge/Runtime; delete the TLA hubs
  - inputs:
    - Rewrite `hooks/useAccount.ts` and `hooks/useWallet.ts` as plain synchronous modules: reown →
      Bridge-backed implementations (no top-level `await import`); dynamic → existing
      `useAccountDynamic`/`useWalletDynamic` untouched; disabled → existing fallbacks.
    - New reown wallet hook replicates `useWalletReown` behavior on Bridge/Runtime: `connect` =
      `ensureLoaded()` + loading state + `openModal()`; `disconnect` via runtime action; `isOpen` from
      modal-state subscription; `WALLET_CONNECT` events + `userProfile.setOnce` preserved with the
      reconnect distinction (research doc §useAccountEffect).
    - Theme sync (`setThemeMode` on color-mode change) moves from `ReownProvider` to a small
      always-mounted effect (Bridge boot component, see slice 5) that no-ops until the runtime loads.
    - Rewards context: replace `useSignMessage`/`useSwitchChain` with runtime actions inside its async
      login flow; `useSignInWithWallet` and `AddressVerificationStepSignature` likewise where they only
      need actions (the signature step also reads account state → Bridge).
    - `AdBannerContent`/`useAccountWithDomain` need no changes beyond the hub rewrite underneath them.
- [ ] 4 `[agent]` `Web3Boundary` islands for route features + eager-load list
  - inputs:
    - Shared `Web3Boundary` component (connect-wallet/components): `ensureLoaded()` on mount, renders
      the feature's existing loading/skeleton fallback until ready, then
      `<WagmiProvider config={runtime.config}>{children}</WagmiProvider>`.
    - Wrap: contract methods tab (read + write — reads need the public client too), Optimism claim modal,
      Arbitrum claim button/receipt, Revoke page, marketplace iframe bridge host
      (`MarketplaceAppIframe` + `useMarketplaceWallet`), `AuthModalScreenConnectWallet`,
      `AddressVerificationStepSignature` (whatever slice 3 left hook-based).
    - Route-eager: `MarketplaceApp.tsx`, `MarketplaceEssentialDapp.tsx` (and their `?action=connect` /
      `useAutoConnectWallet` flows) call `ensureLoaded()` at page mount. Contract pages: **not** eager
      (decided — idle + interaction suffices).
    - Existing `*.pw.tsx` tests for the wrapped features must keep passing (islands must be transparent
      when the runtime is mocked/loaded).
- [ ] 5 `[agent]` Flip `_app`: remove root gating for reown/fallback
  - inputs:
    - `_app.tsx`: for `connectorType === 'dynamic'` keep today's `DynamicProvider` wrapping (explicit
      branch + comment referencing the follow-up); otherwise render children directly under a new root
      hydration gate (`useIsMounted` pattern — covers the layout shell; `PageNextJs` already covers page
      content) plus a small always-mounted boot component (eager triggers, theme sync, Bridge wiring).
    - Delete `Web3Provider.tsx`, `ReownProvider.tsx`, `WagmiProvider.tsx` (module-scope `initReown` dies
      with them; `DynamicProvider` stays), and `useWalletReown.ts` if slice 3 left it unused.
    - Chunk-failure UX: verify a blocked wallet chunk leaves the page fully functional with wallet
      actions failing gracefully (manual check with the chunk blocked in DevTools).
    - Full manual wallet smoke pass on a local prod build (reown mode): connect, disconnect, reconnect
      on reload, connect-before-loaded, contract read+write, revoke, marketplace dapp bridge, rewards
      login.
- [ ] 6 `[agent]` A/B measurement and report
  - inputs: protocol per `../tools/README.md`, median of 3 runs; fill the "After 4" row in the parent
    spec's Impact tracking table (plus the M6 note from slice 1); verify via bundle trace that no
    wagmi/viem/appkit/zod bytes load before FCP; note anomalies under the parent table.

## Impact addendum

| Checkpoint | M1 FCP | M2 first API req | M3 tx data | M4 content | M5 blocking | M6 JS before FCP |
| --- | --- | --- | --- | --- | --- | --- |
| After slice 1 (leaks) | 932 ms | 536 ms | n/a¹ | n/a¹ | 484 ms | 1710 KB |
| After slice 5 (full flip) | | | | | | |

¹ Single production-build trace (2026-07-20), same preset as the parent spec's baseline. The
**headline metric for this slice is M6 (JS before FCP): 1751 → 1710 KB gz, −41 KB**, measured against
the prior "After 2 (mixpanel)" trace — both builds carry the Mixpanel deferral and neither carries
lever 1, so they differ only by this slice, isolating the removed viem bytes (nav promo-banner
`keccak256` + the RPC-fallback public client) from the pre-FCP critical path. M6 is stable run-to-run
(per `../tools/README.md`), so a single run suffices. M3/M4 are unavailable: this trace's
`main-page/transactions` response never completed within the recording window (a slow backend draw,
several endpoints >4 s) — those metrics are backend-latency dependent and untouched by this slice. The
M1 −169 / M2 −138 / M5 −125 ms drops in the same A/B are within single-run noise and are **not** claimed
for this slice; only the wagmi/appkit removal in slices 3–5 is expected to move FCP materially.

## Open questions

None — all decisions were made in the grilling session (2026-07-16): architecture (hybrid),
dynamic-mode scoping (follow-up), loading policy (idle + eager cases + interaction guard), optimistic
button state (address, pending style), SSR (hydration-only gate), contract routes (not eager), promo
banner (lazy-import, keys stable), address-route leak (out of scope), env gating (none), demo deploy
(no).

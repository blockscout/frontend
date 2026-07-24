# Step 4 — Defer the wallet stack (lever 3)

| | |
| --- | --- |
| Parent spec | [`../spec.md`](../spec.md) — step 4 of issue [#3566](https://github.com/blockscout/frontend/issues/3566) |
| Status | `done` — reworked 2026-07-22 to **approach A** (see the Rework section); re-measurement owed |
| Sub-branch | `issue-3566-step-4` (off `issue-3566`) |
| PM / Designer / Backend | — (inherited from parent: technical/perf task) |
| Slack channel | — |

Read together with [`04-wallet-stack-research.md`](./04-wallet-stack-research.md) (2026-07-16): the
research doc holds the *map* — gating mechanics, the full consumer audit, constraints; this spec holds
the *decisions and the breakdown*. Where they differ, this spec wins.

> **Two designs live in this document.** The **Rework** section immediately below is the current,
> shipped architecture (approach A). Everything from **Context & goal** onward is the **original v1
> design** (hybrid Bridge/Runtime/islands with hand-rolled hydration), kept verbatim for history — the
> goals, functional requirements, consumer audit and slice-by-slice record there are still accurate,
> **except** for the parts the Rework supersedes (called out below). Where the two disagree, the Rework
> section wins.

## Rework (2026-07-22): approach A — native lazy provider

### Why we changed course

v1 shipped and hit its performance goal (M6 −730 KB, wallet stack off the critical path), but landing it
was a bug whack-a-mole, and the root cause was structural: **v1 reimplemented pieces of wagmi/reown's own
hydration and reconnection logic** so the header could show account state before any provider mounted.
Concretely, v1 owned:

- a hand-written parse of wagmi's **internal** `localStorage` blob (`wagmi.store`) to seed the optimistic
  address — coupled to wagmi's private serialization format and store `version`;
- an explicit `hydrate(config, { reconnectOnMount }).onMount()` call plus a `watchAccount` subscription,
  i.e. a second copy of what wagmi's React `<Hydrate>` does, with the AppKit-ready ordering constraint we
  had to discover by hand;
- a Bridge that *reinterpreted* wagmi status transitions (the `optimistic`/`connecting`→`reconnecting`
  coalescing) to avoid a "Connect" flash.

Every one of these was a place our code had to stay bug-for-bug compatible with wagmi/reown internals.
The QA-fix trail in slices 5–6 below (reconnect owner, island re-hydration wiping the live connection,
reconnect flicker) is the symptom: fix one, surface another. And it was **fragile against upgrades** —
any change to wagmi's persistence format, reconnect timing, or AppKit's connector-registration order
would break us silently. The developer's call (2026-07-22): optimize for **maintenance and low coupling**
over squeezing the theoretical minimum, accepting a design that is "edgy" only in *where* the provider
mounts, not in *reimplementing* the library.

### The approach

Mount wagmi's **own** `<WagmiProvider ssr: false>` (which runs its own `<Hydrate>` → reconnect) lazily,
and let it — not us — own hydration/reconnection. The one non-obvious move is **where** it mounts:

- **Trailing sibling, not wrapper.** `<Web3Provider>` renders `children` (the whole app) provider-less at
  first paint, and once the runtime loads it mounts `<WagmiProvider>` as a **trailing sibling** of the app
  that hosts **only** `AccountPublisher` — never the app tree. Adding a trailing sibling doesn't remount
  the earlier siblings, so mounting the wallet stack leaves all app state intact (an email-authenticated
  session survives connecting a wallet — the concern that motivated the sibling refinement over a plain
  wrapper). This keeps the wallet chunks off the critical path (same M6 win as v1) **without** the
  whole-app remount a lazy root wrapper would cause.
- **`AccountPublisher` is the single writer of the Bridge.** It lives inside `<WagmiProvider>`, reads
  wagmi's native `useAccount`/`useAccountEffect`, and mirrors them into the Bridge for boot-time
  consumers. No status reinterpretation — wagmi's statuses (`connecting`/`reconnecting`/`connected`/
  `disconnected`) map 1:1.
- **Bridge is now a dumb mirror.** It carries no wallet logic: an external store plus an **own-format**
  persisted flag (`bs:wallet`, holding just `{ address }` — a value *we* write on connect/disconnect, so
  its shape is ours and a wagmi upgrade can't break it). The optimistic seed reads our flag, not
  `wagmi.store`. `readOptimisticAccount`/`applyAccountChange`/the ongoing `wagmi.store` parser are **gone**.
  - **One-time migration (kept, by review).** Because `bs:wallet` is only ever written by the new code, a
    user who last connected on the pre-rework app has `wagmi.store` but no `bs:wallet`, and would lose the
    optimistic seed + eager reconnect on their first post-release load until they reconnect once. `bridge.ts`
    therefore reads `wagmi.store` **exactly once at init** and, if it holds a current connection, seeds
    `bs:wallet` from it (wagmi still owns the actual reconnection). This is the **only** remaining touch of
    wagmi's internal storage — a bounded, version-guarded, well-commented shim, safe to delete a release
    cycle after users have re-persisted via `bs:wallet`. (Code-review finding #1, 2026-07-23.)
- **Runtime no longer hydrates.** It only prepares `config` + AppKit + the imperative `wagmi/actions`
  subset and hands them over; `hydrate`/`watchAccount` and the `@wagmi/core` direct dependency they
  required are removed (`wagmi`/`wagmi/actions` suffice). It also stopped depending on the Bridge.
- **`Web3Provider` absorbs boot duties.** Eager reconnect for a returning user (focus-guarded idle load,
  skipped while an input is focused so it never interrupts typing) and AppKit theme-sync live here;
  `Web3Boot` is deleted.
- **`Web3Boundary` islands publish the config read-only.** Route features that use wagmi hooks get the
  config injected via `WagmiContext.Provider` over just their subtree — no `<Hydrate>`, so they never
  re-hydrate or double-reconnect. **Dynamic-mode fix:** when a `<WagmiProvider>` already sits above the
  island (dynamic mode wraps the whole app in one via `DynamicProvider`, and never mounts `Web3Provider`),
  the boundary is **transparent** and renders children directly — otherwise `useIsWeb3Ready` (only
  `Web3Provider` supplies it) is never true and the feature is stuck on its fallback forever. This was a
  real regression the rework introduced and then fixed (perpetual loader on the contract ABI tab in
  dynamic mode).

### File map (current)

| File | Role |
| --- | --- |
| `utils/bridge.ts` | Dumb external store + own-format `bs:wallet` flag; sole reader for boot consumers, written only by `AccountPublisher`. |
| `utils/runtime.ts` | Lazy single-flight loader of `config` + AppKit + actions; `subscribeRuntimeLoaded`/`getLoadedRuntime`/`applyThemeMode`. No hydrate/watch. |
| `context.tsx` (feature root) | `<Web3Provider>` (sibling mount + ready-context) + `useIsWeb3Ready`; owns eager reconnect + theme sync. Lives at the feature root as the wallet context, matching the repo's `context.tsx` convention (marketplace/rewards). |
| `components/DynamicProvider.tsx` | Root `<WagmiProvider>` for dynamic connector mode (flattened out of the former one-file `components/providers/`). |
| `components/Web3ProviderInner.tsx` | The lazily-imported native `<WagmiProvider>` hosting only `AccountPublisher` (keeps the wagmi import in the wallet chunk). |
| `components/AccountPublisher.tsx` | Inside `<WagmiProvider>`; mirrors `useAccount`/`useAccountEffect` into the Bridge; sole Bridge writer. |
| `components/Web3Boundary.tsx` | Per-feature island: injects `WagmiContext` read-only in reown/fallback; transparent under an existing provider (dynamic). |

Deleted vs v1: `components/Web3Boot.tsx` (folded into `Web3Provider`); the `@wagmi/core` direct dep and
all hand-hydration code in `runtime.ts`; the `wagmi.store` parser + `readOptimisticAccount`/
`applyAccountChange`/`'optimistic'` status in `bridge.ts`.

### What carries over unchanged from v1

The **goal** (first paint independent of all wallet chunks, zero behavior change), the **fallback/degrade**
contract, the **analytics parity** requirements, the **dynamic-mode scoping** (still a root
`DynamicProvider`, redesign still a follow-up), and the **measurement protocol**. The v1 functional
requirements below all still hold; only the *mechanism* behind the optimistic seed and reconnection
changed.

### Verification

- Unit suite green (68 connect-wallet specs): `bridge`/`runtime` rewritten to the new API; new
  `AccountPublisher` + `web3-provider` specs (sibling mount, ready-context flip, theme sync, focus-guarded
  eager reconnect); `Web3Boundary` covers the dynamic-transparency path. `lint:tsc` + ESLint clean.
- Live: reown mode (connect opens the AppKit modal via lazy load, no wallet chunk before interaction; app
  state — including a header search value — survives the wallet mount, confirming no remount); dynamic
  mode (contract ABI read/write tab renders instead of a perpetual loader).
- UX fix: the profile-popover "Connect" button now awaits the modal open before closing the popover
  (was a fixed 300 ms timer that fired before the lazy modal appeared).

### Owed

- **Re-measurement — done (2026-07-22).** Fresh production A/B confirms no regression: **M6 1751 → 1030 KB
  gz (−721)**, statistically identical to v1's 1021 KB (+9 KB, within noise) — the wallet stack still loads
  only after FCP. See the Impact addendum "After rework (approach A)" row + footnote ³, and the parent
  "After 4" row (updated to the reworked numbers).
- Real-wallet smoke on the reworked tree (email-auth → connect state survival, connect/reconnect,
  contract read/write) and the Dynamic-setup pass.

---

## Context & goal
<!-- Everything from here on is the original v1 design, preserved for history. See the Rework section
     above for what supersedes it. -->


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
    - slice 3 update: no stray disabled-mode trigger introduced — every `getWeb3Runtime()` call site added
      (reown wallet connect/disconnect, rewards login, sign-in, signature) is guarded by a connection/
      interaction that can't occur in fallback/disabled mode. Remaining triggers to verify: slice-4
      contract-read islands (intended fallback load) and the slice-5 boot component.
    - slice 4 update: the contract-methods island (`ContractAbi`) is the **intended** disabled-mode
      trigger — the read tab wraps in `Web3Boundary`, whose `ensureLoaded()` loads the plain wagmi config
      so `usePublicClient` reads keep working with the wallet feature off. That's the one expected
      fallback-mode load; the other new islands (L2 claim, revoke, marketplace bridge) only exist where
      `connectWallet` is enabled. Still open for slice 5: the boot component must **not** call
      `getWeb3Runtime()` in disabled mode when nothing consumes it (keep the eager trigger reown/dynamic-
      only, or gated on `hasPersistedConnection()`).
- [x] 3 `[agent]` Boot-time consumers onto Bridge/Runtime; delete the TLA hubs — done (2026-07-20).
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
  - done (2026-07-20): `hooks/useAccount.ts` + `hooks/useWallet.ts` are now sync (no TLA) —
    reown → new Bridge-backed `account/useAccountReown.ts` + `wallet/useWalletReown.ts` (rewritten:
    account state from Bridge; connect/disconnect/openModal via `ensureLoaded()`; modal `isOpen` from
    `subscribeModalState`; `WALLET_CONNECT` Started/Connected + `userProfile.setOnce` preserved, reconnect
    distinction via Bridge `subscribeConnection`); fallback → existing fallbacks. The **light** reown hooks
    mean the header's module graph no longer awaits any wallet/appkit chunk. `optimistic`/`reconnecting`
    map to the address-visible reconnecting style (no Connect flash), matching wagmi `getAccount` (which
    keeps the persisted address during reconnect). Dynamic kept lazy (developer decision) via
    `use()`-based wrappers `account/useAccountDynamicLazy.ts` + `wallet/useWalletDynamicLazy.ts` that
    dynamic-import the **untouched** `useAccountDynamic`/`useWalletDynamic` — so `@dynamic-labs` stays in
    its own async chunk, never on the reown/fallback critical path. **Verified** the pages-router
    `next/dynamic(ssr:false)` does NOT provide a Suspense boundary (it uses `loadable.shared-runtime` /
    `useSyncExternalStore`, not `React.lazy`), and there was none above the consumers — so `use()` would
    have crashed dynamic mode. Added one explicit `<Suspense fallback={ null }>` in `_app.tsx` around
    `Web3Provider`'s children: inert for reown/fallback (nothing suspends), and in dynamic mode the wallet
    hooks suspend on first render (no prior commit → no remount, same null-gating window as `ssr:false`).
    Rewards `context.tsx`,
    `useSignInWithWallet.ts`, and `AddressVerificationStepSignature.tsx` migrated off wagmi React hooks
    (`useSignMessage`/`useSwitchChain`/`useAccount`) to `getWeb3Runtime()` actions + the Bridge hub inside
    their async flows. Unit tests: `useAccountReown.spec.tsx` (5), `useWalletReown.spec.tsx` (8).
    `lint:tsc` clean, ESLint clean, all connect-wallet/rewards/account-hooks specs green (48).
    Deferred to slice 5 (per input): theme sync (`setThemeMode` on color-mode change) — still lives in
    `ReownProvider` until that provider is deleted and the boot component lands.
- [x] 4 `[agent]` `Web3Boundary` islands for route features + eager-load list — done (2026-07-21).
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
  - done (2026-07-21): new `components/Web3Boundary.tsx` — reads `WagmiContext`; **transparent** when a
    `<WagmiProvider>` already sits above it (nested islands, the Playwright `TestApp`, and the root
    `Web3Provider` still mounted until slice 5) → renders children directly, never re-gating or shadowing
    the (same singleton) config. Otherwise `ensureLoaded()` on mount, shows the `fallback` until
    `runtime.config` resolves, then publishes the config straight onto `WagmiContext.Provider` (see the
    2026-07-22 QA fix — the earlier `<WagmiProvider reconnectOnMount={false}>` re-ran wagmi's `<Hydrate>`
    and wiped the Runtime's live reconnection). Chunk-load failure → disabled runtime (no
    config) → fallback stays up (degraded, never blank). Wrapped, via in-file split (Content + island) or
    at the single call site: `ContractAbi` (covers all three method tabs + read/write, fallback
    `ContentLoader`), `OptimisticL2ClaimModal` (wrapped at its `OptimisticL2ClaimButton` call site),
    `ArbitrumL2TxnWithdrawalsClaimButton` (+ its receipt child, fallback = loading Claim skeleton),
    `MarketplaceAppIframe` (kept `chakra()` export, fallback `ContentLoader`), `Revoke` (fallback
    `ContentLoader`). `AuthModalScreenConnectWallet` + `AddressVerificationStepSignature` needed **no**
    island — slice 3 already moved them off wagmi React hooks onto the Bridge hub + `getWeb3Runtime()`
    actions. Route-eager `ensureLoaded()` at mount added to `MarketplaceApp` + `MarketplaceEssentialDapp`
    (`EssentialDapp`); contract pages left non-eager. Verified `DynamicProvider` renders the repo
    `<WagmiProvider>`, so dynamic mode keeps a root `WagmiContext` → islands stay transparent there too.
    Unit tests: `Web3Boundary.spec.tsx` (3 — transparency/no-load, loading→children, load-failure). pw
    transparency confirmed structurally: `playwright/fixtures/render.tsx` mounts every component under
    `TestApp`'s root `<WagmiProvider>` (mock connector) → boundary transparent, `ensureLoaded()` never
    called; screenshot baselines unchanged (human re-run per delegation policy). `lint:tsc` clean, ESLint
    clean, 55 unit specs green (connect-wallet + contract-methods utils).
- [x] 5 `[agent]` Flip `_app`: remove root gating for reown/fallback — done (2026-07-21); manual smoke
  pass still owed (see caveat below).
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
  - done (2026-07-21): `_app.tsx` now branches on `walletConnectorType`: `dynamic` keeps
    `DynamicProvider` (`next/dynamic`, `ssr:false`) + the Suspense boundary for the lazy dynamic hooks;
    reown/fallback render the app tree under a hydration-only gate (`useIsMounted` — nothing on the
    server, no chunk wait) with no root wallet provider, plus an always-mounted `Web3Boot`. New
    `components/Web3Boot.tsx` (render-nothing): `startWeb3Runtime()` once on mount + `applyThemeMode` on
    color-mode change. `runtime.ts` gained `applyThemeMode` (records the app color mode, applies it to
    AppKit on resolve and live thereafter — never forces a load) and `startWeb3Runtime` now boot-loads the
    runtime **only for a reown user with a persisted connection** (see the QA-fix note below — closes the
    ⚠️ watch item too, since fallback/disabled never boot-loads; the contract-read island stays the only
    intended disabled-mode trigger). Deleted `Web3Provider.tsx`, `ReownProvider.tsx`
    (module-scope `initReown` gone — the exact options already live in `runtime.loadRuntime`),
    `WagmiProvider.tsx`; `DynamicProvider` inlines wagmi's `<WagmiProvider config={wagmiConfig.config}>`.
    `AddressVerificationModal` dropped its now-dead `Web3Provider` wrapper (slice 3 moved the signature
    step to the Bridge hub + `getWeb3Runtime()` actions). `useWalletReown.ts` kept — it is used by the hub.
    Unit tests: new `Web3Boot.spec.tsx` (3) + `runtime.spec.ts` extended (fallback no-boot-load;
    `applyThemeMode` records/applies/no-load — 4 new). `lint:tsc` clean, ESLint clean, 58 connect-wallet
    specs green.
  - ⚠️ verification caveat (developer): browser dev-preview verification was **inconclusive** — the
    headless Turbopack dev preview (staging preset) renders a blank `#__next` even for the *committed*
    slice-4.4 code (verified by stashing), so it can't distinguish working from broken here; console did
    confirm the app tree renders (TopBar/query/form components mount) and the reown runtime initialises
    (AppKit/Coinbase SDK) with **no** "must be used within WagmiProvider" / crash error. The two manual
    input items above are therefore still owed and are the gating check before merge: (1) **chunk-failure
    UX** — block the wallet chunk in DevTools, confirm the page stays functional; (2) **full wallet smoke
    pass on a local prod build** (`next build && next start`, reown mode) — connect, disconnect, reconnect
    on reload, connect-before-loaded, contract read+write, revoke, marketplace dapp bridge, rewards login.
  - QA fix (2026-07-21, from manual QA): the header button flickered idle → spinner → idle on load for a
    user with no connected wallet. Root cause (confirmed by instrumenting the Bridge in the dev preview):
    the boot-time idle-load initialised AppKit, whose wagmi adapter drives the account through `connecting`
    before settling back to `disconnected` — even with nothing to reconnect — and the header renders
    `connecting` as a spinner. Fix: `startWeb3Runtime` boot-loads **only** when `hasPersistedConnection()`
    (a returning user who actually reconnects); everyone else loads on the first wallet interaction. Also
    gated `hydrate`'s `reconnectOnMount` on `hasPersistedConnection()`. The idle-preload (and its
    `requestIdleCallback`/`IDLE_LOAD_TIMEOUT`) was removed. Still owed in the manual smoke pass: confirm a
    **returning user with a persisted connection** reconnects with the address shown in the reconnecting
    style and no "Connect" flash. Two behaviours seen during the same QA are **pre-existing, not from this
    step** (verified — the step touches neither file): the `rewards:logout` 401 `{code:16}` after login is
    the rewards context's stale-token cleanup (`context.tsx` init effect, address mismatch), and the home
    "Watch list" tab appearing-but-not-auto-selected is `slices/home/.../txs/Transactions.tsx` behaviour.
  - QA fix (2026-07-22, from manual QA — reown reconnect on a real wallet): resolves the reconnect half of
    the ⚠️ caveat below. Three linked defects, all in returning-user reconnect:
    1. **Reconnect owner.** wagmi's `reconnect` — not AppKit — is what restores an injected/EIP-6963 wallet
       (AppKit's own `syncExistingConnection` covers WalletConnect only). `runtime.loadRuntime` now creates
       AppKit, `await`s `appKit.ready()` (so its connectors are registered), then runs
       `hydrate(config,{reconnectOnMount: hasPersistedConnection()}).onMount()` as the sole reconnect
       driver. Ordering matters: firing wagmi's reconnect while AppKit is still initialising made AppKit's
       account listener read a not-yet-registered connector and throw (`client.ts` `connector.id` on
       `undefined`). `onMount` still always runs — it also registers the EIP-6963 connectors, without which
       no injected wallet is connectable.
    2. **Island re-hydration.** `Web3Boundary` mounted `<WagmiProvider reconnectOnMount={false}>`, whose
       `<Hydrate>` re-ran `onMount` on the already-hydrated config and *reset* its connections to empty,
       dropping the live wallet mid-session (crash + disconnect on the contract tab). It now publishes the
       config via `WagmiContext.Provider` directly — the Runtime stays the single hydration owner.
    3. **Reconnect flicker.** wagmi restores through the `connecting` status (address briefly undefined),
       which the button read as "not connected" → a "Connect" flash between the optimistic seed and the
       confirmed connection. The Bridge now coalesces that interim: while mid-reconnect
       (`optimistic`/`reconnecting`) an incoming `connecting` is presented as `reconnecting` with the
       last-known address held, so the address stays visible in the reconnecting style throughout. A fresh
       connect starts from `disconnected`, so its `connecting` is untouched.
    Verified on a real wallet (reown): fresh connect, persisted-reload reconnect (no crash, survives repeat
    reloads), contract read/write tab, and no button flicker. `lint:tsc`/ESLint clean, 60 connect-wallet
    specs green (+2 Bridge reconciliation tests). Still owed from the caveat: the **chunk-failure UX** check
    and a **full prod-build smoke pass** across the remaining consumers (revoke, marketplace bridge, rewards
    login, connect-before-loaded).
- [x] 6 `[agent]` A/B measurement and report — done (2026-07-22).
  - inputs: protocol per `../tools/README.md`, median of 3 runs; fill the "After 4" row in the parent
    spec's Impact tracking table (plus the M6 note from slice 1); verify via bundle trace that no
    wagmi/viem/appkit/zod bytes load before FCP; note anomalies under the parent table.
  - done (2026-07-22): parent "After 4 (wallet stack)" row + footnote ⁴ filled; this addendum's "After
    slice 5 (full flip)" row + footnote ² filled. **Headline M6 (JS before FCP) 1751 → 1021 KB gz, −730 KB**
    (A/B vs "After 2 (mixpanel)"; step 3 rollbar not in build). Bundle check: pre-FCP JS 101 → 68 chunks,
    largest pre-FCP chunk 79 → 60 KB — no wallet-sized bundle before paint (per-module names hashed in prod,
    so M6 + chunk-count is the confirmation without a source-map pass). M3/M4 not comparable (this run's
    transactions endpoint drew 3354 ms; no second run captured transactions → no median-of-3). Only one
    clean step-4 production trace was available; the slice-1 trace predates slices 3–5. **Not done here**
    (parent-level, needs the whole issue complete + developer sign-off): filling parent "Final (measured)"
    and posting the table to issue #3566.

## Impact addendum

| Checkpoint | M1 FCP | M2 first API req | M3 tx data | M4 content | M5 blocking | M6 JS before FCP |
| --- | --- | --- | --- | --- | --- | --- |
| After slice 1 (leaks) | 932 ms | 536 ms | n/a¹ | n/a¹ | 484 ms | 1710 KB |
| After slice 5 (v1, full flip) | 564 ms | 495 ms | 4188 ms² | 4343 ms² | 468 ms | 1021 KB |
| After rework (approach A) | 591 ms | 533 ms | 3967 ms³ | 4131 ms³ | 484 ms | 1030 KB |

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

² Full step-4 tree (all slices, reown mode, logged in), recorded 2026-07-22, same preset, A/B'd against
the prior "After 2 (mixpanel)" trace (step 3 rollbar is not in this build). **Headline: M6 (JS before
FCP) 1751 → 1021 KB gz, −730 KB** — the wagmi/viem/appkit/reown stack and its transitive deps no longer
load before paint. Corroborated in the trace by the pre-FCP JS set dropping from 101 chunks to 68 and
the largest pre-FCP chunk shrinking 79 → 60 KB (no wallet-sized bundle remains); the stack still loads,
but after FCP on the eager reconnect (the logged-in wallet reconnects in this run). Per-module names are
hashed in the production bundle, so this is the confirmation available without a source-map/analyzer
pass. The FCP −537 / first-API −179 / blocking −141 ms drops are directionally expected (render no
longer waits on the wallet provider) but single-run, so M6 is the claimed result. M3/M4 not comparable:
this run's `main-page/transactions` drew 3354 ms (vs 1184 ms in the "After 2" run), inflating both — the
content-ready path (`max(boot, backend)`) is untouched by this lever, and no second run captured a
transactions response, so a median-of-3 was not possible. Normalized to equal backend latency there is
**no content-ready regression**: the transactions request fired at 834 ms and drew 3354 ms; substituting
the "After 2" run's 1184 ms backend gives M3 ≈ 2018 ms (vs 2165 ms) and M4 ≈ 2173 ms (vs 2314 ms) — flat
to ~145 ms better, tracking the earlier request start (834 vs 981 ms); the post-response render-commit
gap is unchanged (~150 ms both runs).

³ Reworked tree (approach A — native lazy **sibling** `<WagmiProvider>`, no hand-hydration), recorded
2026-07-22, same preset, A/B'd against the same "After 2 (mixpanel)" trace as the v1 row. **M6 (JS before
FCP) 1751 → 1030 KB gz, −721 KB** — statistically identical to the v1 "After slice 5" 1021 KB (+9 KB,
within run-to-run noise), confirming approach A **preserves the deferral**: the wallet stack still loads
only after FCP (on eager reconnect / first interaction), so moving the provider from a root wrapper to a
trailing sibling changed *where* it attaches, not *when* the chunk loads — no perf regression from the
rework. Supporting single-run drops vs "After 2": FCP −510, first API −141, blocking −125 ms. M3/M4 **not
comparable** — this run's `main-page/transactions` drew 3080 ms (fired at 886 ms), inflating both; the
content-ready path (`max(boot, backend)`) is untouched by this lever, and no median-of-3 was captured.

## Open questions

None — all decisions were made in the grilling session (2026-07-16): architecture (hybrid),
dynamic-mode scoping (follow-up), loading policy (idle + eager cases + interaction guard), optimistic
button state (address, pending style), SSR (hydration-only gate), contract routes (not eager), promo
banner (lazy-import, keys stable), address-route leak (out of scope), env gating (none), demo deploy
(no).

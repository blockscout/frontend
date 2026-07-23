# Subtask 4 — Defer the wallet stack: investigation & solution options

Status: **research notes** (2026-07-16). This is *not* the sub-spec — it is the input for the
`grill-the-task` subtask session that will write `04-wallet-stack.md`. Everything here was verified
against the code on branch `issue-3566` unless marked "verify during implementation".

## 1. How the wallet stack blocks first paint today

Three independent mechanisms, all of which must be addressed:

### 1a. `Web3Provider` gates the whole tree ([_app.tsx:116](../../../src/pages/_app.tsx))

`Web3Provider` ([Web3Provider.tsx](../../../src/features/connect-wallet/components/Web3Provider.tsx))
picks one of three providers by `config.features.connectWallet.connectorType`, each loaded with
`next/dynamic(..., { ssr: false })` and **no `loading` fallback**:

- `reown` → `ReownProvider` (AppKit + wagmi),
- `dynamic` → `DynamicProvider` (@dynamic-labs SDK + wagmi),
- otherwise → plain `WagmiProvider` (wagmi + viem only — **even wallet-disabled instances pay
  wagmi+viem**, because contract reads go through wagmi's public client).

`dynamic(ssr:false)` renders `null` until its chunk downloads **and evaluates** — and the entire app
content is a child of `Web3Provider`, so nothing paints until then. This also means: a chunk-load
failure permanently blanks the page, and no page content is ever server-rendered (the `ssr: false`
subtree covers everything).

`createAppKit` runs at **module scope** of `ReownProvider.tsx` (`initReown()`, line 56) — the cost is
paid on chunk evaluation, not on component mount, so the deferral boundary must be the `import()`.

### 1b. Top-level-await hook hubs are statically reachable from the header

[useWallet.ts](../../../src/features/connect-wallet/hooks/useWallet.ts) and
[useAccount.ts](../../../src/features/connect-wallet/hooks/useAccount.ts) select their implementation
with **top-level `await import(...)`** on runtime config. In reown mode that's
`await import('./wallet/useWalletReown')` / `(await import('wagmi')).useAccount`, and
`useWalletReown.ts` statically imports `@reown/appkit/react` + wagmi.

These hubs are statically imported by the top-bar components (`UserWalletDesktop/Mobile`,
`UserProfileContentWallet`, auth0/dynamic profile variants), which `HeaderDesktop`/`HeaderMobile`/
`NavigationDesktop` import statically. TLA makes every importing module async: the shell's module
evaluation *awaits the wagmi/appkit chunks*. So even if 1a were fixed, the header would still hold
first render hostage. Both hubs must be replaced, not just the provider.

### 1c. Static viem leaks in critical bundles (bundle weight, not render gating)

- [NavigationPromoBanner.tsx:5](../../../src/shell/navigation/promo-banner/NavigationPromoBanner.tsx) —
  `import { keccak256, stringToBytes } from 'viem'` just to hash a localStorage key; the nav shell
  renders on **every page**. Replace with a non-viem hash or lazy-import inside the effect.
- [rpc-data-context.tsx:11](../../../src/slices/home/contexts/rpc-data-context.tsx) →
  [public-client.ts](../../../src/features/connect-wallet/utils/public-client.ts) — module-scope
  `createPublicClient` (viem) statically imported by `Home.tsx` (and the degraded-mode widgets +
  tx/block/address RPC fallbacks). The client is only used when degraded mode activates → move the
  viem import inside the query functions (async anyway).
- Adjacent, not main-page: `src/slices/address/utils/get-checked-summed-address.ts` pulls viem
  `getAddress` into the address route.

## 2. Consumer inventory (audit of all wagmi/viem/@reown imports, 2026-07-16)

Full sweep found **47 production files**; ~21 are viem *type-only* (zero cost), ~12 are pure viem
utils (no provider needed), **14 use wagmi React hooks** (need `WagmiProvider` context today).
**Nothing uses wagmi's non-React core API (`wagmi/actions` / `@wagmi/core`) yet.** No direct
`@walletconnect/*` / `@web3modal/*` imports (transitive via AppKit only).

### Mounted at boot on every page (these force the current root provider)

| Consumer | Needs |
| --- | --- |
| Header wallet button (`UserWalletDesktop/Mobile` → `useWallet`/`useAccountWithDomain` hubs) | account **state**; connect/disconnect/modal **actions** on click |
| `AdBannerContent` (Specify ads) | account **state** only (`address`, `isConnecting`) |
| `RewardsContextProvider` (app-root, `ssr:false` dynamic, when rewards enabled) | `useSignMessage` + `useSwitchChain` (async login flow) + account state |
| User profile (auth0/dynamic variants) | account state; Dynamic auth context in `dynamic` mode |

### Route-scoped (mount only on their pages)

| Feature | Files (representative) | wagmi surface |
| --- | --- | --- |
| Contract read tab | `useCallMethodPublicClient.ts` | `usePublicClient` — **reads need wagmi too**, with the multichain-aware transports from `wagmi-config.ts` |
| Contract write tab | `useCallMethodWalletClient.ts`, `ContractMethodResultWalletClient.tsx` | `useAccount`, `useSwitchChain`, `useWriteContract`, `useSendTransaction`, `useWaitForTransactionReceipt` (reactive) |
| L2 claims | `OptimisticL2ClaimModal.tsx`, `ArbitrumL2TxnWithdrawalsClaimButton/Tx.tsx` | write + receipt hooks |
| Revoke essential dapp | `Revoke.tsx` + hooks | `usePublicClient`, `useWriteContract`, `useEnsName` (mainnet) + many viem utils |
| Marketplace dapp iframe bridge | `useMarketplaceWallet.tsx`, `MarketplaceAppIframe.tsx`, `useAutoConnectWallet` (only `MarketplaceApp.tsx` / `MarketplaceEssentialDapp.tsx` routes) | `useAccount`, `useSendTransaction`, `useSwitchChain`, `useSignMessage`, `useSignTypedData`; needs wallet **at page load** (`?action=connect`, iframe bridge) |
| Sign-in with wallet / verified addresses | `useSignInWithWallet.ts`, `AddressVerificationStepSignature.tsx`, `AuthModalScreenConnectWallet.tsx` | `useSignMessage`, `useSwitchChain`, `useAccount` (interaction-time) |

`web3-wallet` (add token/network) uses raw EIP-1193 `window.ethereum` + viem types only — unaffected.
`MarketplaceContextProvider` itself has no wallet imports.

## 3. Constraints the solution must respect

1. **No root fallback→real provider swap** — changing the element between `{children}` and
   `<WagmiProvider>{children}</WagmiProvider>` remounts the entire subtree (state loss, effect
   re-runs, double analytics, socket reconnects). Ruled out by the main spec.
2. **wagmi hooks throw without a provider** (`WagmiProviderNotFoundError`) — components calling them
   must not render until a config exists in context (or must receive `config` explicitly; every wagmi
   hook accepts an optional `{ config }` parameter).
3. **Rewards context is app-level** and calls wagmi hooks at provider top — any design must feed it.
4. **Dynamic connector has no core API** — `DynamicContextProvider` is a React-context SDK; state
   can only be harvested from inside its tree.
5. **Auto-reconnect UX** — wagmi persists to localStorage (`wagmi.store`, default storage;
   `ssr: true`, no custom storage configured — verify exact schema on wagmi 2.19.5). A returning
   connected user must not see a "Connect" flash: read the persisted state synchronously for
   optimistic button state, styled as reconnecting until confirmed.
6. **AppKit needs no React tree** — the modal is a web component driven by the `createAppKit`
   singleton; `useAppKit().open` / `useAppKitState` / `useAppKitTheme` are wrappers over
   `appKit.open()` / `subscribeState()` / `setThemeMode()`. Modal open + theme sync work from a
   plain module.
7. **SSR parity** — today nothing below `Web3Provider` server-renders. Naively deleting the
   `ssr: false` boundary turns SSR **on** for the whole tree (hydration-mismatch audit, changed
   server load). Parity-safe default: keep an explicit client-only boundary that waits for
   *hydration only* (one effect tick), not for any chunk. Enabling shell SSR is a separate future
   experiment, out of scope here.
8. **No behavior changes** (main spec): no lost/duplicated analytics or requests, reconnect works,
   connect-before-loaded shows a loading state then opens the modal, chunk-load failure degrades to
   "wallet unavailable" instead of a blank page.

## 4. Building blocks (shared by all options)

- **Bridge** — a tiny, permanently-mounted store (module-level external store +
  `useSyncExternalStore` hooks, e.g. `useWeb3Account()`, `useWeb3Status()`). Initial value read
  synchronously from persisted `wagmi.store` (optimistic); once the runtime loads, fed by wagmi
  core watchers (`getAccount`/`watchAccount(config, …)`). No provider element ever swaps → no
  remount, ever. Replaces the TLA hubs for all *state* consumers.
- **Runtime** — a lazy singleton module (`getWeb3Runtime(): Promise<…>`) that dynamic-imports
  `wagmi-config.ts` + runs `createAppKit` + re-exports the needed `wagmi/actions` and appkit
  controls. Idempotent; a load failure resolves to a disabled runtime (same pattern as the
  mixpanel queue from subtask 2). Loaded on: idle after first paint (default), route need
  (marketplace dapp routes; contract page write tab deep-link), user interaction (connect click →
  loading state → open modal), or persisted-connection present (eager reconnect).
- **`Web3Boundary` island** — a small component that renders a fallback until the runtime is ready,
  then `<WagmiProvider config>{children}</WagmiProvider>` (single shared config). Lets existing
  wagmi-hook code run unmodified inside feature subtrees; the mount-time "swap" is local to the
  feature and usually happens before the feature UI is opened at all.
- **Side-tree harvesting** (for Dynamic) — mount `DynamicContextProvider` (+ `WagmiProvider`) as a
  *sibling* of the app content, with a headless child that reads the SDK context and pushes
  state/actions into the Bridge. The SDK's modal renders via portal from the side tree. App content
  never remounts. Only needed for `connectorType === 'dynamic'`.

## 5. Solution options

### Option A — provider islands only

Keep all 14 hook files untouched; wrap every wallet feature subtree in `Web3Boundary`; Bridge only
for header + ad banner + rewards (which can't be islands cheaply).

- + Smallest per-file diff in feature code; wagmi hooks stay battle-tested.
- − Boot-time consumers still need the Bridge anyway (islands can't help components that render at
  first paint), so A degenerates into C for the critical path; every feature needs a fallback UI.

### Option B — full core-actions rewrite (no wagmi-react at all)

Replace every wagmi hook with Bridge state + `await getWeb3Runtime()` core actions
(`signMessage`, `switchChain`, `writeContract`, `getPublicClient`, …; all exist in `wagmi/actions`).
Kill `WagmiProvider` everywhere (reown/fallback modes).

- + Cleanest end state: zero remount concerns, wagmi's React layer leaves the bundle, actions
  "just work" at interaction time (they're async anyway).
- − Largest refactor (~14 files) in one step; reactive hooks (`useWaitForTransactionReceipt`,
  `useEnsName`) need `useQuery`-wrapped replacements; highest risk of subtle behavior drift, which
  the spec forbids.

### Option C — hybrid (recommended)

- **Bridge** for all boot-time *state* consumers: header button, ad banner, `useAccountWithDomain`;
  delete the TLA hubs (`useWallet.ts` / `useAccount.ts` become Bridge-backed, sync, no TLA).
- **Runtime actions** where the call is already async and hook-free semantics are trivial:
  header connect/disconnect, rewards `signMessage`/`switchChain`, `useSignInWithWallet`.
- **Islands** for the self-contained route features that lean on many wagmi hooks: contract methods
  tab, L2 claim modals/buttons, revoke page, marketplace iframe bridge, verified-address signature
  step. Each island's fallback = the feature's existing loading/skeleton state.
- **Root**: `Web3Provider` disappears from `_app`; in its place a client-only hydration boundary
  (constraint 7) + the always-mounted Bridge provider (plain context, no chunk).
- **Dynamic connector**: side-tree harvesting, or — if that grills badly — keep today's gating
  behavior *only* when `connectorType === 'dynamic'` as an explicitly-scoped follow-up.
- Migration can land in reviewable slices (see step split) with the old path intact until the last
  slice flips `_app`.

### Loading policy (applies to B and C)

Default **idle after first paint** (same `requestIdleCallback` pattern as subtask 2), plus:
persisted connection → eager (reconnect); marketplace dapp routes and `?action=connect` /
write-tab deep-links → eager at route load; connect click → immediate import + button loading
state → open modal on ready. Idle-load keeps auto-reconnect within ~1–2 s of today; the optimistic
Bridge state covers the visual gap (constraint 5).

## 6. Suggested step split for the sub-spec

1. Quick leaks (independent, could even ship before the rest): `NavigationPromoBanner` keccak,
   lazy viem in `rpc-data-context`/`public-client` consumers. Measure M6 delta.
2. Bridge + Runtime modules with unit tests (optimistic localStorage read, watcher wiring, queue
   of pre-ready `open()` intents, load-failure degradation).
3. Header/ad-banner/rewards to Bridge + Runtime; delete TLA hubs. (After this step the reown path
   no longer needs the root provider for boot; `_app` flip still pending.)
4. Islands for contract methods, L2 claims, revoke, marketplace bridge, signature flows; route
   eager-load list.
5. Flip `_app`: remove `Web3Provider`, add hydration boundary + Bridge provider; chunk-failure UX.
6. Dynamic-connector story (side tree or scoped deferral).
7. A/B measurement per the task protocol; fill the "After 4" row.

## 7. Open questions for the grilling session

1. Dynamic connector: side-tree harvesting now, or scoped follow-up (keep gating for dynamic-mode
   instances temporarily)? How many production instances run `dynamic`?
2. Loading default: is idle-load acceptable for auto-reconnect timing, or should a persisted
   connection always load eagerly (recommended) — and is ~1 s later reconnect acceptable at all?
3. Optimistic button state: is "address shown, reconnecting style" from localStorage acceptable
   before confirmation (vs. plain Connect button until confirmed)?
4. Does the `wagmi.store` optimistic read need to handle the AppKit social/email login case
   (accounts not in wagmi store)? (Verify what AppKit persists on wagmi 2.19.5 / appkit 1.7.20.)
5. Contract *read* tab currently works with wallet disabled via the fallback `WagmiProvider` — in
   the new world reads go through the island too (runtime loads on contract routes). Confirm that
   loading the wallet runtime on contract pages regardless of connection is acceptable (it is
   today's behavior — the provider chunk loads everywhere — but now it's a choice).
6. Scope check: `get-checked-summed-address.ts` (address route viem leak) — fold into step 1 or
   leave out of this task?
7. `NavigationPromoBanner` hash: replace keccak with a cheap non-crypto hash (localStorage key
   compat break — old dismissals reset once) or lazy-import viem (keeps keys stable)?

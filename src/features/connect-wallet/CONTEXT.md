# Connect-wallet — context

Non-obvious patterns for the `connect-wallet` feature.

## Deferred wallet loading

**Why.** The wallet stack (wagmi + viem + the reown/AppKit modal) is one of the
heaviest dependency graphs in the app, yet almost nothing needs it at first
paint — only a few boot-time consumers (header button, ad banner, ENS lookup)
show any wallet state, and only for a connected user. So the whole stack is kept
off the critical path and loaded lazily.

**Why not the obvious way.** The hard part is that those boot-time consumers
render *before* any wagmi provider exists, where wagmi's own hooks throw. An
earlier iteration solved that by reproducing wagmi/reown's persistence and
reconnection logic by hand so it could show account state without a provider.
That coupled the feature to library internals (storage format, reconnect timing,
connector-registration order) and was a steady source of subtle bugs and upgrade
risk. The current design deliberately inverts it: **wagmi owns hydration and
reconnection; we only control *when* its provider mounts.**

**How.**

- Boot-time consumers read account state from a tiny always-present store — the
  *Bridge* (`utils/bridge.ts`) — never from wagmi hooks. The Bridge holds no
  wallet logic; it is only the hand-off point between the lazy stack and the
  code that renders early.
- The real wagmi provider loads lazily and mounts as a **sibling** of the app,
  not a wrapper (`context.tsx` → `components/Web3ProviderInner.tsx`). A wrapper
  mounted late would remount the whole app and flush its state (e.g. an
  email-authenticated session); a sibling does not. Its only job is to mirror
  wagmi's confirmed account back into the Bridge.
- Features that genuinely need wagmi hooks (contract read/write, L2 claims,
  revoke, the marketplace dapp bridge) are wrapped in *islands*
  (`components/Web3Boundary.tsx`) that publish the loaded config over just their
  own subtree.
- The stack loads eagerly for a returning user, otherwise on the first wallet
  interaction or when a wallet-dependent route mounts.

**The invariant that keeps this working:** nothing reachable from first paint may
*statically* import `wagmi` / `viem` / `@reown/*`. Those imports live only behind
the lazy loader (`utils/runtime.ts`) and the sibling/island components. Break it
and the deferral silently regresses — the bundle is the only place it surfaces,
so this is not caught by tests.

Keep the `useWallet` / `useAccount` hubs off any post-paint suspend: a suspend
into a root boundary after first paint stops every mounted zag presence machine,
and a tab switched in that window keeps the old panel visible (#3788).

## Persisted connection

Connection state is persisted in our **own** localStorage flag, not wagmi's
internal store, so a wagmi/reown upgrade cannot silently break the
returning-user experience (optimistic address + auto-reconnect). A one-time
migration seeds that flag from wagmi's store for users who last connected before
it existed; it is the only code that reads wagmi's internal storage and is safe
to delete once it has aged out.

# 02 — Multi-provider buffer queue and provider interface

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 02 of #3754 |
| Blocked by | T01 |

## What to build

The buffering queue moves from the Mixpanel module into the facade and learns to fan out to any number of
providers behind one `AnalyticsProvider` interface. One idle-deferred init loads every enabled provider's
SDK chunk, runs its setup (super-properties, identify, person-profile writes), then replays the buffer into
each; a provider whose init throws is disabled on its own for this page load while the others keep
working. `src/services/mixpanel` shrinks to a thin provider implementing the interface. At runtime nothing
observable changes — Mixpanel is still the only provider — but the facade is ready for a second one, and
an ESLint rule guarantees no call site reaches for a vendor module again.

## Acceptance criteria

- [ ] `src/shared/analytics/provider.ts` declares `AnalyticsProvider`: `init(options: ProviderInitOptions): Promise<void>`
      (loads the SDK chunk and configures it) plus synchronous `track(event, properties, { timestamp? })`,
      `register(superProps)`, `identify(distinctId)`, `peopleSet(props)`, `peopleSetOnce(props)`,
      `reset()`. `ProviderInitOptions` carries `debug: boolean`.
- [ ] `src/shared/analytics/queue.ts` owns the buffer (`MAX_QUEUE_LENGTH` cap as today), one shared
      `initPromise`, the set of live providers, and `flushQueue` that replays into each live provider;
      a `track` replay passes the original `timestamp` and the provider decides how to backdate
      (Mixpanel: `time` in epoch seconds).
- [ ] FR3 enable matrix holds: Mixpanel plus a stub provider both receive every call; with only one
      enabled only it receives calls; with none enabled nothing is buffered or sent.
- [ ] FR7 holds: a provider whose `init` rejects is dropped silently (no throw, no console error) and
      the buffer is still replayed into the remaining providers; if every provider fails, the buffer is
      discarded and `useInit` stays `false`.
- [ ] `useInit` builds the provider list from `config.services.*` presence, runs the common setup
      (super-props / identify / people writes — same values and order as today) through the interface,
      and sets the debug cookie exactly as today.
- [ ] `src/services/mixpanel/` contains only `config.ts` and `provider.ts`; the provider wraps
      `mixpanel-browser` with no buffering logic of its own.
- [ ] ESLint `no-restricted-imports` forbids `mixpanel-browser`, `posthog-js`, `src/services/mixpanel/**`
      and `src/services/posthog/**` everywhere except `src/shared/analytics/**`, `src/services/mixpanel/**`,
      `src/services/posthog/**`, `src/config/**`, `src/server/csp/**` and `*.spec.*`; the message points
      to `src/shared/analytics`.
- [ ] `src/shared/analytics/queue.spec.ts` (moved from the Mixpanel module) covers buffer-then-flush
      ordering after setup, replay backdating, the cap, the enable matrix, per-provider failure
      isolation and a reset buffered during the deferral window — against two fake providers, with no
      `mixpanel-browser` mock.
- [ ] `useSwapWallet.spec.tsx`, `useMarketplaceWalletActivity.spec.tsx` and `HeaderAlert.spec.tsx` drive
      init through the facade's public path (`queue.init(...)` or `useInit`) and pass.
- [ ] `pnpm lint:eslint`, `pnpm lint:tsc`, `pnpm test:vitest`, `pnpm test:code-complexity` pass.

## Details

Keep the current queue contract (`MAX_QUEUE_LENGTH`, idempotent `init`, never rejects, flush only after
setup) — this ticket changes the fan-out, not the contract. Suggested shape:

```ts
// src/shared/analytics/queue.ts
init(
  providers: Array<{ provider: AnalyticsProvider; options: ProviderInitOptions }>,
  setup: (provider: AnalyticsProvider) => void,
): Promise<boolean>
```

`Promise.allSettled` over the provider inits; fulfilled ones become live, rejected ones are dropped;
`setup` runs per live provider (it is the register / identify / people block from today's
`useMixpanelInit`). The `src/config` convention (only `config.ts` reads envs, only `src/config` exposes
them) is untouched: `config.services.mixpanel` keeps its shape.

## Leaf worklist

- [ ] 1 `[agent]` Define `AnalyticsProvider` / `ProviderInitOptions` in `src/shared/analytics/provider.ts`
- [ ] 2 `[agent]` Move the queue into `src/shared/analytics/queue.ts` and generalise it to N providers with per-provider failure isolation
- [ ] 3 `[agent]` Reduce `src/services/mixpanel/` to `config.ts` + `provider.ts`; rewire `useInit` to build the provider list and run the common setup through the interface
- [ ] 4 `[agent]` Rewrite `queue.spec.ts` against fake providers (enable matrix, FR7, backdating, cap, reset-in-window); update the three external specs
- [ ] 5 `[agent]` Add the ESLint `no-restricted-imports` vendor rule with the allowed-folder exceptions; run lint, tsc, vitest, complexity gate

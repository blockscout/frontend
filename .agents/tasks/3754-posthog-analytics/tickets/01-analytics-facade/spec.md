# 01 — Extract the provider-neutral analytics facade

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 01 of #3754 |
| Blocked by | none |

## What to build

A prefactor: the app's analytics API moves out of the Mixpanel module into a vendor-neutral facade at
`src/shared/analytics/`, and every call site is pointed at it. Nothing changes for an operator or a
Mixpanel dashboard — same events, same properties, same identity — except the dev-only debug switch,
which is renamed from `_mixpanel_debug` to `_analytics_debug` (query param and cookie, no alias). After
this ticket, `src/services/mixpanel` is imported from exactly one place (the facade), which is what
makes the next ticket's queue generalisation a local change.

## Acceptance criteria

- [ ] `src/shared/analytics/index.ts` exports `logEvent`, `EventTypes`, `EventPayload`, `userProfile`
      (`set`, `setOnce` only — `increment` is dropped together with its `PickByType` typing), `reset`,
      `useInit`, `useLogPageView`, `getPageType`, `PAGE_TYPE_DICT`.
- [ ] `src/services/mixpanel` and `mixpanel-browser` are imported only from `src/shared/analytics/` and
      from inside `src/services/mixpanel/` itself (spec files may still mock them). Verify with
      `grep -rl "services/mixpanel\|mixpanel-browser" src`.
- [ ] Every former `mixpanel.<x>` usage reads `analytics.<x>` with no other change at the call site;
      `EventTypes`, `EventPayload` and `PAGE_TYPE_DICT` keep their current values verbatim.
- [ ] `src/server/PageNextJs.ts` calls the facade's `useInit` / `useLogPageView`;
      `src/services/growthbook/init.ts` logs `EXPERIMENT_STARTED` through the facade.
- [ ] `cookies.NAMES.MIXPANEL_DEBUG` is renamed `ANALYTICS_DEBUG` with value `_analytics_debug` and stays
      in `PRIVATE_MODE_DISALLOWED`; the query param read in `useInit` is `_analytics_debug`; no
      `_mixpanel_debug` / `MIXPANEL_DEBUG` string remains in the repo (docs included).
- [ ] The spec files that reached into the Mixpanel module are updated and pass: `useWalletReown.spec.ts`
      (mocks `src/shared/analytics`), `useSwapWallet.spec.tsx` and `useMarketplaceWalletActivity.spec.tsx`
      (still import `init` from `src/services/mixpanel/queue`), `HeaderAlert.spec.tsx` (facade `useInit`).
- [ ] `pnpm lint:eslint`, `pnpm lint:tsc`, `pnpm test:vitest`, `pnpm test:code-complexity` pass.

## Details

File moves (`git mv`, one each):

| From `src/services/mixpanel/` | To `src/shared/analytics/` |
| --- | --- |
| `utils.ts` (EventTypes, EventPayload) | `events.ts` |
| `get-page-type.ts`, `get-tab-name.ts` | same names |
| `log-event.ts`, `reset.ts`, `user-profile.ts`, `useLogPageView.ts` | same names |
| `useMixpanelInit.ts` | `useInit.ts` |
| `index.ts` | `index.ts` |

`queue.ts` + `queue.spec.ts` and `config.ts` **stay** in `src/services/mixpanel/` in this ticket; the facade
imports `queue` directly for now. T02 replaces the queue — do not generalise it here. `logEvent`'s
Mixpanel-typed `optionsOrCallback` / `callback` params are dropped from the facade signature once
ast-grep confirms no call site passes them.

Call-site migration with ast-grep, one pass:

```
ast-grep -p "import * as mixpanel from 'src/services/mixpanel'" --rewrite "import * as analytics from 'src/shared/analytics'" -l ts,tsx src
ast-grep -p "mixpanel.\$X" --rewrite "analytics.\$X" -l ts,tsx <files touched by the first pass>
```

Then the three `import type * as mixpanel …` and two named `EventTypes, EventPayload` imports by hand.
`src/features/rewards/components/login/RewardsLoginModal.tsx` has an unrelated `MIXPANEL_CONFIG` constant
(a Merits widget prop) — leave it alone.

Docs: `docs/ENVS.md` and any `CONTEXT.md` mentioning `_mixpanel_debug` get the new name. If
`.agents/GLOSSARY.md` needs an "analytics facade" entry, run `update-glossary`; otherwise skip.

## Leaf worklist

- [x] 1 `[agent]` Move the public API files into `src/shared/analytics/` (table above), fix internal imports, add `index.ts`; drop `userProfile.increment` and `peopleIncrement`
- [x] 2 `[agent]` Rename the debug switch (`cookies.NAMES.ANALYTICS_DEBUG` = `_analytics_debug`, query param in `useInit`); grep the repo for leftovers
- [x] 3 `[agent]` Migrate all call sites to the facade with `ast-grep` (incl. `PageNextJs.ts`, `growthbook/init.ts`); fix type-only and named imports by hand
- [x] 4 `[agent]` Update the four external spec files; run lint, tsc, vitest, complexity gate

# 07 — Release the refresh holds and settle the wallet stack's advisories

<!-- cspell:ignore cxfr mrhx fpjm -->

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 07 of #3907 |
| Blocked by | none |

## What to build

The next lockfile maintenance passes without the two holds ticket 06 needed, and the wallet stack's
high-severity advisories are settled. The `d3` and `ws` pins stop fighting the refresh. `query-string`,
which `@walletconnect/utils` declares but never imports, leaves the tree and takes the vulnerable
`decode-uri-component` with it. The `zod` advisory, which has no fix its parents can take, is accepted
with its reason, both in the audit's ignore setting and on GitHub. Stale security floors are dropped.

The `@opentelemetry/propagator-jaeger` advisory is ticket 10's.

## Acceptance criteria

How to verify: `pnpm prod:preset staging`, connect a real wallet and open the WalletConnect QR code

- [ ] `d3-selection` and `d3-transition` are caret ranges at the floor `d3` asks for, and `d3` resolves to
      its newest 7.x with one copy of each.
- [ ] The `ws` floor applies only under `viem`. The root's `ws` keeps its exact pin.
- [ ] The `axios` floor is gone, and no `axios` below it is in the lockfile.
- [ ] `query-string` and `decode-uri-component` are gone from the lockfile, through an override that
      removes `query-string` from `@walletconnect/utils` and names that parent. If that cannot be done
      (Details), the advisory gets an ignore entry instead.
- [ ] pnpm's audit ignore setting holds one entry per accepted advisory, with its reason on the same line.
      GHSA-mrhx-c7xc-m3w5 (`zod`) is one of them.
- [ ] No `@reown/appkit-wallet` or `@coinbase/cdp-sdk` code is in the server output of the production
      build.
- [ ] Every security floor left names its parent and is a range (FR19); the removal entry names its parent.
- [ ] `pnpm audit --prod --audit-level high` reports no advisory other than GHSA-45rx-2jwx-cxfr, and not
      that one either once ticket 10 has landed.
- [ ] `pnpm install --frozen-lockfile` succeeds and the `@lifi/widget-light` patch still applies.
- [ ] `pnpm lint:tsc`, `pnpm test:vitest`, `pnpm lint:license:check` and `pnpm test:smoke` pass locally.
- [ ] A full re-resolve, run the way ticket 06 ran it, needs no hold: one copy each of `d3-selection` and
      `d3-transition`, the root's `ws` still at its pin, and `pnpm test:smoke` and
      `pnpm lint:license:check` green. The result is in `notes.md`; the re-resolved lockfile is not
      committed.
- [ ] `(human)` Each accepted advisory's alert is dismissed on GitHub as `tolerable_risk`, with the same
      reason as its ignore entry.
- [ ] `(human)` A real wallet connects on the build, and the WalletConnect QR code renders.

## Details

**The holds.** `../06-lockfile-refresh/notes.md` ("Held back") says why each broke the refresh. The root
pins `d3-selection` and `d3-transition` exactly only because the move to pnpm needed them declared, since
`SankeyChartLink` imports both. A range at `d3`'s own floor keeps one shared copy on every refresh. For
`ws`, every requester below the floor is a `viem` version that pins 8.18.x, and the `^7` requesters
resolve to a patched 7.x. A floor scoped to `viem` leaves the root's devDependency outside the override,
which is what broke `license-report`.

**Override review.** The `axios` floor's parent, `@coinbase/cdp-sdk`, no longer pins a vulnerable version.
`handlebars` and `js-yaml` stay: their parents still pin below the floor. `protobufjs` is ticket 10's.

**`decode-uri-component` (GHSA-qr28-fpjm-wq7f).** Its only parent is `query-string` 7.1.3, which
`@walletconnect/utils` 2.21.0, 2.21.1 and 2.21.7 pin. Utils dropped it at 2.21.9 as unused
(WalletConnect/walletconnect-monorepo#6855). The patched 0.5.x is ESM-only and `query-string` 7 loads it
with `require()`, so a floor override would break it. Bumping the parent means `wagmi` 3,
`@wagmi/connectors` 8 and `@reown/appkit` 1.8.9 or later, with the `@lifi/widget-light` patch rewritten: a
task of its own.

**Removing `query-string`.** Two checks come first:

1. On a fresh install, search every installed `@walletconnect/utils` 2.21.x build for an import of
   `query-string`.
2. Confirm in the pnpm 12 docs that an override value of `-` removes a dependency.

If either fails, fall back: an ignore entry and a GitHub dismissal, with the reason the search supports.
The comment over the security floors in `pnpm-workspace.yaml` asks for ranges; adjust it so a removal
entry fits. FR19 is about version floors.

**`zod` (GHSA-mrhx-c7xc-m3w5).** No 3.x release is patched, and the maintainer publishes no more. At
their latest versions, `@reown/appkit-wallet` pins `3.22.4` and `@coinbase/cdp-sdk` asks for `^3.25.76`.
An override to `zod` 4 breaks `appkit-wallet` at runtime (reown-com/appkit#5830). It is reached from
`wagmi`, `@reown/appkit`, `@reown/appkit-adapter-wagmi`, `@lifi/widget-light`, `@nouns/sdk` and
`@multisender.app/multisender-react-widget`. The reason, to fit on one line: no `zod` 3 fix; both parents
hold 3.x at their latest; the wallet code runs only in the browser; drop the entry when
reown-com/appkit#5830 or #5844, or coinbase/cdp-sdk#867, ships.

**Browser only.** The `zod` reason rests on the wallet stack running only in the browser
(`src/features/connect-wallet/CONTEXT.md`). The server-output check confirms it for this build.

**The ignore setting.** It is pnpm's own. Since pnpm 11, the settings this repo uses are read from
`pnpm-workspace.yaml`, not `package.json`; check the pnpm 12 docs for its name and shape there. Write
each entry the way the security overrides are written: the value, then a comment that says why. Ticket
08's audit step reads it.

**After the commit.** CI runs only on a pushed commit, so it does not gate this ticket; the local checks
cover what the dependency checks run. Once the ticket is committed, the agent pushes and watches the
dependency checks and the regular checks with `gh`. A red run is fixed in a follow-up commit. A visual
diff goes to the developer, who accepts it only when a bumped package explains it.

**What cannot be checked here.** FR17 counts the open Dependabot alerts on `main`. Ticket 06's refresh
and this ticket clear them only when the branch merges. The task pull request's test plan carries "after
the merge: no open high or critical runtime alert". A dismissal persists, so accepted alerts are
dismissed now.

## Leaf worklist

- [ ] 1 `[agent]` Release the `d3` and `ws` holds and drop the `axios` floor
- [ ] 2 `[agent]` Remove `query-string` from `@walletconnect/utils`, or fall back to an ignore entry
- [ ] 3 `[agent]` Add the audit ignore setting with the `zod` entry, and check the server output for the
      wallet stack
- [ ] 4 `[agent]` Run the throwaway full re-resolve and record the result in `notes.md`
- [ ] 5 `[human]` Dismiss the accepted advisories' alerts on GitHub with the same reasons
- [ ] 6 `[human]` Connect a real wallet on `pnpm prod:preset staging` and open the WalletConnect QR code

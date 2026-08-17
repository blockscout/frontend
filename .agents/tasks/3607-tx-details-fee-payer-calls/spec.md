# Display fee payer and calls on the transaction details page

| | |
| --- | --- |
| Issue | https://github.com/blockscout/frontend/issues/3607 |
| Status | `done` |
| Size | `small` |
| Feature branch | `issue-3607` |
| PM | Ulyana |
| Designer | — |
| Backend | Victor (issue author); v11.2.4+ |
| Slack channel | — (default routing per `to-spec`) |

## Context & goal

Eden is an `ev-reth` / evstack rollup that adds a custom EIP-2718 transaction type `0x76` (decimal `118`):
a **sponsored batch transaction**. An *executor* submits an ordered batch of calls, and a separate *sponsor*
signs for and pays the fee. The backend now indexes those transactions and exposes two new optional fields
on the transaction model ([blockscout#14590](https://github.com/blockscout/blockscout/issues/14590),
implemented in [blockscout#14643](https://github.com/blockscout/blockscout/pull/14643)): `fee_payer` and
`calls`.

Neither field is rendered today, so an Eden sponsored transaction page silently omits the two things that
distinguish it — who actually paid, and what the batch executed. The goal is to display both on `/tx/:hash`,
and to omit them cleanly on every other chain (where they are absent from the response entirely).

## Functional requirements

1. When `fee_payer` is present, the transaction details page shows a **Fee payer** row with the address.
   Hint copy: `Address that paid the transaction fee on behalf of the sender`.
2. When `calls` is present and non-empty, the page shows a **Calls** row with a table of the batched calls
   in API order. Hint copy: `Ordered list of calls batched into this sponsored transaction`.
3. The Calls table has three columns — `To`, `Value`, `Input`:
   - `To` — `AddressEntity` with `truncation="dynamic"`. When `to` is `null` the cell reads
     `[ Contract creation ]` (the same string [`TxDetails.tsx:395`](../../../src/slices/tx/pages/details/info/TxDetails.tsx)
     already uses). `to` being null is a real case, confirmed by the backend owner (**Q3**).
   - `Value` — `NativeCoinValue` with symbol, no exchange-rate toggle.
   - `Input` — `TruncatedText` + `CopyToClipboard`, matching the `Data` cell of
     [`LogDecodedInputDataTable`](../../../src/slices/log/components/LogDecodedInputDataTable.tsx).
4. Both rows render inside the collapsible *View details* section, immediately after **Other** and before
   **Raw input** — so the batched calls sit next to the raw/decoded input data that shares their visual
   language. No `DetailedInfo.ItemDivider` around the block (`Other`, `Raw input` and `Decoded input data`
   have none between them either).
5. Neither field is gated by an env var or a feature config. They are rendered on **field presence**,
   the established pattern for chain-variant transaction fields: `execution_node` / `allowed_peekers` at
   [`TxDetails.tsx:308`](../../../src/slices/tx/pages/details/info/TxDetails.tsx) do the same, even though
   SUAVE has an `NEXT_PUBLIC_IS_SUAVE_CHAIN` flag for its nav and pages. `do_with_chain_type_fields` only
   extends the response for `:eden`, so presence is a sufficient and self-maintaining gate.
6. A **Sponsored** tag appears in the transaction details page header when `transaction_types` includes
   `sponsored_transaction`, alongside the other header tags. Transaction **lists** get no badge for it
   (**Q1**) — there is no room. `sponsored_transaction` is still added to `TYPES_ORDER`, last and with no
   label of its own: absent from that list, `indexOf` returns `-1` and sorts it ahead of every real type,
   making a sponsored contract call read as the generic "Transaction" instead of "Contract call".

## Data & API

**Endpoint** — `GET /api/v2/transactions/{hash}` (existing `core:tx` resource; no new API resource needed).

**Readiness** — merged to backend `master` on 2026-07-31 and already deployed on
`eden-testnet.blockscout.com` (`backend_version: v11.2.4.+commit.ac947295`). Ships in backend tag **11.2.4**
(Q3) — worth naming in the frontend release notes.

**Field shapes** — read from
[`schemas/api/v2/transaction.ex`](https://github.com/blockscout/blockscout/pull/14643/files) and verified
against a live response:

- `fee_payer` — a full `Address` object, `nullable: true`.
- `calls` — `Array<{ to: AddressHashNullable; value: IntegerString; input: HexString }>`, `nullable: true`.
- `required: [:fee_payer, :calls]` means the keys are always present on an Eden response, not that the
  values are non-null.

Sample (`0x35310fd76c45f1441226c102f4dc1070b41ac66cb1e6ed3354da78aa69824a67` on `eden-testnet`):

```json
{
  "type": 118,
  "transaction_types": [ "sponsored_transaction" ],
  "fee_payer": { "hash": "0x32648e6529BfCacE20422a7AA1E7fB7Bd8F408d7", "is_contract": false, "…": "…" },
  "calls": [ { "to": "0xf97cDCF1e5C0955Ed5c2EA0afb2c4Bb4eD506505", "value": "0", "input": "0x" } ]
}
```

The call's `to` is `null` on a contract creation — confirmed by the backend owner (**Q3**), not defensive
typing.

**Scope of each field across endpoints** — `calls` is rendered for single-transaction responses only
(`prepare_calls` returns `nil` otherwise, the same policy the backend applies to token transfers).
`fee_payer` *is* returned on list endpoints too, but showing it there is out of scope.

**Types package** — pinned at `@blockscout/api-types@0.0.1-beta.8e1692a`, published from backend `dev` once
`master` had been merged into it (**Q4**). It carries `eden.schema`, both fields on the transaction, and the
`operations` / `paths` shorthands the app depends on.

Because `merged.schema` marks chain-specific properties **optional**, the fields type as
`Address | null | undefined` and `Array<Call> | null | undefined`. Guards must handle `undefined` as well as
`null`.

**Env vars / feature flags** — none added.

## UI inventory

- **Single surface**: `/tx/:hash` details tab —
  [`src/slices/tx/pages/details/info/TxDetails.tsx`](../../../src/slices/tx/pages/details/info/TxDetails.tsx),
  inside the `CollapsibleDetails` block, between `<TxDetailsOther/>` and the `Raw input` label.
- **New component**: `src/features/chain-variants/eden/pages/tx/TxDetailsEden.tsx` — renders both label/value
  pairs and returns `null` when both fields are absent, so `TxDetails.tsx` composes it unconditionally
  (matching `TxDetailsSetMaxGasLimit` and `TxDetailsWithdrawalStatusArbitrum`, already there doing the same).
  Eden-specific UI is a **feature**, not a slice — it cannot exist on a vanilla EVM chain — and
  [`TxDetails.tsx:83`](../../../src/slices/tx/pages/details/info/TxDetails.tsx) carries a standing
  `// REFACTOR: Put feature related parts under the feature folder` note. No `config.ts` in the feature
  folder: only chain variants needing an env flag have one (stability and zilliqa have none).
- **No Figma mockups** — none linked on the issue, and none needed. The Calls table reuses the styles of
  [`LogDecodedInputDataTable`](../../../src/slices/log/components/LogDecodedInputDataTable.tsx): background
  `{ _light: 'blackAlpha.50', _dark: 'whiteAlpha.50' }`, `p={4}`, `mt={2}`, `columnGap`/`rowGap={5}`,
  `textStyle="sm"`, and header cells at `fontWeight={600} pb={1}`. One deliberate difference: **all four
  corners are rounded** (`borderRadius="md"`), where the reference rounds only the bottom two because
  `LogDecodedInputDataHeader` sits above it. Column template is `repeat(3, minmax(0, 1fr))` — equal widths
  to start, tuned during verification (leaf 4).
- **Also affected by leaf 5**: the page header tags in
  [`Transaction.tsx`](../../../src/slices/tx/pages/details/Transaction.tsx), and
  [`TxType`](../../../src/slices/tx/components/TxType.tsx), which renders in the txs list, the home page
  latest-transactions widget, and the address transactions tab.
- No new routes, navigation entries, or cross-links.
- No custom Mixpanel events: the only interactive elements are `AddressEntity` links and `CopyToClipboard`,
  neither tracked elsewhere; there is no new page (view tracking is auto-wired) and no hardcoded external
  link needing UTM params.

## Out of scope

- **Adapting the standard fields whose Eden semantics differ.** On a sponsored transaction the backend
  derives `to` and `raw_input` from **call 0 only**, `value` from the **sum** of all calls, and `from` is
  the *executor* rather than the fee payer. So on a multi-call transaction the "To" and "Raw input" rows
  show one call while the Calls table shows all of them. The backend issue's UI requirements ask to "hide or
  adapt standard fields whose Eden semantics differ" and to "present gas fields only where they are
  meaningful"; #3607 asks for none of it. Raised as **Q2**, not blocking.
- A **Fee payer column in the transactions list**, even though the field is available there.
- The **Eden mainnet** dev preset (`eden.blockscout.com`) — it has no sponsored transactions to look at.
- A **Playwright visual scenario and transaction mock**. Dropped deliberately: the two rows use generic
  building blocks already covered elsewhere, and a mock in `src/slices/tx/mocks/details.ts` exists only to
  feed a `*.pw.tsx` scenario, so without one it would be dead code. Verification is against live
  `eden-testnet` data.
- Backend work of any kind — already shipped.

## Task breakdown

- [x] 1 `[agent]` Add `eden` and `sponsored transaction` to `.agents/GLOSSARY.md` — skill: `update-glossary`
  - done: `Eden` (chain) and `Sponsored Transaction` (entity) rows, cross-referencing each other
  - inputs:
    - `eden` — the chain type (`CHAIN_TYPE=eden`): an `ev-reth` / evstack rollup, explorers at
      `eden.blockscout.com` and `eden-testnet.blockscout.com`
    - `sponsored transaction` — scoped to Eden: EIP-2718 type `0x76` (decimal `118`); an executor submits an
      ordered batch of calls and a separate sponsor signs for and pays the fee
    - Also gets `eden` past cSpell, which has no entry for it today
- [x] 2 `[agent]` Add the `eden_testnet` dev-server preset
  - done: `tools/dev-server/registry.json` + `pnpm presets:sync` (`deploy-review.yml`, `.vscode/tasks.json`)
  - inputs:
    - `"eden_testnet": "https://eden-testnet.blockscout.com"` in `tools/dev-server/registry.json`
    - then `pnpm presets:sync` — regenerates the marker-bracketed alias lists in
      `.github/workflows/deploy-review.yml` and `.vscode/tasks.json`; CI fails on drift
    - Ordered before the UI leaves so their verification has a preset to run against
- [x] 3 `[agent]` Get `fee_payer` / `calls` into the pinned API types
  - inputs:
    - First check whether `@blockscout/api-types@0.0.1-beta.bb45bf1` already contains them; if so just bump
      the pin in `package.json`
    - Otherwise publish a beta from backend `master` via the `publish-beta-types` skill and pin that
    - Verify afterwards that `schemas['TransactionResponse']` exposes `fee_payer` and `calls`, and that
      `transaction_types` includes `sponsored_transaction`
  - done: pinned `0.0.1-beta.8e1692a`, published from `dev` after `master` was merged into it (**Q4**).
    `schemas['TransactionResponse']` exposes `fee_payer` and `calls`, and `transaction_types` includes
    `sponsored_transaction`; `pnpm lint:tsc` is clean, so the merge cost the app no type churn. The interim
    `eden/types/api.ts` shim is gone — the component reads both fields off the pinned schema.
- [x] 4 `[agent]` `[verify]` Build `TxDetailsEden.tsx` and wire it into the details page — requirements 1–4
  - inputs:
    - New file `src/features/chain-variants/eden/pages/tx/TxDetailsEden.tsx`; no `config.ts`
    - Composed unconditionally in `TxDetails.tsx` after `<TxDetailsOther/>`, before the `Raw input` label
    - Fully styled from the `LogDecodedInputDataTable` reference (see **UI inventory**) — this is a code
      reference, not a mockup, so there is no separate `[human]` style leaf; width and spacing tweaks happen
      during verification
  - verify: `pnpm dev:preset eden_testnet`, open
    `/tx/0x35310fd76c45f1441226c102f4dc1070b41ac66cb1e6ed3354da78aa69824a67`, expand *View details*, confirm
    the Fee payer and Calls rows render correctly between Other and Raw input; adjust styles if needed. Also
    open any non-Eden preset (e.g. `eth`) and confirm neither row appears.
  - implemented: `TxDetailsEden.tsx` in the new `eden` feature folder, composed in
    `TxDetails.tsx`; `dev-eden-testnet` added to `.claude/launch.json`. Functional check done on
    `eden_testnet`: both rows render between Other and Raw input on the sponsored transaction, and both are
    absent on a type-2 one; the table's computed styles match the reference (16px padding, 20px gaps, 12px
    radius, `whiteAlpha.50`, 14px text, three equal columns). Styles reviewed and accepted by the developer
    on 2026-08-04, with the column template tuned to `minmax(140px, 1fr) minmax(50px, 1fr) 1fr`; the designer
    signed them off on the interim demo the same day.
- [x] 5 `[agent]` `[verify]` Show the **Sponsored** tag in the page header — requirement 6
  - inputs:
    - Push a `{ slug: 'sponsored', name: 'Sponsored', tagType: 'custom' }` tag in `Transaction.tsx`, next to
      the `relay_tx` / `init_tx` pushes that already feed `MetadataTags`
    - Add `sponsored_transaction` to `TYPES_ORDER` last, with no `switch` case, so lists keep showing no
      badge for it while the type stops masking more useful labels
  - verify: on `eden_testnet`, open a sponsored transaction and confirm the header tag; check `/txs` still
    labels a sponsored contract call as "Contract call"
  - implemented: the header tag keys off `transaction_types`, so it carries no Eden-specific coupling.
    `TxType.spec.tsx` pins both ordering outcomes. The dev server would not hydrate in the agent's browser
    pane (Next dev's `_clientMiddlewareManifest.js` is served as JSON), so the header tag is verified by
    types and tests only — confirm it visually on the next demo.
- [x] 6 `[agent]` Deploy a demo — skill: `deploy-demo`
  - inputs:
    - Run last, once every other box is checked
  - done: deployed on 2026-08-04 from `2442fb48c` with the `eden_testnet` preset —
    https://review-issue-3607.k8s-dev.blockscout.com — and shared in the Q1/Q2 thread, where the designer
    signed off the styles. It covers leaves 1–4; the developer waived a redeploy for leaf 5, so the
    **Sponsored** header tag is not on the demo.

## Open questions

### Q1 — Should a sponsored transaction get its own badge in the transactions list?

The backend added `sponsored_transaction` to `transaction_types`, and the backend issue's UI requirements
ask for "a tag/badge such as `Sponsored`". #3607 does not mention it. Today the value falls through
`TxType`'s `default` branch to a generic purple "Transaction". If a dedicated badge is wanted: what label,
what colour (`purple` is the fallback's; `green` is unused), and what priority relative to "Contract call" /
"Token transfer" when a transaction is both?

- Owner: PM (Ulyana)
- Status: `resolved`
- Slack: https://blockscout.slack.com/archives/C03MMUTQDNU/p1785778160250149 (reminder with the interim demo
  at https://blockscout.slack.com/archives/C03MMUTQDNU/p1785851465775779)
- Answer: 2026-08-04 — answered by Nikita S. rather than Ulyana: a **Sponsored** tag in the details page
  header, skipped in lists where it would not fit. Tags are in the SoW, but how to render them was left to
  the team.
- Blocks: leaf 5

### Q2 — Should the compatibility fields be adapted on a multi-call sponsored transaction?

`to` and `raw_input` reflect **call 0 only**, `value` is the **sum** across calls, and `from` is the executor
rather than the payer — so those rows can be misread on a batch of more than one call. Should they be
hidden, relabelled, or annotated for Eden, as the backend issue's UI requirements suggest? Shipping narrow
for now.

- Owner: PM (Ulyana)
- Status: `waived`
- Slack: https://blockscout.slack.com/archives/C03MMUTQDNU/p1785778160250149
- Answer: 2026-08-04 — deferred out of this task. Shipping the narrow scope; the team waits for client
  feedback on whether the compatibility fields mislead in practice, and adapts them only if it does.

### Q3 — Which backend release ships the Eden transaction fields?

Needed for the frontend release notes. The PR merged to `master` on 2026-07-31 and `eden-testnet` already
runs it, but no tagged release is identified. Bundled with this: confirmation that the call's address is
nullable for a contract-creation call (read from the backend source, worth hearing from the owner before the
UI relies on it), and — if so — a request to correct #3607, which names the field `address_hash` where the
API and the OpenAPI schema both use **`to`**.

- Owner: Backend (Victor)
- Status: `resolved`
- Slack: https://blockscout.slack.com/archives/D040DB9J5QQ/p1785778264416959
- Answer: 2026-08-03 — backend tag **11.2.4**, planned for release that week. A call's `to` is confirmed
  `null` on a contract creation, and #3607's description was corrected to name the field `to`.

### Q4 — Which backend ref can publish api-types with both the Eden fields and the response shorthands?

`@blockscout/api-types` betas are published from `dev`, which has no `eden` chain type. A beta published from
`master` (`0.0.1-beta.cf4c6f5`) has `eden.schema` plus `fee_payer` / `calls`, but its `index.ts` lacks the
`operations` and `paths` shorthands added by
[blockscout#14515](https://github.com/blockscout/blockscout/pull/14515) — the app imports those in 60+
modules, and pinning that build yields 384 type errors across 227 files. So neither ref serves the frontend.
Can `master` be merged into `dev` (or #14515 forward-ported to `master`) so one ref carries both? Until then
the two fields are declared locally in the `eden` feature.

- Owner: Backend (Victor)
- Status: `resolved`
- Slack: https://blockscout.slack.com/archives/D040DB9J5QQ/p1785780964199699 (compile failure reported at
  https://blockscout.slack.com/archives/D040DB9J5QQ/p1785781999313979, the `HexString` rename at
  https://blockscout.slack.com/archives/D040DB9J5QQ/p1785838420460469)
- Answer: 2026-08-04 — `dev` is the ref, once `master` was merged into it. Two follow-up fixes were needed:
  a compile break the merge left in `read_system_config/2` (`7b60189`), then the Eden call schema still
  naming `General.HexString`, which `dev` had renamed to `General.HexData`
  ([#14656](https://github.com/blockscout/blockscout/pull/14656)). The publish from `8e1692a` then succeeded.
- Blocks: leaf 3

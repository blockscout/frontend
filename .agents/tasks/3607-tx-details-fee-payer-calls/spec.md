# Display fee payer and calls on the transaction details page

| | |
| --- | --- |
| Issue | https://github.com/blockscout/frontend/issues/3607 |
| Status | `draft` |
| Size | `small` |
| Feature branch | `issue-3607` (set on first `implement-task` run) |
| PM | Ulyana |
| Designer | — |
| Backend | Victor (issue author) |
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
     already uses). `to` being null is a real case, not defensive typing — the backend's `EdenView` comment
     states it is `nil` for a contract-creation call.
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
6. `TxType` gains handling for the new `sponsored_transaction` member of `transaction_types` — see **Q1**
   for the label decision. Independently of that decision, the member must be added to `TYPES_ORDER`:
   it is absent today, so `indexOf` returns `-1`, sorting it ahead of every real type and making a
   sponsored contract call badge as the generic "Transaction" instead of "Contract call".

## Data & API

**Endpoint** — `GET /api/v2/transactions/{hash}` (existing `core:tx` resource; no new API resource needed).

**Readiness** — merged to backend `master` on 2026-07-31 and already deployed on
`eden-testnet.blockscout.com` (`backend_version: v11.2.4.+commit.ac947295`). Which tagged release ships it
is **Q3**.

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

> The issue text names the call's address field `address_hash`. The API returns **`to`** — see **Q3**.

**Scope of each field across endpoints** — `calls` is rendered for single-transaction responses only
(`prepare_calls` returns `nil` otherwise, the same policy the backend applies to token transfers).
`fee_payer` *is* returned on list endpoints too, but showing it there is out of scope.

**Types package** — the pinned `@blockscout/api-types@0.0.1-beta.82839e44ce` (published 2026-07-02)
predates the backend PR, so it has neither `eden.schema` nor the two fields in `merged.schema`. The newest
published beta, `0.0.1-beta.bb45bf1`, was published 2026-07-31 06:37Z — before the PR merged at 11:55Z — so
it very likely lacks them as well. See leaf 3.

Because `merged.schema` marks chain-specific properties **optional**, the fields type as
`Address | null | undefined` and `Array<Call> | null | undefined`. Guards must handle `undefined` as well
as `null`.

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
- **Also affected by leaf 5**: [`TxType`](../../../src/slices/tx/components/TxType.tsx), which renders in
  the txs list, the home page latest-transactions widget, and the address transactions tab.
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

- [ ] 1 `[agent]` Add `eden` and `sponsored transaction` to `.agents/GLOSSARY.md` — skill: `update-glossary`
  - inputs:
    - `eden` — the chain type (`CHAIN_TYPE=eden`): an `ev-reth` / evstack rollup, explorers at
      `eden.blockscout.com` and `eden-testnet.blockscout.com`
    - `sponsored transaction` — scoped to Eden: EIP-2718 type `0x76` (decimal `118`); an executor submits an
      ordered batch of calls and a separate sponsor signs for and pays the fee
    - Also gets `eden` past cSpell, which has no entry for it today
- [ ] 2 `[agent]` Add the `eden_testnet` dev-server preset
  - inputs:
    - `"eden_testnet": "https://eden-testnet.blockscout.com"` in `tools/dev-server/registry.json`
    - then `pnpm presets:sync` — regenerates the marker-bracketed alias lists in
      `.github/workflows/deploy-review.yml` and `.vscode/tasks.json`; CI fails on drift
    - Ordered before the UI leaves so their verification has a preset to run against
- [ ] 3 `[agent]` Get `fee_payer` / `calls` into the pinned API types
  - inputs:
    - First check whether `@blockscout/api-types@0.0.1-beta.bb45bf1` already contains them; if so just bump
      the pin in `package.json`
    - Otherwise publish a beta from backend `master` via the `publish-beta-types` skill and pin that
    - Verify afterwards that `schemas['TransactionResponse']` exposes `fee_payer` and `calls`, and that
      `transaction_types` includes `sponsored_transaction`
- [ ] 4 `[agent]` `[verify]` Build `TxDetailsEden.tsx` and wire it into the details page — requirements 1–4
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
- [ ] 5 `[agent]` `[verify]` Handle `sponsored_transaction` in `TxType` — requirement 6 — questions: Q1
  - inputs:
    - Add `sponsored_transaction` to `TYPES_ORDER` regardless of Q1's outcome, so it stops masking more
      useful labels
    - Label, colour and sort priority per Q1
  - verify: on `eden_testnet`, find a sponsored transaction in `/txs` and confirm its badge
- [ ] 6 `[agent]` Deploy a demo — skill: `deploy-demo`
  - inputs:
    - Run last, once every other box is checked

## Open questions

### Q1 — Should a sponsored transaction get its own badge in the transactions list?

The backend added `sponsored_transaction` to `transaction_types`, and the backend issue's UI requirements
ask for "a tag/badge such as `Sponsored`". #3607 does not mention it. Today the value falls through
`TxType`'s `default` branch to a generic purple "Transaction". If a dedicated badge is wanted: what label,
what colour (`purple` is the fallback's; `green` is unused), and what priority relative to "Contract call" /
"Token transfer" when a transaction is both?

- Owner: PM (Ulyana)
- Status: `pending`
- Slack: https://blockscout.slack.com/archives/C03MMUTQDNU/p1785778160250149
- Answer: <decision + date, once resolved>
- Blocks: leaf 5

### Q2 — Should the compatibility fields be adapted on a multi-call sponsored transaction?

`to` and `raw_input` reflect **call 0 only**, `value` is the **sum** across calls, and `from` is the executor
rather than the payer — so those rows can be misread on a batch of more than one call. Should they be
hidden, relabelled, or annotated for Eden, as the backend issue's UI requirements suggest? Shipping narrow
for now.

- Owner: PM (Ulyana)
- Status: `pending`
- Slack: https://blockscout.slack.com/archives/C03MMUTQDNU/p1785778160250149
- Answer: <decision + date, once resolved>

### Q3 — Which backend release ships the Eden transaction fields?

Needed for the frontend release notes. The PR merged to `master` on 2026-07-31 and `eden-testnet` already
runs it, but no tagged release is identified. Bundled with this: confirmation that the call's address is
nullable for a contract-creation call (read from the backend source, worth hearing from the owner before the
UI relies on it), and — if so — a request to correct #3607, which names the field `address_hash` where the
API and the OpenAPI schema both use **`to`**.

- Owner: Backend (Victor)
- Status: `pending`
- Slack: https://blockscout.slack.com/archives/D040DB9J5QQ/p1785778264416959
- Answer: <decision + date, once resolved>

# UI/UX changes: tx details page ("to" & "value")

| | |
| --- | --- |
| Issue | https://github.com/blockscout/frontend/issues/3661 |
| Feature branch | `issue-3661` |
| PM | Nikita S. |
| Designer | Tatyana |
| Backend | — (no backend changes) |
| Minimum API version | — (required fields already live in production) |
| Slack channel | — (default routing per `grill-the-task`) |

## Context & goal

On the transaction details page, **Eden sponsored (batch) transactions** carry a batch of `calls`, each to
its own recipient. Today the "To" field shows only the single top-level `to` address, hiding the other
recipients, and the "Value" field shows only the summed amount with no pointer to the per-recipient
breakdown that already exists lower on the page (the "Calls" section). This task surfaces the recipients in
"To" and "Value", and — separately — cleans up the "View all" link style used by the token-transfer
detail rows.

## Functional requirements

1. For a sponsored (batch) tx, the **"To"** field renders the list of **unique** recipients taken from
   `calls[]` (de-duplicated by address), **capped at 5 rows**; when there are more, a grey
   **"View all (N)"** link follows the list.
2. Both the "To" **"View all (N)"** link and the "Value" **"N recipients"** link **expand the Details
   section** on the same tab, revealing the "Calls" breakdown (no navigation).
3. When the batch resolves to a **single unique recipient** (every call hits the same address), the "To"
   field keeps its existing single-address rendering — the recipient list appears only when there is more
   than one distinct recipient.
4. In the recipient list, the **first row** (the top-level `to`, which carries metadata) keeps the existing
   rich "To" rendering; **rows 2+** render as bare hash only (identicon + hash + copy), with no
   badges/tags/name/contract flags. (See Q02 — resolved.)
5. The **"Value"** field appends a grey `to` word followed by a blue **"N recipients"** link, e.g.
   `0.002395904453623692 TIA ($2.55) to 2 recipients`.
6. In both places **N = number of unique recipient addresses** — calls are de-duplicated by `to` (keeping
   the first call for each), so repeated addresses count once.
7. The token-transfer detail rows (**Tokens transferred / minted / burnt / created**) drop the leading icon
   before **"View all"** and adopt the updated link style. The link's **show-condition and target are
   unchanged** (shown on `token_transfers_overflow`, links to the Token transfers tab).

## Data & API

- Endpoint: `GET /api/v2/transactions/{hash}` → `TransactionResponse` (resource already declared).
- Fields consumed: `to`, `value`, `calls[]` (`{ to, value, input }`), `token_transfers[]`,
  `token_transfers_overflow`, `transaction_types` (includes `sponsored_transaction`). All verified live on
  `eden-testnet.blockscout.com` — **production-deployed, no backend work**.
- The embedded `token_transfers` array is capped globally (~10 across all types) with a single global
  `token_transfers_overflow` flag — **not per-section**. This is why the mockup's "max 5 per section" cap is
  out of scope (Q01).
- No new `service:name` resource, no new `NEXT_PUBLIC_*` env var. Eden behaviour is gated on the presence of
  `calls` in the response (chain-variant detection), not a feature flag.

## UI inventory

- **Page**: transaction details, **Details tab** — `/tx/[hash]?tab=index`.
  Figma screen `txn_details` node `5940:4556`:
  https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=5940-4556
  - "To" recipient list + "View all" — Figma node `5940:8800` / `5940:8801`.
  - "Value" row — Figma node `5940:7643`.
- **Components touched**:
  - `TxDetails.tsx` (core `tx` slice) — the "Value" row; owns the Details `isExpanded` state.
  - `TxDetailsTo.tsx` (core `tx` slice, `parts/`) — the extracted "To" field and recipient list.
  - `TxDetailsEden.tsx` (`features/chain-variants/eden`) — owns the "Calls" section (unchanged).
  - `TxDetailsTokenTransfers.tsx` (core `tx` slice) — the "View all" restyle.
- **Link mechanism**: the links expand the Details collapsible (`setIsExpanded(true)`), which reveals the
  "Calls" section that always sits below — no in-page anchor or scroll target needed.
- Recipient rows mirror the plain `AddressEntity` used inside the existing Calls grid.

## Implementation decisions

- Changes #1–#2 (To / Value) live in the Eden feature and are composed into `TxDetails` at the slice page
  level; they activate only when `calls` is present and holds more than one unique recipient (per FR-3).
- Recipient count and both link labels derive from the distinct-recipient count (`calls` de-duplicated by
  `to`), computed by a shared `getBatchRecipients` helper in the Eden feature.
- The "To" and "Value" links call an `expandDetailsSection` handler lifted from `TxDetails`
  (`setIsExpanded(true)`), which reveals the "Calls" section rather than navigating or scrolling to it.
- First recipient row reuses the existing rich `to` rendering; subsequent rows are `AddressEntity` fed only
  `{ hash }` — because `calls[].to` is a bare hash string with no metadata in the response.
- Token-transfer restyle: remove the `SpriteIcon name="navigation/tokens"` (the existing
  `FIXME use non-navigation icon`) and apply the mockup's link style; leave the `isOverflow`-driven
  visibility and Token-transfers-tab target intact.
- Max visible recipients is a named constant (5).

## Out of scope

- Any **per-section max-5 cap** on token transfers — needs a backend change to the embedded list/overflow
  contract (Q01). This task only restyles the existing "View all".
- Any **backend / API** change.
- Fetching richer metadata (name, tags, contract/verified/scam flags) for recipient rows 2+ — bare hash per
  Q02 (resolved); revisit only if requirements change.
- The transaction **list** page "To" rendering — this task is the details page only.

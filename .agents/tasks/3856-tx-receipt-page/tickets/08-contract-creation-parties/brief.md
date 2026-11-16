# 08 — Contract-creation parties row (brief)

## Goal

On the receipt of a contract-creation transaction, the parties row joins the creator and the created
contract with `created` instead of `interacted with`. Only the connector changes; the headline stays as it
is.

## Known context

- Source: the 2026-11-16 section of [`../../inbox.md`](../../inbox.md).
- `TxReceiptParties` takes the connector as a prop; `TxReceiptSentenceView` passes `interacted with` for
  every sentence, a contract creation included (its second party falls back to the created contract).
- Not in scope: a contract creation with no interpretation to show (pending, failed, provider `noves` or
  `none`) keeps the native-coin transfer fallback of FR9, joined by `to`.
- Sample: the "Contract creation" transaction in the spec's sample table.

## Blocking unknowns

None. `to-tickets` scopes it against the current code.

# 08 — Contract-creation parties row (brief)

## Goal

On the receipt of a contract-creation transaction that shows an interpretation sentence, the parties row
joins the creator and the created contract with `created` instead of `interacted with`. Only the connector
changes; the headline stays as it is. Covers the last sentence of FR7.

## Known context

- Source: the 2026-11-16 section of [`../../inbox.md`](../../inbox.md).
- **The rule.** `created` replaces `interacted with` and never replaces `to`: it applies in the sentence
  view only, when the transaction has no `to` and has a `created_contract`. The interpretation's action
  type is a free string and takes no part in the decision.
- **Unchanged.** The `Call` fallback, and the transfer view, which always joins with `to` — also for a
  contract creation with no interpretation to show (pending, failed, provider `noves` or `none`) and for
  one whose interpretation is routed into the transfer view.
- `TxReceiptParties` takes the connector as a prop; `TxReceiptSentenceView` passes `interacted with` for
  every sentence, a contract creation included (its second party falls back to the created contract).
- **Verification.** Unit tests on the summary selection: a creation with a sentence → `created`; any other
  sentence → `interacted with`; a creation routed into the transfer view or the fallback → `to`. One
  `(human)` criterion: the "Contract creation" sample transaction of the spec on the `eth` demo. No new
  `TxReceipt.pw.tsx` case and no baseline change: a connector word is not a layout of its own.
- No mockup and no designer question: `created` takes the style of the other connectors.

## Blocking unknowns

None. `to-tickets` scopes it against the current code.

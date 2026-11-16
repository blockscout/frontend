# 08 — Contract-creation parties row

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 08 of #3856 |
| Blocked by | none |

## What to build

On the receipt of a contract-creation transaction that shows an interpretation sentence, the parties row
reads "<creator> created <contract>" instead of "<creator> interacted with <contract>". Only the connector
changes; the headline stays as it is.

`created` replaces `interacted with` and never replaces `to`. It applies in the sentence view only, when
the transaction has no `to` and has a `created_contract`. Everything else stays: `interacted with` for
every other sentence and for the `Call` fallback, and `to` for the transfer view — also for a contract
creation with no interpretation to show (pending, failed, provider `noves` or `none`) and for one whose
interpretation is routed into the transfer view.

Covers the last sentence of FR7.

## Acceptance criteria

How to verify: `pnpm dev:preset eth`, open the receipt of the spec's "Contract creation" sample transaction

- [ ] The connector of a sentence is chosen in the summary selection, as a pure function of the transaction: `created` when it has no `to` and has a `created_contract`, `interacted with` otherwise; the interpretation's action type takes no part
- [ ] Unit tests cover: a contract creation with a sentence → `created`; any other sentence → `interacted with`; a contract creation routed into the transfer view, and one that falls back → `to`
- [ ] No new `TxReceipt.pw.tsx` case and no baseline change
- [ ] `(human)` The sample receipt's parties row reads "<creator> created Storage"; the headline is unchanged

## Details

- `SentenceSummary` carries the connector, set by `getSentenceSummary`; `TxReceiptSentenceView` passes it
  on and `TxReceiptParties` accepts `created` beside its two connectors.
- No mockup: `created` takes the style of the other connectors. A connector word is not a layout of its
  own, hence no visual-test case.

## Leaf worklist

- [ ] 1 `[agent]` Choose the sentence view's connector in the summary selection and pass it to the parties row, with unit tests

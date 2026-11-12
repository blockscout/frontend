# 04 — Interpretation headline

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 04 of #3856 |
| Blocked by | T03 |

## What to build

When the interpretation provider is `blockscout` and `core:tx_interpretation` returns a summary, the
receipt's summary block shows the first summary instead of the fallback:

- an interpretation whose action type is `Transfer` and which carries an amount and a token or the native
  coin is routed into the transfer view of ticket 03, built from the interpretation's variables — the
  template string is ignored; the recipient appears only in the parties row, joined by `to`;
- any other summary shows the full API sentence, no part of the template dropped. A sentence that starts
  with an action type shows it on a line of its own and the rest wraps below, centred; a sentence without
  one simply wraps. The whole sentence is one text style. Tokens, addresses and the market show their
  icons; nothing is a link.

With provider `noves` or `none`, an empty or failed interpretation response, or a pending or failed
transaction, the fallback of ticket 03 stays. The provider setting is read through the multichain context
when there is one, as `TxSubHeading` does, so ticket 05 needs no change here.

Covers FR7 and FR8.

## Acceptance criteria

How to verify: `pnpm dev:preset eth`, open the receipt of the spec's sample transactions: the token
transfer, the swap with a market, the withdraw, the user-operations bundle, and an uninterpreted call

- [ ] The interpretation query is enabled only for provider `blockscout`; it is not the `noves` resource
- [ ] Unit tests cover the headline choice: `Transfer` with amount and token, `Transfer` with the native coin, `Transfer` missing the amount (→ sentence), a sentence with an action type, a sentence without one, an empty summaries list and a failed request (→ fallback)
- [ ] The sentence is rendered through the shared template pipeline and the no-link variable renderer from ticket 01; no anchor in the block
- [ ] Only the first summary is used
- [ ] `TxReceipt.pw.tsx` sits next to the page and covers the card's mutually exclusive looks, each case naming the layout it protects; no case for loading or the redirect
- [ ] `(human)` The API-sentence cards match the mockup at every breakpoint
- [ ] `(human)` The receipt baselines are generated in Docker and match the mockups

## Details

- Visual test of the receipt page, written here because this ticket completes the card. The headline
  views exclude each other, so they are separate cases: the transfer view (success), the `Call` fallback
  (pending: spinner and dashes), and an API sentence packed with an action type, a market and a named
  address (failed status rides on one of them, not a case of its own). One packed case carries `+@mobile`
  and `+@dark-mode`. Mocks go in the slice's and the interpretation feature's existing mocks.

- Mockup deviation: the action type and the connecting words are drawn lighter than the values; the
  sentence is one text style (FR7).
- The action type is a free string, and not every sentence has one — see "Data & API" in the spec for the
  shapes seen.

## Leaf worklist

- [ ] 1 `[agent]` Wire `core:tx_interpretation`; headline selection and the transfer-variables mapping, with unit tests
- [ ] 2 `[agent]` Scaffold the sentence view on the shared interpretation parts
- [ ] 3 `[agent]` Style the API-sentence cards to mockup — [Figma](https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=6299-3955) · [readout](../../design-readout.md#cards-that-follow-the-api-sentence--62993955)
- [ ] 4 `[agent]` Scaffold `TxReceipt.pw.tsx` with its mocks, no baselines
- [ ] 5 `[human]` Generate and eyeball the receipt baselines (`pnpm test:pw --docker … --update-snapshots`)

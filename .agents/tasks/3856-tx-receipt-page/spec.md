# Transaction receipt page

| | |
| --- | --- |
| Issue | https://github.com/blockscout/frontend/issues/3856 |
| Feature branch | `issue-3856` |
| PM | Nikita S. |
| Designer | Tatyana |
| Demo | eth · multichain |

## Context & goal

Wallets and dApps link users to the explorer right after they sign a transaction. The full transaction
page answers that moment badly: the user wants to know what happened, with whom, when and at what cost,
and gets a page of raw fields.

The receipt is a compact, shareable card for a single transaction, on its own URL. Its headline is the
human-readable interpretation of the transaction; the status stays visible so a user can watch a pending
transaction turn into a success; the full transaction page is one click away. Two entry points inside the
explorer lead to it, and exist partly to measure whether users open it at all.

## Functional requirements

**Page**

- FR1. The receipt of a transaction opens at its own URL, in single-chain and in multichain mode.
- FR2. The page shows nothing but the receipt card and the copyright line: no sidebar, header, top bar or
  site footer. It follows the user's color mode, light and dark.
- FR3. The card shows, top to bottom: the chain's logo and the transaction status (a Success or a Failed
  label, a spinner while pending); the summary block; the Date, Time and Tx fee rows; the Chain and Tx hash rows; the actions.
- FR4. The Tx fee row shows the fee in the native coin and its USD value when the rate is known.
- FR5. The time is shown in the format the user chose in the site settings. A pending transaction has no
  date or time yet: both rows show a dash.
- FR6. A pending receipt updates to its final status without a reload, in single-chain and in multichain
  mode.

**Headline**

- FR7. When the chain's interpretation provider is `blockscout` and it returns a summary for the
  transaction, the summary block shows the full interpretation sentence, with no part of the template
  dropped. A sentence that starts with an action type shows it on a line of its own, with the rest wrapping
  below. A sentence without an action type simply wraps. The whole sentence is one text style: neither
  the action type nor the connecting words are set apart.
  Tokens, addresses and the market in the sentence show their icons.
- FR8. A transfer is the exception to FR7: an interpretation whose action type is `Transfer` and which
  carries an amount and a token or the native coin gets a dedicated view, not the API sentence. It shows
  `Transfer`, then the amount with the token's icon and symbol; the recipient appears only in the parties
  row, joined by `to`.
- FR9. When there is no interpretation to show (the provider returned none, the provider is `noves` or
  `none`, the transaction is pending or failed), the summary block shows a fallback and never an
  "unknown" label:
  - the transaction calls a contract → `Call`, then the method as the API returns it (a name or a
    selector), or "Executed a contract call" when the API returns no method; the parties joined by
    `interacted with`;
  - otherwise → the transfer view of FR8, fed with the transaction's own value and the native coin, zero
    included.
- FR10. Every address in the summary block carries an icon: an identicon, or the contract icon for a
  contract.
- FR11. Nothing in the card is a link except the two actions: addresses, tokens, the transaction hash and
  the chain logo are not clickable.

**Actions**

- FR12. `Transaction details` opens the transaction page of the same chain in a new tab.
- FR13. The copy button copies the receipt's absolute URL and turns into a check mark once copied, as the
  explorer's other copy buttons do. No toast.

**Entry points**

- FR14. The "Additional info" dropdown of a transaction row has a `Receipt` link next to "More details",
  wherever that dropdown appears.
- FR15. The transaction details page has a `Receipt` icon button next to the transaction summary line. It
  is shown whether or not the transaction has a tag.
- FR16. Both entry points open the receipt in a new tab, and both exist in multichain mode.

**Errors and sharing**

- FR17. When the transaction request fails for any reason, the receipt URL redirects to the transaction
  page of the same hash and chain, which then shows its own behaviour for that case.
- FR18. A shared receipt link produces a social preview: the title names it a transaction receipt, the
  description is the one the transaction page uses.
- FR19. Opening the receipt is reported to analytics as its own page type. Clicks on `Receipt` at both
  entry points, and on `Transaction details` and the copy button on the receipt, are reported as events.

## Data & API

No new resource and no backend change: everything comes from resources that exist and are deployed in
production.

- `core:tx` — status, timestamp, fee, exchange rate, both parties, value, method.
- `core:tx_interpretation` — the summaries. Only the first summary is the headline.
- No new env var. The headline follows the existing interpretation provider setting, read per chain in
  multichain mode.

Facts the design has to live with, sampled on Ethereum mainnet:

- A pending transaction has no timestamp, and its fee is the maximum fee, not the actual one.
- The interpretation endpoint returns nothing for pending and for failed transactions, and an empty list
  for a contract call it does not recognise.
- The action type is a free string, not an enumeration. Seen: `Transfer`, `Swap`, `Approved`,
  `Committed EIP-4844 blob`.
- Not every sentence has an action type: "Bundler {bundler_hash} submitted {user_ops_count} user
  operations." and "{initiator} Initiated Withdraw of {amount} {token}" start with other words.

Sample transactions for testing, all on Ethereum mainnet (the `eth` demo):

| Case | Transaction |
| --- | --- |
| Token transfer → transfer view (FR8) | https://eth.blockscout.com/tx/0xf3318f56b499149513a9f3969c413e4a75b74f6d007406e0ceaf880fefeec51c |
| Swap with a market → API sentence with an action type (FR7) | https://eth.blockscout.com/tx/0x1ebed606c37e4874eda13461ab38e440d889f49b47137a300c1da9828629b965 |
| Withdraw → API sentence without an action type (FR7) | https://eth.blockscout.com/tx/0x73f0479cdf7cffaa76ce9b3310d0001bc09b8588952e677193c438537128d8fd |
| User operations bundle → API sentence without an action type (FR7) | https://eth.blockscout.com/tx/0x3d8c62ce714d904102d08c44cae3cb24eb37da0fb18b4fa66b350fd9842a96a7 |
| Contract creation → API sentence with an action type (FR7) | https://eth.blockscout.com/tx/0x9d894233af8de75105437bd40ef0c3d23894990bbd8f0d3259350424060581c9 |
| Uninterpreted contract call, method is a selector → `Call` fallback (FR9) | https://eth.blockscout.com/tx/0x24d84c4e9cef2f6de892665425756eddbf05656c921f9aae27749176bebba4bd |
| Uninterpreted, not a contract call, zero value → native-coin transfer fallback (FR9) | https://eth.blockscout.com/tx/0xa45d213907d22c906b8d9920438c39a65d9b6a4b6ee20f10176b583f93bfea19 |
| Failed contract call with a method name → Failed status, `Call` fallback (FR9) | https://eth.blockscout.com/tx/0x36ffe4fbf94d4a62bef8fa0d2eecaaab78863e552a0d847ca8996e7b4b6894a5 |
| Pending at the time of writing → spinner, dashes, native-coin transfer fallback; it may have settled since, then pick a fresh one from the pending list | https://eth.blockscout.com/tx/0x62915a10a4c48f6800fa7be752f756b85dd29fb07ea0d1b15568146d14b2bbb6 |

## UI inventory

**Routes**

- `/tx/[hash]/receipt` — single-chain.
- `/chain/[chain_slug_or_id]/tx/[hash]/receipt` — multichain.

Neither route gets a navigation item.

**Mockups** — Figma section "Final version". Figma wins over the brief.

| Screen / state | Node |
| --- | --- |
| Receipt page, light | https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=6292-224650 |
| Receipt page, dark | https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=6292-225570 |
| Card, transfer view: a token transfer, and the native-coin fallback while pending | https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=6297-3859 |
| Card, `Call` fallback, pending | https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=6297-3202 |
| Cards that follow the API sentence: with and without an action type, with a market, with a named address | https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=6299-3955 |
| Status and address-icon showcase | https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=6282-3275 |
| Entry point, "Additional info" dropdown | https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=6267-4403 |
| Entry point, transaction details page | https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=6267-4363 |

The three card frames above replace the earlier card frames in the same section (the "Transfer
template" and "Other templates" groups), which stay in Figma as history.

Deviations from the mockups, each deliberate:

- The `Receipt` link in the dropdown is drawn gray because it is the secondary link variant, not because
  it is disabled.
- The mockup time reads `+4:00 UTC`; the real format is the user's setting (FR5).
- In the API-sentence cards the action type and the connecting words are drawn lighter than the values.
  That is a slip in the mockup: the sentence is one text style (FR7).

Not in the mockups:

- The `Call` card and the native-coin transfer card in a final status — the pending frames with the
  status and the Date and Time rows filled in.
- Screens narrower than the card — the card adapts to the width; no separate layout.

**Cross-links**

None inside the card: addresses, tokens, the market, the transaction hash and the chain logo are plain
content, not links. The only way out of the receipt is the `Transaction details` action.

## Implementation decisions

- **Bare layout.** No page renders without the app chrome today, so the receipt brings a new layout. It
  keeps the error boundary and the mount gate the other layouts have.
- **Reuse the interpretation renderer's parts, not the component.** The transaction page renders a summary
  as one inline sentence with a leading icon. The receipt breaks the line after a leading action type,
  centers the sentence and uses a different type scale. The template parsing is shared; the variables render without links (FR11).
- **The transfer view is built from the variables, not from the template.** It reads the amount, the
  token or native coin and the recipient out of the interpretation's variables and lays them out itself;
  the template string is ignored. The native-coin fallback (FR9) feeds the same view from the
  transaction's own value and recipient.
- **A new fallback, separate from the existing one.** The transaction page's "{sender} called {method} on
  {receiver}" fallback stays as it is; the receipt has its own two fallbacks (FR9).
- **No RPC fallback.** The transaction page falls back to the RPC node when the API fails; the receipt
  does not, it redirects (FR17). The transaction query is used with that fallback off, keeping its live
  update for pending transactions.
- **Live updates in multichain mode.** The app opens no socket of its own in multichain mode; a multichain
  page that needs one wraps itself in a socket provider pointed at its chain, as `MultichainToken` does.
  The multichain receipt does the same, so one view and one update mechanism serve both modes. The
  multichain transaction page has no such wrapper today and is not changed here.
- **Chain logo per chain.** The network logo component reads the global config; in multichain mode that is
  the multichain explorer's own logo. It takes the chain's config instead, so the receipt shows the logo
  of the transaction's chain. Whether every chain's config carries a logo is unverified; the existing
  placeholder covers a missing one.
- **The details-page button is not an actions-menu item.** That menu collapses into a "more" menu at two
  items and is hidden when the transaction has a tag; the `Receipt` button is its sibling.
- **Rows are a list of independent pieces.** The detail rows are composed so that a later version can
  reorder, hide or brand them per integrator without rewriting the card.
- **Social preview.** The receipt reuses the transaction page's preview description and its data
  fetching for preview bots.

## Out of scope

- Per-chain theming and branded receipts for integrators.
- A cross-chain / bridge headline.
- Interpretation from the `noves` provider.
- A paper-receipt look (jagged edge), and a Block row.
- Any change to the transaction page's own summary or fallback.

# Transaction receipt page

| | |
| --- | --- |
| Issue | https://github.com/blockscout/frontend/issues/3856 |
| Feature branch | `issue-3856` |
| PM | Nikita S. |
| Designer | Tatyana |
| Demo | robinhood · multichain |

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
- FR3. The card shows, top to bottom: the chain's logo and the transaction status (Success, Pending,
  Failed); the summary block; the Date, Time and Tx fee rows; the Chain and Tx hash rows; the actions.
- FR4. The Tx fee row shows the fee in the native coin and its USD value when the rate is known.
- FR5. The time is shown in the format the user chose in the site settings. A pending transaction has no
  date or time yet: both rows show a dash.
- FR6. A pending receipt updates to its final status without a reload, in single-chain and in multichain
  mode.

**Headline**

- FR7. When the chain's interpretation provider is `blockscout` and it returns a summary for the
  transaction, the summary block shows the action type and the full interpretation sentence, with no part
  of the template dropped. Tokens in the sentence show their icons.
- FR8. A transfer is the exception to FR7: an interpretation whose action type is `Transfer` and which
  carries an amount and a token or the native coin gets a dedicated view, not the API sentence. Its
  headline is the amount and the token; the recipient appears only in the parties row, joined by `to`.
- FR9. When there is no interpretation to show (the provider returned none, the provider is `noves` or
  `none`, the transaction is pending or failed), the summary block shows a fallback and never an
  "unknown" label:
  - the transaction calls a contract → action type `Call`, the headline is the method as the API
    returns it (a name or a selector), or "Executed a contract call" when the API returns no method; the
    parties joined by `interacted with`;
  - otherwise → action type `Transfer`, sentence "Sent {value} {native coin}" in the transfer look
    without a token icon, the parties joined by `to`.
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
| Card, transfer look | https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=6282-3591 |
| Card, interpretation with token icons | https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=6284-4074 |
| Card, `Call` fallback, pending | https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=6297-3202 |
| Status and address-icon showcase | https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=6282-3275 |
| Entry point, "Additional info" dropdown | https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=6267-4403 |
| Entry point, transaction details page | https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=6267-4363 |

Deviations from the mockups, each deliberate:

- The plain swap card without token icons (node `6294-3091`) is not built; tokens show icons.
- The `Receipt` link in the dropdown is drawn gray because it is the secondary link variant, not because
  it is disabled.
- The first pending cards in the mockups show an interpreted headline, a date and a time. The API has
  none of them for a pending transaction: the headline is the fallback (FR9), the rows show a dash (FR5).
- The mockup time reads `+4:00 UTC`; the real format is the user's setting (FR5).

Not in the mockups:

- The `Call` card in a final status and the "Sent" card — both follow from the frames above (FR9).
- Screens narrower than the card — the card adapts to the width; no separate layout.

**Cross-links**

None inside the card: addresses, tokens, the market, the transaction hash and the chain logo are plain
content, not links. The only way out of the receipt is the `Transaction details` action.

## Implementation decisions

- **Bare layout.** No page renders without the app chrome today, so the receipt brings a new layout. It
  keeps the error boundary and the mount gate the other layouts have.
- **Reuse the interpretation renderer's parts, not the component.** The transaction page renders a summary
  as one inline sentence with a leading icon. The receipt shows the sentence's first variable, the
  action type, as its own gray line above, renders the rest of the sentence below it, and uses a
  different type scale. The template parsing is shared; the variables render without links (FR11).
- **The transfer view is built from the variables, not from the template.** It reads the amount, the
  token or native coin and the recipient out of the interpretation's variables and lays them out itself;
  the template string is ignored. The "Sent" fallback (FR9) feeds the same view from the transaction's
  own value and recipient.
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

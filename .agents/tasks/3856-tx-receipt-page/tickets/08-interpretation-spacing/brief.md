# 08 — Interpretation sentence spacing (brief)

Deferred: not scoped yet. Scope it with a `to-tickets` run once the unknowns below are settled.

## Goal

Revise how the interpretation sentence is put together so its spacing has one owner. Today the gaps
between the words, the values and the entities come from several places at once, which makes the sentence
hard to restyle and is what the receipt's sentence view (ticket 04) has to fight. After this ticket a
consumer can set the type scale and the entity props of the sentence without inheriting stray margins or
wrappers. On the transaction page the summary line should look the same, or differ only by the gaps that
were accidental.

## Known context

Where the spacing comes from today, all in `src/features/tx-interpretation/common/components/`:

- **Wrappers around entities.** The address, token, domain and market variables each sit in an
  `inline-block` (or `inline-flex`) span with a left margin on every one but the first.
- **Margins on the entities themselves.** The token and domain entities repeat that left margin on top of
  the wrapper's; the token and the market add a right margin; every entity icon overrides its right margin.
- **Margins on the method badge.** Left and right, plus its own vertical alignment.
- **Spaces written into the text.** The currency value, the native-coin symbol and the wei unit append a
  trailing space; the plain-text domain does too.
- **Template whitespace.** Each text chunk between two placeholders is trimmed and then gets a single space
  back when a variable follows, so the template's own spaces are discarded on one side and re-added by
  hand; the root relies on `white-space: pre-wrap` for these to show.

Ticket 01 moved the per-variable renderer into `TxInterpretationElementByType` (the transaction page's
renderer; the receipt writes its own in ticket 04), the market into `TxInterpretationDexTag` and wrapped
the template pipeline in `parseSummaryTemplate`, without touching any of the above.

Other consumers of the same pieces: the Noves summary (`createNovesSummaryObject` builds a template for the
same component) and the plain-text rendering used for the social preview (`summary-to-plain-text`), which
has its own spacing rules and should keep producing the same string.

## Relation to the other tickets

Ticket 04 builds the receipt sentence on these parts. Landing this one first lets 04 be a pure addition;
landing it after means 04 carries overrides that this ticket then removes. No `Blocked by` edge is set yet
— that is one of the unknowns.

## Unknowns

- **Does this block ticket 04, or follow it?** — owner: developer.
- **Who owns the gap between two neighbours?** A flex / inline `gap` on the sentence, real spaces kept from
  the template, or one margin rule in one place. Decides whether "remove the spaces between placeholders
  and text" means normalising the template string or dropping the hand-added spaces — owner: developer;
  a short prototype would settle it.
- **Is a pixel shift on the transaction page acceptable?** The summary line has Playwright baselines
  (`TxSubHeading.pw.tsx` and the user-operation and transaction-actions views that render the same
  component). Any change to the gaps moves them, and a baseline update is a human step — owner: developer,
  with the designer if the line visibly changes.
- **Noves.** Whether its generated templates rely on the current trimming — unverified.

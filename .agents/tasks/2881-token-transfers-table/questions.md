# Open questions — Unify the token transfers tables into one configurable table

<!-- One entry per question, with a stable id (`Q01`, `Q02`, …). The id is what a ticket names in its
`Blocked by` to declare the question gates it, so ids never change once assigned. `to-spec` creates this
file and records each Slack permalink when the question is sent; answers are folded in later by a plain
edit — the decision as a phrase plus its date, not the deliberation.

`Resolved when:` names the discrete facts a sufficient reply must contain — write it when authoring the
question. It gives "is this answer enough?" something concrete to check against and gives a follow-up a
target. Phrase it as a checklist of facts." -->

### Q01 — What does the "Type" column show: the token standard, the transfer kind (mint/burn/transfer), or both?

- Owner: Designer (Tatyana)
- Status: `resolved`
- Resolved when: (1) the cell content is named — standard tag, mint/burn badge, or both; (2) if standard only, whether the mint/burn badge is dropped entirely from the table.
- Slack: https://blockscout.slack.com/archives/D03PDKKMLQH/p1790873263136199
- Answer: both, as two columns — "Token type" (standard tag) and "Transfer type" (mint/burn badge, kept
  in the table; may become off by default later). Decided by the developer in T02, 2026-10-02.

### Q02 — Do From and To stay one combined column (one selector entry) or become two independent columns?

- Owner: Designer (Tatyana)
- Status: `pending`
- Resolved when: (1) one column or two; (2) if two, which column the direction arrow belongs to.
- Slack: https://blockscout.slack.com/archives/D03PDKKMLQH/p1790873263136199
- Answer:

### Q03 — In/Out column: where does it sit in the column order, and is it on by default?

- Owner: Designer (Tatyana)
- Status: `pending`
- Resolved when: (1) position in the vocabulary — first column (as on multichain) or next to From / To; (2) on or off by default on the address, contract and token surfaces.
- Source: front-end weekly 2026-10-05 — https://app.fireflies.ai/view/01M40TAXK5AET660ZW5PWP6588?t=997 (proposal), https://app.fireflies.ai/view/01M40TAXK5AET660ZW5PWP6588?t=1152 (placement debate)
- Known so far: agreed as a separate, optional column with the words "in" / "out" in addition to the direction arrow, not replacing it (Ulyana, Nikita). Offered only where direction is meaningful — address, contract, token surfaces. Lowercase for now; caps revisited after use (Tatyana, ?t=1329).
- Answer:

### Q04 — Default column set and order for narrow desktop widths

- Owner: Product (Nikita), after the team tries the demo on heavy-portfolio wallets
- Status: `pending`
- Resolved when: (1) final default on/off per surface (candidates: Block off, Transfer type off); (2) final column order (candidates: Amount / Asset / Value before Method, Method pushed back); (3) whether "Transfer type" keeps its name; (4) whether filter-driven hiding (Token ID under the ERC-20 filter, Amount / Value under ERC-721) is wanted, given it may fight the user's saved selection.
- Source: https://app.fireflies.ai/view/01M40TAXK5AET660ZW5PWP6588?t=1436 (raised), ?t=1592 (Transfer type off), ?t=1612 (Block off), ?t=1823 (parked), ?t=642 (naming), ?t=1480 (filter-driven hiding)
- Answer:

### Q05 — Merge Token ID into the Amount / Asset cells

- Owner: Designer (Tatyana) — mockup variants
- Status: `resolved`
- Resolved when: (1) the merged cell layout and whether a separate Token ID column survives; (2) ERC-721 and ERC-404 show amount "1"; (3) asset image is the NFT instance image when a token id is present, the token icon otherwise; (4) how amount and id are told apart for ERC-1155.
- Source: https://app.fireflies.ai/view/01M40TAXK5AET660ZW5PWP6588?t=1844 (proposal), ?t=1951 (image rule), ?t=2039 (Tatyana takes the mockup), ?t=2140 (1155 confusion)
- Mockup: https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=3882-31747
- Answer: Token ID column removed; Asset becomes "ID / Asset" showing NFT image + id + symbol (fungible
  rows unchanged); Amount shows "1" for NFT rows without a value; NFT Value is a dash; ERC-1155 follows
  the same rules (the icon separates value and id); ERC-404 without an id renders as fungible. Tatyana's
  mockup plus developer decisions, 2026-10-06. Realised as T11.

### Q06 — Drag-and-drop column reordering in the column selector

- Owner: Designer (Tatyana) — dropdown redesign
- Status: `resolved`
- Resolved when: (1) dropdown / drawer layout with a drag handle on the right of each row; (2) whether the order is stored per surface like visibility.
- Source: https://app.fireflies.ai/view/01M40TAXK5AET660ZW5PWP6588?t=2173 (proposal), ?t=2238 (handle in the selector, not the table header), ?t=2282 (recorded), ?t=2285 (meeting: token transfers only)
- Note: the developer decided (2026-10-05) to apply it to the advanced filter table as well, since both share `ColumnsButton` and a unified behaviour is simpler than disabling it per page.
- Mockup: https://www.figma.com/design/4In0X8UADoZaTfZ34HaZ3K/Blockscout-design-system?node-id=34054-7396
- Answer: single-column list, drag handle on the **left** of each row (not the right as proposed), lifted
  row with a shadow while siblings shift; order stored per surface next to visibility in the same cookie,
  cleared by Reset; hidden rows reorder too; the advanced filter reorders in memory only. Library:
  `@dnd-kit/core` + `@dnd-kit/sortable` (rubric in the ticket's `research.md`). Tatyana's mockup plus
  developer decisions, 2026-10-06. Realised as T12.

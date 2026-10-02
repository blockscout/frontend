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

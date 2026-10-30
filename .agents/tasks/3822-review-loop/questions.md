# Open questions — Automate the post-finalize review loop, CI fixes and demo deploys for task PRs

<!-- One entry per question, with a stable id (`Q01`, `Q02`, …). The id is what a ticket names in its
`Blocked by` to declare the question gates it, so ids never change once assigned. `to-spec` creates this
file and records each Slack permalink when the question is sent; answers are folded in later by a plain
edit — the decision as a phrase plus its date, not the deliberation.

`Resolved when:` names the discrete facts a sufficient reply must contain — write it when authoring the
question. It gives "is this answer enough?" something concrete to check against and gives a follow-up a
target. Phrase it as a checklist of facts." -->

No open questions for colleagues. Every decision was settled in the grilling session; the one fact to verify was
in-session work, not a colleague's answer:

### Q01 — Does `agent -p "/review-changes pr --as cursor"` attach a `disable-model-invocation: true` skill?

- Owner: frontend (tom), verified in-session during implementation
- Status: `resolved`
- Resolved when: one dry run on a throwaway PR shows the skill attached (its path echoed) and the review
  posted; or it does not, and the reviewer file uses the "read `<path>` and follow it" prompt instead
- Slack: —
- Answer: yes — ask-mode probe in-session attached the skill with `pr --as cursor` as arguments, 2026-10-30. The reviewer file uses the slash invocation; no fallback prompt needed.

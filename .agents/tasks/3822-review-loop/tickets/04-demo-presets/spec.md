# 04 — Demo presets: asked at grilling, recorded in the spec header, accepted by `deploy-demo` explicitly

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 04 of #3822 |
| Blocked by | none |

## What to build

The demo decision is made once, at grilling, and travels unchanged to the deploy. `grill-the-task` asks
which preset(s) the demo runs on, offering the deploy-review workflow's `envs_preset` options with a
recommendation inferred from the task (chain-type feature → that chain's preset; multichain → `multichain`;
generic UI → `staging`); up to two entries, a third is refused with the reason (two deployment slots).
`to-spec` writes the answer as the header row `| Demo | <preset> [(review-2)] · <preset> [(review-2)] |` or
`| Demo | none |`; header rows with nothing to say are dropped rather than filled with `—`, `Demo` is always
present. Small tasks hold the answer in session and `create-pr` Mode C offers the deploy; `create-pr` keeps
treating an absent `Minimum API version` row as "None" and Mode C never offers the review loop.
`deploy-demo` accepts explicit preset, variant and build-flag inputs for non-interactive use alongside its
prose inference.

## Acceptance criteria

- [ ] `grill-the-task` Step 2 has the demo question: options read from
  `.github/workflows/deploy-review.yml`, the inference rule, the two-entry cap with its reason, and that a
  small task keeps the answer in session.
- [ ] `to-spec` and `spec-template.md` carry the `Demo` row format and the drop-empty-rows rule; the
  template's `—` placeholders go.
- [ ] `create-pr`: Mode C offers `deploy-demo` with the session-held presets; "Minimum API version" absent →
  "None" stays; Mode C does not mention the review loop.
- [ ] `deploy-demo` takes explicit inputs (preset, variant, build flag) that bypass inference, documented in
  an Inputs table, validated against the workflow's options exactly as the inferred values are.
- [ ] `pnpm lint:doc-links` passes.

## Leaf worklist

- [ ] 1 `[agent]` Add the demo-preset question to `grill-the-task` — skill: `writing-for-agents`
- [ ] 2 `[agent]` Update `to-spec/spec-template.md` and `to-spec/SKILL.md` for the `Demo` row and the header
  rule — skill: `writing-for-agents`
- [ ] 3 `[agent]` Update `create-pr` Mode C (deploy offer, no loop) and `deploy-demo` explicit inputs; run
  `pnpm lint:doc-links` — skill: `writing-for-agents`

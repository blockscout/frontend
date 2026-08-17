# <NN> — <Subtask title>

| | |
| --- | --- |
| Parent spec | `.agents/tasks/<dir>/spec.md` → link it as `../../spec.md`, subtask <NN> of #<issue> |
| Status | `draft` \| `in progress` \| `done` |
| Blocked by | <subtask numbers that must be checked first, or "none"> |

<!-- People rows are inherited from the parent spec; add one here only to override it. A subtask that
hasn't been scoped yet has NO `spec.md` at all — only a `brief.md` in its folder, which a just-in-time
`grill-the-task` subtask session turns into this file. -->

## What to build

<!-- The end-to-end behaviour this subtask makes work, from the user's perspective — a paragraph, not a
layer-by-layer plan. What makes a well-formed subtask, and the bounds it has to satisfy: "The subtask
model" in `.agents/tasks/README.md`. -->

## Acceptance criteria

<!-- What must be true when this subtask is done. The review checks every unmarked criterion; a `(human)`
criterion is one only a person looking at the running product can judge, and having one is what makes
`implement-task` pause for verification before it commits. Which criteria earn `(human)` is defined in
"The subtask model" in `.agents/tasks/README.md`. Drop the "How to verify" line when nothing is `(human)`. -->

How to verify: `pnpm dev:preset <alias>`, open <route>

- [ ] <criterion the review can check from the diff>
- [ ] `(human)` <criterion only a person judging the running product can check>

## Details

<!-- OPTIONAL — only what this subtask needs beyond the main spec's Data & API and UI inventory: the
endpoint and `service:name` resource it touches, the Figma node for its screen, a deliberate deviation and
its reason. Point at existing code by symbol name, never by transcribing its values or line numbers.
Delete the section when the main spec already carries everything. -->

## Leaf worklist

<!-- The actual steps, each one project skill's worth of work. Leaves run along layers (resource, then
page, then styling) while the subtask cuts across them.

Tag every leaf `[agent]` or `[human]` — explicitly, never implied; `implement-task` reads the tags as its
state machine. A UI component is two linked leaves (scaffold → style). Record the executing skill's
interview answers as an indented `inputs:` list, so `implement-task` never stops to ask.

A leaf's checkbox is RESUMPTION STATE — where to pick up inside a subtask that has no commits yet. It is
never a changelog: one line at most, and durable decisions get folded into the sections above instead. -->

- [ ] 1 `[agent]` <title> — skill: `add-api-resource`
  - inputs:
    - <executor-skill answer>
- [ ] 2 `[agent]` <title> — skill: `add-new-page`
  - inputs:
    - <executor-skill answer>
- [ ] 3 `[human]` Style <component> to mockup — [Figma](<node URL>)

## Open questions

<!-- Questions scoped to this subtask only; task-wide ones live in the main spec. Same format and the same
gate: this subtask can't start while one is `pending`. -->

### Q1 — <question>

- Owner: <role> (<name>)
- Status: `pending` \| `resolved` \| `waived`
- Slack: <permalink, once sent>
- Answer: <the decision as a phrase, + date — the decision, not the deliberation>

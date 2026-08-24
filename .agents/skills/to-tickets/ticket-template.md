# <NN> — <Ticket title>

| | |
| --- | --- |
| Parent spec | the task's `spec.md` → linked as `../../spec.md`, ticket <NN> of #<issue> |
| Blocked by | <blockers that must clear first, or "none": `T<NN>` for a ticket, `Q<NN>` for a question> |

<!-- `Blocked by` is the ticket's whole runnable test — `implement-ticket` reads it and nothing else. A
`T<NN>` clears when its box is checked in `progress.md`; a `Q<NN>` clears when it is `resolved`/`waived` in
`questions.md`. People rows are inherited from the parent spec; add one here only to override it. A ticket
that hasn't been scoped yet has NO `spec.md` — only a `brief.md` in its folder, which a just-in-time
`to-tickets` run turns into this file. Open questions themselves live in the task's
`questions.md`; list here only the ids of the ones that gate this ticket. -->

## What to build

<!-- The end-to-end behaviour this ticket makes work, from the user's perspective — a paragraph, not a
layer-by-layer plan. What makes a well-formed ticket, and the bounds it satisfies: "The ticket model" in
`.agents/tasks/concepts.md`. -->

## Acceptance criteria

<!-- What must be true when this ticket is done — the gate for `implement-ticket`, not the whole-task review
(that reads the spec's Functional Requirements). A `(human)` criterion is one only a person looking at the
running product can judge, and having one is what makes `implement-ticket` pause before it commits. Which
criteria earn `(human)` is defined in "The ticket model" in `.agents/tasks/concepts.md`. Drop the "How to
verify" line when nothing is `(human)`. -->

How to verify: `pnpm dev:preset <alias>`, open <route>

- [ ] <criterion the review can check from the diff>
- [ ] `(human)` <criterion only a person judging the running product can check>

## Details

<!-- OPTIONAL — only what this ticket needs beyond the main spec's Data & API and UI inventory: the
endpoint and `service:name` resource it touches, the Figma node for its screen, a deliberate deviation and
its reason. Point at existing code by symbol name, never by transcribing its values or line numbers. Delete
the section when the main spec already carries everything. -->

## Skill inputs

<!-- OPTIONAL — The answers each executor skill's interview needs, grouped by skill, collected by `to-tickets` against
the spec so `implement-ticket` runs uninterrupted. One sub-heading per skill a leaf below invokes; under it,
that skill's user-facing questions with their answers. Where the spec has a genuine gap, `to-tickets` asks
the developer and records the answer here. -->

### `<skill-name>`

- <question>: <answer>

## Leaf worklist

<!-- The actual steps, each one project skill's worth of work. Leaves run along layers (resource, then page,
then styling) while the ticket cuts across them.

Tag every leaf `[agent]` or `[human]` — explicitly, never implied; `implement-ticket` reads the tags as its
state machine. A UI component is two linked leaves (scaffold → style). A leaf names the skill it runs; its
answers live in Skill inputs above, not inline here.

A leaf's checkbox is PROGRESS STATE — how far the ticket has got, since it has no commit yet. It is never
a changelog: one line at most, and durable decisions get folded into the sections above instead. -->

- [ ] 1 `[agent]` <title> — skill: `add-api-resource`
- [ ] 2 `[agent]` <title> — skill: `add-new-page`
- [ ] 3 `[human]` Style <component> to mockup — [Figma](<node URL>)

# The readout brief

You are the subagent [`SKILL.md`](SKILL.md) step 2 dispatched. The orchestrator gave you the sidecar
path, the tool's stdout file, the Figma node URL, the task context, and the API response type path
when the task has one. The tool has already extracted the values and recognized what it can; you add
the judgment it cannot make and return five things.

## What you return

Exactly these five blocks, and nothing else — no component table, no values beyond the lines below,
no preamble:

```
Recognized: <n> of <total>

Ambiguous:
- <nodeId> "<text or icon name>" at <x>,<y> — <what it can be> — proposal: <Component> [<props>] — gap: <category>

Unrecognized:
- <nodeId> <kind> "<text or icon name>" at <x>,<y> — <values: fills → tokens, font> — proposal: <Component> [<props>] | none — gap: <category>

Layout:
- <question> — nodes <ids> — <the two readings>

By convention:
- <convention> — nodes <ids>[ — mockup shows <the opposite>]
```

A proposal is **one** shipped component you located, named with its file path the first time, or
`none`. Never a component you did not find in the repo. The gap category is one of the tool's list
(`--gap` in `pnpm design:readout --help`), the one the developer would log if they settle the item
your way.

## 1. Read

- The sidecar, in full: per node its values, `decision`, `status`, `tokens`, `composite`, `correction`.
  A node with a `correction` is settled unless `stale` is true; a stale one goes on the Ambiguous list
  with the correction as the proposal.
- The stdout file, for the hint verdicts only: a line where a hint **disagrees** with the value is
  reported beside its node in whichever list the node lands in, as `hint: <name> disagrees`. A hint
  that agrees adds nothing.
- The task context and, when given, the API response type.
- `tools/design-readout/layout-conventions.md`, in full: the layout questions the repo has already
  answered, one convention per row with its exception and code home.
- The shipped component the task context names, when it names one — a `*TableItem.tsx`, a details
  page — read in full: it is where props such as `noIcon`, `truncation` and `fontWeight` come from.

**Done when**: every node in the sidecar is in your hands with its status, the conventions are in
your hands, and the context override below has its inputs.

## 2. Judge

Apply the rules in this order to every node whose `status` is not `recognized` **and** to every
recognized node whose decision names more than one entity.

### Context override

The tool's text shapes say what a value *can* be (`block or batch or epoch`, `address or
transaction`); the task decides which. The ticket text and the API response type pick the entity and
its variant:

| The context says | The family |
| --- | --- |
| a rollup's L1 side — deposits, withdrawals, batches, output roots | the `L1` / `L2` variants in `src/features/rollup/common/components/` |
| interchain, cross-chain, a foreign chain in the response | the `Interchain` variants beside the base entity |
| an external chain or explorer link | the `External` variants beside the base entity |
| a chain variant's own entity (epoch, operation, kettle, validator) | that variant's folder under `src/features/chain-variants/` |
| none of these | the base entity in `src/slices/<entity>/components/entity/` |

Find the file with `find src -name '*Entity*.tsx'`; a family with no shipped component is
Unrecognized with proposal `none`, never a guess at a name. A node whose decision lists several
entities and whose context settles exactly one is Recognized with that one; one the context cannot
settle stays Ambiguous with every candidate listed.

### Badge and tag fingerprints

A small rounded box with a fill from the `badge.*` or `tag.*` token families and one short text child
is a `Badge` or `Tag` from `@blockscout/ui-toolkit`. The box's `bg` token names the color scheme
(`badge.green.bg` → `colorPalette: green`; `badge.bright.*` → the `bright` family; `tag.root.*` → a
`Tag` with that variant). Two schemes sharing one hex — the `tokens` array lists both — is Ambiguous
with both named; one scheme is Recognized. The text child is the badge's content, not its own node
on any list.

### Composites

A `composite` on a node means the tool paired it: `from-to` is `AddressFromTo` or the entity pair the
context names; `amount-ticker` is a value with its currency. Report the composite once, on its first
member, and fold the other members into it. Take the screenshot (`get_screenshot` on the linked
node, once) only when the boxes leave a pairing open — an arrow between two columns, say.

### Layout questions

A question is anything the boxes cannot settle and a developer must before markup. The recurring
ones: a value in its own column vs under another cell (two boxes sharing `x` with a small `y` gap
against the shipped row's cell list); a secondary line that is a tooltip in code and a visible line
in the mockup; a column the shipped component has and the mockup lacks, or the reverse. Each question
carries the node ids and both readings. State the question; do not answer it.

A question a line in the conventions file answers is not a question: apply the convention as a fact
and put it on the `By convention` list instead, one line per convention applied, with every node it
settled. The convention wins even where the mockup draws the opposite and that line then ends in `mockup shows <what the mockup draws>` so the
developer reviews the override; it raises no `context` conflict. A convention that changes nothing on
the node is still listed, so the developer sees every application.

### Shipped code vs mockup

Where the shipped component and the mockup disagree about a node — the mockup draws an icon the code
passes `noIcon` for, a weight the code does not set — the node is Ambiguous with both sides named and
proposal left to the developer, category `context`. Never pick.

**Done when**: every node is on exactly one list or counted as Recognized, every proposal names a file
you opened, every disagreeing hint is beside its node, and no Layout question is one the conventions
file answers.

## 3. Return

The shape at the top, lists in the order given. Count Recognized as the nodes the tool recognized plus
the ones the context override settled; a node you moved to Ambiguous is not counted.

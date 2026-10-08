# `design-readout.md` — the task-folder readout

The shape of the file that carries a node's readout into a task folder: one file per task, one block
per Figma node. It is written from the node's sidecar (`tools/design-readout/CONTEXT.md` says where
that lives) and the lists the [`design-readout`](SKILL.md) skill returned, and it is pruned at land
like the ticket files. Four sections per node, in this order, each present even when empty.

```md
# Design readout — <task title>

## <screen name> — [<node id>](<figma node URL>)

Sidecar `<path>` · color mode `<light|dark>` · file version `<version>` · regions `<ids>`

### Recognized

| Node | Content | Component | Props | Tokens | Signal |
| --- | --- | --- | --- | --- | --- |
| `<nodeId>` | `<text or icon name>` | `<Component>` | `<props, as words>[ · override <prop>=<value>…]` | `<role → token>` | `<shape / icon / color / composite / context / correction>` |

### Ambiguous

- `<nodeId>` `<content>` — <what it can be> — proposal `<Component> [<props>]` — gap `<category>`
  — <open question and to whom, when sent on>

### Unrecognized

- `<nodeId>` <kind> `<content>` — <values: fills → tokens, font> — proposal `<Component>` | none —
  gap `<category>`

### Layout questions

- <question> — nodes `<ids>` — <the two readings> — <answer, once given>
```

What goes where:

- **Recognized** holds every node with a component: the tool's recognitions as the subagent mapped
  them, the context-override hits (signal `context`), and every developer correction (signal
  `correction`, the corrected component). One row per node; a composite's members sit on the first
  member's row with the others' ids in Content. A node's `override` sits in its Props cell after the
  component's own props, as `· override <prop>=<value>…`; it never moves a node between lists, and it
  sits beside a correction when the node carries both. The Signal column does not name it.
- **Ambiguous** and **Unrecognized** hold what is still open at write time, each line with the
  proposal and gap category from the skill's return. An item the developer settled in session has
  moved to Recognized; an item sent to the designer carries its question.
- **Layout questions** hold every layout question the subagent raised, answered or not; an answer
  that changed a node is also a Recognized row with signal `correction`.

The sidecar is the source; this file is a view of it for the ticket's `[human]` style leaf and is
regenerated, never hand-edited.

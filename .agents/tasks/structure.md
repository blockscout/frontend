# Product task layout

Where every file of a task lives, who writes it, and how mutable it is. Follow the naming convention and any
file's location is derivable — which is why the skills carry no location instructions of their own. What the
files *mean* is in [`concepts.md`](concepts.md).

## The tree

One folder per specced task, under `.agents/tasks/`:

```
.agents/tasks/<issue>-<slug>/
  spec.md                       task spec — the durable statement of intent
  progress.md                   one checkbox per ticket
  questions.md                  open questions, each with a stable id (Q01)
  tickets/
    NN-<slug>/
      spec.md                   the ticket (once scoped)
      brief.md                  OR this, for a deferred ticket (no spec.md)
      research.md               optional — research / prototype notes
      notes.md                  optional — implementation findings, PR evidence
```

**Naming is mechanical.** The task folder is `<issue>-<slug>/` — the bare GitHub issue number, then a
kebab-case slug. Each ticket folder is `tickets/NN-<slug>/`, where `NN` is a zero-padded identity number,
not a position. The feature branch is `issue-<number>` (e.g. `issue-3219`); that mechanical match is what
lets a skill infer the task from the branch with no arguments.

## File ownership

| File | Mutability | Holds | Written / mutated by |
| --- | --- | --- | --- |
| `spec.md` | **immutable** once created | Context & goal, Functional Requirements (the whole-task review contract), Data & API, UI inventory, Out of scope. Header is static identity. | `to-spec` creates it. Edited in place only for a rare genuine requirement change. |
| `progress.md` | mutable | One checkbox per ticket: `- [ ] NN → tickets/NN-<slug>/`. No titles, edges, or content. | `to-tickets` creates it and appends a line per ticket; `implement-ticket` checks the box. |
| `questions.md` | mutable | Every open question, each with a stable id (`Q01`): owner, Slack permalink, status, answer. | `to-spec` creates it; answers folded in later by a plain edit. |
| `tickets/NN-<slug>/spec.md` | mutable until fully implemented, then **frozen** | What to build, Acceptance criteria (with `(human)` tags), Skill inputs (grouped by skill), Leaf worklist. Header: `Blocked by` (`T<NN>` ticket + `Q<NN>` question blockers). | `to-tickets` creates it; `implement-ticket` checks its leaf boxes as it works them. |
| `tickets/NN-<slug>/brief.md` | informal | Deferred-ticket marker. Goal, known context, the blocking unknowns and who owns each. | `to-tickets` when it can't scope the ticket; or dropped in by the developer. |
| `tickets/NN-<slug>/{research,notes}.md` | optional | Research / prototype notes; implementation findings kept as PR evidence. | session / developer. |

## Status is derived, never stored

There is no task-level status field. Task state is read off `progress.md`: **any box checked → in progress;
all boxes checked → done**.

`progress.md` is the machine-readable spine: a checked box means the ticket **landed** (its commit exists),
which is what `Blocked by` edges read to release dependents, and the last box checked is what
`finalize-task` acts on.

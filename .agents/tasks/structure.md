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
  inbox.md                      optional — decisions from outside any session, one section per source
  design-readout.md             optional — the design readout
  review.md                     optional — an md-mode review of the whole branch
  tickets/
    NN-<slug>/
      spec.md                   the ticket (once scoped)
      brief.md                  OR this, for a deferred ticket (no spec.md)
      research.md               optional — research / prototype notes
      notes.md                  optional — implementation findings, PR evidence
      review.md                 optional — an md-mode review of this ticket's uncommitted work
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
| `inbox.md` | mutable | One section per outer-loop source (a meeting, a thread, a document): its link, a `pending` / `folded` status, and the decisions with deep links into the source. Shape: `.agents/skills/debrief-meeting/inbox-section-template.md`. | `debrief-meeting` appends a section, uncommitted; any future source skill does the same. `process-task-inbox` folds a section into the other files and flips it to `folded`. |
| `design-readout.md` | regenerated, never hand-edited | One block per Figma node the task carries: Recognized table, Ambiguous, Unrecognized, Layout questions, By convention — a view of the node's sidecar in the shape `.agents/skills/design-readout/readout-template.md` defines. | The `design-readout` skill writes it, and rewrites a node's block when the developer re-runs it. |
| `tickets/NN-<slug>/spec.md` | mutable until fully implemented, then **frozen** | What to build, Acceptance criteria (with `(human)` tags), Skill inputs (grouped by skill), Leaf worklist. Header: `Blocked by` (`T<NN>` ticket + `Q<NN>` question blockers). | `to-tickets` creates it; `implement-ticket` checks its leaf boxes as it works them. |
| `tickets/NN-<slug>/brief.md` | informal | Deferred-ticket marker. Goal, known context, the blocking unknowns and who owns each. | `to-tickets` when it can't scope the ticket; `process-task-inbox` for new work an inbox decision brings; or dropped in by the developer. |
| `tickets/NN-<slug>/{research,notes}.md` | optional | Research / prototype notes; implementation findings kept as PR evidence. | session / developer. |
| `review.md` (task or ticket level) | mutable | An `md`-mode review: one thread per finding — claim, fix, status, replies. `review-<tag>.md` where several reviewers ran at once. | `review-changes` in `md` mode writes it; `resolve-review` appends the replies. Pruned at land like the rest. |

## Status is derived, never stored

There is no task-level status field. Task state is read off `progress.md`: **any box checked → in progress;
all boxes checked → done**.

`progress.md` is the machine-readable spine: a checked box means the ticket **landed** (its commit exists),
which is what `Blocked by` edges read to release dependents, and the last box checked is what
`finalize-task` acts on.

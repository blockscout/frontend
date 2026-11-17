# 0002 — tickets cut vertically, leaves run along layers

| | |
| --- | --- |
| Status | accepted |
| Date | 2026-08-11 |
| Deciders | @tom2drum |
| Supersedes | — |

## Decision

**A ticket is a vertical slice; the leaves inside it are layer-shaped.**

```
tickets/01-cross-chain-list/     ← vertical: demoable, one context window, one commit
  leaf 1 [agent] add-api-resource — declare the resource
  leaf 2 [agent] add-new-page    — tab route + scaffold
  leaf 3 [agent] wire the resource into the table
  leaf 4 [human] style to mockup
```

"The ticket model" in `.agents/tasks/concepts.md` defines both levels and every rule that follows from them;
this record holds only the reasoning, which that file should not have to carry.

## Why

The tracer-bullet norm says every unit of work should be a vertical slice, all the way down. Ours stops one
level short, deliberately.

**Layer-shaped leaves are what make execution mechanical.** The project skills are layer-shaped by
construction — `add-api-resource` declares a resource, `add-new-page` scaffolds a route. A leaf that maps
one skill to one step lets `implement-ticket` execute it without deciding anything: open the skill, read the
Skill inputs `to-tickets` already collected, run. Force a leaf to be vertical and it spans three skills, so
the executor has to compose them itself — the interesting decisions move from the ticket, where a human
reviewed them, into an unattended run.

**Vertical tickets are what make review and verification meaningful.** An API resource reviewed alone cannot
be judged against the thing that consumes it, and a scaffold with no data cannot be verified by looking at
the running product. Grouping the leaves into a slice that renders gives both a real target: the review
reads one coherent diff, and a `(human)` acceptance criterion has something to be true about.

So the two levels answer two different questions. *What can an agent execute without judgement?* — a leaf.
*What can a human judge?* — a ticket. Aligning both to the same axis would sacrifice one of them.

## Consequences

- The review unit is the ticket, so a leaf's code can be wrong for as long as it takes the slice to
  finish. Accepted deliberately: reviewing every leaf spent a subagent per axis on every step, and most of
  what it caught was churn the next leaf rewrote anyway.
- Leaves stop being run boundaries, which buys the review unit above at the cost of needing a resumption
  mechanism inside a ticket that has no commit yet. The workflow layer owns how that works.
- Nesting is unnecessary. Work too big for one ticket becomes more tickets with blocking edges between
  them, never tickets inside tickets — which is what let the sub-branch and sub-PR machinery go.

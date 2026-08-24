# Prose smell baseline

Nine smells for the instruction surface — `.agents/`, `AGENTS.md`, every `CONTEXT.md`, `.cursor/`,
`.github/*instructions*`. The Standards axis carries **this** baseline instead of
[`smells.md`](smells.md) when the diff touches those files, because a markdown diff has no God Components
and thirteen React/TS smells on it are pure noise.

An instruction file is not documentation — it is **code that runs on an agent**. A rule nobody can execute
deterministically is as broken as a function that returns the wrong value, so review it that way.

Three rules bind the baseline, mirroring `smells.md`:

- **The repo overrides.** A convention already documented in `.agents/` wins. Where a file states its own
  rule, suppress the smell that would contradict it.
- **Always a judgement call.** Report a smell as a labelled possibility ("possible Sediment"), never as a
  violation.
- **Skip what tooling enforces.** `lint:doc-links` already resolved every link, heading anchor and path
  reference, and flagged every path written short; cspell already ran. Their findings are facts, not smells —
  neither a dead reference nor a shorthand path is ever a finding here.

One defect, one label. Duplication and Shotgun Surgery describe the same mess from two directions — pick
the sharper one.

## The smells

- **Duplication** — the same meaning stated in more than one place. Two copies that *agree* look fine
  until one is edited, which is why this is invisible to a read-and-compare pass: find it by grepping a
  distinctive phrase from the diff across the instruction surface. → keep one authoritative statement,
  point at it from the other site. *The highest-yield smell on this surface.*
- **Divergent Change** — one document edited for unrelated reasons, so a fact sits in a file whose
  *reason to change* differs from the fact's own. The test: **what change would force an edit to this
  line?** If the answer is not the same as for the rest of the file, it is misfiled. → move it to the
  document whose reason-to-change matches. *See "Picking the file" below.*
- **Shotgun Surgery** — one decision forces edits in several files, usually because a pointer *summarises*
  its target instead of pointing at it. A pointer that restates drifts, and the restatement is the copy
  that goes stale. → point, don't summarise.
- **Sediment** — a line true of a previous design, left because adding feels safe and removing feels
  risky. Especially: an absolute that a later change made conditional. → delete it, or reconcile it with
  what the change just established.
- **Ambiguous absolute** — "always X" / "never Y" where an exception exists elsewhere in the repo. A reader
  arriving directly at the absolute will not know the exception exists. → state the exception at the
  absolute, or drop the word "always".
- **Rule without a mechanism** — states what must be true but not how to establish it, leaving the agent
  to invent a procedure. It reads as guidance and executes as a coin flip. → give the command, the file,
  or the ordered probe. *`gh pr list --json` over "check whether a PR exists" is the standing example.*
- **Incomplete case split** — an enum, status list, or branch set where a case is unhandled: a value the
  writer defined and then no rule consumes. → handle every case, or say explicitly that one is ignored.
- **Uncheckable completion criterion** — a step whose "done when" cannot be told apart from not-done
  ("produce a change list" rather than "every modified model accounted for"). Invites stopping early on
  the easy half. → make it checkable, and exhaustive where it matters.
- **No-op** — a line the agent already obeys by default, so the file pays context to say nothing. Test it
  in isolation: does behaviour differ without it? → delete the whole sentence rather than trimming words
  from it.

## Picking the file

Divergent Change is the smell this repo gets wrong most, because two files can each plausibly hold a fact.
Resolve it by matching **invalidation triggers** — what would make someone edit this file at all:

| File | Edited when | Answers |
| --- | --- | --- |
| `.agents/delegation.md` | agent capability or trust changes | *may an agent do this?* |
| `.agents/tasks/README.md` | the product-task workflow changes | *how does a task reach a merged PR?* |
| `.agents/AGENTS.md` | the repo gains something worth knowing about | *what exists, where do I read it?* |
| `.agents/rules/*.md` | a coding convention changes | *how do I write the code?* |
| a skill's `SKILL.md` | that workflow's steps change | *what do I do, in what order?* |

Two consequences worth flagging as findings:

- **`AGENTS.md` carries pointers, never mechanics.** It is always-loaded, so every session pays for it —
  including the majority that never touch the thing being explained. A *how* there is misfiled by
  construction.
- **A statement naming a spec artefact** — ticket, leaf, tag, checkbox, breakdown — belongs to the
  workflow layer, not to `delegation.md`, which must read correctly in a repo that never adopted the
  workflow.

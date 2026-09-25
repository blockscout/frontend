# 06 — The `jev` axis in `review-changes`

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 06 of #3720 |
| Blocked by | T03, T04 |

## What to build

A `first` round of `review-changes` dispatches a fourth `general-purpose` subagent — the `jev` axis —
alongside the three blind axes, with the same inputs. Its brief in `axes.md` (the only place the tool is
named) has it run `pnpm review:screen`, open every suspect, read the cited rule or requirement, and return
each suspect exactly once: a finding in the standard shape labelled `standards` or `spec`, or a drop with a
one-line reason, plus the sidecar path. Normalization notes which sources raised each surviving finding;
after publishing, the orchestrator spawns a fresh subagent with the `jev` brief, the sidecar path and the
final table to run `--origins`. The terminal report gains one `jev` line. A `skipped`/`failed` screen or
zero suspects leaves a three-axis review with the reason stated.

## Acceptance criteria

How to verify: `/review-changes md --scope branch` on this branch with and without `TYPESAFE_API_KEY`.

- [ ] `axes.md` has a `## Jev axis` section: run the screen with the orchestrator's base and spec passed
      explicitly, verify each suspect against the cited rule file or FR, never look beyond the suspect list,
      return confirmed findings (axis label `standards` or `spec`), the drop list, and the sidecar path;
      no total word cap, the per-finding cap applies. It names the script, never the env var.
- [ ] `SKILL.md` step 2 dispatches the `jev` axis in the same message as the others and says the spec gate
      does not remove it (with no spec its spec grid is empty, its standards grid still runs).
- [ ] `SKILL.md` step 4 keeps one finding per defect and records `sources` per surviving finding (the
      axes that raised it, `jev` included); step 5 adds the post-publish `--origins` subagent dispatch
      (fresh `general-purpose`, given the `jev` brief, the sidecar path, the final table with
      `sources`, and the drop list).
- [ ] The terminal close adds: `jev: <n> suspects · <c> confirmed · <d> dropped · origins jev <x> / axis
      <y> / both <z>`; on `skipped`/`failed`/zero suspects it prints the reason instead.
- [ ] `output-pr.md` and `output-md.md` are untouched except that `Axes:` may list `jev` with the others —
      findings carry no provenance marker.
- [ ] `.claude/agents/code-reviewer.md` description no longer counts the axes.
- [ ] `.agents/GLOSSARY.md` gains a `Jev` row; `pnpm lint:doc-links` passes.
- [ ] `(human)` A dry run on this branch in `md` mode shows the fourth axis dispatched, the `jev` line in
      the terminal close, and an `origins` block in the sidecar.

## Details

- Edit `.agents/skills/review-changes/{SKILL.md,axes.md}` under the `writing-for-agents` skill; the
  `Out of bounds` list binds the `jev` axis too — say so in its brief.
- The `jev` subagent passes `--base` and, when the orchestrator resolved one, `--spec` so the tool never
  re-derives what the review already pinned (FR1); `pr` output maps to `--scope branch`.
- The `--origins` subagent gets the findings table in the `| id | axis | location | sources |` shape ticket
  04 parses, and the `jev` axis's drop list verbatim.

## Skill inputs

### `update-glossary`

- Term: **Jev** — Kind: `service`
- Definition: TypeSafe's typed-judgment model behind the `review-screen` tool; also the name of the fourth
  `review-changes` axis and of the sidecar folder. Returns probabilities, not claims — a subagent verifies
  every suspect before it becomes a finding.
- Cross-references: none.

## Leaf worklist

- [ ] 1 `[agent]` Write the `## Jev axis` brief in `axes.md` — skill: `writing-for-agents`
- [ ] 2 `[agent]` Edit `SKILL.md` steps 2, 4, 5 and the terminal close; update `code-reviewer.md` description
- [ ] 3 `[agent]` Add the `Jev` glossary row — skill: `update-glossary`
- [ ] 4 `[agent]` Dry run in `md` mode on this branch; record the sidecar path in `notes.md`

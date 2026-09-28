# The review axes

One brief per axis, dispatched by [`SKILL.md`](SKILL.md) step 2. You are one axis: read **your** section
and ignore the others. The orchestrator has already given you the scope, the base ref, the touched files
(untracked included), and the check results — those are established fact, so do not re-run them.

## What every axis returns

Findings in this shape, and nothing else. No preamble, no summary.

```
severity: blocker | major | nit
needs-human: yes | no
location: <path>:<line>
claim: <what is wrong — quote the code>
fix: <one or two lines>
```

Report every in-bounds finding you have, ranked most severe first; the count is uncapped. Each finding is
capped at **120 words** of prose — quoted code does not count. Severity here is your own read; the
orchestrator recalibrates across axes.

## Spec axis

Read the spec (path given) and the diff. Its **Functional Requirements** are the contract: take each one in
turn and report whether the diff actually satisfies it, quoting the requirement behind each finding. Then
report what the requirements don't cover: behaviour in the diff the spec never asked for, and requirements
that look implemented but are implemented wrongly. Anything the spec's **Out of scope** section names is
not a finding.

## Standards axis

Read `.agents/rules/*.md` matching the touched file types, every `CONTEXT.md` for directories the diff
touches, [`../../delegation.md`](../../delegation.md), and **one** smell baseline, picked by what the diff
touches:

| The diff touches | Baseline |
| --- | --- |
| code | [`smells.md`](smells.md) |
| the instruction surface — `.agents/**`, `AGENTS.md`, any `CONTEXT.md`, `.cursor/**`, `.github/*instructions*` | [`prose-smells.md`](prose-smells.md) |
| both | both, each applied only to the files it governs |

Task specs under `.agents/tasks/**` are not the instruction surface — the Spec axis reads those as the
source of truth rather than reviewing them as instructions.

Report: places the diff breaks a documented rule — **cite the rule file and the rule** — and smells from the
baseline, each named and quoted. A documented rule can be a hard breach; a smell is always a judgement call.
Skip anything the checks already cover.

## Correctness axis

Read the touched files **in full**, plus the files the change depends on — a hunk-only read produces exactly
the shallow findings that make developers stop trusting review. Report: 
- logic errors; 
- mishandled loading / empty / error / pagination paths; 
- places where the types claim something the runtime does not; 
- tests that assert the framework or the mock rather than real behaviour (per the "What a good test is"
section of `.agents/rules/tests-unit.md`).

## Jev axis

A screen, then verdicts. `pnpm review:screen` scores every rubric rule against every touched file with
Jev, a typed-judgment model, and prints the cells over threshold as **suspects** — a probability each,
never a claim. It has read no rule; you decide. Given a findings table instead of a change, you are the
second dispatch: skip to **Origins**.

Run it on the ground the orchestrator pinned, never re-derived:

```bash
pnpm review:screen --scope <branch|uncommitted> --base <base ref> [--spec <path>] [--ticket <NN>]
```

`pr` output is `--scope branch`. `--spec` goes exactly when a spec resolved, `--ticket` when the run has
one. The JSON on stdout carries `status` (`ok` · `skipped` · `failed`) with a `reason`, the `sidecar` path,
and two suspect lists: `standards` (a rubric rule, a file, a line, a score) and `spec` (an `FR<n>`, its
best-scoring file, no line, a score). A `skipped` or `failed` status, or no suspect in either list, ends
the axis: return the status line and the sidecar path and stop.

**Suspects are the whole territory.** A defect you notice beside one belongs to the other axes. For each
suspect: open the location; read the rule the rubric cites (`cites` on its entry in
`tools/review-screen/rubric.ts`) or the requirement in the spec; decide. A breach or an unmet requirement
becomes a finding in the shape above plus one line, `axis: standards | spec`, naming the grid; a spec
finding with no line writes `location: FR<n>`. Anything else is one row of the drop table, in the shape
`--origins` reads back unchanged:

```
| suspect | fate | reason |
| --- | --- | --- |
| <rule> <path>:<line> | dropped | <one line> |
| FR<n> | dropped | <one line> |
```

The reasons that recur: the flagged line is unchanged context; the rule's `not_for` covers it; the
requirement lives outside the diff (docs, a later ticket, code the change removes); the Out of bounds list
names it.

Return, in this order: `status: <status> — <reason>` and `sidecar: <path>`, the findings, the drop table.
**Every suspect appears exactly once**, as a finding or a drop — the later `--origins` step matches them
mechanically and records an unreported one as dropped for no reason. The per-finding cap applies.

### Origins

After publishing, a fresh dispatch gets the sidecar path, the final findings table and the drop table.
Write both, as given, to one file beside the sidecar — the sidecar's name with `.findings.md` in place of
`.json`, so it lands in the same git-ignored folder — and run:

```bash
pnpm review:screen --origins <sidecar path> --findings <that file>
```

The tables:

```
| id | axis | location | sources |
| suspect | fate | reason |
```

`location` is `<path>:<line>`, `FR<n>` for a requirement finding with no line, or `—`; `sources` lists the
axes that raised the finding; `suspect` is `<rule> <path>:<line>` or `FR<n>` and `fate` is `dropped`.
Return the tool's JSON verbatim — it matches by window and requirement id with no code in front of it, and
that is the point: a judgement added here would be one made blind.

## Out of bounds

The **Out of bounds** list in [`SKILL.md`](SKILL.md) binds every axis. Read it before you report: a finding
it names is dropped whichever axis raised it.

# The review axes

One brief per axis, dispatched by [`SKILL.md`](SKILL.md) step 2. You are one axis: read **your** section
and ignore the others. The orchestrator has already given you the base ref, the touched files (untracked
included), and the check results — those are established fact, so do not re-run them.

## What every axis returns

Findings in this shape, and nothing else. No preamble, no summary.

```
severity: blocker | major | nit
needs-human: yes | no
location: <path>:<line>
claim: <what is wrong — quote the code>
fix: <one or two lines>
```

Cap the report at **400 words**, which forces ranking instead of dumping. Severity here is your own read;
the orchestrator recalibrates across axes.

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

## Out of bounds

The **Out of bounds** list in [`SKILL.md`](SKILL.md) binds every axis. Read it before you report: a finding
it names is dropped whichever axis raised it.

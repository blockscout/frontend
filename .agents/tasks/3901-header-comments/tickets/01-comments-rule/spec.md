# 01 — Rewrite the "Comments" section of the code-quality rule

| | |
| --- | --- |
| Parent spec | the task's `spec.md` → linked as `../../spec.md`, ticket 01 of #3901 |
| Blocked by | none |

## What to build

The "Comments" section of `.agents/rules/code-quality.md` says which comments are allowed: the opening ban
stays, and it names exactly two exceptions, the why-comment as it is today and the header comment, defined
by requirements 1–8 of the spec. After this ticket an agent or a reviewer reading the rule can decide for
any comment block whether it stays, which is what the sweep tickets work from.

## Acceptance criteria

How to verify: read the "Comments" section of `.agents/rules/code-quality.md` in the diff

- [ ] The section keeps its opening ban and names exactly two exceptions (requirement 1).
- [ ] The locality test is stated as the criterion, and the allowed / not-allowed table from the draft in issue #3901 is given as examples of it (2).
- [ ] The module-kind limit is phrased by who imports the module, not by its directory (3).
- [ ] The placement limits (4), the bare-pointer allowance (5) and the call-sample test as drafted in the issue (6) are in the section.
- [ ] The JSDoc ban uses the wording of requirement 7, and the section prescribes no other delimiter.
- [ ] The section says an export whose name and signature tell the caller everything gets no header comment, and that this is the usual case (8).
- [ ] The existing sentences on diff-narration, untouched comments, commented-out code and TODOs still hold, and nothing in the section contradicts another part of the rule file or `.agents/rules/docs.md`.
- [ ] `pnpm lint:doc-links` and `pnpm lint:cspell` pass.
- [ ] `(human)` The developer has read the rewritten section and approves its wording as the rule the sweep tickets apply.

## Details

- The draft the spec refers to is in the issue body: `gh issue view 3901`. The table and the call-sample
  test come from there; where the draft and the spec disagree, the spec wins.
- Only the frontend repository's rule changes. No home-repo rule or skill is touched.
- Follow the `writing-for-agents` skill for the rule text.

## Leaf worklist

- [ ] 1 `[agent]` Rewrite the "Comments" section — skill: `writing-for-agents`
- [ ] 2 `[agent]` Run `pnpm lint:doc-links` and `pnpm lint:cspell`

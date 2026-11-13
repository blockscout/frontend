# 06 — Split the unit-test rule: general half to home

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 06 of #3882 |
| Target repo | home (`blockscout/frontend-home`) |
| Blocked by | T01 |

## What to build

The general half of `frontend`'s unit-test rule (`.agents/rules/tests-unit.md`) becomes a home rule that
applies in home sessions to spec files of any child. This ticket is the pilot that settles how a mixed
rule is cut: general guidance to a home rule, the description of the local setup to the `CONTEXT.md` of
the tool it describes. It decides the cut line and records it; the `frontend` side of the cut lands in
ticket 08.

## Acceptance criteria

- [ ] Home has a unit-test rule holding only guidance that is true in any repository: what a good test
  is, what a bad one is, mocking guidance. Nothing in it names a `frontend` path, utility, project
  configuration or environment mechanism.
- [ ] The home rule loads in a home session when a `frontend` spec file is read.
- [ ] `notes.md` in this folder lists, section by section, which half each part of the current rule goes
  to, and names the `CONTEXT.md` in `frontend` that receives the local half.
- [ ] `notes.md` states the cut as a rule of thumb that phase 2 can apply to the other mixed rules.

## Details

- **Where this lands.** Run the session inside the `frontend` clone nested in the home clone, on
  `issue-3882`, with the home root (`..`) added to the session: `implement-ticket` and these ticket files
  are there, and a session started at the home root cannot invoke it until ticket 02 lands. The work is
  committed in home, on a branch of its own with a pull request that links the issue. The leaf boxes and
  the `progress.md` tick are the only changes committed in `frontend`.
- Where a section mixes both (a general principle illustrated with a local utility), the principle goes
  to home with a neutral example and the local utility stays in the local half.
- If no existing `CONTEXT.md` in `frontend` owns the local test setup, `notes.md` names where a new one
  goes, following `frontend`'s `docs` rule.

## Leaf worklist

- [ ] 1 `[agent]` Decide the cut section by section and record it in `notes.md`
- [ ] 2 `[agent]` Write the home rule and verify it loads on a child spec file

# 07 — CC cap re-calibration (investigation)

| | |
| --- | --- |
| Parent spec | `../../spec.md`, follow-up to ticket 06 of #3663 |
| Status | deferred — needs investigation before scoping |
| Blocked by | — |

## Goal

Ticket 06 shipped the Cognitive Complexity gate with per-kind caps set as a **first-pass** calibration
(`behavior 14`, `jsx 25` in `tools/code-complexity/config.ts`). This ticket investigates whether the
caps can be pushed further — looser where the current values over-flag, or re-shaped so the gate
better isolates genuinely-hard-to-read code — and re-sets them with evidence.

Do this in a fresh session. The full calibration data, the constraints that pinned the current caps,
and the open questions are in `research.md` beside this file.

## Blocking unknowns (resolve during the investigation)

- **How firm is the `useEtherscanRedirects` trip target?** The behavior cap is currently pinned at 14
  purely because that named deep-nested example scores CC 15 and "must trip." Pushing behavior looser
  requires deciding whether that example should still be the trip anchor. Owner: developer.
- **Should `jsx` be net-looser per-kind, or catch nested render bodies?** The current `jsx 25` fires on
  more render bodies (15) than the retired cyclomatic-30 cap (10). This is by design (CC's nesting
  penalty catches nested conditional rendering cyclomatic missed) but is a judgment to confirm. Owner:
  developer.
- **Is a high flat-decision-count function a real offender?** `useNavItems`' main `useMemo` callback
  scores CC 43 (oracle 32) from ~40 *flat* defaulting ternaries + boolean chains — genuinely complex,
  not wide-shallow. Decide whether the gate should flag such functions or whether the model needs a
  cap on flat-breadth vs. nesting. Owner: developer.

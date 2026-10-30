# 02 — `review-loop` skill: reviewer rounds, outcome from the PR, resolver dispatch, `needs-human` pause

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 02 of #3822 |
| Blocked by | T01 |

## What to build

A new `.agents/skills/review-loop/` skill, runnable by hand on any open PR. Each round: the reviewer runs the
repo's `review-changes` skill in `pr` mode under its tag through its own CLI headlessly in the background
(`first` on round 1, `follow-up` afterwards); the orchestrator reads the round's outcome from the PR — the
latest summary carrying the reviewer's footer — never from the CLI text; while `blocked`, it dispatches
`resolve-review pr --auto` (T01) in a fresh subagent, which fixes and pushes; a `needs-human` return pauses
the round: the verdict table and questions are shown in the terminal, a push notification fires (PR link,
number of questions), the developer answers, and the answers are resumed into the same resolver. The loop
ends `cleared`, or stops with a report on 3 rounds, a reviewer failure after one retry, or a timeout, with
the PR in a consistent pushed state. CI handling is T03; this ticket's loop treats `cleared` as the terminal
condition.

Everything Cursor-specific lives in one reviewer file under the skill; the skill body speaks of "the
reviewer" and takes `--reviewer <name>` defaulting to `cursor`, plus an optional model override.

## Acceptance criteria

- [ ] `.agents/skills/review-loop/SKILL.md` exists with valid frontmatter (`disable-model-invocation: true`,
  argument hint `[<PR url>] [--reviewer <name>] [--model <id>]`), and `reviewers/cursor.md` holds the
  binary, flags, 30-minute limit, failure detection, the retry rule and the tag.
- [ ] The reviewer invocation is `agent -p --trust --approve-mcps --output-format json
  "/review-changes pr --as cursor [--round follow-up]"`, run in the background and polled to completion;
  Cursor's default model unless a model override is given; the orchestrator makes no edits while it runs.
- [ ] Transport failures (non-zero exit, no output) get one retry; a review that ran gets none.
- [ ] The round's outcome is read from the PR: the latest footer-bearing summary for the reviewer's tag,
  `Blocked`/`Cleared` and the `needs human` count, via the `gh` commands `review-changes/gh-commands.md`
  already documents.
- [ ] The resolver is a fresh `general-purpose` subagent per round running `resolve-review pr --auto`; on a
  `needs-human` return the orchestrator prints the table and questions, sends a `PushNotification` with the
  PR link and the question count, waits, and resumes the same subagent with the answers.
- [ ] Bounds and stops: 3 review rounds; a reviewer failure after the retry; a timeout. Each ends with the
  branch pushed and a terminal report saying why. The loop never ends with an unanswered `needs-human`.
- [ ] The guard in `review-changes` ("another tag present → ask for a tag") is satisfied by always passing
  `--as <reviewer name>`; the skill says so.
- [ ] One dry run of the reviewer invocation from `reviewers/cursor.md` against this task's PR (#3823) posts a
  review with the `cursor` tag; the loop reads its outcome from the PR.
- [ ] `pnpm lint:doc-links` passes.

## Details

- Resolver contract: link T01's "Returning on `needs-human`" section rather than restating it.
- Resumption: name it harness-neutrally and point at Claude Code's `SendMessage` (spec, Implementation
  decisions).
- Leave an explicit, clearly marked seam for T03 (CI wait, CI fix, terminal condition becoming "cleared and
  green") — one sentence in the round description, no placeholder sections.
- Not offered from `create-pr` Mode C (spec FR1); `finalize-task` wires it in T05.

## Leaf worklist

- [ ] 1 `[agent]` Write `review-loop/SKILL.md`: inputs, round structure, outcome read from the PR, resolver
  dispatch, `needs-human` pause and resumption, bounds and report — skill: `writing-for-agents`
- [ ] 2 `[agent]` Write `review-loop/reviewers/cursor.md`: invocation, background run and polling, 30-minute
  limit, failure detection and the one retry, the tag — skill: `writing-for-agents`
- [ ] 3 `[agent]` Dry-run the reviewer invocation on PR #3823 and confirm the outcome is readable from the PR;
  run `pnpm lint:doc-links`

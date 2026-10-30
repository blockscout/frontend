# Reviewer: `cursor`

The Cursor CLI (`agent`) running the repo's `review-changes` skill headlessly. Tag: `cursor`, passed as
`--as cursor` on every run.

## Invocation

```bash
agent -p --trust --approve-mcps --output-format json [--model <id>] \
  "/review-changes pr --as cursor [--round follow-up]"
```

- `--round follow-up` on every round after the first; the first round passes no `--round`.
- `--model <id>` only when the loop was given one. Otherwise Cursor's default model.
- `--trust --approve-mcps` are mandatory: trust and MCP approval are per absolute path, so a fresh
  worktree prompts without them and a headless run hangs on the prompt.
- Run from the repo root, where Cursor loads `.agents/skills/` natively and the slash invocation attaches
  the skill.

## Background run and polling

The run exceeds the foreground command cap, so launch it in the background under a **30-minute limit**,
with stdout and the exit code captured to the scratchpad:

```bash
timeout 1800 agent -p --trust --approve-mcps --output-format json \
  "/review-changes pr --as cursor" > <scratchpad>/review-<round>.json 2> <scratchpad>/review-<round>.err
echo $? > <scratchpad>/review-<round>.exit
```

Record the start time first (`date -u +%FT%TZ`); the outcome check below compares against it. Poll until
the exit file exists. Edit nothing in the tree while polling.

## Failure detection

Read the exit code and stdout, then check the PR for a review posted since the start time whose body ends
in `— Reviewed by cursor …` (the `reviews` endpoint in
[`../../review-changes/gh-commands.md`](../../review-changes/gh-commands.md)).

| Observation | Meaning | Action |
| --- | --- | --- |
| Footer-bearing review newer than the start time | the review ran | read its outcome; the exit code is irrelevant |
| No such review, exit `124` | timeout | stop the loop |
| No such review, exit non-zero or empty stdout | transport failure | retry once, same invocation |
| No such review after the retry | reviewer failure | stop the loop |
| No such review, exit `0`, non-empty stdout | the agent ran but posted nothing | treat as transport failure |

A review that ran gets no retry, whatever the CLI reported: a second `first` round would post a duplicate
set of findings under the same tag.

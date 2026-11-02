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

The run exceeds the foreground command cap, so launch it as **one Bash call with `run_in_background: true`**
(the Claude Code flag `release` uses for the same kind of long command) under a **30-minute limit**, with
stdout and the exit code captured to the scratchpad. macOS ships no `timeout`, so the deadline is a shell
watchdog that kills the run and records exit `124` itself — the same code `timeout` would give:

```bash
agent -p --trust --approve-mcps --output-format json [--model <id>] \
  "/review-changes pr --as cursor [--round follow-up]" \
  > <scratchpad>/review-<round>.json 2> <scratchpad>/review-<round>.err &
pid=$!
( sleep 1800 && kill "$pid" 2>/dev/null && echo 124 > <scratchpad>/review-<round>.timeout ) &
watchdog=$!
wait "$pid"; rc=$?
kill "$watchdog" 2>/dev/null
[ -f <scratchpad>/review-<round>.timeout ] && rc=124
echo "$rc" > <scratchpad>/review-<round>.exit
```

Fill in `--round follow-up` and `--model <id>` per the Invocation rules above — this block is the one that
runs, so a round-2 copy without `--round follow-up` is a second `first` round. Record the start time first
(`date -u +%FT%TZ`); the outcome check below compares against it. The background call reports back when the
script exits; until then, poll for the exit file and edit nothing in the tree.

## Failure detection

Read the exit code and stdout, then check the PR for a review posted since the start time whose body ends
in `— Reviewed by cursor …` (the `reviews` endpoint in
[`../../review-changes/gh-commands.md`](../../review-changes/gh-commands.md)).

| Observation | Meaning | Action |
| --- | --- | --- |
| Footer-bearing review newer than the start time | the review ran | read its outcome; the exit code is irrelevant |
| No such review, exit `124` | timeout | stop the loop |
| No such review, exit non-zero other than `124`, or empty stdout | transport failure | retry once, same invocation |
| No such review after the retry | reviewer failure | stop the loop |
| No such review, exit `0`, non-empty stdout | the agent ran to completion but posted nothing | stop the loop; report that the agent finished without a footer-bearing review |

Rows are tested top to bottom; the first match rules. A review that ran gets no retry, whatever the CLI
reported: a second `first` round would post a duplicate set of findings under the same tag. Nor does an
agent that finished without posting — the retry would repeat the same thirty minutes to the same end.

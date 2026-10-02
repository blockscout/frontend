# 08 — One `release` skill around the CLI

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 08 of #3747 |
| Blocked by | T07 |

## What to build

The operator runs `/release prepare|alpha|publish` in a session; the skill wraps the CLI with the
human checkpoints and references `docs/RELEASING.md` instead of restating it. `prepare-release` and its
`fetch-release-prs.js` are removed; `slack-message-template.md` moves under the new skill and the staging
roll-up request keeps today's content, with breaking ENV changes derived from the notes' ENV section.

## Acceptance criteria

- [x] `.agents/skills/release/SKILL.md` (`disable-model-invocation: true`) with one section per phase:
      prerequisites (`check-github-cli`), the command, the stop-and-wait points (review the draft release
      and the docs diff before `alpha`; approve the resolved diff before any `--continue` or push after a
      pick conflict in `prepare` or `alpha`, then re-run the same command; approve the Slack draft), and
      the hotfix flow as prepare → alpha → publish, the same phases as a minor.
- [x] `.agents/skills/prepare-release/` is deleted; `release-prs-data.json` leaves `.gitignore`; no
      reference to `fetch-release-prs.js` remains (`pnpm lint:doc-links` passes).
- [x] `create-pr` reads `docs/PULL_REQUEST_TEMPLATE.md` and carries no section copy (verify; adjust only if
      a copy exists).
- [x] The skill replaces `prepare-release` in `.agents/AGENTS.md` / README listings and the `.claude/skills`
      symlinks per `.agents/README.md`.

## Leaf worklist

- [x] 1 `[agent]` Write the `release` skill, move the Slack template, delete `prepare-release`
- [x] 2 `[agent]` Verify `create-pr`, update listings and symlinks, run `pnpm lint:doc-links`

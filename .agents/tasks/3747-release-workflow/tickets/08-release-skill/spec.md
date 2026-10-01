# 08 — One `release` skill around the CLI

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 08 of #3747 |
| Blocked by | T07 |

## What to build

The operator runs `/release prepare|alpha|publish|pick` in a session; the skill wraps the CLI with the
human checkpoints and references `docs/RELEASING.md` instead of restating it. `prepare-release` and its
`fetch-release-prs.js` are removed; `slack-message-template.md` moves under the new skill and the staging
roll-up request keeps today's content, with breaking ENV changes derived from the notes' ENV section.

## Acceptance criteria

- [ ] `.agents/skills/release/SKILL.md` (`disable-model-invocation: true`) with one section per phase:
      prerequisites (`check-github-cli`), the command, the stop-and-wait points (review the draft release
      and the docs diff before `alpha`; approve the resolved diff before any `--continue` or push after a
      `pick` conflict; approve the Slack draft), and the hotfix flow as pick → alpha → publish.
- [ ] `.agents/skills/prepare-release/` is deleted; `release-prs-data.json` leaves `.gitignore`; no
      reference to `fetch-release-prs.js` remains (`pnpm lint:doc-links` passes).
- [ ] `create-pr` reads `docs/PULL_REQUEST_TEMPLATE.md` and carries no section copy (verify; adjust only if
      a copy exists).
- [ ] The skill replaces `prepare-release` in `.agents/AGENTS.md` / README listings and the `.claude/skills`
      symlinks per `.agents/README.md`.

## Leaf worklist

- [ ] 1 `[agent]` Write the `release` skill, move the Slack template, delete `prepare-release`
- [ ] 2 `[agent]` Verify `create-pr`, update listings and symlinks, run `pnpm lint:doc-links`

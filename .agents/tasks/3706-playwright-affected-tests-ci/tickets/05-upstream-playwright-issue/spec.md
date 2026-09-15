# 05 — File the upstream Playwright issue for `--only-changed --list` in CT mode

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 05 of #3706 |
| Blocked by | T01 |

## What to build

A public bug report on `microsoft/playwright`: `playwright test --only-changed=<ref> --list` reports zero
tests in component-testing mode, because list mode never sets up the CT plugin and so no component
dependencies are populated for the changed-file mapping. The agent drafts the body with a minimal
reproduction, the developer approves it, the agent posts it with `gh`, and the issue URL is linked from
`tools/playwright/CONTEXT.md` as the reason the tool has no dry-run command. Nothing else depends on this
ticket.

## Acceptance criteria

- [ ] `notes.md` holds the draft: title, body per the `create-issue` template (Description, Steps to
      Reproduce with a minimal standalone CT project — not this repo — Expected Behavior, Additional
      Context with the Playwright version), and the reproduction was actually run in a scratch directory
      with the pinned Playwright version before drafting.
- [ ] The draft names no people and links nothing private (public-safe per `create-issue`).
- [ ] The issue exists on `microsoft/playwright`, posted from the developer's `gh` account after their
      approval.
- [ ] `tools/playwright/CONTEXT.md` has a row "Why is there no `--list` / dry-run?" pointing at the issue
      URL. `pnpm lint:doc-links` clean.

## Skill inputs

### `create-issue`

- Source: this ticket's `notes.md` draft (leaf 1).
- Repository: `microsoft/playwright` (typed `owner/name`; not a `blockscout/*` repo, so no `--type`, no
  project board).
- Type: Bug (Playwright's own bug template; use its `[Bug]:` title prefix if `gh` requires the template).
- Labels: none (cannot be set on a foreign repo).
- Confirm step: the developer's approval in leaf 2 is the skill's "Confirm, create, stop" gate.

## Leaf worklist

- [ ] 1 `[agent]` Reproduce in a scratch CT project; write the draft to `notes.md`
- [ ] 2 `[human]` Approve (or edit) the draft
- [ ] 3 `[agent]` Post it — skill: `create-issue`; link from `CONTEXT.md`; doc-links

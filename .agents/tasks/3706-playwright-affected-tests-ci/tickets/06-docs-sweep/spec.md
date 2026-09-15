# 06 — Docs sweep: every reference to the old scripts points at `pnpm test:pw`

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 06 of #3706 |
| Blocked by | T03, T04 |

## What to build

A reader of any doc in the repo finds the new commands and nothing stale. `.agents/rules/tests-visual.md`
and `docs/CONTRIBUTING.md` describe running, scoping (`--changed`), and screenshot updates (`--docker`)
with the final flag set; `.vscode/tasks.json` pw tasks invoke the tool; the tool's `CONTEXT.md` gets its
final pass now that the gate/force-full pairing, sharding, and all flags exist. Docs-only, no `(human)`
criterion.

## Acceptance criteria

- [x] `.agents/rules/tests-visual.md` "File naming and location" block lists `pnpm test:pw`, `pnpm test:pw
      --changed`, `pnpm test:pw --docker <file> --update-snapshots`, and points at
      `tools/playwright/CONTEXT.md` for the rest; the "never commit local screenshots" rule stays. Its
      "Test projects" table notes that `default` is sharded ×3 in CI.
- [x] `docs/CONTRIBUTING.md`: the Playwright paragraph and the command table drop `test:pw:local` /
      `test:pw:ci`, keep `test:pw:docker[:deps]` as aliases, and mention `--changed`.
- [x] `.vscode/tasks.json`: every pw task and input option references only commands that exist
      (`test:pw`, `--docker`, `--changed`); the `pwArgs` presets that named `--affected` name `--changed`.
- [x] `tools/playwright/CONTEXT.md` final pass against `.agents/rules/docs.md`: the constraint that the
      gate's path list and `FORCE_FULL_PATHS` move together; the gotcha that `--only-changed` cannot see
      icons; where the JSON report is and what it is for (agent-readable outcomes + diff paths); the file
      map. Nothing that `--help` or the code already says.
- [x] `grep -rn "test:pw:local\|test:pw:ci\|detect-affected\|--affected\|pw\.sh" --exclude-dir=node_modules
      --exclude-dir=.git .` returns only `.agents/tasks/` hits.
- [x] `pnpm lint:doc-links`, `pnpm lint:cspell` clean.

## Leaf worklist

- [x] 1 `[agent]` `.agents/rules/tests-visual.md`, `docs/CONTRIBUTING.md`, `.vscode/tasks.json`
- [x] 2 `[agent]` `tools/playwright/CONTEXT.md` final pass; grep sweep; lint

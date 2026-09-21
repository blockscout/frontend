# 11 — Home page latest cross-chain transactions widget

| | |
| --- | --- |
| Parent spec | the task's `spec.md` → linked as `../../spec.md`, ticket 11 of #3722 |
| Blocked by | `T08` |

## What to build

The home page's latest cross-chain transactions widget shows its narrow headerless table on mobile,
scrolling horizontally inside the card, instead of the stacked list. It lands as a commit of its own so
that the designer's answer to `Q01` can be a single revert.

## Acceptance criteria

How to verify: `pnpm dev:preset multichain`, open `/` at 375px

- [ ] `LatestCrossChainTxs` renders its table on every viewport inside `TableContainerScrollable`, with no `hideFrom` / `hideBelow` split.
- [ ] `TransactionsCrossChainListItem` is deleted and nothing imports it.
- [ ] The commit touches nothing outside the widget, the deleted list item and their Playwright files, so reverting it restores the list layout without restoring a shared primitive.
- [ ] Playwright: the widget's `+@mobile` coverage is dropped with its `*_mobile_*` screenshots; the remaining cases pass under `pnpm test:pw --docker`.
- [ ] `pnpm lint:tsc` and `pnpm lint:eslint:fix` pass.
- [ ] `(human)` At 375px the widget's table scrolls inside its card, the card does not overflow the page, and the "view all" link and the socket notice are where they were.

## Details

`Q01` does not block this ticket — it is asked once the result is on a preview deployment. An answer of
"revert" is a new ticket, not an edit to this one.

The developer cleared the agent to run the Docker runner with `--update-snapshots` for this task;
reviewing the resulting diff stays with the developer.

## Leaf worklist

- [ ] 1 `[agent]` Convert the widget to the scrollable table and delete `TransactionsCrossChainListItem`
- [ ] 2 `[agent]` Prune the widget's mobile Playwright coverage, run its files in Docker, regenerate any desktop baseline that changed
- [ ] 3 `[human]` Review the screenshot diff and check the home page at 375px

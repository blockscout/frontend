# 01 — Router stand-in that re-renders on push, and characterization tests for the hook

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 01 of #3697 |
| Blocked by | none |

## What to build

A reusable Vitest router stand-in for `next/router` that holds `query` and `pathname` as live state:
`push` (shallow) replaces the query and re-renders every hook or component that called `useRouter`,
as the real Next router does. Today's `useQueryWithPages.spec.ts` mocks `useRouter` with a frozen
`query` and a `push` spy, so it can only assert final state, never how many requests or renders one
action costs (FR12).

The existing hook spec is rewritten on the stand-in and extended with per-action counts — API requests
(from `fetchMock`) and renders (a counter around `renderHook`) — asserting **today's** numbers: "First"
from page 3 costs 3 requests, a filter change on page 3 costs 2, "Prev" to page 1 refetches with a
skeleton, an unrelated query change re-renders. These are the characterization baseline that ticket 02
flips to the target numbers; building the harness against known code proves the harness before the
hook changes underneath it.

## Acceptance criteria

- [ ] A router stand-in lives under `vitest/utils/` (next to `flushPromises`) with a `push` that
      updates query state, resolves, and re-renders consumers; `pathname` and `query` readable; a
      `setQuery` helper for simulating an external URL change (tab switch, back button).
- [ ] The stand-in is installed with `vi.mock('next/router', …)` from the spec, not globally, so other
      specs keep their current mocking.
- [ ] `useQueryWithPages.spec.ts` no longer reads `mockRouterPush.mock.calls` to learn the query; it
      reads the stand-in's query, and every existing scenario still passes.
- [ ] New scenarios assert request count and render count per action with today's values, one
      scenario per row of the parent spec's measurement table.
- [ ] Unit tests for `src/shared/pagination` green; lint and tsc green.

## Details

The counts asserted here are deliberately the current, wasteful ones. Ticket 02 edits the expected
values, not the scenarios. Put each count assertion on its own line with a comment naming the
parent-spec row, so ticket 02's diff is one number change per row.

Render counting: a counter incremented inside the `renderHook` callback; `flushPromises` between steps
as the current spec does.

## Leaf worklist

- [x] 1 `[agent]` Write the router stand-in under `vitest/utils/` with its own small spec
- [x] 2 `[agent]` Rewrite `useQueryWithPages.spec.ts` on the stand-in, keeping every existing scenario
- [x] 3 `[agent]` Add the per-action request/render count scenarios with today's numbers

# 09 — Close the sweep: whole-repository lint and leftovers

| | |
| --- | --- |
| Parent spec | the task's `spec.md` → linked as `../../spec.md`, ticket 09 of #3901 |
| Blocked by | T03, T04, T05, T06, T07, T08 |

## What to build

The task's whole-repository guarantees hold once the six sweeps have landed: both lint checks pass
everywhere (requirement 11), no in-scope comment block was left unjudged (12, 13), every document pointer
to a header comment is valid (17), and the branch changed no code behaviour (18).

## Acceptance criteria

- [ ] `pnpm lint:eslint` passes on the whole repository.
- [ ] A re-run of the census lists no block that a sweep ticket did not judge: every remaining row passes the rule, and what does not is trimmed or removed here.
- [ ] `pnpm lint:doc-links` passes, and every "header comment" mention in a `CONTEXT.md` or a rule names a header that exists and holds what the mention says. The three pointers in `vitest/CONTEXT.md` are among them.
- [ ] Against `origin/main`, the branch's diff holds only comment and document changes, apart from the lint rule, its spec and its registration; `pnpm lint:tsc` and `pnpm test` pass.

## Details

- [`census.cjs.txt`](census.cjs.txt) is the script that produced the sweep tickets' worklists; the `.txt`
  suffix keeps it out of ESLint. Copy it to a temporary `census.cjs` and run it from the repository
  root: `node <tmp>/census.cjs <file list> <output tsv>`, where the file list is the
  output of `git ls-files` saved to a temporary file. It prints a per-area table and writes one row per
  block. `public/` rows are out of scope.
- Out of scope, per the developer's answers in `questions.md` (Q01, Q02): `public/`, and files that are
  not JavaScript or TypeScript.

## Leaf worklist

- [x] 1 `[agent]` Run the whole-repository lint and fix what it reports
- [x] 2 `[agent]` Re-run the census and judge the remaining rows
- [x] 3 `[agent]` Check the document pointers and the diff for code changes

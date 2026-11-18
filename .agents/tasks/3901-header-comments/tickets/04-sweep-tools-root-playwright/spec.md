# 04 — Sweep the remaining tools, the root configs, `playwright/` and `deploy/tools/`

| | |
| --- | --- |
| Parent spec | the task's `spec.md` → linked as `../../spec.md`, ticket 04 of #3901 |
| Blocked by | T01, T02 |

## What to build

Every comment block in every directory under `tools/` except `mutation-testing` and `code-complexity`, the JavaScript and TypeScript files at the repository root, `playwright/`, `deploy/tools/` and `.agents/` outside `.agents/tasks/` that is at the top of a file, is three lines or longer, or is a
`/** */` block either passes the "Comments" section of `.agents/rules/code-quality.md` or is trimmed or
removed, per requirements 12–18 of the spec. Spec files and comment runs inside function bodies are
included.

## Acceptance criteria

- [ ] Every row of [`research.md`](research.md) has been judged against the rule: the block passes as it is, or it is trimmed, moved or removed.
- [ ] No `/** */` block is left in these paths, apart from a single-line `/** @type … */` annotation in a JavaScript file.
- [ ] No commented-out code is left in these paths.
- [ ] `pnpm lint:eslint tools/design-readout tools/playwright tools/dev-server tools/profiling tools/cli tools/release playwright deploy/tools` passes, and so does `pnpm lint:eslint` on each root file `research.md` lists.
- [ ] `pnpm lint:doc-links` passes, and no document points at a header comment this ticket removed.
- [ ] The diff touches comments and documents only: `pnpm lint:tsc` passes, and the unit tests of the touched files pass.

## Details

- [`research.md`](research.md) lists the blocks, counted when the tickets were written. It is a starting
  list, not the scope: a block it misses in these paths is still in scope.
- The decision order for one block: commented-out code is deleted (16); a `/** */` block is removed, or
  rewritten as an ordinary comment when its content passes the rule (13); cross-file narration is
  deleted, and a line of it moves to the area's `CONTEXT.md` only under requirement 14; a block that
  neither clearly passes nor clearly fails is deleted unless it records a trap someone hit (15).
- A header comment survives only on a module imported from outside its own directory (requirement 3).
  Check the importers before keeping one.
- Out of scope, per the spec and the developer's answers in `questions.md`: one- and two-line comments
  that are not at the top of a file, licence headers, `@vitest-environment` pragmas, ESLint and
  TypeScript directives, `public/`, and files that are not JavaScript or TypeScript.
- Ticket 02 may already have trimmed comments in `eslint.config.mjs`; re-read the file before working its rows.

## Leaf worklist

- [x] 1 `[agent]` Work the rows of `research.md` file by file
- [x] 2 `[agent]` Move the lines that requirement 14 keeps into the area's `CONTEXT.md`, and correct the documents that point at a removed header
- [x] 3 `[agent]` Run the lint, type and test checks from the acceptance criteria

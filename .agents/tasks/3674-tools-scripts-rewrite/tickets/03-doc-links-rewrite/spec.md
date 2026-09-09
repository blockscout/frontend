# 03 — Doc-link checker as `tools/doc-links/`

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 03 of #3674 |
| Blocked by | none |

## What to build

`pnpm lint:doc-links` behaves **identically** to today — same files walked, same references checked, same
findings in the same order with the same messages, same summary line, same exit codes — but runs from
`tools/doc-links/`: TypeScript, flat files split by concern, type-checked by `pnpm lint:tsc`, with a spec per
module, and every function inside the cognitive cap.

This is the task's one real decomposition target. `checkFile` scores cognitive 58 against a cap of 20 today,
because one function holds the line loop, the backtick-path branch with its four report cases and the
markdown-link branch with its anchor lookup. Splitting it along those seams is the point of the ticket.

The check surface is **unchanged here** — still the three agent config roots plus files named exactly
`CONTEXT.md`. Widening it is ticket 04, which lands in the collection module this ticket creates.

## Acceptance criteria

- [x] `pnpm lint:doc-links` on the current tree prints the same summary line with the same file count and
      exits 0, as the `.mjs` does.
- [x] Against a deliberately broken reference of each class, the message is character-identical to the
      `.mjs`'s: unresolved path, unresolved link target, missing heading anchor, and shorthand-write-in-full.
      The failure footer still restates the illustration convention.
- [x] Every exemption still holds: fenced blocks, `<placeholder>` segments, the table-row arrow form, backtick
      spans that are not paths, non-slash bracket text, `https:` / `mailto:` / `#` links, and the
      `.agents/tasks` and `.claude/worktrees` exclusions.
- [x] A symlinked entry point still resolves its relative links from the file's realpath, and a file reached
      twice through a symlink is still reported once.
- [x] `./tools/code-complexity/run.sh tools/doc-links` reports every function inside the cognitive cap and
      under CRAP 80.
- [x] `pnpm lint:tsc` passes; `pnpm test:vitest` runs a spec per module.
- [x] `tools/scripts/check-doc-links.mjs` is deleted, and the compiled output is git-ignored and uncommitted.
- [x] `tools/doc-links/CONTEXT.md` exists as a file map and has a line in the per-directory list in
      `.agents/AGENTS.md` — and `pnpm lint:doc-links` checks both, closing the loop on itself.
- [x] `tools/code-complexity/select/scope.spec.ts` passes: the assertion naming the deleted
      `tools/scripts/check-doc-links.mjs` now names `tools/mutation-testing/eslint/well-formed-disable.mjs`.

## Details

**The split.** Per the parent spec: surface collection, line stripping, reference resolution, per-line
checking, reporting, entry. The concerns are already visible in the `.mjs` as clusters of top-level
functions — collection is `collectMarkdown` plus the roots/exclusions/tracked-files setup, stripping is
`withoutFences` and `withoutIllustrations`, resolution is `resolves` / `shorthandFor` / `nearby` /
`isPlaceholder` / `slugify` / `headingSlugs`. Splitting `checkFile` is the work that is not a move.

**`ROOT` changes depth once compiled.** The `.mjs` resolves the repo root as `../..` from its own directory.
Compiled into a `dist/` under `tools/doc-links/`, the depth from the emitted file differs — get the root from
somewhere that survives compilation rather than counting segments from the entry.

**Order of findings matters.** The acceptance criteria compare output to the `.mjs`, so the walk order — roots
in `ROOTS` order, then the tracked `CONTEXT.md` list, first-seen realpath winning — has to be preserved
through the split.

**Rationale stays in header comments.** The `.mjs` opens with four paragraphs on why the check exists, why
illustrations are exempt and why `e.g.` deliberately is not, and carries a per-function comment for each
judgement call. Those move into the per-file headers of the modules they now belong to; they do not migrate
into the `CONTEXT.md`. `ILLUSTRATION_FORMS` remains the only statement of what the marks are, and is still
printed on failure.

**The `CONTEXT.md`.** A file map plus what an editor here must keep true, under `.agents/rules/docs.md` — no
restating control flow, no line numbers, and the gotcha test applies. A new one needs its line in
`.agents/AGENTS.md`; that list is alphabetical, so the entry sits between `tools/dev-server/` and
`tools/mutation-testing/`.

**Own tsconfig and wrapper.** `tools/code-complexity/tsconfig.json` and `run.sh` are the shape;
`pnpm lint:doc-links` becomes the wrapper. Note the tool is a CI check (`checks.yml`), so the compile step
must work from a clean checkout with no prior build.

**`scope.spec.ts`.** `.mjs` stays a legitimate in-scope extension, so swap the string, not the predicate.
The assertion here is the one under "includes the plain-JS extensions", and
`tools/mutation-testing/eslint/well-formed-disable.mjs` is the only `.mjs` left under `tools/` after this
task. Ticket 02 handles the separate assertion under "includes the repo tooling under `tools/`".

## Leaf worklist

- [x] 1 `[agent]` Create `tools/doc-links/` and move the checker across as flat modules — collection,
      stripping, resolution, checking, reporting — with a separate CLI entry file
- [x] 2 `[agent]` Decompose the per-file check so every function is inside the cognitive cap, preserving
      finding order and messages
- [x] 3 `[agent]` Add `tools/doc-links/tsconfig.json` and the compile-on-run `run.sh`; repoint
      `lint:doc-links` and gitignore the compiled output
- [x] 4 `[agent]` Write a spec per module, including one broken reference of each reported class and each
      exemption form
- [x] 5 `[agent]` Delete `tools/scripts/check-doc-links.mjs` and swap the stale path in
      `tools/code-complexity/select/scope.spec.ts`
- [x] 6 `[agent]` Write `tools/doc-links/CONTEXT.md` and register it in `.agents/AGENTS.md`
- [x] 7 `[agent]` Verify: output identical to the `.mjs` on the current tree and on injected breakages,
      `pnpm lint:tsc`, `pnpm test:vitest`, and the complexity gate on `tools/doc-links`

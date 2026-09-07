---
description: Rules for CONTEXT.md and other documentation about the code
paths:
  - "**/CONTEXT.md"
  - "**/docs/**/*.md"
globs: "**/CONTEXT.md,**/docs/**/*.md"
alwaysApply: false
---
# Documenting the code

The code is the only source of truth for what it does. A doc that restates it is a second source that
nobody executes, so it drifts within weeks and then the reader has to guess which one is lying. Write
only what the code cannot say.

Applies to every doc about the code: a `CONTEXT.md`, a file under `docs/`, a module `README.md`.

## What earns a line

- **Navigation.** Which directory or file to open for what, so the reader skips a repo-wide search.
  Earned only by an area large or nested enough that the split of responsibility is unclear on a
  first read. Two or three files need no map.
- **Recurring questions.** How to read the tool's output, which command answers a given question, where a
  failure is explained. Prefer a table of question to location over prose.
- **Local vocabulary.** Terms that mean something only in this area. Project-wide terms go in
  `.agents/GLOSSARY.md` (`update-glossary` skill).
- **Constraints.** What an editor here must keep true, and what breaks if they don't.
- **Gotchas**, under the test below.
- **Pointers to the why.** Decisions with real alternatives belong in an ADR (`./adr.md`), local or
  repo-wide. Link to it; do not summarise it.

## What the code and the environment already say

Leave these out. Every one of them has a source that cannot go stale:

- Control flow, signatures, prop lists, types, algorithms. The reader opens the file.
- Anything one lookup gives: `--help` output, `package.json` scripts, the directory listing, env vars
  (`docs/ENVS.md`).
- What the change replaced. The commit and the PR carry that.
- Anything another doc states. Link instead, so the fact has one home.

## The gotcha test

"Not obvious" is subjective, so bind it. All three:

1. A competent reader of this code would get it wrong.
2. Someone was actually caught: you, CI, a reviewer, or production.
3. Stating it takes a sentence or two, and does not require describing how the code works.

Write the surprise and its consequence, not the mechanism.

```md
BAD — describes the code; the file says this, and says it accurately
`generate.ts` runs vitest with a config that writes coverage to a temp dir, then `read.ts`
parses `coverage-final.json` and maps ranges onto functions.

GOOD — the surprise and what it costs
A `behavior` function with no co-located spec reads 0% coverage. Simplifying it lowers COG, not CRAP.
```

If it fails the test, it belongs in the code as a name, a structure change, or (rarely) a comment.
See `./code-quality.md` for when a comment is allowed.

## Keep it maintainable

- Point at directories and files, not at symbols or line numbers.
- Prefer facts that survive a refactor: ownership, constraints, intent.
- Changing code a doc describes: fix or delete the stale lines in the same change.
- Shorter is more likely to stay true. Cut a line rather than qualify it.

## Adding a new doc

A directory earns a `CONTEXT.md` when getting oriented in it takes real reading and the layout does not
speak for itself. Offer it; do not write one unasked.

A new `CONTEXT.md` needs a line in the per-directory list in `.agents/AGENTS.md`. Cross-references are
checked by `pnpm lint:doc-links`.

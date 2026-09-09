# Doc-link checker — context

`pnpm lint:doc-links` resolves the cross-references in the agent instruction surface — markdown links,
heading anchors, and the file and directory paths written in backticks. A CI check in
`.github/workflows/checks.yml`.

## Files

| File | Role |
|---|---|
| `surface.ts` | Which files are checked: the walked config roots, the exclusions, and every markdown file in and below a directory that carries a `CONTEXT.md`, taken from the tracked-file list. Widening the check surface happens here. |
| `strip.ts` | Blanks the regions of a line that are not references — fenced blocks, and the illustration marks. Owns `ILLUSTRATION_FORMS`. |
| `resolve.ts` | Turns a written reference into the file it names, and judges when a path that resolves nowhere is a break (shorthand, neighbour, top-level segment) rather than prose that looks like one. |
| `check.ts` | One file in, its findings out. The two reference forms — backtick path, markdown link — are checked here. |
| `report.ts` | Findings to output lines and an exit code. Free of `console` so a spec can assert both. |
| `index.ts` | CLI entry: repo root, tracked files, the loop, the printing. |
| `run.sh`, `tsconfig.json` | Compile-on-run wrapper; the compiled output is git-ignored. |

## What an editor here must keep true

- **`ILLUSTRATION_FORMS` is the only statement of the exemption marks**, and it is printed on failure.
  Teaching the checker a new mark without amending that string leaves authors reading a footer that
  contradicts the tool.
- **The repo root comes from git, not from hops counted off the entry file.** The entry runs compiled, one
  directory deeper than its source, so a relative count is right in a spec and wrong in production.
- **Every path this directory's own docs write is checked by the tool they document.** A rename here that
  misses `CONTEXT.md` fails the run.

## Gotchas (these bit us; don't re-learn them)

- **An `e.g.` is not an exemption.** Prose introducing a real file as an example is the common case, and
  exempting it would leave exactly those references unprotected against a rename. An example naming no real
  file takes a `<placeholder>` segment instead.
- **A false positive is more expensive than a miss.** Noise trains everyone to stop reading the output, so a
  path that names a shape rather than a location (`types/api.ts`, `hooks/`) is deliberately not reported —
  the judgements in `resolve.ts` exist to keep it that way.
- **`.cursor/rules/*.mdc` and `.claude/CLAUDE.md` are symlinks onto files under `.agents`.** Both the
  de-duplication and the realpath-relative resolution depend on that; drop either and every finding in a
  symlinked file is reported twice, or its relative links resolve from the wrong directory.

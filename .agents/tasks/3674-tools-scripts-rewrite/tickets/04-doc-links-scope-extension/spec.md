# 04 — Extend the check surface to every markdown file beside a `CONTEXT.md`

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 04 of #3674 |
| Blocked by | T03 |

## What to build

`pnpm lint:doc-links` stops checking only the file named `CONTEXT.md` and starts checking every markdown
file in and below any directory that contains one, nested record subdirectories included. A directory that
documents itself across several files currently gets one of them checked, and the relative references inside
the others can break silently — that is the gap this closes.

`src/toolkit/package/` is exempt: it is the published npm package wrapper, and its readme addresses package
consumers rather than agents.

Eight files enter the surface today — the two ADRs and three docs under `tools/code-complexity/`, and the
three docs under `tools/mutation-testing/`. Two of their references do not resolve, and this ticket fixes
them.

## Acceptance criteria

- [x] `pnpm lint:doc-links` exits 0 and its summary line reports a file count eight higher than before this
      ticket.
- [x] The newly-checked set is exactly the markdown in and below a `CONTEXT.md` directory:
      `tools/code-complexity/adr/*.md`, `tools/code-complexity/docs/*.md` and
      `tools/mutation-testing/docs/*.md`.
- [x] `src/toolkit/package/README.md` is not checked, and the exemption is a path in the existing exclusion
      list — not a `README.md` filename rule.
- [x] The `./run.sh` references in `tools/code-complexity/docs/RUNNING.md` and
      `tools/mutation-testing/docs/RUNNING.md` resolve, fixed in the docs; the resolver still resolves `./`
      against the file's own directory and nothing else.
- [x] Breaking a relative reference inside one of the newly-covered files now fails the check with the
      ordinary unresolved-path message.
- [x] A directory with a `CONTEXT.md` and no other markdown is unaffected, and a file already reached through
      the `.agents` / `.claude` / `.cursor` walk is still checked once.
- [x] `pnpm lint:tsc`, `pnpm test:vitest` and `./tools/code-complexity/run.sh tools/doc-links` all pass, with
      the collection module's spec covering the widened surface and the exemption.

## Details

**Where it lands.** The collection step of `tools/doc-links/` — the same module ticket 03 creates for the
existing surface. The tracked-file list the tool already reads for the `CONTEXT.md` list and for shorthand
detection is enough to derive the directories; no second git call is needed.

**Why the docs get fixed, not the resolver.** Both bad references write `./run.sh` from a `docs/`
subdirectory where the file sits one level up. Resolving relative paths against the `CONTEXT.md` directory
instead would make them pass, but `./` means "beside this file" everywhere else in the instruction surface,
and special-casing it would weaken exactly the check this extension exists to add.

**Why the exemption is a path.** `.agents/rules/docs.md` governs a module `README.md` as a doc kind it
expects to be checked. A filename rule would pre-emptively unprotect every file that rule covers, so the
exclusion names `src/toolkit/package/` and nothing more.

**Nesting.** `tools/code-complexity/` carries both an `adr/` and a `docs/` subdirectory, so the collection has
to recurse rather than read one level. `SKIPPED_DIRS` still applies.

## Leaf worklist

- [x] 1 `[agent]` Widen the collection step to every markdown file in and below a `CONTEXT.md` directory,
      recursing into nested subdirectories, and add `src/toolkit/package/` to the exclusion list as a path
- [x] 2 `[agent]` Fix the two `./run.sh` references in `tools/code-complexity/docs/RUNNING.md` and
      `tools/mutation-testing/docs/RUNNING.md`
- [x] 3 `[agent]` Extend the collection module's spec: the widened surface, the nested subdirectory, the
      `src/toolkit/package/` exemption, and the once-only guarantee for a file the config walk already reached
- [x] 4 `[agent]` Verify: `pnpm lint:doc-links` passes with the higher file count, an injected breakage inside
      a newly-covered file is caught, and `pnpm lint:tsc` / `pnpm test:vitest` / the complexity gate all pass

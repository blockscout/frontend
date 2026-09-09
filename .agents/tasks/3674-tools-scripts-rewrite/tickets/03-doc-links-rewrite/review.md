# Review — tickets/03-doc-links-rewrite · uncommitted

## Rounds

- **1** — 2026-09-09, Cursor Grok 4.6. blocker 0 · major 0 · nit 4. Outcome: cleared.

## Findings

| id | severity | axis | location |
| --- | --- | --- | --- |
| F1 | nit | standards | `tools/doc-links/check.ts:26` |
| F2 | nit | standards | `tools/doc-links/surface.ts:14` |
| F3 | nit | standards | `tools/doc-links/resolve.ts:53` |
| F4 | nit | standards | `tools/doc-links/surface.ts:9` |

### F1 · nit · standards · `tools/doc-links/check.ts:26`

**Claim.** `const looksLikePath = (target: string) =>` is a top-level function with no declared return type. Every other top-level helper in this directory annotates one. typescript.md, Return types: "When declaring functions on the top-level of a module, declare their return types."

**Fix.** Annotate `: boolean`.

**Status:** open

> **resolve-review, round 1:** fix — `looksLikePath` now declares `: boolean`. Promoted from nit at Gate 1.

### F2 · nit · standards · `tools/doc-links/surface.ts:14`

**Claim.** `const isExcluded = (rel: string) =>` is a top-level function with no declared return type. Same rule as F1.

**Fix.** Annotate `: boolean`.

**Status:** open

> **resolve-review, round 1:** fix — `isExcluded` now declares `: boolean`. Promoted from nit at Gate 1.

### F3 · nit · standards · `tools/doc-links/resolve.ts:53`

**Claim.** `// GitHub's heading slug: lowercase, drop all but word chars, spaces and hyphens, then spaces to hyphens.` restates the next five transforms. code-quality.md Comments: a comment is allowed only when it explains *why* the obvious reading is wrong — not when it narrates the next lines.

**Fix.** Keep the GitHub-slug why; drop the restatement.

**Status:** open

> **resolve-review, round 1:** fix — trimmed to `// GitHub's heading slug.`, keeping the why (the chain
> mirrors an external algorithm) and dropping the narration, which was also inaccurate: it omitted the
> backtick strip and the trim. Promoted from nit at Gate 1.

### F4 · nit · standards · `tools/doc-links/surface.ts:9`

**Claim.** Possible Dead Scaffolding — `export const ROOTS` and `export const EXCLUDED` are used only in this file; no importer (the spec imports `collectMarkdown` / `collectSurface` / `contextFiles` / `dedupeByRealPath`). smells.md: ESLint catches unused locals, not unused exports. Sibling `tools/code-complexity/select/scope.ts` keeps `ROOTS` unexported.

**Fix.** Drop `export`; leave them module-private.

**Status:** open

> **resolve-review, round 1:** fix — `ROOTS` and `EXCLUDED` are module-private now. Confirmed no importer
> outside `surface.ts`; ticket 04 widens the surface inside this module, so it will not need them exported
> back. Promoted from nit at Gate 1.

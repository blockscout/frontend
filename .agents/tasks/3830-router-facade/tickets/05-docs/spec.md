# 05 — Instruction set and rule docs reference the facade

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 05 of #3830 |
| Blocked by | T04 |

## What to build

Every place an agent or developer is told how to route now points at the facade, not at Next.js primitives.
`architecture.md` names `src/shared/router/` as the routing entry point (the facade hooks, `route()`, the
Next adapter as the one framework-coupled module) and the toolkit router context. `code-quality.md`'s Links
rule names `src/shared/router/routes` alone. `tests-visual.md` describes router injection through
`hooksConfig.router` → provider, not a `next/router.useRouter()` mock. The `add-new-page` skill and its
templates import `useRouter` from the facade. No code changes.

## Acceptance criteria

How to verify: read the diff.

- [ ] `grep -rn "next/router\|nextjs-routes\|next/navigation" .agents/rules .agents/skills/add-new-page`
      matches only the `routes:generate` line in `add-new-page/SKILL.md` (the generator is still
      `nextjs-routes`) and nothing that tells a reader to import from those modules.
- [ ] `.agents/rules/architecture.md`: the directory table or stack section carries the facade as the routing
      entry point; the Pages Router row stays.
- [ ] `.agents/rules/code-quality.md` Links rule: `src/shared/router/routes` is the one named utility; the
      route-list pointer to `nextjs-routes.d.ts` stays.
- [ ] `.agents/rules/tests-visual.md` "Environment and date": the router line describes `hooksConfig.router`
      feeding the toolkit router provider in `TestApp`.
- [ ] `add-new-page/templates/detail/Page.tsx.tmpl` imports `useRouter` from `src/shared/router/useRouter`;
      the commented example in `tabs/PageWithTabs.tsx.tmpl` reads the same way.
- [ ] `pnpm lint:doc-links` passes; the `.agents/` reference check in `.agents/README.md` is honoured.
- [ ] `(human)` The doc wording is reviewed before the commit.

## Details

Read `.agents/rules/docs.md` before editing any of these, and `.agents/README.md` before touching anything
under `.agents/` (dual-frontmatter rules contract, per-file symlink for Cursor). Point at code by symbol or
module name, never by copying values. The toolkit README section landed in ticket 01; the Vitest helper
header comments landed in ticket 04 — do not redo them here.

## Leaf worklist

- [ ] 1 `[agent]` `architecture.md`, `code-quality.md`, `tests-visual.md`
- [ ] 2 `[agent]` `add-new-page` SKILL.md wording and the two templates
- [ ] 3 `[agent]` `pnpm lint:doc-links`; present the diff for review

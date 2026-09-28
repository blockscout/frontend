# 01 — Rubric: the standards rule set

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 01 of #3720 |
| Blocked by | none |

## What to build

`tools/review-screen/rubric.ts`: the `Rule` type and a hand-written array of 8–10 conventions that
linters cannot catch, drafted from `.agents/rules/*.md`, `.agents/skills/review-changes/smells.md` and the
`CONTEXT.md` files. Each rule has an `id`, the rule file it cites (repo-relative path), a file glob, a
yes/no question phrased so that a high probability means *breach*, and structured criteria the model
receives as `noul` criteria: `examples` (what a breach looks like → `criteria.true`) and `not_for` (the
similar cases that are not a breach → `criteria.false`). The file is consumed only by the tool; nothing else
imports it. The set is approved by the developer before ticket 02 starts.

## Acceptance criteria

How to verify: read `tools/review-screen/rubric.ts`

- [ ] 8–10 rules; every `id` unique, kebab-case; every cited rule file exists in the repo.
- [ ] No rule duplicates a check ESLint, `tsc` or cspell already runs (`code-quality.md` names them).
- [ ] Each question is a single yes/no condition, phrased so that yes = breach (per the `noul` guidance:
      no "and" conditions, no inverted phrasing).
- [ ] Each rule's `examples` and `not_for` are JSON objects/arrays or short strings, never prose paragraphs.
- [ ] A vitest spec asserts: ids unique, cited files exist, globs are valid patterns, rule count in range.
- [ ] `(human)` Developer approves the rule set (the wording, the globs and the counterexamples).

## Details

- `Rule` shape (the tool in ticket 02 imports it, so land the type here):

  ```ts
  interface Rule {
    id: string;          // 'no-comments', 'default-only-config-export', …
    cites: string;       // '.agents/rules/code-quality.md'
    glob: string;        // 'src/**/*.{ts,tsx}'
    question: string;    // 'Does the changed code add a comment that explains what the code does?'
    examples: EntryType; // → noul criteria.true
    not_for: EntryType;  // → noul criteria.false
  }
  ```

  `EntryType` is the SDK's (`@typesafe-ai/sdk`); until ticket 02 adds the dependency, declare a local
  structural equivalent (`string | JSON object | JSON array`) and swap it in ticket 02.
- Candidate sources, in priority order: `code-quality.md` (comments ban and its one exception, magic
  numbers, naming), `typescript.md`, `design-system.md`, `src/config/CONTEXT.md` (default-only exports,
  envs read only in config modules), `src/api/CONTEXT.md`, `smells.md` (Dead Scaffolding, Cloned-Sibling
  Leftovers, Effect Escape Hatch, Middle Man). Pick what a per-file hunk read can actually judge — a
  cross-file smell (Shotgun Surgery, Duplicated Code) cannot be scored from one file's hunks.
- Globs are matched against repo-relative paths; a rule for `.agents/**` prose is allowed if a rule file
  (`docs.md`, `prose-smells.md`) backs it.

## Leaf worklist

- [x] 1 `[agent]` Draft `rubric.ts` with the `Rule` type and the rule array, plus `rubric.spec.ts`
- [x] 2 `[agent]` Add the new words (`noul`, `typesafe`, `jev`) to `cspell.jsonc` where the spec or rubric trips it

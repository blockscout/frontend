# 02 — Custom ESLint rule for the comment length cap and the JSDoc ban

| | |
| --- | --- |
| Parent spec | the task's `spec.md` → linked as `../../spec.md`, ticket 02 of #3901 |
| Blocked by | none |

## What to build

`pnpm lint:eslint` reports a comment longer than 8 prose lines and any `/** */` block, per requirements 9
and 10 of the spec. Both checks are one custom ESLint rule with its own spec, registered in
`eslint.config.mjs` the way `strykerDisableRule` is.

## Acceptance criteria

- [ ] A comment of more than 8 prose lines is reported whatever its delimiter and position: a run of consecutive `//` lines, a `/* */` block, at top level, inside a function body, inside JSX, in a spec file.
- [ ] Indented call-sample lines and bare separator lines are not counted towards the 8.
- [ ] A `/** */` block is reported. A single-line `/** @type … */` annotation in a JavaScript file is not; the same annotation in a TypeScript file is.
- [ ] Licence headers, `@vitest-environment` pragmas and ESLint or TypeScript directive comments are not reported.
- [ ] The rule's spec covers each case above, and passes.
- [ ] The rule is registered at `error` for every linted JavaScript and TypeScript file, and `pnpm lint:eslint` on the files this ticket adds or edits passes.

## Details

- Model the file layout, the registration and the spec on `tools/mutation-testing/eslint/well-formed-disable.mjs`
  and its spec. The new rule is not specific to one tool, so it lives under `tools/eslint/`.
- The whole-repository `pnpm lint:eslint` run stays red after this ticket: the sweep tickets remove the
  violations, and ticket 09 checks the full run (requirement 11). The developer accepted this (Q03 in
  `questions.md`): all tickets land in one pull request, and the pre-commit hook lints staged files only.
- This ticket edits `eslint.config.mjs`. Clear what the new rule reports in that file here, by the rule
  ticket 01 writes if it has landed, otherwise by trimming to the cap only.
- `public/` is ignored by ESLint and stays so.
- Add no new document for the rule. If an existing document lists the custom lint rules, add it there.

## Leaf worklist

- [x] 1 `[agent]` Write the rule and its spec
- [x] 2 `[agent]` Register the rule in `eslint.config.mjs` and clear what it reports in the files this ticket touches

# ESLint alternatives — October 2026 update (Oxlint + Oxfmt)

Follow-up to [`eslint-alternatives.md`](./eslint-alternatives.md) (2026-07-10). Scope: what changed for **Oxlint** in the three months since, and whether adopting **Oxfmt** as the formatter (dropping our `@stylistic` / React JSX-spacing / `max-len` rules) makes sense. Biome is out of scope per the July verdict.

Measurements were taken 2026-10-15 on this repo (`main` @ `1c86bfc68`, clean tree, Apple M2 8 cores, Node 24.21, pnpm 12.4.1). Tool versions: oxlint **1.88.0** (released 2026-10-13), oxfmt **0.72.0/0.73.0**, oxlint-tsgolint **7.0.2004**, `@oxlint/migrate` **1.88.0**. All temporary configs lived outside the repo; the tree was restored with `git checkout` after each formatting run.

## TL;DR / Recommendation

1. **Oxlint: the "wait for JS plugins to stabilise" blocker is gone in practice, not on paper.** JS plugins are *still labelled alpha* in the docs, but running our **entire** ESLint config through `@oxlint/migrate` (235 rules, 11 overrides, `@stylistic` + regexp + import-helpers + playwright + boundaries + consistent-default-export-name loaded as JS plugins) produced **zero plugin runtime errors** and **zero false `@stylistic` diagnostics** on our lint-clean tree, in **~10s** wall (vs. ESLint **67s**) — **~11.6s with type-aware rules on**. Only four things did not carry over: `@typescript-eslint/naming-convention`, `no-restricted-syntax`, `react/jsx-no-bind` (not implemented natively; the latter two could be JS-plugin'd via their original plugins), and our type-aware `@eslint-react/no-leaked-conditional-rendering` (type-aware *custom* rules are explicitly unsupported in JS plugins). Our two inline/local rules (SPDX header, stryker) need to be moved to plugin files and listed under `jsPlugins` by hand.
   → **A full migration is now a 1–2 week engineering task, not a wait.** The remaining risk is the alpha label itself (API churn, bugs), which the hybrid `oxlint && eslint` path from July still mitigates. Recommended sequence: hybrid first (cheap, reversible), full switch once a release or two have run clean.
2. **Oxfmt: yes, if we accept Prettier's style — and the honest cost is a repo-wide reformat.** Oxfmt (beta since Feb 2026, 100% of Prettier's JS/TS conformance suite per oxc) formats this repo in **0.45s**. With the closest config to our house style (single quotes, 2-space, semicolons, trailing commas, `printWidth: 160`) it still rewrites **2,605 of 3,099 `.ts`/`.tsx` files (84%)**, ~**47k insertions / 55k deletions** across **224k** TS lines. The unavoidable part is what the July notes predicted: Prettier has **no options** for spaces inside `[ ]`, `${ }` or JSX `{ }` — those alone account for ~12% of changed lines; the other ~80% is Prettier re-flowing JSX props and call arguments to fill the print width.
   - It supersedes **all 34 `@stylistic` rules**, the four `react/jsx-*-spacing`/`wrap-multilines` rules and `max-len` (soft cap). Everything else (import order, boundaries, SPDX header, naming-convention, restricted imports, playwright/regexp/vitest/next rules) stays in oxlint/ESLint. `@oxlint/migrate` itself now tells you to "use Oxfmt for stylistic rules".
   - The one real design choice is **`printWidth`**. At 160 Oxfmt collapses multi-prop JSX into very long single lines (see §3.4); **120 or 100** reads much closer to what we write today at the price of ~20% more churn. Recommend **120**.
   - Import sorting: Oxfmt has a built-in `sortImports` with glob `customGroups` that *can* approximate our architecture-layer groups, but its type-import handling differs from `import-helpers`; a trial on two directories reordered imports in 128 files. **Keep `import-helpers/order-imports` (as an oxlint JS plugin or in ESLint) for the first step** and revisit `sortImports` separately.
3. **Suggested order:** (a) add oxlint hybrid (`oxlint && eslint`) — one day; (b) adopt Oxfmt in one dedicated PR with a `.git-blame-ignore-revs` entry, dropping `@stylistic` and the JSX-spacing rules in the same PR — one to two days plus coordinating the 2 open PRs; (c) later, full oxlint migration and drop ESLint.

---

## 1. Oxlint — what changed since July

### 1.1 Versions and cadence

Weekly releases continued: oxlint 1.72 (July) → **1.88.0 (2026-10-13)**, oxfmt 0.5x → **0.73.0** ([GitHub releases](https://github.com/oxc-project/oxc/releases)). Rule count on the docs page is now **871 total, 111 on by default, 334 with fixes** ([rules list](https://oxc.rs/docs/guide/usage/linter/rules)) vs. "840+" in July. `.oxlintrc.json` is now joined by a TypeScript config file, `oxlint.config.ts` ([JS plugins docs](https://oxc.rs/docs/guide/usage/linter/js-plugins)). Nothing in the Jul–Oct release notes about a persistent cache; LSP now surfaces config errors (1.88) and JS-plugin rule timings include selector execution (1.86).

### 1.2 JS plugins — still "alpha", but complete enough for our config

- Docs status: **"JS plugins are currently in alpha, and remain under active development."** No beta/stable announcement exists as of 2026-10-15 (the latest blog milestone is still the [March alpha post](https://oxc.rs/blog/2026-03-11-oxlint-js-plugins-alpha); the only oxc blog post in Jul–Oct is [React Compiler support](https://oxc.rs/blog/2026-08-18-react-compiler-support)).
- Supported: AST traversal, auto-fixes/suggestions/options/selectors, SourceCode text and token APIs, scope + code-path analysis, inline disable comments, **LSP diagnostics and quick-fixes**. Unsupported: custom parsers (Vue/Svelte/Angular) and **"rules that depend on TypeScript type information"** ([JS plugins docs](https://oxc.rs/docs/guide/usage/linter/js-plugins)).
- Officially tested plugins now include **Playwright, RegExp, Stylistic, React Hooks, Testing Library, Storybook, SonarJS, Mocha, Cypress, @e18e** — i.e. three of our "exotic" plugins are on the vendor's own conformance list.
- **Measured here** (migrated config, §1.5): `@stylistic` (32 rules), `eslint-plugin-regexp` (60 rules), `eslint-plugin-import-helpers`, `eslint-plugin-playwright` (25 rules), `eslint-plugin-boundaries` (2 rules), `eslint-plugin-consistent-default-export-name` all loaded and ran with **no "Error running JS plugin"** output. The only failure was `@eslint-react/no-leaked-conditional-rendering` — a *type-aware* JS rule, which fails with typescript-eslint's "requires type information" error, exactly as documented.

### 1.3 Type-aware linting (tsgolint)

- `tsgolint` README now says **"tsgolint is stable and powers Oxlint's type-aware linting mode"**; coverage is "59/61" (README highlights) / "60 of 62" (README rules section) typescript-eslint type-aware rules; claims 10–20× over ESLint+typescript-eslint ([tsgolint README](https://github.com/oxc-project/tsgolint)). The oxlint docs page no longer calls it a preview; it lists "Stability notes" (coverage "very close", memory on huge repos, `baseUrl` unsupported, broad `include` slows it) and documents `--type-check` as a possible replacement for `tsc --noEmit` in CI ([type-aware docs](https://oxc.rs/docs/guide/usage/linter/type-aware)).
- Docs say it requires **TypeScript 7.0+**; we are on `@typescript/typescript6@6.0.2` and it **ran fine** (tsgolint ships its own typescript-go; the requirement is about project/tsconfig compatibility, not the installed package). Worth re-checking if we lean on it.
- **Measured:** `oxlint --type-aware .` with default rules: **7.65s** wall (vs. ~6.1s in July on 1.72 — within noise of a different machine load; output includes real `no-floating-promises` hits in `deploy/tools/`).

### 1.4 Our listed native gaps — status now

Verified against `crates/oxc_linter/src/rules/*` on `main` and the rules page:

| Gap in July | Oct 2026 | Note |
|---|---|---|
| `max-len` | **still none** | `@oxlint/migrate`: "Deprecated stylistic rule … use the stylistic plugin as a JS plugin if necessary". Moot once Oxfmt owns width. |
| `no-restricted-syntax` | **still none** | migrate: "Not Implemented". Our two esquery selectors (`localeCompare`, inline `Intl.Collator`) → keep in ESLint, or 20-line local JS plugin rule. |
| `id-match` | **exists** (since 1.66) | carried over by migrate. |
| `typescript/naming-convention` | **still none** | migrate: "Not Implemented". Keep in ESLint. |
| `react/jsx-no-bind` | **still none** | migrate: "Not Implemented". |
| `react/require-optimization`, `no-access-state-in-setstate`, `no-unused-state` | **won't implement** | migrate: "only applies to legacy class components". |
| `react/no-deprecated` | **won't implement** | migrate: "already implemented by `typescript/no-deprecated` via tsgolint" (type-aware). |
| `react/no-redundant-should-component-update` | **now native** | present in source tree. |
| JSX spacing rules (`jsx-curly-spacing`, `jsx-equals-spacing`, `jsx-tag-spacing`, `jsx-wrap-multilines`) | **won't implement** | migrate: "Stylistic rule from eslint-plugin-react. **Should use Oxfmt for stylistic rules**, or use JS Plugins". |
| `@stylistic/*` | no native rules (by design) | runs as JS plugin — measured clean. |
| `import/order` / import-helpers | **still none native** | `import-helpers/order-imports` runs as JS plugin — measured clean. |
| boundaries | none native | JS plugin — measured clean (uses `import/resolver` settings → migrate warns the setting is dropped; still produced no errors). |
| playwright, regexp | none native | both now on the vendor's tested-plugin list; measured clean. |
| header/SPDX | none native | our inline rule must become a file (`./tools/eslint/spdx-plugin.mjs`) and be listed in `jsPlugins` — migrate does not move local plugins. |
| React Compiler rules | **new** (Aug 2026) | `react/*` compiler-derived rules (`immutability`, `purity`, `set-state-in-effect`, `refs`, …) added to `correctness`; replaces/extends `react-hooks` v6/v7 presets ([blog](https://oxc.rs/blog/2026-08-18-react-compiler-support)). Bonus, not a gap. |

### 1.5 `@oxlint/migrate` run on our `eslint.config.mjs`

Command: `pnpm dlx @oxlint/migrate@latest --details --type-aware eslint.config.mjs` (output moved out of the repo). Result:

- **235 rules migrated**, 11 overrides preserved (per-glob `*.pw.tsx`, `*.spec.*`, `src/**/*.tsx`, toolkit/no-restricted-imports overrides, …), `options.typeAware: true`, `jsPlugins: ["eslint-plugin-regexp", "eslint-plugin-import-helpers", "@stylistic/eslint-plugin"]` at root plus `eslint-plugin-playwright`, `eslint-plugin-boundaries`, `eslint-plugin-consistent-default-export-name`, `@eslint-react/eslint-plugin` and the two local plugins in overrides.
- **Skipped 16**: 1 nursery (`no-undef`), 3 not implemented (`naming-convention`, `jsx-no-bind`, `no-restricted-syntax`), 12 "unsupported" (listed in §1.4 plus `no-dupe-args`/`no-octal` "superseded by strict mode" and `no-spaced-func`).
- **Warnings**: `react.version: "detect"` unsupported (set explicit); `import/resolver` setting dropped; `settings` under a `files` override (our vitest settings) dropped; `ignores` inside overrides unsupported; 1,054 globals inlined (globals package version skew).
- Config size: 73 KB JSON (mostly the inlined globals).

**Running it** (with the two local plugins and the type-aware `@eslint-react` rule removed, `react.version` pinned):

| Invocation | Wall | Diagnostics |
|---|---|---|
| `oxlint .` (default rules, 96 rules, 3,122 files) | **0.24–0.31s** warm, 1.6s first run incl. dlx | 216 |
| `oxlint --type-aware .` (default + tsgolint) | **7.65s** | adds real `no-floating-promises` etc. |
| `oxlint -c <migrated> .` (235 rules incl. 6 JS plugins) | **10.0–10.8s** | 106 |
| `oxlint -c <migrated> --type-aware .` | **11.6s** | 106 + typed |
| ESLint today (`eslint .`, July measurement) | **67s** | 0 |

The 106 diagnostics: **102** `consistent-default-export-name/default-export-match-filename` (we pass `[ 'error', null ]` and rely on ESLint-side ignores that did not carry over — config issue, not a runtime one), 2 `react/jsx-curly-brace-presence` and 2 `no-restricted-imports` (option-mapping differences to triage). **Zero diagnostics from the 32 `@stylistic` rules** — i.e. the JS-plugin runtime reproduced ESLint's verdict on a tree ESLint considers clean. (JS-plugin cost is visible: 0.3s → 10s. Still 6× faster than ESLint, and single-run; `eslint --cache` warm is 2.2s but with the typed-lint caveat from July.)

### 1.6 Hybrid tooling

`eslint-plugin-oxlint` tracks oxlint's version (1.88.0). README documents `buildFromConfigFile('./.oxlintrc.json')` / `buildFromOxlintConfig(obj)` to disable in ESLint whatever oxlint owns; it says nothing about `jsPlugins` or formatter overlap ([README](https://github.com/oxc-project/eslint-plugin-oxlint)). Migration guide order is unchanged: migrate → enable oxlint → add `eslint-plugin-oxlint` → `oxlint && eslint` → drop ESLint when the remaining rules exist ([migrate guide](https://oxc.rs/docs/guide/usage/linter/migrate-from-eslint)).

---

## 2. Oxfmt — capability check

### 2.1 Status

- **Beta** since 2026-02-24: "passes 100% of Prettier's JavaScript and TypeScript conformance tests"; >30× Prettier, ~3× Biome on an uncached run (vendor benchmarks); import sorting, Tailwind sorting, `package.json` sorting, embedded-language formatting, Node API, `overrides`, `.editorconfig`, `--migrate prettier|biome` ([beta post](https://oxc.rs/blog/2026-02-24-oxfmt-beta)). Still 0.x (0.73.0); no 1.0 announcement found. Roadmap before stable: Prettier plugin support, embedded-template formatting, stability/perf ([same post](https://oxc.rs/blog/2026-02-24-oxfmt-beta)).
- Docs position it as "the recommended choice when you want a dedicated formatter with a Prettier-compatible workflow", and say to stay on Prettier only if you depend on plugins Oxfmt lacks ([overview](https://oxc.rs/docs/guide/usage/formatter)). Unsupported vs Prettier: `prettier` key in `package.json`, nested `.editorconfig`, `experimentalTernaries`, Prettier plugins in general ([unsupported features](https://oxc.rs/docs/guide/usage/formatter/unsupported-features)). Bundled Prettier reference is 3.9.9 (oxfmt 0.71 notes).

### 2.2 Options vs. our house style

Full option list: [config](https://oxc.rs/docs/guide/usage/formatter/config), [config file reference](https://oxc.rs/docs/guide/usage/formatter/config-file-reference).

| Our rule (value) | Oxfmt option | Reproducible? |
|---|---|---|
| `@stylistic/indent` 2 | `tabWidth: 2`, `useTabs: false` (defaults) | ✅ |
| `@stylistic/quotes` single | `singleQuote: true` | ✅ (template literals untouched either way) |
| `@stylistic/jsx-quotes` prefer-double | `jsxSingleQuote: false` (default) | ✅ |
| `@stylistic/semi` always | `semi: true` (default) | ✅ |
| `@stylistic/comma-dangle` always-multiline | `trailingComma: "all"` (default) | ✅ (Prettier only emits trailing commas when multi-line) |
| `@stylistic/object-curly-spacing` always | `bracketSpacing: true` (default) | ✅ |
| `@stylistic/brace-style` 1tbs | fixed Prettier behaviour | ✅ |
| `@stylistic/operator-linebreak` after | `experimentalOperatorPosition: "end"` (default) | ✅ |
| `@stylistic/quote-props` as-needed (+keywords, numbers) | `quoteProps: "as-needed"` | ≈ (Prettier's as-needed has no keyword/number sub-options) |
| `max-len` 160 | `printWidth` | ≈ soft limit (Prettier never breaks strings/comments) — see §3.4 on the value |
| `@stylistic/array-bracket-spacing` **always** (`[ a, b ]`) | **no option** | ❌ → `[a, b]` |
| `@stylistic/template-curly-spacing` **always** (`${ x }`) | **no option** | ❌ → `${x}` |
| `react/jsx-curly-spacing` **always** (`{ x }`, children too) | **no option** | ❌ → `{x}` |
| `react/jsx-tag-spacing` beforeSelfClosing **never** (`<X/>`) | fixed Prettier behaviour | ❌ → `<X />` |
| `react/jsx-wrap-multilines` parens-new-line | fixed Prettier behaviour | ✅ (Prettier does the same) |
| `@stylistic/space-before-function-paren` never (named/anon) | fixed Prettier behaviour | ✅ (`function foo()`, `async () =>`) |
| `arrowParens` (we don't enforce) | `"always"` default | n/a — pick `always` |
| `eol-last`, `no-trailing-spaces`, `no-multiple-empty-lines`, `no-multi-spaces`, `key-spacing`, `comma-spacing`, `space-infix-ops`, `type-annotation-spacing`, `member-delimiter-style`, … | formatter inherently | ✅ |

Verdict: **four spacing conventions are not expressible** and are the mandatory churn. Everything else maps.

### 2.3 Import sorting (`sortImports`)

Built in, **off by default**, modelled on `eslint-plugin-perfectionist/sort-imports`: `groups` (selectors like `value-external`, `type-internal`, arrays to merge groups, `{ newlinesBetween }` markers), `customGroups` with glob `elementNamePattern`, `internalPattern`, `order`, `ignoreCase`, `partitionByComment/Newline`, `sortSideEffects` ([sorting docs](https://oxc.rs/docs/guide/usage/formatter/sorting), [config reference](https://oxc.rs/docs/guide/usage/formatter/config-file-reference)). Our `import-helpers` groups (`module`, `/types/`, `src/server`, `src/api`, `src/shell`, `src/slices`, `src/features`, `src/{config,services,shared,sprite}`, `src/toolkit`, `deploy|playwright|vitest`, relative) are expressible as glob custom groups; **but** Oxfmt classifies `import type` separately (`type-*` selectors) whereas `import-helpers` sorts type imports with their path group, and our `/types/` path-regex group has no direct analogue. Trial on `src/features/account` + `src/shared/pagination` with a best-effort mapping (type-import group first) reordered **282 import lines in 128 files**; dropping the `type-import` group pushed all type imports to the trailing `unknown` block. A faithful mapping needs `["value-external","type-external"]`-style paired groups per layer and a `**/types/**` custom group — doable, but a separate change. Recommendation: **keep `import-helpers/order-imports`** (runs clean as an oxlint JS plugin) and leave `sortImports: false` for now.

### 2.4 Tooling

- CLI: `oxfmt` (write, default), `--check`, `--list-different`, `-c/--config`, `--ignore-path`, `--threads`, `--stdin-filepath`, `--lsp`, `--migrate prettier|biome`, `--no-error-on-unmatched-pattern` for lint-staged ([CI docs](https://oxc.rs/docs/guide/usage/formatter/ci)). lint-staged recipe: `"*": "oxfmt --no-error-on-unmatched-pattern"`.
- Ignores: respects `.gitignore` (+ `.git/info/exclude`), `.prettierignore`, and `ignorePatterns` in config (recommended); `node_modules` and lockfiles always skipped ([ignore files](https://oxc.rs/docs/guide/usage/formatter/ignore-files)). Inline: `// oxfmt-ignore` (JS/TS, next statement), `prettier-ignore` honoured too ([ignore comments](https://oxc.rs/docs/guide/usage/formatter/ignore-comments)).
- Editors: same official **`oxc.oxc-vscode`** extension as oxlint (format-on-save via `editor.defaultFormatter`), JetBrains "Oxc" plugin, Zed extension, Neovim via `oxfmt --lsp` ([editors](https://oxc.rs/docs/guide/usage/formatter/editors)).
- Interplay with ESLint: the Prettier-migration guide says keep **`eslint-config-prettier`** to switch off conflicting style rules; it covers `@stylistic/eslint-plugin` ([migrate from Prettier](https://oxc.rs/docs/guide/usage/formatter/migrate-from-prettier), [eslint-config-prettier README](https://github.com/prettier/eslint-config-prettier)). `eslint-plugin-oxlint` does **not** handle formatter overlap. For us the simplest is to delete the `@stylistic` block and the four `react/jsx-*` spacing rules outright rather than add another config layer.
- Oxfmt also formats JSON/YAML/Markdown/CSS/HTML by default — 212 non-TS files changed in our run (mostly `.md` reflow and JSON/YAML). Either accept, or scope `ignorePatterns`/CLI globs to `**/*.{ts,tsx,js,mjs,cjs}` initially.

---

## 3. Measurements — Oxfmt on this repo

### 3.1 Defaults (`oxfmt --check .`, no config)

- **1.34s** wall (incl. pnpm dlx startup). **3,311 files** would change (1,636 tsx, 1,426 ts, 149 md, 50 json, 20 yml, 17 js, …) — essentially everything, because defaults are double quotes + `printWidth 100`.
- **One hard error**: `src/shared/router/nextjs-routes.d.ts:190` — `TS(1038) 'declare' modifier cannot be used in an already ambient context` (generated by `nextjs-routes`, has `/* eslint-disable */` + `// prettier-ignore`; oxc's parser rejects what Prettier tolerates). Must go in `ignorePatterns`.

### 3.2 Tuned config (our style where possible)

```jsonc
// .oxfmtrc.json used for the measurement
{
  "printWidth": 160,   // also measured with 120 and 100
  "tabWidth": 2, "useTabs": false, "semi": true,
  "singleQuote": true, "jsxSingleQuote": false, "quoteProps": "as-needed",
  "trailingComma": "all", "bracketSpacing": true, "bracketSameLine": false,
  "arrowParens": "always", "sortPackageJson": false,
  "ignorePatterns": ["src/shared/router/nextjs-routes.d.ts"]
}
```

Write run: **0.45s** wall for the whole repo.

| `printWidth` | All files changed | `.ts`/`.tsx` files changed (of 3,099) | TS/JS lines `+` / `−` | md/json/yml |
|---|---|---|---|---|
| 160 | 2,840 | **2,605 (84%)** | **+47,200 / −54,715** | 212 files, ±4.2k |
| 120 | 2,867 | 2,632 (85%) | +56,943 / −49,829 | ~same |
| 100 (Oxfmt default) | 2,934 | 2,700 (87%) | +75,930 / −52,666 | ~same |

Reference: tracked TS/TSX is **224,220 lines**; at `printWidth: 160` about **60.8k changed line-pairs ≈ 27%** of lines are touched.

### 3.3 What the churn is (printWidth 160, TS/TSX diff, heuristic classification of 60,786 changed line-pairs)

| Share | Kind |
|---|---|
| 69.5% | structural re-flow (hunks with different line counts): JSX props collapsed onto one line or expanded, call arguments / destructuring re-wrapped to fill the width |
| 9.1% | same line count, content differs beyond spacing (operators/parens moved, `<X/>` → `<X />`) |
| 8.8% | other spacing-only edits (`{ ...rest }` → `{...rest}`, object/arrow spacing) |
| 6.3% | `[ a, b ]` → `[a, b]` |
| 4.2% | JSX `{ x }` → `{x}` |
| 1.7% | `` `${ x }` `` → `` `${x}` `` |

### 3.4 What it looks like (the `printWidth` decision)

`src/shared/pagination/Pagination.tsx` at **160**:

```diff
-    <Flex
-      as="nav"
-      alignItems="center"
-      { ...rest }
-    >
-      <Skeleton loading={ showSkeleton } mr={ 3 }>
-        <Button
-          variant="pagination"
-          size="sm"
-          onClick={ resetPage }
-          disabled={ page === 1 || isLoading }
-        >
+    <Flex as="nav" alignItems="center" {...rest}>
+      <Skeleton loading={showSkeleton} mr={3}>
+        <Button variant="pagination" size="sm" onClick={resetPage} disabled={page === 1 || isLoading}>
...
-      <Button
-        variant="pagination"
-        size="sm"
-        selected={ !showSkeleton }
-        pointerEvents="none"
-        loadingSkeleton={ showSkeleton }
-        mx={ 2 }
-        minW={ 8 }
-        px={ 2 }
-      >
-        { page }
+      <Button variant="pagination" size="sm" selected={!showSkeleton} pointerEvents="none" loadingSkeleton={showSkeleton} mx={2} minW={8} px={2}>
+        {page}
```

Prettier fills to the print width and does **not** preserve a hand-chosen one-prop-per-line layout; at 160 that yields 150-char JSX tags. At **120** the same file also *expands* the 10-key props destructuring to one-per-line and keeps the shorter tags on one line — closer to today's visual density. `objectWrap: "preserve"` (default) keeps multi-line *objects* multi-line if the first key is on its own line, but there is no JSX equivalent. A `.ts` hook at 160 shows the other direction: three nested `parseFloat(formatUnits(BigInt(...), ...))` lines collapse into one 140-char line.

**Recommendation: `printWidth: 120`** (or 100 to match Oxfmt/Prettier-ecosystem defaults). 160 was chosen for a *hard* max-len; as a *target* width it produces lines nobody would write.

---

## 4. Recommendation (expanded)

### 4.1 Oxlint

- **Hybrid now** (unchanged from July, still the right first step): `@oxlint/migrate` → prune (drop inlined globals, pin `react.version`, fix `consistent-default-export-name` options) → `eslint-plugin-oxlint` → `oxlint && eslint . --cache` in CI/lint-staged. ~1 day.
- **Full migration is technically available today** (§1.5): everything runs under oxlint except `naming-convention`, `no-restricted-syntax` (two selectors — trivial local JS rule, or keep ESLint for just this), `jsx-no-bind`, and the type-aware `@eslint-react/no-leaked-conditional-rendering` (would be lost; nearest native is tsgolint's `no-unnecessary-condition`/`strict-boolean-expressions` family). Our inline SPDX rule and the stryker rule move to plugin files. Expected CI lint: **~10–12s** full-repo, no cache needed, typed rules included. Decision point is tolerance for the **alpha** label on JS plugins; vendor has shipped it in weekly releases since October 2025 and lists `@stylistic`/playwright/regexp as conformance-tested. Suggest: run the hybrid for a release cycle, then switch.

### 4.2 Oxfmt — **adopt**, with eyes open

Why yes: a formatter removes ~38 rules from the linter config, gives sub-second format-on-save in every editor via the same oxc extension, makes `max-len` and all whitespace arguments disappear, and is what both `@oxlint/migrate` and the oxc docs steer towards. Why it hurts: one-off **~84% of TS files / ~27% of TS lines** reformatted and four house-style conventions (`[ ]`, `${ }`, JSX `{ }`, `<X/>`) gone for good.

**Supersedes** (delete from `eslint.config.mjs`): the whole `@stylistic` block (34 rules), `react/jsx-curly-spacing`, `react/jsx-equals-spacing`, `react/jsx-tag-spacing`, `react/jsx-wrap-multilines`, `max-len`. Keep `react/jsx-curly-brace-presence`, `react/jsx-fragments`, `one-var`, `no-nested-ternary`, `id-match` etc. — those are lint, not layout.

**Still lint-side** (oxlint native / JS plugin / ESLint): `import-helpers/order-imports`, `boundaries`, SPDX header, `naming-convention`, `no-restricted-imports/-properties/-syntax`, `consistent-default-export-name`, playwright, regexp, vitest, react-hooks + React Compiler rules, nextjs.

**Proposed `.oxfmtrc.json`:**

```jsonc
{
  "$schema": "./node_modules/oxfmt/configuration_schema.json",
  "printWidth": 120,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "jsxSingleQuote": false,
  "quoteProps": "as-needed",
  "trailingComma": "all",
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "always",
  "experimentalOperatorPosition": "end",
  "sortImports": false,          // keep import-helpers for now; revisit (§2.3)
  "sortPackageJson": false,      // avoid an unrelated package.json diff; enable later if wanted
  "ignorePatterns": [
    "src/shared/router/nextjs-routes.d.ts",   // generated; oxc parser rejects TS1038
    "public/**",
    "deploy/tools/**/dist/**"
  ]
}
```

(Consider starting with `"ignorePatterns"` or CLI globs limited to `**/*.{ts,tsx,js,mjs,cjs}` and bringing `.md`/`.json`/`.yml` under Oxfmt in a second PR — 212 files of unrelated reflow otherwise land in the same commit.)

**Migration sequence:**

1. Land the oxlint hybrid first (independent; reduces ESLint's job before we touch style).
2. PR "adopt Oxfmt": add `oxfmt` dev dep + `.oxfmtrc.json`; scripts `fmt` / `fmt:check`; CI `code_quality` job gets `pnpm fmt:check`; lint-staged `"*.{ts,tsx,js,mjs,cjs}": ["oxfmt --no-error-on-unmatched-pattern", "eslint --cache --fix"]`; `.vscode/settings.json` (`editor.defaultFormatter: oxc.oxc-vscode`, `formatOnSave`); delete `@stylistic` block + 4 react spacing rules + `max-len` and `@stylistic/eslint-plugin` dep; update `.agents/rules/code-quality.md` / `design-system.md` wherever `[ a ]`-style is documented.
3. In the **same PR, as a separate final commit**: `pnpm fmt` over the repo (the ~2.6k-file commit), then add that commit's SHA to a new **`.git-blame-ignore-revs`** (the repo has none today) and mention `git config blame.ignoreRevsFile .git-blame-ignore-revs` in `docs/CONTRIBUTING.md`. GitHub's blame view honours the file automatically.
4. Merge when the **2 currently open PRs** (and any agent worktrees — four exist now) are either merged or their authors are told to run `pnpm fmt` after rebasing; conflicts from a formatting rebase are mechanical (`git rebase`, run `pnpm fmt`, `git add`, continue) but every open branch will hit them.
5. Follow-up candidates: `sortImports` replacing `import-helpers` (§2.3); `sortPackageJson: true`; extend Oxfmt to md/json/yml; `--type-check` replacing `lint:tsc` once we trust tsgolint.

**Risks / caveats:**

- Oxfmt is **beta / 0.x**; formatting output may still shift between minor versions (release notes Jul–Oct show mostly markdown/CSS/JSDoc fixes and one `quoteProps: consistent` fix for JS). Pin the version; bump deliberately and reformat in the bump PR.
- `src/toolkit` (the `@blockscout/ui-toolkit` workspace) has no package.json of its own and is linted by the root config, so one root `.oxfmtrc.json` covers it; nested configs are supported if that changes.
- Playwright visual tests (`*.pw.tsx`) are unaffected by formatting but will all appear in the diff; snapshot images do not change.
- Pending `@oxlint/migrate` option gaps (`consistent-default-export-name` options, two `no-restricted-imports` hits, `react/jsx-curly-brace-presence` ×2) must be triaged before oxlint can gate CI — a few hours.
- `eslint-plugin-react` `jsx-no-bind` and `@typescript-eslint/naming-convention` remain ESLint-only for as long as we care about them.

---

## 5. Sources

Measured numbers are ours (see header for versions/machine). External claims:

- Oxlint JS plugins status, supported/unsupported APIs, tested plugin list: <https://oxc.rs/docs/guide/usage/linter/js-plugins>
- JS plugins alpha announcement (March 2026): <https://oxc.rs/blog/2026-03-11-oxlint-js-plugins-alpha>
- Oxlint type-aware docs (59/61, TS 7 requirement, `--type-check`, stability notes): <https://oxc.rs/docs/guide/usage/linter/type-aware>
- tsgolint README ("stable", rule counts, benchmarks): <https://github.com/oxc-project/tsgolint>
- Oxlint rules list (871 rules): <https://oxc.rs/docs/guide/usage/linter/rules>; rule presence verified against `crates/oxc_linter/src/rules/{eslint,react,import,typescript}` on <https://github.com/oxc-project/oxc>
- React Compiler support in oxlint (Aug 2026): <https://oxc.rs/blog/2026-08-18-react-compiler-support>
- Migration guide (`@oxlint/migrate`, `eslint-plugin-oxlint`, order of steps): <https://oxc.rs/docs/guide/usage/linter/migrate-from-eslint>
- `eslint-plugin-oxlint` README: <https://github.com/oxc-project/eslint-plugin-oxlint>
- oxc GitHub releases (oxlint 1.85–1.88, oxfmt 0.70–0.73 notes): <https://github.com/oxc-project/oxc/releases>
- Oxfmt beta announcement (100% Prettier JS/TS conformance, features, roadmap): <https://oxc.rs/blog/2026-02-24-oxfmt-beta>
- Oxfmt overview / recommendation wording: <https://oxc.rs/docs/guide/usage/formatter>
- Oxfmt configuration and file reference (all options, `sortImports` schema): <https://oxc.rs/docs/guide/usage/formatter/config>, <https://oxc.rs/docs/guide/usage/formatter/config-file-reference>
- Oxfmt sorting (imports, Tailwind, package.json): <https://oxc.rs/docs/guide/usage/formatter/sorting>
- Oxfmt unsupported features: <https://oxc.rs/docs/guide/usage/formatter/unsupported-features>
- Oxfmt ignore files / inline ignore comments: <https://oxc.rs/docs/guide/usage/formatter/ignore-files>, <https://oxc.rs/docs/guide/usage/formatter/ignore-comments>
- Oxfmt CI / lint-staged / pre-commit: <https://oxc.rs/docs/guide/usage/formatter/ci>
- Oxfmt editor setup (`oxc.oxc-vscode`, JetBrains, Zed, Neovim): <https://oxc.rs/docs/guide/usage/formatter/editors>
- Oxfmt migrate-from-Prettier guide (keep `eslint-config-prettier`, `.git-blame-ignore-revs`): <https://oxc.rs/docs/guide/usage/formatter/migrate-from-prettier>
- `eslint-config-prettier` covers `@stylistic/eslint-plugin`: <https://github.com/prettier/eslint-config-prettier>
- npm registry: `oxlint@1.88.0`, `oxfmt@0.73.0`, `oxlint-tsgolint@7.0.2004`, `@oxlint/migrate@1.88.0`, `eslint-plugin-oxlint@1.88.0` (queried 2026-10-15)

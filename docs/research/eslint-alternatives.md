# Should we replace ESLint with a faster linter?

Research notes, 2026-07-10. Benchmarks were run locally on this repo (commit `dbb43a489`, branch `main`).

## TL;DR / Recommendation

**Don't migrate now. Take two cheap wins instead, and optionally adopt the oxlint hybrid.**

1. **Zero-migration win: use `--cache`.** A warm `eslint . --cache` run on this repo takes **2.2s** vs **~67s** uncached (measured). `lint-staged` already uses `--cache`; the `lint:eslint` script and CI do not. Persisting `.eslintcache` in CI (keyed on lockfile + eslint config, with `--cache-strategy content`) would cut the CI lint step from minutes to seconds on most PRs. **Caveat:** typescript-eslint [recommends against `--cache` with typed linting](https://typescript-eslint.io/troubleshooting/faqs/eslint) — per-file caching misses cross-file *type* dependencies (change a type in file A, a typed-rule violation in unchanged file B goes unnoticed until B is edited). If cached in CI, keep one uncached run (push-to-main or nightly) as the source of truth; note lint-staged already accepts this trade locally. The hybrid in §4 removes the caveat entirely by moving typed rules to oxlint's tsgolint.
2. **Do NOT enable `--concurrency`.** On this repo it makes things *worse* (measured: `--concurrency=auto` 109.6s vs 67.2s single-threaded), because our type-aware `projectService` setup makes each worker rebuild the TypeScript program.
3. **Optional next step: the hybrid oxlint + ESLint setup.** Oxlint lints the whole repo in **~0.4s** (default rules) / **~6s** (type-aware preview). Running `oxlint && eslint` with `eslint-plugin-oxlint` disabling the duplicated rules gives near-instant feedback on most correctness rules while keeping every rule we have today. Cost: one new config file + one dev dependency; nothing is lost.
4. **A full migration is not currently possible without losing rules.** Our config leans heavily on things neither Oxlint (natively) nor Biome supports: ~40 `@stylistic` formatting rules with a non-Prettier-compatible style, `import-helpers/order-imports` with architecture-layer groups, `eslint-plugin-boundaries`, an inline custom SPDX-header rule, `@typescript-eslint/naming-convention`, `no-restricted-syntax`, `max-len`, playwright and regexp plugins. Oxlint's ESLint-compatible JS-plugin support (alpha, March 2026) will likely close this gap within a year — worth re-evaluating then. Biome is a poor fit for this codebase and can be ruled out.

---

## 1. Current setup inventory

- ESLint **9.39.2**, flat config in `eslint.config.mjs`, script `lint:eslint` = `eslint .` (no `--cache`; a stale `.eslintcache` sits in the repo root but is only used by lint-staged).
- **~2,714 lintable JS/TS files** tracked (2,660 `.ts`/`.tsx` under `src/`; `deploy/tools/` and `public/` are ignored). The `src/toolkit` workspace package (`@blockscout/ui-toolkit`) has **no lint setup of its own** — it is linted by the root config (it only has `build`/`dev`/`typecheck` scripts).
- CI: `.github/workflows/checks.yml` → `code_quality` job runs `pnpm lint:eslint` (alongside `tsc`, cspell, license check). A comment in `eslint.config.mjs` records real CI lint times: **1m15s**, and **4m27s** when `import/no-cycle` was enabled (it was disabled for performance, [import-js/eslint-plugin-import#3060](https://github.com/import-js/eslint-plugin-import/issues/3060)).
- `lint-staged`: `*.{js,jsx,ts,tsx}` → `eslint --cache --fix`.

### Plugins and notable configuration

| # | Plugin | How we use it |
|---|--------|---------------|
| 1 | `@eslint/js` | `recommended` + customizations (`eqeqeq`, `max-len` 160, `no-console`, `no-implicit-coercion`, `no-nested-ternary`, `id-match`, `one-var`, `prefer-const`, …) |
| 2 | `typescript-eslint` 8.x | **Type-aware** (`projectService: true`). `array-type` (generic), `consistent-type-imports`, a large `naming-convention` config, `no-explicit-any`, `no-unused-vars`, `no-unused-expressions` |
| 3 | `@stylistic` | ~40 formatting rules used as the **de facto formatter** (there is no Prettier). Style is deliberately non-Prettier-compatible: `array-bracket-spacing: always`, `template-curly-spacing: always`, `jsx-curly-spacing: always`, 2-space indent, single quotes, dangling commas |
| 4 | `eslint-plugin-react` | Hand-picked mix incl. **stylistic JSX rules** (`jsx-curly-spacing`, `jsx-equals-spacing`, `jsx-tag-spacing`, `jsx-wrap-multilines`) plus `jsx-key`, `jsx-no-bind`, `require-optimization`, `no-access-state-in-setstate`, … |
| 5 | `eslint-plugin-react-hooks` | `rules-of-hooks` + `exhaustive-deps` (errors; excluded for `*.pw.tsx`) |
| 6 | `@next/eslint-plugin-next` | `recommended` + `core-web-vitals` |
| 7 | `@tanstack/eslint-plugin-query` | **Registered but no rules enabled — effectively inert** |
| 8 | `eslint-plugin-jsx-a11y` | **Registered but no rules enabled — effectively inert** |
| 9 | `eslint-plugin-playwright` | `flat/recommended` on `**/*.pw.tsx` (minus `no-standalone-expect`) |
| 10 | `eslint-plugin-vitest` | `recommended` on `**/*.spec.*`, with typecheck setting and env globals |
| 11 | `eslint-plugin-regexp` | `flat/recommended` |
| 12 | `eslint-plugin-import` | Only `import/no-duplicates` (`no-cycle` disabled for perf, see above) |
| 13 | `eslint-plugin-import-helpers` | `order-imports` with **custom architecture-layer groups** (`src/api` → `src/slices` → `src/features` → …), newlines between groups, alphabetized |
| 14 | `eslint-plugin-boundaries` | `element-types` enforcing ARCH_REDESIGN §6: `src/api` must not import `src/slices`/`src/features` |
| 15 | `eslint-plugin-consistent-default-export-name` | `default-export-match-filename` on `src/**/*.tsx` |
| 16 | **Custom inline rule** `spdx-license/header` | Defined directly in `eslint.config.mjs`; fixable; enforces the `// SPDX-License-Identifier: LicenseRef-Blockscout` first line on most source files |

Plus heavy use of core "policy" rules with project-specific options:

- `no-restricted-imports` — a large curated list (dayjs, `@chakra-ui/icons`, ~70 named `@chakra-ui/react` exports, `next/link`, sprite icons, metamask packages), with per-directory overrides (toolkit may import Chakra directly).
- `no-restricted-properties` — bans `process.env` outside configs/server code.
- `no-restricted-syntax` — **esquery selectors** banning `localeCompare` and inline `Intl.Collator`.

Any replacement must reproduce (or consciously drop) items 3, 13, 14, 16 and the three restricted-\* rules — that is where the actual migration cost lives, not in the recommended presets.

---

## 2. Measured benchmarks

Machine: **Apple M2, 8 cores**, macOS (Darwin 25.3.0), Node 22.14.0, pnpm 11.5.1. Repo at `dbb43a489`, working tree clean. All times are wall-clock (`time`, zsh). "dlx overhead" ≈ 0.3–0.5s of pnpm startup included in the tool rows.

| Tool / invocation | Wall time | Notes |
|---|---|---|
| `pnpm lint:eslint` (`eslint .`), run 1 (cold) | **71.8s** | 125% CPU — essentially single-threaded |
| `pnpm lint:eslint`, run 2 (warm OS caches) | **67.2s** | no persistent cache in play |
| `eslint . --concurrency=auto` | **109.6s** | **63% slower** — each worker rebuilds the type-aware `projectService` program (282% CPU, 3.3× the CPU-seconds) |
| `eslint . --concurrency=2` | **85.9s** | still slower than single-threaded |
| `eslint . --cache` (first run, builds cache) | **69.6s** | |
| `eslint . --cache` (warm, no changes) | **2.2s** | the zero-migration win |
| `pnpm dlx oxlint@latest` (v**1.72.0**, default config) | **0.39s** (2.7s first run incl. binary download) | oxlint's own JSON stats: **2,760 files, 95 rules, 8 threads**, 270 diagnostics |
| `pnpm dlx … oxlint --type-aware` (+`oxlint-tsgolint`) | **~6.1s** warm (9.3s incl. download) | type-aware preview actually ran on this repo |
| `pnpm dlx @biomejs/biome@latest lint .` (v**2.5.2**, no config) | 71.4s | **invalid comparison** — without a config Biome ignores `.gitignore` and checked **80,306 files** (node_modules, `.next`, dist) |
| Biome 2.5.2 `lint` with minimal `biome.json` (`vcs.useIgnoreFile: true`, `deploy/tools`+`public` excluded) | **~1.0–1.2s** wall; Biome self-reports **“Checked 2,960 files in 676–836ms”** | default ruleset; found 531 errors / 876 warnings under *its* defaults, not ours. Temp config deleted afterwards |

Honest caveats:

- The Oxlint/Biome runs used their **default rule sets**, not a port of our config — they measure raw engine speed on the same tree, not rule-for-rule equivalence. With our rules ported (or JS plugins loaded) they would be slower, though vendor data suggests still far below ESLint (see below).
- ESLint's 67s includes the type-aware typescript-eslint rules, which dominate its runtime; the fair type-aware comparison is oxlint `--type-aware` at ~6s → **~11× faster**, not the ~170× of the raw run.
- The `--concurrency` regression is specific to type-aware configs; ESLint's own blog notes benefits mainly for large projects without such bottlenecks ([eslint.org multithread post](https://eslint.org/blog/2025/08/multithread-linting/)).

---

## 3. Candidates

### 3.1 Oxlint (oxc project / VoidZero)

**What it is.** Rust linter on the oxc toolchain. Stable since v1.0 (June 2025); we measured v1.72.0. 840+ built-in rules ported from ESLint core, typescript-eslint, unicorn, react (incl. react-hooks), react-perf, nextjs, import, jsdoc, jsx-a11y, node, promise, jest, vitest, vue ([overview](https://oxc.rs/docs/guide/usage/linter.html), [plugin list](https://oxc.rs/docs/guide/usage/linter/plugins)). Config is `.oxlintrc.json`. Vendor claim: "50 to 100 times faster than ESLint"; adopters incl. Shopify, Airbnb (126k files linted in 7s where ESLint timed out), Mercedes-Benz (71% lint-time decrease); Elastic Kibana, Sentry, Preact, PostHog ([1.0 announcement](https://oxc.rs/blog/2025-06-10-oxlint-stable.html), [docs](https://oxc.rs/docs/guide/usage/linter.html)). Editor support: official VS Code, IntelliJ/WebStorm, Zed integrations + LSP ([1.0 announcement](https://oxc.rs/blog/2025-06-10-oxlint-stable.html)).

**Type-aware linting.** Preview feature: oxlint (Rust) delegates type-aware rules to `tsgolint` (Go, built on typescript-go). Supports **59 of 61** typescript-eslint type-aware rules; requires the `oxlint-tsgolint` package; documented caveats around memory on very large codebases and legacy tsconfig options ([type-aware docs](https://oxc.rs/docs/guide/usage/linter/type-aware)). Ran successfully on this repo (~6s).

**Custom rules / ESLint plugins.** JS plugins went preview in Oct 2025 and **alpha in March 2026**: "almost the entire ESLint plugin API" implemented, with per-plugin conformance runs — ESLint core rules 100%, react-hooks 100%, **ESLint Stylistic 99.99%**, testing-library 100% test pass rates. Auto-fixes and LSP diagnostics work. Known limits: no custom *type-aware* rules yet, weak Svelte/Vue/Angular support, Windows perf issues ([JS plugins alpha](https://oxc.rs/blog/2026-03-11-oxlint-js-plugins-alpha), [preview post](https://oxc.rs/blog/2025-10-09-oxlint-js-plugins.html), [js-plugins docs](https://oxc.rs/docs/guide/usage/linter/js-plugins)). With JS plugins the vendor still claims 4–100× speedups depending on plugin cost.

**Migration path.** [`@oxlint/migrate`](https://oxc.rs/docs/guide/usage/linter/migrate-from-eslint) converts a flat ESLint config (incl. rule options, severities, overrides, and JS plugin references) to `.oxlintrc.json`. For the hybrid, [`eslint-plugin-oxlint`](https://github.com/oxc-project/eslint-plugin-oxlint) reads the oxlint config and turns off the duplicated ESLint rules; recommended order `oxlint && eslint`.

**Rule coverage vs our config** (native Rust rules; verified against the [rules list](https://oxc.rs/docs/guide/usage/linter/rules) and the `oxc_linter` source tree on GitHub):

| Our usage | Native oxlint? |
|---|---|
| `@eslint/js` customizations (`eqeqeq`, `no-console`, `no-nested-ternary`, `no-implicit-coercion`, `no-unused-expressions`, …) | Yes, mostly. **No: `max-len`, `no-restricted-syntax`, `id-match`** |
| `no-restricted-imports`, `no-restricted-properties` | **Yes** (rule files exist in oxc source) |
| typescript-eslint: `array-type`, `consistent-type-imports`, `no-explicit-any`, `no-unused-vars` | Yes |
| typescript-eslint `naming-convention` | **No** |
| typescript-eslint type-aware rules | Preview via `oxlint-tsgolint` (59/61 rules) |
| `@stylistic` (~40 rules, our formatter) | **No native rules** (oxc points at its separate `oxfmt` formatter, which is Prettier-flavored — not our style). Works via **JS plugins alpha** (99.99% conformance) |
| `eslint-plugin-react` — `jsx-key`, `jsx-fragments`, `jsx-curly-brace-presence`, `jsx-no-duplicate-props`, `no-direct-mutation-state`, `no-unknown-property`, `no-render-return-value`, `void-dom-elements-no-children`, `no-find-dom-node` | Yes |
| `react/jsx-no-bind`, `require-optimization`, `no-access-state-in-setstate`, `no-redundant-should-component-update`, `no-unused-state`, `no-deprecated`, JSX spacing/wrapping rules | **No** (verified absent from oxc react rules) |
| react-hooks (`rules-of-hooks`, `exhaustive-deps`) | Yes |
| `@next/eslint-plugin-next` | Yes (nextjs plugin) |
| vitest | Partial (vitest plugin exists; rule-by-rule audit needed) |
| **playwright** | **No** — JS plugin only |
| **regexp** | **No** — JS plugin only |
| import: `no-duplicates` | Yes |
| **`import-helpers/order-imports`** (arch-layer ordering) | **No** import-ordering rule natively — JS plugin only |
| **`boundaries/element-types`** | **No** — JS plugin (uses resolver settings; compatibility unverified) |
| `consistent-default-export-name` | **No** — JS plugin only |
| **Inline `spdx-license/header` rule** | Portable as a local JS plugin file (JS plugins alpha) |

**Pros:** fastest by far (measured 0.4s / 6s type-aware); highest ESLint-ecosystem fidelity of any candidate; real migration tooling; hybrid mode means zero rules lost; type-aware story actually works today; backed by VoidZero with major production adopters.
**Cons:** the rules that define this repo's policy (stylistic style, import order, boundaries, SPDX header, naming-convention, playwright, regexp) all live in the "no native rule" column — a full migration today depends on the **alpha** JS-plugin runtime; running many JS plugins erodes the speed advantage; two config dialects during any hybrid period.

**Migration cost estimate:**
- *Hybrid (recommended if we act):* ~1 day. Add `oxlint` + `eslint-plugin-oxlint` dev deps, generate `.oxlintrc.json` with `@oxlint/migrate`, prune it, add `oxlint` before `eslint` in the CI job and lint-staged. No rules lost, no code churn, editors keep working (ESLint extension stays; optionally add the oxlint extension).
- *Full migration:* not sensible until JS plugins are stable; then ~1–2 weeks: port config, run our 6 "exotic" plugins + inline rule as JS plugins, verify autofix parity of @stylistic under oxlint on a full `--fix` diff, swap lint-staged/CI/editor config, retrain (low — diagnostics look the same).

### 3.2 Biome 2.x

**What it is.** Rust formatter+linter (Prettier-style formatter, 97% Prettier compatibility; **509 lint rules** in v2.5) with first-party LSP/VS Code/JetBrains support ([linter docs](https://biomejs.dev/linter/), [homepage](https://biomejs.dev/)). Biome 2.0 added **type inference without tsc** — type-aware rules like `noFloatingPromises` catch "about 75% of the cases" typescript-eslint would, via its own scanner over `.d.ts`/project files ([Biome v2 announcement](https://biomejs.dev/blog/biome-v2/), [Vercel partnership](https://biomejs.dev/blog/vercel-partners-biome-type-inference/)). Plugins are **GritQL** snippets that can only report diagnostics (no fixes, not ESLint-compatible). `biome migrate eslint` auto-converts what it can ([linter docs](https://biomejs.dev/linter/)). Import sorting is handled by the **Assist** import organizer with custom-order support ([v2 announcement](https://biomejs.dev/blog/biome-v2/)).

**Speed.** Measured here: ~0.7–0.8s self-reported / ~1.2s wall on 2,960 files — roughly 60× faster than our ESLint run, 2–3× slower than oxlint. Vendor headline is about the formatter ("~35x faster than Prettier", [homepage](https://biomejs.dev/)); their linter benchmark repo compares only shared, non-type-aware rules. The scanner (needed for type-aware rules) roughly doubles-to-triples runtime on ~2k files per their own docs (~800ms → ~2s) ([linter docs](https://biomejs.dev/linter/)).

**Rule coverage vs our config** (from [rules sources](https://biomejs.dev/linter/rules-sources/)): good for core/TS basics (`noExplicitAny`, `useImportType`, `useConsistentArrayType`, `noRestrictedImports`, jsx-key, react-hooks equivalents `useExhaustiveDependencies`/`useHookAtTopLevel`, 5 Next.js rules, some unicorn/jest). **Not covered:** `@stylistic` as we use it (Biome's answer is its opinionated formatter — which **cannot reproduce our style**: spaces inside array brackets and `${ }`, JSX curly spacing, etc., so adopting it means reformatting essentially every file in the repo); `naming-convention` (Biome's `useNamingConvention` has different, less configurable semantics); playwright (nothing); regexp (a handful of inspired rules); tanstack-query (nothing, though we enable no rules anyway); `boundaries` (nothing equivalent); `consistent-default-export-name` (nothing); `import-helpers` groups (can be partially approximated with the v2 import organizer); our inline SPDX rule (GritQL plugin could detect but not autofix). ESLint-plugin reuse: **impossible by design**.

**Pros:** one tool for format+lint, mature editor story, honest measured ~60× speedup, real (if partial) type-aware rules without tsc, monorepo config support.
**Cons:** forces a formatter this codebase's style rejects → repo-wide churn *or* keeping ESLint+@stylistic anyway (defeating the point); weakest coverage of our policy rules; no ESLint plugin compatibility, ever; GritQL plugins can't fix. **Verdict: rule out.**

**Migration cost estimate:** config rewrite moderate (`biome migrate eslint` gets ~half); rules lost: boundaries, import-helpers ordering (partial), playwright, regexp (mostly), naming-convention (partial), SPDX autofix, all @stylistic semantics; **codebase churn: total** (every file reformatted); CI/lint-staged/editor: small; retraining: moderate (new rule names, suppression comments `// biome-ignore`).

### 3.3 Keep ESLint, make it faster (the "don't migrate" option)

- **`--cache`**: measured **67s → 2.2s** warm. Mechanics (verified in `lint-result-cache.js`): each entry stores the file's full lint result plus a hash of (ESLint version + Node version + resolved config), so config/version changes self-invalidate; results with errors are cached, freshly-autofixed files are not. Local scripts can adopt it today (`lint:eslint` → `eslint . --cache`); CI can restore `.eslintcache` with `actions/cache` (key: lockfile + `eslint.config.mjs` hash + `github.sha`, with a prefix `restore-keys` fallback since `actions/cache` never overwrites a key; save on main so PR branches can restore it) and must add `--cache-strategy content`, because fresh checkouts reset file modification times and the default `metadata` strategy would never hit. Worst case (cold cache) is today's behavior. **Correctness caveat for CI:** typescript-eslint [explicitly doesn't recommend `--cache`](https://typescript-eslint.io/troubleshooting/faqs/eslint) with typed linting — the per-file cache doesn't track cross-file type dependencies, so a type change in one file can hide a new typed-rule violation in an unchanged dependent file. Our non-typed rules (incl. `boundaries`, `import-helpers`, `import/no-duplicates`) only read the file being linted and are unaffected. Mitigation: cache on PR jobs, keep the push-to-main (or nightly) lint uncached as the backstop — or adopt the §4 hybrid, where typed rules move to tsgolint (full-repo, ~6s, no cache needed) and ESLint's remaining per-file rules can be cached soundly.
- **`--concurrency` (v9.34+, Aug 2025)**: officially cuts lint times 30–60% on large projects ([announcement](https://eslint.org/blog/2025/08/multithread-linting/)), but **measured slower here** (109.6s auto / 85.9s `=2` vs 67.2s) because type-aware linting re-parses the project per worker — a known interaction ([typescript-eslint discussion](https://github.com/typescript-eslint/typescript-eslint/discussions/11568)). Skip.
- **ESLint v10 + core rewrite**: v10.0.0 shipped Feb 2026 ([release post](https://eslint.org/blog/2026/02/eslint-v10.0.0-released/)); the 2026 focus is finishing the rewrite into a runtime-agnostic, async core ([2025 year in review](https://eslint.org/blog/2026/01/eslint-2025-year-review/), [what's coming in v10](https://eslint.org/blog/2025/10/whats-coming-in-eslint-10.0.0/)). Incremental perf, not an order-of-magnitude change; no reason to wait on it, but upgrading 9.39 → 10 is cheap and independent of this decision.

### 3.4 Dismissed quickly

- **deno lint** — Rust, 100+ rules, JS plugin API, but built around the Deno runtime and `deno.json`; no type-aware linting; no path for our plugin set in a pnpm/Next.js repo ([docs](https://docs.deno.com/runtime/reference/cli/lint/)). Not a fit.
- **quick-lint-js** — "over 90× faster than ESLint", zero-config, editor-latency focused; explicitly no config/plugin ecosystem to express any of our policy ([quick-lint-js.com](https://quick-lint-js.com/)). Not a CI linter replacement.
- **tsslint / eslint-p and friends** — small community projects piggybacking on the TS language service or patching ESLint parallelism (e.g. [eslint-p](https://github.com/origin-1/eslint-p)); nothing production-grade for our needs; superseded by official `--concurrency` anyway.

---

## 4. The hybrid option (concretely, for this repo)

Documented and recommended by oxc themselves ([migrate guide](https://oxc.rs/docs/guide/usage/linter/migrate-from-eslint)):

1. `pnpm dlx @oxlint/migrate` → generates `.oxlintrc.json` from `eslint.config.mjs` (it will carry over what oxlint supports: core rules, TS rules, react/react-hooks/nextjs/import/vitest bits, `no-restricted-imports`/`-properties` incl. our option payloads and per-dir overrides).
2. Add `eslint-plugin-oxlint` last in `eslint.config.mjs` (`buildFromOxlintConfig`) — ESLint stops re-checking whatever oxlint now owns; ESLint keeps sole ownership of `@stylistic`, `import-helpers`, `boundaries`, `consistent-default-export-name`, playwright, regexp, `naming-convention`, `no-restricted-syntax`, `max-len` and the inline SPDX rule.
3. CI + scripts: `oxlint && eslint . --cache`. Expected steady state on this machine: **~0.4s + ~2.2s warm** (or +~67s on cache miss — i.e. today's time as the worst case). Optionally enable oxlint `--type-aware` later and drop the duplicated typescript-eslint type-aware rules too.
4. lint-staged: prepend `oxlint` (it accepts file args).

What we give up: nothing rule-wise; costs are one extra config file to keep in sync (re-run `@oxlint/migrate` when the ESLint config changes) and a second diagnostics engine for contributors to recognize.

---

## 5. Recommendation (expanded)

The measured bottleneck is type-aware typescript-eslint, and the measured cure that costs nothing is `--cache` (2.2s warm). CI should cache `.eslintcache`; that alone removes lint from the critical path of most PRs, and is strictly reversible. The hybrid oxlint layer is a good second step if we want sub-second full-repo feedback (editors, pre-commit) — it is additive, loses no rules, and is the ecosystem's beaten path. A full replacement is premature in July 2026: Oxlint is the only credible destination (Biome's formatter-first model conflicts with our @stylistic-defined house style and its plugin model can't host our custom rules), but a full move depends on oxlint's JS-plugin runtime, which is explicitly **alpha**. Re-evaluate when JS plugins reach stable — at that point our six exotic plugins plus the inline SPDX rule can run unmodified under oxlint and ESLint could be dropped entirely.

---

## 6. Sources

Measured numbers above are ours (see §2 for machine/versions). External claims:

- Oxlint overview & 50–100× claim, adopters: <https://oxc.rs/docs/guide/usage/linter.html>
- Oxlint 1.0 announcement (benchmarks, Shopify/Airbnb/Mercedes-Benz): <https://oxc.rs/blog/2025-06-10-oxlint-stable.html>
- Oxlint built-in plugins & defaults: <https://oxc.rs/docs/guide/usage/linter/plugins>
- Oxlint rules list: <https://oxc.rs/docs/guide/usage/linter/rules>; rule presence verified against `crates/oxc_linter/src/rules/` in <https://github.com/oxc-project/oxc>
- Oxlint type-aware preview (tsgolint, 59/61 rules): <https://oxc.rs/docs/guide/usage/linter/type-aware>
- Oxlint JS plugins preview & alpha (ESLint API compat, @stylistic 99.99% conformance): <https://oxc.rs/blog/2025-10-09-oxlint-js-plugins.html>, <https://oxc.rs/blog/2026-03-11-oxlint-js-plugins-alpha>, <https://oxc.rs/docs/guide/usage/linter/js-plugins>
- Oxlint migration & hybrid (`@oxlint/migrate`, `eslint-plugin-oxlint`): <https://oxc.rs/docs/guide/usage/linter/migrate-from-eslint>, <https://github.com/oxc-project/eslint-plugin-oxlint>
- Biome linter (509 rules, domains, scanner overhead, `biome migrate eslint`): <https://biomejs.dev/linter/>
- Biome v2 announcement (type inference, `noFloatingPromises` ~75%, GritQL plugins, import organizer): <https://biomejs.dev/blog/biome-v2/>
- Biome × Vercel type-inference partnership: <https://biomejs.dev/blog/vercel-partners-biome-type-inference/>
- Biome rule sources (ESLint-plugin mapping): <https://biomejs.dev/linter/rules-sources/>
- Biome homepage (~35× Prettier formatter claim): <https://biomejs.dev/>
- ESLint multithread linting (`--concurrency`, v9.34): <https://eslint.org/blog/2025/08/multithread-linting/>
- typescript-eslint × `--concurrency` interaction: <https://github.com/typescript-eslint/typescript-eslint/discussions/11568>
- typescript-eslint FAQ — `--cache` not recommended with typed linting: <https://typescript-eslint.io/troubleshooting/faqs/eslint>
- ESLint v10 & core rewrite: <https://eslint.org/blog/2025/10/whats-coming-in-eslint-10.0.0/>, <https://eslint.org/blog/2026/02/eslint-v10.0.0-released/>, <https://eslint.org/blog/2026/01/eslint-2025-year-review/>
- deno lint: <https://docs.deno.com/runtime/reference/cli/lint/>
- quick-lint-js: <https://quick-lint-js.com/>
- `import/no-cycle` perf issue (why it's disabled here): <https://github.com/import-js/eslint-plugin-import/issues/3060>

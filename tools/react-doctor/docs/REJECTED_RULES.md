# Rejected rules

Rules that were tried against a full scan and kept out of the allowlist in `doctor.config.json`.
Check here before proposing a rule; add a row when a trial ends in a rejection. To revisit one,
re-run the trial on the current version — a rule rejected for false positives may have been fixed.

Hits are from the full scan at the version named.

| Rule | Version | Hits | Why rejected |
|---|---|---|---|
| `effect-needs-cleanup` | 0.9.14 | 8 | False positives: fires on a state setter named `setInterval`, and on the socket `.on` subscription whose cleanup it does not recognise. |
| `public-env-secret-name` | 0.9.14 | 12 | False positives: reads "TOKEN" in `NEXT_PUBLIC_*` names as a credential; here it means a crypto token. |
| `rendering-conditional-render` | 0.9.13 | 4 | Matches on variable names (`*Count`, `*Total`, `length`…) with no type information: 3 of 4 hits were objects or strings, and numbers under other names were missed. Replaced by the type-aware ESLint rule `@eslint-react/no-leaked-conditional-rendering`. |
| `no-unguarded-browser-global-in-render-or-hook-init` | 0.9.13 | 9 | Cannot see which components sit behind `ssr: false` or render only after an interaction; all hits were safe. A real one fails loudly with `window is not defined` on first load. |
| `no-hydration-branch-on-browser-global` | 0.9.14 | 5 | False positives: all hits are `multichainConfig()`, which reads the same startup-generated config on server and client, so the branch cannot differ at hydration. The rule cannot tell such an isomorphic accessor from a real branch. |
| `no-ref-current-in-render` | 0.9.14 | 11 | Clashes with an established pattern: the latest-ref hooks assign `ref.current` during render on purpose. |
| `no-inline-hoc-on-component` | 0.9.13 | 4 | Clashes with an established pattern: `chakra(() => …)`. |
| `no-derived-useState` | 0.9.13 | 3 | `useState(prop)` as a deliberate initial value is common here; the rule cannot tell intent. |
| `nextjs-no-client-side-redirect` | 0.9.14 | 32 | `router.replace()` in an effect is how the pages router cleans up query params. |
| `only-export-components` | 0.9.14 | 31 | Mostly context files exporting a provider next to its hook; Fast Refresh cost only. |
| `server-sequential-independent-await` | 0.9.14 | 43 | 40 of the hits are sequential `await`s in Playwright tests, where order is the point. |
| `no-array-index-as-key` | 0.9.14 | 78 | The sampled hits are static lists that never reorder; too noisy to block on. |
| `js-set-map-lookups` | 0.9.14 | 33 | `.includes()` on arrays of a handful of items; no measurable cost. |
| `rerender-lazy-state-init` | 0.9.13 | 16 | True but trivial: a cheap `map`/`concat` in a `useState` initialiser. |
| `query-destructure-result` | 0.9.13 | 3 | Spreading a query result is how the paginated-query wrappers are built. |
| `no-high-complexity-react-function`, `no-giant-component` | 0.9.14 | 74 | Duplicate the gate in `tools/code-complexity/`. |
| `require-pnpm-hardening` | 0.9.14 | 1 | Not a React concern; dependency policy lives in `pnpm-workspace.yaml`. |

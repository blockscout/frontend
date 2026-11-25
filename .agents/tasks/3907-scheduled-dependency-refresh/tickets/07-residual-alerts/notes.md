# 07 — Notes

<!-- cspell:ignore cxfr mrhx fpjm -->

## What held `d3` back

Not the second copy. From 7.9.1, `d3` declares `"sideEffects": false` and re-exports `d3-transition` from a
bundled entry, so a production build drops the side effect that adds `selection.transition()` wherever
only `import * as d3 from 'd3'` reaches it. With the two pins moved to ranges and one copy each of
`d3-selection` 3.0.1 and `d3-transition` 3.0.2, the home page still threw `TypeError: ….transition is not a
function` from a line chart, and `pnpm test:smoke` failed its home page and analytics tests. The line chart
modules that call `.transition()` now import `d3-transition` themselves, as `SankeyChartLink` already did;
the smoke set then passes.

## Removing `query-string`

- **The search.** On a fresh install (`node_modules` deleted, then `pnpm install --frozen-lockfile`), the
  installed `@walletconnect/utils` 2.21.0, 2.21.1 and 2.21.7 builds name `query-string` only in their
  `package.json`. Their CJS build requires its externals by name, and `query-string` is not one of them.
- **The docs.** pnpm 12, settings, dependency resolution, `overrides`: "If you find that your use of a
  certain package doesn't require one of its dependencies, you may use `-` to remove it."
- **The result.** `'@walletconnect/utils@2.21>query-string': "-"` takes `query-string`,
  `decode-uri-component`, `filter-obj` and `split-on-first` out of the lockfile. No ignore entry was
  needed for GHSA-qr28-fpjm-wq7f.

## The audit ignore setting

pnpm 12 reads it as `audit.ignore` in `pnpm-workspace.yaml`, a list of GHSA ids; `auditConfig.ignoreGhsas`
is the deprecated name. `pnpm audit --prod --audit-level high` then reports one high advisory,
GHSA-45rx-2jwx-cxfr (ticket 10's), and one ignored, GHSA-mrhx-c7xc-m3w5.

## The wallet stack on the server

- **The build output.** No chunk or source map under `.next/server` holds code of `@reown/appkit-wallet`
  or `@coinbase/cdp-sdk`. The server bundle keeps the wallet stack external: it imports `wagmi`, `viem`,
  `@reown/appkit`, `@reown/appkit-adapter-wagmi` and `@lifi/widget-light` from `node_modules`, and the
  pages' file traces list both packages' files.
- **The running server.** A trace of the modules `next start` resolves shows `@reown/appkit-wallet` 1.7.20
  and its `zod` 3.22.4 loaded as the server starts: the server chunk that `pages/address/[hash]` and
  `pages/token/[hash]` share imports `@reown/appkit-adapter-wagmi`. `@coinbase/cdp-sdk` is not loaded.
- **What that means for the `zod` advisory.** It is a memory exhaustion on parsing a large array. Every
  `zod` parse in `@reown/appkit-wallet` is in a `message` event handler that `W3mFrame` registers only in
  the browser, so the server imports the schemas and parses nothing with them. The ignore entry's reason
  says "their zod parses run only in the browser": "the wallet code runs only in the browser" is what the
  trace disproves.

## Full re-resolve

Run as ticket 06 ran it: `pnpm-lock.yaml` and `node_modules/.pnpm/lock.yaml` deleted, then `pnpm install
--lockfile-only`. It needed no hold and asked for no `minimumReleaseAge` exemption.

- `d3` 7.9.2, with one copy each of `d3-selection` 3.0.1 and `d3-transition` 3.0.2.
- The root's `ws` at its pin, 8.21.0.
- `query-string` and `decode-uri-component` absent; `pnpm audit --prod --audit-level high` as above.
- `pnpm lint:license:check` green, and `pnpm test:smoke` green with all seven tests passing on the first
  try.

Against the committed lockfile, five packages took a newer patch or minor (`@csstools/css-calc`,
`@csstools/css-color-parser`, `@pandacss/is-valid-prop`, `@posthog/core`, `electron-to-chromium`), and four
dependency edges moved onto a version already in the tree (`@babel/generator`, `@babel/parser` and
`@babel/traverse` under `@babel/core` 8.0.10, and `@codemirror/language`). None is in the wallet stack or in
`d3`. The re-resolved lockfile was discarded.

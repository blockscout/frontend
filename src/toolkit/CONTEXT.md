# Toolkit — context

The pnpm workspace package lives at `src/toolkit/package/` (registered in
`pnpm-workspace.yaml`) and is published as `@blockscout/ui-toolkit`. It is a
thin wrapper: its `package/src/index.ts` re-exports from the sibling source
folders (`chakra/`, `components/`, `hooks/`, `router/`, `theme/`, `utils/`),
and its `package/vite.config.ts` bundles them via Vite.

`router/` is the toolkit's own router contract (context, provider, link adapter
types, no-op defaults). Nothing under `src/toolkit/` may import a framework
routing module (`next/router`, `next/link`, `next/navigation`): the package
ships without a `next` peer dependency, and the app injects its adapter through
the provider.

When publishing or versioning, target `src/toolkit/package/package.json` —
not any other `package.json` in the repo, and not the toolkit folder root
(it has no manifest).

## Icons in toolkit components

Toolkit components must **not** use `SpriteIcon` or rely on the sprite
runtime. Downstream projects that install `@blockscout/ui-toolkit` will not
have the sprite asset and the icons will silently fail to render. Import
icons directly as React components instead (the Vite config's `svgr` plugin
handles SVG-as-component imports during the package build).

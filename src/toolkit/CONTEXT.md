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

## Types in the public declarations

Every import in the built declarations must resolve for a consumer: a relative path to a file inside
`dist`, or a package among the manifest's `dependencies` or `peerDependencies`. An import that does not
resolve turns the type into `any` for a consumer with `skipLibCheck` on, and the consumer's compile reports
nothing. So `pnpm lint:toolkit-declarations` checks it on the built package, in CI and before publishing.

So an exported signature must not name a type from an application module (`src/config`, `src/shared`, a
slice), and a package whose types it names has to be added to the manifest. A new source folder or file
extension has to be matched by the `dts` include list in `package/vite.config.ts`.

## Icons in toolkit components

Toolkit components must **not** use `SpriteIcon` or rely on the sprite
runtime. Downstream projects that install `@blockscout/ui-toolkit` will not
have the sprite asset and the icons will silently fail to render. Import
icons directly as React components instead (the Vite config's `svgr` plugin
handles SVG-as-component imports during the package build).

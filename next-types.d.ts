// Next.js writes these references into `next-env.d.ts` beside an import whose path differs between
// `next dev` and `next build`, so that file is gitignored and the references are kept here.
// `compilerOptions.types` is pinned to `[ "node" ]`: without the second line the `*.svg` module
// declarations go missing and `pnpm lint:tsc` fails on every SVG import.
/// <reference types="next" />
/// <reference types="next/image-types/global" />

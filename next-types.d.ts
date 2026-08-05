// Next.js emits these two references into the generated `next-env.d.ts`, but that file also gets a
// `distDir`-dependent import (`.next/dev/types/routes.d.ts` under `next dev`, `.next/types/routes.d.ts`
// under `next build`), so no committed copy of it can survive both commands — every production build
// rewrote it and dirtied the working tree. `next-env.d.ts` is therefore gitignored and the references
// are kept here, where they are stable.
//
// They cannot simply be dropped: `compilerOptions.types` is pinned to `[ "node" ]`, so Next's ambient
// types are not picked up automatically. Without the second line the `*.svg` module declarations from
// `next/image-types/global` go missing and `pnpm lint:tsc` fails on every SVG import.
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// File-scope resolution (spec FR7). The rule is an allowlist of two directories — the app (`src/`)
// and the repo's own tooling (`tools/`) — rather than a prefix test plus exclusions: nothing about
// tooling code makes complexity or missing tests cheaper there, and `tools/code-complexity` in
// particular is gated by the very thing it implements.
//
// Three categories are deliberately out:
//
//  - `deploy/**` — ESLint ignores the directory outright and every `deploy/tools/*` package sits
//    outside the root TypeScript project. Making this gate its first and only automated check is
//    backwards; bringing `deploy/` under ESLint and `tsc` first is issue #3675.
//  - `playwright/**`, `vitest/**`, `*.config.*` — test support and configuration, out on the same
//    grounds specs are.
//  - repo-root runtime files (`proxy.ts`, `instrumentation*.ts`, `startup.node.ts`) — measured clean,
//    and an allowlist of two directories is worth more than covering them.

const ROOTS: ReadonlyArray<string> = [ 'src/', 'tools/' ];

const EXTENSIONS: ReadonlyArray<string> = [ '.ts', '.tsx', '.mjs', '.js', '.cjs' ];

const SPEC_PATTERNS: ReadonlyArray<RegExp> = [
  /\.spec\./, // *.spec.ts / *.spec.tsx
  /\.pw\.tsx$/, // Playwright component tests
  /\.pwstory\.tsx$/, // Playwright stories
  /\.config\./, // vitest.config.ts, next.config.js and friends
];

// Build output, generated or checked in. `tools/**/dist/` is where run.sh compiles the gate itself.
const GENERATED_PREFIXES: ReadonlyArray<string> = [ 'src/toolkit/package/' ];
const GENERATED_SEGMENTS: ReadonlyArray<string> = [ '/dist/' ];

export function isInScope(filePath: string): boolean {
  const path = filePath.replace(/\\/g, '/');

  if (!ROOTS.some((root) => path.startsWith(root))) return false;
  if (!EXTENSIONS.some((extension) => path.endsWith(extension))) return false;
  if (path.endsWith('.d.ts')) return false;
  if (GENERATED_PREFIXES.some((prefix) => path.startsWith(prefix))) return false;
  if (GENERATED_SEGMENTS.some((segment) => path.includes(segment))) return false;

  const base = path.slice(path.lastIndexOf('/') + 1);
  if (base === 'envs.js') return false; // generated at container startup
  if (SPEC_PATTERNS.some((pattern) => pattern.test(base))) return false;

  return true;
}

export function resolveScopedFiles(filePaths: ReadonlyArray<string>): Array<string> {
  return filePaths.filter(isInScope);
}

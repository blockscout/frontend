// File-scope resolution (spec FR7): the gate looks at src/** .ts/.tsx only, minus specs,
// generated files, tooling, and the toolkit build output. tools/ and deploy/ fall out for
// free because they are not under src/.

const SPEC_PATTERNS: ReadonlyArray<RegExp> = [
  /\.spec\./, // *.spec.ts / *.spec.tsx
  /\.pw\.tsx$/, // Playwright component tests
  /\.pwstory\.tsx$/, // Playwright stories
];

export function isInScope(filePath: string): boolean {
  const path = filePath.replace(/\\/g, '/');

  if (!path.startsWith('src/')) return false;
  if (!path.endsWith('.ts') && !path.endsWith('.tsx')) return false;
  if (path.endsWith('.d.ts')) return false;
  if (path.startsWith('src/toolkit/package/')) return false; // toolkit build output

  const base = path.slice(path.lastIndexOf('/') + 1);
  if (base === 'envs.js') return false; // generated (defensive; not a .ts anyway)
  if (SPEC_PATTERNS.some((pattern) => pattern.test(base))) return false;

  return true;
}

export function resolveScopedFiles(filePaths: ReadonlyArray<string>): Array<string> {
  return filePaths.filter(isInScope);
}

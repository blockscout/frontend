import fs from 'fs';

// Whether a source file has a co-located vitest spec, by naming convention
// (foo.ts -> foo.spec.ts / foo.spec.tsx). Playwright tests (*.pw.tsx) do not count: no vitest
// coverage comes out of them.
export function hasCoLocatedSpec(file: string): boolean {
  const base = file.slice(0, file.lastIndexOf('.'));
  return fs.existsSync(`${ base }.spec.ts`) || fs.existsSync(`${ base }.spec.tsx`);
}

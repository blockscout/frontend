import fs from 'fs';

// Whether a source file has a co-located vitest spec, by naming convention
// (foo.ts -> foo.spec.ts / foo.spec.tsx, or the `.isolated.spec` form a spec takes when it runs in
// the isolated vitest project). Playwright tests (*.pw.tsx) do not count: no vitest coverage comes
// out of them.
const SPEC_SUFFIXES: ReadonlyArray<string> = [ '.spec.ts', '.spec.tsx', '.isolated.spec.ts', '.isolated.spec.tsx' ];

export function hasCoLocatedSpec(file: string): boolean {
  const base = file.slice(0, file.lastIndexOf('.'));
  return SPEC_SUFFIXES.some((suffix) => fs.existsSync(`${ base }${ suffix }`));
}

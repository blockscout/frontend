import { describe, it, expect } from 'vitest';

import { fileContainsJsx } from './jsx';

describe('fileContainsJsx', () => {
  it('detects a JSX element', () => {
    expect(fileContainsJsx('const C = () => <div className="a">hi</div>;', 'C.tsx')).toBe(true);
  });

  it('detects a self-closing element', () => {
    expect(fileContainsJsx('const C = () => <br/>;', 'C.tsx')).toBe(true);
  });

  it('detects a fragment', () => {
    expect(fileContainsJsx('const C = () => <><span/></>;', 'C.tsx')).toBe(true);
  });

  it('classifies a .tsx hook with no JSX as logic', () => {
    // A useX.tsx hook that returns data, never markup — the case FR4 exists for.
    const source = `
      export function useThing(x: number) {
        const doubled = x * 2;
        return { doubled, ok: doubled > 0 };
      }
    `;
    expect(fileContainsJsx(source, 'useThing.tsx')).toBe(false);
  });

  it('is false for a plain .ts logic file', () => {
    expect(fileContainsJsx('export const add = (a: number, b: number) => a + b;', 'add.ts')).toBe(false);
  });

  it('does not treat a generic type argument as JSX in a .ts file', () => {
    // `<T>` here is a type parameter, not JSX; a .ts file never parses JSX.
    expect(fileContainsJsx('const f = <T,>(x: T): T => x;', 'f.ts')).toBe(false);
  });
});

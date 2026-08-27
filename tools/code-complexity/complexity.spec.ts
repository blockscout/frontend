import { describe, it, expect } from 'vitest';

import { computeFunctionComplexities } from './complexity';

// Complexity of the single function in `source`, or the map of name -> complexity when several.
function complexityOf(source: string, fileName = 'sample.tsx'): number {
  const results = computeFunctionComplexities(source, fileName);
  expect(results).toHaveLength(1);
  return results[0].complexity;
}

function complexityByName(source: string, fileName = 'sample.tsx'): Record<string, number> {
  return Object.fromEntries(
    computeFunctionComplexities(source, fileName).map((fn) => [ fn.name, fn.complexity ]),
  );
}

describe('computeFunctionComplexities — ESLint `complexity` parity', () => {
  it('counts base 1 for a function with no branches', () => {
    expect(complexityOf('function f(x: number) { return x + 1; }')).toBe(1);
  });

  it('counts if, else if (but not else), and each logical operator', () => {
    // base 1 + if 1 + && 1 + (else if) 1 = 4; the bare `else` adds nothing
    expect(complexityOf(`
      function f(x: number) {
        if (x > 1 && x < 10) return 1;
        else if (x === 0) return 2;
        else return 3;
      }
    `)).toBe(4);
  });

  it('counts &&, ||, and ?? each', () => {
    // base 1 + && 1 + || 1 + ?? 1 = 4
    expect(complexityOf('function f(a: any, b: any, c: any) { return a && b || (c ?? a); }')).toBe(4);
  });

  it('counts logical-assignment operators &&=, ||=, ?? =', () => {
    // base 1 + three logical assignments = 4
    expect(complexityOf('function f(x: any) { x &&= 1; x ||= 2; x ??= 3; return x; }')).toBe(4);
  });

  it('counts for, for..of, and for..in', () => {
    // base 1 + 3 loops = 4
    expect(complexityOf(`
      function f(o: any) {
        for (let i = 0; i < 1; i++) {}
        for (const v of []) { v; }
        for (const k in o) { k; }
      }
    `)).toBe(4);
  });

  it('counts while and do..while', () => {
    // base 1 + while 1 + do 1 = 3
    expect(complexityOf('function f(x: number) { while (x) { break; } do { x--; } while (x); }')).toBe(3);
  });

  it('counts each case but not default or the switch itself', () => {
    // base 1 + case 1 + case 1 = 3; default and `switch` add nothing
    expect(complexityOf(`
      function f(x: number) {
        switch (x) {
          case 1: return 1;
          case 2: return 2;
          default: return 0;
        }
      }
    `)).toBe(3);
  });

  it('counts catch and ternary', () => {
    // base 1 + catch 1 + ternary 1 = 3
    expect(complexityOf('function f(x: number) { try { return x ? 1 : 2; } catch (e) { return 0; } }')).toBe(3);
  });

  it('does NOT count optional-chaining `?.` (property, call, or element access)', () => {
    // `?.` is null-safety verbosity, not a branch a test must cover: TypeScript proves the
    // nullability at each site (ADR 0004). base 1 only, whatever the `?.` shape.
    expect(complexityOf('function f(x: any) { return x?.y?.z?.toString(); }')).toBe(1);
    expect(complexityOf('function f(x: any) { const a = x?.(1); const b = x?.[0]; return a; }')).toBe(1);
  });

  it('does NOT count JSX structure', () => {
    // base 1 only; JSX elements/fragments/self-closing tags add nothing
    expect(complexityOf('const f = (x: number) => <div className="a"><span/>{ x }</div>;')).toBe(1);
  });

  it('DOES count a logical operator inside a JSX expression container', () => {
    // the `&&` is a real logical operator, not JSX structure: base 1 + && 1 = 2
    expect(complexityOf('const f = (x: number) => <div>{ x > 0 && <span/> }</div>;')).toBe(2);
  });
});

describe('computeFunctionComplexities — function units', () => {
  it('treats nested arrow functions as their own units', () => {
    const byName = complexityByName(`
      export const outer = () => {
        const inner = (n: number) => (n > 0 && n < 9 ? 1 : 2);
        return inner;
      };
    `);
    // outer's own body has no branches (base 1); inner has && + ternary (base 1 + 2)
    expect(byName).toEqual({ outer: 1, inner: 3 });
  });

  it('names methods, getters, setters, and the constructor', () => {
    const byName = complexityByName(`
      class C {
        constructor(private x: number) {}
        m(v: number) { return v > 0 ? 1 : 0; }
        get value() { return this.x; }
        set value(v: number) { this.x = v || 0; }
      }
    `);
    expect(byName).toEqual({ constructor: 1, m: 2, 'get value': 1, 'set value': 2 });
  });

  it('recovers a name for arrow and function expressions from their binding', () => {
    const byName = complexityByName(`
      const a = () => 1;
      const b = function named() { return 2; };
      const obj = { c: () => 3 };
    `);
    expect(byName).toHaveProperty('a');
    expect(byName).toHaveProperty('named');
    expect(byName).toHaveProperty('c');
  });

  it('reports the 1-based start line of each function', () => {
    const [ fn ] = computeFunctionComplexities('\n\nfunction f() { return 1; }', 'sample.ts');
    expect(fn.startLine).toBe(3);
  });
});

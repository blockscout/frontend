import { describe, it, expect } from 'vitest';

import { computeFunctionComplexities } from './complexity';

// Complexity of the single function in `source`, or the map of name -> complexity when several.
function complexityOf(source: string, fileName = 'sample.tsx'): number {
  const results = computeFunctionComplexities(source, fileName);
  expect(results).toHaveLength(1);
  return results[0].complexity;
}

// Cognitive complexity of the single function in `source`.
function cognitiveOf(source: string, fileName = 'sample.tsx'): number {
  const results = computeFunctionComplexities(source, fileName);
  expect(results).toHaveLength(1);
  return results[0].cognitive;
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
    // nullability at each site (ADR 0001). base 1 only, whatever the `?.` shape.
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

describe('computeFunctionComplexities — cognitive complexity (SonarSource model, quadratic nesting)', () => {
  it('scores a branchless function 0', () => {
    expect(cognitiveOf('function f(x: number) { return x + 1; }')).toBe(0);
  });

  it('adds 1 for a flat if, 1 for a bare else', () => {
    // if +1, else +1 = 2 (neither is nested)
    expect(cognitiveOf(`
      function f(x: number) {
        if (x > 0) { return 1; } else { return 2; }
      }
    `)).toBe(2);
  });

  it('treats else-if as a flat +1 continuation, not a nested if', () => {
    // if +1, else if +1, else if +1, else +1 = 4; the chain never nests
    expect(cognitiveOf(`
      function f(x: number) {
        if (x === 1) return 1;
        else if (x === 2) return 2;
        else if (x === 3) return 3;
        else return 0;
      }
    `)).toBe(4);
  });

  it('penalises nesting quadratically (1 + nesting²)', () => {
    // if +1 (n0), for +2 (n1), while +5 (n2) = 8 — linear would have scored 6
    expect(cognitiveOf(`
      function f(a: boolean, xs: Array<number>, b: boolean) {
        if (a) {
          for (const x of xs) {
            while (b) { break; }
          }
        }
      }
    `)).toBe(8);
  });

  it('charges 1 + nesting² at every depth, so each level costs more than the last', () => {
    // if +1 (n0), if +2 (n1), if +5 (n2), if +10 (n3) = 18: the same nesting under the linear model
    // would be 1+2+3+4 = 10. Identical to linear at depths 0-1; the surcharge starts at depth 2.
    expect(cognitiveOf(`
      function f(a: boolean, b: boolean, c: boolean, d: boolean) {
        if (a) {
          if (b) {
            if (c) {
              if (d) { return 1; }
            }
          }
        }
      }
    `)).toBe(18);
  });

  it('nests inside a bare else body', () => {
    // if +1 (n0), else +1 (n0), inner if +2 (n1) = 4
    expect(cognitiveOf(`
      function f(a: boolean, b: boolean) {
        if (a) { return 1; }
        else {
          if (b) { return 2; }
        }
      }
    `)).toBe(4);
  });

  it('scores a flat switch +1 regardless of case count', () => {
    // switch +1 only; cases add nothing
    expect(cognitiveOf(`
      function f(x: number) {
        switch (x) {
          case 1: return 1;
          case 2: return 2;
          case 3: return 3;
          default: return 0;
        }
      }
    `)).toBe(1);
  });

  it('penalises a switch nested inside another structure (1 + nesting²)', () => {
    // if +1 (n0), inner switch +2 (n1) = 3 — a nested switch is not free
    expect(cognitiveOf(`
      function f(a: boolean, x: number) {
        if (a) {
          switch (x) { case 1: return 1; default: return 0; }
        }
        return -1;
      }
    `)).toBe(3);
  });

  it('penalises control flow nested inside a switch case', () => {
    // switch +1 (n0), if inside a case +2 (n1) = 3
    expect(cognitiveOf(`
      function f(x: number, y: boolean) {
        switch (x) {
          case 1: if (y) { return 1; } return 2;
          default: return 0;
        }
      }
    `)).toBe(3);
  });

  it('collapses a run of like boolean operators to +1, and counts +1 per switch of operator', () => {
    expect(cognitiveOf('function f(a: any, b: any, c: any) { return a && b && c; }')).toBe(1);
    // `a && b || c` = (a && b) || c: the || run +1, the nested && run +1 = 2
    expect(cognitiveOf('function f(a: any, b: any, c: any) { return a && b || c; }')).toBe(2);
    // two distinct runs; the parenthesised `??` is not a sequence operator and adds nothing
    expect(cognitiveOf('function f(a: any, b: any, c: any, d: any) { return a && b || (c ?? d); }')).toBe(2);
  });

  it('does not count null-coalescing `??` or `??=`', () => {
    // The SonarSource paper ignores null-coalescing as readable shorthand, like `?.` (ADR 0002): a
    // wall of defaulting is verbose, not hard to follow.
    expect(cognitiveOf('function f(a: any, b: any, c: any) { return a ?? b ?? c; }')).toBe(0);
    expect(cognitiveOf('function f(x: any) { x ??= 1; return x; }')).toBe(0);
  });

  it('adds 1 + nesting² for a ternary and nests its branches', () => {
    // outer ternary +1 (n0); nested ternary in the whenFalse +2 (n1) = 3
    expect(cognitiveOf('function f(a: any, b: any) { return a ? 1 : (b ? 2 : 3); }')).toBe(3);
  });

  it('adds 1 + nesting² for catch', () => {
    // if +1 (n0), catch nested inside it +2 (n1) = 3
    expect(cognitiveOf(`
      function f(a: boolean) {
        if (a) {
          try { doThing(); } catch (e) { handle(e); }
        }
      }
    `)).toBe(3);
  });

  it('adds 1 for direct self-recursion detected by name', () => {
    // if +1, two recursive calls +1 each = 3
    expect(cognitiveOf(`
      function fib(n: number): number {
        if (n < 2) return n;
        return fib(n - 1) + fib(n - 2);
      }
    `)).toBe(3);
  });

  it('detects recursion for a name-bound arrow function', () => {
    expect(cognitiveOf('const walk = (n: number): number => n <= 0 ? 0 : walk(n - 1);')).toBe(2); // ternary +1, recursion +1
  });

  it('adds 1 for a labelled break/continue', () => {
    // for n0 +1, for n1 +2, if n2 +5, labelled break +1 = 9
    expect(cognitiveOf(`
      function f(xs: Array<Array<number>>) {
        outer: for (const row of xs) {
          for (const v of row) {
            if (v < 0) break outer;
          }
        }
      }
    `)).toBe(9);
  });

  it('resets nesting for a nested function — each function is its own unit', () => {
    const results = computeFunctionComplexities(`
      function outer(xs: Array<number>) {
        if (xs.length) {
          xs.forEach((x) => {
            if (x > 0) { doThing(x); }
          });
        }
      }
    `, 'sample.ts');
    const byName = Object.fromEntries(results.map((fn) => [ fn.name, fn.cognitive ]));
    // outer: if +1 (n0) = 1; the callback is its own unit: if +1 (n0) = 1 (nesting does NOT carry in)
    expect(byName).toEqual({ outer: 1, '<anonymous>': 1 });
  });

  it('records a contribution per increment with line, amount, reason and nesting', () => {
    const [ fn ] = computeFunctionComplexities(`
      function f(a: boolean, b: boolean) {
        if (a) {
          if (b) { return 1; }
        }
      }
    `, 'sample.ts');
    expect(fn.contributions).toEqual([
      { line: 3, amount: 1, reason: 'if', nesting: 0 },
      { line: 4, amount: 2, reason: 'if', nesting: 1 },
    ]);
  });

  it('does not count optional chaining toward cognitive complexity', () => {
    expect(cognitiveOf('function f(x: any) { return x?.y?.z; }')).toBe(0);
  });
});

describe('computeFunctionComplexities — jsx/behavior classification (containsJsx)', () => {
  // containsJsx keyed by function name, for asserting the direct-JSX boundary.
  function jsxByName(source: string): Record<string, boolean> {
    return Object.fromEntries(
      computeFunctionComplexities(source, 'sample.tsx').map((fn) => [ fn.name, fn.containsJsx ]),
    );
  }

  it('marks a render body that directly contains JSX', () => {
    expect(jsxByName('const C = () => <div><span/></div>;')).toEqual({ C: true });
  });

  it('marks an inline `.map(x => <Row/>)` callback jsx, and the component too', () => {
    // Both directly contain JSX in their own bodies: the component holds <ul>, the callback holds <li>.
    expect(jsxByName(`
      const List = (items: Array<number>) => <ul>{ items.map((n) => <li>{ n }</li>) }</ul>;
    `)).toEqual({ List: true, '<anonymous>': true });
  });

  it('classifies an onClick/useCallback handler that renders nothing as behavior', () => {
    // The handler's own body has no JSX (it only reaches JSX through no nested function) -> behavior;
    // the component around it is jsx.
    const byName = jsxByName(`
      const Button = () => {
        const handleClick = () => { doThing(); };
        return <button onClick={ handleClick }>go</button>;
      };
    `);
    expect(byName).toEqual({ Button: true, handleClick: false });
  });

  it('classifies a hook whose JSX only lives in a nested function as behavior', () => {
    // The hook body reaches JSX solely through the returned render function, so the JSX marks the
    // nested function, not the hook itself.
    const byName = jsxByName(`
      const useRenderRow = () => {
        return (n: number) => <div>{ n }</div>;
      };
    `);
    expect(byName).toEqual({ useRenderRow: false, '<anonymous>': true });
  });

  it('classifies a JSX-less `.tsx` hook as behavior', () => {
    expect(jsxByName('const useValue = (x: number) => { return x > 0 ? 1 : 0; };')).toEqual({ useValue: false });
  });
});

import { describe, expect, it } from 'vitest';

import { computeMutationRanges, intersectRanges, mutableLineRanges } from './ranges';

// A component whose render body sits at lines 5, 9-11, with a `behavior` handler nested inside it at
// lines 6-8 and module scope either side of it.
const COMPONENT_WITH_HANDLER = `import React from 'react';

const LIMIT = 10;

const Row = ({ count }: { count: number }) => {
  const handleClick = React.useCallback(() => {
    if (count > LIMIT) report(count);
  }, [ count ]);

  return <div onClick={ handleClick }>{ count }</div>;
};

export default Row;
`;

// A hook — `behavior` throughout — whose only JSX is inside a nested `.map()` callback at lines 6-8.
const HOOK_RENDERING_ROWS = `import { useMemo } from 'react';

export function useRows(items: Array<number>) {
  const positive = items.filter((item) => item > 0);
  return useMemo(() => {
    return positive.map((item) => (
      <span key={ item }>{ item }</span>
    ));
  }, [ positive ]);
}
`;

const PLAIN_MODULE = `export const LIMIT = 10;
export const isBig = (value: number): boolean => value > LIMIT;
`;

const RENDER_BODY_ONLY = `const Empty = ({ show }: { show: boolean }) => (
  <div>{ show ? 'yes' : 'no' }</div>
);
`;

describe('mutableLineRanges', () => {
  it('covers the whole file when nothing in it renders', () => {
    expect(mutableLineRanges(PLAIN_MODULE, 'src/util.ts')).toEqual([ [ 1, 2 ] ]);
  });

  it('drops a render body but keeps a behavior function nested inside it', () => {
    expect(mutableLineRanges(COMPONENT_WITH_HANDLER, 'src/Row.tsx')).toEqual([ [ 1, 4 ], [ 6, 8 ], [ 12, 13 ] ]);
  });

  it('drops a render callback nested inside a behavior function', () => {
    expect(mutableLineRanges(HOOK_RENDERING_ROWS, 'src/useRows.tsx')).toEqual([ [ 1, 5 ], [ 9, 10 ] ]);
  });

  it('comes out empty when every line is part of a render body', () => {
    expect(mutableLineRanges(RENDER_BODY_ONLY, 'src/Empty.tsx')).toEqual([]);
  });
});

describe('intersectRanges', () => {
  it('keeps only the overlap of each pair', () => {
    expect(intersectRanges([ [ 1, 10 ], [ 20, 30 ] ], [ [ 5, 25 ] ])).toEqual([ [ 5, 10 ], [ 20, 25 ] ]);
  });

  it('is empty when nothing overlaps', () => {
    expect(intersectRanges([ [ 1, 4 ] ], [ [ 5, 9 ] ])).toEqual([]);
  });
});

describe('computeMutationRanges', () => {
  it('mutates the whole file, minus render bodies, when no diff scopes it', () => {
    expect(computeMutationRanges(COMPONENT_WITH_HANDLER, 'src/Row.tsx', undefined))
      .toEqual([ [ 1, 4 ], [ 6, 8 ], [ 12, 13 ] ]);
  });

  it('keeps a changed line in the handler and drops one inside the render body', () => {
    expect(computeMutationRanges(COMPONENT_WITH_HANDLER, 'src/Row.tsx', [ [ 7, 7 ], [ 10, 10 ] ]))
      .toEqual([ [ 7, 7 ] ]);
  });

  it('comes out empty when the diff only touched a render body', () => {
    expect(computeMutationRanges(COMPONENT_WITH_HANDLER, 'src/Row.tsx', [ [ 9, 11 ] ])).toEqual([]);
  });
});

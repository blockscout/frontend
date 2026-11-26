import { describe, it, expect } from 'vitest';

import { findUnresolvableImports } from './check';

const PACKAGES = new Set([ 'react', '@chakra-ui/react', 'dayjs' ]);

function check(files: Record<string, string>): ReturnType<typeof findUnresolvableImports> {
  return findUnresolvableImports(new Map(Object.entries(files)), PACKAGES);
}

describe('relative imports', () => {
  it('accepts a sibling file, a folder index and a parent folder file', () => {
    expect(check({
      'index.d.ts': `export * from './chakra/button';\nexport * from './components/charts';`,
      'chakra/button.d.ts': `import { Size } from '../theme/size';`,
      'components/charts/index.d.ts': 'export {};',
      'theme/size.d.ts': 'export type Size = string;',
    })).toEqual([]);
  });

  it('accepts a specifier with a .js extension that has a declaration file', () => {
    expect(check({
      'index.d.ts': `export * from './button.js';`,
      'button.d.ts': 'export {};',
    })).toEqual([]);
  });

  it('reports a path that leaves the dist folder', () => {
    expect(check({
      'components/forms/fields/FormFieldEmail.d.ts': `import { PartialBy } from '../../../../shared/types/utils';`,
    })).toEqual([
      { file: 'components/forms/fields/FormFieldEmail.d.ts', specifier: '../../../../shared/types/utils', reason: 'outside-package' },
    ]);
  });

  it('reports a path inside dist that has no declaration file', () => {
    expect(check({
      'index.d.ts': `export { useClipboard } from './hooks/useClipboard';`,
    })).toEqual([
      { file: 'index.d.ts', specifier: './hooks/useClipboard', reason: 'missing-file' },
    ]);
  });

  it('reports an absolute path', () => {
    expect(check({
      'index.d.ts': `import { Config } from '/Users/me/repo/src/config';`,
    })).toEqual([
      { file: 'index.d.ts', specifier: '/Users/me/repo/src/config', reason: 'outside-package' },
    ]);
  });
});

describe('package imports', () => {
  it('accepts a declared package, a scoped one and a subpath of one', () => {
    expect(check({
      'index.d.ts': [
        `import { default as React } from 'react';`,
        `import { BoxProps } from '@chakra-ui/react';`,
        `import { Duration } from 'dayjs/plugin/duration';`,
      ].join('\n'),
    })).toEqual([]);
  });

  it('reports a package that is not declared', () => {
    expect(check({
      'utils/consts.d.ts': `import { default as BigNumber } from 'bignumber.js';`,
    })).toEqual([
      { file: 'utils/consts.d.ts', specifier: 'bignumber.js', reason: 'undeclared-package' },
    ]);
  });

  it('reports an application path alias as an undeclared package', () => {
    expect(check({
      'chakra/tooltip.d.ts': `import { default as config } from 'src/config';`,
    })).toEqual([
      { file: 'chakra/tooltip.d.ts', specifier: 'src/config', reason: 'undeclared-package' },
    ]);
  });
});

describe('import forms', () => {
  it('checks an inline import type', () => {
    expect(check({
      'chakra/box.d.ts': `export declare const Box: import('d3').Selection;\nexport declare const Ok: import('react').FC;`,
    })).toEqual([
      { file: 'chakra/box.d.ts', specifier: 'd3', reason: 'undeclared-package' },
    ]);
  });

  it('checks a re-export and a type-only import', () => {
    expect(check({
      'index.d.ts': `export type * from './router/types';\nimport type { Sankey } from 'd3-sankey';`,
    })).toEqual([
      { file: 'index.d.ts', specifier: './router/types', reason: 'missing-file' },
      { file: 'index.d.ts', specifier: 'd3-sankey', reason: 'undeclared-package' },
    ]);
  });

  it('checks triple-slash references', () => {
    expect(check({
      'index.d.ts': `/// <reference types="node" />\n/// <reference path="global.d.ts" />\nexport {};`,
    })).toEqual([
      { file: 'index.d.ts', specifier: 'node', reason: 'undeclared-package' },
      { file: 'index.d.ts', specifier: './global.d.ts', reason: 'missing-file' },
    ]);
  });

  it('reports a specifier once per file', () => {
    expect(check({
      'index.d.ts': `import { a } from 'd3';\nexport declare const b: import('d3').Selection;`,
    })).toHaveLength(1);
  });
});

import type { Linter as LinterTypes, Rule } from 'eslint';
import { Linter } from 'eslint';

import tseslint from 'typescript-eslint';

import { describe, expect, it } from 'vitest';

import { commentLengthAndJsdocRule } from './comment-length-and-jsdoc.mjs';

const linter = new Linter();

const CONFIG: LinterTypes.Config = {
  files: [ '**/*.{js,mjs,cjs,jsx,ts,mts,tsx}' ],
  languageOptions: { parser: tseslint.parser as LinterTypes.Parser },
  linterOptions: { reportUnusedDisableDirectives: 'off' },
  plugins: { comments: { rules: { 'length-and-jsdoc': commentLengthAndJsdocRule as Rule.RuleModule } } },
  rules: { 'comments/length-and-jsdoc': 'error' },
};

function lint(code: string, filename = 'module.ts'): Array<string> {
  return linter.verify(code, CONFIG, { filename }).map((message) => message.messageId ?? message.message);
}

function prose(count: number, prefix: string): Array<string> {
  return Array.from({ length: count }, (_, index) => `${ prefix }prose line ${ index + 1 }`);
}

function lineComment(lines: Array<string>, indent = ''): string {
  return lines.map((line) => `${ indent }//${ line === '' ? '' : ' ' + line }`).join('\n');
}

describe('comments/length-and-jsdoc', () => {
  describe('the length cap', () => {
    it('accepts a run of 8 // lines', () => {
      expect(lint([ lineComment(prose(8, '')), 'const a = 1;' ].join('\n'))).toEqual([]);
    });

    it('reports a run of 9 // lines at the top level', () => {
      expect(lint([ lineComment(prose(9, '')), 'const a = 1;' ].join('\n'))).toEqual([ 'tooLong' ]);
    });

    it('reports a /* */ block of 9 prose lines', () => {
      expect(lint([ '/*', ...prose(9, ' * '), ' */', 'const a = 1;' ].join('\n'))).toEqual([ 'tooLong' ]);
    });

    it('reports a /* */ block without the star decoration, its first line counted', () => {
      expect(lint([ '/* opening prose', ...prose(8, '   '), '*/', 'const a = 1;' ].join('\n'))).toEqual([ 'tooLong' ]);
    });

    it('reports a run inside a function body', () => {
      expect(lint([ 'function run() {', lineComment(prose(9, ''), '  '), '  return 1;', '}' ].join('\n'))).toEqual([ 'tooLong' ]);
    });

    it('reports a block inside JSX', () => {
      const code = [ 'const element = (', '  <div>', '    { /*', ...prose(9, '      '), '    */ }', '  </div>', ');' ].join('\n');

      expect(lint(code, 'Component.tsx')).toEqual([ 'tooLong' ]);
    });

    it('reports a run in a spec file', () => {
      expect(lint([ 'it(\'works\', () => {', lineComment(prose(9, ''), '  '), '});' ].join('\n'), 'module.spec.ts')).toEqual([ 'tooLong' ]);
    });

    it('does not count indented call-sample lines', () => {
      const code = lineComment([ ...prose(8, ''), '  withEnvs({ NEXT_PUBLIC_A: \'1\' }, async() => {', '    await render();', '  });' ]);

      expect(lint([ code, 'const a = 1;' ].join('\n'))).toEqual([]);
    });

    it('does not count indented sample lines in a decorated /* */ block', () => {
      expect(lint([ '/*', ...prose(8, ' * '), ' *   const result = call(a, b);', ' *   use(result);', ' */', 'const a = 1;' ].join('\n'))).toEqual([]);
    });

    it('does not count indented sample lines in a /* */ block without the star decoration', () => {
      expect(lint([ '/* opening prose', '     call(a, b);', '     use(result);', ...prose(7, '   '), '*/', 'const a = 1;' ].join('\n'))).toEqual([]);
    });

    it('counts the lines of a /** */ block without the star decoration from its opening line', () => {
      expect(lint([ '/** opening prose', ...prose(8, '    '), '*/', 'const a = 1;' ].join('\n'))).toEqual([ 'tooLong', 'jsdoc' ]);
    });

    it('counts every line of a comment that is indented as a whole', () => {
      expect(lint([ lineComment(prose(9, '   ')), 'const a = 1;' ].join('\n'))).toEqual([ 'tooLong' ]);
    });

    it('does not count bare separator lines', () => {
      const code = lineComment([ ...prose(4, ''), '', '----', ...prose(4, ''), '====' ]);

      expect(lint([ code, 'const a = 1;' ].join('\n'))).toEqual([]);
    });

    it('counts the wrapped text of a list item as prose, not as a sample', () => {
      const code = lineComment([
        'Three cases:',
        '- first case,',
        '  wrapped',
        '- second case,',
        '  wrapped',
        '  1. nested item,',
        '     wrapped',
        '- third case,',
        '  wrapped',
      ]);

      expect(lint([ code, 'const a = 1;' ].join('\n'))).toEqual([ 'tooLong' ]);
    });

    it('counts a list item indented past the prose above it', () => {
      const code = lineComment([ ...prose(7, ''), ' - first case', ' - second case' ]);

      expect(lint([ code, 'const a = 1;' ].join('\n'))).toEqual([ 'tooLong' ]);
    });

    it('does not count a sample indented past the text of a list item', () => {
      const code = lineComment([ ...prose(6, ''), '- call it as:', '    const result = call(a, b);', '    use(result);', '- then:', '    cleanup();' ]);

      expect(lint([ code, 'const a = 1;' ].join('\n'))).toEqual([]);
    });

    it('counts runs separated by code apart', () => {
      expect(lint([ lineComment(prose(5, '')), 'const a = 1;', lineComment(prose(5, '')), 'const b = 2;' ].join('\n'))).toEqual([]);
    });

    it('does not join a block comment to the run above it', () => {
      expect(lint([ lineComment(prose(5, '')), '/*', ...prose(5, ' * '), ' */', 'const a = 1;' ].join('\n'))).toEqual([]);
    });

    it('does not join comments that trail code into a run', () => {
      const code = prose(9, '').map((line, index) => `const value${ index } = ${ index }; // ${ line }`).join('\n');

      expect(lint(code)).toEqual([]);
    });
  });

  describe('the JSDoc ban', () => {
    it('reports a multi-line /** */ block', () => {
      expect(lint([ '/**', ' * Formats a value.', ' */', 'export const format = (value: number) => value;' ].join('\n'))).toEqual([ 'jsdoc' ]);
    });

    it('reports a single-line /** */ block', () => {
      expect(lint([ '/** Formats a value. */', 'export const format = (value: number) => value;' ].join('\n'))).toEqual([ 'jsdoc' ]);
    });

    it('accepts a single-line /** @type … */ annotation in a JavaScript file', () => {
      expect(lint([ '/** @type {import(\'eslint\').Linter.Config} */', 'const config = {};' ].join('\n'), 'config.mjs')).toEqual([]);
    });

    it('reports a /** @type … */ annotation in a TypeScript file', () => {
      expect(lint([ '/** @type {number} */', 'const value = 1;' ].join('\n'), 'module.ts')).toEqual([ 'jsdoc' ]);
    });

    it('reports a /** @type … */ annotation in a JavaScript file when it spans several lines', () => {
      expect(lint([ '/** @type {{', ' *   a: number,', ' * }} */', 'const value = { a: 1 };' ].join('\n'), 'module.js')).toEqual([ 'jsdoc' ]);
    });

    it('reports a single-line /** */ block in a JavaScript file that is not a @type annotation', () => {
      expect(lint([ '/** Formats a value. */', 'export const format = (value) => value;' ].join('\n'), 'module.js')).toEqual([ 'jsdoc' ]);
    });

    it('accepts an ordinary block comment', () => {
      expect(lint([ '/* Firefox drops the event here. */', 'const value = 1;' ].join('\n'))).toEqual([]);
    });

    it('accepts a // comment that starts with a star', () => {
      expect(lint([ '//* Firefox drops the event here.', 'const value = 1;' ].join('\n'))).toEqual([]);
    });
  });

  describe('exempt comments', () => {
    it('leaves a licence header alone, whatever its length and delimiter', () => {
      const code = [ '/**', ' * @license MIT', ...prose(9, ' * '), ' */', 'const value = 1;' ].join('\n');

      expect(lint(code)).toEqual([]);
    });

    it('leaves the SPDX line out of the run that follows it', () => {
      const code = [ '// SPDX-License-Identifier: LicenseRef-Blockscout', lineComment(prose(8, '')), 'const value = 1;' ].join('\n');

      expect(lint(code)).toEqual([]);
    });

    it('leaves a /** @vitest-environment */ pragma alone', () => {
      expect(lint([ '/** @vitest-environment jsdom */', 'it(\'works\', () => {});' ].join('\n'), 'module.spec.ts')).toEqual([]);
    });

    it('leaves a // @vitest-environment pragma out of the run that follows it', () => {
      const code = [ '// @vitest-environment jsdom', lineComment(prose(8, '')), 'it(\'works\', () => {});' ].join('\n');

      expect(lint(code, 'module.spec.ts')).toEqual([]);
    });

    it('leaves an ESLint directive alone, however long its reason', () => {
      const code = [ '/* eslint-disable no-console -- a CLI tool: stdout is its interface,', ...prose(9, '   '), '*/', 'const value = 1;' ].join('\n');

      expect(lint(code)).toEqual([]);
    });

    it('does not count an ESLint directive line inside a run', () => {
      const code = [ lineComment(prose(8, '')), '// eslint-disable-next-line no-console -- the CLI prints its result', 'console.log(1);' ].join('\n');

      expect(lint(code)).toEqual([]);
    });

    it('does not count TypeScript directive lines inside a run', () => {
      const code = [
        '/// <reference types="node" />',
        lineComment(prose(8, '')),
        '// @ts-expect-error the fixture is deliberately malformed',
        'const value: number = \'1\';',
      ].join('\n');

      expect(lint(code)).toEqual([]);
    });
  });

  it('reports every offending comment in a file', () => {
    const code = [ '/** One. */', 'const a = 1;', lineComment(prose(9, '')), 'const b = 2;', '/** Two. */', 'const c = 3;' ].join('\n');

    expect(lint(code)).toEqual([ 'jsdoc', 'tooLong', 'jsdoc' ]);
  });
});

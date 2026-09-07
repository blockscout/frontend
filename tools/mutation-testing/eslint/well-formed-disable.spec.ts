import type { Linter as LinterTypes, Rule } from 'eslint';
import { Linter } from 'eslint';

import { describe, expect, it } from 'vitest';

import { strykerDisableRule } from './well-formed-disable.mjs';

// The rule exercised in both directions, through ESLint itself rather than against the parse helper:
// a suppression Stryker would honour has to name its mutators, scope itself to one line, and give a
// reason, and everything short of that has to be an error rather than a quiet mute.

const linter = new Linter();

const CONFIG: LinterTypes.Config = {
  plugins: { stryker: { rules: { 'well-formed-disable': strykerDisableRule as Rule.RuleModule } } },
  rules: { 'stryker/well-formed-disable': 'error' },
};

function messageIdsOf(code: string): Array<string | undefined> {
  return linter.verify(code, CONFIG).map((message) => message.messageId);
}

function lint(comment: string): Array<string | undefined> {
  return messageIdsOf([ comment, 'const isReady = a && b;' ].join('\n'));
}

describe('stryker/well-formed-disable', () => {
  it('accepts a disable that names one mutator and gives a reason', () => {
    expect(lint('// Stryker disable next-line ConditionalExpression: the false branch is unreachable')).toEqual([]);
  });

  it('accepts a disable that names several mutators', () => {
    expect(lint('// Stryker disable next-line ConditionalExpression,LogicalOperator: both are guards on a type, not on a value')).toEqual([]);
  });

  it('accepts a mutator list written with spaces after the commas', () => {
    expect(lint('// Stryker disable next-line ConditionalExpression, LogicalOperator: guards on a type')).toEqual([]);
  });

  it('rejects a blanket file-level disable', () => {
    expect(lint('// Stryker disable all')).toEqual([ 'fileScoped' ]);
  });

  it('rejects a disable that is not scoped to a line, however narrow its mutator list', () => {
    expect(lint('// Stryker disable ConditionalExpression: the false branch is unreachable')).toEqual([ 'fileScoped' ]);
  });

  it('rejects "all" even when the disable is scoped and reasoned', () => {
    expect(lint('// Stryker disable next-line all: every mutant here is noise')).toEqual([ 'wildcard' ]);
  });

  it('rejects a disable that names no mutator', () => {
    expect(lint('// Stryker disable next-line: the false branch is unreachable')).toEqual([ 'noMutator' ]);
  });

  it('rejects a mutator list Stryker cannot parse as names', () => {
    expect(lint('// Stryker disable next-line Conditional Expression: two words are one unknown name')).toEqual([ 'noMutator' ]);
  });

  it('rejects a disable with no reason', () => {
    expect(lint('// Stryker disable next-line ConditionalExpression')).toEqual([ 'noReason' ]);
  });

  it('rejects a disable whose reason is empty', () => {
    expect(lint('// Stryker disable next-line ConditionalExpression:   ')).toEqual([ 'noReason' ]);
  });

  it('keeps a reason that contains a colon', () => {
    expect(lint('// Stryker disable next-line EqualityOperator: see #3665: the bound is exclusive by contract')).toEqual([]);
  });

  it('checks a block comment the same way, since Stryker reads those as directives too', () => {
    expect(lint('/* Stryker disable all */')).toEqual([ 'fileScoped' ]);
  });

  it('leaves a restore directive alone — it un-mutes rather than mutes', () => {
    expect(lint('// Stryker restore all')).toEqual([]);
  });

  it('leaves prose that merely mentions Stryker alone', () => {
    expect(lint('// Stryker reports this line as a survivor')).toEqual([]);
  });

  it('reports every malformed disable in a file', () => {
    expect(messageIdsOf([
      '// Stryker disable all',
      'const a = 1;',
      '// Stryker disable next-line ConditionalExpression',
      'const b = a > 0;',
    ].join('\n'))).toEqual([ 'fileScoped', 'noReason' ]);
  });
});

import { it, expect } from 'vitest';

import { extractVariables, getStringChunks, checkSummary, parseSummaryTemplate } from './utils';

it('parses a summary into text chunks and the variables between them, with string variables inlined', () => {
  const result = parseSummaryTemplate({
    summary_template: '{action_type} {amount} {native} to {to_address}',
    summary_template_variables: {
      action_type: { type: 'string', value: 'Transfer' },
      amount: { type: 'currency', value: '100' },
      to_address: { type: 'domain', value: 'duck.eth' },
    },
  });

  expect(result).toEqual({
    chunks: [ 'Transfer ', ' ', ' to ', '' ],
    variablesNames: [ 'amount', 'native', 'to_address' ],
  });
});

it('parses no summary whose template names a variable it does not carry', () => {
  const result = parseSummaryTemplate({
    summary_template: '{action_type} {amount}',
    summary_template_variables: { action_type: { type: 'string', value: 'Transfer' } },
  });

  expect(result).toBeNull();
});

const template = '{action_type} {source_amount} {native} into {destination_amount} {destination_token}';

it('extracts variables names', () => {
  const result = extractVariables(template);
  expect(result).toEqual([ 'action_type', 'source_amount', 'native', 'destination_amount', 'destination_token' ]);
});

it('split string without capturing variables', () => {
  const result = getStringChunks(template);
  expect(result).toEqual([ '', ' ', ' ', ' into ', ' ', '' ]);
});

it('checks that summary is valid', () => {
  const result = checkSummary('{foo} {native} {bar} {wei}', { foo: { type: 'string', value: 'foo' }, bar: { type: 'string', value: 'bar' } });
  expect(result).toBe(true);
});

it('checks that summary is invalid', () => {

  // @ts-ignore:
  const result = checkSummary('{foo} {native} {bar}', { foo: { type: 'string', value: null }, bar: { type: 'string', value: 'bar' } });
  expect(result).toBe(false);
});

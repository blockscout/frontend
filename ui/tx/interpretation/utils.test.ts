import { extractVariables, getStringChunks } from './utils';

const template = '{action_type} {source_amount} {native} into {destination_amount} {destination_token}';

it('extracts variables names', () => {
  const result = extractVariables(template);
  expect(result).toEqual([ 'action_type', 'source_amount', 'native', 'destination_amount', 'destination_token' ]);
});

it('split string without capturing variables', () => {
  const result = getStringChunks(template);
  expect(result).toEqual([ '', ' ', ' ', ' into ', ' ', '' ]);
});

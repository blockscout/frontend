import { describe, expect, it } from 'vitest';

import { getGridTemplateColumns } from './gridTableColumns';

describe('getGridTemplateColumns', () => {
  it('sizes an uncapped column to its content', () => {
    expect(getGridTemplateColumns([ { id: 'method' } ])).toBe('auto');
  });

  it('caps a column with a max width through fit-content', () => {
    expect(getGridTemplateColumns([ { id: 'from_to', maxWidth: '350px' } ])).toBe('fit-content(350px)');
  });

  it('builds one track per column in order', () => {
    const columns = [
      { id: 'txn_hash' },
      { id: 'from_to', maxWidth: '350px' },
      { id: 'asset', maxWidth: '240px', isNumeric: true },
      { id: 'value', isNumeric: true },
    ];

    expect(getGridTemplateColumns(columns)).toBe('auto fit-content(350px) fit-content(240px) auto');
  });

  it('returns an empty template for no columns', () => {
    expect(getGridTemplateColumns([])).toBe('');
  });
});

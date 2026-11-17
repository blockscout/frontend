import { describe, it, expect } from 'vitest';

import { getResource } from './get-resource';

describe('getResource', () => {
  it('returns the registry definition of a resource', () => {
    expect(getResource('core:address_txs')).toEqual({
      path: '/api/v2/addresses/:hash/transactions',
      pathParams: [ 'hash' ],
      filterFields: [ 'filter' ],
      paginated: true,
    });
  });

  it('does not depend on the API being configured', () => {
    expect(getResource('interchainIndexer:bridged_tokens').path).toEqual(expect.any(String));
  });
});

import { describe, test, expect } from 'vitest';

import { operationMatchesFilterPhrase, tagNameMatchesFilterPhrase } from './swagger-ops-filter';

const operation = {
  path: '/api/v2/addresses/{address_hash}',
  method: 'get',
  id: 'get-/api/v2/addresses/{address_hash}',
  operation: {
    operationId: 'getAddress',
    summary: 'Get address info',
  },
};

describe('operationMatchesFilterPhrase', () => {
  test('matches path', () => {
    expect(operationMatchesFilterPhrase(operation, 'addresses')).toBe(true);
  });

  test('matches method', () => {
    expect(operationMatchesFilterPhrase(operation, 'GET')).toBe(true);
  });

  test('matches operationId', () => {
    expect(operationMatchesFilterPhrase(operation, 'getAddress')).toBe(true);
  });

  test('matches summary', () => {
    expect(operationMatchesFilterPhrase(operation, 'address info')).toBe(true);
  });

  test('returns false when nothing matches', () => {
    expect(operationMatchesFilterPhrase(operation, 'tokens')).toBe(false);
  });
});

describe('tagNameMatchesFilterPhrase', () => {
  test('matches tag name case-insensitively', () => {
    expect(tagNameMatchesFilterPhrase('Accounts', 'acc')).toBe(true);
  });

  test('returns false when tag does not match', () => {
    expect(tagNameMatchesFilterPhrase('Accounts', 'blocks')).toBe(false);
  });
});

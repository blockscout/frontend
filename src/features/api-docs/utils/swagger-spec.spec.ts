import { describe, test, expect } from 'vitest';

import { keepFirstTagOnly } from './swagger-spec';

describe('keepFirstTagOnly', () => {
  test('keeps only the first tag when operation has multiple tags', () => {
    const spec = {
      paths: {
        '/users': {
          get: { tags: [ 'accounts', 'users' ] },
        },
      },
    };

    expect(keepFirstTagOnly(spec)).toEqual({
      paths: {
        '/users': {
          get: { tags: [ 'accounts' ] },
        },
      },
    });
  });

  test('leaves single-tag operations unchanged', () => {
    const spec = {
      paths: {
        '/users': {
          get: { tags: [ 'accounts' ] },
        },
      },
    };

    expect(keepFirstTagOnly(spec)).toEqual(spec);
  });

  test('leaves operations without tags unchanged', () => {
    const spec = {
      paths: {
        '/users': {
          get: { summary: 'List users' },
        },
      },
    };

    expect(keepFirstTagOnly(spec)).toEqual(spec);
  });

  test('returns spec unchanged when paths are missing', () => {
    const spec = { openapi: '3.0.0' };

    expect(keepFirstTagOnly(spec)).toEqual(spec);
  });
});

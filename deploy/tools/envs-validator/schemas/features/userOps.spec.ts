// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';

import { getValidationErrors } from '../../utils';
import { userOpsSchema } from './userOps';

describe('userOpsSchema', () => {
  it('accepts the indexer host when user ops are enabled', () => {
    expect(getValidationErrors(userOpsSchema, {
      NEXT_PUBLIC_HAS_USER_OPS: 'true',
      NEXT_PUBLIC_USER_OPS_INDEXER_API_HOST: 'https://example.com',
    })).toEqual([]);
  });

  it('rejects the indexer host when user ops are not enabled', () => {
    expect(getValidationErrors(userOpsSchema, { NEXT_PUBLIC_USER_OPS_INDEXER_API_HOST: 'https://example.com' })).toEqual([
      'NEXT_PUBLIC_USER_OPS_INDEXER_API_HOST can only be used if NEXT_PUBLIC_HAS_USER_OPS is set to \'true\'',
    ]);
  });

  it('rejects a malformed indexer host', () => {
    expect(getValidationErrors(userOpsSchema, {
      NEXT_PUBLIC_HAS_USER_OPS: 'true',
      NEXT_PUBLIC_USER_OPS_INDEXER_API_HOST: 'not a url',
    })).toEqual([ 'NEXT_PUBLIC_USER_OPS_INDEXER_API_HOST is not a valid URL' ]);
  });

  it('rejects a non-boolean flag', () => {
    expect(getValidationErrors(userOpsSchema, { NEXT_PUBLIC_HAS_USER_OPS: 'yes' })).toEqual([
      'NEXT_PUBLIC_HAS_USER_OPS must be a `boolean` type, but the final value was: `"yes"`.',
    ]);
  });
});

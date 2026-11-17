// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';

import { getValidationErrors } from '../../utils';
import { tacSchema } from './tac';

describe('tacSchema', () => {
  it('accepts the API host alone', () => {
    expect(getValidationErrors(tacSchema, { NEXT_PUBLIC_TAC_OPERATION_LIFECYCLE_API_HOST: 'https://tac.blockscout.com' })).toEqual([]);
  });

  it('accepts the TON explorer URL together with the API host', () => {
    expect(getValidationErrors(tacSchema, {
      NEXT_PUBLIC_TAC_OPERATION_LIFECYCLE_API_HOST: 'https://tac.blockscout.com',
      NEXT_PUBLIC_TAC_TON_EXPLORER_URL: 'https://tonscan.org',
    })).toEqual([]);
  });

  it('rejects a malformed API host', () => {
    expect(getValidationErrors(tacSchema, { NEXT_PUBLIC_TAC_OPERATION_LIFECYCLE_API_HOST: 'not a url' })).toEqual([
      'NEXT_PUBLIC_TAC_OPERATION_LIFECYCLE_API_HOST: Invalid URL: Received "not a url"',
    ]);
  });

  it('rejects a malformed TON explorer URL', () => {
    expect(getValidationErrors(tacSchema, {
      NEXT_PUBLIC_TAC_OPERATION_LIFECYCLE_API_HOST: 'https://tac.blockscout.com',
      NEXT_PUBLIC_TAC_TON_EXPLORER_URL: 'not a url',
    })).toEqual([ 'NEXT_PUBLIC_TAC_TON_EXPLORER_URL: Invalid URL: Received "not a url"' ]);
  });

  it('rejects the TON explorer URL without the API host', () => {
    expect(getValidationErrors(tacSchema, { NEXT_PUBLIC_TAC_TON_EXPLORER_URL: 'https://tonscan.org' })).toEqual([
      'NEXT_PUBLIC_TAC_TON_EXPLORER_URL can only be used with NEXT_PUBLIC_TAC_OPERATION_LIFECYCLE_API_HOST',
    ]);
  });
});

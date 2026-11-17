// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';

import { getValidationErrors } from '../../utils';
import { flashblocksSchema } from './flashblocks';

const SOCKET_URL = { NEXT_PUBLIC_FLASHBLOCKS_SOCKET_URL: 'wss://example.com/ws' };

describe('flashblocksSchema', () => {
  it('accepts the socket URL together with a name', () => {
    expect(getValidationErrors(flashblocksSchema, { ...SOCKET_URL, NEXT_PUBLIC_FLASHBLOCKS_NAME: 'flashblock' })).toEqual([]);
  });

  it('accepts the socket URL alone', () => {
    expect(getValidationErrors(flashblocksSchema, SOCKET_URL)).toEqual([]);
  });

  it('rejects a malformed socket URL', () => {
    expect(getValidationErrors(flashblocksSchema, { NEXT_PUBLIC_FLASHBLOCKS_SOCKET_URL: 'not a url' })).toEqual([
      'NEXT_PUBLIC_FLASHBLOCKS_SOCKET_URL: Invalid URL: Received "not a url"',
    ]);
  });

  it('rejects an unsupported name', () => {
    expect(getValidationErrors(flashblocksSchema, { ...SOCKET_URL, NEXT_PUBLIC_FLASHBLOCKS_NAME: 'miniblock' })).toEqual([
      'NEXT_PUBLIC_FLASHBLOCKS_NAME: Invalid type: Expected ("flashblock" | "subblock") but received "miniblock"',
    ]);
  });

  it('rejects the name without the socket URL', () => {
    expect(getValidationErrors(flashblocksSchema, { NEXT_PUBLIC_FLASHBLOCKS_NAME: 'flashblock' })).toEqual([
      'NEXT_PUBLIC_FLASHBLOCKS_NAME can only be used with NEXT_PUBLIC_FLASHBLOCKS_SOCKET_URL',
    ]);
  });
});

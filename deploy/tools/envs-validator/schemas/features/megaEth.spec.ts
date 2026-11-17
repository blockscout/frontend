// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';

import { getValidationErrors } from '../../utils';
import { megaEthSchema } from './megaEth';

describe('megaEthSchema', () => {
  it('accepts both socket URLs', () => {
    expect(getValidationErrors(megaEthSchema, {
      NEXT_PUBLIC_MEGA_ETH_SOCKET_URL_METRICS: 'wss://example.com',
      NEXT_PUBLIC_MEGA_ETH_SOCKET_URL_RPC: 'wss://example.com',
    })).toEqual([]);
  });

  it.each([
    'NEXT_PUBLIC_MEGA_ETH_SOCKET_URL_METRICS',
    'NEXT_PUBLIC_MEGA_ETH_SOCKET_URL_RPC',
  ])('rejects a malformed %s', (name) => {
    expect(getValidationErrors(megaEthSchema, { [name]: 'not a url' })).toEqual([ `${ name }: Invalid URL: Received "not a url"` ]);
  });
});

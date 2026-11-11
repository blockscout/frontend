// SPDX-License-Identifier: LicenseRef-Blockscout

// @vitest-environment jsdom

import type { AddressQuery } from 'src/slices/address/hooks/useAddressQuery';
import * as addressMock from 'src/slices/address/mocks/address';

import { RESOURCE_LOAD_ERROR_MESSAGE } from 'src/shared/errors/throw-on-resource-load-error';

import { describe, it, expect } from 'vitest';
import { renderHook } from 'vitest/lib';

import useAddressDetailsData from './useAddressDetailsData';

const ADDRESS_HASH = '0xd789a607CEac2f0E14867de4EB15b15C9FFB5859';

function successQuery(data: AddressQuery['data']): AddressQuery {
  return { isError: false, error: null, data } as AddressQuery;
}

function errorQuery(status: number): AddressQuery {
  return { isError: true, error: { status, payload: undefined }, data: undefined } as AddressQuery;
}

function getData(addressQuery: AddressQuery): ReturnType<typeof useAddressDetailsData> {
  const { result } = renderHook(() => useAddressDetailsData({ addressQuery, addressHash: ADDRESS_HASH }));
  return result.current;
}

describe('useAddressDetailsData', () => {
  it('passes the loaded address through', () => {
    expect(getData(successQuery(addressMock.eoa))).toEqual({ status: 'ready', data: addressMock.eoa });
  });

  it('reports an empty result while nothing is loaded', () => {
    expect(getData(successQuery(undefined))).toEqual({ status: 'empty' });
  });

  it('builds a placeholder address for an unknown hash', () => {
    expect(getData(errorQuery(404))).toEqual({
      status: 'ready',
      data: {
        hash: ADDRESS_HASH,
        is_contract: false,
        implementations: [],
        token: null,
        watchlist_address_id: null,
        watchlist_names: [],
        creation_transaction_hash: null,
        block_number_balance_updated_at: null,
        name: null,
        exchange_rate: null,
        coin_balance: null,
        has_tokens: true,
        has_token_transfers: true,
        has_validated_blocks: false,
        filecoin: undefined,
        celo: undefined,
        creator_filecoin_robust_address: null,
        creator_address_hash: null,
        creation_status: null,
        ens_domain_name: null,
        has_beacon_chain_withdrawals: false,
        has_logs: false,
        is_scam: false,
        is_verified: false,
        metadata: null,
        proxy_type: null,
        reputation: 'ok',
        private_tags: [],
        public_tags: [],
      },
    });
  });

  it('reports a fetch error for a server failure', () => {
    expect(getData(errorQuery(500))).toEqual({ status: 'fetch_error' });
  });

  it.each([ 403, 422, 429 ])('throws on a %i response so the error page takes over', (status) => {
    expect(() => getData(errorQuery(status))).toThrow(RESOURCE_LOAD_ERROR_MESSAGE);
  });
});

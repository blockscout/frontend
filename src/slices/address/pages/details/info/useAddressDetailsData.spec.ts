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
    const result = getData(errorQuery(404));

    expect(result.status).toBe('ready');
    expect(result).toMatchObject({ data: { hash: ADDRESS_HASH, is_contract: false, has_tokens: true, has_token_transfers: true } });
  });

  it('reports a fetch error for a server failure', () => {
    expect(getData(errorQuery(500))).toEqual({ status: 'fetch_error' });
  });

  it.each([ 403, 422, 429 ])('throws on a %i response so the error page takes over', (status) => {
    expect(() => getData(errorQuery(status))).toThrow(RESOURCE_LOAD_ERROR_MESSAGE);
  });
});

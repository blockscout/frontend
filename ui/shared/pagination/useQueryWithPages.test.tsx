import fetch from 'jest-fetch-mock';
import { renderHook, wrapper, act } from 'jest/lib';
import { mockRouter } from 'jest/mocks/next-router';
import flushPromises from 'jest/utils/flushPromises';
import * as addressMock from 'mocks/address/address';

import type { Params } from './useQueryWithPages';
import useQueryWithPages from './useQueryWithPages';

jest.mock('next/router', () => mockRouter());

it('returns correct data if there is only one page', async() => {
  const params: Params<'address_txs'> = {
    resourceName: 'address_txs',
    pathParams: { hash: addressMock.hash },
  };
  const response = {
    items: [],
    next_page_params: null,
  };
  fetch.mockResponse(JSON.stringify(response));

  const { result } = renderHook(() => useQueryWithPages(params), { wrapper });
  await waitForApiResponse();

  expect(result.current.data).toEqual(response);
  expect(result.current.pagination).toMatchObject({
    page: 1,
    canGoBackwards: true,
    hasNextPage: false,
    isLoading: false,
    isVisible: true,
  });
});

async function waitForApiResponse() {
  await flushPromises();
  await act(flushPromises);
}

import fetch from 'jest-fetch-mock';
import { renderHook, wrapper, act } from 'jest/lib';
import { useRouter, router } from 'jest/mocks/next-router';
import flushPromises from 'jest/utils/flushPromises';
import * as addressMock from 'mocks/address/address';

jest.mock('next/router', () => ({ useRouter }));

import type { Params } from './useQueryWithPages';
import useQueryWithPages from './useQueryWithPages';

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
    isVisible: false,
  });
});

describe('if there are multiple pages', () => {
  it('return correct data for the first page', async() => {
    const params: Params<'address_txs'> = {
      resourceName: 'address_txs',
      pathParams: { hash: addressMock.hash },
    };
    const response = {
      items: [ { hash: '11' }, { hash: '12' } ],
      next_page_params: {
        block_number: 11,
        index: 12,
        items_count: 13,
      },
    };
    fetch.mockResponse(JSON.stringify(response));

    const { result } = renderHook(() => useQueryWithPages(params), { wrapper });
    await waitForApiResponse();

    expect(result.current.data).toEqual(response);
    expect(result.current.pagination).toMatchObject({
      page: 1,
      canGoBackwards: true,
      hasNextPage: true,
      isLoading: false,
      isVisible: true,
    });
  });
});

describe('if there is page query param in URL', () => {
  it('sets this param as the page number', async() => {
    useRouter.mockReturnValueOnce({ ...router, query: { page: '3' } });

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
      page: 3,
      canGoBackwards: false,
      hasNextPage: false,
      isLoading: false,
      isVisible: true,
    });
  });
});

async function waitForApiResponse() {
  await flushPromises();
  await act(flushPromises);
}

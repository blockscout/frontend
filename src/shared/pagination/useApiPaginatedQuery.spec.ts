// @vitest-environment jsdom

import React from 'react';

import * as addressParamMock from 'src/slices/address/mocks/address-param';
import { TX_ITEM } from 'src/slices/tx/stubs/tx';

import { chainA } from 'src/features/multichain/mocks/chains';

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, render, wrapper, act, cleanup } from 'vitest/lib';
import flushPromises from 'vitest/utils/flushPromises';
import { routerStandIn } from 'vitest/utils/routerStandIn';

const { mockScrollToTop } = vi.hoisted(() => ({
  mockScrollToTop: vi.fn(),
}));

vi.mock('next/router', () => import('vitest/utils/routerStandIn').then((m) => m.nextRouterModule));
vi.mock('react-scroll', () => ({ animateScroll: { scrollToTop: mockScrollToTop } }));

import type { Params, ApiPaginatedQueryResult } from './useApiPaginatedQuery';
import useApiPaginatedQuery from './useApiPaginatedQuery';
import { generateListStub } from './utils';

const responses = {
  page_empty: {
    items: [],
    next_page_params: null,
  },
  page_1: {
    items: [ { hash: '11' }, { hash: '12' } ],
    next_page_params: {
      block_number: 11,
      index: 12,
      items_count: 13,
    },
  },
  page_2: {
    items: [ { hash: '21' }, { hash: '22' } ],
    next_page_params: {
      block_number: 21,
      index: 22,
      items_count: 23,
    },
  },
  page_3: {
    items: [ { hash: '31' }, { hash: '32' } ],
    next_page_params: null,
  },
  page_filtered: {
    items: [ { hash: '41' }, { hash: '42' } ],
    next_page_params: {
      block_number: 41,
      index: 42,
      items_count: 43,
    },
  },
  page_sorted: {
    items: [ { hash: '61' }, { hash: '62' } ],
    next_page_params: null,
  },
};

const responseInit = {
  headers: {
    'Content-Type': 'application/json',
  },
};

const encodePageParams = (pageParams: object) => encodeURIComponent(JSON.stringify(pageParams));

// one render for the URL push, one when the response lands
const RENDERS_PER_NAVIGATION = 2;

const params: Params<'core:address_txs'> = {
  resourceName: 'core:address_txs',
  pathParams: { hash: addressParamMock.hash },
};

beforeEach(() => {
  fetchMock.resetMocks();
  mockScrollToTop.mockClear();
  routerStandIn.reset({ pathname: '/blocks' });
});

afterEach(cleanup);

it('returns correct data if there is only one page', async() => {
  fetchMock.mockResponse(JSON.stringify(responses.page_empty), responseInit);

  const { result } = renderHook(() => useApiPaginatedQuery(params), { wrapper });
  await waitForApiResponse();

  expect(result.current.data).toEqual(responses.page_empty);
  expect(result.current.pagination).toMatchObject({
    page: 1,
    canGoBackwards: false,
    hasNextPage: false,
    isLoading: false,
    isVisible: false,
    hasPages: false,
  });
});

describe('if there are multiple pages', () => {
  it('return correct data for the first page', async() => {
    fetchMock.mockResponse(JSON.stringify(responses.page_1), responseInit);

    const { result } = renderHook(() => useApiPaginatedQuery(params), { wrapper });
    await waitForApiResponse();

    expect(result.current.data).toEqual(responses.page_1);
    expect(result.current.pagination).toMatchObject({
      page: 1,
      canGoBackwards: false,
      hasNextPage: true,
      isLoading: false,
      isVisible: true,
    });
  });

  describe('correctly navigates forward and backward', () => {
    let result: {
      current: ApiPaginatedQueryResult<'core:address_txs'>;
    };

    beforeEach(async() => {
      fetchMock.once(JSON.stringify(responses.page_1), responseInit);
      fetchMock.once(JSON.stringify(responses.page_2), responseInit);
      fetchMock.once(JSON.stringify(responses.page_3), responseInit);
      fetchMock.once(JSON.stringify(responses.page_1), responseInit);

      const { result: r } = renderHook(() => useApiPaginatedQuery(params), { wrapper });
      result = r;
      await waitForApiResponse();
    });

    it('from page 1 to page 2', async() => {
      await act(() => {
        result.current.pagination.onNextPageClick();
      });
      await waitForApiResponse();

      expect(result.current.data).toEqual(responses.page_2);
      expect(result.current.pagination).toMatchObject({
        page: 2,
        canGoBackwards: true,
        hasNextPage: true,
        isLoading: false,
        isVisible: true,
        hasPages: true,
      });

      expect(routerStandIn.push).toHaveBeenCalledTimes(1);
      expect(routerStandIn.push).toHaveBeenLastCalledWith(expect.anything(), undefined, { shallow: true });
      expect(routerStandIn.pathname).toBe('/blocks');
      expect(routerStandIn.query).toEqual({
        next_page_params: encodePageParams(responses.page_1.next_page_params),
        page: '2',
      });

      expect(mockScrollToTop).toHaveBeenCalledTimes(1);
      expect(mockScrollToTop).toHaveBeenLastCalledWith({ duration: 0 });
    });

    it('from page 2 to page 3', async() => {
      await act(async() => {
        result.current.pagination.onNextPageClick();
      });
      await waitForApiResponse();

      await act(async() => {
        result.current.pagination.onNextPageClick();
      });
      await waitForApiResponse();

      expect(result.current.data).toEqual(responses.page_3);
      expect(result.current.pagination).toMatchObject({
        page: 3,
        canGoBackwards: true,
        hasNextPage: false,
        isLoading: false,
        isVisible: true,
        hasPages: true,
      });

      expect(routerStandIn.push).toHaveBeenCalledTimes(2);
      expect(routerStandIn.query).toEqual({
        next_page_params: encodePageParams(responses.page_2.next_page_params),
        page: '3',
      });

      expect(mockScrollToTop).toHaveBeenCalledTimes(2);
      expect(mockScrollToTop).toHaveBeenLastCalledWith({ duration: 0 });
    });

    it('from page 3 to page 2', async() => {
      await act(() => {
        result.current.pagination.onNextPageClick();
      });
      await waitForApiResponse();

      await act(() => {
        result.current.pagination.onNextPageClick();
      });
      await waitForApiResponse();

      await act(() => {
        result.current.pagination.onPrevPageClick();
      });
      await waitForApiResponse();

      expect(result.current.data).toEqual(responses.page_2);
      expect(result.current.pagination).toMatchObject({
        page: 2,
        canGoBackwards: true,
        hasNextPage: true,
        isLoading: false,
        isVisible: true,
        hasPages: true,
      });

      expect(routerStandIn.push).toHaveBeenCalledTimes(3);
      expect(routerStandIn.query).toEqual({
        next_page_params: encodePageParams(responses.page_1.next_page_params),
        page: '2',
      });

      expect(mockScrollToTop).toHaveBeenCalledTimes(3);
      expect(mockScrollToTop).toHaveBeenLastCalledWith({ duration: 0 });
    });

    it('from page 2 to page 1', async() => {
      await act(() => {
        result.current.pagination.onNextPageClick();
      });
      await waitForApiResponse();

      await act(() => {
        result.current.pagination.onNextPageClick();
      });
      await waitForApiResponse();

      await act(() => {
        result.current.pagination.onPrevPageClick();
      });
      await waitForApiResponse();

      await act(() => {
        result.current.pagination.onPrevPageClick();
      });
      await waitForApiResponse();

      expect(result.current.data).toEqual(responses.page_1);
      expect(result.current.pagination).toMatchObject({
        page: 1,
        canGoBackwards: false,
        hasNextPage: true,
        isLoading: false,
        isVisible: true,
        hasPages: false,
      });

      expect(routerStandIn.push).toHaveBeenCalledTimes(4);
      expect(routerStandIn.query).toEqual({});

      expect(mockScrollToTop).toHaveBeenCalledTimes(4);
      expect(mockScrollToTop).toHaveBeenLastCalledWith({ duration: 0 });
    });
  });

  it('correctly resets the page', async() => {
    fetchMock.once(JSON.stringify(responses.page_1), responseInit);
    fetchMock.once(JSON.stringify(responses.page_2), responseInit);
    fetchMock.once(JSON.stringify(responses.page_3), responseInit);
    fetchMock.once(JSON.stringify(responses.page_1), responseInit);

    const { result } = renderHook(() => useApiPaginatedQuery(params), { wrapper });
    await waitForApiResponse();

    await act(async() => {
      result.current.pagination.onNextPageClick();
    });
    await waitForApiResponse();

    await act(async() => {
      result.current.pagination.onNextPageClick();
    });
    await waitForApiResponse();

    await act(async() => {
      result.current.pagination.resetPage();
    });
    await waitForApiResponse();

    expect(result.current.data).toEqual(responses.page_1);
    expect(result.current.pagination).toMatchObject({
      page: 1,
      canGoBackwards: false,
      hasNextPage: true,
      isLoading: false,
      isVisible: true,
      hasPages: false,
    });

    expect(routerStandIn.push).toHaveBeenCalledTimes(3);
    expect(routerStandIn.query).toEqual({});

    expect(mockScrollToTop).toHaveBeenCalledTimes(3);
    expect(mockScrollToTop).toHaveBeenLastCalledWith({ duration: 0 });
  });

  it('when navigates between pages can scroll to custom element', async() => {
    const scrollRef = {
      current: {
        scrollIntoView: vi.fn(),
      },
    };
    const paramsWithScrollRef: Params<'core:address_txs'> = {
      ...params,
      scrollRef: scrollRef as unknown as React.RefObject<HTMLDivElement>,
    };
    fetchMock.once(JSON.stringify(responses.page_1), responseInit);
    fetchMock.once(JSON.stringify(responses.page_2), responseInit);

    const { result } = renderHook(() => useApiPaginatedQuery(paramsWithScrollRef), { wrapper });
    await waitForApiResponse();

    await act(async() => {
      result.current.pagination.onNextPageClick();
    });
    await waitForApiResponse();

    expect(scrollRef.current.scrollIntoView).toHaveBeenCalledTimes(1);
    expect(scrollRef.current.scrollIntoView).toHaveBeenCalledWith(true);
  });
});

describe('if there is page query param in URL', () => {
  it('sets this param as the page number', async() => {
    routerStandIn.reset({ pathname: '/blocks', query: { page: '3' } });
    fetchMock.mockResponse(JSON.stringify(responses.page_empty), responseInit);

    const { result } = renderHook(() => useApiPaginatedQuery(params), { wrapper });
    await waitForApiResponse();

    expect(result.current.data).toEqual(responses.page_empty);
    expect(result.current.pagination).toMatchObject({
      page: 3,
      canGoBackwards: false,
      hasNextPage: false,
      isLoading: false,
      isVisible: true,
      hasPages: true,
    });
  });

  it('correctly navigates to the following pages', async() => {
    routerStandIn.reset({ pathname: '/blocks', query: { page: '2' } });
    fetchMock.once(JSON.stringify(responses.page_2), responseInit);
    fetchMock.once(JSON.stringify(responses.page_3), responseInit);

    const { result } = renderHook(() => useApiPaginatedQuery(params), { wrapper });
    await waitForApiResponse();

    await act(async() => {
      result.current.pagination.onNextPageClick();
    });
    await waitForApiResponse();

    expect(result.current.data).toEqual(responses.page_3);
    expect(result.current.pagination).toMatchObject({
      page: 3,
      canGoBackwards: true,
      hasNextPage: false,
      isLoading: false,
      isVisible: true,
      hasPages: true,
    });

    expect(routerStandIn.push).toHaveBeenCalledTimes(1);
    expect(routerStandIn.query).toEqual({
      next_page_params: encodePageParams(responses.page_2.next_page_params),
      page: '3',
    });
  });
});

describe('queries with filters', () => {
  it('reset page, keep sorting when filter is changed', async() => {
    routerStandIn.reset({ pathname: '/blocks', query: { foo: 'bar', sort: 'val-desc' } });
    fetchMock.once(JSON.stringify(responses.page_1), responseInit);
    fetchMock.once(JSON.stringify(responses.page_2), responseInit);
    fetchMock.once(JSON.stringify(responses.page_filtered), responseInit);

    const { result } = renderHook(() => useApiPaginatedQuery(params), { wrapper });
    await waitForApiResponse();

    await act(async() => {
      result.current.pagination.onNextPageClick();
    });
    await waitForApiResponse();

    await act(async() => {
      result.current.onFilterChange({ filter: 'from' });
    });
    await waitForApiResponse();

    expect(result.current.data).toEqual(responses.page_filtered);
    expect(result.current.pagination).toMatchObject({
      page: 1,
      canGoBackwards: false,
      hasNextPage: true,
      isLoading: false,
      isVisible: true,
      hasPages: false,
    });

    expect(routerStandIn.push).toHaveBeenCalledTimes(2);
    expect(routerStandIn.query).toEqual({ filter: 'from', foo: 'bar', sort: 'val-desc' });

    expect(mockScrollToTop).toHaveBeenCalledTimes(2);
    expect(mockScrollToTop).toHaveBeenLastCalledWith({ duration: 0 });
  });

  it('saves filter params in query when navigating between pages', async() => {
    routerStandIn.reset({ pathname: '/blocks', query: { filter: 'from', foo: 'bar' } });
    fetchMock.once(JSON.stringify(responses.page_1), responseInit);
    fetchMock.once(JSON.stringify(responses.page_2), responseInit);

    const { result } = renderHook(() => useApiPaginatedQuery(params), { wrapper });
    await waitForApiResponse();

    await act(async() => {
      result.current.pagination.onNextPageClick();
    });
    await waitForApiResponse();

    expect(routerStandIn.push).toHaveBeenCalledTimes(1);
    expect(routerStandIn.query).toEqual({
      filter: 'from',
      foo: 'bar',
      next_page_params: encodePageParams(responses.page_1.next_page_params),
      page: '2',
    });
  });
});

describe('queries with sorting', () => {
  it('reset page, save filter when sorting is changed', async() => {
    routerStandIn.reset({ pathname: '/blocks', query: { foo: 'bar', filter: 'from' } });
    fetchMock.once(JSON.stringify(responses.page_1), responseInit);
    fetchMock.once(JSON.stringify(responses.page_2), responseInit);
    fetchMock.once(JSON.stringify(responses.page_sorted), responseInit);

    const { result } = renderHook(() => useApiPaginatedQuery(params), { wrapper });
    await waitForApiResponse();

    await act(async() => {
      result.current.pagination.onNextPageClick();
    });
    await waitForApiResponse();

    await act(async() => {
      // @ts-ignore:
      result.current.onSortingChange({ sort: 'val-desc' });
    });
    await waitForApiResponse();

    expect(result.current.data).toEqual(responses.page_sorted);
    expect(result.current.pagination).toMatchObject({
      page: 1,
      canGoBackwards: false,
      hasNextPage: false,
      isLoading: false,
      isVisible: false,
      hasPages: false,
    });

    expect(routerStandIn.push).toHaveBeenCalledTimes(2);
    expect(routerStandIn.query).toEqual({ filter: 'from', foo: 'bar', sort: 'val-desc' });

    expect(mockScrollToTop).toHaveBeenCalledTimes(2);
    expect(mockScrollToTop).toHaveBeenLastCalledWith({ duration: 0 });
  });

  it('saves sorting params in query when navigating between pages', async() => {
    routerStandIn.reset({ pathname: '/blocks', query: { foo: 'bar', sort: 'val-desc' } });
    fetchMock.once(JSON.stringify(responses.page_1), responseInit);
    fetchMock.once(JSON.stringify(responses.page_2), responseInit);

    const { result } = renderHook(() => useApiPaginatedQuery(params), { wrapper });
    await waitForApiResponse();

    await act(async() => {
      result.current.pagination.onNextPageClick();
    });
    await waitForApiResponse();

    expect(routerStandIn.push).toHaveBeenCalledTimes(1);
    expect(routerStandIn.query).toEqual({
      sort: 'val-desc',
      foo: 'bar',
      next_page_params: encodePageParams(responses.page_1.next_page_params),
      page: '2',
    });
  });
});

describe('router query changes', () => {
  it('refetches correct page when page number changes in URL', async() => {
    routerStandIn.reset({
      pathname: '/blocks',
      query: {
        page: '3',
        next_page_params: encodePageParams(responses.page_2.next_page_params),
      },
    });
    fetchMock.once(JSON.stringify(responses.page_3), responseInit);
    fetchMock.once(JSON.stringify(responses.page_2), responseInit);

    const { result } = renderHook(() => useApiPaginatedQuery(params), { wrapper });
    await waitForApiResponse();

    expect(result.current.data).toEqual(responses.page_3);
    expect(result.current.pagination.page).toBe(3);

    act(() => {
      routerStandIn.setQuery({
        page: '2',
        next_page_params: encodePageParams(responses.page_1.next_page_params),
      });
    });
    await waitForApiResponse();

    expect(result.current.data).toEqual(responses.page_2);
    expect(result.current.pagination).toMatchObject({
      page: 2,
      canGoBackwards: false,
      hasNextPage: true,
      isLoading: false,
      isVisible: true,
    });
  });
});

describe('values derived from the URL', () => {
  it('reads filters and sorting from the URL', async() => {
    routerStandIn.reset({ pathname: '/blocks', query: { filter: 'to', sort: 'value', order: 'desc', foo: 'bar' } });
    fetchMock.mockResponse(JSON.stringify(responses.page_1), responseInit);

    const { result } = renderHook(() => useApiPaginatedQuery(params), { wrapper });
    await waitForApiResponse();

    expect(result.current.filters).toEqual({ filter: 'to' });
    expect(result.current.sorting).toEqual({ sort: 'value', order: 'desc' });
    expect(new URL(String(fetchMock.mock.calls[0][0])).search).toBe('?filter=to&sort=value&order=desc');
  });

  it('lets fixed queryParams win over a URL filter field of the same name', async() => {
    routerStandIn.reset({ pathname: '/blocks', query: { filter: 'to', page: '2', next_page_params: encodePageParams(responses.page_1.next_page_params) } });
    fetchMock.mockResponse(JSON.stringify(responses.page_2), responseInit);
    const paramsWithFixedFilter: Params<'core:address_txs'> = {
      ...params,
      queryParams: { filter: 'validated' },
    };

    const { result } = renderHook(() => useApiPaginatedQuery(paramsWithFixedFilter), { wrapper });
    await waitForApiResponse();

    expect(new URL(String(fetchMock.mock.calls[0][0])).searchParams.get('filter')).toBe('validated');
    expect(new URL(String(fetchMock.mock.calls[0][0])).searchParams.get('block_number')).toBe('11');
    expect(result.current.pagination.page).toBe(2);
  });

  it('targets the given chain and folds it into the query hash', async() => {
    fetchMock.mockResponse(JSON.stringify(responses.page_1), responseInit);

    const { result, rerender } = renderHook((hookParams: Params<'core:address_txs'>) => useApiPaginatedQuery(hookParams), {
      wrapper,
      initialProps: params,
    });
    await waitForApiResponse();
    const hashWithoutChain = result.current.queryHash;

    rerender({ ...params, chain: chainA });
    await waitForApiResponse();

    expect(new URL(String(fetchMock.mock.calls[1][0])).origin).toBe(chainA.app_config.apis.core?.endpoint);
    expect(result.current.queryHash).not.toBe(hashWithoutChain);
  });

  it('exposes the loading flags for the list body', async() => {
    fetchMock.mockResponse(JSON.stringify(responses.page_1), responseInit);
    const paramsWithStub: Params<'core:address_txs'> = {
      ...params,
      options: { placeholderData: generateListStub<'core:address_txs'>(TX_ITEM, 1, { next_page_params: null }) },
    };

    const { result } = renderHook(() => useApiPaginatedQuery(paramsWithStub), { wrapper });
    expect(result.current.isInitialLoading).toBe(true);
    expect(result.current.isTransitioning).toBe(false);
    expect(result.current.pagination.isLoading).toBe(true);

    await waitForApiResponse();

    expect(result.current.isInitialLoading).toBe(false);
    expect(result.current.isTransitioning).toBe(false);
    expect(result.current.pagination.isLoading).toBe(false);
  });

  it('renders the stub, not the previous rows, while the next page loads', async() => {
    fetchMock.once(JSON.stringify(responses.page_1), responseInit);
    const releasePages: Array<() => void> = [];
    for (const pageResponse of [ responses.page_2, responses.page_3 ]) {
      let release!: () => void;
      const pending = new Promise<void>((resolve) => {
        release = resolve;
      });
      fetchMock.once(async() => {
        await pending;
        return JSON.stringify(pageResponse);
      }, responseInit);
      releasePages.push(release);
    }
    const stub = generateListStub<'core:address_txs'>(TX_ITEM, 1, { next_page_params: null });
    const paramsWithStub: Params<'core:address_txs'> = {
      ...params,
      options: { placeholderData: stub },
    };

    const { result } = renderHook(() => useApiPaginatedQuery(paramsWithStub), { wrapper });
    await waitForApiResponse();

    for (const expectedPage of [ 2, 3 ]) {
      await act(async() => {
        result.current.pagination.onNextPageClick();
      });

      expect(result.current.pagination.page).toBe(expectedPage);
      expect(result.current.data).toEqual(stub);
      expect(result.current.isInitialLoading).toBe(true);
      expect(result.current.isTransitioning).toBe(false);
      expect(result.current.pagination.isLoading).toBe(true);

      releasePages[expectedPage - 2]();
      await waitForApiResponse();

      expect(result.current.isInitialLoading).toBe(false);
      expect(result.current.pagination.isLoading).toBe(false);
    }

    expect(result.current.data).toEqual(responses.page_3);
  });
});

describe('referential stability', () => {
  it('keeps the result, pagination and callbacks across a re-render with the same inputs', async() => {
    fetchMock.mockResponse(JSON.stringify(responses.page_1), responseInit);

    const { result, rerender } = renderHook((hookParams: Params<'core:address_txs'>) => useApiPaginatedQuery(hookParams), {
      wrapper,
      initialProps: params,
    });
    await waitForApiResponse();
    const before = result.current;

    rerender(params);

    expect(result.current).toBe(before);
    expect(result.current.pagination).toBe(before.pagination);
    expect(result.current.pagination.onNextPageClick).toBe(before.pagination.onNextPageClick);
    expect(result.current.pagination.onPrevPageClick).toBe(before.pagination.onPrevPageClick);
    expect(result.current.pagination.resetPage).toBe(before.pagination.resetPage);
    expect(result.current.onFilterChange).toBe(before.onFilterChange);
    expect(result.current.onSortingChange).toBe(before.onSortingChange);
  });

  it('keeps the same query hash across a re-render and changes it on a page change', async() => {
    fetchMock.once(JSON.stringify(responses.page_1), responseInit);
    fetchMock.once(JSON.stringify(responses.page_2), responseInit);

    const { result, rerender } = renderHook((hookParams: Params<'core:address_txs'>) => useApiPaginatedQuery(hookParams), {
      wrapper,
      initialProps: params,
    });
    await waitForApiResponse();
    const hashBefore = result.current.queryHash;

    rerender(params);
    expect(result.current.queryHash).toBe(hashBefore);

    await act(async() => {
      result.current.pagination.onNextPageClick();
    });
    await waitForApiResponse();

    expect(result.current.queryHash).not.toBe(hashBefore);
  });
});

describe('cost of one user action', () => {
  const paramsWithStub: Params<'core:address_txs'> = {
    ...params,
    options: { placeholderData: generateListStub<'core:address_txs'>(TX_ITEM, 1, { next_page_params: null }) },
  };

  interface RenderSnapshot {
    readonly page: number;
    readonly isLoading: boolean;
  }

  const requestSearch = (url: string) => new URL(url).search;

  const respondByCursor = (request: Request) => {
    const search = requestSearch(request.url);
    if (search.includes('filter=from')) {
      return Promise.resolve({ body: JSON.stringify(responses.page_filtered), ...responseInit });
    }
    if (search.includes(`block_number=${ responses.page_2.next_page_params.block_number }`)) {
      return Promise.resolve({ body: JSON.stringify(responses.page_3), ...responseInit });
    }
    if (search.includes(`block_number=${ responses.page_1.next_page_params.block_number }`)) {
      return Promise.resolve({ body: JSON.stringify(responses.page_2), ...responseInit });
    }
    return Promise.resolve({ body: JSON.stringify(responses.page_1), ...responseInit });
  };

  async function renderOnPage(pageNumber: number) {
    fetchMock.mockResponse(respondByCursor);
    const renderLog: Array<RenderSnapshot> = [];
    let consumerRenders = 0;
    let rendersAtMark = 0;
    let consumerRendersAtMark = 0;
    let requestsAtMark = 0;

    const Consumer = React.memo(function Consumer(props: { query: ApiPaginatedQueryResult<'core:address_txs'> }) {
      consumerRenders++;
      return React.createElement('span', null, props.query.pagination.page);
    });

    const result: { current: ApiPaginatedQueryResult<'core:address_txs'> } = { current: undefined as never };
    const Host = (hookParams: Params<'core:address_txs'>) => {
      const hookResult = useApiPaginatedQuery(hookParams);
      renderLog.push({ page: hookResult.pagination.page, isLoading: hookResult.pagination.isLoading });
      result.current = hookResult;
      return React.createElement(Consumer, { query: hookResult });
    };

    render(React.createElement(Host, paramsWithStub));
    await waitForApiResponse();

    for (let page = 1; page < pageNumber; page++) {
      await act(async() => {
        result.current.pagination.onNextPageClick();
      });
      await waitForApiResponse();
    }
    expect(result.current.pagination.page).toBe(pageNumber);

    return {
      result,
      mark: () => {
        rendersAtMark = renderLog.length;
        consumerRendersAtMark = consumerRenders;
        requestsAtMark = fetchMock.mock.calls.length;
      },
      rendersSinceMark: () => renderLog.slice(rendersAtMark),
      consumerRendersSinceMark: () => consumerRenders - consumerRendersAtMark,
      requestsSinceMark: () => fetchMock.mock.calls.slice(requestsAtMark).map(([ url ]) => requestSearch(String(url))),
    };
  }

  it('"First" from page 3', async() => {
    const { result, mark, rendersSinceMark, requestsSinceMark } = await renderOnPage(3);

    mark();
    await act(async() => {
      result.current.pagination.resetPage();
    });
    await waitForApiResponse();

    expect(result.current.data).toEqual(responses.page_1);
    expect(result.current.pagination).toMatchObject({ page: 1, isLoading: false });
    expect(routerStandIn.push).toHaveBeenCalledTimes(3);
    // parent spec row "First" from page 3 — cached page 1 is shown at once, no page-3 skeleton
    expect(rendersSinceMark()[0]).toEqual({ page: 1, isLoading: false });
    // parent spec row "First" from page 3 — API requests (page 1 refreshed in the background only)
    expect(requestsSinceMark()).toEqual([ '' ]);
    // parent spec row "First" from page 3 — renders
    expect(rendersSinceMark()).toHaveLength(RENDERS_PER_NAVIGATION);
  });

  it('filter change while on page 3', async() => {
    const { result, mark, rendersSinceMark, requestsSinceMark } = await renderOnPage(3);

    mark();
    await act(async() => {
      result.current.onFilterChange({ filter: 'from' });
    });
    await waitForApiResponse();

    expect(result.current.data).toEqual(responses.page_filtered);
    expect(result.current.pagination).toMatchObject({ page: 1, isLoading: false });
    expect(routerStandIn.query).toEqual({ filter: 'from' });
    // parent spec row "Filter change while on page 3" — API requests (the new filter on page 1 only)
    expect(requestsSinceMark()).toEqual([ '?filter=from' ]);
    // parent spec row "Filter change while on page 3" — renders
    expect(rendersSinceMark()).toHaveLength(RENDERS_PER_NAVIGATION);
  });

  it('"Prev" from page 2 to page 1', async() => {
    const { result, mark, rendersSinceMark, requestsSinceMark } = await renderOnPage(2);

    mark();
    await act(async() => {
      result.current.pagination.onPrevPageClick();
    });

    // parent spec row "Prev" from page 2 to page 1 — cached rows shown at once, no skeleton
    expect(result.current.data).toEqual(responses.page_1);
    expect(result.current.isPlaceholderData).toBe(false);
    expect(rendersSinceMark()[0]).toEqual({ page: 1, isLoading: false });

    await waitForApiResponse();

    expect(result.current.pagination).toMatchObject({ page: 1, isLoading: false });
    // parent spec row "Prev" from page 2 to page 1 — API requests (background refresh of page 1 only)
    expect(requestsSinceMark()).toEqual([ '' ]);
    // parent spec row "Prev" from page 2 to page 1 — renders
    expect(rendersSinceMark()).toHaveLength(RENDERS_PER_NAVIGATION);
  });

  it('unrelated router.query change', async() => {
    const { result, mark, consumerRendersSinceMark, requestsSinceMark } = await renderOnPage(2);
    const dataBefore = result.current.data;
    const resultBefore = result.current;

    mark();
    act(() => {
      routerStandIn.setQuery({ ...routerStandIn.query, tab: 'txs' });
    });
    await waitForApiResponse();

    expect(result.current.data).toBe(dataBefore);
    expect(result.current).toBe(resultBefore);
    expect(requestsSinceMark()).toEqual([]);
    // parent spec row "Unrelated router.query change" — re-renders of a memoized consumer
    expect(consumerRendersSinceMark()).toBe(0);
  });
});

async function waitForApiResponse() {
  await flushPromises();
  await act(flushPromises);
}

// @vitest-environment jsdom

import type React from 'react';

import type { NextPageParams } from './types';

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, cleanup } from 'vitest/lib';
import { routerStandIn } from 'vitest/utils/routerStandIn';

const { mockScrollToTop } = vi.hoisted(() => ({
  mockScrollToTop: vi.fn(),
}));

vi.mock('next/router', () => import('vitest/utils/routerStandIn').then((m) => m.nextRouterModule));
vi.mock('react-scroll', () => ({ animateScroll: { scrollToTop: mockScrollToTop } }));

import type { PaginationActionsParams } from './usePaginationActions';
import { usePaginationActions } from './usePaginationActions';
import { usePaginationParams } from './usePaginationParams';

const PAGE_1_CURSOR = { block_number: 11, index: 12, items_count: 13 };
const PAGE_2_CURSOR = { block_number: 21, index: 22, items_count: 23 };

const encodeCursor = (cursor: object) => encodeURIComponent(JSON.stringify(cursor));

type Overrides = Partial<Pick<PaginationActionsParams<'core:address_txs'>, 'scrollRef' | 'noScroll'>>;

interface HookProps {
  nextPageParams: NextPageParams | undefined;
  overrides?: Overrides;
}

function renderActions(nextPageParams: NextPageParams | undefined, overrides: Overrides = {}) {
  const initialProps: HookProps = { nextPageParams, overrides };
  return renderHook(({ nextPageParams, overrides }: HookProps) => {
    const { page, cursor } = usePaginationParams('core:address_txs');
    return usePaginationActions({
      resourceName: 'core:address_txs',
      page,
      cursor,
      nextPageParams,
      scrollRef: undefined,
      noScroll: undefined,
      ...overrides,
    });
  }, { initialProps });
}

beforeEach(() => {
  mockScrollToTop.mockClear();
  routerStandIn.reset({ pathname: '/blocks' });
});

afterEach(cleanup);

describe('next page', () => {
  it('pushes the next page number and the encoded cursor, keeping other params', async() => {
    routerStandIn.reset({ pathname: '/blocks', query: { tab: 'txs', filter: 'from' } });
    const { result } = renderActions(PAGE_1_CURSOR);

    await act(async() => {
      result.current.onNextPageClick();
    });

    expect(routerStandIn.push).toHaveBeenCalledTimes(1);
    expect(routerStandIn.push).toHaveBeenLastCalledWith(expect.anything(), undefined, { shallow: true });
    expect(routerStandIn.query).toEqual({ tab: 'txs', filter: 'from', page: '2', next_page_params: encodeCursor(PAGE_1_CURSOR) });
    expect(mockScrollToTop).toHaveBeenCalledTimes(1);
  });

  it('does nothing when there is no cursor for the next page', async() => {
    const { result } = renderActions(undefined);

    await act(async() => {
      result.current.onNextPageClick();
    });

    expect(routerStandIn.push).not.toHaveBeenCalled();
    expect(mockScrollToTop).not.toHaveBeenCalled();
  });
});

describe('previous page', () => {
  it('returns to the cursor recorded when the page was entered', async() => {
    const { result, rerender } = renderActions(PAGE_1_CURSOR);

    await act(async() => {
      result.current.onNextPageClick();
    });
    rerender({ nextPageParams: PAGE_2_CURSOR });
    await act(async() => {
      result.current.onNextPageClick();
    });
    expect(routerStandIn.query).toMatchObject({ page: '3' });

    await act(async() => {
      result.current.onPrevPageClick();
    });

    expect(routerStandIn.query).toEqual({ page: '2', next_page_params: encodeCursor(PAGE_1_CURSOR) });
    expect(result.current.canGoBackwards).toBe(true);
  });

  it('strips the page params when returning to the first page', async() => {
    routerStandIn.reset({ pathname: '/blocks', query: { filter: 'from' } });
    const { result } = renderActions(PAGE_1_CURSOR);

    await act(async() => {
      result.current.onNextPageClick();
    });
    await act(async() => {
      result.current.onPrevPageClick();
    });

    expect(routerStandIn.query).toEqual({ filter: 'from' });
    expect(result.current.canGoBackwards).toBe(false);
    expect(mockScrollToTop).toHaveBeenCalledTimes(2);
  });

  it('cannot go backwards from a deep page reached by URL', () => {
    routerStandIn.reset({ pathname: '/blocks', query: { page: '3', next_page_params: encodeCursor(PAGE_2_CURSOR) } });
    const { result } = renderActions(undefined);

    expect(result.current.canGoBackwards).toBe(false);
  });

  it('can go backwards after moving forward from a page reached by URL', async() => {
    routerStandIn.reset({ pathname: '/blocks', query: { page: '2', next_page_params: encodeCursor(PAGE_1_CURSOR) } });
    const { result } = renderActions(PAGE_2_CURSOR);

    await act(async() => {
      result.current.onNextPageClick();
    });
    expect(result.current.canGoBackwards).toBe(true);

    await act(async() => {
      result.current.onPrevPageClick();
    });

    expect(routerStandIn.query).toEqual({ page: '2', next_page_params: encodeCursor(PAGE_1_CURSOR) });
  });
});

describe('first page', () => {
  it('strips the page params and keeps everything else', async() => {
    routerStandIn.reset({
      pathname: '/blocks',
      query: { page: '3', next_page_params: encodeCursor(PAGE_2_CURSOR), filter: 'from', sort: 'value' },
    });
    const { result } = renderActions(undefined);

    await act(async() => {
      result.current.resetPage();
    });

    expect(routerStandIn.push).toHaveBeenCalledTimes(1);
    expect(routerStandIn.query).toEqual({ filter: 'from', sort: 'value' });
    expect(mockScrollToTop).toHaveBeenCalledTimes(1);
  });
});

describe('filter change', () => {
  it('replaces the resource filter fields and resets the page', async() => {
    routerStandIn.reset({
      pathname: '/blocks',
      query: { page: '2', next_page_params: encodeCursor(PAGE_1_CURSOR), filter: 'from', sort: 'value', foo: 'bar' },
    });
    const { result } = renderActions(undefined);

    await act(async() => {
      result.current.onFilterChange({ filter: 'to' });
    });

    expect(routerStandIn.query).toEqual({ filter: 'to', sort: 'value', foo: 'bar' });
    expect(mockScrollToTop).toHaveBeenCalledTimes(1);
  });

  it('drops empty values, joins arrays and keeps booleans', async() => {
    routerStandIn.reset({ pathname: '/blocks', query: { filter: 'from', type: 'coin_transfer' } });
    const { result } = renderHook(() => {
      const { page, cursor } = usePaginationParams('core:txs');
      return usePaginationActions({
        resourceName: 'core:txs',
        page,
        cursor,
        nextPageParams: undefined,
        scrollRef: undefined,
        noScroll: undefined,
      });
    });

    await act(async() => {
      // @ts-expect-error -- the URL encoding rules are what is under test, not the per-resource filter types
      result.current.onFilterChange({ filter: '', type: [ 'coin_transfer', 'token_transfer' ], only_verified: true });
    });

    expect(routerStandIn.query).toEqual({ type: 'coin_transfer,token_transfer', only_verified: 'true' });
  });

  it('clears the filters when called without a value', async() => {
    routerStandIn.reset({ pathname: '/blocks', query: { filter: 'from', foo: 'bar' } });
    const { result } = renderActions(undefined);

    await act(async() => {
      result.current.onFilterChange(undefined);
    });

    expect(routerStandIn.query).toEqual({ foo: 'bar' });
  });
});

describe('sorting change', () => {
  it('replaces sort and order and resets the page', async() => {
    routerStandIn.reset({
      pathname: '/blocks',
      query: { page: '2', next_page_params: encodeCursor(PAGE_1_CURSOR), sort: 'value', order: 'asc', filter: 'from' },
    });
    const { result } = renderActions(undefined);

    await act(async() => {
      result.current.onSortingChange({ sort: 'fee', order: 'desc' });
    });

    expect(routerStandIn.query).toEqual({ sort: 'fee', order: 'desc', filter: 'from' });
    expect(mockScrollToTop).toHaveBeenCalledTimes(1);
  });

  it('removes sorting when called without a value', async() => {
    routerStandIn.reset({ pathname: '/blocks', query: { sort: 'value', order: 'asc', filter: 'from' } });
    const { result } = renderActions(undefined);

    await act(async() => {
      result.current.onSortingChange(undefined);
    });

    expect(routerStandIn.query).toEqual({ filter: 'from' });
  });
});

describe('scrolling', () => {
  it('scrolls the given element into view instead of the window', async() => {
    const scrollRef = { current: { scrollIntoView: vi.fn() } };
    const { result } = renderActions(PAGE_1_CURSOR, { scrollRef: scrollRef as unknown as React.RefObject<HTMLDivElement> });

    await act(async() => {
      result.current.onNextPageClick();
    });

    expect(scrollRef.current.scrollIntoView).toHaveBeenCalledWith(true);
    expect(mockScrollToTop).not.toHaveBeenCalled();
  });

  it('does not scroll when disabled', async() => {
    const { result } = renderActions(PAGE_1_CURSOR, { noScroll: true });

    await act(async() => {
      result.current.onNextPageClick();
    });

    expect(mockScrollToTop).not.toHaveBeenCalled();
  });
});

describe('stability', () => {
  it('keeps the same callbacks across re-renders and navigation', async() => {
    const { result, rerender } = renderActions(PAGE_1_CURSOR);
    const before = result.current;

    rerender({ nextPageParams: PAGE_2_CURSOR });
    await act(async() => {
      result.current.onNextPageClick();
    });

    expect(result.current.onNextPageClick).toBe(before.onNextPageClick);
    expect(result.current.onPrevPageClick).toBe(before.onPrevPageClick);
    expect(result.current.resetPage).toBe(before.resetPage);
    expect(result.current.onFilterChange).toBe(before.onFilterChange);
    expect(result.current.onSortingChange).toBe(before.onSortingChange);
  });

  it('keeps the same object when nothing relevant changed', () => {
    const { result, rerender } = renderActions(PAGE_1_CURSOR);
    const before = result.current;

    rerender({ nextPageParams: PAGE_1_CURSOR });

    expect(result.current).toBe(before);
  });
});

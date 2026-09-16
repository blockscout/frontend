// @vitest-environment jsdom

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, cleanup } from 'vitest/lib';
import { routerStandIn } from 'vitest/utils/routerStandIn';

vi.mock('next/router', () => import('vitest/utils/routerStandIn').then((m) => m.nextRouterModule));

import { usePaginationParams } from './usePaginationParams';

const CURSOR = { block_number: 11, index: 12, items_count: 13 };
const ENCODED_CURSOR = encodeURIComponent(JSON.stringify(CURSOR));

beforeEach(() => {
  routerStandIn.reset({ pathname: '/blocks' });
});

afterEach(cleanup);

describe('usePaginationParams', () => {
  it('defaults to the first page with no cursor, filters or sorting', () => {
    const { result } = renderHook(() => usePaginationParams('core:address_txs'));

    expect(result.current).toEqual({ page: 1, cursor: {}, filters: {}, sorting: {} });
  });

  it('reads page and cursor from the URL', () => {
    routerStandIn.reset({ pathname: '/blocks', query: { page: '3', next_page_params: ENCODED_CURSOR } });

    const { result } = renderHook(() => usePaginationParams('core:address_txs'));

    expect(result.current.page).toBe(3);
    expect(result.current.cursor).toEqual(CURSOR);
  });

  it('ignores a cursor that is not valid JSON', () => {
    routerStandIn.reset({ pathname: '/blocks', query: { page: '2', next_page_params: 'not-json' } });

    const { result } = renderHook(() => usePaginationParams('core:address_txs'));

    expect(result.current.cursor).toEqual({});
  });

  it('falls back to page 1 when the page param is repeated', () => {
    routerStandIn.reset({ pathname: '/blocks', query: { page: [ '2', '3' ] } });

    const { result } = renderHook(() => usePaginationParams('core:address_txs'));

    expect(result.current.page).toBe(1);
  });

  it('picks only the filter fields declared by the resource', () => {
    routerStandIn.reset({ pathname: '/blocks', query: { filter: 'from', type: 'coin_transfer', foo: 'bar' } });

    const { result: addressTxs } = renderHook(() => usePaginationParams('core:address_txs'));
    const { result: txs } = renderHook(() => usePaginationParams('core:txs'));

    expect(addressTxs.current.filters).toEqual({ filter: 'from' });
    expect(txs.current.filters).toEqual({ filter: 'from', type: 'coin_transfer' });
  });

  it('reads sorting from the sort and order params', () => {
    routerStandIn.reset({ pathname: '/blocks', query: { sort: 'value', order: 'desc', foo: 'bar' } });

    const { result } = renderHook(() => usePaginationParams('core:address_txs'));

    expect(result.current.sorting).toEqual({ sort: 'value', order: 'desc' });
  });

  it('keeps the same object across an unrelated URL change', () => {
    routerStandIn.reset({ pathname: '/blocks', query: { page: '2', next_page_params: ENCODED_CURSOR, filter: 'to' } });
    const { result } = renderHook(() => usePaginationParams('core:address_txs'));
    const before = result.current;

    act(() => {
      routerStandIn.setQuery({ ...routerStandIn.query, tab: 'txs' });
    });

    expect(result.current).toBe(before);
  });

  it('returns a new object when a list param changes', () => {
    routerStandIn.reset({ pathname: '/blocks', query: { filter: 'to' } });
    const { result } = renderHook(() => usePaginationParams('core:address_txs'));
    const before = result.current;

    act(() => {
      routerStandIn.setQuery({ filter: 'from' });
    });

    expect(result.current).not.toBe(before);
    expect(result.current.filters).toEqual({ filter: 'from' });
  });
});

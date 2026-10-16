// @vitest-environment jsdom

import type { UseQueryResult } from '@tanstack/react-query';
import Cookies from 'js-cookie';

import type { operations } from '@blockscout/api-types';

import type { ResourceError } from 'src/api/resources';

import { describe, it, expect, afterEach } from 'vitest';
import { renderHook, act, cleanup } from 'vitest/lib';

import useTxsSort from './useTxsSort';

type QueryResult = UseQueryResult<operations['TransactionController.transactions']['json'], ResourceError<unknown>>;

const pendingQuery = { isPending: true, isError: false } as QueryResult;

afterEach(() => {
  cleanup();
  Cookies.remove('txs_sort');
});

describe('useTxsSort', () => {
  it('restores the saved block number sort when block sort is available', () => {
    Cookies.set('txs_sort', 'block_number-asc');

    const { result } = renderHook(() => useTxsSort(pendingQuery));

    expect(result.current.sorting).toBe('block_number-asc');
  });

  it('falls back to default for a saved block number sort when block sort is unavailable', () => {
    Cookies.set('txs_sort', 'block_number-asc');

    const { result } = renderHook(() => useTxsSort(pendingQuery, false));

    expect(result.current.sorting).toBe('default');
  });

  it('restores a saved value sort when block sort is unavailable', () => {
    Cookies.set('txs_sort', 'value-desc');

    const { result } = renderHook(() => useTxsSort(pendingQuery, false));

    expect(result.current.sorting).toBe('value-desc');
  });

  it('falls back to default for an unknown saved sort', () => {
    Cookies.set('txs_sort', 'foo-asc');

    const { result } = renderHook(() => useTxsSort(pendingQuery));

    expect(result.current.sorting).toBe('default');
  });

  it('sorts the loaded page by the chosen field and saves the choice', () => {
    const query = {
      isPending: false,
      isError: false,
      data: { items: [ { value: '11' }, { value: '42' }, { value: '24' } ], next_page_params: null },
    // the hook only reads the status flags and data.items, so a partial success result is enough
    } as unknown as QueryResult;

    const { result } = renderHook(() => useTxsSort(query, false));
    act(() => result.current.setSortByValue('value-desc'));

    expect(result.current.data?.items.map(({ value }) => value)).toEqual([ '42', '24', '11' ]);
    expect(Cookies.get('txs_sort')).toBe('value-desc');
  });
});

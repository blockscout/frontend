// @vitest-environment jsdom

import { describe, it, expect, afterEach } from 'vitest';
import { renderHook, cleanup } from 'vitest/lib';
import { routerStandIn } from 'vitest/utils/routerStandIn';

import { useClusterSearch } from './useClusterSearch';

describe('useClusterSearch', () => {
  afterEach(cleanup);

  it('should return search term from router query', () => {
    routerStandIn.reset({ pathname: '/name-domains', query: { q: 'test-search' } });

    const { result } = renderHook(() => useClusterSearch(), { wrapper: routerStandIn.wrapper });

    expect(result.current.searchTerm).toBe('test-search');
  });

  it('should debounce search term', () => {
    routerStandIn.reset({ pathname: '/name-domains', query: { q: 'test' } });

    const { result } = renderHook(() => useClusterSearch(), { wrapper: routerStandIn.wrapper });

    expect(result.current.debouncedSearchTerm).toBe('test');
  });

  it('should handle empty query', () => {
    routerStandIn.reset({ pathname: '/name-domains', query: {} });

    const { result } = renderHook(() => useClusterSearch(), { wrapper: routerStandIn.wrapper });

    expect(result.current.searchTerm).toBe('');
    expect(result.current.debouncedSearchTerm).toBe('');
  });
});

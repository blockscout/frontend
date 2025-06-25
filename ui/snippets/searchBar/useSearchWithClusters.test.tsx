import { renderHook } from '@testing-library/react';

import useApiQuery from 'lib/api/useApiQuery';

import useQuickSearchQuery from './useQuickSearchQuery';
import useSearchWithClusters from './useSearchWithClusters';

// Type definitions for mocks
type MockQuickSearchQuery = ReturnType<typeof useQuickSearchQuery>;
type MockApiQuery = ReturnType<typeof useApiQuery>;

jest.mock('lib/api/useApiQuery');
jest.mock('./useQuickSearchQuery');
jest.mock('lib/hooks/useDebounce', () => (value: unknown) => value);

const mockUseApiQuery = useApiQuery as jest.MockedFunction<typeof useApiQuery>;
const mockUseQuickSearchQuery = useQuickSearchQuery as jest.MockedFunction<typeof useQuickSearchQuery>;

jest.mock('configs/app', () => ({
  features: {
    clusters: {
      isEnabled: true,
    },
    rollbar: {
      isEnabled: false,
    },
  },
}));

describe('useSearchWithClusters', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseQuickSearchQuery.mockReturnValue({
      searchTerm: '',
      debouncedSearchTerm: '',
      handleSearchTermChange: jest.fn(),
      query: {
        data: [],
        isError: false,
        isLoading: false,
      },
      redirectCheckQuery: {
        data: null,
        isError: false,
        isLoading: false,
      },
    } as unknown as MockQuickSearchQuery);

    mockUseApiQuery.mockReturnValue({
      data: null,
      isError: false,
      isLoading: false,
    } as unknown as MockApiQuery);
  });

  describe('cluster search pattern matching', () => {
    it('should detect cluster search with trailing slash', () => {
      mockUseQuickSearchQuery.mockReturnValue({
        searchTerm: 'test-cluster/',
        debouncedSearchTerm: 'test-cluster/',
        handleSearchTermChange: jest.fn(),
        query: { data: [], isError: false, isLoading: false },
        redirectCheckQuery: { data: null, isError: false, isLoading: false },
      } as unknown as MockQuickSearchQuery);

      renderHook(() => useSearchWithClusters());

      expect(mockUseApiQuery).toHaveBeenCalledWith('clusters:get_cluster_by_name', {
        queryParams: {
          input: JSON.stringify({ name: 'test-cluster' }),
        },
        queryOptions: { enabled: true },
      });
    });

    it('should not detect cluster search without trailing slash', () => {
      mockUseQuickSearchQuery.mockReturnValue({
        searchTerm: 'test-cluster',
        debouncedSearchTerm: 'test-cluster',
        handleSearchTermChange: jest.fn(),
        query: { data: [], isError: false, isLoading: false },
        redirectCheckQuery: { data: null, isError: false, isLoading: false },
      } as unknown as MockQuickSearchQuery);

      renderHook(() => useSearchWithClusters());

      expect(mockUseApiQuery).toHaveBeenCalledWith('clusters:get_cluster_by_name', {
        queryParams: {
          input: JSON.stringify({ name: '' }),
        },
        queryOptions: { enabled: false },
      });
    });

    it('should handle cluster search with whitespace', () => {
      mockUseQuickSearchQuery.mockReturnValue({
        searchTerm: '  my-cluster/  ',
        debouncedSearchTerm: '  my-cluster/  ',
        handleSearchTermChange: jest.fn(),
        query: { data: [], isError: false, isLoading: false },
        redirectCheckQuery: { data: null, isError: false, isLoading: false },
      } as unknown as MockQuickSearchQuery);

      renderHook(() => useSearchWithClusters());

      expect(mockUseApiQuery).toHaveBeenCalledWith('clusters:get_cluster_by_name', {
        queryParams: {
          input: JSON.stringify({ name: '  my-cluster/  ' }),
        },
        queryOptions: { enabled: true },
      });
    });

    it('should handle complex cluster names with hyphens and numbers', () => {
      mockUseQuickSearchQuery.mockReturnValue({
        searchTerm: 'test-cluster-123/',
        debouncedSearchTerm: 'test-cluster-123/',
        handleSearchTermChange: jest.fn(),
        query: { data: [], isError: false, isLoading: false },
        redirectCheckQuery: { data: null, isError: false, isLoading: false },
      } as unknown as MockQuickSearchQuery);

      renderHook(() => useSearchWithClusters());

      expect(mockUseApiQuery).toHaveBeenCalledWith('clusters:get_cluster_by_name', {
        queryParams: {
          input: JSON.stringify({ name: 'test-cluster-123' }),
        },
        queryOptions: { enabled: true },
      });
    });

    it('should extract cluster name correctly from various formats', () => {
      const testCases = [
        { input: 'simple/', expected: 'simple' },
        { input: 'cluster-name/', expected: 'cluster-name' },
        { input: 'my_cluster_123/', expected: 'my_cluster_123' },
        { input: 'ClusterWithCaps/', expected: 'ClusterWithCaps' },
      ];

      testCases.forEach(({ input, expected }) => {
        mockUseQuickSearchQuery.mockReturnValue({
          searchTerm: input,
          debouncedSearchTerm: input,
          handleSearchTermChange: jest.fn(),
          query: { data: [], isError: false, isLoading: false },
          redirectCheckQuery: { data: null, isError: false, isLoading: false },
        } as unknown as MockQuickSearchQuery);

        renderHook(() => useSearchWithClusters());

        expect(mockUseApiQuery).toHaveBeenCalledWith('clusters:get_cluster_by_name', {
          queryParams: {
            input: JSON.stringify({ name: expected }),
          },
          queryOptions: { enabled: true },
        });

        jest.clearAllMocks();
      });
    });
  });

  describe('data transformation', () => {
    it('should transform cluster API response to search result format', () => {
      mockUseQuickSearchQuery.mockReturnValue({
        searchTerm: 'test-cluster/',
        debouncedSearchTerm: 'test-cluster/',
        handleSearchTermChange: jest.fn(),
        query: { data: [], isError: false, isLoading: false },
        redirectCheckQuery: { data: null, isError: false, isLoading: false },
      } as unknown as MockQuickSearchQuery);

      const mockClusterData = {
        name: 'test-cluster',
        clusterId: 'cluster-123',
        owner: '0x1234567890123456789012345678901234567890',
        createdAt: '2024-01-01T00:00:00Z',
        expiresAt: '2025-01-01T00:00:00Z',
        backingWei: '1000000000000000000',
        isTestnet: false,
      };

      mockUseApiQuery.mockReturnValue({
        data: {
          result: {
            data: mockClusterData,
          },
        },
        isError: false,
        isLoading: false,
      } as unknown as MockApiQuery);

      const { result } = renderHook(() => useSearchWithClusters());

      expect(result.current.query.data).toEqual([
        {
          type: 'cluster',
          name: 'test-cluster',
          address_hash: '0x1234567890123456789012345678901234567890',
          is_smart_contract_verified: false,
          cluster_info: {
            cluster_id: 'cluster-123',
            name: 'test-cluster',
            owner: '0x1234567890123456789012345678901234567890',
            created_at: '2024-01-01T00:00:00Z',
            expires_at: '2025-01-01T00:00:00Z',
            total_wei_amount: '1000000000000000000',
            is_testnet: false,
          },
        },
      ]);
    });

    it('should handle cluster data without optional fields', () => {
      mockUseQuickSearchQuery.mockReturnValue({
        searchTerm: 'simple-cluster/',
        debouncedSearchTerm: 'simple-cluster/',
        handleSearchTermChange: jest.fn(),
        query: { data: [], isError: false, isLoading: false },
        redirectCheckQuery: { data: null, isError: false, isLoading: false },
      } as unknown as MockQuickSearchQuery);

      const mockClusterData = {
        name: 'simple-cluster',
        owner: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef',
      };

      mockUseApiQuery.mockReturnValue({
        data: {
          result: {
            data: mockClusterData,
          },
        },
        isError: false,
        isLoading: false,
      } as unknown as MockApiQuery);

      const { result } = renderHook(() => useSearchWithClusters());

      expect(result.current.query.data).toEqual([
        {
          type: 'cluster',
          name: 'simple-cluster',
          address_hash: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef',
          is_smart_contract_verified: false,
          cluster_info: {
            cluster_id: 'simple-cluster',
            name: 'simple-cluster',
            owner: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef',
            created_at: undefined,
            expires_at: undefined,
            total_wei_amount: undefined,
            is_testnet: undefined,
          },
        },
      ]);
    });

    it('should use clusterId as fallback when present', () => {
      mockUseQuickSearchQuery.mockReturnValue({
        searchTerm: 'test/',
        debouncedSearchTerm: 'test/',
        handleSearchTermChange: jest.fn(),
        query: { data: [], isError: false, isLoading: false },
        redirectCheckQuery: { data: null, isError: false, isLoading: false },
      } as unknown as MockQuickSearchQuery);

      const mockClusterData = {
        name: 'test',
        owner: '0x123',
      };

      mockUseApiQuery.mockReturnValue({
        data: {
          result: {
            data: mockClusterData,
          },
        },
        isError: false,
        isLoading: false,
      } as unknown as MockApiQuery);

      const { result } = renderHook(() => useSearchWithClusters());

      expect(result.current.query.data).toBeDefined();
      expect(result.current.query.data).toHaveLength(1);
      const clusterResult = result.current.query.data![0] as unknown as Record<string, unknown>;
      expect((clusterResult.cluster_info as Record<string, unknown>).cluster_id).toBe('test');
    });

    it('should return empty results when cluster API returns error', () => {
      mockUseQuickSearchQuery.mockReturnValue({
        searchTerm: 'nonexistent-cluster/',
        debouncedSearchTerm: 'nonexistent-cluster/',
        handleSearchTermChange: jest.fn(),
        query: { data: [], isError: false, isLoading: false },
        redirectCheckQuery: { data: null, isError: false, isLoading: false },
      } as unknown as MockQuickSearchQuery);

      mockUseApiQuery.mockReturnValue({
        data: null,
        isError: true,
        isLoading: false,
      } as unknown as MockApiQuery);

      const { result } = renderHook(() => useSearchWithClusters());

      expect(result.current.query.data).toEqual([]);
      expect(result.current.query.isError).toBe(false);
    });

    it('should return empty results when cluster API returns no data', () => {
      mockUseQuickSearchQuery.mockReturnValue({
        searchTerm: 'empty-cluster/',
        debouncedSearchTerm: 'empty-cluster/',
        handleSearchTermChange: jest.fn(),
        query: { data: [], isError: false, isLoading: false },
        redirectCheckQuery: { data: null, isError: false, isLoading: false },
      } as unknown as MockQuickSearchQuery);

      mockUseApiQuery.mockReturnValue({
        data: {
          result: {
            data: null,
          },
        },
        isError: false,
        isLoading: false,
      } as unknown as MockApiQuery);

      const { result } = renderHook(() => useSearchWithClusters());

      expect(result.current.query.data).toEqual([]);
    });
  });

  describe('fallback to regular search', () => {
    it('should return regular search results for non-cluster queries', () => {
      const regularSearchData = [
        { type: 'address', address_hash: '0x123', is_smart_contract_verified: true },
      ];

      mockUseQuickSearchQuery.mockReturnValue({
        searchTerm: '0x123456',
        debouncedSearchTerm: '0x123456',
        handleSearchTermChange: jest.fn(),
        query: {
          data: regularSearchData,
          isError: false,
          isLoading: false,
        },
        redirectCheckQuery: { data: null, isError: false, isLoading: false },
      } as unknown as MockQuickSearchQuery);

      const { result } = renderHook(() => useSearchWithClusters());

      expect(result.current.query.data).toEqual(regularSearchData);
    });

    it('should preserve regular search query properties', () => {
      const mockQuickSearchQuery = {
        searchTerm: 'regular search',
        debouncedSearchTerm: 'regular search',
        handleSearchTermChange: jest.fn(),
        query: {
          data: [],
          isError: false,
          isLoading: true,
          isFetching: true,
        },
        redirectCheckQuery: { data: null, isError: false, isLoading: false },
      };

      mockUseQuickSearchQuery.mockReturnValue(mockQuickSearchQuery as unknown as MockQuickSearchQuery);

      const { result } = renderHook(() => useSearchWithClusters());

      expect(result.current.query.isLoading).toBe(true);
      expect(result.current.query.isFetching).toBe(true);
      expect(result.current.searchTerm).toBe('regular search');
      expect(result.current.debouncedSearchTerm).toBe('regular search');
    });

    it('should preserve error states from regular search', () => {
      mockUseQuickSearchQuery.mockReturnValue({
        searchTerm: 'error-search',
        debouncedSearchTerm: 'error-search',
        handleSearchTermChange: jest.fn(),
        query: {
          data: [],
          isError: true,
          error: 'Network error',
          isLoading: false,
        },
        redirectCheckQuery: { data: null, isError: false, isLoading: false },
      } as unknown as MockQuickSearchQuery);

      const { result } = renderHook(() => useSearchWithClusters());

      expect(result.current.query.isError).toBe(true);
      expect(result.current.query.error).toBe('Network error');
    });
  });

  describe('integration behavior', () => {
    it('should enable cluster API query only for valid cluster searches', () => {
      mockUseQuickSearchQuery.mockReturnValue({
        searchTerm: '',
        debouncedSearchTerm: '',
        handleSearchTermChange: jest.fn(),
        query: { data: [], isError: false, isLoading: false },
        redirectCheckQuery: { data: null, isError: false, isLoading: false },
      } as unknown as MockQuickSearchQuery);

      renderHook(() => useSearchWithClusters());

      expect(mockUseApiQuery).toHaveBeenCalledWith('clusters:get_cluster_by_name', {
        queryParams: {
          input: JSON.stringify({ name: '' }),
        },
        queryOptions: { enabled: false },
      });
    });

    it('should not query cluster API when cluster name is empty', () => {
      mockUseQuickSearchQuery.mockReturnValue({
        searchTerm: '/',
        debouncedSearchTerm: '/',
        handleSearchTermChange: jest.fn(),
        query: { data: [], isError: false, isLoading: false },
        redirectCheckQuery: { data: null, isError: false, isLoading: false },
      } as unknown as MockQuickSearchQuery);

      renderHook(() => useSearchWithClusters());

      expect(mockUseApiQuery).toHaveBeenCalledWith('clusters:get_cluster_by_name', {
        queryParams: {
          input: JSON.stringify({ name: '' }),
        },
        queryOptions: { enabled: false },
      });
    });

    it('should return proper hook interface', () => {
      mockUseQuickSearchQuery.mockReturnValue({
        searchTerm: 'test',
        debouncedSearchTerm: 'test-debounced',
        handleSearchTermChange: jest.fn(),
        query: { data: [], isError: false, isLoading: false },
        redirectCheckQuery: { data: 'redirect-data', isError: false, isLoading: false },
      } as unknown as MockQuickSearchQuery);

      const { result } = renderHook(() => useSearchWithClusters());

      expect(result.current).toHaveProperty('searchTerm', 'test');
      expect(result.current).toHaveProperty('debouncedSearchTerm', 'test-debounced');
      expect(result.current).toHaveProperty('handleSearchTermChange');
      expect(result.current).toHaveProperty('query');
      expect(result.current.redirectCheckQuery).toEqual({ data: 'redirect-data', isError: false, isLoading: false });
    });

    it('should handle loading states correctly', () => {
      mockUseQuickSearchQuery.mockReturnValue({
        searchTerm: 'loading-cluster/',
        debouncedSearchTerm: 'loading-cluster/',
        handleSearchTermChange: jest.fn(),
        query: { data: [], isError: false, isLoading: false },
        redirectCheckQuery: { data: null, isError: false, isLoading: false },
      } as unknown as MockQuickSearchQuery);

      mockUseApiQuery.mockReturnValue({
        data: null,
        isError: false,
        isLoading: true,
      } as unknown as MockApiQuery);

      const { result } = renderHook(() => useSearchWithClusters());

      expect(result.current.query.isLoading).toBe(true);
    });
  });

  describe('debouncing integration', () => {
    it('should use debounced search term for cluster detection', () => {
      mockUseQuickSearchQuery.mockReturnValue({
        searchTerm: 'final-cluster/',
        debouncedSearchTerm: 'something-else',
        handleSearchTermChange: jest.fn(),
        query: { data: [], isError: false, isLoading: false },
        redirectCheckQuery: { data: null, isError: false, isLoading: false },
      } as unknown as MockQuickSearchQuery);

      renderHook(() => useSearchWithClusters());

      expect(mockUseApiQuery).toHaveBeenCalledWith('clusters:get_cluster_by_name', {
        queryParams: {
          input: JSON.stringify({ name: 'final-cluster' }),
        },
        queryOptions: { enabled: true },
      });
    });

    it('should pass through original search term for display', () => {
      mockUseQuickSearchQuery.mockReturnValue({
        searchTerm: 'original-term',
        debouncedSearchTerm: 'debounced/',
        handleSearchTermChange: jest.fn(),
        query: { data: [], isError: false, isLoading: false },
        redirectCheckQuery: { data: null, isError: false, isLoading: false },
      } as unknown as MockQuickSearchQuery);

      const { result } = renderHook(() => useSearchWithClusters());

      expect(result.current.searchTerm).toBe('original-term');
      expect(result.current.debouncedSearchTerm).toBe('debounced/');
    });
  });
});

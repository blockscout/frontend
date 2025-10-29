import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import { renderHook } from 'jest/lib';
import useApiFetch from 'lib/api/useApiFetch';

import useQuickSearchQuery from './useQuickSearchQuery';
import useSearchWithClusters from './useSearchWithClusters';

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}));

const mockUseQuery = useQuery as jest.MockedFunction<typeof useQuery>;

type MockQuickSearchQuery = ReturnType<typeof useQuickSearchQuery>;
type MockApiQuery = ReturnType<typeof useApiFetch>;

jest.mock('lib/api/useApiFetch', () => jest.fn());
const mockUseApiFetch = useApiFetch as jest.MockedFunction<typeof useApiFetch>;
jest.mock('./useQuickSearchQuery');
jest.mock('lib/hooks/useDebounce', () => (value: unknown) => value);

const mockUseQuickSearchQuery = useQuickSearchQuery as jest.MockedFunction<typeof useQuickSearchQuery>;

const defaultUseQueryResult: Partial<UseQueryResult> = {
  data: [],
  isError: false,
  isLoading: false,
  isFetching: false,
  error: null,
  isPending: false,
  isLoadingError: false,
  isRefetchError: false,
  isSuccess: true,
  isStale: false,
  status: 'success',
  fetchStatus: 'idle',
  refetch: jest.fn(),
  failureCount: 0,
  failureReason: null,
  errorUpdateCount: 0,
  isFetched: true,
  isFetchedAfterMount: true,
  isPlaceholderData: false,
  isRefetching: false,
  isInitialLoading: false,
  dataUpdatedAt: Date.now(),
  errorUpdatedAt: 0,
  isPaused: false,
};

jest.mock('configs/app', () => ({
  features: {
    nameServices: { isEnabled: true, ens: { isEnabled: true }, clusters: { isEnabled: true } },
    rollbar: { isEnabled: false },
  },
  UI: {
    homepage: {
      heroBanner: null,
      charts: [],
      stats: [],
    },
    fonts: {
      heading: null,
      body: null,
    },
    navigation: {
      logo: { 'default': null, dark: null },
      icon: { 'default': null, dark: null },
      highlightedRoutes: [],
      otherLinks: [],
      featuredNetworks: null,
      layout: 'vertical',
    },
    footer: {
      links: null,
      frontendVersion: null,
      frontendCommit: null,
    },
    views: {},
    indexingAlert: { blocks: { isHidden: false }, intTxs: { isHidden: false } },
    maintenanceAlert: { message: null },
    explorers: { items: [] },
    ides: { items: [] },
    hasContractAuditReports: false,
    colorTheme: { 'default': null },
    maxContentWidth: true,
  },
  app: {},
  chain: {},
  apis: {},
  services: {},
  meta: {},
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

    mockUseApiFetch.mockReturnValue({
      data: null,
      isError: false,
      isLoading: false,
    } as unknown as MockApiQuery);

    mockUseQuery.mockReturnValue({
      ...defaultUseQueryResult,
    } as UseQueryResult);
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

      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: [ 'clusters:get_cluster_by_name', { input: 'test-cluster' } ],
        queryFn: expect.any(Function),
        enabled: true,
        select: expect.any(Function),
      });
    });

    it('should detect cluster search with slash in middle (no trailing slash)', () => {
      mockUseQuickSearchQuery.mockReturnValue({
        searchTerm: 'campnetwork/lol',
        debouncedSearchTerm: 'campnetwork/lol',
        handleSearchTermChange: jest.fn(),
        query: { data: [], isError: false, isLoading: false },
        redirectCheckQuery: { data: null, isError: false, isLoading: false },
      } as unknown as MockQuickSearchQuery);

      renderHook(() => useSearchWithClusters());

      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: [ 'clusters:get_cluster_by_name', { input: 'campnetwork/lol' } ],
        queryFn: expect.any(Function),
        enabled: true,
        select: expect.any(Function),
      });
    });

    it('should not detect cluster search without any slash', () => {
      mockUseQuickSearchQuery.mockReturnValue({
        searchTerm: 'test-cluster',
        debouncedSearchTerm: 'test-cluster',
        handleSearchTermChange: jest.fn(),
        query: { data: [], isError: false, isLoading: false },
        redirectCheckQuery: { data: null, isError: false, isLoading: false },
      } as unknown as MockQuickSearchQuery);

      renderHook(() => useSearchWithClusters());

      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: [ 'clusters:get_cluster_by_name', { input: '' } ],
        queryFn: expect.any(Function),
        enabled: false,
        select: expect.any(Function),
      });
    });

    it('should handle cluster search with whitespace and trailing slash', () => {
      mockUseQuickSearchQuery.mockReturnValue({
        searchTerm: '  my-cluster/  ',
        debouncedSearchTerm: '  my-cluster/  ',
        handleSearchTermChange: jest.fn(),
        query: { data: [], isError: false, isLoading: false },
        redirectCheckQuery: { data: null, isError: false, isLoading: false },
      } as unknown as MockQuickSearchQuery);

      renderHook(() => useSearchWithClusters());

      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: [ 'clusters:get_cluster_by_name', { input: 'my-cluster' } ],
        queryFn: expect.any(Function),
        enabled: true,
        select: expect.any(Function),
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

      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: [ 'clusters:get_cluster_by_name', { input: 'test-cluster-123' } ],
        queryFn: expect.any(Function),
        enabled: true,
        select: expect.any(Function),
      });
    });

    it('should extract cluster name correctly from various formats', () => {
      const testCases = [
        { input: 'simple/', expected: 'simple' },
        { input: 'cluster-name/', expected: 'cluster-name' },
        { input: 'my_cluster_123/', expected: 'my_cluster_123' },
        { input: 'ClusterWithCaps/', expected: 'ClusterWithCaps' },
        { input: 'campnetwork/lol', expected: 'campnetwork/lol' },
        { input: 'path/to/cluster/', expected: 'path/to/cluster' },
        { input: '  spaced/cluster/  ', expected: 'spaced/cluster' },
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

        expect(mockUseQuery).toHaveBeenCalledWith({
          queryKey: [ 'clusters:get_cluster_by_name', { input: expected } ],
          queryFn: expect.any(Function),
          enabled: true,
          select: expect.any(Function),
        });

        jest.clearAllMocks();
      });
    });

    it('should detect cluster search with multiple slashes', () => {
      mockUseQuickSearchQuery.mockReturnValue({
        searchTerm: 'org/team/project',
        debouncedSearchTerm: 'org/team/project',
        handleSearchTermChange: jest.fn(),
        query: { data: [], isError: false, isLoading: false },
        redirectCheckQuery: { data: null, isError: false, isLoading: false },
      } as unknown as MockQuickSearchQuery);

      renderHook(() => useSearchWithClusters());

      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: [ 'clusters:get_cluster_by_name', { input: 'org/team/project' } ],
        queryFn: expect.any(Function),
        enabled: true,
        select: expect.any(Function),
      });
    });

    it('should handle the reported issue: campnetwork/lol with and without trailing slash', () => {
      mockUseQuickSearchQuery.mockReturnValue({
        searchTerm: 'campnetwork/lol/',
        debouncedSearchTerm: 'campnetwork/lol/',
        handleSearchTermChange: jest.fn(),
        query: { data: [], isError: false, isLoading: false },
        redirectCheckQuery: { data: null, isError: false, isLoading: false },
      } as unknown as MockQuickSearchQuery);

      renderHook(() => useSearchWithClusters());

      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: [ 'clusters:get_cluster_by_name', { input: 'campnetwork/lol' } ],
        queryFn: expect.any(Function),
        enabled: true,
        select: expect.any(Function),
      });

      jest.clearAllMocks();

      mockUseQuickSearchQuery.mockReturnValue({
        searchTerm: 'campnetwork/lol',
        debouncedSearchTerm: 'campnetwork/lol',
        handleSearchTermChange: jest.fn(),
        query: { data: [], isError: false, isLoading: false },
        redirectCheckQuery: { data: null, isError: false, isLoading: false },
      } as unknown as MockQuickSearchQuery);

      renderHook(() => useSearchWithClusters());

      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: [ 'clusters:get_cluster_by_name', { input: 'campnetwork/lol' } ],
        queryFn: expect.any(Function),
        enabled: true,
        select: expect.any(Function),
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

      const transformedData = [
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
      ];

      mockUseQuery.mockReturnValue({
        ...defaultUseQueryResult,
        data: transformedData,
      } as UseQueryResult);

      const { result } = renderHook(() => useSearchWithClusters());

      expect(result.current.query.data).toEqual(transformedData);
    });

    it('should handle cluster data without optional fields', () => {
      mockUseQuickSearchQuery.mockReturnValue({
        searchTerm: 'simple-cluster/',
        debouncedSearchTerm: 'simple-cluster/',
        handleSearchTermChange: jest.fn(),
        query: { data: [], isError: false, isLoading: false },
        redirectCheckQuery: { data: null, isError: false, isLoading: false },
      } as unknown as MockQuickSearchQuery);

      const transformedData = [
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
      ];

      mockUseQuery.mockReturnValue({
        ...defaultUseQueryResult,
        data: transformedData,
      } as UseQueryResult);

      const { result } = renderHook(() => useSearchWithClusters());

      expect(result.current.query.data).toEqual(transformedData);
    });

    it('should use clusterId as fallback when present', () => {
      mockUseQuickSearchQuery.mockReturnValue({
        searchTerm: 'test/',
        debouncedSearchTerm: 'test/',
        handleSearchTermChange: jest.fn(),
        query: { data: [], isError: false, isLoading: false },
        redirectCheckQuery: { data: null, isError: false, isLoading: false },
      } as unknown as MockQuickSearchQuery);

      const transformedData = [
        {
          type: 'cluster',
          name: 'test',
          address_hash: '0x123',
          is_smart_contract_verified: false,
          cluster_info: {
            cluster_id: 'test',
            name: 'test',
            owner: '0x123',
            created_at: undefined,
            expires_at: undefined,
            total_wei_amount: undefined,
            is_testnet: undefined,
          },
        },
      ];

      mockUseQuery.mockReturnValue({
        ...defaultUseQueryResult,
        data: transformedData,
      } as UseQueryResult);

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

      mockUseQuery.mockReturnValue({
        ...defaultUseQueryResult,
        data: [],
        isError: true,
        error: new Error('API Error'),
        isSuccess: false,
        status: 'error',
        failureCount: 1,
      } as unknown as UseQueryResult);

      const { result } = renderHook(() => useSearchWithClusters());

      expect(result.current.query.data).toEqual([]);
      expect(result.current.query.isError).toBe(true);
    });

    it('should return empty results when cluster API returns no data', () => {
      mockUseQuickSearchQuery.mockReturnValue({
        searchTerm: 'empty-cluster/',
        debouncedSearchTerm: 'empty-cluster/',
        handleSearchTermChange: jest.fn(),
        query: { data: [], isError: false, isLoading: false },
        redirectCheckQuery: { data: null, isError: false, isLoading: false },
      } as unknown as MockQuickSearchQuery);

      mockUseQuery.mockReturnValue({
        ...defaultUseQueryResult,
        data: [],
      } as UseQueryResult);

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

      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: [ 'clusters:get_cluster_by_name', { input: '' } ],
        queryFn: expect.any(Function),
        enabled: false,
        select: expect.any(Function),
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

      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: [ 'clusters:get_cluster_by_name', { input: '' } ],
        queryFn: expect.any(Function),
        enabled: false,
        select: expect.any(Function),
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

      mockUseQuery.mockReturnValue({
        ...defaultUseQueryResult,
        isLoading: true,
      } as unknown as UseQueryResult);

      const { result } = renderHook(() => useSearchWithClusters());

      expect(result.current.query.isLoading).toBe(true);
    });
  });

  describe('debouncing integration', () => {
    it('should use debounced search term for cluster detection', () => {
      mockUseQuickSearchQuery.mockReturnValue({
        searchTerm: 'original-term/',
        debouncedSearchTerm: 'final-cluster/',
        handleSearchTermChange: jest.fn(),
        query: { data: [], isError: false, isLoading: false },
        redirectCheckQuery: { data: null, isError: false, isLoading: false },
      } as unknown as MockQuickSearchQuery);

      renderHook(() => useSearchWithClusters());

      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: [ 'clusters:get_cluster_by_name', { input: 'final-cluster' } ],
        queryFn: expect.any(Function),
        enabled: true,
        select: expect.any(Function),
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

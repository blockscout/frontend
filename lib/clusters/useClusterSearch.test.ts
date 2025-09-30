import { useRouter } from 'next/router';

import { renderHook } from 'jest/lib';

import { useClusterSearch } from './useClusterSearch';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('useClusterSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return search term from router query', () => {
    mockUseRouter.mockReturnValue({
      query: { q: 'test-search' },
    } as unknown as ReturnType<typeof useRouter>);

    const { result } = renderHook(() => useClusterSearch());

    expect(result.current.searchTerm).toBe('test-search');
  });

  it('should debounce search term', () => {
    mockUseRouter.mockReturnValue({
      query: { q: 'test' },
    } as unknown as ReturnType<typeof useRouter>);

    const { result } = renderHook(() => useClusterSearch());

    expect(result.current.debouncedSearchTerm).toBe('test');
  });

  it('should handle empty query', () => {
    mockUseRouter.mockReturnValue({
      query: {},
    } as unknown as ReturnType<typeof useRouter>);

    const { result } = renderHook(() => useClusterSearch());

    expect(result.current.searchTerm).toBe('');
    expect(result.current.debouncedSearchTerm).toBe('');
  });
});

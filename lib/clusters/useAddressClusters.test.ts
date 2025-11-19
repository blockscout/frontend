import { useAddressClusters } from './useAddressClusters';

jest.mock('lib/api/useApiQuery', () => ({
  __esModule: true,
  'default': jest.fn(),
}));

jest.mock('configs/app', () => ({
  features: {
    nameServices: {
      isEnabled: true,
      ens: { isEnabled: true },
      clusters: { isEnabled: true },
    },
  },
}));

const mockUseApiQuery = require('lib/api/useApiQuery').default;

describe('useAddressClusters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseApiQuery.mockReturnValue({ data: null, isLoading: false });
  });

  it('should call API with correct parameters', () => {
    const addressHash = '0x1234567890123456789012345678901234567890';

    useAddressClusters(addressHash);

    expect(mockUseApiQuery).toHaveBeenCalledWith('clusters:get_clusters_by_address', {
      queryParams: {
        input: JSON.stringify({
          address: addressHash,
        }),
      },
      queryOptions: {
        enabled: true,
      },
    });
  });

  it('should be disabled when addressHash is empty', () => {
    useAddressClusters('');

    expect(mockUseApiQuery).toHaveBeenCalledWith('clusters:get_clusters_by_address', {
      queryParams: {
        input: JSON.stringify({
          address: '',
        }),
      },
      queryOptions: {
        enabled: false,
      },
    });
  });

  it('should handle isEnabled parameter', () => {
    const addressHash = '0x1234567890123456789012345678901234567890';

    useAddressClusters(addressHash, false);

    expect(mockUseApiQuery).toHaveBeenCalledWith('clusters:get_clusters_by_address', {
      queryParams: {
        input: JSON.stringify({
          address: addressHash,
        }),
      },
      queryOptions: {
        enabled: false,
      },
    });
  });
});

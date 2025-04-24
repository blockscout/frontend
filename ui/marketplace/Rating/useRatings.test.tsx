import { act } from 'react';

import { renderHook, wrapper } from 'jest/lib';

import useRatings from './useRatings';

const useAccount = jest.fn();
const useApiQuery = jest.fn();

jest.mock('toolkit/chakra/toaster', () => ({
  toaster: {
    error: jest.fn(),
  },
}));
jest.mock('wagmi', () => ({ useAccount: () => useAccount() }));
jest.mock('lib/api/useApiQuery', () => () => useApiQuery());

beforeEach(() => {
  jest.clearAllMocks();
});

it('should set canRate to true if address is defined and transactions_count is 5 or more', async() => {
  useAccount.mockReturnValue({ address: '0x123' });
  useApiQuery.mockReturnValue({
    isPlaceholderData: false,
    data: { transactions_count: 5 },
  });

  const { result } = renderHook(() => useRatings(), { wrapper });
  await act(async() => {
    await Promise.resolve();
  });

  expect(result.current.canRate).toBe(true);
});

it('should set canRate to undefined if address is undefined', async() => {
  useAccount.mockReturnValue({ address: undefined });
  useApiQuery.mockReturnValue({
    isPlaceholderData: false,
    data: { transactions_count: 5 },
  });

  const { result } = renderHook(() => useRatings(), { wrapper });
  await act(async() => {
    await Promise.resolve();
  });

  expect(result.current.canRate).toBe(undefined);
});

it('should set canRate to false if transactions_count is less than 5', async() => {
  useAccount.mockReturnValue({ address: '0x123' });
  useApiQuery.mockReturnValue({
    isPlaceholderData: false,
    data: { transactions_count: 4 },
  });

  const { result } = renderHook(() => useRatings(), { wrapper });
  await act(async() => {
    await Promise.resolve();
  });

  expect(result.current.canRate).toBe(false);
});

it('should set canRate to false if isPlaceholderData is true', async() => {
  useAccount.mockReturnValue({ address: '0x123' });
  useApiQuery.mockReturnValue({
    isPlaceholderData: true,
    data: { transactions_count: 5 },
  });

  const { result } = renderHook(() => useRatings(), { wrapper });
  await act(async() => {
    await Promise.resolve();
  });

  expect(result.current.canRate).toBe(false);
});

it('should set canRate to false if data is undefined', async() => {
  useAccount.mockReturnValue({ address: '0x123' });
  useApiQuery.mockReturnValue({
    isPlaceholderData: false,
    data: undefined,
  });

  const { result } = renderHook(() => useRatings(), { wrapper });
  await act(async() => {
    await Promise.resolve();
  });

  expect(result.current.canRate).toBe(false);
});

it('should set canRate to false if transactions_count is undefined', async() => {
  useAccount.mockReturnValue({ address: '0x123' });
  useApiQuery.mockReturnValue({
    isPlaceholderData: false,
    data: {},
  });

  const { result } = renderHook(() => useRatings(), { wrapper });
  await act(async() => {
    await Promise.resolve();
  });

  expect(result.current.canRate).toBe(false);
});

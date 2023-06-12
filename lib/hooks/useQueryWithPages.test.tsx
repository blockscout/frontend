import fetch from 'jest-fetch-mock';
import { mockRouter } from 'jest/mocks/next-router';
import { renderHook, wrapper } from 'jest/utils';

import type { Params } from './useQueryWithPages';
import useQueryWithPages from './useQueryWithPages';

jest.mock('next/router', () => mockRouter({ query: { page: '1' } }));

test('simple test', async() => {
  const params: Params<'blocks'> = {
    resourceName: 'blocks',
  };
  fetch.mockResponse(JSON.stringify({ data: '12345' }));

  const { result } = renderHook(() => useQueryWithPages(params), { wrapper });
  await new Promise(process.nextTick);
  expect(result.current.data).toEqual('Bob');
});

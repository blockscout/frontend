import fetch from 'jest-fetch-mock';
import { renderHook, wrapper, act } from 'jest/lib';
import flushPromises from 'jest/utils/flushPromises';
import useApiQuery from 'lib/api/useApiQuery';
import * as transactionMock from 'mocks/noves/transaction';

import { getTokensData } from './getTokensData';

it('creates a tokens data object', async() => {
  const params = {
    pathParams: {
      hash: transactionMock.hash,
    },
  };

  fetch.mockResponse(JSON.stringify(transactionMock.transaction));

  const { result } = renderHook(() => useApiQuery('noves_transaction', params), { wrapper });
  await waitForApiResponse();

  expect(result.current.data).toEqual(transactionMock.transaction);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const tokensResult = getTokensData(result.current.data!);

  expect(tokensResult).toEqual(transactionMock.tokenData);
});

async function waitForApiResponse() {
  await flushPromises();
  await act(flushPromises);
}

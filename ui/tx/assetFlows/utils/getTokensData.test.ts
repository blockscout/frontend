import * as transactionMock from 'mocks/noves/transaction';

import { getTokensData } from './getTokensData';

it('creates a tokens data object', async() => {
  const result = getTokensData(transactionMock.transaction);

  expect(result).toEqual(transactionMock.tokenData);
});

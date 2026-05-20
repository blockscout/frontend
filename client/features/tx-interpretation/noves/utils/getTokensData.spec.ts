import * as transactionMock from 'client/features/tx-interpretation/noves/mocks';

import { it, expect } from 'vitest';

import { getTokensData } from './getTokensData';

it('creates a tokens data object', async() => {
  const result = getTokensData(transactionMock.transaction);

  expect(result).toEqual(transactionMock.tokenData);
});

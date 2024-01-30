import * as transactionMock from 'mocks/noves/transaction';

import { getDescriptionItems } from './getDescriptionItems';

it('creates sub heading items to render', async() => {
  const result = getDescriptionItems(transactionMock.transaction);

  expect(result).toEqual([
    {
      text: ' Called function \'stake\' on contract 0xef326CdAdA59D3A740A76bB5f4F88Fb2',
      token: undefined,
      hasId: false,
    },
  ]);
});

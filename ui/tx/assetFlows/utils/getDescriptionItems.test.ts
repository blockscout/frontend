import * as transactionMock from 'mocks/noves/transaction';

import { getDescriptionItems } from './getDescriptionItems';

it('creates sub heading items to render', async() => {
  const result = getDescriptionItems(transactionMock.transaction);

  expect(result).toEqual([
    {
      token: undefined,
      text: ' ',
      hasId: false,
      type: 'action',
      actionText: 'Called function',
      address: undefined,
    },
    {
      token: undefined,
      text: '\'stake\' ',
      hasId: false,
      type: 'action',
      actionText: 'on contract',
      address: undefined,
    },
    {
      token: undefined,
      text: '',
      hasId: false,
      type: 'contract',
      actionText: undefined,
      address: '0xef326cdada59d3a740a76bb5f4f88fb2f1076164',
    },
  ]);
});

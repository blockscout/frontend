import { it, expect } from 'vitest';

import { apps as dappMocks } from '../mocks/dapps';
import generateDappInfoSchema from './dapp-info';

it('without rating', () => {
  const schema = generateDappInfoSchema({
    id: 'token-approval-tracker',
    apiData: dappMocks[1],
  });
  expect(schema).toMatchSnapshot();
});

it('with rating', () => {
  const schema = generateDappInfoSchema({
    id: 'hop-exchange',
    apiData: dappMocks[0],
  });
  expect(schema).toMatchSnapshot();
});

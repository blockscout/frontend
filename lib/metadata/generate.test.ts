import type { ApiData } from './types';

import type { Route } from 'nextjs-routes';

import generate from './generate';

interface TestCase<Pathname extends Route['pathname']> {
  title: string;
  route: {
    pathname: Pathname;
    query?: Route['query'];
  };
  apiData?: ApiData<Pathname>;
}

const TEST_CASES = [
  {
    title: 'static route',
    route: {
      pathname: '/txs',
    },
  } as TestCase<'/txs'>,
  {
    title: 'dynamic route',
    route: {
      pathname: '/tx/[hash]',
      query: { hash: '0x12345' },
    },
  } as TestCase<'/tx/[hash]'>,
  {
    title: 'dynamic route with API data',
    route: {
      pathname: '/token/[hash]',
      query: { hash: '0x12345' },
    },
    apiData: { symbol_or_name: 'USDT' },
  } as TestCase<'/token/[hash]'>,
];

describe('generates correct metadata for:', () => {
  TEST_CASES.forEach((testCase) => {
    it(`${ testCase.title }`, () => {
      const result = generate(testCase.route, testCase.apiData);
      expect(result).toMatchSnapshot();
    });
  });
});

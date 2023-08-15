import type { ApiData } from './types';

import type { Route } from 'nextjs-routes';

import generate from './generate';

interface TestCase<R extends Route> {
  title: string;
  route: R;
  apiData?: ApiData<R>;
}

const TEST_CASES: Array<TestCase<Route>> = [
  {
    title: 'static route',
    route: {
      pathname: '/blocks',
    },
  },
  {
    title: 'dynamic route',
    route: {
      pathname: '/tx/[hash]',
      query: { hash: '0x12345' },
    },
  },
  {
    title: 'dynamic route with API data',
    route: {
      pathname: '/token/[hash]',
      query: { hash: '0x12345' },
    },
    apiData: { symbol: 'USDT' },
  } as TestCase<{ pathname: '/token/[hash]'; query: { hash: string }}>,
];

describe('generates correct metadata for:', () => {
  TEST_CASES.forEach((testCase) => {
    it(`${ testCase.title }`, () => {
      const result = generate(testCase.route, testCase.apiData);
      expect(result).toMatchSnapshot();
    });
  });
});

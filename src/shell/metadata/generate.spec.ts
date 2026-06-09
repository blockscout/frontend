import { hash as addressHash } from 'src/slices/address/mocks/address';
import { base as transaction } from 'src/slices/tx/mocks/tx';

import { it, describe, expect } from 'vitest';

import generate from './generate';

it('static route', () => {
  const result = generate({ pathname: '/txs' });
  expect(result).toMatchSnapshot();
});

it('dynamic route', () => {
  const result = generate({ pathname: '/tx/[hash]', query: { hash: transaction.hash } });
  expect(result).toMatchSnapshot();
});

describe('address route', () => {
  it('enhanced data', () => {
    const result = generate({ pathname: '/address/[hash]', query: { hash: addressHash } }, { domain_name: 'duck.eth' });
    expect(result).toMatchSnapshot();
  });

  it('no enhanced data', () => {
    const result = generate({ pathname: '/address/[hash]', query: { hash: addressHash } });
    expect(result).toMatchSnapshot();
  });
});

describe('stats details route', () => {
  it('enhanced data', () => {
    const result = generate(
      { pathname: '/stats/[id]', query: { id: 'accountsGrowth' } },
      { id: 'accountsGrowth', title: 'Number of accounts', description: 'Cumulative account growth over time', resolutions: [] },
    );
    expect(result).toMatchSnapshot();
  });

  it('no enhanced data', () => {
    const result = generate({ pathname: '/stats/[id]', query: { id: 'accountsGrowth' } });
    expect(result).toMatchSnapshot();
  });
});

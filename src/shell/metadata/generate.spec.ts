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
    const result = generate({ pathname: '/address/[hash]', query: { domain_name: 'duck.eth', hash: addressHash } });
    expect(result).toMatchSnapshot();
  });

  it('no enhanced data', () => {
    const result = generate({ pathname: '/address/[hash]', query: { hash: addressHash } });
    expect(result).toMatchSnapshot();
  });
});

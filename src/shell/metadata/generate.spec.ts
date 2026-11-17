import { hash as addressHash } from 'src/slices/address/mocks/address-param';
import { base as transaction } from 'src/slices/tx/mocks/details';

import { it, describe, expect } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

import generate from './generate';

it('static route', () => {
  const result = generate({ pathname: '/txs' });
  expect(result).toMatchSnapshot();
});

it('dynamic route', () => {
  const result = generate({ pathname: '/tx/[hash]', query: { hash: transaction.hash } });
  expect(result).toMatchSnapshot();
});

it('transaction route with enhanced og data', () => {
  const result = generate({ pathname: '/tx/[hash]', query: { hash: transaction.hash } }, {
    tx_status: 'Success',
    tx_action: 'Transfer 100 DUCK to 0xd7...5859',
    tx_timestamp: 'Oct 10, 2022 14:34 UTC',
  });

  expect(result.opengraph.title).toBe('Blockscout transaction 0x62...3193 | Blockscout');
  expect(result.opengraph.description).toBe('Success · Transfer 100 DUCK to 0xd7...5859 · Oct 10, 2022 14:34 UTC');

  // the SEO tags keep the full hash and the generic copy
  expect(result.title).toBe(`Blockscout transaction ${ transaction.hash } | Blockscout`);
  expect(result.description).toBe(
    'Blockscout detailed transaction info. View transaction status, block confirmation, gas fee, native coin and token transfers.',
  );
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

describe('og template layer', () => {
  it('falls back to the page title and description when the route declares no og templates', () => {
    const result = generate({ pathname: '/txs/kettle/[hash]', query: { hash: transaction.hash } });

    expect(result.opengraph).toEqual({ title: result.title, description: result.description, imageUrl: undefined });
  });

  it('takes the og description and image the route declares, and falls back to the page title', async() => {
    const result = await withEnvs([ [ 'NEXT_PUBLIC_OG_DESCRIPTION', 'The duck chain explorer.' ] ], async() => {
      const { 'default': generateWithEnvs } = await import('./generate');
      return generateWithEnvs({ pathname: '/txs' });
    });

    expect(result.opengraph).toEqual({
      title: 'Blockscout transactions - Blockscout explorer | Blockscout',
      description: 'The duck chain explorer.',
      imageUrl: 'http://localhost:3000/static/og_image.png',
    });
    expect(result.description).toBe('Browse Blockscout transactions. Track transaction status, fees, and details in real time.');
  });

  it('picks the enhanced og description only when all its params are present', () => {
    const complete = generate({ pathname: '/tx/[hash]', query: { hash: transaction.hash } }, {
      tx_status: 'Success',
      tx_action: 'Swap',
      tx_timestamp: 'Jul 28, 2026 10:00 UTC',
    });
    expect(complete.opengraph.description).toBe('Success · Swap · Jul 28, 2026 10:00 UTC');

    const partial = generate({ pathname: '/tx/[hash]', query: { hash: transaction.hash } }, {
      tx_status: 'Success',
      tx_action: '',
      tx_timestamp: 'Jul 28, 2026 10:00 UTC',
    });
    expect(partial.opengraph.description).toBe(
      'Blockscout detailed transaction info. View transaction status, block confirmation, gas fee, native coin and token transfers.',
    );
  });
});

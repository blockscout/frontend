import { hash as addressHash } from 'src/slices/address/mocks/address-param';
import { base as transaction } from 'src/slices/tx/mocks/details';

import { it, describe, expect, vi, afterEach } from 'vitest';

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
  // No route declares OG templates yet, so the layer is exercised against a stand-in template map.
  const TEMPLATE_MAP_MOCK = {
    '/txs': {
      metadata: {
        title: { 'default': '%chain_name% transactions' },
        description: { 'default': 'Browse %chain_name% transactions.' },
      },
      og: { image: 'https://example.com/og_image.png' },
    },
    '/tx/[hash]': {
      metadata: {
        title: { 'default': '%chain_name% transaction %hash%' },
        description: { 'default': 'Detailed transaction info.' },
      },
      og: {
        title: { 'default': '%chain_name% transaction %hash_short%' },
        description: { 'default': 'Success · Swap · Jul 28, 2026 10:00 UTC' },
      },
    },
    '/address/[hash]': {
      metadata: {
        title: { 'default': '%chain_name% address %hash%' },
        description: { 'default': 'Address details.' },
      },
      og: {
        description: {
          'default': 'Address details on %chain_name%.',
          enhanced: '%domain_name% on %chain_name%.',
        },
      },
    },
  };

  async function importGenerateWithMockedTemplates() {
    vi.resetModules();
    vi.doMock('./templates', () => ({ TEMPLATE_MAP: TEMPLATE_MAP_MOCK }));
    return (await import('./generate')).default;
  }

  afterEach(() => {
    vi.doUnmock('./templates');
    vi.resetModules();
  });

  it('falls back to the page title and description when the route declares no og templates', async() => {
    const generateMocked = await importGenerateWithMockedTemplates();
    const result = generateMocked({ pathname: '/txs' });

    expect(result.opengraph.title).toBe(result.title);
    expect(result.opengraph.description).toBe(result.description);
    expect(result.opengraph.imageUrl).toBe('https://example.com/og_image.png');
  });

  it('compiles the og title with the title postfix and the og description independently', async() => {
    const generateMocked = await importGenerateWithMockedTemplates();
    const result = generateMocked({ pathname: '/tx/[hash]', query: { hash: transaction.hash } });

    expect(result.opengraph.title).toBe('Blockscout transaction 0x62...3193 | Blockscout');
    expect(result.opengraph.description).toBe('Success · Swap · Jul 28, 2026 10:00 UTC');
    expect(result.opengraph.imageUrl).toBeUndefined();
    expect(result.title).toBe(`Blockscout transaction ${ transaction.hash } | Blockscout`);
    expect(result.description).toBe('Detailed transaction info.');
  });

  it('picks the enhanced og description only when all its params are present', async() => {
    const generateMocked = await importGenerateWithMockedTemplates();

    const withData = generateMocked({ pathname: '/address/[hash]', query: { hash: addressHash } }, { domain_name: 'duck.eth' });
    expect(withData.opengraph.description).toBe('duck.eth on Blockscout.');

    const withoutData = generateMocked({ pathname: '/address/[hash]', query: { hash: addressHash } });
    expect(withoutData.opengraph.description).toBe('Address details on Blockscout.');
  });
});

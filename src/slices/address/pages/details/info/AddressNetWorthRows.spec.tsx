// SPDX-License-Identifier: LicenseRef-Blockscout
// @vitest-environment jsdom

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import * as addressMock from 'src/slices/address/mocks/address';

import * as cookies from 'src/shared/storage/cookies';

import { SECOND } from 'src/toolkit/utils/consts';

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, screen, waitFor } from 'vitest/lib';
import withEnvs from 'vitest/utils/mockEnvs';

type Env = [ string, string ];
type AddressData = schemas['AddressResponse'];

const AGGREGATOR_HOST = 'https://aggregator.example.com';
const MULTICHAIN_PORTFOLIO_ENVS: Array<Env> = [
  [ 'NEXT_PUBLIC_MULTICHAIN_AGGREGATOR_API_HOST', AGGREGATOR_HOST ],
  [ 'NEXT_PUBLIC_MULTICHAIN_CLUSTER', 'test' ],
];
const PROVIDERS_ENV: Env = [
  'NEXT_PUBLIC_MULTICHAIN_BALANCE_PROVIDER_CONFIG',
  `[{'name':'duck','url_template':'https://duck.url/{address}','logo':'https://duck.url/logo.png'}]`,
];
const PROVIDER_LINK = { name: /Duck/ };

const JSON_HEADERS = { 'Content-Type': 'application/json' };
const PORTFOLIO_OK = {
  status: 200,
  headers: JSON_HEADERS,
  body: JSON.stringify({ portfolio: { total_value: '6170.69', chain_values: { '1': '6170.69' } } }),
};
const PORTFOLIO_WITHOUT_TOTAL = { status: 200, headers: JSON_HEADERS, body: JSON.stringify({ portfolio: null }) };
const PORTFOLIO_FAILED = { status: 500, headers: JSON_HEADERS, body: '{}' };
const TOTAL_TEXT = '$6,170.69';

const EOA_WITHOUT_TOKENS: AddressData = { ...addressMock.eoa, has_tokens: false };
const EIP7702_ADDRESS: AddressData = { ...addressMock.contract, proxy_type: 'eip7702' };
const CONTRACT_WITHOUT_RATE: AddressData = { ...addressMock.token, exchange_rate: null };

// every test re-imports the rows (withEnvs resets modules), which is slow on a CI runner
const TEST_TIMEOUT = 20 * SECOND;

function requestedUrls(): Array<URL> {
  return fetchMock.mock.calls.map(([ input ]) => new URL(input instanceof Request ? input.url : String(input)));
}

function aggregatorRequests(): Array<URL> {
  return requestedUrls().filter((url) => url.origin === AGGREGATOR_HOST);
}

function mockAggregator(portfolioResponse: typeof PORTFOLIO_OK): void {
  fetchMock.mockResponse((request) => new URL(request.url).origin === AGGREGATOR_HOST ? portfolioResponse : { status: 404, body: '{}' });
}

async function renderRows(addressData: AddressData): Promise<void> {
  const { render } = await import('vitest/lib');
  const { 'default': AddressNetWorthRows } = await import('./AddressNetWorthRows');
  render(<AddressNetWorthRows data={ addressData } addressData={ addressData } addressHash={ addressData.hash } isLoading={ false }/>);
}

afterEach(() => {
  cleanup();
  cookies.remove(cookies.NAMES.SHOW_POOR_REPUTATION_TOKENS);
});

describe('net worth rows with the multichain portfolio', () => {
  it('shows the aggregator total with the providers below a provider-free "Net worth" row', { timeout: TEST_TIMEOUT }, async() => {
    await withEnvs([ ...MULTICHAIN_PORTFOLIO_ENVS, PROVIDERS_ENV ], async() => {
      mockAggregator(PORTFOLIO_OK);
      await renderRows(addressMock.eoa);

      expect(await screen.findByText(TOTAL_TEXT)).toBeTruthy();
      const netWorthLabel = screen.getByText('Net worth');
      const multichainLabel = screen.getByText('Multichain net worth');
      expect(netWorthLabel.compareDocumentPosition(multichainLabel) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      expect(screen.getAllByRole('link', PROVIDER_LINK)).toHaveLength(1);
      expect(screen.queryByText('Multichain')).toBeNull();
    });
  });

  it('asks for the portfolio without poor-reputation tokens by default', { timeout: TEST_TIMEOUT }, async() => {
    await withEnvs(MULTICHAIN_PORTFOLIO_ENVS, async() => {
      mockAggregator(PORTFOLIO_OK);
      await renderRows(addressMock.eoa);

      await screen.findByText(TOTAL_TEXT);
      const [ request ] = aggregatorRequests();
      expect(request.pathname).toContain(`/addresses/${ addressMock.eoa.hash }/portfolio`);
      expect(request.searchParams.get('include_poor_reputation_tokens')).toBe('false');
    });
  });

  it('asks for the portfolio with poor-reputation tokens when the user has turned them on', { timeout: TEST_TIMEOUT }, async() => {
    await withEnvs(MULTICHAIN_PORTFOLIO_ENVS, async() => {
      cookies.set(cookies.NAMES.SHOW_POOR_REPUTATION_TOKENS, 'true');
      mockAggregator(PORTFOLIO_OK);
      await renderRows(addressMock.eoa);

      await screen.findByText(TOTAL_TEXT);
      expect(aggregatorRequests()[0].searchParams.get('include_poor_reputation_tokens')).toBe('true');
    });
  });

  it('shows the total for a contract, without the providers', { timeout: TEST_TIMEOUT }, async() => {
    await withEnvs([ ...MULTICHAIN_PORTFOLIO_ENVS, PROVIDERS_ENV ], async() => {
      mockAggregator(PORTFOLIO_OK);
      await renderRows(addressMock.token);

      expect(await screen.findByText(TOTAL_TEXT)).toBeTruthy();
      expect(screen.queryByRole('link', PROVIDER_LINK)).toBeNull();
    });
  });

  it('shows the providers for an EIP-7702 address', { timeout: TEST_TIMEOUT }, async() => {
    await withEnvs([ ...MULTICHAIN_PORTFOLIO_ENVS, PROVIDERS_ENV ], async() => {
      mockAggregator(PORTFOLIO_OK);
      await renderRows(EIP7702_ADDRESS);

      expect(await screen.findByText(TOTAL_TEXT)).toBeTruthy();
      expect(screen.getAllByRole('link', PROVIDER_LINK)).toHaveLength(1);
    });
  });

  it.each([
    [ 'the aggregator request fails', PORTFOLIO_FAILED ],
    [ 'the aggregator returns no total', PORTFOLIO_WITHOUT_TOTAL ],
  ])('keeps the row with "N/A" and the providers when %s', { timeout: TEST_TIMEOUT }, async(_, portfolioResponse) => {
    await withEnvs([ ...MULTICHAIN_PORTFOLIO_ENVS, PROVIDERS_ENV ], async() => {
      mockAggregator(portfolioResponse);
      await renderRows(EOA_WITHOUT_TOKENS);

      expect(screen.getByText('Multichain net worth')).toBeTruthy();
      await waitFor(() => expect(aggregatorRequests()).toHaveLength(1));
      expect(await screen.findByText('N/A')).toBeTruthy();
      expect(screen.getAllByRole('link', PROVIDER_LINK)).toHaveLength(1);
    });
  });

  it.each([
    [ 'the address has no tokens', EOA_WITHOUT_TOKENS ],
    [ 'the chain has no exchange rate', CONTRACT_WITHOUT_RATE ],
  ])('hides the "Net worth" row when %s, providers configured or not', { timeout: TEST_TIMEOUT }, async(_, addressData) => {
    await withEnvs([ ...MULTICHAIN_PORTFOLIO_ENVS, PROVIDERS_ENV ], async() => {
      mockAggregator(PORTFOLIO_OK);
      await renderRows(addressData);

      expect(await screen.findByText(TOTAL_TEXT)).toBeTruthy();
      expect(screen.queryByText('Net worth')).toBeNull();
    });
  });
});

describe('net worth rows without the multichain portfolio', () => {
  it('keeps the providers on the "Net worth" row and never calls the aggregator', { timeout: TEST_TIMEOUT }, async() => {
    await withEnvs([ PROVIDERS_ENV ], async() => {
      mockAggregator(PORTFOLIO_OK);
      await renderRows(EOA_WITHOUT_TOKENS);

      expect(screen.getByText('Net worth')).toBeTruthy();
      expect(screen.getByText('Multichain')).toBeTruthy();
      expect(screen.getAllByRole('link', PROVIDER_LINK)).toHaveLength(1);
      expect(screen.queryByText('Multichain net worth')).toBeNull();
      expect(aggregatorRequests()).toEqual([]);
    });
  });

  it('hides the providers for a contract', { timeout: TEST_TIMEOUT }, async() => {
    await withEnvs([ PROVIDERS_ENV ], async() => {
      mockAggregator(PORTFOLIO_OK);
      await renderRows(addressMock.token);

      expect(screen.getByText('Net worth')).toBeTruthy();
      expect(screen.queryByRole('link', PROVIDER_LINK)).toBeNull();
    });
  });

  it('shows no net worth row at all when there is neither a chain net worth nor a provider', { timeout: TEST_TIMEOUT }, async() => {
    await withEnvs([], async() => {
      mockAggregator(PORTFOLIO_OK);
      await renderRows(EOA_WITHOUT_TOKENS);

      expect(screen.queryByText('Net worth')).toBeNull();
      expect(screen.queryByText('Multichain net worth')).toBeNull();
    });
  });
});

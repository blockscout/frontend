// SPDX-License-Identifier: LicenseRef-Blockscout
// @vitest-environment jsdom

import React from 'react';

import * as addressParamMock from 'src/slices/address/mocks/address-param';

import { chainA, chainB } from 'src/features/multichain/mocks/chains';

import { CLUSTER_CONFIG_SCRIPT_URL } from 'src/shared/external-chains/cluster-config';

import { SECOND } from 'src/toolkit/utils/consts';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, screen, waitFor } from 'vitest/lib';
import withEnvs from 'vitest/utils/mockEnvs';
import { buildRouterMock } from 'vitest/utils/mockRouter';

type Env = [ string, string ];

const AGGREGATOR_HOST = 'https://aggregator.example.com';
const MULTICHAIN_PORTFOLIO_ENVS: Array<Env> = [
  [ 'NEXT_PUBLIC_MULTICHAIN_AGGREGATOR_API_HOST', AGGREGATOR_HOST ],
  [ 'NEXT_PUBLIC_MULTICHAIN_CLUSTER', 'test' ],
];
const CLUSTER_CONFIG = { chains: [ chainA, chainB ] };

// every test re-imports the address tokens view (withEnvs resets modules), which is slow on a CI runner
const TEST_TIMEOUT = 20 * SECOND;

async function renderAddressTokens(tab: string): Promise<void> {
  const { render, wrapper: TestApp } = await import('vitest/lib');
  const { 'default': AddressTokens } = await import('./AddressTokens');
  const router = buildRouterMock('/address/[hash]', `/address/${ addressParamMock.hash }?tab=${ tab }`);
  render(<TestApp router={ router }><AddressTokens/></TestApp>);
}

async function findSubTabTitles(): Promise<Array<string | null>> {
  const tabs = await screen.findAllByRole('tab');
  return [ ...new Set(tabs.map((tab) => tab.textContent)) ];
}

function selectedSubTabTitles(): Array<string | null> {
  return [ ...new Set(screen.getAllByRole('tab', { selected: true }).map((tab) => tab.textContent)) ];
}

function requestedHosts(): Array<string> {
  return fetchMock.mock.calls.map(([ input ]) => new URL(input instanceof Request ? input.url : String(input)).origin);
}

function findConfigScript(): HTMLScriptElement | null {
  return document.head.querySelector(`script[src="${ CLUSTER_CONFIG_SCRIPT_URL }"]`);
}

beforeEach(() => {
  fetchMock.resetMocks();
  fetchMock.mockResponse(() => ({ status: 404, body: '{}' }));
});

afterEach(() => {
  cleanup();
  findConfigScript()?.remove();
});

describe('address token sub-tabs with the multichain portfolio', () => {
  it('puts the portfolio first and opens it for the bare tab id', { timeout: TEST_TIMEOUT }, async() => {
    await withEnvs(MULTICHAIN_PORTFOLIO_ENVS, async() => {
      vi.stubGlobal('__multichainConfig', CLUSTER_CONFIG);
      await renderAddressTokens('tokens');

      expect(await findSubTabTitles()).toEqual([ 'Multichain portfolio', 'Tokens', 'NFTs' ]);
      expect(selectedSubTabTitles()).toEqual([ 'Multichain portfolio' ]);
      await waitFor(() => expect(requestedHosts()).toContain(AGGREGATOR_HOST));
    });
  });

  it('loads the cluster config for the portfolio and asks the aggregator only once it is there', { timeout: TEST_TIMEOUT }, async() => {
    await withEnvs(MULTICHAIN_PORTFOLIO_ENVS, async() => {
      await renderAddressTokens('tokens_multichain');

      await waitFor(() => expect(findConfigScript()).not.toBeNull());
      expect(requestedHosts()).not.toContain(AGGREGATOR_HOST);

      vi.stubGlobal('__multichainConfig', CLUSTER_CONFIG);
      findConfigScript()?.dispatchEvent(new Event('load'));

      await waitFor(() => expect(requestedHosts()).toContain(AGGREGATOR_HOST));
    });
  });

  it.each([
    [ 'tokens_erc20', 'Tokens' ],
    [ 'tokens_nfts', 'NFTs' ],
  ])('keeps %s opening its own sub-tab, without the cluster config or the aggregator', { timeout: TEST_TIMEOUT }, async(tab, title) => {
    await withEnvs(MULTICHAIN_PORTFOLIO_ENVS, async() => {
      await renderAddressTokens(tab);

      await findSubTabTitles();
      expect(selectedSubTabTitles()).toEqual([ title ]);
      expect(findConfigScript()).toBeNull();
      expect(requestedHosts()).not.toContain(AGGREGATOR_HOST);
    });
  });
});

describe('address token sub-tabs without the multichain portfolio', () => {
  it('shows Tokens and NFTs only and opens Tokens for the bare tab id', { timeout: TEST_TIMEOUT }, async() => {
    await withEnvs([], async() => {
      await renderAddressTokens('tokens');

      expect(await findSubTabTitles()).toEqual([ 'Tokens', 'NFTs' ]);
      expect(selectedSubTabTitles()).toEqual([ 'Tokens' ]);
    });
  });

  it('loads no cluster config and calls only the instance API', { timeout: TEST_TIMEOUT }, async() => {
    await withEnvs([], async() => {
      const { 'default': config } = await import('src/config');
      await renderAddressTokens('tokens');
      await findSubTabTitles();

      await waitFor(() => expect(fetchMock.mock.calls.length).toBeGreaterThan(0));
      expect(findConfigScript()).toBeNull();
      expect([ ...new Set(requestedHosts()) ]).toEqual([ config.apis.core?.endpoint ]);
    });
  });
});

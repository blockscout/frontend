// SPDX-License-Identifier: LicenseRef-Blockscout
// @vitest-environment jsdom

import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { schemas } from '@blockscout/api-types';
import type * as contractsInfo from '@blockscout/contracts-info-types';
import type { AddressMetadataInfo, AddressMetadataTagApi } from 'src/features/address-metadata/types/api';
import type { ClusterChainConfig } from 'src/features/multichain/types/client';

import type { ResourceError } from 'src/api/resources';

import { tokenInfo } from 'src/slices/token/mocks/info';

import { hiddenProtocolTagWithMeta, protocolTag, tokenActionButtonHiddenServiceTag } from 'src/features/address-metadata/mocks/tags';

import { ENVS_MAP } from 'src/config/test-utils/env-presets';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, waitFor } from 'vitest/lib';
import withEnvs from 'vitest/utils/mockEnvs';

const ENV_BUTTON_TEXT = 'Buy on Duck Portal';
const METADATA_BUTTON_TEXT = hiddenProtocolTagWithMeta.meta?.appActionButtonText as string;

const envs: Array<[ string, string ]> = [
  ...ENVS_MAP.tokenActionButton,
  [ 'NEXT_PUBLIC_METADATA_SERVICE_API_HOST', 'https://localhost:3007' ],
];

const tokenQuery = { data: tokenInfo } as UseQueryResult<schemas['Token'], ResourceError<unknown>>;
const verifiedInfoQuery = { data: {} } as UseQueryResult<contractsInfo.TokenInfo, ResourceError<unknown>>;
const addressQuery = {} as UseQueryResult<schemas['Address'], ResourceError<unknown>>;

function metadataInfo(tags: Array<AddressMetadataTagApi>): AddressMetadataInfo {
  return {
    addresses: {
      [ tokenInfo.address_hash.toLowerCase() ]: {
        tags: tags.map((tag) => ({ ...tag, meta: tag.meta ? JSON.stringify(tag.meta) : null })),
        reputation: null,
      },
    },
  };
}

function mockMetadata(tags: Array<AddressMetadataTagApi>): void {
  fetchMock.mockResponse((request) => request.url.includes('/metadata') ?
    { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(metadataInfo(tags)) } :
    { status: 404, body: '{}' },
  );
}

async function renderTitle(): Promise<void> {
  const { 'default': TokenPageTitle } = await import('./TokenPageTitle');
  render(
    <TokenPageTitle
      tokenQuery={ tokenQuery }
      addressQuery={ addressQuery }
      verifiedInfoQuery={ verifiedInfoQuery }
      hash={ tokenInfo.address_hash }
    />,
  );
  await waitFor(() => expect(fetchMock.mock.calls.length).toBeGreaterThan(0));
}

type AppConfig = ClusterChainConfig['app_config'];

async function renderTitleOnChain(getAppConfig: (rootConfig: AppConfig) => AppConfig): Promise<void> {
  const { 'default': TokenPageTitle } = await import('./TokenPageTitle');
  const { MultichainContext } = await import('src/features/multichain/context');
  const { 'default': config } = await import('src/config');

  const chain: ClusterChainConfig = {
    id: config.chain.id ?? '1',
    name: 'Cluster chain',
    slug: 'cluster-chain',
    app_config: getAppConfig(config),
  };

  render(
    <MultichainContext.Provider value={{ chain }}>
      <TokenPageTitle
        tokenQuery={ tokenQuery }
        addressQuery={ addressQuery }
        verifiedInfoQuery={ verifiedInfoQuery }
        hash={ tokenInfo.address_hash }
      />
    </MultichainContext.Provider>,
  );
}

const withChainMetadataOff = (rootConfig: AppConfig): AppConfig => ({
  ...rootConfig,
  features: {
    ...rootConfig.features,
    addressMetadata: { title: rootConfig.features.addressMetadata.title, isEnabled: false },
  },
});

const withChainMetadataOn = (rootConfig: AppConfig): AppConfig => ({
  ...rootConfig,
  chain: { ...rootConfig.chain, id: rootConfig.chain.id || '1' },
  apis: { ...rootConfig.apis, metadata: { endpoint: 'https://localhost:3007' } },
  features: {
    ...rootConfig.features,
    addressMetadata: {
      title: rootConfig.features.addressMetadata.title,
      isEnabled: true,
      isTagsUpdateEnabled: false,
      isTagSubmitionEnabled: false,
    },
  },
});

beforeEach(() => {
  fetchMock.resetMocks();
});

afterEach(() => {
  cleanup();
});

describe('token action button', () => {
  it('shows the configured button on an ERC-20 token without the blacklist tag', async() => {
    await withEnvs(envs, async() => {
      mockMetadata([ protocolTag ]);
      await renderTitle();

      expect(await screen.findByText(ENV_BUTTON_TEXT)).toBeTruthy();
      expect(screen.getByText(protocolTag.name)).toBeTruthy();
    });
  });

  it('hides the configured button when the address carries the service blacklist tag, and never shows the tag', async() => {
    await withEnvs(envs, async() => {
      mockMetadata([ protocolTag, tokenActionButtonHiddenServiceTag ]);
      await renderTitle();

      expect(await screen.findByText(protocolTag.name)).toBeTruthy();
      expect(screen.queryByText(ENV_BUTTON_TEXT)).toBeNull();
      expect(screen.queryByText(tokenActionButtonHiddenServiceTag.name)).toBeNull();
    });
  });

  it('takes precedence over the metadata-driven button', async() => {
    await withEnvs(envs, async() => {
      mockMetadata([ hiddenProtocolTagWithMeta ]);
      await renderTitle();

      expect(await screen.findByText(ENV_BUTTON_TEXT)).toBeTruthy();
      expect(screen.queryByText(METADATA_BUTTON_TEXT)).toBeNull();
    });
  });

  it('falls back to the metadata-driven button when the configured one is blacklisted', async() => {
    await withEnvs(envs, async() => {
      mockMetadata([ hiddenProtocolTagWithMeta, tokenActionButtonHiddenServiceTag ]);
      await renderTitle();

      expect(await screen.findByText(METADATA_BUTTON_TEXT)).toBeTruthy();
      expect(screen.queryByText(ENV_BUTTON_TEXT)).toBeNull();
    });
  });

  it('shows the configured button on a cluster chain whose metadata service is off', async() => {
    await withEnvs(envs, async() => {
      await renderTitleOnChain(withChainMetadataOff);

      expect(await screen.findByText(ENV_BUTTON_TEXT)).toBeTruthy();
    });
  });

  it('waits for the metadata of a cluster chain whose metadata service is on while the root one is off', async() => {
    await withEnvs(ENVS_MAP.tokenActionButton, async() => {
      let respondWithMetadata: ((body: string) => void) | undefined;
      fetchMock.mockResponse((request) => request.url.includes('/metadata') ?
        new Promise<string>((resolve) => {
          respondWithMetadata = resolve;
        }) :
        { status: 404, body: '{}' },
      );

      await renderTitleOnChain(withChainMetadataOn);
      await waitFor(() => expect(respondWithMetadata).toBeDefined());

      expect(screen.queryByText(ENV_BUTTON_TEXT)).toBeNull();

      respondWithMetadata?.(JSON.stringify(metadataInfo([ protocolTag ])));

      expect(await screen.findByText(ENV_BUTTON_TEXT)).toBeTruthy();
    });
  });
});

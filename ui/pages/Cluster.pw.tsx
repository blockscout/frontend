import { Box } from '@chakra-ui/react';
import React from 'react';

import { campNetworkClusterByName, testnetClusterByName } from 'mocks/clusters/cluster';
import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { test, expect } from 'playwright/lib';

import Cluster from './Cluster';

test.beforeEach(async({ mockEnvs, mockTextAd }) => {
  await mockEnvs(ENVS_MAP.clusters);
  await mockTextAd();
});

test.describe('Cluster Details Page', () => {
  test('mainnet cluster details +@mobile', async({ render, mockApiResponse, mockAssetResponse }) => {
    await mockAssetResponse(
      'https://cdn.clusters.xyz/profile-image/campnetwork/lol',
      './playwright/mocks/image_s.jpg',
    );
    await mockApiResponse('clusters:get_cluster_by_name', campNetworkClusterByName, {
      queryParams: {
        input: JSON.stringify({ name: 'campnetwork/lol' }),
      },
    });

    const component = await render(
      <div>
        <Box h={{ base: '134px', lg: 6 }}/>
        <Cluster/>
      </div>,
      {
        hooksConfig: {
          router: {
            query: { name: 'campnetwork/lol' },
            isReady: true,
          },
        },
      },
    );

    await expect(component.getByText('campnetwork/lol').first()).toBeVisible();
    await expect(component.getByText('Cluster Name')).toBeVisible();
    await expect(component.getByText('Owner address')).toBeVisible();
    await expect(component.getByText('Backing')).toBeVisible();

    await expect(component).toHaveScreenshot();
  });

  test('testnet cluster details +@mobile', async({ render, mockApiResponse, mockAssetResponse }) => {
    await mockAssetResponse(
      'https://cdn.clusters.xyz/profile-image/test/cluster',
      './playwright/mocks/image_s.jpg',
    );
    await mockApiResponse('clusters:get_cluster_by_name', testnetClusterByName, {
      queryParams: {
        input: JSON.stringify({ name: 'test/cluster' }),
      },
    });

    const component = await render(
      <div>
        <Box h={{ base: '134px', lg: 6 }}/>
        <Cluster/>
      </div>,
      {
        hooksConfig: {
          router: {
            query: { name: 'test/cluster' },
            isReady: true,
          },
        },
      },
    );

    await expect(component.getByText('test/cluster').first()).toBeVisible();
    await expect(component.getByText('Cluster Name')).toBeVisible();
    await expect(component.getByText('Owner address')).toBeVisible();
    await expect(component.getByText('Backing')).toBeVisible();

    await expect(component).toHaveScreenshot();
  });
});

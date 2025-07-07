import { Box } from '@chakra-ui/react';
import React from 'react';

import { campNetworkClusterByName, duckClusterByName, testnetClusterByName } from 'mocks/clusters/cluster';
import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { test, expect } from 'playwright/lib';

import Cluster from './Cluster';

test.beforeEach(async({ mockEnvs, mockTextAd }) => {
  await mockEnvs(ENVS_MAP.clusters);
  await mockTextAd();
});

test.describe('Cluster Details Page', () => {
  test('cluster details campnetwork/lol +@mobile', async({ render, page }) => {
    await page.route('**/v1/trpc/names.get*', (route) => route.fulfill({
      status: 200,
      json: campNetworkClusterByName,
    }));

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

  test('cluster details duck/quack +@mobile', async({ render, page }) => {
    await page.route('**/v1/trpc/names.get*', (route) => route.fulfill({
      status: 200,
      json: duckClusterByName,
    }));

    const component = await render(
      <div>
        <Box h={{ base: '134px', lg: 6 }}/>
        <Cluster/>
      </div>,
      {
        hooksConfig: {
          router: {
            query: { name: 'duck/quack' },
            isReady: true,
          },
        },
      },
    );

    await expect(component.getByText('duck/quack').first()).toBeVisible();
    await expect(component.getByText('Cluster Name')).toBeVisible();
    await expect(component.getByText('Owner address')).toBeVisible();
    await expect(component.getByText('Backing')).toBeVisible();

    await expect(component).toHaveScreenshot();
  });

  test('testnet cluster details +@mobile', async({ render, page }) => {
    await page.route('**/v1/trpc/names.get*', (route) => route.fulfill({
      status: 200,
      json: testnetClusterByName,
    }));

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

  test('loading state +@mobile', async({ render }) => {
    const component = await render(
      <div>
        <Box h={{ base: '134px', lg: 6 }}/>
        <Cluster/>
      </div>,
      {
        hooksConfig: {
          router: {
            query: { name: 'example.cluster' },
            isReady: true,
          },
        },
      },
    );

    await expect(component).toHaveScreenshot();
  });
});

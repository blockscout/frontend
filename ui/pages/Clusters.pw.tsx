import { Box } from '@chakra-ui/react';
import React from 'react';

import { clustersDirectoryMock, clustersDirectoryEmptyMock } from 'mocks/clusters/directory';
import { clustersLeaderboardMock } from 'mocks/clusters/leaderboard';
import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { test, expect } from 'playwright/lib';

import Clusters from './Clusters';

test.beforeEach(async({ mockEnvs, mockTextAd }) => {
  await mockEnvs(ENVS_MAP.clusters);
  await mockTextAd();
});

test.describe('Clusters Directory Page', () => {
  test('clusters directory with data @mobile', async({ render, page }) => {
    await page.route('**/v1/trpc/names.search*', (route) => {
      route.fulfill({
        status: 200,
        json: clustersDirectoryMock,
      });
    });
    await page.route('**/v1/trpc/names.leaderboard*', (route) => {
      route.fulfill({
        status: 200,
        json: clustersLeaderboardMock,
      });
    });

    const component = await render(
      <div>
        <Box h={{ base: '134px', lg: 6 }}/>
        <Clusters/>
      </div>,
    );

    await expect(component.getByText('campnetwork/lol').first()).toBeVisible();
    await expect(component.getByText('duck/quack').first()).toBeVisible();
    await expect(component.getByText('test/cluster').first()).toBeVisible();

    await expect(component).toHaveScreenshot();
  });

  test('clusters directory empty state +@mobile', async({ render, page }) => {
    await page.route('**/v1/trpc/names.search*', (route) => route.fulfill({
      status: 200,
      json: clustersDirectoryEmptyMock,
    }));
    await page.route('**/v1/trpc/names.leaderboard*', (route) => route.fulfill({
      status: 200,
      json: clustersLeaderboardMock,
    }));

    const component = await render(
      <div>
        <Box h={{ base: '134px', lg: 6 }}/>
        <Clusters/>
      </div>,
    );

    await expect(component).toHaveScreenshot();
  });

  test('loading state +@mobile', async({ render }) => {
    const component = await render(
      <div>
        <Box h={{ base: '134px', lg: 6 }}/>
        <Clusters/>
      </div>,
    );

    await expect(component).toHaveScreenshot();
  });
});

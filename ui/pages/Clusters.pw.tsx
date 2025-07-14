import { Box } from '@chakra-ui/react';
import React from 'react';

import { clustersDirectoryMock } from 'mocks/clusters/directory';
import { clustersLeaderboardMock } from 'mocks/clusters/leaderboard';
import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { test, expect } from 'playwright/lib';

import Clusters from './Clusters';

test.beforeEach(async({ mockEnvs, mockTextAd }) => {
  await mockEnvs(ENVS_MAP.clusters);
  await mockTextAd();
});

test.describe('Clusters Directory Page', () => {
  test('clusters directory with data @mobile', async({ render, page, mockAssetResponse }) => {
    await mockAssetResponse('https://cdn.clusters.xyz/profile-image/campnetwork/lol', './playwright/mocks/image_s.jpg');
    await mockAssetResponse('https://cdn.clusters.xyz/profile-image/duck/quack', './playwright/mocks/image_s.jpg');
    await mockAssetResponse('https://cdn.clusters.xyz/profile-image/test/cluster', './playwright/mocks/image_s.jpg');
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
});
